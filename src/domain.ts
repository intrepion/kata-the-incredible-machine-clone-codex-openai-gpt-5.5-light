export type GameMode = "build" | "run";
export type RunOutcome = "idle" | "running" | "success" | "soft-failure";

export type PartKind = "ball" | "basket" | "ramp" | "block" | "bumper" | "fan" | "conveyor" | "button";

export interface Vec2 {
  x: number;
  y: number;
}

export interface BoardSize {
  width: number;
  height: number;
}

export interface FixedObjectDefinition {
  id: string;
  kind: "floor" | "wall" | "platform";
  position: Vec2;
  size: BoardSize;
  angle?: number;
}

export interface PlacedPartDefinition {
  id: string;
  kind: PartKind;
  position: Vec2;
  angle: number;
}

export interface LevelDefinition {
  id: string;
  title: string;
  objective: string;
  hint: string;
  board: BoardSize;
  toolbox: Partial<Record<PartKind, number>>;
  fixedObjects: FixedObjectDefinition[];
  fixtureParts: PlacedPartDefinition[];
  goalPartId: string;
  ballPartId: string;
  timeoutMs: number;
}

export interface GameSnapshot {
  levelId: string;
  levelTitle: string;
  mode: GameMode;
  outcome: RunOutcome;
  board: BoardSize;
  placedParts: PlacedPartDefinition[];
  bodyPositions: Record<string, Vec2>;
}
