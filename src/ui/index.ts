import { ConsoleUi } from "./console-ui";

type TLines = string[] | { text: string; color: string }[];
const defaultUiMemory = {
  console: {
    lines: [] as TLines,
    tick: 0,
    maxLines: 5,
    speed: 15,
    x: 0,
    y: 49,
    width: 22,
    height: 5,
  },
};

export class UI {
  public static update(): void {
    if (!Memory.ui) Memory.ui = { ...defaultUiMemory };

    ConsoleUi.updateConsole();
  }
}
