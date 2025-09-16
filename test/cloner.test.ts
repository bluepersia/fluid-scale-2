import { describe, test, expect } from "vitest";
import { cloneDocument } from "../src/cloner";
import { playwrightPages } from "./golden-state/init";
import eauDeParfumDocClone from "./golden-state/eau-de-parfum/docClone";

const docClones = [eauDeParfumDocClone].map((docClone, index) => ({
  index,
  docClone,
}));

describe("cloneDocument", () => {
  test.each(docClones)(
    "should clone the document",
    async ({ index, docClone }) => {
      const page = playwrightPages[index];

      const clonedDocument = await page.evaluate(
        async ({ cloneDocument }) => {
          const clonedDocument = cloneDocument(document);
          return clonedDocument;
        },
        { cloneDocument }
      );

      expect(clonedDocument).toEqual(docClone);
    }
  );
});
