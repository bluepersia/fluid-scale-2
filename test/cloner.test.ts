import { describe, test, expect } from "vitest";
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

      const clonedDocument = await page.evaluate(() => {
        // window.cloneDocument is injected in setup
        // @ts-expect-error injected global
        return window.cloneDocument(document);
      });

      expect(clonedDocument).toMatchObject(docClone);
    }
  );
});
