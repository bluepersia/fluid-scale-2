import { beforeAll, describe, expect, test } from "vitest";
import eauDeParfumMaster from "../golden-state/eau-de-parfum/master";
import { MakeFluidPropertiesAnchorTestCase } from "../golden-state/runtime/engine/index.types";
import { playwrightPages } from "../golden-state/vitest.init";
import { makeFluidPropertiesDoc } from "../golden-state/eau-de-parfum/runtime/engine/doc";
import { run } from "node:test";

const masters = [eauDeParfumMaster];

describe("addElements", () => {
  test.each(masters)(
    "should add elements",
    async ({ index, engineDoc, fluidData }) => {
      const { page } = (await playwrightPages)[index];
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

// Top-level async to fetch test counts
const pages = await playwrightPages;

describe("makeFluidPropertiesFromAnchor", () => {
  masters.forEach((master, masterIndex) => {
    const { page, runtimeTestCaseCounter } = pages[masterIndex];
    const count = runtimeTestCaseCounter.makeFluidPropertiesAnchor;

    // Only define real tests
    for (let testIndex = 0; testIndex < count; testIndex++) {
      test(`master ${masterIndex}, test ${testIndex}`, async () => {
        const { fluidProperties, goldenId, anchor } = await page.evaluate(
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
            return { fluidProperties, goldenId: el.dataset.goldenId!, anchor };
          },
          { fluidData: master.fluidData, testIndex }
        );

        expect(fluidProperties.map((p) => p.metaData.property)).toEqual(
          makeFluidPropertiesDoc[goldenId]?.[anchor] || []
        );
      });
    }
  });
});
