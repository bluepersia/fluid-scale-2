import { ElWState, FluidData, FluidRange } from "../index.types";
import { FluidProperty } from "./fluidProperty";
import {
  AddElementsParams,
  GlobalState,
  IFluidProperty,
  MakeFluidPropertiesFromAnchorParams,
} from "./index.types";

let state: GlobalState = {
  breakpoints: [],
  allEls: new Map(),
  fluidData: {},
};

function getState() {
  return { ...state };
}

function newState() {
  return {
    breakpoints: [],
    allEls: new Map(),
    fluidData: {},
  };
}

function resetState() {
  state = newState();
}

function initEngineState(breakpoints: number[], fluidData: FluidData) {
  state.breakpoints = breakpoints;
  state.fluidData = fluidData;
}

function addElementToState(elWState: ElWState) {
  state.allEls.set(elWState.el, elWState);
}

function addElements(
  els: HTMLElement[],
  params: AddElementsParams
): ElWState[] {
  const { allEls } = params;
  const toAdd: ElWState[] = [];

  for (const el of els) {
    if (allEls.has(el)) {
      continue;
    }
    const elAdd: ElWState = {
      el,
      fluidProperties: [],
    };

    const { fluidProperties } = elAdd;

    const classes = el.classList;

    for (const klass of classes) {
      fluidProperties.push(
        ...makeFluidPropertiesFromAnchor(`.${klass}`, el, params)
      );
    }

    if (el.id)
      fluidProperties.push(
        ...makeFluidPropertiesFromAnchor(`#${el.id}`, el, params)
      );

    fluidProperties.push(
      ...makeFluidPropertiesFromAnchor(el.tagName.toLowerCase(), el, params)
    );

    if (fluidProperties.length <= 0) continue;

    toAdd.push(elAdd);
  }

  return toAdd;
}

function makeFluidPropertiesFromAnchor(
  anchor: string,
  el: HTMLElement,
  params: MakeFluidPropertiesFromAnchorParams
): IFluidProperty[] {
  const { fluidData, breakpoints } = params;
  const anchorData = fluidData[anchor];

  if (!anchorData) return [];

  const fluidProperties: IFluidProperty[] = [];

  for (const selector of Object.keys(anchorData)) {
    if (!el.matches(selector)) continue;

    const selectorData = anchorData[selector];

    for (const propertyData of Object.values(selectorData)) {
      const ranges: (FluidRange | null)[] = new Array(breakpoints.length).fill(
        null
      );
      for (const range of propertyData.ranges) {
        const bpIndex = range.minIndex;
        ranges[bpIndex] = range;
      }
      const fluidProperty = new FluidProperty(propertyData.metaData, ranges);
      fluidProperties.push(fluidProperty);
    }
  }

  return fluidProperties;
}

export {
  addElements,
  getState,
  initEngineState,
  makeFluidPropertiesFromAnchor,
  addElementToState,
  resetState,
};
