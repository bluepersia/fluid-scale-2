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
    async ({ index, engineDoc, fluidData, breakpoints }) => {
      const { page } = playwrightPages[index];
      const elsWState = await page.evaluate(
        ({ fluidData, breakpoints }) => {
          // @ts-expect-error injected global
          window.resetState();

          // @ts-expect-error injected global
          window.initEngineState(breakpoints, fluidData);

          // @ts-expect-error injected global
          const globalState = window.getState();

          //prettier-ignore
          // @ts-expect-error injected global
          const allEls = window.runtimeTestCases.addElsEngine.els;

          // @ts-expect-error injected global
          const elsToAdd = window.addElements(allEls, globalState);

          // @ts-expect-error injected global
          return window.makeExpectedDocStructure(elsToAdd);
        },
        { fluidData, breakpoints }
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
          ({ fluidData, testIndex, breakpoints }) => {
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
              { fluidData, breakpoints }
            );
            return {
              fluidProperties,
              goldenId: el.dataset.goldenId!,
            };
          },
          {
            fluidData: master.fluidData,
            testIndex,
            breakpoints: master.breakpoints,
          }
        );

        const { engineDoc } = master;
        expect(engineDoc[goldenId] || []).toEqual(
          expect.arrayContaining(fluidProperties)
        );
      });
    }
  });
});
