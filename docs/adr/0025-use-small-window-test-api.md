# Use a Small Window Test API

The deterministic browser test seam will live at `window.clockworkMischiefTest` with narrow methods such as `loadLevel`, `placePart`, `start`, `reset`, and `snapshot`. Keeping the seam explicit and small lets tests prove the real loop without turning the game into a parallel automation-only interface.

