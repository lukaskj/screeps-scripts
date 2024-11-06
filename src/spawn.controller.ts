import { spawnsData } from "./constants/spawns-data";
import { Logger } from "./logger";
import { Utils } from "./utils";
import { Finder } from "./utils/finder";

const prioritySpawns = _.sortBy(spawnsData, "priority");

export class SpawnController {
  public static update() {
    for (const spawnName in Game.spawns) {
      const spawner = Game.spawns[spawnName];

      const allRoleCreeps = Finder.getCreepRolesReport(spawner.room);

      for (const spawnData of prioritySpawns) {
        const role = spawnData.role;
        const spec = spawnData.spec;

        if ((allRoleCreeps[role] ?? 0) < spawnData.max) {
          const creepBodyParts = Utils.calculateMaxBodyPartsForRoom(
            spawner.room,
            spawnData.body,
            spawnData.minBodyParts,
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
            break;
          } else {
            Logger.error("Error when spawing", role, "at", spawner.name);
          }
        }
      }
    }
  }
}
