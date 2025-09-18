import { FluidValue } from "../../index.types";

function parseFluidValue2D(value: string): FluidValue[][] {
  let depth = 0;
  let currentValue = "";
  let values: FluidValue[][] = [];
  for (const char of value) {
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === "," && depth === 0) {
      values.push(parseFluidValue1D(currentValue));
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  values.push(parseFluidValue1D(currentValue));
  return values;
}

function parseFluidValue1D(value: string): FluidValue[] {
  let depth = 0;
  let currentValue = "";
  let values: FluidValue[] = [];

  for (const char of value) {
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === " " && depth === 0) {
      values.push(parseFluidValue(currentValue));
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  values.push(parseFluidValue(currentValue));
  return values;
}

function parseFluidValue(strValue: string): FluidValue {
  const value = parseFloat(strValue);

  // Match any alphabetic characters after the number
  const match = strValue.match(/[a-z%]+$/i);
  const unit = match?.[0] || "px";

  return {
    value,
    unit,
  };
}

export { parseFluidValue2D, parseFluidValue1D, parseFluidValue };
