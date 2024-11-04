import { ICreep } from "../creep.class";
import { WorkerStateMachine } from "../statemachine/worker";

export class RoleWorker extends ICreep {
  constructor(name: string) {
    super(name, "#FF5722");
    this.stateMachine = new WorkerStateMachine(this);
  }
}
