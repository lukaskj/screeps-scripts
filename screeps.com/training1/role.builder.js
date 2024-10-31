const ICreep = require("creep.class");

class Builder extends ICreep {
  static role = "builder";

  run() {
    console.log("BUILDER", this.creep.name);
  }
}

module.exports = Builder;
