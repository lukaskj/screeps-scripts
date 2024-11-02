import {CreepState} from "statemachine/creep/base-creep.state";
// import {CreepStateHarvester, CreepStateIdle, CreepStateThinking} from ".";
import {CreepStateHarvester, CreepStateIdle, CreepStateThinking} from "statemachine/creep";
import {ICreep} from "../../creep.class";
import {StateMachine} from "../statemachine";

export class CreepStateMachine extends StateMachine<ICreep, CreepState> {
  constructor(ref: ICreep) {
    super([CreepStateIdle, CreepStateThinking, CreepStateHarvester], ref);
  }

  public override update(): void {
    super.update();

    // Logger.info(Utils.getCreepSpecializationReport(this.ref.creep.room));

    if (this.currentState && !!this.currentState.status) {
      const pos = this.ref.creep.pos;
      this.ref.creep.room.visual.text(this.currentState.status, pos.x + 0.5, pos.y - 0.5, {font: "16px", opacity: 0.7});
    }
  }
}

const STRUCTURES_TO_TRANSFER = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];
