import {
  DocumentClone,
  StylesheetClone,
  RuleClone,
  StyleRuleClone,
  MediaRuleClone,
} from "./cloner.types";
import { STYLE_RULE_TYPE, MEDIA_RULE_TYPE } from "./parse";

const FLUID_PROPERTY_NAMES = new Set<string>([
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "wordSpacing",
  "textIndent",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius",
  "width",
  "minWidth",
  "maxWidth",
  "height",
  "minHeight",
  "maxHeight",
  "gridTemplateColumns",
  "gridTemplateRows",
  "backgroundPositionX",
  "backgroundPositionY",
  "--fluid-bg-size",
  "top",
  "left",
  "right",
  "bottom",
  "columnGap",
  "rowGap",
]);

function cloneDocument(doc: Document): DocumentClone {
  const docClone: DocumentClone = {
    stylesheets: [],
  };

  for (const stylesheet of filterAccessibleStyleSheets(doc.styleSheets)) {
    docClone.stylesheets.push(cloneStylesheet(stylesheet));
  }
  return docClone;
}

function cloneStylesheet(stylesheet: CSSStyleSheet): StylesheetClone {
  const stylesheetClone: StylesheetClone = {
    cssRules: [],
  };

  for (const rule of Array.from(stylesheet.cssRules)) {
    if (rule.type === STYLE_RULE_TYPE) {
      stylesheetClone.cssRules.push(cloneStyleRule(rule as CSSStyleRule));
    } else if (rule.type === MEDIA_RULE_TYPE) {
      const mediaRuleClone = cloneMediaRule(rule as CSSMediaRule);
      if (mediaRuleClone) {
        stylesheetClone.cssRules.push(mediaRuleClone);
      }
    }
  }
  return stylesheetClone;
}

function filterAccessibleStyleSheets(
  styleSheets: StyleSheetList
): CSSStyleSheet[] {
  return Array.from(styleSheets).filter((stylesheet) => {
    try {
      const rules = styleSheets.cssRules;
      return rules ? true : false;
    } catch (error) {
      return false;
    }
  });
}

function cloneStyleRule(styleRule: CSSStyleRule): StyleRuleClone {
  const style: Record<string, string> = {};
  for (const property of Array.from(styleRule.style)) {
    if (FLUID_PROPERTY_NAMES.has(property)) {
      style[property] = styleRule.style.getPropertyValue(property);
    }
  }
  return {
    type: STYLE_RULE_TYPE,
    selectorText: styleRule.selectorText,
    style,
    specialProperties: {},
  };
}

function cloneMediaRule(mediaRule: CSSMediaRule): MediaRuleClone | null {
  // Regex explanation: matches (min-width: <number>px)
  const match = mediaRule.media.mediaText.match(/\(min-width:\s*(\d+)px\)/);
  if (match) {
    return {
      type: MEDIA_RULE_TYPE,
      minWidth: Number(match[1]),
      cssRules: Array.from(mediaRule.cssRules).map((rule) =>
        cloneStyleRule(rule as CSSStyleRule)
      ),
    };
  }
  return null;
}
