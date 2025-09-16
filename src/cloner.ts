import {
  DocumentClone,
  StylesheetClone,
  StyleRuleClone,
  MediaRuleClone,
} from "./cloner.types";
import { STYLE_RULE_TYPE, MEDIA_RULE_TYPE } from "./parse";

const FLUID_PROPERTY_NAMES = new Set<string>([
  "font-size",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-indent",
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "grid-template-columns",
  "grid-template-rows",
  "background-position-x",
  "background-position-y",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-right-radius",
  "border-bottom-left-radius",
  "column-gap",
  "row-gap",
  "--fluid-bg-size",
  "top",
  "left",
  "right",
  "bottom",
]);

const SHORTHAND_PROPERTIES: {
  [shorthand: string]: Map<number, Map<number, string>>;
} = {
  padding: new Map([
    [
      1,
      new Map([
        [0, "paddingTop"],
        [0, "paddingRight"],
        [0, "paddingBottom"],
        [0, "paddingLeft"],
      ]),
    ],
    [
      2,
      new Map([
        [0, "paddingTop"],
        [1, "paddingRight"],
        [0, "paddingBottom"],
        [1, "paddingLeft"],
      ]),
    ],
    [
      3,
      new Map([
        [0, "paddingTop"],
        [1, "paddingRight"],
        [2, "paddingBottom"],
        [1, "paddingLeft"],
      ]),
    ],
    [
      4,
      new Map([
        [0, "paddingTop"],
        [1, "paddingRight"],
        [2, "paddingBottom"],
        [3, "paddingLeft"],
      ]),
    ],
  ]),
  margin: new Map([
    [
      1,
      new Map([
        [0, "marginTop"],
        [0, "marginRight"],
        [0, "marginBottom"],
        [0, "marginLeft"],
      ]),
    ],
    [
      2,
      new Map([
        [0, "marginTop"],
        [1, "marginRight"],
        [0, "marginBottom"],
        [1, "marginLeft"],
      ]),
    ],
    [
      3,
      new Map([
        [0, "marginTop"],
        [1, "marginRight"],
        [2, "marginBottom"],
        [1, "marginLeft"],
      ]),
    ],
    [
      4,
      new Map([
        [0, "marginTop"],
        [1, "marginRight"],
        [2, "marginBottom"],
        [3, "marginLeft"],
      ]),
    ],
  ]),
  borderRadius: new Map([
    [
      1,
      new Map([
        [0, "borderTopLeftRadius"],
        [0, "borderTopRightRadius"],
        [0, "borderBottomRightRadius"],
        [0, "borderBottomLeftRadius"],
      ]),
    ],
    [
      2,
      new Map([
        [0, "borderTopLeftRadius"],
        [1, "borderTopRightRadius"],
        [0, "borderBottomRightRadius"],
        [1, "borderBottomLeftRadius"],
      ]),
    ],
    [
      3,
      new Map([
        [0, "borderTopLeftRadius"],
        [1, "borderTopRightRadius"],
        [2, "borderBottomRightRadius"],
        [1, "borderBottomLeftRadius"],
      ]),
    ],
    [
      4,
      new Map([
        [0, "borderTopLeftRadius"],
        [1, "borderTopRightRadius"],
        [2, "borderBottomRightRadius"],
        [3, "borderBottomLeftRadius"],
      ]),
    ],
  ]),
  gap: new Map([
    [
      1,
      new Map([
        [0, "columnGap"],
        [0, "rowGap"],
      ]),
    ],
  ]),
  "background-position": new Map([
    [
      2,
      new Map([
        [0, "background-position-x"],
        [0, "background-position-y"],
      ]),
    ],
  ]),
};

const explicitProps = new Map<string, string>([
  ["padding-top", "padding"],
  ["padding-right", "padding"],
  ["padding-bottom", "padding"],
  ["padding-left", "padding"],
  ["margin-top", "margin"],
  ["margin-right", "margin"],
  ["margin-bottom", "margin"],
  ["margin-left", "margin"],
  ["border-top-left-radius", "borderRadius"],
  ["border-top-right-radius", "borderRadius"],
  ["border-bottom-right-radius", "borderRadius"],
  ["border-bottom-left-radius", "borderRadius"],
  ["column-gap", "gap"],
  ["row-gap", "gap"],
  ["background-position-x", "background-position"],
  ["background-position-y", "background-position"],
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
    if (explicitProps.has(property)) {
      const shorthandValue = styleRule.style.getPropertyValue(
        explicitProps.get(property) as string
      );
      if (shorthandValue) continue;
    }

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
