import {
  DocumentClone,
  MediaRuleClone,
  RuleClone,
  StyleRuleClone,
  StyleSheetClone,
} from "./clone.types";
import {
  MediaRule,
  ParseCSSResult,
  StyleBatch,
  StyleBatchState,
} from "./parse.types";

/** We need to parse the CSS document to provide the data that the engine consumes to interpolate.
 * 1) Unique set of breakpoints
 * 2) FluidData - the min/max data for breakpoints/ranges
 * We start by setting up the document state.
 * Baseline width can be set globally or per style sheet. Empty media rules are useless, so we assume these represent the baseline.
 */

function parseCSS(documentClone: DocumentClone): ParseCSSResult {
  let breakpoints = new Set<number>();
  let baselineWidth = 375;
  let order = 0;
  let fluidData = {};

  for (const sheet of documentClone.styleSheets) {
    sheet.rules = processMediaRules(sheet.rules);
    sheet.rules
      .filter((rule) => rule.type === 4)
      .forEach((rule) => {
        const mediaRule = rule as MediaRule;
        breakpoints.add(mediaRule.minWidth);
        if (mediaRule.rules.length === 0) baselineWidth = mediaRule.minWidth;
      });
  }

  return { breakpoints: [...breakpoints] };
}

function processMediaRules(rules: RuleClone[]): RuleClone[] {
  return rules
    .map((rule) => {
      if (rule.type === 1) return rule as StyleRuleClone;
      if (rule.type === 4) {
        const mediaRule = rule as MediaRuleClone;
        // Regex explanation: matches (min-width: <number>px)
        const match = mediaRule.media.mediaText.match(
          /\(min-width:\s*(\d+)px\)/
        );
        if (match) {
          const minWidth = Number(match[1]);
          return {
            type: 4,
            minWidth,
            rules: mediaRule.rules,
          } as MediaRule;
        }
      }
      return null;
    })
    .filter((rule) => rule !== null);
}

function parseStyleSheet(sheet: StyleSheetClone, globalBaselineWidth: number) {
  const baselineMediaRule = sheet.rules.find(
    (rule) => rule.type === 4 && (rule as MediaRule).rules.length === 0
  ) as MediaRule;

  const baselineWidth = baselineMediaRule?.minWidth || globalBaselineWidth;

  const batches = batchStyleSheet(sheet.rules, baselineWidth);
}

/** We will batch the stylesheets and each style rule will retain the cascading order naturally.
 * Most people set up their media queries right underneath the respective baseline rules.
 * Therefore we store whether a rule is a media query,
 * and we cancel maxValue search when we reach a non-media rule batch.
 */

function batchStyleSheet(rules: RuleClone[], baselineWidth: number) {
  const batchState: StyleBatchState = {
    styleBatches: [],
    currentStyleRuleBatch: null,
  };

  for (const rule of rules) {
    if (rule.type === 1) {
      batchState.currentStyleRuleBatch = getCurrentStyleRuleBatch(
        batchState,
        baselineWidth
      );
      batchState.currentStyleRuleBatch.rules.push(rule as StyleRuleClone);
    } else if (rule.type === 4) {
      batchState.currentStyleRuleBatch = null;
      batchState.styleBatches.push(newMediaRuleBatch(rule as MediaRule));
    }
  }
  return batchState.styleBatches;
}

function getCurrentStyleRuleBatch(
  batchState: StyleBatchState,
  baselineWidth: number
): StyleBatch {
  return (
    batchState.currentStyleRuleBatch ||
    ({
      width: baselineWidth,
      rules: [],
      isMediaQuery: false,
    } as StyleBatch)
  );
}

function newMediaRuleBatch(mediaRule: MediaRule): StyleBatch {
  return {
    width: mediaRule.minWidth,
    rules: mediaRule.rules,
    isMediaQuery: true,
  };
}
