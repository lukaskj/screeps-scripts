const ICreep = require("./creep.class");

class Upgrader extends ICreep {
  stroke = "#1300e3";

  run() {
    if (!this.canRun()) {
      return;
    }
    const creep = this.creep;

    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(creep.room.controller);
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(sources[0]);
      }
    }
  }
}

module.exports = Upgrader;
