import {Finder} from "utils/finder";

const spawns: TSpawnController = [
  {
    role: "worker",
    spec: "idle",
    max: 10,
    body: [WORK, CARRY, MOVE],
    options: {},
    priority: 0,
  },
];

const prioritySpawns = _.sortBy(spawns, "priority");

export class SpawnController {
  public static update() {
    for (const spawnData of prioritySpawns) {
      const role = spawnData.role;
      const allRoleCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);

      if (allRoleCreeps.length < spawnData.max) {
        const newName = `${role}-${Game.time}`;
        const spawner = Finder.getAvailableSpawner();

        if (!spawner) {
          console.log("No available spawner to spawn a", role);
          continue;
        }

        const result = spawner.spawnCreep(spawnData.body, newName, {...spawnData.options, memory: {role}});
        if (result === OK) {
          console.log(`Spawning new ${role} at ${spawner.name}:`, newName);
          break;
        }
      }
    }
  }
}
