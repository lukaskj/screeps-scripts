const ICreep = require("creep.class");

class Builder extends ICreep {
  run() {
    console.log("BUILDER", this.creep.name);
  }
}

module.exports = Builder;
