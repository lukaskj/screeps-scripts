import { MAX_CREEP_SPECS_PER_ROOM } from "../constants/max-creep-specs-per-room";
import { MAX_TICKS_WITHOUT_SPAWN } from "../constants/spawns-data";
import { Finder, Utils } from "../utils";

export class ReportWindow {
  public static draw(): void {
    Finder.allRooms().forEach((room) => {
      const opacity = Memory.ui.opacity;
      const reportMemory = Memory.ui.report;
      const x = reportMemory.x;
      const y = reportMemory.y;
      const xLine = x;
      let yLine = y;

      const lines: TLine[] = [];
      this.addRoomInfoLines(room, lines);
      this.addCpuLines(lines);
      this.addCreepReportLines(room, lines);
      this.addSpawningInfo(room, lines);

      // Draw lines to ui
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let text = typeof line === "string" ? line : "";
        // let color = "white";
        const style: TextStyle = {};
        if (typeof line === "object" && line.text) {
          text = line.text;
          Object.assign(style, line.style);
        }

        room.visual.text(text, xLine, yLine, {
          ...style,
          align: "left",
          font: "0.8 Consolas",
          opacity,
        });
        yLine++;
      }
    });
  }

  private static addRoomInfoLines(room: Room, lines: TLine[]) {
    lines.push({
      text: `Room: ${room.name}`,
      style: {
        color: "#29B6F6",
      },
    });

    lines.push({
      text: `Energy: ${room.energyAvailable} / ${room.energyCapacityAvailable}`,
      style: {
        color: "#FFEB3B",
      },
    });

    const controllerColor = "#FAFAFA";
    if (room.controller) {
      lines.push({
        text: `Controller: Lvl ${room.controller.level} (${room.controller.progress}/${room.controller.progressTotal})`,
        style: {
          color: controllerColor,
        },
      });
    } else {
      lines.push({
        text: `No controller`,
        style: {
          color: controllerColor,
        },
      });
    }
  }

  private static addCreepReportLines(room: Room, lines: TLine[]) {
    const creepFullCountReport = Finder.getCreepFullRolesReport(room);
    lines.push("----");

    const ticksWithoutSpawn = _.reduce(
      Memory.spawns ?? {},
      (maxTicks, memory) => Math.max((<any>memory).ticksWithoutSpawn ?? 0, maxTicks),
      0,
    );

    lines.push({
      text: `Ticks w/o spawn: ${ticksWithoutSpawn}/${MAX_TICKS_WITHOUT_SPAWN}`,
      style: {
        color: "#9E9E9E",
      },
    });

    lines.push({
      text: "Creep roles:",
      style: {
        color: "#4DB6AC",
      },
    });

    for (const roleAndSpec in creepFullCountReport) {
      let text = `${roleAndSpec}: ${creepFullCountReport[roleAndSpec]}`;
      let tabs = 2;

      const spec = roleAndSpec.split("/")[1];
      if (spec) {
        tabs += 2;
        const maxSpec = MAX_CREEP_SPECS_PER_ROOM[spec];
        if (maxSpec) {
          if (maxSpec.max === Infinity) {
            text += `/∞`;
          } else {
            text += `/${maxSpec.max}`;
          }
        }
      }
      lines.push(text.padStart(text.length + tabs, " "));
    }
  }

  private static addCpuLines(lines: TLine[]) {
    const style = {
      color: "#9C27B0",
    };

    lines.push("----");
    lines.push({
      text: "CPU:",
      style,
    });

    lines.push({
      text: `  Tick used: ${Game.cpu.getUsed().toFixed(2)}/${Game.cpu.tickLimit}`,
      style,
    });
    lines.push({
      text: `  Shard limit: ${Game.cpu.limit}`,
      style,
    });

    if (Game.cpu.getHeapStatistics) {
      const heapStatistics = Game.cpu.getHeapStatistics();

      const heapPercent =
        (heapStatistics.total_heap_size + heapStatistics.externally_allocated_size) / heapStatistics.heap_size_limit;

      const heap = ((heapStatistics.total_heap_size + heapStatistics.externally_allocated_size) / 1024 / 1024).toFixed(
        1,
      );

      const heapLimit = (heapStatistics.heap_size_limit / 1024 / 1024).toFixed(0);

      lines.push({
        text: `  Heap: ${heap}Mb/${heapLimit}Mb (${heapPercent.toFixed(0)}%)`,
        style,
      });
    }
  }

  private static addSpawningInfo(room: Room, lines: TLine[]) {
    const spawners = room.find(FIND_MY_SPAWNS, {
      filter: (spawn) => spawn.spawning,
    });

    if (!spawners.length) {
      return;
    }

    const color = "#FFEB3B";

    lines.push({
      text: "Spawning (total/cost/parts):",
      style: {
        color,
      },
    });

    type TSpawingCreepReport = {
      total: number;
      cost: number;
      parts: BodyPartConstant[];
    };

    const spawningCreeps: Partial<Record<TCreepRoles, TSpawingCreepReport>> = {};

    const defaultCreepSpawningReport: TSpawingCreepReport = {
      total: 0,
      cost: 0,
      parts: [],
    };

    for (const spawner of spawners) {
      const creepSpawner = <Spawning>spawner.spawning;
      const creep = Game.creeps[creepSpawner.name];

      const memory = Memory.creeps[creepSpawner.name];

      const bodyParts = creep.body.map((body) => body.type);
      const totalCost = Utils.calculateBodyPartsCost(bodyParts);
      spawningCreeps[memory.role] = spawningCreeps[memory.role] ?? { ...defaultCreepSpawningReport };
      (<TSpawingCreepReport>spawningCreeps[memory.role]).total += 1;
      (<TSpawingCreepReport>spawningCreeps[memory.role]).cost = totalCost;
      (<TSpawingCreepReport>spawningCreeps[memory.role]).parts = bodyParts;
    }

    for (const [role, report] of Object.entries(spawningCreeps)) {
      lines.push({
        text: `  ${role}: ${report.total}/${report.cost}/${report.parts.length}`,
        style: {
          color,
        },
      });
    }
  }
}
