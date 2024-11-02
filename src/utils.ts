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

  static getStateMemoryFor<T extends IStateMachineMemory>(name: string): T {
    if (!Memory.states) {
      Memory.states = {};
    }

    return <T>Memory.states[name];
  }
}
