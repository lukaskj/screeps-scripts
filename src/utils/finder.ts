import { Utils } from ".";

const STRUCTURES_TO_TRANSFER_ENERGY = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];

export class Finder {
  public static findStructuresToTransferEnergy(room: Room) {
    return room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          STRUCTURES_TO_TRANSFER_ENERGY.includes(structure.structureType as any) &&
          "store" in structure &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });
  }

  public static findClosestTo<T extends RoomObject | { pos: RoomPosition }>(
    target: RoomObject | { pos: RoomPosition },
    objects: T[],
  ): T {
    const targetPost = target.pos;

    if (objects.length === 1) {
      return objects[0];
    }

    let closest = objects[0];
    let closestDistance = Infinity;
    for (const object of objects) {
      const distance = Utils.distance(targetPost, object.pos);
      if (distance < closestDistance) {
        closest = object;
        closestDistance = distance;
      }
    }

    return closest;
  }

  public static getCreepRolesReport(room: Room): Record<TCreepRoles, number> {
    const myCreeps = room.find(FIND_MY_CREEPS);

    return myCreeps.reduce(
      (report, creep) => {
        const creepMemory = <TCreepMemory>creep.memory;
        report[creepMemory.role] = (report[creepMemory.role] ?? 0) + 1;

        return report;
      },
      {} as Record<TCreepRoles, number>,
    );
  }

  public static getCreepSpecializationReport(room: Room): Record<TCreepSpecs, number> {
    return this.getCreepsFromRoom(room).reduce(
      (report, creep) => {
        const creepMemory = <TCreepMemory>creep.memory;
        report[creepMemory.spec] = (report[creepMemory.spec] ?? 0) + 1;

        return report;
      },
      {} as Record<TCreepSpecs, number>,
    );
  }

  public static getCreepFullRolesReport(room: Room): Record<string, number> {
    return this.getCreepsFromRoom(room).reduce(
      (report, creep) => {
        const creepMemory = <TCreepMemory>creep.memory;
        report[creepMemory.role] = (report[creepMemory.role] ?? 0) + 1;
        report[`${creepMemory.role}/${creepMemory.spec}`] =
          (report[`${creepMemory.role}/${creepMemory.spec}`] ?? 0) + 1;

        return report;
      },
      {} as Record<string, number>,
    );
  }

  public static getCreepsFromRoom(room: Room): Creep[] {
    return room.find(FIND_MY_CREEPS, {
      filter: (creep: Creep) => {
        const memory = <TCreepMemory>creep.memory;
        return memory.room === room.name;
      },
    });
  }

  public static availableEnergySites(room: Room) {
    return room.find(FIND_SOURCES_ACTIVE, {
      filter: (source) => source.energy >= 1,
    });
  }

  public static droppedResources(room: Room) {
    return room.find(FIND_TOMBSTONES && FIND_DROPPED_RESOURCES, {
      filter: (tombstone) => (tombstone instanceof Tombstone ? tombstone.store[RESOURCE_ENERGY] >= 1 : true),
    });
  }

  public static getMyConstructionSites(room: Room) {
    return room.find(FIND_MY_CONSTRUCTION_SITES);
  }

  public static getAvailableSpawner(_room?: Room) {
    for (const spawnName in Game.spawns) {
      if (Game.spawns[spawnName]) {
        return Game.spawns[spawnName];
      }
    }
  }

  public static allRooms() {
    return Object.values(Game.rooms);
  }
}
