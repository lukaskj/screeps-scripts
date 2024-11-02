import {ICreep} from "./creep.class";

export class Upgrader extends ICreep {
  static role = "upgrader";

  override stroke = "#1300e3";

  override run() {
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
      if (creep.room.controller && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        this.moveToTarget(creep.room.controller);
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        this.moveToTarget(sources[1]);
      }
    }
  }
}
