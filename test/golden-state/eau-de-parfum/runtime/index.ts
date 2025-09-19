import {
  AddElsEngineTestCase,
  DocStructure,
  MakeFluidPropertiesAnchorTestCase,
} from "../../runtime/engine/index.types";
import {
  AddElsIndexTestCase,
  RuntimeTestCases,
} from "../../runtime/index.types";
import {
  makeAddElsEngineTestCase,
  makeMakeFluidPropertiesAnchorTestCases,
} from "./engine";
import fluidData from "../parse/parserResult";

const doc: DocStructure = {
  "1": [fluidData[".product-card"][".product-card"]["max-width"]],
  "4": [
    fluidData[".product-card__content"][".product-card__content"][
      "padding-top"
    ],
    fluidData[".product-card__content"][".product-card__content"][
      "padding-right"
    ],
    fluidData[".product-card__content"][".product-card__content"][
      "padding-bottom"
    ],
    fluidData[".product-card__content"][".product-card__content"][
      "padding-left"
    ],
  ],
  "5": [
    fluidData[".product-card__category"][".product-card__category"][
      "margin-bottom"
    ],
  ],
  "6": [
    fluidData[".product-card__title"][".product-card__title"]["margin-bottom"],
  ],
  "7": [
    fluidData[".product-card__description"][".product-card__description"][
      "margin-bottom"
    ],
  ],
  "11": [
    fluidData[".product-card__button"][".product-card__button"]["margin-top"],
  ],
};

for (const value of Object.values(doc)) {
  for (const [index, prop] of value.entries()) {
    const propCopy = { ...prop, ranges: [...prop.ranges] };
    propCopy.ranges.push(null);
    value[index] = propCopy;
  }
}

function makeRuntimeTestCases(pageIndex: number): RuntimeTestCases {
  const addElsIndex: AddElsIndexTestCase = {
    allEls: [document.body, ...document.querySelectorAll("*")],
    masterIndex: pageIndex,
  };

  const addElsEngine: AddElsEngineTestCase =
    makeAddElsEngineTestCase(addElsIndex);
  const makeFluidPropertiesAnchor: MakeFluidPropertiesAnchorTestCase[] =
    makeMakeFluidPropertiesAnchorTestCases(addElsEngine);
  return {
    addElsIndex,
    addElsEngine,
    makeFluidPropertiesAnchor,
  };
}

export { makeRuntimeTestCases, doc };
