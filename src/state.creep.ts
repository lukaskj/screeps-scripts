import {BaseState, StateMachine} from "./statemachine";

export class CreepStateMachine extends StateMachine<Creep, CreepBaseState> {
  public override update(): void {
    super.update();

    if (this.currentState && !!this.currentState.status) {
      const pos = this.ref.pos;
      this.ref.room.visual.text(this.currentState.status, pos.x + 0.5, pos.y - 0.5, {font: "16px", opacity: 0.7});
    }
  }
}

export abstract class CreepBaseState extends BaseState<Creep> {
  constructor(ref: Creep, public status: string = "") {
    super(ref);

    const memory = this.getMemory();

    if (!memory) {
      Object.assign(memory, {role: "worker", specialization: "idle"} satisfies TCreepMemory);
    }

    if (!memory.role) {
      memory.role = "worker";
    }

    if (!memory.specialization) {
      memory.specialization = "idle";
    }
  }

  protected getMemory(): TCreepMemory {
    return <TCreepMemory>Memory.creeps[this.getNameOrId()];
  }
}

export class CreepStateIdle extends CreepBaseState {
  constructor(ref: Creep) {
    super(ref, "💭");
    // super(ref, "❓");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    return;
  }
}
