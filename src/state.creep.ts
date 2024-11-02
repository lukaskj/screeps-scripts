import {ICreep} from "./creep.class";
import {BaseState, StateMachine} from "./statemachine";

export class CreepStateMachine extends StateMachine<ICreep, CreepBaseState> {
  constructor(ref: ICreep) {
    super([CreepStateIdle, CreepStateThinking], ref);
  }

  public override update(): void {
    super.update();

    if (this.currentState && !!this.currentState.status) {
      const pos = this.ref.creep.pos;
      this.ref.creep.room.visual.text(this.currentState.status, pos.x + 0.5, pos.y - 0.5, {font: "16px", opacity: 0.7});
    }
  }
}

export abstract class CreepBaseState extends BaseState<ICreep> {
  constructor(ref: ICreep, public status: string = "") {
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
  constructor(ref: ICreep) {
    super(ref, "💤");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const memory = this.getMemory();

    memory.tick = (memory.tick ?? 0) + 1;

    if (memory.tick % 5 === 0) {
      return CreepStateThinking;
    }
    return;
  }
}

export class CreepStateThinking extends CreepBaseState {
  constructor(ref: ICreep) {
    super(ref, "💭");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const memory = this.getMemory();

    memory.tick = (memory.tick ?? 0) + 1;

    if (memory.tick % 3 === 0) {
      return CreepStateIdle;
    }
    return;
  }
}
