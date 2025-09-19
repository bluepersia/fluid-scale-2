import {
  DocStructure,
  MakeFluidPropertiesDoc,
} from "../../../runtime/engine/index.types";

const doc: DocStructure = {
  "1": ["max-width"],
  "4": ["padding-top", "padding-right", "padding-bottom", "padding-left"],
  "5": ["margin-bottom"],
  "6": ["margin-bottom"],
  "7": ["margin-bottom"],
  "11": ["margin-top"],
};

const makeFluidPropertiesDoc: MakeFluidPropertiesDoc = {
  "1": { ".product-card": ["max-width"] },
  "4": {
    ".product-card__content": [
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
    ],
  },
  "5": { ".product-card__category": ["margin-bottom"] },
  "6": { ".product-card__title": ["margin-bottom"] },
  "7": { ".product-card__description": ["margin-bottom"] },
  "11": { ".product-card__button": ["margin-top"] },
};

export { doc, makeFluidPropertiesDoc };
