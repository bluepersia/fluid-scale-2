import { Browser, Page } from "playwright";
import { FluidData } from "../src/index.types";
import { DocumentClone } from "../src/parse/cloner.types";
import {
  DocStructure,
  MakeFluidPropertiesDoc,
} from "./golden-state/runtime/engine/index.types";
import { BatchedStructure } from "./parse/index.types";
import { RunTimeTestCaseCounter } from "./golden-state/runtime/index.types";

type PlaywrightPage = {
  page: Page;
  browser: Browser;
  runtimeTestCaseCounter: RunTimeTestCaseCounter;
};

type Master = {
  docClone: DocumentClone;
  breakpoints: number[];
  globalBaselineWidth: number;
  batchedStructure: BatchedStructure;
  fluidData: FluidData;
  index: number;
  engineDoc: DocStructure;
};

export { Master, PlaywrightPage };
