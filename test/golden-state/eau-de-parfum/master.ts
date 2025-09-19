import docClone from "./parse/docClone";
import { batchedStructure } from "./parse/batchedStructure";
import fluidData from "./parse/parserResult";
import { doc as engineDoc, makeFluidPropertiesDoc } from "./runtime/engine/doc";
import { Master } from "../../index.types";

const master: Master = {
  docClone,
  breakpoints: [375, 600],
  globalBaselineWidth: 375,
  batchedStructure,
  fluidData,
  index: 0,
  engineDoc,
  makeFluidPropertiesDoc,
};

export default master;
