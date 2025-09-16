import {
  DocumentClone,
  StylesheetClone,
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

const SHORTHAND_PROPERTIES: {
  [shorthand: string]: Map<number, Map<number, string>>;
} = {
  padding: new Map([
    [
      1,
      new Map([
        [0, "padding-top"],
        [0, "padding-right"],
        [0, "padding-bottom"],
        [0, "padding-left"],
      ]),
    ],
    [
      2,
      new Map([
        [0, "padding-top"],
        [1, "padding-right"],
        [0, "padding-bottom"],
        [1, "padding-left"],
      ]),
    ],
    [
      3,
      new Map([
        [0, "padding-top"],
        [1, "padding-right"],
        [2, "padding-bottom"],
        [1, "padding-left"],
      ]),
    ],
    [
      4,
      new Map([
        [0, "padding-top"],
        [1, "padding-right"],
        [2, "padding-bottom"],
        [3, "padding-left"],
      ]),
    ],
  ]),
  margin: new Map([
    [
      1,
      new Map([
        [0, "margin-top"],
        [0, "margin-right"],
        [0, "margin-bottom"],
        [0, "margin-left"],
      ]),
    ],
    [
      2,
      new Map([
        [0, "margin-top"],
        [1, "margin-right"],
        [0, "margin-bottom"],
        [1, "margin-left"],
      ]),
    ],
    [
      3,
      new Map([
        [0, "margin-top"],
        [1, "margin-right"],
        [2, "margin-bottom"],
        [1, "margin-left"],
      ]),
    ],
    [
      4,
      new Map([
        [0, "margin-top"],
        [1, "margin-right"],
        [2, "margin-bottom"],
        [3, "margin-left"],
      ]),
    ],
  ]),
  borderRadius: new Map([
    [
      1,
      new Map([
        [0, "border-top-left-radius"],
        [0, "border-top-right-radius"],
        [0, "border-bottom-right-radius"],
        [0, "border-bottom-left-radius"],
      ]),
    ],
    [
      2,
      new Map([
        [0, "border-top-left-radius"],
        [1, "border-top-right-radius"],
        [0, "border-bottom-right-radius"],
        [1, "border-bottom-left-radius"],
      ]),
    ],
    [
      3,
      new Map([
        [0, "border-top-left-radius"],
        [1, "border-top-right-radius"],
        [2, "border-bottom-right-radius"],
        [1, "border-bottom-left-radius"],
      ]),
    ],
    [
      4,
      new Map([
        [0, "border-top-left-radius"],
        [1, "border-top-right-radius"],
        [2, "border-bottom-right-radius"],
        [3, "border-bottom-left-radius"],
      ]),
    ],
  ]),
};

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
  return Array.from(styleSheets).filter((styleSheet) => {
    try {
      const rules = styleSheet.cssRules;
      return rules ? true : false;
    } catch (error) {
      return false;
    }
  });
}

function cloneStyleRule(styleRule: CSSStyleRule): StyleRuleClone {
  const style: Record<string, string> = {};
  for (const property of Array.from(styleRule.style)) {
    const propertyValue = styleRule.style.getPropertyValue(property);

    if (SHORTHAND_PROPERTIES[property]) {
      const shorthandStyle = handleShorthand(property, propertyValue);
      for (const [key, value] of Object.entries(shorthandStyle)) {
        style[key] = value;
      }
      continue;
    }

    if (FLUID_PROPERTY_NAMES.has(property)) {
      style[property] = propertyValue;
    }
  }
  return {
    type: STYLE_RULE_TYPE,
    selectorText: styleRule.selectorText,
    style,
    specialProperties: {},
  };
}

function handleShorthand(
  property: string,
  propertyValue: string
): Record<string, string> {
  const style: Record<string, string> = {};

  let depth = 0;
  const values: string[] = [];
  let currentValue = "";
  for (const char of propertyValue) {
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === " " && depth === 0) {
      values.push(currentValue);
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue);

  const explicitData = SHORTHAND_PROPERTIES[property].get(values.length);
  if (explicitData) {
    for (const [index, value] of explicitData.entries()) {
      style[value] = values[index];
    }
  }
  return style;
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

export { cloneDocument, cloneStylesheet, cloneStyleRule, cloneMediaRule };
