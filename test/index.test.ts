import { describe, test, expect } from "vitest";
import eauDeParfumMaster from "./golden-state/eau-de-parfum/master";
import { playwrightPages } from "./golden-state/vitest.init";

const masters = [eauDeParfumMaster];

describe("init", () => {
  test.each(masters)("should init the engine", async ({ engineDoc, index }) => {
    const { page } = (await playwrightPages)[index];
    const result = await page.evaluate(() => {
      // @ts-expect-error injected global
      window.resetState();

      // @ts-expect-error injected global
      window.init();

      // @ts-expect-error injected global
      const globalState = window.getState();
      // @ts-expect-error injected global
      return window.makeExpectedDocStructure([...globalState.allEls.values()]);
    });

    expect(result).toEqual(engineDoc);
  });
});

describe("addElements", () => {
  test.each(masters)(
    "should add elements to the engine",
    async ({ index, engineDoc, fluidData, breakpoints }) => {
      const { page } = (await playwrightPages)[index];
      const result = await page.evaluate(
        ({ fluidData, breakpoints }) => {
          // @ts-expect-error injected global
          const allEls = window.runtimeTestCases.addElsIndex.allEls;

          // @ts-expect-error injected global
          window.resetState();
          // @ts-expect-error injected global
          window.initEngineState(breakpoints, fluidData);

          // @ts-expect-error injected global
          window.addElementsIndex(allEls);

          // @ts-expect-error injected global
          const globalState = window.getState();

          // @ts-expect-error injected globals
          return window.makeExpectedDocStructure([
            ...globalState.allEls.values(),
          ]);
        },
        { fluidData, breakpoints }
      );

      expect(result).toEqual(engineDoc);
    }
  );
});
