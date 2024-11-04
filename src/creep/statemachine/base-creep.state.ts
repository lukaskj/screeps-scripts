import { ICreep } from "../creep.class";
import { BaseState } from "../../statemachine/statemachine";

export abstract class CreepState extends BaseState<ICreep> {
  public status = "";

  constructor(
    ref: ICreep,
    status: string = "",
    public role: TCreepRoles = "worker",
    public spec: TCreepSpecs = "idle",
  ) {
    super(ref);
    this.status = status;

    const memory = this.getMemory();

    if (!memory) {
      Object.assign(memory, { role, spec, room: "" } satisfies TCreepMemory);
    }

    if (!memory.role) {
      memory.role = role;
    }

    if (!memory.spec) {
      memory.spec = spec;
    }
  }

  get creep(): Creep {
    return this.ref.creep;
  }

  get icreep(): ICreep {
    return this.ref;
  }

  public override onEnter(_prevState: CreepState): void {
    this.getMemory().spec = this.spec;
  }

  protected getMemory<T>(): TCreepMemory & T {
    return this.icreep.getMemory<T>();
  }
}
