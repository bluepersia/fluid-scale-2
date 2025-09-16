import { build } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entry = path.resolve(__dirname, "../src/cloner.ts");
const outfile = path.resolve(__dirname, "../dist/cloner.bundle.js");

await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  format: "iife",
  globalName: "FluidScale",
  target: "es2020",
  platform: "browser",
  sourcemap: false,
  treeShaking: true,
});

console.log("Built bundle:", outfile);
