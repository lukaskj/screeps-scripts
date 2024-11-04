import { Finder } from "./utils/finder";

const spawns: TSpawnController = [
  {
    role: "worker",
    spec: "idle",
    max: 10,
    body: [WORK, CARRY, MOVE],
    options: {},
    priority: 0,
  },
];

const prioritySpawns = _.sortBy(spawns, "priority");

export class SpawnController {
  public static update() {
    for (const spawnName in Game.spawns) {
      const spawner = Game.spawns[spawnName];

      const allRoleCreeps = Finder.getCreepRolesReport(spawner.room);

      for (const spawnData of prioritySpawns) {
        const role = spawnData.role;

        if ((allRoleCreeps[role] ?? 0) < spawnData.max) {
          const newName = `${role}-${Game.time}`;

          const result = spawner.spawnCreep(spawnData.body, newName, { ...spawnData.options, memory: { role } });
          if (result === OK) {
            console.log(`Spawning new ${role} at ${spawner.name}:`, newName);
            break;
          }
        }
      }
    }
  }
}
