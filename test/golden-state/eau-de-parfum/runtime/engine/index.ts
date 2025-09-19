import { AddElsIndexTestCase } from "../../../runtime/index.types";
import {
  AddElsEngineTestCase,
  MakeFluidPropertiesAnchorTestCase,
  MakeFluidPropertiesDoc,
} from "../../../runtime/engine/index.types";

function makeAddElsEngineTestCase(
  addElsIndexTestCase: AddElsIndexTestCase
): AddElsEngineTestCase {
  return {
    els: addElsIndexTestCase.allEls.filter((el) => el instanceof HTMLElement),
    masterIndex: addElsIndexTestCase.masterIndex,
  };
}

const makeFluidPropertiesFixture: MakeFluidPropertiesDoc = {
  "1": { ".product-card": ["max-width"] },
  "4": {
    ".product-card__content": [
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
    ],
  },
  "5": { ".product-card__category": ["margin-bottom"] },
  "6": { ".product-card__title": ["margin-bottom"] },
  "7": { ".product-card__description": ["margin-bottom"] },
  "11": { ".product-card__button": ["margin-top"] },
};

function makeMakeFluidPropertiesAnchorTestCases(
  addElsTestCase: AddElsEngineTestCase
): MakeFluidPropertiesAnchorTestCase[] {
  const testCases: MakeFluidPropertiesAnchorTestCase[] = [];

  for (const el of addElsTestCase.els) {
    for (const klass of el.classList) {
      testCases.push({
        anchor: `.${klass}`,
        el,
        masterIndex: addElsTestCase.masterIndex,
        fixture: makeFluidPropertiesFixture,
      });
    }

    if (el.id) {
      testCases.push({
        anchor: `#${el.id}`,
        el,
        masterIndex: addElsTestCase.masterIndex,
        fixture: makeFluidPropertiesFixture,
      });
    }

    testCases.push({
      anchor: el.tagName.toLowerCase(),
      el,
      masterIndex: addElsTestCase.masterIndex,
      fixture: makeFluidPropertiesFixture,
    });
  }

  return testCases;
}

export { makeAddElsEngineTestCase, makeMakeFluidPropertiesAnchorTestCases };
