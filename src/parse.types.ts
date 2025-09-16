import { StyleRuleClone } from "./cloner.types";

type CSSParseResult = {
  breakpoints: number[];
};

type RuleBatchState = {
  ruleBatches: RuleBatch[];
  currentRuleBatch: RuleBatch | null;
};

type RuleBatch = {
  width: number;
  rules: StyleRuleClone[];
  isMediaQuery: boolean;
};

export { CSSParseResult, RuleBatchState, RuleBatch };
