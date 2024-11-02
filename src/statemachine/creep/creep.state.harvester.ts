import { ICreep } from "../../creep.class";
import { CreepStateThinking } from "./creep.state.thinking";
import { BaseState } from "../statemachine";
import { CreepState } from "statemachine/creep/base-creep.state";

export class CreepStateHarvester extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "⛏️");
  }

  public override onEnter(prevState: CreepState): void {
    const memory = this.getMemory();
    memory.specialization = "harvester";
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const icreep = this.ref;
    const creep = icreep.creep;

    const memory = this.getMemory();

    if (creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        icreep.moveToTarget(sources[0]);
      }
    } else {
      return CreepStateThinking;
      // const targets = creep.room.find(FIND_STRUCTURES, {
      //   filter: (structure) => {
      //     return (
      //       STRUCTURES_TO_TRANSFER.includes(structure.structureType as any) &&
      //       "store" in structure &&
      //       structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      //     );
      //   },
      // });

      // if (targets.length > 0) {
      //   const transferResult = creep.transfer(targets[0], RESOURCE_ENERGY);
      //   switch (transferResult) {
      //     case ERR_NOT_IN_RANGE:
      //       icreep.moveToTarget(targets[0]);
      //       break;
      //     case ERR_FULL:
      //       return CreepStateThinking;
      //   }
      // } else {
      //   return CreepStateThinking;
      // }
    }

    return;
  }
}