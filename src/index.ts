import { cloneDocument, FLUID_PROPERTY_NAMES } from "./clone";

function init() {
  const documentClone = cloneDocument(document, FLUID_PROPERTY_NAMES);
}
