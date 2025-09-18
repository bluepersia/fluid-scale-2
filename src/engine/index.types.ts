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
  ranges: FluidRange[];
};

export type { GlobalState, IFluidProperty };
