import {ICreep} from "./creep.class";

export class Builder extends ICreep {
  static role = "builder";
  override stroke = "#05f014";

  override run() {
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
          this.moveToTarget(targets[0]);
        }
      }
    } else {
      var sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        this.moveToTarget(sources[0]);
      }
    }
  }
}
