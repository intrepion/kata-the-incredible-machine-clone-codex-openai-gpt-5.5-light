import { describe, expect, it } from "vitest";
import { getLevel, levels } from "../src/levels";

describe("launch campaign level definitions", () => {
  it("defines a level 1 fixture with a ball, basket, board, and ramp toolbox", () => {
    const level = getLevel("level-1");

    expect(level.title).toBe("Basket Case");
    expect(level.objective).toBe("Get the ball into the basket.");
    expect(level.board).toEqual({ width: 960, height: 540 });
    expect(level.toolbox).toEqual({ ramp: 1 });
    expect(level.fixtureParts.map((part) => part.kind)).toEqual(["ball", "basket"]);
  });

  it("defines the five-level launch campaign with progressive parts", () => {
    expect(levels.map((level) => level.id)).toEqual(["level-1", "level-2", "level-3", "level-4", "level-5"]);
    expect(levels.map((level) => level.toolbox)).toEqual([
      { ramp: 1 },
      { ramp: 1, block: 1 },
      { ramp: 1, bumper: 1 },
      { ramp: 1, fan: 1 },
      { ramp: 1, conveyor: 1, button: 1 },
    ]);
  });
});
