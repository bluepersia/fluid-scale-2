import {
  MediaRuleClone,
  StyleRuleClone,
} from "../../../../src/parse/cloner.types";
import { RuleBatch } from "../../../../src/parse/parse.types";
import master from "../master";
import { countStyleRules } from "../../../utils";
import {
  makeParseStyleSheetsTest,
  makeParseStyleSheetTests,
} from "../../../parse/parse";

const {
  docClone,
  batchedStructure,
  breakpoints,
  globalBaselineWidth,
  fluidData,
} = master;

const parseCSSTests = [
  {
    docClone: docClone,
    expected: { breakpoints: [375, 600], fluidData },
  },
];

const perpareDocTests = [
  {
    docClone: docClone,
    expected: { breakpoints: [375, 600], globalBaselineWidth: 375 },
  },
];

const stylesheetBaselineTests = [
  {
    styleSheet: docClone.styleSheets[0],
    globalBaselineWidth: 375,
    expected: 375,
  },
  {
    styleSheet: docClone.styleSheets[2],
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

const batchStyleRuleBatch1: RuleBatch = {
  width: 375,
  rules: [docClone.styleSheets[0].cssRules[0] as StyleRuleClone],
  isMediaQuery: false,
};
const batchStyleRuleBatch2: RuleBatch = {
  width: 375,
  rules: [docClone.styleSheets[0].cssRules[0] as StyleRuleClone],
  isMediaQuery: false,
};
const expectedStyleRuleBatch2: RuleBatch = {
  width: 375,
  rules: [
    docClone.styleSheets[0].cssRules[0] as StyleRuleClone,
    docClone.styleSheets[0].cssRules[1] as StyleRuleClone,
  ],
  isMediaQuery: false,
};
const batchStyleRuleTest = [
  {
    styleRule: docClone.styleSheets[0].cssRules[0],
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
    styleRule: docClone.styleSheets[0].cssRules[1],
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

const batchMediaRuleTestRule2: MediaRuleClone =
  docClone.styleSheets[2].cssRules.find(
    (rule) => rule.type === 4
  ) as MediaRuleClone;

const batchMediaRuleTest = [
  {
    mediaRule: docClone.styleSheets[0].cssRules.find(
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

const batchStyleSheetTest = docClone.styleSheets
  .slice(0, 3)
  .map((styleSheet, index) => ({
    styleSheet,
    expected: batchedStructure.styleSheets[index].batches,
  }));

const parseStyleSheetsTests = makeParseStyleSheetsTest(master);

const parseStyleSheetTests = makeParseStyleSheetTests(parseStyleSheetsTests);

export {
  parseCSSTests,
  perpareDocTests,
  stylesheetBaselineTests,
  batchStyleRuleTest,
  batchMediaRuleTest,
  batchStyleSheetTest,
  parseStyleSheetsTests,
  parseStyleSheetTests,
};
