import { describe, test, expect } from "vitest";
import {
  applyFluidRange,
  makeFluidRange,
  processMatchingRule,
  processProperty,
  processRuleBatch,
  processRuleBatches,
  processStyleRule,
  splitSelectors,
} from "../src/parse/patcher";
import {
  ruleBatchesTests as eauDeParfumRuleBatchesTests,
  ruleBatchTests as eauDeParfumRuleBatchTests,
  styleRuleTests as eauDeParfumStyleRuleTests,
  propertyTests as eauDeParfumPropertyTests,
  matchingRuleTests as eauDeParfumMatchingRuleTests,
  makeFluidRangeTests as eauDeParfumMakeFluidRangeTests,
  applyFluidRangeTests as eauDeParfumApplyFluidRangeTests,
} from "./golden-state/eau-de-parfum/patcher";

const splitSelectorsTests = [
  {
    selectors: ".product-card__price--actual, .product-card__price--original",
    expected: [
      ".product-card__price--actual",
      ".product-card__price--original",
    ],
  },
  {
    selectors: ".product-card__price--actual",
    expected: [".product-card__price--actual"],
  },
];

describe("splitSelectors", () => {
  test.each(splitSelectorsTests)(
    "should split selectors",
    (propertyExpectations) => {
      const { selectors, expected } = propertyExpectations;

      const result = splitSelectors(selectors);

      expect(result).toEqual(expected);
    }
  );
});

const ruleBatchesTests = [...eauDeParfumRuleBatchesTests];

describe("processRuleBatches", () => {
  test.each(ruleBatchesTests)("should process rule batches", (testCase) => {
    const { fluidData, breakpoints, ruleBatches, order, nextOrder } = testCase;

    const { newFluidData, newOrder } = processRuleBatches({
      breakpoints,
      ruleBatches,
      order,
      fluidData: {},
    });

    expect(fluidData).toMatchObject(newFluidData);
    expect(nextOrder).toEqual(newOrder);
  });
});

const ruleBatchTests = [...eauDeParfumRuleBatchTests];

describe("processRuleBatch", () => {
  test.each(ruleBatchTests)("should process the rule batch", (testCase) => {
    const { fluidData, nextOrder } = testCase;

    const { newFluidData, newOrder } = processRuleBatch({
      ...testCase,
      fluidData: {},
    });

    expect(fluidData).toMatchObject(newFluidData);
    expect(nextOrder).toEqual(newOrder);
  });
});

const styleRuleTests = [...eauDeParfumStyleRuleTests];

describe("processStyleRule", () => {
  test.each(styleRuleTests)("should process style rule", (testCase) => {
    const { rule, fluidData, nextOrder } = testCase;

    const { newFluidData, newOrder } = processStyleRule(rule, {
      ...testCase,
      fluidData: {},
    });

    expect(fluidData).toMatchObject(newFluidData);
    expect(nextOrder).toEqual(newOrder);
  });
});

const propertyTests = [...eauDeParfumPropertyTests];

describe("processProperty", () => {
  test.each(propertyTests)("should process a property", (testCase) => {
    const newFluidData = processProperty({
      ...testCase,
      fluidData: {},
    });

    const { fluidData } = testCase;

    expect(fluidData).toMatchObject(newFluidData);
  });
});

const matchingRuleTests = [...eauDeParfumMatchingRuleTests];

describe("processMatchingRule", () => {
  test.each(matchingRuleTests)("should process matching rules", (testCase) => {
    const newFluidData = processMatchingRule({ ...testCase, fluidData: {} });

    const { fluidData } = testCase;

    expect(fluidData).toMatchObject(newFluidData);
  });
});

const makeFluidRangeTests = [...eauDeParfumMakeFluidRangeTests];

describe("makeFluidRange", () => {
  test.each(makeFluidRangeTests)("should make a fluid range", (testCase) => {
    const { range } = testCase;

    const result = makeFluidRange(testCase);

    expect(result).toEqual(range);
  });
});

const applyFluidRangeTests = [...eauDeParfumApplyFluidRangeTests];

describe("applyFluidRange", () => {
  test.each(applyFluidRangeTests)("should apply a fluid range", (testCase) => {
    const { range, fluidData } = testCase;

    const result = applyFluidRange(range, { ...testCase, fluidData: {} });

    expect(fluidData).toMatchObject(result);
  });
});
