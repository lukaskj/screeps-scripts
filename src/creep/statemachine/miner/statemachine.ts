import { RoleMiner } from "../../roles/role.miner";
import { CreepStateMachine } from "../creep-statemachine";
import { MinerStateMine } from "./miner.state.mine";
import { MinerStateMoveToContainer } from "./miner.state.move-to-container";

export class MinerStateMachine extends CreepStateMachine {
  constructor(ref: RoleMiner) {
    super([MinerStateMoveToContainer, MinerStateMine], ref);
  }
}
