import { FluidPropertyMetaData, FluidRange } from "../index.types";
import { IFluidProperty } from "./index.types";

class FluidProperty implements IFluidProperty {
  metaData: FluidPropertyMetaData;
  ranges: FluidRange[];

  constructor(metaData: FluidPropertyMetaData, ranges: FluidRange[]) {
    this.metaData = metaData;
    this.ranges = ranges;
  }
}

export { FluidProperty };
