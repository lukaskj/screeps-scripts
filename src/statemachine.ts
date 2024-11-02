import {Logger} from "./logger";
import {Utils} from "./utils";

export class StateMachine<U, T extends BaseState<U> = BaseState<U>> {
  private states = new Map<string, T>();

  protected currentState: T;

  constructor(stateClassList: ClassConstructor<T>[], protected ref: U, initialState?: ClassConstructor<T>) {
    for (const stateClass of stateClassList) {
      this.states.set(stateClass.name, new stateClass(ref));
    }

    if (!(<any>ref).name) {
      Logger.warn(`No 'name' for ref '${ref}'`);
    }

    const stateMemory = this.initState((<any>ref).name, stateClassList[0]?.name ?? initialState?.name);

    let initialStateName = stateMemory.currentState;

    this.currentState = <T>this.states.get(initialStateName);
  }

  private initState(name: string, currentStateName: string) {
    const currentState = Utils.getStateFor(name);
    if (!currentState) {
      Memory.states[name] = {currentState: currentStateName};
    }

    return Utils.getStateFor(name);
  }

  protected getState(stateKey: string) {
    return this.states.get(stateKey);
  }

  public update(): void {
    const nextState = this.currentState.update();
    if (nextState) {
      const stateMemory = Utils.getStateFor((<any>this.ref).name);
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

export abstract class BaseState<T = unknown> {
  constructor(public ref: T) {}

  public onEnter(prevState: BaseState<T>) {
    console.log(`Entered state: ${this.constructor.name}. Next state: ${prevState.constructor.name}`);
  }
  public onExit(nextState: BaseState<T>) {
    console.log(`Exited state: ${this.constructor.name}. Next state: ${nextState.constructor.name}`);
  }

  abstract update(): ClassConstructor<BaseState> | undefined;
}
