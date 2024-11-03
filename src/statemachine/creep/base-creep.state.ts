import {ICreep} from "creep.class";
import {BaseState} from "statemachine/statemachine";

export abstract class CreepState extends BaseState<ICreep> {
  get creep(): Creep {
    return this.ref.creep;
  }

  get icreep(): ICreep {
    return this.ref;
  }

  constructor(ref: ICreep, public status: string = "", public spec: TCreepSpecs = "idle") {
    super(ref);

    const memory = this.getMemory();

    if (!memory) {
      Object.assign(memory, {role: "worker", spec, step: {}} satisfies TCreepMemory);
    }

    if (!memory.role) {
      memory.role = "worker";
    }

    if (!memory.spec) {
      memory.spec = spec;
    }
  }

  public override onEnter(prevState: CreepState): void {
    this.getMemory().spec = this.spec;
  }

  protected getMemory<T>(): TCreepMemory & T {
    return this.icreep.getMemory<T>();
  }
}
