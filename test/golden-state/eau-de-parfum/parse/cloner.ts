import { JSDOMDocs } from "../../init";
import eauDeParfumDocClone from "./docClone";

const cloneStyleRuleTests = [
  ...Array.from(JSDOMDocs[0].styleSheets[0].cssRules)
    .filter((rule) => rule.type === 1)
    .map((rule, index) => {
      return {
        styleRule: rule as CSSStyleRule,
        expected: eauDeParfumDocClone.styleSheets[0].cssRules[index],
      };
    }),
];

const cloneMediaRuleTests = [
  {
    mediaRule: Array.from(JSDOMDocs[0].styleSheets[0].cssRules).find(
      (rule) => rule.type === 4
    ) as CSSMediaRule,
    expected: eauDeParfumDocClone.styleSheets[0].cssRules.find(
      (rule) => rule.type === 4
    )!,
  },
  {
    mediaRule: Array.from(JSDOMDocs[0].styleSheets[2].cssRules).find(
      (rule) => rule.type === 4
    ) as CSSMediaRule,
    expected: eauDeParfumDocClone.styleSheets[2].cssRules.find(
      (rule) => rule.type === 4
    )!,
  },
];

const cloneMediaRuleUnitTests = [
  {
    mediaRule: {
      media: {
        mediaText: "(max-width: 600px)",
      },
      cssRules: [] as CSSRule[],
    },
    expected: null,
  },
  {
    mediaRule: {
      media: {
        mediaText: "(min-width: 600px and max-width: 1000px)",
      },
      cssRules: [] as CSSRule[],
    },
    expected: null,
  },
];

const shortHandTests = [
  {
    property: "padding",
    propertyValue: "10px 20px 30px 40px",
    expected: {
      "padding-top": "10px",
      "padding-right": "20px",
      "padding-bottom": "30px",
      "padding-left": "40px",
    },
  },
  {
    property: "margin",
    propertyValue: "10px 20px 30px",
    expected: {
      "margin-top": "10px",
      "margin-right": "20px",
      "margin-left": "20px",
      "margin-bottom": "30px",
    },
  },
  {
    property: "border-radius",
    propertyValue: "10px 20px",
    expected: {
      "border-top-left-radius": "10px",
      "border-top-right-radius": "20px",
      "border-bottom-right-radius": "10px",
      "border-bottom-left-radius": "20px",
    },
  },
];

export {
  cloneStyleRuleTests,
  cloneMediaRuleTests,
  cloneMediaRuleUnitTests,
  shortHandTests,
};
