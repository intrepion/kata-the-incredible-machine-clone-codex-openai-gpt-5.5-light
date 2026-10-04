import { describe, expect, it } from "vitest";
import { getLevel } from "../src/levels";

describe("launch campaign level definitions", () => {
  it("defines a level 1 fixture with a ball, basket, board, and ramp toolbox", () => {
    const level = getLevel("level-1");

    expect(level.title).toBe("Basket Case");
    expect(level.objective).toBe("Get the ball into the basket.");
    expect(level.board).toEqual({ width: 960, height: 540 });
    expect(level.toolbox).toEqual({ ramp: 1 });
    expect(level.fixtureParts.map((part) => part.kind)).toEqual(["ball", "basket"]);
  });
});
