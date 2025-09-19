import { ElWState } from "./src/index.types";
import { DocStructure } from "./test/golden-state/runtime/engine/index.types";
export { cloneDocument } from "./src/parse/cloner";
export { addElements, initEngineState, resetState } from "./src/engine";
export { getAllEls, addElements as addElementsIndex, init } from "./src/index";
export { makeFluidPropertiesFromAnchor, getState } from "./src/engine";
export { makeRuntimeTestCases } from "./test/golden-state/eau-de-parfum/runtime";

export function makeExpectedDocStructure(elsWState: ElWState[]): DocStructure {
  const docStructure: DocStructure = {};

  for (const elWState of elsWState) {
    docStructure[elWState.el.dataset.goldenId!] = elWState.fluidProperties.map(
      (property) => property.metaData.property
    );
  }

  return docStructure;
}
