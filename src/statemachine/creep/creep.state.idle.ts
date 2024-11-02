import {ICreep} from "../../creep.class";
import {BaseState} from "../statemachine";
import {CreepState, CreepStateThinking} from ".";

export class CreepStateIdle extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "💤");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const memory = this.getMemory();

    memory.tick = (memory.tick ?? 0) + 1;

    if (memory.tick % 5 === 0) {
      return CreepStateThinking;
    }
    return;
  }
}
