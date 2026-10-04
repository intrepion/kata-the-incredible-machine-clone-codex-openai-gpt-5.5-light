import type { LevelDefinition } from "./domain";

export const levels: LevelDefinition[] = [
  {
    id: "level-1",
    title: "Basket Case",
    objective: "Get the ball into the basket.",
    hint: "A simple ramp can turn falling into rolling.",
    board: { width: 960, height: 540 },
    timeoutMs: 8_000,
    toolbox: {
      ramp: 1,
    },
    fixedObjects: [
      {
        id: "floor",
        kind: "floor",
        position: { x: 480, y: 520 },
        size: { width: 960, height: 40 },
      },
      {
        id: "left-wall",
        kind: "wall",
        position: { x: 10, y: 270 },
        size: { width: 20, height: 540 },
      },
      {
        id: "right-wall",
        kind: "wall",
        position: { x: 950, y: 270 },
        size: { width: 20, height: 540 },
      },
    ],
    fixtureParts: [
      {
        id: "ball-1",
        kind: "ball",
        position: { x: 300, y: 110 },
        angle: 0,
      },
      {
        id: "basket-1",
        kind: "basket",
        position: { x: 660, y: 488 },
        angle: 0,
      },
    ],
    ballPartId: "ball-1",
    goalPartId: "basket-1",
  },
];

export function getLevel(levelId: string): LevelDefinition {
  const level = levels.find((candidate) => candidate.id === levelId);

  if (!level) {
    throw new Error(`Unknown level: ${levelId}`);
  }

  return level;
}
