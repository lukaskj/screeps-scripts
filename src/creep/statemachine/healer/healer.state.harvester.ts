import { Logger } from "../../../logger";
import { BaseState } from "../../../statemachine";
import { Finder } from "../../../utils";
import { RoleHealer } from "../../roles";
import { CreepState } from "../base-creep.state";
import { HealerStateThinking } from "./healer.state.thinking";

export class HealerStateHarvester extends CreepState {
  constructor(ref: RoleHealer) {
    super(ref, "🚑🚜", "healer", "harvester");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const creep = this.creep;
    const icreep = this.icreep;
    const room = creep.room;
    const memory = this.getMemory();

    if (creep.store[RESOURCE_ENERGY] === 0 || memory.harvesting) {
      memory.harvesting = true;

      const storedEnergySources = Finder.storedEnergySources(room);
      const droppedResources = Finder.droppedResources(room);
      const availableEnergySources = Finder.availableEnergySources(room);

      const sources = droppedResources.length
        ? droppedResources
        : storedEnergySources.length
          ? storedEnergySources
          : availableEnergySources;

      if (!storedEnergySources.length && !sources.length) {
        return HealerStateThinking;
      }

      const target = Finder.findClosestTo<RoomObject>(creep, sources);

      let result: number = OK;

      if (target instanceof Source) {
        result = creep.harvest(target);
      } else if (target instanceof Resource) {
        result = creep.pickup(target);
      } else {
        result = creep.withdraw(<any>target, RESOURCE_ENERGY);
      }

      if (result === ERR_NOT_IN_RANGE) {
        icreep.moveToTarget(target);

        return;
      }

      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        memory.harvesting = false;

        return HealerStateThinking;
      }

      if (result !== OK) {
        Logger.error(`Error harvesting. Name ${creep.name}. State: ${this.constructor.name}. Result: ${result}`);

        return HealerStateThinking;
      }
    }

    return;
  }
}
