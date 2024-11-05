import { BaseState } from "../../../statemachine";
import { RoleHealer } from "../../roles";
import { CreepState } from "../base-creep.state";
import { HealerStateHealCreep } from "./healer.state.heal-creep";
import { HealerStateIdle } from "./healer.state.idle";
import { HealerStateRepairStructure } from "./healer.state.repair-structure";

export class HealerStateThinking extends CreepState {
  constructor(ref: RoleHealer) {
    super(ref, "💭", "healer", "idle");
    // 💉
    // 🆘
    // ⛑️
    // 🚒 🚑
    // 🏛️ 🏢
    // 🚨
    // 🔧
  }

  override update(): ClassConstructor<BaseState> | undefined {
    // const icreep = this.icreep;
    const creep = this.creep;
    const room = this.creep.room;

    // Check for any creep without full health
    const creepsToHeal = room.find(FIND_MY_CREEPS || FIND_MY_POWER_CREEPS, {
      filter: (_creep) => _creep.hits < _creep.hitsMax && _creep.id !== creep.id,
    });

    if (creepsToHeal.length > 1) {
      return HealerStateHealCreep;
    }

    // Check for any structure without full health
    const structuresToRepair = room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax,
    });

    const roadsToRepair = room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax,
    });

    if (structuresToRepair.length || roadsToRepair.length) {
      return HealerStateRepairStructure;
    }

    return HealerStateIdle;
  }
}
