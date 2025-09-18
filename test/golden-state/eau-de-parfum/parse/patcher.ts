import master from "../master";
import { StyleRuleClone } from "../../../../src/parse/cloner.types";
import { FluidRange } from "../../../../src/index.types";
import {
  ApplyFluidRangeParams,
  MakeFluidRangeParams,
  MatchingRuleParams,
  PropertyParams,
  RuleBatchParams,
  StyleRuleParams,
} from "../../../../src/parse/parse.types";
import { countStyleRules } from "../../../utils";
import { parseStyleSheetTests } from "./parse";

const { batchedStructure, fluidData, breakpoints } = master;

const ruleBatchesTests = parseStyleSheetTests.map((testCase, sheetIndex) => {
  return {
    ruleBatches: batchedStructure.styleSheets[sheetIndex].batches,
    order: testCase.order,
    nextOrder: testCase.nextOrder,
    breakpoints,
    fluidData,
  };
});

type RuleBatchTestCase = RuleBatchParams & {
  nextOrder: number;
};

const ruleBatchTests: RuleBatchTestCase[] = [];
for (const testCase of ruleBatchesTests) {
  let order = testCase.order;
  ruleBatchTests.push(
    ...testCase.ruleBatches.map((ruleBatch, batchIndex) => {
      const nextOrder = order + countStyleRules(ruleBatch.rules);
      const batchTestCase = {
        order,
        nextOrder,
        ruleBatch,
        ruleBatches: testCase.ruleBatches,
        batchIndex,
        breakpoints,
        fluidData,
      };
      order = nextOrder;
      return batchTestCase;
    })
  );
}

type StyleRuleTestCase = StyleRuleParams & {
  rule: StyleRuleClone;
  nextOrder: number;
};

const styleRuleTests: StyleRuleTestCase[] = [];

for (const testCase of ruleBatchTests) {
  let order = testCase.order;
  styleRuleTests.push(
    ...testCase.ruleBatch.rules.map((rule) => {
      const nextOrder = order + 1;

      const styleRuleTestCase = {
        order,
        nextOrder,
        rule,
        ruleBatches: testCase.ruleBatches,
        batchIndex: testCase.batchIndex,
        batchWidth: testCase.ruleBatch.width,
        breakpoints,
        fluidData,
      };
      order = nextOrder;
      return styleRuleTestCase;
    })
  );
}

type ProcessPropertyTestCase = PropertyParams & {
  rule: StyleRuleClone;
};

const propertyTests: ProcessPropertyTestCase[] = [];

for (const testCase of styleRuleTests) {
  const { rule } = testCase;
  const selectors = rule.selectorText.split(",").map((sel) => sel.trim());

  for (const selector of selectors) {
    for (const [property, minValue] of Object.entries(rule.style)) {
      propertyTests.push({
        ...testCase,
        minValue,
        breakpoints,
        fluidData,
        isDynamic: rule.specialProperties["--dynamic"] !== undefined,
        property,
        selector,
      });
    }
  }
}

function makeRuleKey({
  selector,
  property,
  batchIndex,
}: {
  selector: string;
  property: string;
  batchIndex: number;
}): string {
  return `${selector}/${property}/${batchIndex}`;
}

const maxValueMap: Map<
  string,
  Pick<MatchingRuleParams, "maxValue" | "nextBatchWidth">
> = new Map([
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
type MatchingRuleTestCase = MatchingRuleParams;

const matchingRuleTests: MatchingRuleTestCase[] = [];

for (const testCase of propertyTests) {
  const key = makeRuleKey(testCase);

  if (maxValueMap.has(key)) {
    const maxValueData = maxValueMap.get(key)!;

    matchingRuleTests.push({
      ...testCase,
      ...maxValueData,
    });
  }
}

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

type FluidRangeTestCase = MakeFluidRangeParams & {
  range: FluidRange;
};
const makeFluidRangeTests: FluidRangeTestCase[] = [];

for (const testCase of matchingRuleTests) {
  const key = makeRuleKey(testCase);

  if (fluidRangeMap.has(key)) {
    makeFluidRangeTests.push({ ...testCase, range: fluidRangeMap.get(key)! });
  }
}

type ApplyFluidRangeTestCase = ApplyFluidRangeParams & {
  range: FluidRange;
};
const applyFluidRangeTests: ApplyFluidRangeTestCase[] = [];

for (const testCase of matchingRuleTests) {
  const key = makeRuleKey(testCase);

  if (fluidRangeMap.has(key))
    applyFluidRangeTests.push({ ...testCase, range: fluidRangeMap.get(key)! });
}

export {
  ruleBatchesTests,
  ruleBatchTests,
  styleRuleTests,
  propertyTests,
  matchingRuleTests,
  makeFluidRangeTests,
  applyFluidRangeTests,
};
