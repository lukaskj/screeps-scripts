import { Utils } from "./utils";
import { Finder } from "./utils/finder";

const spawns: TSpawnController = [
  {
    role: "worker",
    spec: "idle",
    max: 10,
    body: [WORK, CARRY, MOVE, WORK, MOVE, CARRY, WORK, WORK, MOVE],
    options: {},
    priority: 0,
  },
];

const prioritySpawns = _.sortBy(spawns, "priority");

export class SpawnController {
  public static update() {
    for (const spawnName in Game.spawns) {
      const spawner = Game.spawns[spawnName];

      const allRoleCreeps = Finder.getCreepRolesReport(spawner.room);

      for (const spawnData of prioritySpawns) {
        const role = spawnData.role;

        if ((allRoleCreeps[role] ?? 0) < spawnData.max) {
          const newName = `${role}-${Game.time}`;

          const creepBodyParts = Utils.calculateMaxBodyPartsForRoom(spawner.room, spawnData.body);
          if (!creepBodyParts) {
            console.log("Cannot spawn", spawnData.body, "at", spawner.room.name);

            continue;
          }

          const partsCost = Utils.calculateBodyPartsCost(creepBodyParts);

          if (partsCost > spawner.room.energyAvailable) {
            if (!spawner.spawning) {
              console.log(
                "Cannot spawn",
                creepBodyParts,
                `(cost: ${partsCost} available: ${spawner.room.energyAvailable})`,
                "at",
                spawner.room.name,
              );
            }

            continue;
          }

          const result = spawner.spawnCreep(spawnData.body, newName, { ...spawnData.options, memory: { role } });
          if (result === OK) {
            console.log(`Spawning new ${role} at ${spawner.name}:`, newName);
            break;
          }
        }
      }
    }
  }
}
