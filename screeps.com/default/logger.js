const {COLORS} = require("./constants");
const Utils = require("./utils");

const colorKey = Symbol.for("color");
class Logger {
  static #instance;
  constructor() {}

  static instance() {
    if (!this.#instance) {
      this.#instance = new Logger();
    }

    return this.#instance;
  }

  static log(...args) {
    let options = undefined;
    if (args.length && typeof args[args.length - 1] === "object" && !!args[args.length - 1][colorKey]) {
      options = {
        color: args[args.length - 1][colorKey],
      };

      args.pop();
    }
    // const date = new Date().toISOString().substring(0, 16).replace("T", " ");
    const date = Utils.formatDate(new Date());
    const text = `[${date}] ${args.map(String).join(" ")}`;
    console.log(text);
    Logger.instance().addTextToWindow(text, options);
  }

  static info(...args) {
    this.log(args);
  }

  static error(...args) {
    this.log("🛑", ...args, {[colorKey]: COLORS.ERROR});
  }

  static warn(...args) {
    this.log("⚠️", ...args, {[colorKey]: COLORS.WARN});
  }

  addTextToWindow(text, options) {
    if (!Memory.ui || !Memory.ui.logs || !Memory.ui.logs.lines) {
      return;
    }

    if (Memory.ui.logs.lines.length > Memory.ui.logs.maxLines - 1) {
      Memory.ui.logs.lines.splice(0, 1);
    }

    const dataToLog = !!options ? {text, ...options} : text;

    Memory.ui.logs.lines.push(dataToLog);
  }
}

module.exports = {Logger};
