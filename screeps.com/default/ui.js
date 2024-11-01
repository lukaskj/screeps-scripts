const Utils = require("./utils");

const defaultUiMemory = {
  console: {
    lines: [],
    maxLines: 5,
    speed: 15,
    x: 0,
    y: 49,
    width: 22,
    height: 5,
  },
};

function update() {
  if (!Memory.ui) Memory.ui = {...defaultUiMemory};
  // Memory.ui = {...defaultUiMemory};

  ConsoleUi.updateConsole();
}

class ConsoleUi {
  static updateConsole() {
    this._drawWindow();
    const logsData = Memory.ui.console;

    logsData.tick = (logsData.tick || 0) + 1;
    if (logsData.lines.length && logsData.tick % logsData.speed === 0) {
      logsData.lines.splice(0, 1);
      logsData.tick = 0;
    }

    const x = logsData.x;
    const y = logsData.y;
    let xLine = x;
    let yLine = y;

    for (let i = logsData.lines.length - 1; i >= 0; i--) {
      const line = logsData.lines[i];
      let text = line;
      let color = "white";
      if (typeof line === "object" && line.text) {
        text = line.text;
        color = line.color || "white";
      }
      Utils.allRooms().forEach((room) => {
        room.visual.text(text, xLine, yLine, {align: "left", color, font: "0.8 Consolas"});
      });
      yLine--;
    }
  }

  static _drawWindow() {
    const {x, y, width, height, lines} = Memory.ui.console;

    const widthCalculated = lines.reduce((acc, cur) => {
      const text = typeof cur === "object" ? cur.text : cur;
      if (acc > text.length) {
        return acc;
      }
      return text.length;
    }, 0);

    Utils.allRooms().forEach((room) => {
      room.visual.rect(x - 0.6, y - height + 0.2, widthCalculated / 2, height, {fill: "#000000", opacity: 0.25});
    });
  }
}

module.exports = {
  update,
};
