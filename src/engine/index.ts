import { ElWState, FluidData } from "../index.types";
import { FluidProperty } from "./fluidProperty";
import { GlobalState, IFluidProperty } from "./index.types";

const state: GlobalState = {
  breakpoints: [],
  allEls: new Map(),
  fluidData: {},
};

function getState() {
  return { ...state };
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
  allEls: Map<HTMLElement, ElWState>,
  fluidData: FluidData
): ElWState[] {
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
        ...makeFluidPropertiesFromAnchor(`.${klass}`, el, fluidData)
      );
    }

    if (el.id)
      fluidProperties.push(
        ...makeFluidPropertiesFromAnchor(`#${el.id}`, el, fluidData)
      );

    fluidProperties.push(
      ...makeFluidPropertiesFromAnchor(el.tagName.toLowerCase(), el, fluidData)
    );

    if (fluidProperties.length <= 0) continue;

    toAdd.push(elAdd);
  }

  return toAdd;
}

function makeFluidPropertiesFromAnchor(
  anchor: string,
  el: HTMLElement,
  fluidData: FluidData
): IFluidProperty[] {
  const anchorData = fluidData[anchor];

  if (!anchorData) return [];

  const fluidProperties: IFluidProperty[] = [];

  for (const selector of Object.keys(anchorData)) {
    if (!el.matches(selector)) continue;

    const selectorData = anchorData[selector];

    for (const propertyData of Object.values(selectorData)) {
      const fluidProperty = new FluidProperty(
        propertyData.metaData,
        propertyData.ranges
      );
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
};
