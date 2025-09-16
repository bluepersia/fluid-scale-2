import { describe, test, it, expect } from "vitest";
import { playwrightPages } from "./golden-state/init";
import eauDeParfumDocClone from "./golden-state/eau-de-parfum/docClone";
import { handleShorthand } from "../src/cloner";

const docClones = [eauDeParfumDocClone].map((docClone, index) => ({
  index,
  docClone,
}));

describe("cloneDocument", () => {
  test.each(docClones)(
    "should clone the document",
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
