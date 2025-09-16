import { chromium } from "playwright";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const realProjectsData = [
  {
    htmlFilePath: "eau-de-parfum",
    addCss: ["css/global.css", "css/utils.css", "css/product-card.css"],
  },
];

const playwrightPages = await Promise.all(
  realProjectsData.map(async ({ htmlFilePath, addCss }) => {
    const finalPath = path.resolve(__dirname, htmlFilePath, "index.html");
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`file://${finalPath}`);

    for (const css of addCss) {
      const cssPath = path.resolve(__dirname, htmlFilePath, css);
      await page.addStyleTag({ path: cssPath });
    }

    // Inject the IIFE bundle and expose cloneDocument on window for tests
    const clonerBundlePath = path.resolve(
      __dirname,
      "../../dist/cloner.bundle.js"
    );
    await page.addScriptTag({ path: clonerBundlePath });
    await page.evaluate(() => {
      // @ts-expect-error global from IIFE bundle
      window.cloneDocument = window.FluidScale.cloneDocument;
    });

    return page;
  })
);

export { playwrightPages };
