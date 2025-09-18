import docClone from "./parse/docClone";
import { batchedStructure } from "./parse/batchedStructure";
import fluidData from "./parse/parserResult";
import { realProjectsData } from "../init";
import {
  doc as engineDoc,
  allIds as allIdsEngine,
  makeFluidPropertiesDoc,
} from "./engine/doc";
import { Master } from "../../index.types";

const master: Master = {
  docClone,
  breakpoints: [375, 600],
  globalBaselineWidth: 375,
  batchedStructure,
  fluidData,
  playwrightBlueprint: realProjectsData[0],
  engineDoc,
  allIdsEngine,
  makeFluidPropertiesDoc,
};

export default master;
