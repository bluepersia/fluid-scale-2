import { Browser, Page } from "playwright";
import { FluidData } from "../src/index.types";
import { DocumentClone } from "../src/parse/cloner.types";
import {
  DocStructure,
  MakeFluidPropertiesDoc,
} from "./golden-state/runtime/engine/index.types";
import { BatchedStructure } from "./parse/index.types";

type Master = {
  docClone: DocumentClone;
  breakpoints: number[];
  globalBaselineWidth: number;
  batchedStructure: BatchedStructure;
  fluidData: FluidData;
  index: number;
  engineDoc: DocStructure;
  makeFluidPropertiesDoc: MakeFluidPropertiesDoc;
};

export { Master };
