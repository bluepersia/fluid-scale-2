import { describe, expect, test } from "vitest";
import eauDeParfumMaster from "../golden-state/eau-de-parfum/master";
import { initPlaywrightPage } from "../golden-state/init";
import { Master } from "../index.types";

const addElsTests = [eauDeParfumMaster];

describe("addElements", () => {
  test.each(addElsTests)(
    "should add elements",
    async ({ playwrightBlueprint, engineDoc, fluidData }) => {
      const { page, browser } = await initPlaywrightPage(playwrightBlueprint);

      const elsWState = await page.evaluate(
        ({ fluidData }) => {
          //prettier-ignore
          // @ts-expect-error injected global
          const allEls = window.getAllEls().filter((el) => el instanceof HTMLElement);

          // @ts-expect-error injected global
          const elsToAdd = window.addElements(allEls, new Map(), fluidData);

          // @ts-expect-error injected global
          return window.makeExpectedDocStructure(elsToAdd);
        },
        { fluidData }
      );

      expect(elsWState).toEqual(engineDoc);

      await page.close();
      await browser.close();
    }
  );
});

const allGoldenIds = [
  ...eauDeParfumMaster.allIdsEngine.map((id) => ({
    id,
    master: eauDeParfumMaster,
  })),
];

const allAnchors: {
  id: string;
  anchor: string;
  properties: string[];
  master: Master;
}[] = [];

for (const { id, master } of allGoldenIds) {
  for (const { anchor, properties } of master.makeFluidPropertiesDoc[id] ||
    []) {
    allAnchors.push({ id, anchor, properties, master });
  }
}

describe("makeFluidPropertiesFromAnchor", () => {
  test.each(allAnchors)(
    "should make fluid properties from class",
    async ({ id, master, anchor, properties }) => {
      const { playwrightBlueprint, fluidData, makeFluidPropertiesDoc } = master;
      const { page, browser } = await initPlaywrightPage(playwrightBlueprint);

      const madeFluidProperties = await page.evaluate(
        ({ id, fluidData, anchor }) => {
          const el = document.querySelector(`[data-golden-id="${id}"]`)!;
          // @ts-expect-error injected global
          return window.makeFluidPropertiesFromAnchor(anchor, el, fluidData);
        },
        { fluidData, id, anchor }
      );

      expect(
        madeFluidProperties.map((property) => property.metaData.property)
      ).toEqual(properties);

      await page.close();
      await browser.close();
    }
  );
});
