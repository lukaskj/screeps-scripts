import {CreepState} from "statemachine/creep/base-creep.state";
import {ICreep} from "../../creep.class";
import {Utils} from "../../utils";
import {BaseState} from "../statemachine";

import {Finder} from "utils/finder";
import {CreepStateHarvester} from "./creep.state.harvester";
import {CreepStateTransfer} from "./creep.state.transfer";
import {CreepStateBuilder} from "./creep.state.builder";
import {CreepStateUpgrader} from "./creep.state.upgrader";
import {CreepStateIdle} from "./creep.state.idle";

const MAX_SPECS_PER_ROOM: Record<TCreepSpecs, number> = {
  upgrader: 1,
  builder: 1,
  transfer: 1,
  harvester: Infinity,
  idle: Infinity,
};

export class CreepStateThinking extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "💭", "harvester");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const room = this.creep.room;

    if (this.creep.store.getFreeCapacity() > 0) {
      return CreepStateHarvester;
    }
    const structuresToTransfer = Finder.findStructuresToTransferEnergy(this.creep.room);

    if (structuresToTransfer.length > 0) {
      return CreepStateTransfer;
    }

    // Calculate next step
    const roomCreepSpecializations = Utils.getCreepSpecializationReport(room);
    const constructionSites = Utils.getMyConstructionSites(room);

    if (constructionSites.length > 0 && this.isSpecFull("builder", roomCreepSpecializations)) {
      return CreepStateBuilder;
    }

    if (this.creep.room.controller && this.isSpecFull("upgrader", roomCreepSpecializations)) {
      return CreepStateUpgrader;
    }

    //
    // Other specs here
    //

    if (this.creep.room.controller) {
      // Otherwise, upgrade bypassing spec max
      return CreepStateUpgrader;
    }

    return CreepStateIdle;
  }

  private isSpecFull(spec: TCreepSpecs, report: ReturnType<typeof Utils.getCreepSpecializationReport>): boolean {
    return (report[spec] ?? 0) >= MAX_SPECS_PER_ROOM[spec];
  }
}
