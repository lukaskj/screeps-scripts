export const spawnsData: TSpawnController = [
  {
    role: "worker",
    spec: "idle",
    max: 10,
    body: [WORK, CARRY, MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, MOVE, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY],
    minBodyParts: 3,
    options: {},
    priority: 0,
  },
  {
    role: "healer",
    spec: "idle",
    max: 2,
    body: [HEAL, WORK, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK],
    minBodyParts: 4,
    options: {},
    priority: 1,
  },
];
