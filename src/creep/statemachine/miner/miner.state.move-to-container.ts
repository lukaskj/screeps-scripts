import { Logger } from "../../../logger";
import { BaseState } from "../../../statemachine";
import { RoleMiner } from "../../roles/role.miner";
import { CreepState } from "../base-creep.state";
import { MinerStateMine } from "./miner.state.mine";

export class MinerStateMoveToContainer extends CreepState {
  constructor(ref: RoleMiner) {
    super(ref, "🏃", "miner", "idle");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const icreep = this.icreep;
    const creep = this.creep;
    const memory = this.getMemory();

    if (!memory.minerContainerId) {
      Logger.error(`Miner '${creep.name}' spawned without assigned containerId.`);

      return;
    }

    const assignedContainerToMine = Game.getObjectById<StructureContainer>(memory.minerContainerId);

    if (!assignedContainerToMine) {
      Logger.error(`Container ID not found. '${memory.minerContainerId}'.`);

      return;
    }

    if (!assignedContainerToMine.pos.isEqualTo(creep.pos)) {
      const moveResult = icreep.moveToTarget(assignedContainerToMine);
      if (moveResult === ERR_TIRED) {
        return;
      }
      if (moveResult !== OK) {
        Logger.error(
          `Error moving miner '${creep.name}' to container '${assignedContainerToMine.id}' at (${assignedContainerToMine.pos.x},${assignedContainerToMine.pos.y}). Error: ${moveResult}`,
        );

        return;
      }
    } else {
      // In place to mine
      return MinerStateMine;
    }
  }
}
