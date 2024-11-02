import {ErrorMapper} from "utils/error-mapper";
import {CreepController} from "./creep.controller";
import {SpawnController} from "./spawn.controller";
import {UI} from "./ui";

export const loop = ErrorMapper.wrapLoop(() => {
  CreepController.cleanMemory();

  SpawnController.update();
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    CreepController.from(creep).run();
  }

  UI.update();
});
