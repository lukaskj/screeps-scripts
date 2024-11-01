const Utils = require("./utils");

const defaultUiMemory = {
  logs: {
    lines: [],
    maxLines: 5,
    speed: 10,
  },
};

function update() {
  if (!Memory.ui) Memory.ui = {...defaultUiMemory};

  updateConsole();
}

function updateConsole() {
  const logsData = Memory.ui.logs;
  const x = 0;
  const y = 49;
  let xLine = x;
  let yLine = y - logsData.maxLines + 1;

  for (const lineIndex in logsData.lines) {
    const line = logsData.lines[lineIndex];
    let text = line;
    let color = "white";
    if (typeof line === "object") {
      text = line.text;
      color = line.color;
    }
    Utils.allRooms()[0].visual.text(text, xLine, yLine, {align: "left", color, font: "0.8 Consolas"});
    yLine++;
  }
}

module.exports = {
  update,
};
