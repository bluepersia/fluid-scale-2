import { FluidData, FluidRange } from "../../src/index.types";
import { StyleRuleClone, StylesheetClone } from "../../src/parse/cloner.types";
import {
  ApplyFluidRangeParams,
  MakeFluidRangeParams,
  MatchingRuleParams,
  PropertyParams,
  RuleBatch,
  RuleBatchParams,
  StyleRuleParams,
} from "../../src/parse/parse.types";
import { Master } from "../index.types";

type ParseStyleSheetsTestCase = {
  sheets: StylesheetClone[];
  breakpoints: number[];
  globalBaselineWidth: number;
  fluidData: FluidData;
  master: Master;
};

type ParseStyleSheetTestCase = Pick<
  ParseStyleSheetsTestCase,
  "breakpoints" | "globalBaselineWidth" | "fluidData" | "master"
> & {
  sheet: StylesheetClone;
  order: number;
  nextOrder: number;
};

type BatchedStructure = {
  styleSheets: {
    batches: RuleBatch[];
  }[];
};

type RuleBatchesTestCase = Pick<
  ParseStyleSheetTestCase,
  "breakpoints" | "fluidData" | "master" | "order" | "nextOrder"
> & {
  ruleBatches: RuleBatch[];
};

type RuleBatchTestCase = RuleBatchParams & {
  nextOrder: number;
};
type StyleRuleTestCase = StyleRuleParams & {
  rule: StyleRuleClone;
  nextOrder: number;
};
type ProcessPropertyTestCase = PropertyParams & {
  rule: StyleRuleClone;
};
type MatchingRuleTestCase = MatchingRuleParams;

type MaxValueMap = Map<
  string,
  Pick<MatchingRuleParams, "maxValue" | "nextBatchWidth">
>;

type FluidRangeTestCase = MakeFluidRangeParams & {
  range: FluidRange;
};
type ApplyFluidRangeTestCase = ApplyFluidRangeParams & {
  range: FluidRange;
};
export type {
  BatchedStructure,
  RuleBatchTestCase,
  StyleRuleTestCase,
  ProcessPropertyTestCase,
  MatchingRuleTestCase,
  FluidRangeTestCase,
  ApplyFluidRangeTestCase,
  MaxValueMap,
  ParseStyleSheetsTestCase,
  ParseStyleSheetTestCase,
  RuleBatchesTestCase,
};
