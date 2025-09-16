import {
  DocumentClone,
  StylesheetClone,
  StyleRuleClone,
  MediaRuleClone,
} from "./cloner.types";
import { STYLE_RULE_TYPE, MEDIA_RULE_TYPE } from "./parse";

const FLUID_PROPERTY_NAMES = [
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
];

const SHORTHAND_PROPERTIES: {
  [shorthand: string]: Map<number, Map<number, string[]>>;
} = {
  padding: new Map([
    [
      1,
      new Map([
        [0, ["padding-top", "padding-right", "padding-bottom", "padding-left"]],
      ]),
    ],
    [
      2,
      new Map([
        [0, ["padding-top", "padding-bottom"]],
        [1, ["padding-right", "padding-left"]],
      ]),
    ],
    [
      3,
      new Map([
        [0, ["padding-top"]],
        [1, ["padding-right", "padding-left"]],
        [2, ["padding-bottom"]],
      ]),
    ],
    [
      4,
      new Map([
        [0, ["padding-top"]],
        [1, ["padding-right"]],
        [2, ["padding-bottom"]],
        [3, ["padding-left"]],
      ]),
    ],
  ]),
  margin: new Map([
    [
      1,
      new Map([
        [0, ["margin-top", "margin-right", "margin-bottom", "margin-left"]],
      ]),
    ],
    [
      2,
      new Map([
        [0, ["margin-top", "margin-bottom"]],
        [1, ["margin-right", "margin-left"]],
      ]),
    ],
    [
      3,
      new Map([
        [0, ["margin-top"]],
        [1, ["margin-right", "margin-left"]],
        [2, ["margin-bottom"]],
      ]),
    ],
    [
      4,
      new Map([
        [0, ["margin-top"]],
        [1, ["margin-right"]],
        [2, ["margin-bottom"]],
        [3, ["margin-left"]],
      ]),
    ],
  ]),
  "border-radius": new Map([
    [
      1,
      new Map([
        [
          0,
          [
            "border-top-left-radius",
            "border-top-right-radius",
            "border-bottom-right-radius",
            "border-bottom-left-radius",
          ],
        ],
      ]),
    ],
    [
      2,
      new Map([
        [0, ["border-top-left-radius", "border-bottom-right-radius"]],
        [1, ["border-top-right-radius", "border-bottom-left-radius"]],
      ]),
    ],
    [
      3,
      new Map([
        [0, ["border-top-left-radius"]],
        [1, ["border-top-right-radius", "border-bottom-left-radius"]],
        [2, ["border-bottom-right-radius"]],
      ]),
    ],
    [
      4,
      new Map([
        [0, ["border-top-left-radius"]],
        [1, ["border-top-right-radius"]],
        [2, ["border-bottom-right-radius"]],
        [3, ["border-bottom-left-radius"]],
      ]),
    ],
  ]),
  gap: new Map([[1, new Map([[0, ["column-gap", "row-gap"]]])]]),
  "background-position": new Map([
    [2, new Map([[0, ["background-position-x", "background-position-y"]]])],
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
  ["border-top-left-radius", "border-radius"],
  ["border-top-right-radius", "border-radius"],
  ["border-bottom-right-radius", "border-radius"],
  ["border-bottom-left-radius", "border-radius"],
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
  const shorthandCache: Map<string, Record<string, string>> = new Map();
  for (const property of FLUID_PROPERTY_NAMES) {
    const propertyValue = styleRule.style.getPropertyValue(property);

    if (!propertyValue) {
      if (explicitProps.has(property)) {
        const shorthandName = explicitProps.get(property) as string;
        let shorthand = shorthandCache.get(shorthandName);
        if (!shorthand) {
          shorthand = handleShorthand(shorthandName, propertyValue);
          shorthandCache.set(shorthandName, shorthand);
        }
        style[property] = shorthand[property];
      }
      continue;
    }

    style[property] = propertyValue;
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
    for (const [index, explicitProps] of explicitData.entries()) {
      for (const explicitProp of explicitProps) {
        style[explicitProp] = values[index];
      }
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

export {
  cloneDocument,
  cloneStylesheet,
  cloneStyleRule,
  cloneMediaRule,
  handleShorthand,
};
