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

    const date = Utils.formatDate(new Date());
    const text = `[${date}] ${args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ")}`;
    console.log(text);
    Logger.instance().addTextToWindow(text, options);
    Memory.ui.console.tick = 0;
  }

  static info(...args) {
    this.log(...args);
  }

  static error(...args) {
    this.log("🛑", ...args, {[colorKey]: COLORS.ERROR});
  }

  static warn(...args) {
    this.log("⚠️", ...args, {[colorKey]: COLORS.WARN});
  }

  addTextToWindow(text, options) {
    if (!Memory.ui || !Memory.ui.console || !Memory.ui.console.lines) {
      return;
    }

    const consoleData = Memory.ui.console;

    if (consoleData.lines.length > consoleData.maxLines - 1) {
      consoleData.lines.splice(0, 1);
    }

    const dataToLog = !!options ? {text, ...options} : text;

    consoleData.lines.push(dataToLog);
  }
}

module.exports = {Logger};
