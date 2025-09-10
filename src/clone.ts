const FLUID_PROPERTY_NAMES = [
  "font-size",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-indent",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-right-radius",
  "border-bottom-left-radius",
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "grid-template-columns",
  "grid-template-rows",
  "background-position-x",
  "background-position-y",
  "--fluid-bg-size",
  "top",
  "left",
  "right",
  "bottom",
  "column-gap",
  "row-gap",
  "object-position",
];

const cloneDocumentTemplate = `
  function getFluidProperties(style) {
    const result = {};

    for (const property of FLUID_PROPERTY_NAMES) {
      const value = style.getPropertyValue(property);
      if (value) {
        result[property] = value;
      }
    }
    return result;
  }

  function makeStyleRuleClone(rule) {
    return {
      type: 1,
      selector: rule.selectorText,
      style: getFluidProperties(rule.style),
    };
  }

  const clone = {
    styleSheets: [],
  };

  for (const sheet of Array.from(document.styleSheets)) {
    const sheetClone = {
      rules: [],
    };

    for (const rule of Array.from(sheet.rules)) {
      let ruleClone;
      if (rule.type === 1) {
        ruleClone = makeStyleRuleClone(rule);
      } else if (rule.type === 4) {
        ruleClone = {
          type: 4,
          media: { mediaText: rule.media.mediaText },
          rules: [],
        };
        for (const subRule of Array.from(rule.rules)) {
          ruleClone.rules.push(makeStyleRuleClone(subRule));
        }
      }
      sheetClone.rules.push(ruleClone);
    }
    clone.styleSheets.push(sheetClone);
  }

  return clone;
`;

const cloneDocument = new Function(
  "document",
  "FLUID_PROPERTY_NAMES",
  cloneDocumentTemplate
);

export { cloneDocumentTemplate, cloneDocument, FLUID_PROPERTY_NAMES };
