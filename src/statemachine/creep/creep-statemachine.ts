import {CreepStateBuilder, CreepStateHarvester, CreepStateIdle, CreepStateThinking, CreepStateUpgrader} from "statemachine/creep";
import {CreepState} from "statemachine/creep/base-creep.state";
import {ICreep} from "../../creep.class";
import {StateMachine} from "../statemachine";
import {CreepStateTransfer} from "./creep.state.transfer";

export class CreepStateMachine extends StateMachine<ICreep, CreepState> {
  constructor(ref: ICreep) {
    super([CreepStateIdle, CreepStateThinking, CreepStateHarvester, CreepStateUpgrader, CreepStateTransfer, CreepStateBuilder], ref);
  }

  public override update(): void {
    super.update();

    if (this.currentState && !!this.currentState.status) {
      const pos = this.ref.creep.pos;
      this.ref.creep.room.visual.text(this.currentState.status, pos.x + 0.5, pos.y - 0.5, {font: "16px", opacity: 0.7});
      // this.ref.creep.say(this.ref.getMemory().spec);
    }
  }
}
