import { cloneDocument } from "../bundle";
import {
  addElements as addElementsEngine,
  addElementToState,
  getState,
  initEngineState,
} from "./engine";
import { parseCSS } from "./parse/parse";

function addElements(els: Node[]) {
  const htmlEls = els.filter(
    (el) => el instanceof HTMLElement
  ) as HTMLElement[];

  const state = getState();
  const toAdd = addElementsEngine(htmlEls, state);

  for (const elAdd of toAdd) {
    addElementToState(elAdd);
  }
}

function getAllEls(): Node[] {
  return [document.body, ...document.querySelectorAll("*")];
}

function init(): void {
  const docClone = cloneDocument(document);
  const { breakpoints, fluidData } = parseCSS(docClone);
  initEngineState(breakpoints, fluidData);
  addElements(getAllEls().filter((el) => el instanceof HTMLElement));
}
export { init, getAllEls, addElements };
