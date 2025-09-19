type DocumentClone = {
  styleSheets: StylesheetClone[];
};

type StylesheetClone = {
  cssRules: RuleClone[];
};

type RuleClone = {
  type: 1 | 4;
};

type StyleRuleClone = RuleClone & {
  type: 1;
  selectorText: string;
  style: Record<string, string>;
  specialProperties: Record<string, string>;
};

type MediaRuleClone = RuleClone & {
  type: 4;
  minWidth: number;
  cssRules: StyleRuleClone[];
};

export type {
  DocumentClone,
  StylesheetClone,
  RuleClone,
  StyleRuleClone,
  MediaRuleClone,
};
