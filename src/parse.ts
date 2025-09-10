import {
  DocumentClone,
  MediaRuleClone,
  RuleClone,
  StyleRuleClone,
} from "./clone.types";
import { MediaRule, ParseCSSResult } from "./parse.types";

/** We need to parse the CSS document to provide the data that the engine consumes to interpolate.
 * 1) Unique set of breakpoints
 * 2) FluidData - the min/max data for breakpoints/ranges
 * We start by setting up the document state.
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
