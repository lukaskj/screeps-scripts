import {ICreep} from "./creep.class";
import {Builder} from "./role.builder";
import {Harvester} from "./role.harvester";
import {Upgrader} from "./role.upgrader";

const allCreeps = new Map<string, ICreep>();

const ByRole = {
  // [Harvester.role]: Harvester,
  // [Builder.role]: Builder,
  // [Upgrader.role]: Upgrader,
};

export class CreepController {
  public static from(creep: Creep): ICreep {
    if (!allCreeps.has(creep.name)) {
      // console.log(`CREATING NEW INSTANCE FOR ${creep.name}`, allCreeps.size);
      let clazz: ClassConstructor<ICreep> = ByRole[creep.memory.role];
      if (!clazz) clazz = ICreep;

      allCreeps.set(creep.name, new clazz(creep.name));
    }

    return allCreeps.get(creep.name) as ICreep;
  }

  public static cleanMemory() {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
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
