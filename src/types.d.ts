type TLine = string | { text: string; style: TextStyle };
type TLines = TLine[];

type TUiMemory = {
  opacity: number;
  console: {
    lines: TLines;
    tick: number;
    maxLines: number;
    speed: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  report: {
    lines: TLines;
    x: number;
    y: number;
  };
};

interface CreepMemory {
  [name: string]: any;
}

interface IStateMachineMemory {
  currentState: string;
  [key: string]: any;
}

type TCreepRoles = "worker" | "healer" | "miner";
type TWorkerSpecs = "idle" | "harvester" | "builder" | "upgrader" | "transfer";
type THealerSpecs = "idle" | "heal-creep" | "repair-structure";
type TCreepSpecs = TWorkerSpecs | THealerSpecs;

interface TCreepMemory {
  role: TCreepRoles;
  spec: TCreepSpecs;
  room: string;
  harvesting?: boolean;
  minerContainerId?: string;
  [key: string]: any;
}

type TSpawnMemory = SpawnMemory & { ticksWithoutSpawn?: number };

interface Memory {
  creeps: { [name: string]: TCreepMemory };
  powerCreeps: { [name: string]: PowerCreepMemory };
  flags: { [name: string]: FlagMemory };
  rooms: { [name: string]: RoomMemory };
  spawns: { [name: string]: TSpawnMemory };
  ui: TUiMemory;
  states: { [name: string]: IStateMachineMemory };
}

type TSpawnItem = {
  role: TCreepRoles;
  spec: TCreepSpecs;
  min: number;
  max: number;
  body: BodyPartConstant[];
  minBodyParts: number;
  options: object;
  priority: number;
  canSpawn: boolean | ((room: Room) => boolean);
};
type TSpawnController = TSpawnItem[];

type TStateNamedReference = { name: string; [key: string]: any };
type TStateIdReference = { id: string; [key: string]: any };
type TStateReference = TStateNamedReference | TStateIdReference;

type ClassConstructor<T> = { new (...args: any[]): T };
