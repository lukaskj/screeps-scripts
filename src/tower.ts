import { Logger } from "./logger";
import { Finder } from "./utils";

export class Tower {
  public static update(): void {
    Finder.allRooms().forEach((room) => {
      const towers = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_TOWER,
      });

      for (const tower of towers) {
        const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
          tower.attack(target);

          Logger.warn(`Tower ${tower.id} is attacking ${target.name}.`);
        }
      }
    });
  }
}
