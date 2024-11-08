import { MAX_CONTROLLER_TICKS_TO_DOWNGRADE } from "../../../constants/constants";
import { MAX_CREEP_SPECS_PER_ROOM } from "../../../constants/max-creep-specs-per-room";
import { BaseState } from "../../../statemachine/statemachine";
import { Finder } from "../../../utils/finder";
import { ICreep } from "../../creep.class";
import { CreepState } from "../base-creep.state";
import { CreepStateBuilder } from "./creep.state.builder";
import { CreepStateHarvester } from "./creep.state.harvester";
import { CreepStateIdle } from "./creep.state.idle";
import { CreepStateTransfer } from "./creep.state.transfer";
import { CreepStateUpgrader } from "./creep.state.upgrader";

export class CreepStateThinking extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "💭", "worker", "harvester");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const room = this.creep.room;
    const totalCreepsForRoom = Finder.getCreepsFromRoom(room);

    if (this.creep.store.getFreeCapacity() > 0 && this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      return CreepStateHarvester;
    }

    // Upgrader checks
    const roomCreepSpecializations = Finder.getCreepSpecializationReport(room);
    if (this.creep.room.controller) {
      if (this.creep.room.controller.ticksToDowngrade < MAX_CONTROLLER_TICKS_TO_DOWNGRADE) {
        return CreepStateUpgrader;
      }

      if (
        totalCreepsForRoom.length > 2 &&
        this.creep.room.controller.level === 1 &&
        !this.isSpecFull("upgrader", roomCreepSpecializations)
      ) {
        return CreepStateUpgrader;
      }
    }

    // Transfer checks
    if (!this.isSpecFull("transfer", roomCreepSpecializations)) {
      const structuresToTransfer = Finder.findStructuresToTransferEnergy(this.creep.room);
      if (structuresToTransfer.length > 0) {
        return CreepStateTransfer;
      }
    }

    // Builder checks
    const constructionSites = Finder.getMyConstructionSites(room);
    if (constructionSites.length > 0 && !this.isSpecFull("builder", roomCreepSpecializations)) {
      return CreepStateBuilder;
    }

    if (this.creep.room.controller && !this.isSpecFull("upgrader", roomCreepSpecializations)) {
      return CreepStateUpgrader;
    }

    if (this.creep.room.controller) {
      // Otherwise, upgrade bypassing spec max
      return CreepStateUpgrader;
    }

    return CreepStateIdle;
  }

  private isSpecFull(spec: TCreepSpecs, report: ReturnType<typeof Finder.getCreepSpecializationReport>): boolean {
    return !!MAX_CREEP_SPECS_PER_ROOM[spec] && (report[spec] ?? 0) >= MAX_CREEP_SPECS_PER_ROOM[spec].max;
  }
}
