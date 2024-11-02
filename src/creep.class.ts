import {CreepStateIdle, CreepStateMachine} from "./state.creep";

export class ICreep {
  get creep() {
    return Game.creeps[this.name];
  }

  private stateMachine: CreepStateMachine;

  constructor(public name: string, public stroke = "#ffffff") {
    this.stateMachine = new CreepStateMachine([CreepStateIdle], this.creep);
  }

  public canRun() {
    if (this.creep.spawning) {
      return false;
    }

    return true;
  }

  public moveTo(x: number, y: number, opts?: MoveToOpts) {
    return this.creep.moveTo(x, y, {...opts, visualizePathStyle: {stroke: this.stroke}});
  }

  public moveToTarget(target: RoomPosition | {pos: RoomPosition}, opts?: MoveToOpts) {
    return this.creep.moveTo(target, {...opts, visualizePathStyle: {stroke: this.stroke}});
  }

  public run() {
    if (this.canRun()) {
      this.stateMachine.update();
    }
  }
}
