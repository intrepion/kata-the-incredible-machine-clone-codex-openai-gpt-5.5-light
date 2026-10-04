import Matter from "matter-js";
import type { GameSnapshot, LevelDefinition, PartKind, PlacedPartDefinition, RunOutcome, Vec2 } from "../domain";
import { getLevel } from "../levels";
import { createPhysicsWorld, stepWorld, type PhysicsWorld } from "../physics";

const FRAME_MS = 1_000 / 60;
const ANGLE_SNAP = Math.PI / 12;
const STORAGE_KEY = "clockwork-mischief-state-v1";

interface PersistedState {
  solutions: Record<string, PlacedPartDefinition[]>;
  completedLevels: string[];
}

export class ClockworkGame {
  private readonly root: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly status: HTMLParagraphElement;
  private readonly startButton: HTMLButtonElement;
  private readonly resetButton: HTMLButtonElement;
  private readonly levelList: HTMLDivElement;
  private level: LevelDefinition = getLevel("level-1");
  private placedParts: PlacedPartDefinition[] = [];
  private persisted: PersistedState = { solutions: {}, completedLevels: [] };
  private world: PhysicsWorld | null = null;
  private outcome: RunOutcome = "idle";
  private animationFrame = 0;
  private runElapsedMs = 0;
  private selectedKind: PartKind | null = "ramp";
  private selectedPartId: string | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
    this.canvas = document.createElement("canvas");
    const context = this.canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas 2D context is unavailable");
    }

    this.context = context;
    this.status = document.createElement("p");
    this.startButton = document.createElement("button");
    this.resetButton = document.createElement("button");
    this.levelList = document.createElement("div");
  }

  mount(): void {
    this.root.className = "app-shell";
    this.root.innerHTML = "";

    const header = document.createElement("header");
    header.className = "topbar";
    const titleBlock = document.createElement("div");
    titleBlock.innerHTML = `
      <p class="eyebrow">Clockwork Mischief</p>
      <h1>${this.level.title}</h1>
    `;
    this.startButton.type = "button";
    this.startButton.textContent = "Start";
    this.resetButton.type = "button";
    this.resetButton.textContent = "Reset";
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(this.startButton, this.resetButton);
    header.append(titleBlock, actions);

    const objective = document.createElement("p");
    objective.className = "objective";
    objective.textContent = this.level.objective;
    objective.dataset.role = "objective";

    const toolbox = document.createElement("div");
    toolbox.className = "toolbox";
    toolbox.innerHTML = `
      <button type="button" data-tool="ramp">Ramp x1</button>
      <button type="button" data-action="rotate-left">[ Rotate</button>
      <button type="button" data-action="rotate-right">] Rotate</button>
      <button type="button" data-action="delete">Delete</button>
    `;

    this.status.className = "status";
    this.status.textContent = "Build mode ready.";

    this.canvas.width = this.level.board.width;
    this.canvas.height = this.level.board.height;
    this.canvas.className = "machine-board";
    this.canvas.dataset.testid = "machine-board";

    this.levelList.className = "level-list";
    this.root.append(header, this.levelList, objective, toolbox, this.canvas, this.status);
    this.startButton.addEventListener("click", () => this.start());
    this.resetButton.addEventListener("click", () => this.reset());
    toolbox.querySelector<HTMLButtonElement>("[data-tool='ramp']")?.addEventListener("click", () => {
      this.selectedKind = "ramp";
      this.status.textContent = "Ramp selected.";
    });
    toolbox.querySelector<HTMLButtonElement>("[data-action='rotate-left']")?.addEventListener("click", () => this.rotateSelected(-ANGLE_SNAP));
    toolbox.querySelector<HTMLButtonElement>("[data-action='rotate-right']")?.addEventListener("click", () => this.rotateSelected(ANGLE_SNAP));
    toolbox.querySelector<HTMLButtonElement>("[data-action='delete']")?.addEventListener("click", () => this.deleteSelected());
    this.canvas.addEventListener("pointerdown", (event) => this.handleBoardPointer(event));
    window.addEventListener("keydown", (event) => this.handleKey(event));

    this.persisted = this.loadPersisted();
    this.renderLevelList();
    this.loadLevel(this.level.id);
    this.installTestSeam();
  }

  loadLevel(levelId: string): GameSnapshot {
    this.stopAnimation();
    this.level = getLevel(levelId);
    this.placedParts = [...(this.persisted.solutions[levelId] ?? [])];
    this.outcome = "idle";
    this.runElapsedMs = 0;
    this.selectedPartId = null;
    this.world = createPhysicsWorld(this.level, this.placedParts);
    this.updateControls();
    this.canvas.width = this.level.board.width;
    this.canvas.height = this.level.board.height;
    this.draw();
    this.status.textContent = "Build mode ready.";
    this.renderLevelList();
    return this.snapshot();
  }

  placePart(part: PlacedPartDefinition): GameSnapshot {
    if (this.outcome === "running") {
      return this.snapshot();
    }

    const existingIndex = this.placedParts.findIndex((candidate) => candidate.id === part.id);

    if (existingIndex >= 0) {
      this.placedParts[existingIndex] = part;
    } else {
      const currentCount = this.placedParts.filter((candidate) => candidate.kind === part.kind).length;
      const allowedCount = this.level.toolbox[part.kind] ?? 0;

      if (currentCount >= allowedCount) {
        this.status.textContent = `No ${part.kind} parts left.`;
        return this.snapshot();
      }

      this.placedParts.push(part);
    }

    this.selectedPartId = part.id;
    this.saveSolution();
    this.world = createPhysicsWorld(this.level, this.placedParts);
    this.status.textContent = `${part.kind} placed.`;
    this.draw();
    this.updateControls();
    return this.snapshot();
  }

  start(): GameSnapshot {
    this.stopAnimation();
    this.world = createPhysicsWorld(this.level, this.placedParts);
    this.outcome = "running";
    this.runElapsedMs = 0;
    this.status.textContent = "Run mode.";
    this.updateControls();
    this.tick();
    return this.snapshot();
  }

  reset(): GameSnapshot {
    this.stopAnimation();
    this.outcome = "idle";
    this.runElapsedMs = 0;
    this.world = createPhysicsWorld(this.level, this.placedParts);
    this.status.textContent = "Build mode ready.";
    this.updateControls();
    this.draw();
    return this.snapshot();
  }

  snapshot(): GameSnapshot {
    return {
      levelId: this.level.id,
      levelTitle: this.level.title,
      mode: this.outcome === "running" ? "run" : "build",
      outcome: this.outcome,
      board: this.level.board,
      placedParts: [...this.level.fixtureParts, ...this.placedParts],
      bodyPositions: this.bodyPositions(),
      completedLevels: [...this.persisted.completedLevels],
    };
  }

  private tick(): void {
    if (!this.world || this.outcome !== "running") {
      return;
    }

    stepWorld(this.world, FRAME_MS);
    this.runElapsedMs += FRAME_MS;
    this.updateOutcome();
    this.draw();

    if (this.outcome === "running") {
      this.animationFrame = window.requestAnimationFrame(() => this.tick());
    }
  }

  private draw(): void {
    const world = this.world;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "#f4e4c1";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = "#2c2a25";
    this.context.lineWidth = 4;
    this.context.strokeRect(2, 2, this.canvas.width - 4, this.canvas.height - 4);

    if (!world) {
      return;
    }

    for (const body of Matter.Composite.allBodies(world.engine.world)) {
      this.drawBody(body);
    }

    for (const part of this.placedParts) {
      if (part.id === this.selectedPartId && this.outcome !== "running") {
        const body = world.bodiesById.get(part.id);
        if (body) {
          this.context.strokeStyle = "#f4c542";
          this.context.lineWidth = 5;
          this.context.strokeRect(body.bounds.min.x - 5, body.bounds.min.y - 5, body.bounds.max.x - body.bounds.min.x + 10, body.bounds.max.y - body.bounds.min.y + 10);
        }
      }
    }
  }

  private drawBody(body: Matter.Body): void {
    const vertices = body.vertices;
    this.context.beginPath();
    this.context.moveTo(vertices[0].x, vertices[0].y);

    for (const vertex of vertices.slice(1)) {
      this.context.lineTo(vertex.x, vertex.y);
    }

    this.context.closePath();
    this.context.fillStyle = body.render.fillStyle || "#8b7455";
    this.context.fill();
    this.context.strokeStyle = "#2c2a25";
    this.context.lineWidth = 2;
    this.context.stroke();
  }

  private stopAnimation(): void {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }
  }

  private installTestSeam(): void {
    window.clockworkMischiefTest = {
      loadLevel: (levelId: string) => this.loadLevel(levelId),
      placePart: (part: PlacedPartDefinition) => this.placePart(part),
      start: () => this.start(),
      reset: () => this.reset(),
      snapshot: () => this.snapshot(),
    };
  }

  private bodyPositions(): Record<string, Vec2> {
    const positions: Record<string, Vec2> = {};

    if (!this.world) {
      return positions;
    }

    for (const [id, body] of this.world.bodiesById) {
      positions[id] = { x: Math.round(body.position.x), y: Math.round(body.position.y) };
    }

    return positions;
  }

  private updateOutcome(): void {
    if (!this.world) {
      return;
    }

    const ball = this.world.bodiesById.get(this.level.ballPartId);
    const goal = this.world.bodiesById.get(this.level.goalPartId);

    if (!ball || !goal) {
      return;
    }

    const ballInGoal =
      ball.position.x >= goal.bounds.min.x &&
      ball.position.x <= goal.bounds.max.x &&
      ball.position.y >= goal.bounds.min.y - 24 &&
      ball.position.y <= goal.bounds.max.y + 24;

    if (ballInGoal) {
      this.outcome = "success";
      this.status.textContent = "Success!";
      this.markComplete();
      this.stopAnimation();
      this.updateControls();
      return;
    }

    const outOfBounds =
      ball.position.x < -60 ||
      ball.position.x > this.level.board.width + 60 ||
      ball.position.y > this.level.board.height + 80;

    if (outOfBounds || this.runElapsedMs >= this.level.timeoutMs) {
      this.outcome = "soft-failure";
      this.status.textContent = "Soft failure. Reset and revise the machine.";
      this.stopAnimation();
      this.updateControls();
    }
  }

  private handleBoardPointer(event: PointerEvent): void {
    if (this.outcome === "running" || !this.selectedKind) {
      return;
    }

    const boardPoint = this.toBoardPoint(event);
    const existing = this.placedParts.find((part) => this.pointNearPart(boardPoint, part));

    if (existing) {
      this.selectedPartId = existing.id;
      this.status.textContent = `${existing.kind} selected.`;
      this.draw();
      return;
    }

    this.placePart({
      id: `${this.selectedKind}-1`,
      kind: this.selectedKind,
      position: boardPoint,
      angle: ANGLE_SNAP,
    });
  }

  private toBoardPoint(event: PointerEvent): Vec2 {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * this.level.board.width,
      y: ((event.clientY - rect.top) / rect.height) * this.level.board.height,
    };
  }

  private pointNearPart(point: Vec2, part: PlacedPartDefinition): boolean {
    return Math.abs(point.x - part.position.x) < 120 && Math.abs(point.y - part.position.y) < 60;
  }

  private rotateSelected(delta: number): void {
    if (this.outcome === "running" || !this.selectedPartId) {
      return;
    }

    const selected = this.placedParts.find((part) => part.id === this.selectedPartId);

    if (!selected) {
      return;
    }

    selected.angle += delta;
    this.world = createPhysicsWorld(this.level, this.placedParts);
    this.status.textContent = `${selected.kind} rotated.`;
    this.draw();
  }

  private deleteSelected(): void {
    if (this.outcome === "running" || !this.selectedPartId) {
      return;
    }

    this.placedParts = this.placedParts.filter((part) => part.id !== this.selectedPartId);
    this.saveSolution();
    this.selectedPartId = null;
    this.world = createPhysicsWorld(this.level, this.placedParts);
    this.status.textContent = "Part removed.";
    this.updateControls();
    this.draw();
  }

  private handleKey(event: KeyboardEvent): void {
    if (event.key === " " || event.code === "Space") {
      event.preventDefault();
      if (this.outcome === "running") {
        this.reset();
      } else {
        this.start();
      }
    } else if (event.key.toLowerCase() === "r") {
      this.reset();
    } else if (event.key === "[" || event.key === "{") {
      this.rotateSelected(-ANGLE_SNAP);
    } else if (event.key === "]" || event.key === "}") {
      this.rotateSelected(ANGLE_SNAP);
    } else if (event.key === "Delete" || event.key === "Backspace") {
      this.deleteSelected();
    }
  }

  private updateControls(): void {
    const running = this.outcome === "running";
    this.startButton.disabled = running;
    this.resetButton.disabled = false;
  }

  private renderLevelList(): void {
    this.levelList.innerHTML = "";

    for (const level of [getLevel("level-1"), getLevel("level-2"), getLevel("level-3"), getLevel("level-4"), getLevel("level-5")]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = this.persisted.completedLevels.includes(level.id) ? `${level.title} ✓` : level.title;
      button.disabled = this.level.id === level.id;
      button.addEventListener("click", () => this.loadLevel(level.id));
      this.levelList.append(button);
    }
  }

  private saveSolution(): void {
    this.persisted.solutions[this.level.id] = [...this.placedParts];
    this.savePersisted();
  }

  private markComplete(): void {
    if (!this.persisted.completedLevels.includes(this.level.id)) {
      this.persisted.completedLevels.push(this.level.id);
      this.savePersisted();
      this.renderLevelList();
    }
  }

  private loadPersisted(): PersistedState {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { solutions: {}, completedLevels: [] };
    }

    try {
      return JSON.parse(raw) as PersistedState;
    } catch {
      return { solutions: {}, completedLevels: [] };
    }
  }

  private savePersisted(): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.persisted));
  }
}
