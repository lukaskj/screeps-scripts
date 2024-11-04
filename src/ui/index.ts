import { ConsoleUi } from "./console-ui";
import { ReportWindow } from "./report-window";

export const DEFAULT_UI_MEMORY: typeof Memory.ui = {
  opacity: 0.8,
  console: {
    lines: [] as TLines,
    tick: 0,
    maxLines: 5,
    speed: 25,
    x: 0,
    y: 49,
    width: 22,
    height: 5,
  },
  report: {
    lines: [] as TLines,
    x: 0,
    y: 0,
  },
};

export class UI {
  public static draw(): void {
    ConsoleUi.draw();
    ReportWindow.draw();
  }
}
