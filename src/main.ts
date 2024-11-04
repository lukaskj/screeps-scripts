import { CreepController } from "./creep.controller";
import { SpawnController } from "./spawn.controller";
import { UI } from "./ui";
import { ErrorMapper } from "./utils/error-mapper";
import { Helper } from "./utils/helpers";

export const loop = ErrorMapper.wrapLoop(() => {
  Helper.initializeMemory();
  CreepController.cleanMemory();

  SpawnController.update();
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    CreepController.from(creep).run();
  }

  UI.draw();
});
