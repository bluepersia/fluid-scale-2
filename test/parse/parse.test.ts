import { describe, test, expect } from "vitest";
import {
  parseCSS,
  initDocument,
  getStyleSheetBaselineWidth,
  batchStyleRule,
  batchMediaRule,
  batchStyleSheet,
  parseStyleSheets,
  parseStyleSheet,
} from "../../src/parse/parse";
import {
  MediaRuleClone,
  StyleRuleClone,
  StylesheetClone,
} from "../../src/parse/cloner.types";
import {
  parseCSSTests as parseCSSTestsEauDeParfum,
  perpareDocTests as perpareDocTestsEauDeParfum,
  stylesheetBaselineTests as stylesheetBaselineTestsEauDeParfum,
  batchStyleRuleTest as batchStyleRuleTestEauDeParfum,
  batchMediaRuleTest as batchMediaRuleTestEauDeParfum,
  batchStyleSheetTest as batchStyleSheetTestEauDeParfum,
  parseStyleSheetsTests as parseStyleSheetsTestsEauDeParfum,
  parseStyleSheetTests as parseStyleSheetTestsEauDeParfum,
} from "../golden-state/eau-de-parfum/parse/parse";

const parseCSSTests = [...parseCSSTestsEauDeParfum];

describe("parseCSS", () => {
  test.each(parseCSSTests)("should parse the CSS", ({ docClone, expected }) => {
    const result = parseCSS(docClone);
    expect(result).toEqual(expected);
  });
});

const perpareDocTests = [...perpareDocTestsEauDeParfum];

describe("initDocument", () => {
  test.each(perpareDocTests)(
    "should prepare the document",
    ({ docClone, expected }) => {
      const result = initDocument(docClone);
      expect(result).toEqual(expected);
    }
  );
});

const stylesheetBaselineTests = [...stylesheetBaselineTestsEauDeParfum];

describe("getStyleSheetBaselineWidth", () => {
  test.each(stylesheetBaselineTests)(
    "should get the style sheet baseline width",
    ({ styleSheet, globalBaselineWidth, expected }) => {
      const result = getStyleSheetBaselineWidth(
        styleSheet as StylesheetClone,
        globalBaselineWidth
      );
      expect(result).toEqual(expected);
    }
  );
});

const batchStyleRuleTest = [...batchStyleRuleTestEauDeParfum];

describe("batchStyleRule", () => {
  test.each(batchStyleRuleTest)(
    "should batch the style rule",
    ({ styleRule, ruleBatchState, baselineWidth, expected }) => {
      const result = batchStyleRule(
        styleRule as StyleRuleClone,
        ruleBatchState,
        baselineWidth
      );
      expect(result).toEqual(expected);
    }
  );
});

const batchMediaRuleTest = [...batchMediaRuleTestEauDeParfum];

describe("batchMediaRule", () => {
  test.each(batchMediaRuleTest)(
    "should batch the media rule",
    ({ mediaRule, expected }) => {
      const result = batchMediaRule(mediaRule as MediaRuleClone, {
        ruleBatches: [],
        currentRuleBatch: {
          width: mediaRule.minWidth,
          rules: [
            { type: 1, selectorText: "", style: {}, specialProperties: {} },
          ],
          isMediaQuery: false,
        },
      });
      expect(result).toEqual(expected);
    }
  );
});

const batchStyleSheetTest = [...batchStyleSheetTestEauDeParfum];

describe("batchStyleSheet", () => {
  test.each(batchStyleSheetTest)(
    "should batch the style sheet",
    ({ styleSheet, expected }) => {
      const result = batchStyleSheet(styleSheet as StylesheetClone, 375);
      expect(result).toEqual(expected);
    }
  );
});

const parseStyleSheetsTests = [parseStyleSheetsTestsEauDeParfum];

describe("parseStyleSheets", () => {
  test.each(parseStyleSheetsTests)(
    "should parse the stylesheets",
    ({ sheets, breakpoints, globalBaselineWidth, fluidData }) => {
      const result = parseStyleSheets(sheets, breakpoints, globalBaselineWidth);

      expect(fluidData).toMatchObject(result);
    }
  );
});

const parseStyleSheetTests = [...parseStyleSheetTestsEauDeParfum];

describe("parseStyleSheet", () => {
  test.each(parseStyleSheetTests)("should parse the stylesheet", (args) => {
    const {
      sheet,
      fluidData,
      nextOrder,
      order,
      breakpoints,
      globalBaselineWidth,
    } = args;
    const { newFluidData, newOrder } = parseStyleSheet(sheet, {
      order,
      breakpoints,
      globalBaselineWidth,
      fluidData: {},
    });

    expect(fluidData).toMatchObject(newFluidData);
    expect(nextOrder).toEqual(newOrder);
  });
});
