import {Logger} from "./logger";
import {Utils} from "./utils";

export class StateMachine<U, T extends BaseState<U> = BaseState<U>> {
  private states = new Map<string, T>();

  protected currentState: T;

  constructor(stateClassList: ClassConstructor<T>[], protected ref: U, initialState?: ClassConstructor<T>) {
    for (const stateClass of stateClassList) {
      this.states.set(stateClass.name, new stateClass(ref));
    }

    if (!(<any>ref).name && !(<any>ref).id) {
      Logger.warn(`No 'name' nor 'id' for ref '${ref}'`);
    }

    let shouldCallOnEnter = true;
    let stateMemory = Utils.getStateMemoryFor((<any>ref).name ?? (<any>ref).id);
    if (!stateMemory) {
      shouldCallOnEnter = true;
      stateMemory = this.initState((<any>ref).name, stateClassList[0]?.name ?? initialState?.name);
    }

    let currentStateName = stateMemory.currentState;

    this.currentState = <T>this.states.get(currentStateName);
  }

  private initState(name: string, currentStateName: string) {
    const currentState = Utils.getStateMemoryFor(name);
    if (!currentState) {
      Memory.states[name] = {currentState: currentStateName};
    }

    return Utils.getStateMemoryFor(name);
  }

  protected getState(stateKey: string) {
    return this.states.get(stateKey);
  }

  public update(): void {
    const nextState = this.currentState.update();
    if (nextState) {
      const stateMemory = Utils.getStateMemoryFor((<any>this.ref).name);
      if (this.states.has(nextState.name)) {
        const prevState = this.currentState;
        this.currentState = <T>this.states.get(nextState.name);

        prevState.onExit(this.currentState);
        this.currentState.onEnter(prevState);
        stateMemory.currentState = this.currentState.constructor.name;
      } else {
        Logger.error(`State not found: ${nextState.name}`);
      }
    }
  }
}

export abstract class BaseState<T = TStateReference> {
  constructor(public ref: T) {}

  public onEnter(prevState: BaseState<T>) {
    console.log(`Entered state: ${this.constructor.name}. Next state: ${prevState.constructor.name}`);
  }

  public onExit(nextState: BaseState<T>) {
    console.log(`Exited state: ${this.constructor.name}. Next state: ${nextState.constructor.name}`);
  }

  public getMemory() {
    const name = (<any>this.ref).name ? (<any>this.ref).name : (<any>this.ref).id ? (<any>this.ref).id : "";

    return Utils.getStateMemoryFor(name);
  }

  abstract update(): ClassConstructor<BaseState> | undefined;
}
