# The Incredible Machine Clone

This context defines the language for a side-view contraption puzzle game inspired by The Incredible Machine. The project centers on constrained physical invention: placing parts, running a machine, observing cause and effect, and iterating until the objective is satisfied.

## Language

**Contraption Puzzle**:
A level where the player arranges a limited set of parts to produce a target chain reaction.
_Avoid_: Rube Goldberg sandbox, physics demo, toy board

**Build Mode**:
The state where the player places, rotates, deletes, and adjusts parts before the machine runs.
_Avoid_: Edit mode, layout mode

**Run Mode**:
The state where placed parts become active and the machine plays out under physics until it succeeds, fails, or is reset.
_Avoid_: Simulation mode, play mode

**Part**:
A player-placeable object that participates in the contraption through collision, motion, force, triggering, or goal detection.
_Avoid_: Item, tool, prop

**Toolbox**:
The available set of parts for a level.
_Avoid_: Inventory, palette, tray

**Part Count**:
The level-specific quantity limit for each part in the toolbox.
_Avoid_: Stock, ammo, charges

**Solution**:
The saved build-mode arrangement for a level, whether or not it has completed the objective.
_Avoid_: Save, layout, answer

**Completion**:
The recorded fact that a level's objective has been satisfied.
_Avoid_: Win flag, clear, solved state

**Board**:
The bounded side-view physical space where the contraption is assembled and run.
_Avoid_: Map, world, canvas

**Objective**:
The required outcome that makes a contraption puzzle complete.
_Avoid_: Mission, quest, task

**Goal**:
The target object or area that detects objective completion.
_Avoid_: Finish, exit, endpoint

**Machine**:
The complete arrangement of player-placed parts and fixed level objects on a board.
_Avoid_: Setup, build, layout

**Chain Reaction**:
A sequence of physical interactions where one event causes the next until the objective either succeeds or stalls.
_Avoid_: Combo, script, automation

**Soft Failure**:
A run-mode outcome where the machine has clearly missed the objective, stalled, or gone out of bounds without erasing the player's build-mode solution.
_Avoid_: Game over, loss, death

**Reset**:
Returning the board from run mode to the last build-mode arrangement.
_Avoid_: Restart, undo simulation

**Angle Snap**:
The rotation increment used when orienting adjustable parts.
_Avoid_: Grid rotation, precision angle

**Level**:
A constrained contraption puzzle with its own board, toolbox, fixed objects, and objective.
_Avoid_: Stage, scene, sandbox

**Campaign**:
A sequence of levels that introduces parts and physical ideas through increasingly demanding objectives.
_Avoid_: Story mode, progression track

**Mechanical Workshop**:
The playful visual identity for the game: readable physical parts, warm tabletop materials, and practical machine surfaces.
_Avoid_: Blueprint theme, classroom toybox, factory sim
