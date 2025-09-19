import { FluidPropertyMetaData, FluidRange } from "../../../../src/index.types";
import { AddElsIndexTestCase } from "../index.types";

type DocStructure = {
  [goldenId: string]: {
    metaData: FluidPropertyMetaData;
    ranges: (FluidRange | null)[];
  }[];
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
