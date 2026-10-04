import Matter from "matter-js";
import type { GameSnapshot, LevelDefinition, PlacedPartDefinition, RunOutcome } from "../domain";
import { getLevel } from "../levels";
import { createPhysicsWorld, stepWorld, type PhysicsWorld } from "../physics";

const FRAME_MS = 1_000 / 60;

export class ClockworkGame {
  private readonly root: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly status: HTMLParagraphElement;
  private level: LevelDefinition = getLevel("level-1");
  private placedParts: PlacedPartDefinition[] = [];
  private world: PhysicsWorld | null = null;
  private outcome: RunOutcome = "idle";
  private animationFrame = 0;

  constructor(root: HTMLElement) {
    this.root = root;
    this.canvas = document.createElement("canvas");
    const context = this.canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas 2D context is unavailable");
    }

    this.context = context;
    this.status = document.createElement("p");
  }

  mount(): void {
    this.root.className = "app-shell";
    this.root.innerHTML = "";

    const header = document.createElement("header");
    header.className = "topbar";
    header.innerHTML = `
      <div>
        <p class="eyebrow">Clockwork Mischief</p>
        <h1>${this.level.title}</h1>
      </div>
      <button type="button" data-action="start">Start</button>
    `;

    const objective = document.createElement("p");
    objective.className = "objective";
    objective.textContent = this.level.objective;

    this.status.className = "status";
    this.status.textContent = "Build mode ready.";

    this.canvas.width = this.level.board.width;
    this.canvas.height = this.level.board.height;
    this.canvas.className = "machine-board";
    this.canvas.dataset.testid = "machine-board";

    this.root.append(header, objective, this.canvas, this.status);
    header.querySelector<HTMLButtonElement>("[data-action='start']")?.addEventListener("click", () => {
      this.start();
    });

    this.loadLevel(this.level.id);
    this.installTestSeam();
  }

  loadLevel(levelId: string): GameSnapshot {
    this.stopAnimation();
    this.level = getLevel(levelId);
    this.placedParts = [];
    this.outcome = "idle";
    this.world = createPhysicsWorld(this.level, this.placedParts);
    this.canvas.width = this.level.board.width;
    this.canvas.height = this.level.board.height;
    this.draw();
    this.status.textContent = "Build mode ready.";
    return this.snapshot();
  }

  start(): GameSnapshot {
    this.stopAnimation();
    this.world = createPhysicsWorld(this.level, this.placedParts);
    this.outcome = "running";
    this.status.textContent = "Run mode.";
    this.tick();
    return this.snapshot();
  }

  reset(): GameSnapshot {
    return this.loadLevel(this.level.id);
  }

  snapshot(): GameSnapshot {
    return {
      levelId: this.level.id,
      levelTitle: this.level.title,
      mode: this.outcome === "running" ? "run" : "build",
      outcome: this.outcome,
      board: this.level.board,
      placedParts: [...this.level.fixtureParts, ...this.placedParts],
    };
  }

  private tick(): void {
    if (!this.world || this.outcome !== "running") {
      return;
    }

    stepWorld(this.world, FRAME_MS);
    this.draw();
    this.animationFrame = window.requestAnimationFrame(() => this.tick());
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
      start: () => this.start(),
      reset: () => this.reset(),
      snapshot: () => this.snapshot(),
    };
  }
}
