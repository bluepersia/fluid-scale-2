import {
  DocumentClone,
  MediaRuleClone,
  StyleRuleClone,
} from "../../../src/cloner.types";

const documentClone: DocumentClone = {
  stylesheets: [
    {
      cssRules: [
        {
          type: 1,
          selectorText: ":root",
          style: {},
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: "html",
          style: { "font-size": "14px" },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: "body",
          style: {
            "padding-top": "0px",
            "padding-right": "0px",
            "padding-bottom": "0px",
            "padding-left": "0px",
            "margin-top": "0px",
            "margin-right": "0px",
            "margin-bottom": "0px",
            "margin-left": "0px",
            "min-height": "100vh",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: "*, ::before, ::after",
          style: {
            "margin-top": "0px",
            "margin-right": "0px",
            "margin-bottom": "0px",
            "margin-left": "0px",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: "img",
          style: { "max-width": "100%", height: "auto" },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 4,
          minWidth: 375,
        } as MediaRuleClone,
      ],
    },
    {
      cssRules: [
        {
          type: 1,
          selectorText: ".u-container",
          style: {
            "padding-top": "0px",
            "padding-right": "1.14rem",
            "padding-bottom": "0px",
            "padding-left": "1.14rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
      ],
    },
    {
      cssRules: [
        {
          type: 1,
          selectorText: ".product-card",
          style: {
            "font-size": "1rem",
            "border-bottom-left-radius": "0.71rem",
            "border-bottom-right-radius": "0.71rem",
            "max-width": "24.5rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__img--desktop",
          style: {},
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__img--mobile",
          style: {
            "border-top-left-radius": "0.71rem",
            "border-top-right-radius": "0.71rem",
            width: "100%",
            "max-height": "17.14rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__content",
          style: {
            "padding-top": "1.71rem",
            "padding-right": "1.71rem",
            "padding-bottom": "1.71rem",
            "padding-left": "1.71rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__category",
          style: {
            "font-size": "0.85em",
            "letter-spacing": "0.41rem",
            "margin-bottom": "0.85rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__title",
          style: {
            "font-size": "2.28em",
            "line-height": "1em",
            "margin-bottom": "1.14rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__description",
          style: {
            "line-height": "1.64em",
            "margin-bottom": "1.71rem",
            "font-size": "1em",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__price",
          style: {
            "column-gap": "1.35rem",
            "row-gap": "1.35rem",
            "margin-bottom": "0px",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText:
            ".product-card__price--actual, .product-card__price--original",
          style: {},
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__price--actual",
          style: { "font-size": "2.28em" },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__price--original",
          style: { "font-size": "0.92em" },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__button",
          style: {
            width: "100%",
            "border-top-left-radius": "0.57rem",
            "border-top-right-radius": "0.57rem",
            "border-bottom-left-radius": "0.57rem",
            "border-bottom-right-radius": "0.57rem",
            "padding-top": "1.07rem",
            "padding-right": "1.07rem",
            "padding-bottom": "1.07rem",
            "padding-left": "1.07rem",
            "margin-top": "1.42rem",
            "column-gap": "0.85rem",
            "row-gap": "0.85rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__button:hover",
          style: {},
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 4,
          minWidth: 600,
          cssRules: [
            {
              type: 1,
              selectorText: ".product-card",
              style: {
                "max-width": "42.85rem",
                "border-top-right-radius": "0.71rem",
                "border-bottom-right-radius": "0.71rem",
                "max-height": "32.14rem",
              },
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__img--mobile",
              style: {},
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__img--desktop",
              style: { height: "100%" },
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__content",
              style: {
                "padding-top": "2.28rem",
                "padding-right": "2.28rem",
                "padding-bottom": "2.28rem",
                "padding-left": "2.28rem",
              },
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__category",
              style: { "margin-bottom": "1.42rem" },
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__title",
              style: { "margin-bottom": "1.71rem" },
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__description",
              style: { "margin-bottom": "2.07rem" },
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__button",
              style: { "margin-top": "2.14rem" },
              specialProperties: {},
            } as StyleRuleClone,
          ],
        } as MediaRuleClone,
      ],
    },
  ],
};

export default documentClone;
