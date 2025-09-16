import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

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

    return page;
  })
);

export { playwrightPages };
