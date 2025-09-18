import { FluidData } from "../src/index.types";
import { DocumentClone, StyleRuleClone } from "../src/parse/cloner.types";
import {
  DocStructure,
  MakeFluidPropertiesDoc,
} from "./golden-state/engine/index.types";
import { PlaywrightBlueprint } from "./golden-state/init";
import { BatchedStructure } from "./parse/index.types";

type Master = {
  docClone: DocumentClone;
  breakpoints: number[];
  globalBaselineWidth: number;
  batchedStructure: BatchedStructure;
  fluidData: FluidData;
  playwrightBlueprint: PlaywrightBlueprint;
  engineDoc: DocStructure;
  allIdsEngine: string[];
  makeFluidPropertiesDoc: MakeFluidPropertiesDoc;
};

export { Master };
