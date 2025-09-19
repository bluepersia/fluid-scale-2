import { AddElsIndexTestCase } from "../../../runtime/index.types";
import {
  AddElsEngineTestCase,
  MakeFluidPropertiesAnchorTestCase,
} from "../../../runtime/engine/index.types";

function makeAddElsEngineTestCase(
  addElsIndexTestCase: AddElsIndexTestCase
): AddElsEngineTestCase {
  return {
    els: addElsIndexTestCase.allEls.filter((el) => el instanceof HTMLElement),
    masterIndex: addElsIndexTestCase.masterIndex,
  };
}

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
      });
    }

    if (el.id) {
      testCases.push({
        anchor: `#${el.id}`,
        el,
        masterIndex: addElsTestCase.masterIndex,
      });
    }

    testCases.push({
      anchor: el.tagName.toLowerCase(),
      el,
      masterIndex: addElsTestCase.masterIndex,
    });
  }

  return testCases;
}

export { makeAddElsEngineTestCase, makeMakeFluidPropertiesAnchorTestCases };
