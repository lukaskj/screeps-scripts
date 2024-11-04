import { Finder } from "../utils";

export class ConsoleUi {
  static draw() {
    this._drawConsoleWindow();
    const opacity = Memory.ui.opacity;
    const logsData = Memory.ui.console;

    logsData.tick = (logsData.tick || 0) + 1;
    if (logsData.lines.length && logsData.tick % logsData.speed === 0) {
      logsData.lines.splice(0, 1);
      logsData.tick = 0;
    }

    const x = logsData.x;
    const y = logsData.y;
    const xLine = x;
    let yLine = y;

    for (let i = logsData.lines.length - 1; i >= 0; i--) {
      const line = logsData.lines[i];
      let text = typeof line === "string" ? line : "";
      const style: TextStyle = {};
      if (typeof line === "object" && line.text) {
        text = line.text;
        Object.assign(style, line.style);
      }

      Finder.allRooms().forEach((room) => {
        room.visual.text(text, xLine, yLine, { ...style, align: "left", opacity, font: "0.8 Consolas" });
      });

      yLine--;
    }
  }

  static _drawConsoleWindow() {
    const { x, y, height, lines } = Memory.ui.console;

    const widthCalculated = lines.reduce((acc, cur) => {
      const text = typeof cur === "object" ? cur.text : cur;
      if (acc > text.length) {
        return acc;
      }
      return text.length;
    }, 0);

    Finder.allRooms().forEach((room) => {
      room.visual.rect(x - 0.6, y - height + 0.2, widthCalculated / 2, height, { fill: "#000000", opacity: 0.25 });
    });
  }
}
