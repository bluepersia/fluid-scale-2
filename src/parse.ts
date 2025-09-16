import {
  DocumentClone,
  MediaRuleClone,
  RuleClone,
  StyleRuleClone,
  StylesheetClone,
} from "./cloner.types";
import { CSSParseResult, RuleBatchState } from "./parse.types";

const STYLE_RULE_TYPE = 1;
const MEDIA_RULE_TYPE = 4;

function parseCSS(docClone: DocumentClone): CSSParseResult {
  const { breakpoints, globalBaselineWidth } = initDocument(docClone);

  parseStyleSheets(docClone, breakpoints, globalBaselineWidth);

  return {
    breakpoints,
  };
}

function initDocument(docClone: DocumentClone): {
  breakpoints: number[];
  globalBaselineWidth: number;
} {
  let breakpointsSet: Set<number> = new Set();
  let globalBaselineWidth: number = 375;

  for (const stylesheet of docClone.stylesheets) {
    for (const rule of stylesheet.cssRules) {
      if (rule.type === MEDIA_RULE_TYPE) {
        const { minWidth, cssRules } = rule as MediaRuleClone;
        breakpointsSet.add(minWidth);
        if (cssRules.length === 0) globalBaselineWidth = minWidth;
      }
    }
  }

  return {
    breakpoints: Array.from(breakpointsSet),
    globalBaselineWidth,
  };
}

function parseStyleSheets(
  docClone: DocumentClone,
  breakpoints: number[],
  globalBaselineWidth: number
) {
  for (const stylesheet of docClone.stylesheets) {
    parseStyleSheet(stylesheet, breakpoints, globalBaselineWidth);
  }
}

function parseStyleSheet(
  styleSheet: StylesheetClone,
  breakpoints: number[],
  globalBaselineWidth: number
) {
  const baselineWidth = getStyleSheetBaselineWidth(
    styleSheet,
    globalBaselineWidth
  );

  breakpoints.forEach(() => {});
  const ruleBatches = batchStyleSheet(styleSheet, baselineWidth);
  ruleBatches.forEach(() => {});
}

function getStyleSheetBaselineWidth(
  styleSheet: StylesheetClone,
  globalBaselineWidth: number
) {
  const baselineMediaRule = styleSheet.cssRules.find(
    (rule) =>
      rule.type === MEDIA_RULE_TYPE &&
      (rule as MediaRuleClone).cssRules.length === 0
  ) as MediaRuleClone | undefined;

  return baselineMediaRule?.minWidth ?? globalBaselineWidth;
}

function batchStyleSheet(styleSheet: StylesheetClone, baselineWidth: number) {
  let ruleBatchState: RuleBatchState = {
    ruleBatches: [],
    currentRuleBatch: null,
  };

  for (const rule of styleSheet.cssRules) {
    ruleBatchState = {
      ...ruleBatchState,
      ...batchRule(rule, ruleBatchState, baselineWidth),
    };
  }
  return ruleBatchState.ruleBatches;
}

function batchRule(
  rule: RuleClone,
  ruleBatchState: RuleBatchState,
  baselineWidth: number
): RuleBatchState {
  if (rule.type === STYLE_RULE_TYPE) {
    return batchStyleRule(
      rule as StyleRuleClone,
      ruleBatchState,
      baselineWidth
    );
  } else if (
    rule.type === MEDIA_RULE_TYPE &&
    (rule as MediaRuleClone).cssRules.length > 0
  ) {
    return batchMediaRule(rule as MediaRuleClone, ruleBatchState);
  }
  return ruleBatchState;
}

function batchStyleRule(
  styleRule: StyleRuleClone,
  ruleBatchState: RuleBatchState,
  baselineWidth: number
): RuleBatchState {
  const newRuleBatchState: RuleBatchState = { ...ruleBatchState };

  if (newRuleBatchState.currentRuleBatch === null) {
    newRuleBatchState.currentRuleBatch = {
      width: baselineWidth,
      rules: [styleRule],
      isMediaQuery: false,
    };
    newRuleBatchState.ruleBatches = [
      ...newRuleBatchState.ruleBatches,
      newRuleBatchState.currentRuleBatch,
    ];
  } else {
    const mutatedRuleBatch = {
      ...newRuleBatchState.currentRuleBatch,
      rules: [...newRuleBatchState.currentRuleBatch.rules, styleRule],
    };
    newRuleBatchState.currentRuleBatch = mutatedRuleBatch;
    newRuleBatchState.ruleBatches = [
      ...newRuleBatchState.ruleBatches.slice(0, -1),
      mutatedRuleBatch,
    ];
  }

  return newRuleBatchState;
}

function batchMediaRule(
  mediaRule: MediaRuleClone,
  ruleBatchState: RuleBatchState
): RuleBatchState {
  const newRuleBatchState: RuleBatchState = { ...ruleBatchState };
  newRuleBatchState.currentRuleBatch = null;
  newRuleBatchState.ruleBatches = [
    ...newRuleBatchState.ruleBatches,
    {
      width: mediaRule.minWidth,
      rules: mediaRule.cssRules,
      isMediaQuery: true,
    },
  ];
  return newRuleBatchState;
}

export {
  STYLE_RULE_TYPE,
  MEDIA_RULE_TYPE,
  parseCSS,
  initDocument,
  getStyleSheetBaselineWidth,
  batchStyleSheet,
  batchRule,
  batchStyleRule,
  batchMediaRule,
};
