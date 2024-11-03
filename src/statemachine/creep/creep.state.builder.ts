import {ICreep} from "creep.class";
import {CreepState} from ".";
import {BaseState} from "../statemachine";

export class CreepStateBuilder extends CreepState {
  constructor(ref: ICreep) {
    super(ref, "🔨", "builder");
  }

  override update(): ClassConstructor<BaseState> | undefined {
    throw new Error("Method not implemented.");
  }
}
