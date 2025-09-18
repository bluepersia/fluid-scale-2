import { describe, test, expect } from "vitest";
import { init } from "../src/index";
import eauDeParfumMaster from "./golden-state/eau-de-parfum/master";
import { initPlaywrightPage } from "./golden-state/init";

const masters = [eauDeParfumMaster];

describe("init", () => {
  test.each(masters)(
    "should init the engine",
    async ({ playwrightBlueprint, engineDoc }) => {
      const { page, browser } = await initPlaywrightPage(playwrightBlueprint);

      const result = await page.evaluate(() => {
        // @ts-expect-error injected global
        window.init();

        // @ts-expect-error injected global
        const globalState = window.getState();
        // @ts-expect-error injected global
        return window.makeExpectedDocStructure([
          ...globalState.allEls.values(),
        ]);
      });

      expect(result).toEqual(engineDoc);
      await page.close();
      await browser.close();
    }
  );
});

describe("addElements", () => {
  test.each(masters)(
    "should add elements to the engine",
    async ({ playwrightBlueprint, engineDoc, fluidData, breakpoints }) => {
      const { page, browser } = await initPlaywrightPage(playwrightBlueprint);

      const result = await page.evaluate(
        ({ fluidData, breakpoints }) => {
          // @ts-expect-error injected global
          const allEls = window.getAllEls();

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
      await page.close();
      await browser.close();
    }
  );
});
