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

    describe("calculateBodyPartsCost", () => {
      const testCases: [BodyPartConstant | BodyPartConstant[], number][] = [
        [WORK, 100],
        [[WORK, WORK], 200],
        [[HEAL, WORK], 350],
        [[CLAIM, MOVE, MOVE], 700],
        [[CARRY, WORK, WORK, MOVE, MOVE], 350],
      ];
      test.each(testCases)(
        "cost of %p should be %d",
        (parts: BodyPartConstant | BodyPartConstant[], expected: number) => {
          const result = Utils.calculateBodyPartsCost(parts);

          expect(result).toBe(expected);
        },
      );
    });
  });
});
