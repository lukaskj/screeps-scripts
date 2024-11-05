import { Logger } from "../../../logger";
import { BaseState } from "../../../statemachine";
import { Finder } from "../../../utils";
import { RoleHealer } from "../../roles";
import { CreepState } from "../base-creep.state";
import { HealerStateHarvester } from "./healer.state.harvester";
import { HealerStateThinking } from "./healer.state.thinking";

export class HealerStateRepairStructure extends CreepState {
  constructor(ref: RoleHealer) {
    super(ref, "🚑🏛️", "healer", "repair-structure");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const creep = this.creep;
    const room = this.creep.room;
    const memory = this.getMemory();

    const structuresToRepair = room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax,
    });

    const roadsToRepair = room.find(FIND_STRUCTURES, {
      filter: (structure) =>
        structure.hits < structure.hitsMax &&
        [STRUCTURE_ROAD, STRUCTURE_CONTAINER].includes(structure.structureType as any),
    });

    if (!structuresToRepair.length && !roadsToRepair.length) {
      return HealerStateThinking;
    }

    if (creep.store[RESOURCE_ENERGY] === 0 || memory.harvesting) {
      return HealerStateHarvester;
    }

    let targetToRepair: Structure;
    if (structuresToRepair.length) {
      targetToRepair = Finder.findClosestTo(creep, structuresToRepair);
    } else {
      targetToRepair = Finder.findClosestTo(creep, roadsToRepair);
    }

    const result = this.creep.repair(targetToRepair);

    if (result === ERR_NOT_IN_RANGE) {
      this.icreep.moveToTarget(targetToRepair);

      return;
    } else if (result != OK) {
      Logger.error(
        `Error repairing structure '${targetToRepair?.id}'. Name ${creep.name}. State: ${this.constructor.name}. Result: ${result}.`,
      );

      return HealerStateThinking;
    }

    return;
  }
}
