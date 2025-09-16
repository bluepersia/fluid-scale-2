import { describe, test, expect } from "vitest";
import { parseCSS, initDocument } from "../src/parse";
import eauDeParfumDocClone from "./golden-state/eau-de-parfum/docClone";

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
