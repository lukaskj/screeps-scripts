import { MAX_CREEP_SPECS_PER_ROOM } from "../constants/max-creep-specs-per-room";
import { Finder } from "../utils";

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
      this.addCreepReportLines(room, lines);

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

    const controllerColor = "#90A4AE";
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
    lines.push({
      text: "Creep roles:",
      style: {
        color: "#4DB6AC",
      },
    });

    for (const roleAndSpec in creepFullCountReport) {
      let text = `${roleAndSpec}: ${creepFullCountReport[roleAndSpec]}`;
      const spec = roleAndSpec.split("/")[1];
      if (spec) {
        const maxSpec = MAX_CREEP_SPECS_PER_ROOM[spec];
        if (maxSpec) {
          if (maxSpec.max === Infinity) {
            text += `/∞`;
          } else {
            text += `/${maxSpec.max}`;
          }
        }
      }
      lines.push(text);
    }
  }
}
