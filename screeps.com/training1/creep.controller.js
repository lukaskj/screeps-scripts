const ICreep = require("./creep.class");
const Harvester = require("./role.harvester");
const Builder = require("./role.builder");
const Upgrader = require("./role.upgrader");

const ByRole = {
  [Harvester.role]: Harvester,
  [Builder.role]: Builder,
  [Upgrader.role]: Upgrader,
};

class CreepController {
  static allCreeps = new Map();

  static from(creep) {
    if (!this.allCreeps.has(creep.name)) {
      // console.log(`CREATING NEW INSTANCE FOR ${creep.name}`, this.allCreeps.size);
      let clazz = ByRole[creep.memory.role];
      if (!clazz) clazz = ICreep;

      this.allCreeps.set(creep.name, new clazz(creep.name));
    }

    return this.allCreeps.get(creep.name);
  }

  static cleanMemory() {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        console.log("Clearing non-existing creep memory:", name);
        delete Memory.creeps[name];

        if (CreepController.allCreeps.has(name)) {
          console.log("Clearing ICreep instance:", name);
          CreepController.allCreeps.delete(name);
        }
      }
    }
  }
}

module.exports = CreepController;
module.exports.ByRole = ByRole;
