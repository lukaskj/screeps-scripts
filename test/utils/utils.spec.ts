import { mock } from "jest-mock-extended";
import { Utils } from "../../src/utils";

describe("Utils", () => {
  describe("Utils", () => {
    describe("calculateMaxBodyPartsForRoom", () => {
      it("should return false if total available cannot fullfil min parts", () => {
        const room = mock<Room>();
        room.energyCapacityAvailable = 50;

        const result = Utils.calculateMaxBodyPartsForRoom(
          room,
          [WORK, WORK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK],
          4,
        );

        expect(result).toBeFalsy();
      });

      it("should return partial parts if total available cannot fullfil all parts", () => {
        const room = mock<Room>();
        room.energyCapacityAvailable = 450;

        const expected = [WORK, WORK, MOVE, RANGED_ATTACK];

        const result = Utils.calculateMaxBodyPartsForRoom(
          room,
          [WORK, WORK, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK],
          3,
        );

        expect(result).not.toBeFalsy();
        expect(result).toEqual(expected);
      });

      it("should return all parts if available total cannot fullfil all parts", () => {
        const room = mock<Room>();
        room.energyCapacityAvailable = 450;

        const expected = [WORK, WORK, MOVE, RANGED_ATTACK];

        const result = Utils.calculateMaxBodyPartsForRoom(room, expected, 3);

        expect(result).not.toBeFalsy();
        expect(result).toEqual(expected);
      });
    });
  });
});
