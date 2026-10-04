# Clockwork Mischief

This context defines the language for Clockwork Mischief, a side-view contraption puzzle game inspired by The Incredible Machine. The project centers on constrained physical invention: placing parts, running a machine, observing cause and effect, and iterating until the objective is satisfied.

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

**Frozen Editing**:
The rule that player-placed parts cannot be moved, rotated, added, or deleted during run mode.
_Avoid_: Lockout, paused editing

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

**Placement Rule**:
A validity rule that determines whether a player may place or rotate a part at a board location.
_Avoid_: Collision guard, editor constraint

**Blocked Placement**:
A placement attempt rejected because the part would overlap fixed objects, goal areas, or existing placed parts.
_Avoid_: Invalid drop, red zone, forbidden placement

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

**Timeout**:
A soft failure condition where run mode has continued longer than the level's objective window.
_Avoid_: Timer score, clock, time limit

**Out of Bounds**:
A soft failure condition where an essential moving body leaves the board.
_Avoid_: Fall death, void, lost object

**Settled Machine**:
A soft failure condition where the moving bodies have come to rest without completing the objective.
_Avoid_: Stalemate, idle state, dead machine

**Reset**:
Returning the board from run mode to the last build-mode arrangement.
_Avoid_: Restart, undo simulation

**Angle Snap**:
The rotation increment used when orienting adjustable parts.
_Avoid_: Grid rotation, precision angle

**Level**:
A constrained contraption puzzle with its own board, toolbox, fixed objects, and objective.
_Avoid_: Stage, scene, sandbox

**Level Definition**:
The data record that defines a level's board, fixed objects, toolbox, objective, hint, and validation rules.
_Avoid_: Level script, map file, scene config

**Hint**:
A short optional clue that nudges the player toward the physical idea of a level without explaining the whole solution.
_Avoid_: Tutorial text, instruction, answer

**Campaign**:
A sequence of levels that introduces parts and physical ideas through increasingly demanding objectives.
_Avoid_: Story mode, progression track

**Launch Campaign**:
The initial five-level campaign that teaches ramps, redirection, bumper timing, fan force, conveyors, and trigger buttons.
_Avoid_: Full campaign, tutorial pack, demo levels

**Powered Part**:
A part whose behavior is driven by run-mode energy or a trigger rather than only by gravity and collision.
_Avoid_: Active item, gadget, machine part

**Always-On Part**:
A powered part that operates for the duration of run mode.
_Avoid_: Passive powered part, automatic gadget

**Triggered Part**:
A powered part that activates in response to a button or other trigger event.
_Avoid_: Wired part, switched gadget

**Mechanical Workshop**:
The playful visual identity for the game: readable physical parts, warm tabletop materials, and practical machine surfaces.
_Avoid_: Blueprint theme, classroom toybox, factory sim

**Browser Smoke Path**:
A real browser interaction path that proves a level can be loaded, edited, run, and completed through the same controls available to a player.
_Avoid_: Build check, unit test, render smoke

**MVP Slice**:
A playable delivery increment with its own verification evidence and a clear user-facing capability.
_Avoid_: Phase, milestone, batch

**Test Seam**:
A deliberately small browser API used by automated checks to drive player-equivalent actions and read game state.
_Avoid_: Debug console, cheat API, test harness

**Keyboard Shortcut**:
A key command that mirrors an existing player action without replacing pointer-first interaction.
_Avoid_: Hotkey system, keyboard mode
