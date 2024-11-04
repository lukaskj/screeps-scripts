import { CreepStateBuilder, CreepStateHarvester, CreepStateIdle, CreepStateThinking, CreepStateUpgrader } from ".";
import { ICreep } from "../../creep.class";
import { CreepStateMachine } from "../creep-statemachine";
import { CreepStateTransfer } from "./creep.state.transfer";

export class WorkerStateMachine extends CreepStateMachine {
  constructor(ref: ICreep) {
    super(
      [
        CreepStateIdle,
        CreepStateThinking,
        CreepStateHarvester,
        CreepStateUpgrader,
        CreepStateTransfer,
        CreepStateBuilder,
      ],
      ref,
    );
  }
}
