import { ICreep } from "../../creep.class";
import { BaseState } from "../../../statemachine/statemachine";
import { CreepState } from "../base-creep.state";
import { CreepStateHarvester } from "./creep.state.harvester";
import { CreepStateThinking } from "./creep.state.thinking";

export class CreepStateUpgrader extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "⬆️", "worker", "upgrader");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const creep = this.creep;
    const icreep = this.icreep;

    if (!creep.room.controller) {
      return CreepStateThinking;
    }

    if (creep.store[RESOURCE_ENERGY] == 0) {
      return CreepStateHarvester;
    }

    const result = creep.upgradeController(creep.room.controller);

    if (result === ERR_NOT_IN_RANGE) {
      icreep.moveToTarget(creep.room.controller);

      return;
    }

    if (result !== OK) {
      return CreepStateThinking;
    }
  }
}
