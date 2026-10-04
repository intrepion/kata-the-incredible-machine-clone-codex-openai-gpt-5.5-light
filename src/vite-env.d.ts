/// <reference types="vite/client" />

import type { GameSnapshot } from "./domain";

interface ClockworkMischiefTestApi {
  loadLevel(levelId: string): GameSnapshot;
  start(): GameSnapshot;
  reset(): GameSnapshot;
  snapshot(): GameSnapshot;
}

declare global {
  interface Window {
    clockworkMischiefTest: ClockworkMischiefTestApi;
  }
}
