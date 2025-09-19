import { DocumentClone } from "../../src/parse/cloner.types";
import { Master } from "../index.types";
import { countStyleRules } from "../utils";
import {
  ParseStyleSheetsTestCase,
  ParseStyleSheetTestCase,
} from "./index.types";

function makeParseStyleSheetsTest(master: Master): ParseStyleSheetsTestCase {
  return {
    sheets: master.docClone.styleSheets,
    ...master,
    master,
  };
}

function makeParseStyleSheetTests(
  prevTest: ParseStyleSheetsTestCase
): ParseStyleSheetTestCase[] {
  let parseStyleSheetTestsOrder = 0;
  const parseStyleSheetTests = prevTest.sheets.map((sheet) => {
    const nextOrder =
      parseStyleSheetTestsOrder + countStyleRules(sheet.cssRules);
    const testCase = {
      sheet,
      ...prevTest,
      order: parseStyleSheetTestsOrder,
      nextOrder,
    };
    parseStyleSheetTestsOrder = nextOrder;
    return testCase;
  });
  return parseStyleSheetTests;
}
export { makeParseStyleSheetsTest, makeParseStyleSheetTests };
