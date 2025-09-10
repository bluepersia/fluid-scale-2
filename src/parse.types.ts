import { RuleClone, StyleRuleClone } from "./clone.types";

type ParseCSSResult = {
  breakpoints: number[];
};

type MediaRule = RuleClone & {
  type: 4;
  minWidth: number;
  rules: StyleRuleClone[];
};

type StyleBatch = {
  width: number;
  rules: StyleRuleClone[];
  isMediaQuery: boolean;
};

type StyleBatchState = {
  styleBatches: StyleBatch[];
  currentStyleRuleBatch: StyleBatch | null;
};
export { ParseCSSResult, MediaRule, StyleBatch, StyleBatchState };
