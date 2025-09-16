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
          style: { fontSize: "14px" },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: "body",
          style: {
            paddingTop: "0px",
            paddingRight: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "0px",
            marginLeft: "0px",
            minHeight: "100vh",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: "*, ::before, ::after",
          style: {
            marginTop: "0px",
            marginRight: "0px",
            marginBottom: "0px",
            marginLeft: "0px",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: "img",
          style: { maxWidth: "100%", height: "auto" },
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
            paddingTop: "0px",
            paddingRight: "1.14rem",
            paddingBottom: "0px",
            paddingLeft: "1.14rem",
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
            fontSize: "1rem",
            borderBottomLeftRadius: "0.71rem",
            borderBottomRightRadius: "0.71rem",
            maxWidth: "24.5rem",
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
            borderTopLeftRadius: "0.71rem",
            borderTopRightRadius: "0.71rem",
            width: "100%",
            maxHeight: "17.14rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__content",
          style: {
            paddingTop: "1.71rem",
            paddingRight: "1.71rem",
            paddingBottom: "1.71rem",
            paddingLeft: "1.71rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__category",
          style: {
            fontSize: "0.85em",
            letterSpacing: "0.41rem",
            marginBottom: "0.85rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__title",
          style: {
            fontSize: "2.28em",
            lineHeight: "1em",
            marginBottom: "1.14rem",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__description",
          style: {
            lineHeight: "1.64em",
            marginBottom: "1.71rem",
            fontSize: "1em",
          },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__price",
          style: {
            columnGap: "1.35rem",
            rowGap: "1.35rem",
            marginBottom: "0px",
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
          style: { fontSize: "2.28em" },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__price--original",
          style: { fontSize: "0.92em" },
          specialProperties: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__button",
          style: {
            width: "100%",
            borderTopLeftRadius: "0.57rem",
            borderTopRightRadius: "0.57rem",
            borderBottomLeftRadius: "0.57rem",
            borderBottomRightRadius: "0.57rem",
            paddingTop: "1.07rem",
            paddingRight: "1.07rem",
            paddingBottom: "1.07rem",
            paddingLeft: "1.07rem",
            marginTop: "1.42rem",
            columnGap: "0.85rem",
            rowGap: "0.85rem",
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
                maxWidth: "42.85rem",
                borderTopRightRadius: "0.71rem",
                borderBottomRightRadius: "0.71rem",
                maxHeight: "32.14rem",
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
                paddingTop: "2.28rem",
                paddingRight: "2.28rem",
                paddingBottom: "2.28rem",
                paddingLeft: "2.28rem",
              },
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__category",
              style: { marginBottom: "1.42rem" },
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__title",
              style: { marginBottom: "1.71rem" },
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__description",
              style: { marginBottom: "2.07rem" },
              specialProperties: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__button",
              style: { marginTop: "2.14rem" },
              specialProperties: {},
            } as StyleRuleClone,
          ],
        } as MediaRuleClone,
      ],
    },
  ],
};

export default documentClone;
