import {ICreep} from "./creep.class";
import {CreepController} from "./creep.controller";
import {BaseState} from "./statemachine/statemachine";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export class Utils {
  static allRooms() {
    return Object.values(Game.rooms);
  }

  static formatDate(date: Date) {
    return dateFormatter.format(date);
  }

  static getAvailableSpawner() {
    for (const spawnName in Game.spawns) {
      if (Game.spawns[spawnName]) {
        return Game.spawns[spawnName];
      }
    }
  }

  static getStateMachineMemoryFor<T extends IStateMachineMemory>(refName: string): T {
    if (!Memory.states) {
      Memory.states = {};
    }

    return <T>Memory.states[refName];
  }

  static getStateMemoryFor<T extends any>(refName: string, state: ClassConstructor<BaseState> | string): T {
    if (!Memory.states) {
      Memory.states = {};
    }

    if (!Memory.states[refName]) {
      Memory.states[refName] = {currentState: ""};
    }

    let stateName = typeof state !== "string" ? state.name : state;
    if (!Memory.states[refName][stateName]) {
      Memory.states[refName][stateName] = {};
    }

    return <T>Memory.states[refName][stateName];
  }

  public static distance(point1: RoomPosition, point2: RoomPosition) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
  }
}
