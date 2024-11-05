import { RoleHealer } from "../../roles/role.healer";
import { CreepStateMachine } from "../creep-statemachine";
import { HealerStateHarvester } from "./healer.state.harvester";
import { HealerStateHealCreep } from "./healer.state.heal-creep";
import { HealerStateIdle } from "./healer.state.idle";
import { HealerStateRepairStructure } from "./healer.state.repair-structure";
import { HealerStateThinking } from "./healer.state.thinking";

export class HealerStateMachine extends CreepStateMachine {
  constructor(ref: RoleHealer) {
    super(
      [HealerStateIdle, HealerStateThinking, HealerStateHealCreep, HealerStateRepairStructure, HealerStateHarvester],
      ref,
      HealerStateThinking,
    );
  }
}
