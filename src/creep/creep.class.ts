import { CreepStateMachine } from "./statemachine/creep-statemachine";

export class ICreep {
  get creep(): Creep {
    return Game.creeps[this.name];
  }

  get id() {
    return this.creep.id;
  }

  public stateMachine?: CreepStateMachine;

  constructor(
    public name: string,
    public stroke = "#ffffff",
    stateMachine?: CreepStateMachine,
  ) {
    this.stateMachine = stateMachine;
  }

  public canRun() {
    if (this.creep.spawning) {
      return false;
    }

    return true;
  }

  public moveTo(x: number, y: number, opts?: MoveToOpts) {
    return this.creep.moveTo(x, y, { ...opts, visualizePathStyle: { stroke: this.stroke } });
  }

  public moveToTarget(target: RoomPosition | { pos: RoomPosition }, opts?: MoveToOpts) {
    return this.creep.moveTo(target, { ...opts, visualizePathStyle: { stroke: this.stroke } });
  }

  public getMemory<T>(): TCreepMemory & T {
    return <TCreepMemory & T>Memory.creeps[this.name || this.id];
  }

  public run() {
    if (this.canRun()) {
      this.stateMachine?.update();
    }
  }
}
