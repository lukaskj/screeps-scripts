const ICreep = require("./creep.class");

class Harvester extends ICreep {
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
          return (
            (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
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
