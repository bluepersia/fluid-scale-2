import docClone from "./parse/docClone";
import { batchedStructure } from "./parse/batchedStructure";
import fluidData from "./parse/parserResult";
import { doc as engineDoc } from "./runtime/index";
import { Master } from "../../index.types";

const master: Master = {
  docClone,
  breakpoints: [375, 600],
  globalBaselineWidth: 375,
  batchedStructure,
  fluidData,
  index: 0,
  engineDoc,
};

export default master;
