import {
  AddElsEngineTestCase,
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

export { makeRuntimeTestCases };
