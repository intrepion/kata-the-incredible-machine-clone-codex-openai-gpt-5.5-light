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
    placementPadding: 6,
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
  {
    id: "level-2",
    title: "Block and Tackle",
    objective: "Redirect the ball around the block and into the basket.",
    hint: "Use the block as a stop, not a bridge.",
    board: { width: 960, height: 540 },
    timeoutMs: 8_000,
    toolbox: {
      ramp: 1,
      block: 1,
    },
    fixedObjects: [
      {
        id: "floor",
        kind: "floor",
        position: { x: 480, y: 520 },
        size: { width: 960, height: 40 },
      },
    ],
    placementPadding: 6,
    fixtureParts: [
      {
        id: "ball-2",
        kind: "ball",
        position: { x: 250, y: 120 },
        angle: 0,
      },
      {
        id: "basket-2",
        kind: "basket",
        position: { x: 700, y: 488 },
        angle: 0,
      },
    ],
    ballPartId: "ball-2",
    goalPartId: "basket-2",
  },
  {
    id: "level-3",
    title: "Bumper Lesson",
    objective: "Use a bumper to keep the ball moving toward the basket.",
    hint: "A bumper changes direction without needing a second ramp.",
    board: { width: 960, height: 540 },
    timeoutMs: 8_000,
    toolbox: {
      ramp: 1,
      bumper: 1,
    },
    fixedObjects: [
      {
        id: "floor",
        kind: "floor",
        position: { x: 480, y: 520 },
        size: { width: 960, height: 40 },
      },
    ],
    placementPadding: 6,
    fixtureParts: [
      {
        id: "ball-3",
        kind: "ball",
        position: { x: 210, y: 100 },
        angle: 0,
      },
      {
        id: "basket-3",
        kind: "basket",
        position: { x: 760, y: 488 },
        angle: 0,
      },
    ],
    ballPartId: "ball-3",
    goalPartId: "basket-3",
  },
  {
    id: "level-4",
    title: "Fan Fare",
    objective: "Use fan force to push the ball into the basket.",
    hint: "A fan is strongest when the ball passes in front of it.",
    board: { width: 960, height: 540 },
    timeoutMs: 8_000,
    toolbox: {
      ramp: 1,
      fan: 1,
    },
    fixedObjects: [
      {
        id: "floor",
        kind: "floor",
        position: { x: 480, y: 520 },
        size: { width: 960, height: 40 },
      },
    ],
    placementPadding: 6,
    fixtureParts: [
      {
        id: "ball-4",
        kind: "ball",
        position: { x: 300, y: 100 },
        angle: 0,
      },
      {
        id: "basket-4",
        kind: "basket",
        position: { x: 820, y: 488 },
        angle: 0,
      },
    ],
    ballPartId: "ball-4",
    goalPartId: "basket-4",
  },
  {
    id: "level-5",
    title: "Buttoned Conveyor",
    objective: "Trigger the conveyor and carry the ball into the basket.",
    hint: "The button wakes the conveyor when the ball reaches it.",
    board: { width: 960, height: 540 },
    timeoutMs: 8_000,
    toolbox: {
      ramp: 1,
      conveyor: 1,
      button: 1,
    },
    fixedObjects: [
      {
        id: "floor",
        kind: "floor",
        position: { x: 480, y: 520 },
        size: { width: 960, height: 40 },
      },
    ],
    placementPadding: 6,
    fixtureParts: [
      {
        id: "ball-5",
        kind: "ball",
        position: { x: 180, y: 100 },
        angle: 0,
      },
      {
        id: "basket-5",
        kind: "basket",
        position: { x: 820, y: 488 },
        angle: 0,
      },
    ],
    ballPartId: "ball-5",
    goalPartId: "basket-5",
  },
];

export function getLevel(levelId: string): LevelDefinition {
  const level = levels.find((candidate) => candidate.id === levelId);

  if (!level) {
    throw new Error(`Unknown level: ${levelId}`);
  }

  return level;
}
