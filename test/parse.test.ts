import { describe, test, expect } from "vitest";
import {
  parseCSS,
  initDocument,
  getStyleSheetBaselineWidth,
} from "../src/parse";
import eauDeParfumDocClone from "./golden-state/eau-de-parfum/docClone";
import { StylesheetClone } from "../src/cloner.types";

const parseCSSTests = [
  {
    docClone: eauDeParfumDocClone,
    expected: { breakpoints: [375, 600] },
  },
];

describe("parseCSS", () => {
  test.each(parseCSSTests)("should parse the CSS", ({ docClone, expected }) => {
    const result = parseCSS(docClone);
    expect(result).toEqual(expected);
  });
});

const perpareDocTests = [
  {
    docClone: eauDeParfumDocClone,
    expected: { breakpoints: [375, 600], globalBaselineWidth: 375 },
  },
];

describe("initDocument", () => {
  test.each(perpareDocTests)(
    "should prepare the document",
    ({ docClone, expected }) => {
      const result = initDocument(docClone);
      expect(result).toEqual(expected);
    }
  );
});

const stylesheetBaselineTests = [
  {
    styleSheet: eauDeParfumDocClone.stylesheets[0],
    globalBaselineWidth: 375,
    expected: 375,
  },
  {
    styleSheet: eauDeParfumDocClone.stylesheets[2],
    globalBaselineWidth: 375,
    expected: 375,
  },
  {
    styleSheet: {
      cssRules: [
        {
          type: 4,
          minWidth: 600,
          cssRules: [],
        },
      ],
    },
    globalBaselineWidth: 375,
    expected: 600,
  },
];

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
