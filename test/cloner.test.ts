import { describe, test, it, expect } from "vitest";
import { realProjectsData, initPlaywrightPage } from "./golden-state/init";
import eauDeParfumDocClone from "./golden-state/eau-de-parfum/docClone";
import { cloneMediaRule, cloneStyleRule, handleShorthand } from "../src/cloner";
import {
  cloneStyleRuleTests as cloneStyleRuleTestsEauDeParfum,
  cloneMediaRuleTests as cloneMediaRuleTestsEauDeParfum,
  cloneMediaRuleUnitTests as cloneMediaRuleUnitTestsEauDeParfum,
  shortHandTests as shortHandTestsEauDeParfum,
} from "./golden-state/eau-de-parfum/cloner";

const docClones = [eauDeParfumDocClone].map((docClone, index) => ({
  index,
  docClone,
}));

describe(
  "cloneDocument",
  () => {
    test.each(docClones)(
      "should clone the browser document",
      async ({ index, docClone }) => {
        const { page, browser } = await initPlaywrightPage(
          realProjectsData[index]
        );

        const clonedDocument = await page.evaluate(() => {
          // window.cloneDocument is injected in setup
          // @ts-expect-error injected global
          return window.cloneDocument(document);
        });

        expect(clonedDocument).toMatchObject(docClone);
        await page.close();
        await browser.close();
      }
    );
  },
  { timeout: 20000 }
);

const cloneStyleRuleTests = [...cloneStyleRuleTestsEauDeParfum];

describe("cloneStyleRule", () => {
  test.each(cloneStyleRuleTests)(
    "should clone the style rule",
    ({ styleRule, expected }) => {
      const result = cloneStyleRule(styleRule);
      expect(result).toMatchObject(expected);
    }
  );
});

const cloneMediaRuleTests = [...cloneMediaRuleTestsEauDeParfum];

describe("cloneMediaRule", () => {
  test.each(cloneMediaRuleTests)(
    "should clone the media rule",
    ({ mediaRule, expected }) => {
      const result = cloneMediaRule(mediaRule);
      expect(result).toMatchObject(expected);
    }
  );
});

const cloneMediaRuleUnitTests = [...cloneMediaRuleUnitTestsEauDeParfum];

describe("cloneMediaRule", () => {
  test.each(cloneMediaRuleUnitTests)(
    "should clone the media rule",
    ({ mediaRule, expected }) => {
      const result = cloneMediaRule(mediaRule as any);
      expect(result).toEqual(expected);
    }
  );
});

const shortHandTests = [...shortHandTestsEauDeParfum];

describe("handleShorthand", () => {
  test.each(shortHandTests)(
    "should handle the shorthand",
    ({ property, propertyValue, expected }) => {
      const result = handleShorthand(property, propertyValue);
      expect(result).toEqual(expected);
    }
  );
});
