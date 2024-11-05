import { ICreep } from "../creep.class";
import { HealerStateMachine } from "../statemachine/healer/healer.statemachine";

export class RoleHealer extends ICreep {
  constructor(name: string) {
    super(name, "#29B6F6");
    this.stateMachine = new HealerStateMachine(this);
  }
}
