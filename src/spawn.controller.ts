import { MAX_TICKS_WITHOUT_SPAWN, spawnsData } from "./constants/spawns-data";
import { Logger } from "./logger";
import { Utils } from "./utils";
import { Finder } from "./utils/finder";

const prioritySpawns = _.sortBy(spawnsData, "priority");

type TSpawnMemory = SpawnMemory & { ticksWithoutSpawn?: number };
export class SpawnController {
  public static update() {
    let spawned = false;
    for (const spawnName in Game.spawns) {
      const spawner = Game.spawns[spawnName];

      if (!Memory.spawns) Memory.spawns = {};
      Memory.spawns[spawnName] = Memory.spawns[spawnName] ?? {};

      const memory = <TSpawnMemory>Memory.spawns[spawnName];
      memory.ticksWithoutSpawn = memory.ticksWithoutSpawn ?? 0;

      const allRoleCreeps = Finder.getCreepRolesReport(spawner.room);

      try {
        for (const spawnData of prioritySpawns) {
          const role = spawnData.role;
          const spec = spawnData.spec;
          const room = spawner.room;
          const currentRolesSpawnedInRoom = allRoleCreeps[role] ?? 0;
          let energyToSpawn = room.energyCapacityAvailable;

          if (currentRolesSpawnedInRoom < spawnData.max) {
            if (memory.ticksWithoutSpawn >= MAX_TICKS_WITHOUT_SPAWN && currentRolesSpawnedInRoom < spawnData.min) {
              Logger.info(
                `${memory.ticksWithoutSpawn} ticks without spawning a creep. Trying to spawn a '${role}' with available energy.`,
              );

              energyToSpawn = room.energyAvailable;
            }

            const creepBodyParts = Utils.calculateMaxBodyPartsForRoom(
              spawner.room,
              spawnData.body,
              spawnData.minBodyParts,
              energyToSpawn,
            );

            if (!creepBodyParts) {
              // console.log("Cannot spawn", spawnData.body, "at", spawner.room.name);

              continue;
            }

            const partsCost = Utils.calculateBodyPartsCost(creepBodyParts);

            if (partsCost > spawner.room.energyAvailable) {
              continue;
            }

            const newName = `${role}-${Game.time}`;
            const result = spawner.spawnCreep(creepBodyParts, newName, {
              ...spawnData.options,
              memory: { role, spec, room: spawner.room.name } satisfies TCreepMemory,
            });

            if (result === OK) {
              console.log(`Spawning new ${role} at ${spawner.name}:`, newName);
              spawned = true;

              break;
            } else {
              Logger.error("Error when spawing", role, "at", spawner.name);
            }
          }
        }
      } finally {
        if (spawned) {
          memory.ticksWithoutSpawn = 0;
        } else {
          memory.ticksWithoutSpawn++;
        }
      }
    }
  }
}
