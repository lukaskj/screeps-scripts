import {ICreep} from "creep.class";
import {Finder} from "utils/finder";
import {CreepState, CreepStateHarvester, CreepStateThinking} from ".";
import {BaseState} from "../statemachine";

export class CreepStateBuilder extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "🔨", "builder");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    const creep = this.creep;
    const icreep = this.icreep;
    const room = creep.room;

    if (creep.store[RESOURCE_ENERGY] == 0) {
      return CreepStateHarvester;
    }

    const constructionSites = Finder.getMyConstructionSites(room);
    if (!constructionSites.length) {
      return CreepStateThinking;
    }

    const closest = Finder.findClosestTo(creep, constructionSites);

    const result = creep.build(closest);

    switch (result) {
      case OK:
        return;
      case ERR_NOT_IN_RANGE:
        icreep.moveToTarget(closest);
        return;
      default:
        return CreepStateThinking;
    }
  }
}
