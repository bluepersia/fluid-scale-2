import { FluidPropertyMetaData, FluidRange } from "../src/index.types";
import { StyleRuleClone } from "../src/parse/cloner.types";
import { RuleBatch } from "../src/parse/parse.types";

type ParseResultExpectation = {
  ruleBatches: RuleBatch[];
  breakpoints: number[];
  batchWidth: number;
  nextBatchWidth: number;
  batchIndex: number;
  rule: StyleRuleClone;
  selector: string;
  baseSelector: string;
  anchor: string;
  isDynamic: boolean;
  property: string;
  minValue: string;
  metaData: FluidPropertyMetaData;
};

type MatchingParseResultExpectation = ParseResultExpectation & {
  range: FluidRange;
  maxValue: string;
};

type BatchedExpectation = {
  rule: StyleRuleClone;
  order: number;
  breakpoints: number[];
  ruleBatches: RuleBatch[];
  batchIndex: number;
  data: ParseResultExpectation[];
  batchWidth: number;
  nextBatchWidth: number;
};

export {
  ParseResultExpectation,
  MatchingParseResultExpectation,
  BatchedExpectation,
};
