const CreepController = require("creep.controller");

function cleanMemory() {
  for (const [name, icreep] of CreepController.allCreeps.entries()) {
    console.log(name, CreepController.allCreeps.size);
  }
  // for (const name in Memory.creeps) {
  //   if (!Game.creeps[name]) {
  //     delete Memory.creeps[name];
  //     console.log("Clearing non-existing creep memory:", name);
  //   }
  // }
}

module.exports = {
  cleanMemory,
};
