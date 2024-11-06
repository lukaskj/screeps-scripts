import { BaseState } from "../statemachine/statemachine";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export class Utils {
  static formatDate(date: Date) {
    return dateFormatter.format(date);
  }

  static getStateMachineMemoryFor<T extends IStateMachineMemory>(refName: string): T {
    if (!Memory.states) {
      Memory.states = {};
    }

    return <T>Memory.states[refName];
  }

  static getStateMemoryFor<T>(refName: string, state: ClassConstructor<BaseState> | string): T {
    if (!Memory.states) {
      Memory.states = {};
    }

    if (!Memory.states[refName]) {
      Memory.states[refName] = { currentState: "" };
    }

    const stateName = typeof state !== "string" ? state.name : state;
    if (!Memory.states[refName][stateName]) {
      Memory.states[refName][stateName] = {};
    }

    return <T>Memory.states[refName][stateName];
  }

  public static distance(point1: RoomPosition, point2: RoomPosition) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
  }

  public static calculateBodyPartsCost(parts: BodyPartConstant | BodyPartConstant[]): number {
    if (Array.isArray(parts)) {
      return parts.reduce((acc, cur) => acc + BODYPART_COST[cur], 0);
    }

    return BODYPART_COST[parts];
  }

  public static calculateMaxBodyPartsForRoom(
    room: Room,
    parts: BodyPartConstant[],
    minParts = 3,
    energyAvailable?: number
  ): BodyPartConstant[] | false {
    const maxEnergy = energyAvailable ?? room.energyCapacityAvailable;
    let costTotal = 0;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const partCost = BODYPART_COST[part];
      if (costTotal + partCost > maxEnergy) {
        if (i < minParts - 1) {
          return false;
        }

        return parts.slice(0, i);
      }

      costTotal += partCost;
    }

    if (costTotal <= maxEnergy) {
      return parts;
    }

    return false;
  }
}
