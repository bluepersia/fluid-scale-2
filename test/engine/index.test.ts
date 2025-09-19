import { afterAll, describe, expect, test } from "vitest";
import eauDeParfumMaster from "../golden-state/eau-de-parfum/master";

import {
  initPlaywrightPages,
  teardownPlaywrightPages,
} from "../golden-state/vitest.init";
import { run } from "node:test";
import { PlaywrightPage } from "../index.types";

const masters = [eauDeParfumMaster];

const playwrightPages: PlaywrightPage[] = await initPlaywrightPages();

afterAll(async () => {
  await teardownPlaywrightPages(playwrightPages);
});

describe("addElements", () => {
  test.each(masters)(
    "should add elements",
    async ({ index, engineDoc, fluidData }) => {
      const { page } = playwrightPages[index];
      const elsWState = await page.evaluate(
        ({ fluidData }) => {
          //prettier-ignore
          // @ts-expect-error injected global
          const allEls = window.runtimeTestCases.addElsEngine.els;

          // @ts-expect-error injected global
          const elsToAdd = window.addElements(allEls, new Map(), fluidData);

          // @ts-expect-error injected global
          return window.makeExpectedDocStructure(elsToAdd);
        },
        { fluidData }
      );

      expect(elsWState).toEqual(engineDoc);
    }
  );
});

describe("makeFluidPropertiesFromAnchor", () => {
  masters.forEach((master, masterIndex) => {
    const { page, runtimeTestCaseCounter } = playwrightPages[masterIndex];
    const count = runtimeTestCaseCounter.makeFluidPropertiesAnchor;

    // Only define real tests
    for (let testIndex = 0; testIndex < count; testIndex++) {
      test(`master ${masterIndex}, test ${testIndex}`, async () => {
        const { fluidProperties, goldenId } = await page.evaluate(
          ({ fluidData, testIndex }) => {
            // @ts-expect-error injected global
            window.resetState();

            //prettier-ignore
            // @ts-expect-error injected global
            const { el, anchor } = window.runtimeTestCases.makeFluidPropertiesAnchor[testIndex];

            //prettier-ignore
            // @ts-expect-error injected global
            const fluidProperties = window.makeFluidPropertiesFromAnchor(
              anchor,
              el,
              fluidData
            );
            return {
              fluidProperties,
              goldenId: el.dataset.goldenId!,
            };
          },
          { fluidData: master.fluidData, testIndex }
        );

        const { engineDoc } = master;
        expect(engineDoc[goldenId] || []).toEqual(
          expect.arrayContaining(
            fluidProperties.map((p) => p.metaData.property)
          )
        );
      });
    }
  });
});
