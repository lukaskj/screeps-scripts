import {ICreep} from "./creep.class";
import {CreepStateHarvester} from "./creep.state.harvester";
import {CreepStateIdle} from "./creep.state.idle";
import {CreepStateThinking} from "./creep.state.thinking";
import {BaseState, StateMachine} from "./statemachine";

export class CreepStateMachine extends StateMachine<ICreep, CreepState> {
  constructor(ref: ICreep) {
    super([CreepStateIdle, CreepStateThinking, CreepStateHarvester], ref);
  }

  public override update(): void {
    super.update();

    // Logger.info(Utils.getCreepSpecializationReport(this.ref.creep.room));

    if (this.currentState && !!this.currentState.status) {
      const pos = this.ref.creep.pos;
      this.ref.creep.room.visual.text(this.currentState.status, pos.x + 0.5, pos.y - 0.5, {font: "16px", opacity: 0.7});
    }
  }
}

export abstract class CreepState extends BaseState<ICreep> {
  get creep(): Creep {
    return this.ref.creep;
  }

  get icreep(): ICreep {
    return this.ref;
  }

  constructor(ref: ICreep, public status: string = "") {
    super(ref);

    const memory = this.getMemory();

    if (!memory) {
      Object.assign(memory, {role: "worker", specialization: "idle", step: {}} satisfies TCreepMemory);
    }

    if (!memory.role) {
      memory.role = "worker";
    }

    if (!memory.specialization) {
      memory.specialization = "idle";
    }
  }

  public override onEnter(prevState: CreepState): void {
    const memory = this.getMemory();
    memory.specialization = "harvester";
  }

  protected getMemory<T>(): TCreepMemory & T {
    return this.icreep.getMemory<T>();
  }
}

const STRUCTURES_TO_TRANSFER = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];
