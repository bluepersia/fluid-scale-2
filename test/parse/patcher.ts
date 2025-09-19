import { FluidRange } from "../../src/index.types";
import { countStyleRules } from "../utils";
import {
  ApplyFluidRangeTestCase,
  FluidRangeTestCase,
  MatchingRuleTestCase,
  MaxValueMap,
  ParseStyleSheetTestCase,
  ProcessPropertyTestCase,
  RuleBatchesTestCase,
  RuleBatchTestCase,
  StyleRuleTestCase,
} from "./index.types";

function makeRuleBatchesTests(
  prevTests: ParseStyleSheetTestCase[]
): RuleBatchesTestCase[] {
  return prevTests.map((testCase, sheetIndex) => {
    return {
      ruleBatches:
        testCase.master.batchedStructure.styleSheets[sheetIndex].batches,
      ...testCase,
    };
  });
}

function makeRuleBatchTests(
  prevTests: RuleBatchesTestCase[]
): RuleBatchTestCase[] {
  const ruleBatchTests: RuleBatchTestCase[] = [];
  for (const testCase of prevTests) {
    let order = testCase.order;
    ruleBatchTests.push(
      ...testCase.ruleBatches.map((ruleBatch, batchIndex) => {
        const nextOrder = order + countStyleRules(ruleBatch.rules);
        const batchTestCase = {
          ...testCase,
          order,
          nextOrder,
          ruleBatch,
          batchIndex,
        };
        order = nextOrder;
        return batchTestCase;
      })
    );
  }
  return ruleBatchTests;
}

function makeStyleRuleTests(
  prevTests: RuleBatchTestCase[]
): StyleRuleTestCase[] {
  const styleRuleTests: StyleRuleTestCase[] = [];

  for (const testCase of prevTests) {
    let order = testCase.order;
    styleRuleTests.push(
      ...testCase.ruleBatch.rules.map((rule) => {
        const nextOrder = order + 1;

        const styleRuleTestCase = {
          ...testCase,
          order,
          nextOrder,
          rule,
          batchWidth: testCase.ruleBatch.width,
        };
        order = nextOrder;
        return styleRuleTestCase;
      })
    );
  }
  return styleRuleTests;
}

function makeProcessPropertyTests(
  prevTests: StyleRuleTestCase[]
): ProcessPropertyTestCase[] {
  const propertyTests: ProcessPropertyTestCase[] = [];

  for (const testCase of prevTests) {
    const { rule } = testCase;
    const selectors = rule.selectorText.split(",").map((sel) => sel.trim());

    for (const selector of selectors) {
      for (const [property, minValue] of Object.entries(rule.style)) {
        propertyTests.push({
          ...testCase,
          minValue,
          isDynamic: rule.specialProperties["--dynamic"] !== undefined,
          property,
          selector,
        });
      }
    }
  }
  return propertyTests;
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

function makeMatchingRuleTests(
  prevTests: ProcessPropertyTestCase[],
  maxValueMap: MaxValueMap
): MatchingRuleTestCase[] {
  const matchingRuleTests: MatchingRuleTestCase[] = [];

  for (const testCase of prevTests) {
    const key = makeRuleKey(testCase);

    if (maxValueMap.has(key)) {
      const maxValueData = maxValueMap.get(key)!;

      matchingRuleTests.push({
        ...testCase,
        ...maxValueData,
      });
    }
  }

  return matchingRuleTests;
}

function makeMakeFluidRangeTests(
  prevTests: MatchingRuleTestCase[],
  fluidRangeMap: Map<string, FluidRange>
): FluidRangeTestCase[] {
  const makeFluidRangeTests: FluidRangeTestCase[] = [];

  for (const testCase of prevTests) {
    const key = makeRuleKey(testCase);

    if (fluidRangeMap.has(key)) {
      makeFluidRangeTests.push({ ...testCase, range: fluidRangeMap.get(key)! });
    }
  }

  return makeFluidRangeTests;
}

function makeApplyFluidRangeTests(
  prevTests: MatchingRuleTestCase[],
  fluidRangeMap: Map<string, FluidRange>
): ApplyFluidRangeTestCase[] {
  const applyFluidRangeTests: ApplyFluidRangeTestCase[] = [];

  for (const testCase of prevTests) {
    const key = makeRuleKey(testCase);

    if (fluidRangeMap.has(key))
      applyFluidRangeTests.push({
        ...testCase,
        range: fluidRangeMap.get(key)!,
      });
  }

  return applyFluidRangeTests;
}
export {
  makeRuleBatchesTests,
  makeRuleBatchTests,
  makeStyleRuleTests,
  makeProcessPropertyTests,
  makeMatchingRuleTests,
  makeMakeFluidRangeTests,
  makeApplyFluidRangeTests,
};
