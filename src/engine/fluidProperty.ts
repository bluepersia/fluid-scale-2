import { FluidPropertyMetaData, FluidRange } from "../index.types";
import { IFluidProperty } from "./index.types";

class FluidProperty implements IFluidProperty {
  metaData: FluidPropertyMetaData;
  ranges: (FluidRange | null)[];

  constructor(metaData: FluidPropertyMetaData, ranges: (FluidRange | null)[]) {
    this.metaData = metaData;
    this.ranges = ranges;
  }
}

export { FluidProperty };
