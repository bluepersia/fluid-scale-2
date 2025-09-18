import { IFluidProperty } from "./engine/index.types";

type FluidRange = {
  minValue: FluidValue[][];
  maxValue: FluidValue[][];
  minIndex: number;
  maxIndex: number;
};

type FluidValue = {};
type FluidValueSingle = {
  value: number;
  unit: string;
};

type FluidData = {
  [anchor: string]: {
    [selector: string]: {
      [property: string]: {
        metaData: FluidPropertyMetaData;
        ranges: FluidRange[];
      };
    };
  };
};

type FluidPropertyMetaData = {
  order: number;
  property: string;
};

type ElWState = {
  el: HTMLElement;
  fluidProperties: IFluidProperty[];
};

export type {
  FluidRange,
  FluidValue,
  FluidValueSingle,
  FluidPropertyMetaData,
  FluidData,
  ElWState,
};
