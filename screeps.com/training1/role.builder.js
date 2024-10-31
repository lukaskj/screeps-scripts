const ICreep = require("./creep.class");

class Builder extends ICreep {
  static role = "builder";
  stroke = "#05f014";

  run() {
    if (!this.canRun()) {
      return;
    }

    const creep = this.creep;

    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          this.moveTo(targets[0]);
        }
      }
    } else {
      var sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(sources[0]);
      }
    }
  }
}

module.exports = Builder;
