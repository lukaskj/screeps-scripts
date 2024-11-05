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

type TCreepRoles = "worker" | "healer";
type TWorkerSpecs = "idle" | "harvester" | "builder" | "upgrader" | "transfer";
type THealerSpecs = "idle" | "heal-creep" | "repair-structure";
type TCreepSpecs = TWorkerSpecs | THealerSpecs;

interface TCreepMemory {
  role: TCreepRoles;
  spec: TCreepSpecs;
  room: string;
  harvesting?: boolean;
  [key: string]: any;
}

interface Memory {
  creeps: { [name: string]: TCreepMemory };
  powerCreeps: { [name: string]: PowerCreepMemory };
  flags: { [name: string]: FlagMemory };
  rooms: { [name: string]: RoomMemory };
  spawns: { [name: string]: SpawnMemory };
  ui: TUiMemory;
  states: { [name: string]: IStateMachineMemory };
}

type TSpawnItem = {
  role: TCreepRoles;
  spec: TCreepSpecs;
  max: number;
  body: BodyPartConstant[];
  minBodyParts: number;
  options: object;
  priority: number;
};

type TStateNamedReference = { name: string; [key: string]: any };
type TStateIdReference = { id: string; [key: string]: any };
type TStateReference = TStateNamedReference | TStateIdReference;

type TSpawnController = TSpawnItem[];
type ClassConstructor<T> = { new (...args: any[]): T };
