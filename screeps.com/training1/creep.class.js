class ICreep {
  name;
  stroke = "#ffffff";

  get creep() {
    return Game.creeps[this.name];
  }

  constructor(name) {
    this.name = name;
  }

  canRun() {
    if (this.creep.spawning) {
      console.log("SPAWNING", this.creep.name);

      return false;
    }

    return true;
  }

  moveTo(...args) {
    return this.creep.moveTo(...args, {visualizePathStyle: {stroke: this.stroke}});
  }

  run() {
    if (!this.canRun()) {
      return;
    }
    console.log("RUNNING", this.creep.name);
  }
}

module.exports = ICreep;
