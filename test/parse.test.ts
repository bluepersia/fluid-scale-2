import { describe, test, expect } from "vitest";
import {
  parseCSS,
  initDocument,
  getStyleSheetBaselineWidth,
  batchStyleRule,
  batchMediaRule,
  batchStyleSheet,
} from "../src/parse";
import eauDeParfumDocClone from "./golden-state/eau-de-parfum/docClone";
import {
  MediaRuleClone,
  StyleRuleClone,
  StylesheetClone,
} from "../src/cloner.types";
import { RuleBatch } from "../src/parse.types";

const parseCSSTests = [
  {
    docClone: eauDeParfumDocClone,
    expected: { breakpoints: [375, 600] },
  },
];

describe("parseCSS", () => {
  test.each(parseCSSTests)("should parse the CSS", ({ docClone, expected }) => {
    const result = parseCSS(docClone);
    expect(result).toEqual(expected);
  });
});

const perpareDocTests = [
  {
    docClone: eauDeParfumDocClone,
    expected: { breakpoints: [375, 600], globalBaselineWidth: 375 },
  },
];

describe("initDocument", () => {
  test.each(perpareDocTests)(
    "should prepare the document",
    ({ docClone, expected }) => {
      const result = initDocument(docClone);
      expect(result).toEqual(expected);
    }
  );
});

const stylesheetBaselineTests = [
  {
    styleSheet: eauDeParfumDocClone.stylesheets[0],
    globalBaselineWidth: 375,
    expected: 375,
  },
  {
    styleSheet: eauDeParfumDocClone.stylesheets[2],
    globalBaselineWidth: 375,
    expected: 375,
  },
  {
    styleSheet: {
      cssRules: [
        {
          type: 4,
          minWidth: 600,
          cssRules: [],
        },
      ],
    },
    globalBaselineWidth: 375,
    expected: 600,
  },
];

describe("getStyleSheetBaselineWidth", () => {
  test.each(stylesheetBaselineTests)(
    "should get the style sheet baseline width",
    ({ styleSheet, globalBaselineWidth, expected }) => {
      const result = getStyleSheetBaselineWidth(
        styleSheet as StylesheetClone,
        globalBaselineWidth
      );
      expect(result).toEqual(expected);
    }
  );
});

const batchStyleRuleBatch1: RuleBatch = {
  width: 375,
  rules: [eauDeParfumDocClone.stylesheets[0].cssRules[0] as StyleRuleClone],
  isMediaQuery: false,
};
const batchStyleRuleBatch2: RuleBatch = {
  width: 375,
  rules: [eauDeParfumDocClone.stylesheets[0].cssRules[0] as StyleRuleClone],
  isMediaQuery: false,
};
const expectedStyleRuleBatch2: RuleBatch = {
  width: 375,
  rules: [
    eauDeParfumDocClone.stylesheets[0].cssRules[0] as StyleRuleClone,
    eauDeParfumDocClone.stylesheets[0].cssRules[1] as StyleRuleClone,
  ],
  isMediaQuery: false,
};
const batchStyleRuleTest = [
  {
    styleRule: eauDeParfumDocClone.stylesheets[0].cssRules[0],
    ruleBatchState: {
      ruleBatches: [],
      currentRuleBatch: null,
    },
    baselineWidth: 375,
    expected: {
      ruleBatches: [batchStyleRuleBatch1],
      currentRuleBatch: batchStyleRuleBatch1,
    },
  },
  {
    styleRule: eauDeParfumDocClone.stylesheets[0].cssRules[1],
    ruleBatchState: {
      ruleBatches: [batchStyleRuleBatch2],
      currentRuleBatch: batchStyleRuleBatch2,
    },
    baselineWidth: 375,
    expected: {
      ruleBatches: [expectedStyleRuleBatch2],
      currentRuleBatch: expectedStyleRuleBatch2,
    },
  },
];

describe("batchStyleRule", () => {
  test.each(batchStyleRuleTest)(
    "should batch the style rule",
    ({ styleRule, ruleBatchState, baselineWidth, expected }) => {
      const result = batchStyleRule(
        styleRule as StyleRuleClone,
        ruleBatchState,
        baselineWidth
      );
      expect(result).toEqual(expected);
    }
  );
});

const batchMediaRuleTestRule2: MediaRuleClone =
  eauDeParfumDocClone.stylesheets[2].cssRules.find(
    (rule) => rule.type === 4
  ) as MediaRuleClone;

const batchMediaRuleTest = [
  {
    mediaRule: eauDeParfumDocClone.stylesheets[0].cssRules.find(
      (rule) => rule.type === 4
    ) as MediaRuleClone,
    expected: {
      ruleBatches: [
        {
          width: 375,
          rules: [],
          isMediaQuery: true,
        },
      ],
      currentRuleBatch: null,
    },
  },
  {
    mediaRule: batchMediaRuleTestRule2,
    expected: {
      ruleBatches: [
        {
          width: 600,
          rules: batchMediaRuleTestRule2.cssRules,
          isMediaQuery: true,
        },
      ],
      currentRuleBatch: null,
    },
  },
];

describe("batchMediaRule", () => {
  test.each(batchMediaRuleTest)(
    "should batch the media rule",
    ({ mediaRule, expected }) => {
      const result = batchMediaRule(mediaRule as MediaRuleClone, {
        ruleBatches: [],
        currentRuleBatch: {
          width: mediaRule.minWidth,
          rules: [
            { type: 1, selectorText: "", style: {}, specialProperties: {} },
          ],
          isMediaQuery: false,
        },
      });
      expect(result).toEqual(expected);
    }
  );
});

const batchStyleSheetTest = [
  {
    styleSheet: eauDeParfumDocClone.stylesheets[0],
    expected: [
      {
        width: 375,
        rules: eauDeParfumDocClone.stylesheets[0].cssRules.slice(0, 5),
        isMediaQuery: false,
      },
    ],
  },
  {
    styleSheet: eauDeParfumDocClone.stylesheets[1],
    expected: [
      {
        width: 375,
        rules: [eauDeParfumDocClone.stylesheets[1].cssRules[0]],
        isMediaQuery: false,
      },
    ],
  },
  {
    styleSheet: eauDeParfumDocClone.stylesheets[2],
    expected: [
      {
        width: 375,
        rules: eauDeParfumDocClone.stylesheets[2].cssRules.slice(0, 13),
        isMediaQuery: false,
      },
      {
        width: 600,
        rules: (
          eauDeParfumDocClone.stylesheets[2].cssRules[13] as MediaRuleClone
        ).cssRules,
        isMediaQuery: true,
      },
    ],
  },
];

describe("batchStyleSheet", () => {
  test.each(batchStyleSheetTest)(
    "should batch the style sheet",
    ({ styleSheet, expected }) => {
      const result = batchStyleSheet(styleSheet as StylesheetClone, 375);
      expect(result).toEqual(expected);
    }
  );
});
