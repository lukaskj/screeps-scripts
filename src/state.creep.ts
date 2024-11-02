import {BaseState, StateMachine} from "./statemachine";

export class CreepStateMachine extends StateMachine<Creep, CreepBaseState> {
  public override update(): void {
    super.update();

    if (this.currentState && !!this.currentState.status) {
      this.ref.say(String(this.currentState.status));
    }
  }
}

export abstract class CreepBaseState extends BaseState<Creep> {
  constructor(ref: Creep, public status: string = "") {
    super(ref);
  }
}

export class CreepStateIdle extends CreepBaseState {
  constructor(ref: Creep) {
    super(ref, "❓");
  }
  override update(): ClassConstructor<BaseState> | undefined {
    console.log("update idle");
    return;
  }
}
