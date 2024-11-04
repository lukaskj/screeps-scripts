export const MAX_CREEP_SPECS_PER_ROOM: Record<TCreepSpecs, { max: number; priority: number }> = {
  upgrader: {
    max: 1,
    priority: 1,
  },
  builder: {
    max: 4,
    priority: 1,
  },
  transfer: {
    max: 3,
    priority: 1,
  },
  harvester: {
    max: Infinity,
    priority: 1,
  },
  idle: {
    max: Infinity,
    priority: 1,
  },
};
