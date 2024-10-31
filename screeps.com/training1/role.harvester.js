const ICreep = require("./creep.class");

const STRUCTURES_TO_TRANSFER = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];

class Harvester extends ICreep {
  static role = "harvester";

  stroke = "#f542ef";

  run() {
    if (!this.canRun()) {
      return;
    }
    const creep = this.creep;

    if (creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(sources[0]);
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return STRUCTURES_TO_TRANSFER.includes(structure.structureType) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        },
      });

      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          this.moveTo(targets[0]);
        }
      }
    }
  }
}

module.exports = Harvester;
