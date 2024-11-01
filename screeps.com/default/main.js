const CreepController = require("./creep.controller");
const SpawnController = require("./spawn.controller");

// Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], 'Harvester enis', {memory: {role: 'harvester'}});
// Game.creeps['Harvester enis'].suicide()
module.exports.loop = function () {
  CreepController.cleanMemory();

  SpawnController.run();
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    CreepController.from(creep).run();
  }
};
