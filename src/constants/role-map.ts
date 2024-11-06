import { ICreep } from "../creep/creep.class";
import { RoleHealer, RoleWorker } from "../creep/roles";
import { RoleMiner } from "../creep/roles/role.miner";

export const ROLE_MAP: Partial<Record<TCreepRoles, ClassConstructor<ICreep>>> = {
  worker: RoleWorker,
  healer: RoleHealer,
  miner: RoleMiner,
};
