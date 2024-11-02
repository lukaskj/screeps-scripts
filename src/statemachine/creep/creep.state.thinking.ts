import {ICreep} from "../../creep.class";
import {CreepStateBuilder} from "./creep.state.builder";
import {CreepStateHarvester} from "./creep.state.harvester";

import {CreepState} from "statemachine/creep/base-creep.state";
import {Utils} from "../../utils";
import {BaseState} from "../statemachine";

export class CreepStateThinking extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "💭");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const memory = this.getMemory();
    const room = this.creep.room;

    memory.tick = (memory.tick ?? 0) + 1;

    if (memory.tick % 2 !== 0) {
      return;
    }

    if (this.creep.store.getFreeCapacity() > 0) {
      return CreepStateHarvester;
    }

    // Calculate next step
    const roomCreepSpecializations = Utils.getCreepSpecializationReport(room);
    const constructionSites = Utils.getMyConstructionSites(room);

    if (constructionSites.length > 0 && roomCreepSpecializations["builder"] < 3) {
      return CreepStateBuilder;
    }
  }
}
