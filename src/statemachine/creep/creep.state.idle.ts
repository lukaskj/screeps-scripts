import { ICreep } from "../../creep.class";
import { BaseState } from "../statemachine";
import { CreepState, CreepStateThinking } from ".";
import { Logger } from "logger";

export class CreepStateIdle extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "💤", "idle");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const memory = this.getMemory();

    memory.idling = (memory.idling ?? 0) + 1;
    if (memory.idling >= 50) {
      Logger.warn(`Creep '${this.creep.name}' is idling for too long.`);
    }

    memory.tick = (memory.tick ?? 0) + 1;

    if (memory.tick % 2 === 0) {
      return CreepStateThinking;
    }
    return;
  }
}
