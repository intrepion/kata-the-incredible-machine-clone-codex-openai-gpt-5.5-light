/// <reference types="vite/client" />

import type { GameSnapshot } from "./domain";
import type { PlacedPartDefinition } from "./domain";

interface ClockworkMischiefTestApi {
  loadLevel(levelId: string): GameSnapshot;
  placePart(part: PlacedPartDefinition): GameSnapshot;
  start(): GameSnapshot;
  reset(): GameSnapshot;
  snapshot(): GameSnapshot;
}

declare global {
  interface Window {
    clockworkMischiefTest: ClockworkMischiefTestApi;
  }
}
