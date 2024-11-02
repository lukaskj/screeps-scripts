import {Builder} from "./role.builder";
import {Harvester} from "./role.harvester";
import {Upgrader} from "./role.upgrader";
import {Utils} from "./utils";

const spawns: TSpawnController = [
  {
    role: "worker",
    total: 1,
    body: [WORK, CARRY, MOVE],
    options: {},
    priority: 0,
  },
  {
    role: Harvester.role,
    total: 0,
    body: [WORK, CARRY, MOVE],
    options: {},
    priority: 0,
  },
  {
    role: Upgrader.role,
    total: 0,
    body: [WORK, CARRY, MOVE],
    options: {},
    priority: 1,
  },
  {
    role: Builder.role,
    total: 0,
    body: [WORK, CARRY, MOVE],
    options: {},
    priority: 2,
  },
];

const prioritySpawns = _.sortBy(spawns, "priority");

export class SpawnController {
  public static update() {
    for (const spawnData of prioritySpawns) {
      const role = spawnData.role;
      const allRoleCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);

      if (allRoleCreeps.length < spawnData.total) {
        const newName = `${role}-${Game.time}`;
        const spawner = Utils.getAvailableSpawner();
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
