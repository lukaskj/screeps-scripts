import {CreepController} from "./creep.controller";
import {Logger} from "./logger";
import {SpawnController} from "./spawn.controller";
import {UI} from "./ui";

function loop() {
  CreepController.cleanMemory();

  SpawnController.update();
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    CreepController.from(creep).run();
  }

  // switch (Game.time % 3) {
  //   case 0:
  //     Logger.error("Worked", Game.time);
  //     break;
  //   case 1:
  //     Logger.warn("Worked", Game.time);
  //     break;
  //   case 2:
  //     Logger.info("Worked", Game.time);
  //     break;
  // }

  UI.update();
}

export {loop};
