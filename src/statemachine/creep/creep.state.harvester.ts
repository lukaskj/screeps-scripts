import { ICreep } from "../../creep.class";
import { Logger } from "../../logger";
import { Finder } from "../../utils/finder";
import { BaseState } from "../statemachine";
import { CreepState } from "./base-creep.state";
import { CreepStateThinking } from "./creep.state.thinking";

export class CreepStateHarvester extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "🚜", "harvester");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const icreep = this.ref;
    const creep = icreep.creep;

    if (creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES_ACTIVE);

      const memory = this.getMemory();
      let target: Source = Finder.findClosestTo(creep, sources);
      if (memory.sourceToHarvestId) {
        target = Game.getObjectById<Source>(memory.sourceToHarvestId) ?? target;
      }

      if (memory.sourceToHarvestId !== target.id) {
        delete memory.sourceToHarvestId;
      }

      const result = creep.harvest(target);

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
