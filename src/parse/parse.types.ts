import { StyleRuleClone } from "./cloner.types";
import { FluidData } from "../index.types";

type CSSParseResult = {
  breakpoints: number[];
  fluidData: FluidData;
};

type RuleBatchState = {
  ruleBatches: RuleBatch[];
  currentRuleBatch: RuleBatch | null;
};

type RuleBatch = {
  width: number;
  rules: StyleRuleClone[];
  isMediaQuery: boolean;
};

type StyleSheetParseParams = {
  breakpoints: number[];
  globalBaselineWidth: number;
  fluidData: FluidData;
  order: number;
};

type RuleBatchesParams = Pick<
  StyleSheetParseParams,
  "breakpoints" | "fluidData" | "order"
> & {
  ruleBatches: RuleBatch[];
};

type RuleBatchParams = Pick<
  RuleBatchesParams,
  "breakpoints" | "fluidData" | "order" | "ruleBatches"
> & {
  ruleBatch: RuleBatch;
  batchIndex: number;
};

type StyleRuleParams = Pick<
  RuleBatchParams,
  "breakpoints" | "fluidData" | "ruleBatches" | "batchIndex" | "order"
> & {
  batchWidth: number;
};

type PropertyParams = Pick<
  RuleBatchParams,
  "breakpoints" | "fluidData" | "ruleBatches" | "batchIndex" | "order"
> & {
  isDynamic: boolean;
  property: string;
  minValue: string;
  selector: string;
  batchWidth: number;
};

type MatchingRuleParams = Pick<
  PropertyParams,
  | "breakpoints"
  | "fluidData"
  | "batchWidth"
  | "batchIndex"
  | "order"
  | "selector"
  | "property"
  | "minValue"
  | "isDynamic"
> & {
  maxValue: string;
  nextBatchWidth: number;
};

type MakeFluidRangeParams = Pick<
  MatchingRuleParams,
  "breakpoints" | "batchWidth" | "minValue" | "maxValue" | "nextBatchWidth"
>;
type ApplyFluidRangeParams = Pick<
  PropertyParams,
  "fluidData" | "selector" | "order" | "isDynamic" | "property"
>;
type DocStateResult = {
  newFluidData: FluidData;
  newOrder: number;
};

export {
  CSSParseResult,
  RuleBatchState,
  RuleBatch,
  StyleSheetParseParams,
  DocStateResult,
  RuleBatchesParams,
  RuleBatchParams,
  PropertyParams,
  ApplyFluidRangeParams,
  MatchingRuleParams,
  MakeFluidRangeParams,
  StyleRuleParams,
};
