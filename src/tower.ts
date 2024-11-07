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
          const attackResult = tower.attack(target);
          if (attackResult === OK) {
            Logger.warn(`Tower ${tower.id} is attacking ${target.name}.`);
          }

          continue;
        }

        const toRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => structure.hits < structure.hitsMax,
        });

        if (toRepair) {
          const repairResult = tower.repair(toRepair);

          if (repairResult === OK) {
            continue;
          }
        }

        const toHeal = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
          filter: (creep) => creep.hits < creep.hitsMax,
        });

        if (toHeal) {
          const repairResult = tower.heal(toHeal);

          if (repairResult === OK) {
            continue;
          }
        }
      }
    });
  }
}
