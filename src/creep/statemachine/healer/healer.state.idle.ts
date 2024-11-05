import { BaseState } from "../../../statemachine";
import { Finder } from "../../../utils";
import { RoleHealer } from "../../roles";
import { CreepState } from "../base-creep.state";
import { HealerStateThinking } from "./healer.state.thinking";

export class HealerStateIdle extends CreepState {
  constructor(ref: RoleHealer) {
    super(ref, "💤", "healer", "idle");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const memory = this.getMemory();
    const room = this.creep.room;
    const spawners = room.find(FIND_MY_SPAWNS);
    const idleFlag = room.find(FIND_FLAGS, {
      filter: (flag) => flag.name.toLowerCase() === "idle",
    });

    const closest: RoomObject = idleFlag[0] ?? Finder.findClosestTo(this.creep, spawners);

    memory.idling = (memory.idling ?? 0) + 1;
    if (memory.idling >= 50) {
      // Logger.warn(`Creep '${this.creep.name}' is idling for too long.`);
    }
    if (!this.creep.pos.isNearTo(closest.pos)) {
      this.icreep.moveToTarget(closest);

      return;
    }

    memory.tick = (memory.tick ?? 0) + 1;

    if (memory.tick % 2 === 0) {
      return HealerStateThinking;
    }
    return;
  }
}
