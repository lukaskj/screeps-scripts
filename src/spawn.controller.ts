import { MAX_TICKS_WITHOUT_SPAWN, spawnsData } from "./constants/spawns-data";
import { Logger } from "./logger";
import { Utils } from "./utils";
import { Finder } from "./utils/finder";

export class SpawnController {
  public static update() {
    let spawned = false;

    if (Object.values(Game.spawns).length) {
      this.createMinerConstructionSite(Object.values(Game.spawns)[0]);
    }

    for (const spawnName in Game.spawns) {
      const spawner = Game.spawns[spawnName];

      if (!Memory.spawns) Memory.spawns = {};
      Memory.spawns[spawnName] = Memory.spawns[spawnName] ?? {};

      const memory = Memory.spawns[spawnName];
      memory.ticksWithoutSpawn = memory.ticksWithoutSpawn ?? 0;

      const allRoleCreepsSpawned = Finder.getCreepRolesReport(spawner.room);

      const prioritySpawns = _.sortBy(spawnsData, "priority");
      // console.log("priority", prioritySpawns[0].role);

      try {
        for (const spawnData of prioritySpawns) {
          const role = spawnData.role;
          const spec = spawnData.spec;
          const room = spawner.room;
          const currentRolesSpawnedInRoom = allRoleCreepsSpawned[role] ?? 0;
          let energyToSpawn = room.energyCapacityAvailable;

          // Custom spawn verification
          const canSpawn = typeof spawnData.canSpawn === "function" ? spawnData.canSpawn(room) : spawnData.canSpawn;
          if (!canSpawn) continue;

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

  private static createMinerConstructionSite(spawner: StructureSpawn) {
    const name = spawner.name;
    const room = spawner.room;
    if (!Memory.spawns) Memory.spawns = {};
    Memory.spawns[name] = Memory.spawns[name] ?? {};

    const memory = Memory.spawns[name];

    const MAX_SOURCE_RANGE = 15;

    if (memory.allSourcesWithContainer) {
      return;
    }

    const energySourcesInRange = Finder.availableEnergySources(room).filter((source) =>
      source.pos.inRangeTo(spawner, MAX_SOURCE_RANGE),
    );
    const energySourcesWithoutContainer = energySourcesInRange.filter(
      (source) =>
        source.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: (strucure) => strucure.structureType === STRUCTURE_CONTAINER,
        }).length === 0,
    );
    const energySourcesWithContainerConstructionSite = energySourcesInRange.filter(
      (source) =>
        source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1, {
          filter: (site) => site.structureType === STRUCTURE_CONTAINER,
        }).length > 0,
    );

    const sourcesToBuildContainer = energySourcesWithoutContainer.filter(
      (source) => !energySourcesWithContainerConstructionSite.some((sourceWithCon) => sourceWithCon.id === source.id),
    );

    if (energySourcesInRange.length && !sourcesToBuildContainer.length) {
      memory.allSourcesWithContainer = true;

      return;
    }

    let allContructionSitesCreated = true;
    for (const sourceToBuild of sourcesToBuildContainer) {
      let i = 1;
      const path = sourceToBuild.pos.findPathTo(spawner);
      if (!path.length) {
        Logger.error(`Cannot find path from source '${sourceToBuild.id}' to spawner '${spawner.name}'.`);

        continue;
      }

      const pos = path[0];
      room.visual.text(`${i++}`, pos.x, pos.y);
      const createResult = room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);

      if (createResult === OK) {
        continue;
      } else {
        allContructionSitesCreated = false;
        Logger.error(
          `Error creating construction site at (${pos.x},${pos.y}) for source '${sourceToBuild.id}: ${createResult}'`,
        );

        continue;
      }
    }

    if (allContructionSitesCreated) {
      memory.allSourcesWithContainer = true;

      return;
    }
  }
}
