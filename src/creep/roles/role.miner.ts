import { Finder } from "../../utils";
import { ICreep } from "../creep.class";
import { MinerStateMachine } from "../statemachine/miner/statemachine";

export class RoleMiner extends ICreep {
  constructor(name: string) {
    super(name, "#FFC107");
    this.stateMachine = new MinerStateMachine(this);
  }
  public override run(): void {
    super.run();
    
    if (!this.creep.spawning) {
      return;
    }

    const memory = this.getMemory();
    if (memory.minerContainerId) {
      return;
    }

    const availableContainersToMine = Finder.availableContainersToMine(this.creep.room);
    if (!availableContainersToMine.length) {
      return;
    }

    const closestContainer = Finder.findClosestTo(this.creep, availableContainersToMine);
    if (!closestContainer) {
      return;
    }

    memory.minerContainerId = closestContainer.id;
  }
}
