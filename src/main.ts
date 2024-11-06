import { CreepController } from "./creep.controller";
import { SpawnController } from "./spawn.controller";
import { Tower } from "./tower";
import { UI } from "./ui";
import { Helper } from "./utils/helpers";

function wrapLoop(loop: () => void): () => void {
  return () => {
    try {
      loop();
    } catch (e) {
      if (e instanceof Error) {
        console.log(`<span style='color:red'>${_.escape(e.stack)}</span>`);
      } else {
        // can't handle it
        throw e;
      }
    }
  };
}

export const loop = wrapLoop(() => {
  Helper.initializeMemory();
  CreepController.cleanMemory();

  SpawnController.update();
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    CreepController.from(creep).run();
  }

  Tower.update();

  UI.draw();
});
