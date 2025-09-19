import {
  ElWState,
  FluidData,
  FluidPropertyMetaData,
  FluidRange,
} from "../index.types";

type GlobalState = {
  breakpoints: number[];
  allEls: Map<HTMLElement, ElWState>;
  fluidData: FluidData;
};

type IFluidProperty = {
  metaData: FluidPropertyMetaData;
  ranges: (FluidRange | null)[];
};

type AddElementsParams = {
  allEls: Map<HTMLElement, ElWState>;
  fluidData: FluidData;
  breakpoints: number[];
};

type MakeFluidPropertiesFromAnchorParams = Pick<
  AddElementsParams,
  "fluidData" | "breakpoints"
>;

export type {
  GlobalState,
  IFluidProperty,
  AddElementsParams,
  MakeFluidPropertiesFromAnchorParams,
};
