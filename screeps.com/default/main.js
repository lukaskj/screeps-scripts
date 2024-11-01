const CreepController = require("./creep.controller");
const {Logger} = require("./logger");
const SpawnController = require("./spawn.controller");
const UI = require("./ui");

module.exports.loop = function () {
  CreepController.cleanMemory();

  UI.update();
  SpawnController.update();

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    CreepController.from(creep).run();
  }
};
