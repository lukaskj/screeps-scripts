import { DEFAULT_UI_MEMORY } from "../ui";

export class Helper {
  static initializeMemory() {
    if (!Memory.ui || !_.isEqual(Object.keys(Memory.ui), Object.keys(DEFAULT_UI_MEMORY)))
      Memory.ui = { ...DEFAULT_UI_MEMORY };
  }
}
