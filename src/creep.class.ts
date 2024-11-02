export class ICreep {
  get creep() {
    return Game.creeps[this.name];
  }

  constructor(public name: string, public stroke = "#ffffff") {}

  public canRun() {
    if (this.creep.spawning) {
      console.log("SPAWNING", this.creep.name);

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
    console.log("No controller found for creep", this.creep.name);
  }
}
