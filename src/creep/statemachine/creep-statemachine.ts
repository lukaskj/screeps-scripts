import { StateMachine } from "../../statemachine";
import { ICreep } from "../creep.class";
import { CreepState } from "./base-creep.state";

export class CreepStateMachine extends StateMachine<ICreep, CreepState> {
  constructor(states: ClassConstructor<CreepState>[], ref: ICreep) {
    super(states, ref);
  }

  public override update(): void {
    super.update();

    if (this.currentState && !!this.currentState.status) {
      const pos = this.ref.creep.pos;
      this.ref.creep.room.visual.text(this.currentState.status, pos.x + 0.2, pos.y - 0.2, {
        font: "16px",
        opacity: 0.7,
      });
      // this.ref.creep.say(this.ref.getMemory().spec);
    }
  }
}
