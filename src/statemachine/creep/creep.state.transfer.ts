import {ICreep} from "creep.class";
import {CreepState} from "./base-creep.state";
import {BaseState} from "statemachine/statemachine";
import {Finder} from "utils/finder";
import {CreepStateThinking} from "./creep.state.thinking";
import {CreepStateHarvester} from "./creep.state.harvester";

export class CreepStateTransfer extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "🔁", "transfer");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const creep = this.creep;
    const icreep = this.icreep;

    if (creep.store[RESOURCE_ENERGY] == 0) {
      return CreepStateHarvester;
    }

    const structuresToTransfer = Finder.findStructuresToTransferEnergy(creep.room);

    if (structuresToTransfer.length > 0) {
      const structureToTransfer = Finder.findClosestTo(creep, structuresToTransfer);
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
