const {ROLES} = require("./constants");

const spawns = {
  [ROLES.Harvester]: {
    total: 2,
    body: [WORK, CARRY, MOVE],
    options: {},
    priority: 1,
  },
};

function run() {
  for (const role in spawns) {
    const spawnData = spawns[role];
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
