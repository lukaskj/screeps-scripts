import { Logger } from "../../../logger";
import { BaseState } from "../../../statemachine";
import { RoleMiner } from "../../roles/role.miner";
import { CreepState } from "../base-creep.state";

export class MinerStateMine extends CreepState {
  constructor(ref: RoleMiner) {
    super(ref, "⛏️", "miner", "mining");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const creep = this.creep;
    const memory = this.getMemory();

    if (!memory.minerSourceId) {
      const sources = creep.pos.findInRange(FIND_SOURCES_ACTIVE, 1);
      if (!sources.length) {
        Logger.error(
          `Source from memory not found to mine at range 1. Miner: ${creep.name}. Pos: (${creep.pos.x},${creep.pos.y}).`,
        );

        return;
      }

      memory.minerSourceId = sources[0].id;
    }

    const sourceToMine = Game.getObjectById<Source>(memory.minerSourceId);

    if (!sourceToMine) {
      Logger.error(`Source not found to mine at range 1. Miner: ${creep.name}. Pos: (${creep.pos.x},${creep.pos.y}).`);

      return;
    }

    creep.harvest(sourceToMine);
    return;
  }
}
