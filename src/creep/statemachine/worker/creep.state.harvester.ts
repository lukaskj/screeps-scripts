import { ICreep } from "../../creep.class";
import { Logger } from "../../../logger";
import { Finder } from "../../../utils/finder";
import { BaseState } from "../../../statemachine/statemachine";
import { CreepState } from "../base-creep.state";
import { CreepStateIdle } from "./creep.state.idle";
import { CreepStateThinking } from "./creep.state.thinking";

export class CreepStateHarvester extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "🚜", "worker", "harvester");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const icreep = this.ref;
    const creep = icreep.creep;
    const room = creep.room;

    if (creep.store.getFreeCapacity() > 0) {
      const sources = [...Finder.availableEnergySites(room), ...Finder.droppedResources(room)];

      const memory = this.getMemory();

      if (!sources.length) {
        return CreepStateIdle;
      }

      let target = Finder.findClosestTo(creep, sources);
      if (memory.sourceToHarvestId) {
        target = Game.getObjectById<Source>(memory.sourceToHarvestId) ?? target;
      }

      if (memory.sourceToHarvestId !== target.id) {
        delete memory.sourceToHarvestId;
      }

      let result: number = OK;

      if (target instanceof Source) {
        result = creep.harvest(target);
      } else if (target instanceof Resource) {
        result = creep.pickup(target);
      } else {
        result = creep.withdraw(target, RESOURCE_ENERGY);
      }

      if (result === ERR_NOT_IN_RANGE) {
        const moveResult = icreep.moveToTarget(target);

        // if cant reach
        if (moveResult === ERR_NO_PATH) {
          sources.splice(sources.indexOf(target), 1); // remove the current closest one
          if (!sources.length) {
            return CreepStateThinking;
          }

          const closest2 = Finder.findClosestTo(creep, sources);
          memory.sourceToHarvestId = closest2.id;

          return;
        } else {
          if (target.id !== memory.sourceToHarvestId) {
            delete memory.sourceToHarvestId;
          }
        }
      } else if (result != OK) {
        Logger.error("Error harvesting", result);
        return CreepStateThinking;
      }
    } else {
      return CreepStateThinking;
    }
  }
}
