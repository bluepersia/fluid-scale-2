import {
  MediaRuleClone,
  RuleClone,
  StylesheetClone,
} from "../src/parse/cloner.types";
import { MEDIA_RULE_TYPE, STYLE_RULE_TYPE } from "../src/parse/parse";

function countStyleRules(cssRules: RuleClone[]): number {
  let count = 0;
  for (const rule of cssRules) {
    if (rule.type === STYLE_RULE_TYPE) count++;
    else if (rule.type === MEDIA_RULE_TYPE)
      count += countStyleRules((rule as MediaRuleClone).cssRules);
  }

  return count;
}

export { countStyleRules };
