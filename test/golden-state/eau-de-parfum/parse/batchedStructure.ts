import {
  MediaRuleClone,
  StyleRuleClone,
} from "../../../../src/parse/cloner.types";
import { BatchedStructure } from "../../../parse/index.types";
import docClone from "./docClone";

const batchedStructure: BatchedStructure = {
  styleSheets: [
    {
      batches: [
        {
          width: 375,
          rules: docClone.styleSheets[0].cssRules.slice(
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
          rules: [docClone.styleSheets[1].cssRules[0]] as StyleRuleClone[],
          isMediaQuery: false,
        },
      ],
    },
    {
      batches: [
        {
          width: 375,
          rules: docClone.styleSheets[2].cssRules.slice(
            0,
            13
          ) as StyleRuleClone[],
          isMediaQuery: false,
        },
        {
          width: 600,
          rules: (docClone.styleSheets[2].cssRules[13] as MediaRuleClone)
            .cssRules as StyleRuleClone[],
          isMediaQuery: true,
        },
      ],
    },
  ],
};

export { batchedStructure, BatchedStructure };
