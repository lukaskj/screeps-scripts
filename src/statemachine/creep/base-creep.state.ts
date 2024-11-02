import { ICreep } from "creep.class";
import { BaseState } from "statemachine/statemachine";

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
