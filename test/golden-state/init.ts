import { chromium } from "playwright";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { generateJSDOMDocument } from "../../src/parse/json-builder";

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

async function initPlaywrightPage({
  htmlFilePath,
  addCss,
}: {
  htmlFilePath: string;
  addCss: string[];
}) {
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
  await page.evaluate(() => {
    // @ts-expect-error global from IIFE bundle
    window.cloneDocument = window.FluidScale.cloneDocument;

    // @ts-expect-error global from IIFE bundle
    window.addElements = window.FluidScale.addElements;

    // @ts-expect-error global from IIFE bundle
    window.getAllEls = window.FluidScale.getAllEls;

    // @ts-expect-error global from IIFE bundle
    window.makeFluidPropertiesFromAnchor =
      window.FluidScale.makeFluidPropertiesFromAnchor;

    // @ts-expect-error global from IIFE bundle
    window.makeExpectedDocStructure =
      window.FluidScale.makeExpectedDocStructure;

    // @ts-expect-error global from IIFE bundle
    window.addElementsIndex = window.FluidScale.addElementsIndex;

    // @ts-expect-error global from IIFE bundle
    window.getState = window.FluidScale.getState;

    // @ts-expect-error global from IIFE bundle
    window.initEngineState = window.FluidScale.initEngineState;

    // @ts-expect-error global from IIFE bundle
    window.init = window.FluidScale.init;
  });

  return { page, browser };
}

export { realProjectsData, JSDOMDocs, initPlaywrightPage, PlaywrightBlueprint };
