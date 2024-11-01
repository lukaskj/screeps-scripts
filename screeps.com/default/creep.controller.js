const ICreep = require("./creep.class");
const Harvester = require("./role.harvester");
const Builder = require("./role.builder");
const Upgrader = require("./role.upgrader");

const ByRole = {
  [Harvester.role]: Harvester,
  [Builder.role]: Builder,
  [Upgrader.role]: Upgrader,
};

const allCreeps = new Map();

function from(creep) {
  if (!allCreeps.has(creep.name)) {
    Game.notify("Instance created");
    // console.log(`CREATING NEW INSTANCE FOR ${creep.name}`, allCreeps.size);
    let clazz = ByRole[creep.memory.role];
    if (!clazz) clazz = ICreep;

    allCreeps.set(creep.name, new clazz(creep.name));
  }

  return allCreeps.get(creep.name);
}

function cleanMemory() {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      console.log("Clearing non-existing creep memory:", name);
      delete Memory.creeps[name];

      if (allCreeps.has(name)) {
        console.log("Clearing ICreep instance:", name);
        allCreeps.delete(name);
      }
    }
  }
}

module.exports = {
  from,
  cleanMemory,
  ByRole,
};
