type TLines = string | {text: string; color: string};
type TUiMemory = {
  console: {
    lines: TLines[];
    tick: number;
    maxLines: number;
    speed: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

interface CreepMemory {
  [name: string]: any;
}

interface IStateMachineMemory {
  currentState: string;
  [key: string]: any;
}

type TCreepRoles = "worker";
type TCreepSpecializations = "idle" | "harvester" | "builder" | "upgrader";

interface TCreepMemory {
  role: TCreepRoles;
  specialization: TCreepSpecializations;
}

interface Memory {
  creeps: {[name: string]: TCreepMemory};
  powerCreeps: {[name: string]: PowerCreepMemory};
  flags: {[name: string]: FlagMemory};
  rooms: {[name: string]: RoomMemory};
  spawns: {[name: string]: SpawnMemory};
  ui: TUiMemory;
  states: {[name: string]: IStateMachineMemory};
}

type TSpawnItem = {
  role: TCreepRoles;
  specialization: TCreepSpecializations;
  total: number;
  body: BodyPartConstant[];
  options: object;
  priority: number;
};

type TStateNamedReference = {name: string; [key: string]: any};
type TStateIdReference = {id: string; [key: string]: any};
type TStateReference = TStateNamedReference | TStateIdReference;

type TSpawnController = TSpawnItem[];
type ClassConstructor<T> = {new (...args: any[]): T};
