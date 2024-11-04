
import {ICreep} from "../../creep.class";
import { Finder } from "../../utils/finder";
import {BaseState} from "../statemachine";
import { CreepState } from "./base-creep.state";
import {CreepStateBuilder} from "./creep.state.builder";
import {CreepStateHarvester} from "./creep.state.harvester";
import {CreepStateIdle} from "./creep.state.idle";
import {CreepStateTransfer} from "./creep.state.transfer";
import {CreepStateUpgrader} from "./creep.state.upgrader";

const MAX_SPECS_PER_ROOM: Record<TCreepSpecs, {max: number; priority: number}> = {
  upgrader: {
    max: 1,
    priority: 1,
  },
  builder: {
    max: 4,
    priority: 1,
  },
  transfer: {
    max: 3,
    priority: 1,
  },
  harvester: {
    max: Infinity,
    priority: 1,
  },
  idle: {
    max: Infinity,
    priority: 1,
  },
};

export class CreepStateThinking extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "💭", "harvester");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const room = this.creep.room;

    if (this.creep.store.getFreeCapacity() > 0 && this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      return CreepStateHarvester;
    }

    if (this.creep.room.controller && this.creep.room.controller.ticksToDowngrade < 350) {
      return CreepStateUpgrader;
    }

    // Calculate next step
    const roomCreepSpecializations = Finder.getCreepSpecializationReport(room);

    if (!this.isSpecFull("transfer", roomCreepSpecializations)) {
      const structuresToTransfer = Finder.findStructuresToTransferEnergy(this.creep.room);
      if (structuresToTransfer.length > 0) {
        return CreepStateTransfer;
      }
    }

    const constructionSites = Finder.getMyConstructionSites(room);
    if (constructionSites.length > 0 && !this.isSpecFull("builder", roomCreepSpecializations)) {
      return CreepStateBuilder;
    }

    if (this.creep.room.controller && !this.isSpecFull("upgrader", roomCreepSpecializations)) {
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

  private isSpecFull(spec: TCreepSpecs, report: ReturnType<typeof Finder.getCreepSpecializationReport>): boolean {
    return (report[spec] ?? 0) >= MAX_SPECS_PER_ROOM[spec].max;
  }
}
