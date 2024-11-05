import { ICreep } from "./creep/creep.class";
import { RoleWorker } from "./creep/roles";
import { RoleHealer } from "./creep/roles/role.healer";
import { Logger } from "./logger";

const allCreeps = new Map<string, ICreep>();

const ByRole: Record<TCreepRoles, ClassConstructor<ICreep>> = {
  worker: RoleWorker,
  healer: RoleHealer,
};

export class CreepController {
  public static from(creep: Creep): ICreep {
    if (!allCreeps.has(creep.name)) {
      let clazz: ClassConstructor<ICreep> = ByRole[creep.memory.role];
      if (!clazz) {
        Logger.warn(`No class for role ${creep.memory.role}`);

        clazz = ICreep;
      }

      allCreeps.set(creep.name, new clazz(creep.name));
    }

    return allCreeps.get(creep.name) as ICreep;
  }

  public static cleanMemory() {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        Logger.info(`Creep '${name}' died.`);
        console.log("Clearing non-existing creep memory:", name);
        delete Memory.creeps[name];

        if (allCreeps.has(name)) {
          console.log("Clearing ICreep instance:", name);
          allCreeps.delete(name);
        }
      }
    }

    for (const name in Memory.states) {
      if (!Game.creeps[name]) {
        console.log("Clearing non-existing state memory:", name);
        delete Memory.states[name];
      }
    }
  }
}
