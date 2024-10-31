const Builder = require("./role.builder");
const Harvester = require("./role.harvester");
const Upgrader = require("./role.upgrader");

const spawns = [
  {
    role: Harvester.role,
    total: 2,
    body: [WORK, CARRY, MOVE],
    options: {},
    priority: 0,
  },
  {
    role: Upgrader.role,
    total: 4,
    body: [WORK, CARRY, MOVE],
    options: {},
    priority: 2,
  },
  {
    role: Builder.role,
    total: 1,
    body: [WORK, CARRY, MOVE],
    options: {},
    priority: 1,
  },
];

const prioritySpawns = _.sortBy(spawns, "priority");

function run() {
  for (const spawnData of prioritySpawns) {
    const role = spawnData.role;
    const allRoleCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);

    if (allRoleCreeps.length < spawnData.total) {
      const newName = `${role}-${Game.time}`;
      const spawner = getAvailableSpawner();
      if (!spawner) {
        console.log("No available spawner to spawn a", role);
        continue;
      }

      const result = spawner.spawnCreep(spawnData.body, newName, {...spawnData.options, memory: {role}});
      if (result === OK) {
        console.log(`Spawning new ${role} at ${spawner.name}:`, newName);
      }
    }
  }
}

function getAvailableSpawner() {
  for (const spawnName in Game.spawns) {
    if (Game.spawns[spawnName]) {
      return Game.spawns[spawnName];
    }
  }
}

module.exports = {
  run,
};
