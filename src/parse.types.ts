import { RuleClone, StyleRuleClone } from "./clone.types";

type ParseCSSResult = {
  breakpoints: number[];
};

type MediaRule = RuleClone & {
  type: 4;
  minWidth: number;
  rules: StyleRuleClone[];
};

export { ParseCSSResult, MediaRule };
