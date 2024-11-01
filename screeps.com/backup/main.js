const CreepController = require("./creep.controller");
const {Logger} = require("./logger");
const SpawnController = require("./spawn.controller");
const UI = require("./ui");

module.exports.loop = function () {
  CreepController.cleanMemory();

  UI.update();
  SpawnController.update();
  // switch (Game.time % 3) {
  //   case 0:
  //     Logger.error("Worked");
  //     break;
  //   case 1:
  //     Logger.warn("Worked");
  //     break;
  //   case 2:
  //     Logger.info("Worked");
  //     break;
  // }
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    CreepController.from(creep).run();
  }
};
