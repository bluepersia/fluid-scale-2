import { FluidData, FluidRange } from "../../index.types";
import { StyleRuleClone } from "../cloner.types";
import {
  ApplyFluidRangeParams,
  DocStateResult,
  MakeFluidRangeParams,
  MatchingRuleParams,
  PropertyParams,
  RuleBatchesParams,
  RuleBatchParams,
  StyleRuleParams,
} from "../parse.types";
import { parseFluidValue2D } from "./fluidValueParse";

function processRuleBatches(params: RuleBatchesParams): DocStateResult {
  const { ruleBatches } = params;
  let { fluidData, order } = params;

  for (const [batchIndex, ruleBatch] of ruleBatches.entries()) {
    const { newFluidData, newOrder } = processRuleBatch({
      ...params,
      fluidData,
      order,
      batchIndex,
      ruleBatch,
    });
    fluidData = { ...fluidData, ...newFluidData };
    order = newOrder;
  }
  return {
    newFluidData: fluidData,
    newOrder: order,
  };
}

function processRuleBatch(params: RuleBatchParams): DocStateResult {
  const { ruleBatch } = params;
  let { fluidData, order } = params;
  for (const rule of ruleBatch.rules) {
    const { newFluidData, newOrder } = processStyleRule(rule, {
      ...params,
      fluidData,
      order,
      batchWidth: ruleBatch.width,
    });
    fluidData = { ...fluidData, ...newFluidData };
    order = newOrder;
  }
  return {
    newFluidData: fluidData,
    newOrder: order,
  };
}

function processStyleRule(
  rule: StyleRuleClone,
  params: StyleRuleParams
): DocStateResult {
  let { fluidData, order } = params;
  const selectors = splitSelectors(rule.selectorText);
  const isDynamic = rule.specialProperties["--dynamic"] === "true";
  for (const [property, minValue] of Object.entries(rule.style)) {
    for (const selector of selectors) {
      const newFluidData = processProperty({
        ...params,
        fluidData,
        property,
        minValue,
        selector,
        isDynamic,
      });
      fluidData = { ...fluidData, ...newFluidData };
    }
  }
  return {
    newFluidData: fluidData,
    newOrder: order + 1,
  };
}

function splitSelectors(selectors: string): string[] {
  return selectors.split(",").map((selector) => selector.trim());
}

function processProperty(params: PropertyParams): FluidData {
  const { ruleBatches, batchIndex, selector, property, minValue } = params;
  let { fluidData } = params;

  for (let i = batchIndex + 1; i < ruleBatches.length; i++) {
    const nextRuleBatch = ruleBatches[i];
    for (const nextRule of nextRuleBatch.rules) {
      if (!splitSelectors(nextRule.selectorText).includes(selector)) continue;

      const maxValue = nextRule.style[property];
      if (maxValue === minValue) continue;
      if (maxValue) {
        fluidData = {
          ...fluidData,
          ...processMatchingRule({
            ...params,
            fluidData,
            maxValue,
            nextBatchWidth: nextRuleBatch.width,
          }),
        };
      }
    }
  }
  return fluidData;
}

function processMatchingRule(params: MatchingRuleParams): FluidData {
  const { minValue, maxValue } = params;
  const fluidRange: FluidRange = makeFluidRange({
    ...params,
    minValue,
    maxValue,
  });
  return applyFluidRange(fluidRange, params);
}

function makeFluidRange(params: MakeFluidRangeParams): FluidRange {
  const { minValue, maxValue, breakpoints, batchWidth, nextBatchWidth } =
    params;
  return {
    minValue: parseFluidValue2D(minValue),
    maxValue: parseFluidValue2D(maxValue),
    minIndex: breakpoints.indexOf(batchWidth),
    maxIndex: breakpoints.indexOf(nextBatchWidth),
  };
}

function applyFluidRange(
  fluidRange: FluidRange,
  params: ApplyFluidRangeParams
): FluidData {
  const { fluidData, selector, property, order } = params;

  let isDynamic = hasDynamicPseudo(selector) || params.isDynamic;

  const baseSelector = stripDynamicPseudos(
    isDynamic ? stripClassModifiers(selector) : selector
  );
  const selectorParts = baseSelector.split(" ");
  const anchor = selectorParts[selectorParts.length - 1];
  const newFluidData = {
    ...fluidData,
    [anchor]: { ...(fluidData[anchor] || {}) },
  };

  newFluidData[anchor] = {
    ...newFluidData[anchor],
    [selector]: { ...(newFluidData[anchor][selector] || {}) },
  };

  newFluidData[anchor][selector] = {
    ...newFluidData[anchor][selector],
    [property]: {
      ...(newFluidData[anchor][selector][property] || {
        metaData: {
          property,
          order,
        },
        ranges: [],
      }),
    },
  };

  newFluidData[anchor][selector][property].ranges = [
    ...newFluidData[anchor][selector][property].ranges,
    fluidRange,
  ];

  return newFluidData;
}

function hasDynamicPseudo(selectorText: string): boolean {
  return /:(hover|focus|active|visited|disabled|checked|focus-visible|focus-within)/.test(
    selectorText
  );
}

function stripClassModifiers(selectorText: string): string {
  return (
    selectorText
      // remove BEM modifiers (--something)
      .replace(/--[a-zA-Z0-9_-]+/g, "")
      // collapse chained classes: keep the first .class, drop the following .others
      .replace(/(\.[a-zA-Z0-9_-]+)(?:\.[a-zA-Z0-9_-]+)+/g, "$1")
      .trim()
  );
}

function stripDynamicPseudos(selectorText: string): string {
  return selectorText
    .replace(
      /:(hover|focus|active|visited|disabled|checked|focus-visible|focus-within)/g,
      ""
    )
    .trim();
}

export {
  processRuleBatches,
  processRuleBatch,
  processStyleRule,
  processProperty,
  processMatchingRule,
  makeFluidRange,
  applyFluidRange,
  splitSelectors,
  stripClassModifiers,
  stripDynamicPseudos,
};
