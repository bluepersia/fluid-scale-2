import { FluidPropertyMetaData, FluidRange } from "../../src/index.types";
import { StyleRuleClone } from "../../src/parse/cloner.types";
import { RuleBatch } from "../../src/parse/parse.types";

type BatchedStructure = {
  styleSheets: {
    batches: RuleBatch[];
  }[];
};

export type { BatchedStructure };
