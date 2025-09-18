import { DocStructure, MakeFluidPropertiesDoc } from "../../engine/index.types";

const maxId = 11;

const doc: DocStructure = {
  "1": ["max-width"],
  "4": ["padding-top", "padding-right", "padding-bottom", "padding-left"],
  "5": ["margin-bottom"],
  "6": ["margin-bottom"],
  "7": ["margin-bottom"],
  "11": ["margin-top"],
};

const makeFluidPropertiesDoc: MakeFluidPropertiesDoc = {
  "1": [
    {
      anchor: ".product-card",
      properties: ["max-width"],
    },
  ],
  "4": [
    {
      anchor: ".product-card__content",
      properties: [
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left",
      ],
    },
  ],
  "5": [
    {
      anchor: ".product-card__category",
      properties: ["margin-bottom"],
    },
  ],
  "6": [
    {
      anchor: ".product-card__title",
      properties: ["margin-bottom"],
    },
  ],
  "7": [
    {
      anchor: ".product-card__description",
      properties: ["margin-bottom"],
    },
  ],
  "11": [
    {
      anchor: ".product-card__button",
      properties: ["margin-top"],
    },
  ],
};

const allIds = new Array(maxId).fill(0).map((_, index) => index.toString());

export { doc, allIds, makeFluidPropertiesDoc };
