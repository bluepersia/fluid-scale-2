import { describe, test, it, expect } from "vitest";
import { JSDOMDocs, playwrightPages } from "./golden-state/init";
import eauDeParfumDocClone from "./golden-state/eau-de-parfum/docClone";
import { cloneMediaRule, cloneStyleRule, handleShorthand } from "../src/cloner";
import { MediaRuleClone, StyleRuleClone } from "../src/cloner.types";

const docClones = [eauDeParfumDocClone].map((docClone, index) => ({
  index,
  docClone,
}));

describe("cloneDocument", () => {
  test.each(docClones)(
    "should clone the browser document",
    async ({ index, docClone }) => {
      const page = playwrightPages[index];

      const clonedDocument = await page.evaluate(() => {
        // window.cloneDocument is injected in setup
        // @ts-expect-error injected global
        return window.cloneDocument(document);
      });

      expect(clonedDocument).toMatchObject(docClone);
    }
  );
});

const cloneStyleRuleTests = [
  ...Array.from(JSDOMDocs[0].styleSheets[0].cssRules)
    .filter((rule) => rule.type === 1)
    .map((rule, index) => {
      return {
        styleRule: rule as CSSStyleRule,
        expected: eauDeParfumDocClone.stylesheets[0].cssRules[index],
      };
    }),
];

describe("cloneStyleRule", () => {
  test.each(cloneStyleRuleTests)(
    "should clone the style rule",
    ({ styleRule, expected }) => {
      const result = cloneStyleRule(styleRule);
      expect(result).toMatchObject(expected);
    }
  );
});

const cloneMediaRuleTests = [
  {
    mediaRule: Array.from(JSDOMDocs[0].styleSheets[0].cssRules).find(
      (rule) => rule.type === 4
    ) as CSSMediaRule,
    expected: eauDeParfumDocClone.stylesheets[0].cssRules.find(
      (rule) => rule.type === 4
    )!,
  },
  {
    mediaRule: Array.from(JSDOMDocs[0].styleSheets[2].cssRules).find(
      (rule) => rule.type === 4
    ) as CSSMediaRule,
    expected: eauDeParfumDocClone.stylesheets[2].cssRules.find(
      (rule) => rule.type === 4
    )!,
  },
];

describe("cloneMediaRule", () => {
  test.each(cloneMediaRuleTests)(
    "should clone the media rule",
    ({ mediaRule, expected }) => {
      const result = cloneMediaRule(mediaRule);
      expect(result).toMatchObject(expected);
    }
  );
});

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

describe("cloneMediaRule", () => {
  test.each(cloneMediaRuleUnitTests)(
    "should clone the media rule",
    ({ mediaRule, expected }) => {
      const result = cloneMediaRule(mediaRule as any);
      expect(result).toEqual(expected);
    }
  );
});

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

describe("handleShorthand", () => {
  test.each(shortHandTests)(
    "should handle the shorthand",
    ({ property, propertyValue, expected }) => {
      const result = handleShorthand(property, propertyValue);
      expect(result).toEqual(expected);
    }
  );
});
