import { Logger } from "../../../logger";
import { BaseState } from "../../../statemachine";
import { Finder } from "../../../utils";
import { RoleHealer } from "../../roles";
import { CreepState } from "../base-creep.state";
import { HealerStateHarvester } from "./healer.state.harvester";
import { HealerStateThinking } from "./healer.state.thinking";

export class HealerStateHealCreep extends CreepState {
  constructor(ref: RoleHealer) {
    super(ref, "🚑🔧", "healer", "heal-creep");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const creep = this.creep;
    const room = this.creep.room;
    const memory = this.getMemory();

    const creepsToHeal = room.find(FIND_MY_CREEPS || FIND_MY_POWER_CREEPS, {
      filter: (_creep) => _creep.hits < _creep.hitsMax && _creep.id !== creep.id,
    });

    if (!creepsToHeal.length) {
      return HealerStateThinking;
    }

    if (creep.store[RESOURCE_ENERGY] === 0 || memory.harvesting) {
      return HealerStateHarvester;
    }

    const creepTooHeal = Finder.findClosestTo(creep, creepsToHeal);

    const result = creep.heal(creepTooHeal);

    if (result === ERR_NOT_IN_RANGE) {
      this.icreep.moveToTarget(creepTooHeal);

      return;
    } else if (result != OK) {
      Logger.error(
        `Error healing creep '${creepTooHeal?.id}'. Name ${creep.name}. State: ${this.constructor.name}. Result: ${result}.`,
      );

      return HealerStateThinking;
    }

    return;
  }
}
