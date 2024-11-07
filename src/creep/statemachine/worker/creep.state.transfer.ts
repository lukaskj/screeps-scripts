import { ICreep } from "../../creep.class";
import { Finder } from "../../../utils/finder";
import { BaseState } from "../../../statemachine/statemachine";
import { CreepState } from "../base-creep.state";
import { CreepStateHarvester } from "./creep.state.harvester";
import { CreepStateThinking } from "./creep.state.thinking";

export class CreepStateTransfer extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "🔁", "worker", "transfer");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const creep = this.creep;
    const icreep = this.icreep;

    if (creep.store[RESOURCE_ENERGY] == 0) {
      return CreepStateHarvester;
    }

    const structuresToTransfer = Finder.findStructuresToTransferEnergy(creep.room);
    const towerNeedingEnergy = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: (structure) =>
        structure instanceof StructureTower && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });

    if (structuresToTransfer.length > 0 || !!towerNeedingEnergy) {
      const structureToTransfer = towerNeedingEnergy ?? Finder.findClosestTo(creep, structuresToTransfer);
      const transferResult = creep.transfer(structureToTransfer, RESOURCE_ENERGY);

      switch (transferResult) {
        case ERR_NOT_IN_RANGE:
          icreep.moveToTarget(structureToTransfer);
          break;
        case OK:
          return;
        default:
          return CreepStateThinking;
      }
    } else {
      return CreepStateThinking;
    }
  }
}
