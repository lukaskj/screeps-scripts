import { Finder } from "../utils";

export const spawnsData: TSpawnController = [
  {
    role: "worker",
    spec: "idle",
    min: 6,
    max: 8,
    // prettier-ignore
    body: [WORK, CARRY, MOVE, WORK, WORK, CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK, MOVE, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY],
    minBodyParts: 3,
    options: {},
    priority: 0,
    canSpawn: (_room: Room) => {
      // const sourcesWithoutContainer = Finder.energySourcesWithoutContainer(room);

      return true;
    },
  },
  {
    role: "healer",
    spec: "idle",
    min: 1,
    max: 2,
    // prettier-ignore
    body: [HEAL, WORK, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK],
    minBodyParts: 4,
    options: {},
    priority: 1,
    canSpawn: (room) => (room.controller && room.controller.level >= 2) || Object.values(Game.creeps).length >= 3,
  },
  {
    role: "miner",
    spec: "idle",
    min: 1,
    max: 2,
    // prettier-ignore
    body: [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, TOUGH],
    minBodyParts: 2,
    options: {},
    priority: 0,
    canSpawn: (room: Room) => {
      const availableContainersToMine = Finder.availableContainersToMine(room);

      return availableContainersToMine.length > 0;
    },
  },
];

export const MAX_TICKS_WITHOUT_SPAWN = 2000;
