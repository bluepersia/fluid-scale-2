import master from "../master";
import { FluidRange } from "../../../../src/index.types";
import { countStyleRules } from "../../../utils";
import { parseStyleSheetTests } from "./parse";
import {
  RuleBatchTestCase,
  StyleRuleTestCase,
  ProcessPropertyTestCase,
  MatchingRuleTestCase,
  FluidRangeTestCase,
  ApplyFluidRangeTestCase,
  MaxValueMap,
} from "../../../parse/index.types";
import {
  makeApplyFluidRangeTests,
  makeMakeFluidRangeTests,
  makeMatchingRuleTests,
  makeProcessPropertyTests,
  makeRuleBatchesTests,
  makeRuleBatchTests,
  makeStyleRuleTests,
} from "../../../parse/patcher";

const { fluidData, breakpoints } = master;

const ruleBatchesTests = makeRuleBatchesTests(parseStyleSheetTests);

const ruleBatchTests: RuleBatchTestCase[] =
  makeRuleBatchTests(ruleBatchesTests);

const styleRuleTests: StyleRuleTestCase[] = makeStyleRuleTests(ruleBatchTests);

const propertyTests: ProcessPropertyTestCase[] =
  makeProcessPropertyTests(styleRuleTests);

const maxValueMap: MaxValueMap = new Map([
  [
    ".product-card/max-width/0",
    {
      maxValue: "42.85rem",
      nextBatchWidth: 600,
    },
  ],
  [
    ".product-card__content/padding-top/0",
    {
      maxValue: "2.28rem",
      nextBatchWidth: 600,
    },
  ],
  [
    ".product-card__content/padding-right/0",
    {
      maxValue: "2.28rem",
      nextBatchWidth: 600,
    },
  ],
  [
    ".product-card__content/padding-bottom/0",
    {
      maxValue: "2.28rem",
      nextBatchWidth: 600,
    },
  ],
  [
    ".product-card__content/padding-left/0",
    {
      maxValue: "2.28rem",
      nextBatchWidth: 600,
    },
  ],
  [
    ".product-card__category/margin-bottom/0",
    {
      maxValue: "1.42rem",
      nextBatchWidth: 600,
    },
  ],
  [
    ".product-card__title/margin-bottom/0",
    {
      maxValue: "1.71rem",
      nextBatchWidth: 600,
    },
  ],
  [
    ".product-card__description/margin-bottom/0",
    {
      maxValue: "2.07rem",
      nextBatchWidth: 600,
    },
  ],
  [
    ".product-card__button/margin-top/0",
    {
      maxValue: "2.14rem",
      nextBatchWidth: 600,
    },
  ],
]);

const matchingRuleTests: MatchingRuleTestCase[] = makeMatchingRuleTests(
  propertyTests,
  maxValueMap
);

const fluidRangeMap: Map<string, FluidRange> = new Map([
  [
    ".product-card/max-width/0",
    {
      minValue: [[{ value: 24.5, unit: "rem" }]],
      maxValue: [[{ value: 42.85, unit: "rem" }]],
      minIndex: 0,
      maxIndex: 1,
    },
  ],
  [
    ".product-card__content/padding-top/0",
    {
      minValue: [[{ value: 1.71, unit: "rem" }]],
      maxValue: [[{ value: 2.28, unit: "rem" }]],
      minIndex: 0,
      maxIndex: 1,
    },
  ],
  [
    ".product-card__content/padding-right/0",
    {
      minValue: [[{ value: 1.71, unit: "rem" }]],
      maxValue: [[{ value: 2.28, unit: "rem" }]],
      minIndex: 0,
      maxIndex: 1,
    },
  ],
  [
    ".product-card__content/padding-bottom/0",
    {
      minValue: [[{ value: 1.71, unit: "rem" }]],
      maxValue: [[{ value: 2.28, unit: "rem" }]],
      minIndex: 0,
      maxIndex: 1,
    },
  ],
  [
    ".product-card__content/padding-left/0",
    {
      minValue: [[{ value: 1.71, unit: "rem" }]],
      maxValue: [[{ value: 2.28, unit: "rem" }]],
      minIndex: 0,
      maxIndex: 1,
    },
  ],
  [
    ".product-card__category/margin-bottom/0",
    {
      minValue: [[{ value: 0.85, unit: "rem" }]],
      maxValue: [[{ value: 1.42, unit: "rem" }]],
      minIndex: 0,
      maxIndex: 1,
    },
  ],
  [
    ".product-card__title/margin-bottom/0",
    {
      minValue: [[{ value: 1.14, unit: "rem" }]],
      maxValue: [[{ value: 1.71, unit: "rem" }]],
      minIndex: 0,
      maxIndex: 1,
    },
  ],
  [
    ".product-card__description/margin-bottom/0",
    {
      minValue: [[{ value: 1.71, unit: "rem" }]],
      maxValue: [[{ value: 2.07, unit: "rem" }]],
      minIndex: 0,
      maxIndex: 1,
    },
  ],
  [
    ".product-card__button/margin-top/0",
    {
      minValue: [[{ value: 1.42, unit: "rem" }]],
      maxValue: [[{ value: 2.14, unit: "rem" }]],
      minIndex: 0,
      maxIndex: 1,
    },
  ],
]);

const makeFluidRangeTests: FluidRangeTestCase[] = makeMakeFluidRangeTests(
  matchingRuleTests,
  fluidRangeMap
);

const applyFluidRangeTests: ApplyFluidRangeTestCase[] =
  makeApplyFluidRangeTests(matchingRuleTests, fluidRangeMap);

export {
  ruleBatchesTests,
  ruleBatchTests,
  styleRuleTests,
  propertyTests,
  matchingRuleTests,
  makeFluidRangeTests,
  applyFluidRangeTests,
};
