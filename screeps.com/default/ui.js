const Utils = require("./utils");

const defaultUiMemory = {
  console: {
    lines: [],
    maxLines: 5,
    speed: 15,
  },
};

function update() {
  if (!Memory.ui) Memory.ui = {...defaultUiMemory};

  updateConsole();
}

function updateConsole() {
  const logsData = Memory.ui.console;

  logsData.tick = (logsData.tick || 0) + 1;
  if (logsData.lines.length && logsData.tick % logsData.speed === 0) {
    logsData.lines.splice(0, 1);
    logsData.tick = 0;
  }

  const x = 0;
  const y = 49;
  let xLine = x;
  let yLine = y;

  for (let i = logsData.lines.length - 1; i >= 0; i--) {
    const line = logsData.lines[i];
    let text = line;
    let color = "white";
    if (typeof line === "object") {
      text = line.text;
      color = line.color;
    }
    Utils.allRooms().forEach((room) => {
      room.visual.text(text, xLine, yLine, {align: "left", color, font: "0.8 Consolas"});
    });
    yLine--;
  }
}

module.exports = {
  update,
};
