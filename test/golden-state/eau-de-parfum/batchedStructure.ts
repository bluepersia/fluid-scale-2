import {
  MediaRuleClone,
  StyleRuleClone,
} from "../../../src/parse/cloner.types";
import docClone from "./docClone";

const batchedStructure = {
  styleSheets: [
    {
      batches: [
        {
          width: 375,
          rules: docClone.stylesheets[0].cssRules.slice(
            0,
            5
          ) as StyleRuleClone[],
          isMediaQuery: false,
        },
      ],
    },
    {
      batches: [
        {
          width: 375,
          rules: [docClone.stylesheets[1].cssRules[0]] as StyleRuleClone[],
          isMediaQuery: false,
        },
      ],
    },
    {
      batches: [
        {
          width: 375,
          rules: docClone.stylesheets[2].cssRules.slice(
            0,
            13
          ) as StyleRuleClone[],
          isMediaQuery: false,
        },
        {
          width: 600,
          rules: (docClone.stylesheets[2].cssRules[13] as MediaRuleClone)
            .cssRules as StyleRuleClone[],
          isMediaQuery: true,
        },
      ],
    },
  ],
};

export default batchedStructure;
