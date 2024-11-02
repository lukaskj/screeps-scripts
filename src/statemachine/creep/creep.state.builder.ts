import {CreepState} from ".";
import {BaseState} from "../statemachine";

export class CreepStateBuilder extends CreepState {
  override update(): ClassConstructor<BaseState> | undefined {
    throw new Error("Method not implemented.");
  }
}
