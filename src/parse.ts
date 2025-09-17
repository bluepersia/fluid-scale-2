import {
  DocumentClone,
  MediaRuleClone,
  RuleClone,
  StyleRuleClone,
  StylesheetClone,
} from "./cloner.types";
import { FluidData, FluidRange, FluidValue } from "./index.types";
import {
  ApplyFluidRangeParams,
  CSSParseResult,
  DocStateResult,
  MakeFluidRangeParams,
  MatchingRuleParams,
  PropertyParams,
  RuleBatchesParams,
  RuleBatchParams,
  RuleBatchState,
  StyleSheetParseParams,
} from "./parse.types";

const STYLE_RULE_TYPE = 1;
const MEDIA_RULE_TYPE = 4;

function parseCSS(docClone: DocumentClone): CSSParseResult {
  const { breakpoints, globalBaselineWidth } = initDocument(docClone);

  const fluidData = parseStyleSheets(
    docClone.stylesheets,
    breakpoints,
    globalBaselineWidth
  );

  return {
    breakpoints,
    fluidData,
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
  styleSheets: StylesheetClone[],
  breakpoints: number[],
  globalBaselineWidth: number
): FluidData {
  let fluidData: FluidData = {};
  let order: number = 0;

  for (const stylesheet of styleSheets) {
    const { newFluidData, newOrder } = parseStyleSheet(stylesheet, {
      breakpoints,
      globalBaselineWidth,
      fluidData,
      order,
    });
    fluidData = { ...fluidData, ...newFluidData };
    order = newOrder;
  }
  return fluidData;
}

function parseStyleSheet(
  styleSheet: StylesheetClone,
  params: StyleSheetParseParams
): DocStateResult {
  const baselineWidth = getStyleSheetBaselineWidth(
    styleSheet,
    params.globalBaselineWidth
  );

  const ruleBatches = batchStyleSheet(styleSheet, baselineWidth);
  return processRuleBatches({ ...params, ruleBatches });
}

function processRuleBatches(params: RuleBatchesParams): DocStateResult {
  const { ruleBatches } = params;
  let { fluidData, order } = params;

  for (const [batchIndex, ruleBatch] of ruleBatches.entries()) {
    const { newFluidData, newOrder } = processRuleBatch({
      ...params,
      batchIndex,
      ruleBatch,
    });
    fluidData = { ...fluidData, ...newFluidData };
    order = newOrder;
  }
  return {
    newFluidData: fluidData,
    newOrder: order,
  };
}

function processRuleBatch(params: RuleBatchParams): DocStateResult {
  const { ruleBatch } = params;
  let { fluidData, order } = params;
  for (const rule of ruleBatch.rules) {
    const { newFluidData, newOrder } = processStyleRule(rule, params);
    fluidData = { ...fluidData, ...newFluidData };
    order = newOrder;
  }
  return {
    newFluidData: fluidData,
    newOrder: order,
  };
}

function processStyleRule(
  rule: StyleRuleClone,
  params: RuleBatchParams
): DocStateResult {
  let { fluidData, order } = params;
  const selectors = splitSelectors(rule.selectorText);
  for (const [property, minValue] of Object.entries(rule.style)) {
    for (const selector of selectors) {
      const { newFluidData } = processProperty({
        ...params,
        property,
        minValue,
        selector,
      });
      fluidData = { ...fluidData, ...newFluidData };
    }
  }
  return {
    newFluidData: fluidData,
    newOrder: order + 1,
  };
}

function splitSelectors(selectors: string): string[] {
  return selectors.split(",").map((selector) => selector.trim());
}

function processProperty(
  params: PropertyParams
): Pick<DocStateResult, "newFluidData"> {
  const { ruleBatches, batchIndex, selector, property } = params;
  let { fluidData } = params;

  for (let i = batchIndex + 1; i < ruleBatches.length; i++) {
    const nextRuleBatch = ruleBatches[i];
    for (const nextRule of nextRuleBatch.rules) {
      if (!splitSelectors(nextRule.selectorText).includes(selector)) continue;

      const maxValue = nextRule.style[property];
      if (maxValue) {
        fluidData = {
          ...fluidData,
          ...processMatchingRule({
            ...params,
            maxValue,
            nextBatchWidth: nextRuleBatch.width,
          }),
        };
      }
    }
  }
  return {
    newFluidData: fluidData,
  };
}

function processMatchingRule(params: MatchingRuleParams): FluidData {
  const { minValue, maxValue } = params;
  const fluidRange: FluidRange = makeFluidRange({
    ...params,
    minValue,
    maxValue,
  });
  return applyFluidRange(fluidRange, params);
}

function makeFluidRange(params: MakeFluidRangeParams): FluidRange {
  const { minValue, maxValue, breakpoints, ruleBatch, nextBatchWidth } = params;
  return {
    minValue: parseFluidValue2D(minValue),
    maxValue: parseFluidValue2D(maxValue),
    minIndex: breakpoints.indexOf(ruleBatch.width),
    maxIndex: breakpoints.indexOf(nextBatchWidth),
  };
}

function applyFluidRange(
  fluidRange: FluidRange,
  params: ApplyFluidRangeParams
): FluidData {
  const { fluidData, selector, property, order } = params;

  const baseSelector = stripModifiers(selector);
  const selectorParts = baseSelector.split(" ");
  const anchor = selectorParts[selectorParts.length - 1];
  const newFluidData = {
    ...fluidData,
    [anchor]: { ...(fluidData[anchor] || {}) },
  };

  newFluidData[anchor] = {
    ...newFluidData[anchor],
    [selector]: { ...(newFluidData[anchor][selector] || {}) },
  };

  newFluidData[anchor][selector] = {
    ...newFluidData[anchor][selector],
    [property]: {
      ...(newFluidData[anchor][selector][property] || {
        metaData: {
          property,
          order,
        },
        ranges: [],
      }),
    },
  };

  newFluidData[anchor][selector][property].ranges = [
    ...newFluidData[anchor][selector][property].ranges,
    fluidRange,
  ];

  return newFluidData;
}

function stripModifiers(selectorText: string): string {
  return (
    selectorText
      // remove BEM modifiers (anything starting with `--` until next non-name char)
      .replace(/--[a-zA-Z0-9_-]+/g, "")
      // remove chained modifiers like .mod
      .replace(/\.[a-zA-Z0-9_-]+/g, "")
      // remove common dynamic pseudos
      .replace(
        /:(hover|focus|active|visited|disabled|checked|focus-visible|focus-within)/g,
        ""
      )
      .trim()
  );
}

function parseFluidValue2D(value: string): FluidValue[][] {
  let depth = 0;
  let currentValue = "";
  let values: FluidValue[][] = [];
  for (const char of value) {
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === "," && depth === 0) {
      values.push(parseFluidValue1D(currentValue));
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  values.push(parseFluidValue1D(currentValue));
  return values;
}

function parseFluidValue1D(value: string): FluidValue[] {
  let depth = 0;
  let currentValue = "";
  let values: FluidValue[] = [];

  for (const char of value) {
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === " " && depth === 0) {
      values.push(parseFluidValue(currentValue));
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  values.push(parseFluidValue(currentValue));
  return values;
}

function parseFluidValue(strValue: string): FluidValue {
  const value = parseFloat(strValue);

  // Match any alphabetic characters after the number
  const match = String(value).match(/[a-z%]+$/i);
  const unit = match?.[0] || "px";

  return {
    value,
    unit,
  };
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
  newRuleBatchState.ruleBatches = [...newRuleBatchState.ruleBatches];

  if (newRuleBatchState.currentRuleBatch === null) {
    newRuleBatchState.currentRuleBatch = {
      width: baselineWidth,
      rules: [styleRule],
      isMediaQuery: false,
    };
    newRuleBatchState.ruleBatches.push(newRuleBatchState.currentRuleBatch);
  } else {
    const mutatedRuleBatch = {
      ...newRuleBatchState.currentRuleBatch,
      rules: [...newRuleBatchState.currentRuleBatch.rules, styleRule],
    };
    newRuleBatchState.currentRuleBatch = mutatedRuleBatch;
    newRuleBatchState.ruleBatches[newRuleBatchState.ruleBatches.length - 1] =
      mutatedRuleBatch;
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
