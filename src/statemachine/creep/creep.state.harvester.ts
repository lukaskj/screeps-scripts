import {CreepState} from "statemachine/creep/base-creep.state";
import {ICreep} from "../../creep.class";
import {BaseState} from "../statemachine";
import {CreepStateThinking} from "./creep.state.thinking";
import {Finder} from "utils/finder";

export class CreepStateHarvester extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "⛏️", "harvester");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const icreep = this.ref;
    const creep = icreep.creep;

    if (creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES_ACTIVE);

      const closest = Finder.findClosestTo(creep, sources);
      const result = creep.harvest(closest);

      if (result == ERR_NOT_IN_RANGE) {
        icreep.moveToTarget(closest);
      }
      if (result != OK) {
        return CreepStateThinking;
      }
    } else {
      return CreepStateThinking;
    }
  }
}
