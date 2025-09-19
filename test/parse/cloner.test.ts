import { describe, test, it, expect, beforeAll, afterAll } from "vitest";
import {
  cloneMediaRule,
  cloneStyleRule,
  handleShorthand,
} from "../../src/parse/cloner";
import {
  cloneStyleRuleTests as cloneStyleRuleTestsEauDeParfum,
  cloneMediaRuleTests as cloneMediaRuleTestsEauDeParfum,
  cloneMediaRuleUnitTests as cloneMediaRuleUnitTestsEauDeParfum,
  shortHandTests as shortHandTestsEauDeParfum,
} from "../golden-state/eau-de-parfum/parse/cloner";
import eauDeParfumMaster from "../golden-state/eau-de-parfum/master";
import {
  initPlaywrightPages,
  teardownPlaywrightPages,
} from "../golden-state/vitest.init";
import { PlaywrightPage } from "../index.types";

const masters = [eauDeParfumMaster];

let playwrightPages: PlaywrightPage[];
beforeAll(async () => {
  playwrightPages = await initPlaywrightPages();
});

afterAll(async () => {
  await teardownPlaywrightPages(playwrightPages);
});
describe(
  "cloneDocument",
  () => {
    test.each(masters)(
      "should clone the browser document",
      async ({ index, docClone }) => {
        const { page } = playwrightPages[index];
        const clonedDocument = await page.evaluate(() => {
          // @ts-expect-error injected global
          window.resetState();

          // @ts-expect-error injected global
          return window.cloneDocument(document);
        });

        expect(clonedDocument).toEqual(docClone);
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
