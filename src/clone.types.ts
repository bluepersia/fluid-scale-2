type DocumentClone = {
  styleSheets: StyleSheetClone[];
};

type StyleSheetClone = {
  rules: RuleClone[];
};

type RuleClone = {
  type: 1 | 4;
};

type StyleRuleClone = RuleClone & {
  type: 1;
  selector: string;
  style: {
    [key: string]: string;
  };
};

type MediaRuleClone = RuleClone & {
  type: 4;
  media: { mediaText: string };
  rules: StyleRuleClone[];
};

export type {
  DocumentClone,
  StyleSheetClone,
  RuleClone,
  StyleRuleClone,
  MediaRuleClone,
};
