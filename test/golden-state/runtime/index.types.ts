import {
  AddElsEngineTestCase,
  MakeFluidPropertiesAnchorTestCase,
} from "./engine/index.types";

type WindowGlobals = {
  runtimeTestCases: RuntimeTestCases;
};

type RuntimeTestCases = {
  addElsIndex: AddElsIndexTestCase;
  addElsEngine: AddElsEngineTestCase;
  makeFluidPropertiesAnchor: MakeFluidPropertiesAnchorTestCase[];
};

type RunTimeTestCaseCounter = {
  makeFluidPropertiesAnchor: number;
};

type AddElsIndexTestCase = {
  allEls: Node[];
  masterIndex: number;
};

export {
  RuntimeTestCases,
  AddElsIndexTestCase,
  WindowGlobals,
  RunTimeTestCaseCounter,
};
