import {Logger} from "./logger";

export class StateMachine<T = unknown> {
  private states = new Map<string, BaseState<T>>();

  private currentState: BaseState<T>;

  constructor(stateClassList: ClassConstructor<BaseState<T>>[], initialState: ClassConstructor<BaseState<T>>, public ref: T) {
    for (const stateClass of stateClassList) {
      this.states.set(stateClass.name, new stateClass(ref));
    }

    this.currentState = <BaseState<T>>this.states.get(initialState.name);
  }

  public update(): void {
    const nextState = this.currentState.update();
    if (nextState) {
      if (this.states.has(nextState.name)) {
        const prevState = this.currentState;
        this.currentState = <BaseState<T>>this.states.get(nextState.name);

        prevState.onExit(this.currentState);
        this.currentState.onEnter(prevState);
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
