const CreepController = require("./creep.controller");
const {Logger} = require("./logger");
const SpawnController = require("./spawn.controller");
const UI = require("./ui");

// Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], 'Harvester enis', {memory: {role: 'harvester'}});
// Game.creeps['Harvester enis'].suicide()
module.exports.loop = function () {
  UI.update();
  CreepController.cleanMemory();

  SpawnController.update();

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    CreepController.from(creep).run();
  }
};
