import { AddElsIndexTestCase } from "../index.types";

type DocStructure = {
  [goldenId: string]: string[];
};

type MakeFluidPropertiesDoc = {
  [goldenId: string]: { [anchor: string]: string[] };
};

type AddElsEngineTestCase = Pick<AddElsIndexTestCase, "masterIndex"> & {
  els: HTMLElement[];
};

type MakeFluidPropertiesAnchorTestCase = Pick<
  AddElsIndexTestCase,
  "masterIndex"
> & {
  anchor: string;
  el: HTMLElement;
};

export {
  AddElsEngineTestCase,
  MakeFluidPropertiesAnchorTestCase,
  DocStructure,
  MakeFluidPropertiesDoc,
};
