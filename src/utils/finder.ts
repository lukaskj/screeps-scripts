import {Utils} from "utils";

const STRUCTURES_TO_TRANSFER_ENERGY = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];

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

  public static findClosestTo<T extends RoomObject | {pos: RoomPosition}>(target: RoomObject | {pos: RoomPosition}, objects: T[]): T {
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
}
