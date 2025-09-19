import {
  AddElsEngineTestCase,
  DocStructure,
  MakeFluidPropertiesAnchorTestCase,
} from "../../runtime/engine/index.types";
import {
  AddElsIndexTestCase,
  RuntimeTestCases,
} from "../../runtime/index.types";
import {
  makeAddElsEngineTestCase,
  makeMakeFluidPropertiesAnchorTestCases,
} from "./engine";

const doc: DocStructure = {
  "1": ["max-width"],
  "4": ["padding-top", "padding-right", "padding-bottom", "padding-left"],
  "5": ["margin-bottom"],
  "6": ["margin-bottom"],
  "7": ["margin-bottom"],
  "11": ["margin-top"],
};

function makeRuntimeTestCases(pageIndex: number): RuntimeTestCases {
  const addElsIndex: AddElsIndexTestCase = {
    allEls: [document.body, ...document.querySelectorAll("*")],
    masterIndex: pageIndex,
  };

  const addElsEngine: AddElsEngineTestCase =
    makeAddElsEngineTestCase(addElsIndex);
  const makeFluidPropertiesAnchor: MakeFluidPropertiesAnchorTestCase[] =
    makeMakeFluidPropertiesAnchorTestCases(addElsEngine);
  return {
    addElsIndex,
    addElsEngine,
    makeFluidPropertiesAnchor,
  };
}

export { makeRuntimeTestCases, doc };
