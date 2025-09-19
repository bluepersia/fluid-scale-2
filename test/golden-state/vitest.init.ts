import { Browser, chromium, Page } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import { generateJSDOMDocument } from "../../src/parse/json-builder";
import { RunTimeTestCaseCounter } from "./runtime/index.types";

console.log("init.ts loaded");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type PlaywrightBlueprint = {
  htmlFilePath: string;
  addCss: string[];
};

const realProjectsData: PlaywrightBlueprint[] = [
  {
    htmlFilePath: "eau-de-parfum",
    addCss: ["css/global.css", "css/utils.css", "css/product-card.css"],
  },
];

const JSDOMDocs = realProjectsData.map(({ htmlFilePath }) => {
  const finalPath = path.resolve(__dirname, htmlFilePath, "index.html");
  return generateJSDOMDocument([finalPath]);
});

let playwrightPages: Promise<
  {
    page: Page;
    browser: Browser;
    runtimeTestCaseCounter: RunTimeTestCaseCounter;
  }[]
>;

async function setup() {
  playwrightPages = Promise.all(
    realProjectsData.map(async ({ htmlFilePath, addCss }, index) => {
      const finalPath = path.resolve(__dirname, htmlFilePath, "index.html");
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto(`file://${finalPath}`);

      for (const css of addCss) {
        const cssPath = path.resolve(__dirname, htmlFilePath, css);
        await page.addStyleTag({ path: cssPath });
      }

      // Inject the IIFE bundle and expose cloneDocument on window for tests
      const clonerBundlePath = path.resolve(__dirname, "../../dist/bundle.js");
      await page.addScriptTag({ path: clonerBundlePath });
      const runtimeTestCaseCounter = await page.evaluate((index) => {
        // @ts-expect-error global from IIFE bundle
        window.cloneDocument = window.FluidScale.cloneDocument;

        // @ts-expect-error global from IIFE bundle
        window.addElements = window.FluidScale.addElements;

        // @ts-expect-error global from IIFE bundle
        window.getAllEls = window.FluidScale.getAllEls;

        // prettier-ignore
        // @ts-expect-error global from IIFE bundle
        window.makeFluidPropertiesFromAnchor =window.FluidScale.makeFluidPropertiesFromAnchor;

        // prettier-ignore
        // @ts-expect-error global from IIFE bundle
        window.makeExpectedDocStructure =window.FluidScale.makeExpectedDocStructure;

        // @ts-expect-error global from IIFE bundle
        window.addElementsIndex = window.FluidScale.addElementsIndex;

        // @ts-expect-error global from IIFE bundle
        window.getState = window.FluidScale.getState;

        // @ts-expect-error global from IIFE bundle
        window.initEngineState = window.FluidScale.initEngineState;

        // @ts-expect-error global from IIFE bundle
        window.init = window.FluidScale.init;

        // @ts-expect-error global from IIFE bundle
        window.resetState = window.FluidScale.resetState;

        // prettier-ignore
        // @ts-expect-error global from IIFE bundle
        const runtimeTestCases = (window.runtimeTestCases = window.FluidScale.makeRuntimeTestCases(index));

        return {
          makeFluidPropertiesAnchor:
            runtimeTestCases.makeFluidPropertiesAnchor.length,
        } as RunTimeTestCaseCounter;
      }, index);

      return { page, browser, runtimeTestCaseCounter };
    })
  );
}

async function teardown() {
  for (const { page, browser } of await playwrightPages) {
    await page.close(); // close page first
    await browser.close(); // then close browser
  }
}

export default async function () {
  await setup();
  return async () => {
    await teardown();
  };
}

await setup();

export { JSDOMDocs, PlaywrightBlueprint, playwrightPages };
