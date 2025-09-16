import { DocumentClone, MediaRuleClone } from "./cloner.types";
import { CSSParseResult } from "./parse.types";

const STYLE_RULE_TYPE = 1;
const MEDIA_RULE_TYPE = 4;

function parseCSS(docClone: DocumentClone): CSSParseResult {
  const { breakpoints } = initDocument(docClone);

  return {
    breakpoints: Array.from(breakpoints),
  };
}

function initDocument(docClone: DocumentClone): {
  breakpoints: number[];
  globalBaselineWidth: number;
} {
  let breakpoints: Set<number> = new Set();
  let globalBaselineWidth: number = 375;

  for (const stylesheet of docClone.stylesheets) {
    for (const rule of stylesheet.cssRules) {
      if (rule.type === MEDIA_RULE_TYPE) {
        const { minWidth, cssRules } = rule as MediaRuleClone;
        breakpoints.add(minWidth);
        if (cssRules.length === 0) globalBaselineWidth = minWidth;
      }
    }
  }

  return {
    breakpoints: Array.from(breakpoints),
    globalBaselineWidth,
  };
}

export { STYLE_RULE_TYPE, MEDIA_RULE_TYPE, parseCSS, initDocument };
