import Matter from "matter-js";
import type { FixedObjectDefinition, LevelDefinition, PlacedPartDefinition } from "./domain";

export interface PhysicsWorld {
  engine: Matter.Engine;
  bodiesById: Map<string, Matter.Body>;
}

export function createPhysicsWorld(level: LevelDefinition, placedParts: PlacedPartDefinition[]): PhysicsWorld {
  const engine = Matter.Engine.create();
  engine.gravity.y = 1;
  const bodiesById = new Map<string, Matter.Body>();

  for (const fixedObject of level.fixedObjects) {
    const body = fixedBody(fixedObject);
    bodiesById.set(fixedObject.id, body);
    Matter.Composite.add(engine.world, body);
  }

  for (const part of [...level.fixtureParts, ...placedParts]) {
    const body = partBody(part);
    bodiesById.set(part.id, body);
    Matter.Composite.add(engine.world, body);
  }

  return { engine, bodiesById };
}

export function stepWorld(world: PhysicsWorld, deltaMs: number): void {
  Matter.Engine.update(world.engine, deltaMs);
}

function fixedBody(definition: FixedObjectDefinition): Matter.Body {
  return Matter.Bodies.rectangle(
    definition.position.x,
    definition.position.y,
    definition.size.width,
    definition.size.height,
    {
      isStatic: true,
      angle: definition.angle ?? 0,
      label: definition.id,
      render: { fillStyle: "#6f6656" },
    },
  );
}

function partBody(part: PlacedPartDefinition): Matter.Body {
  if (part.kind === "ball") {
    return Matter.Bodies.circle(part.position.x, part.position.y, 18, {
      restitution: 0.55,
      friction: 0.02,
      label: part.id,
      render: { fillStyle: "#d94f30" },
    });
  }

  if (part.kind === "basket") {
    return Matter.Bodies.rectangle(part.position.x, part.position.y, 140, 42, {
      isStatic: true,
      isSensor: true,
      label: part.id,
      render: { fillStyle: "#3b7f72" },
    });
  }

  if (part.kind === "ramp") {
    return Matter.Bodies.rectangle(part.position.x, part.position.y, 230, 20, {
      isStatic: true,
      angle: part.angle,
      friction: 0.01,
      label: part.id,
      render: { fillStyle: "#a97844" },
    });
  }

  if (part.kind === "bumper") {
    return Matter.Bodies.circle(part.position.x, part.position.y, 30, {
      isStatic: true,
      restitution: 1.4,
      label: part.id,
      render: { fillStyle: "#d94f30" },
    });
  }

  if (part.kind === "fan") {
    return Matter.Bodies.rectangle(part.position.x, part.position.y, 58, 72, {
      isStatic: true,
      isSensor: true,
      angle: part.angle,
      label: part.id,
      render: { fillStyle: "#6da7c8" },
    });
  }

  if (part.kind === "conveyor") {
    return Matter.Bodies.rectangle(part.position.x, part.position.y, 190, 22, {
      isStatic: true,
      angle: part.angle,
      friction: 0.01,
      label: part.id,
      render: { fillStyle: "#5b6575" },
    });
  }

  if (part.kind === "button") {
    return Matter.Bodies.rectangle(part.position.x, part.position.y, 70, 16, {
      isStatic: true,
      isSensor: true,
      label: part.id,
      render: { fillStyle: "#f4c542" },
    });
  }

  return Matter.Bodies.rectangle(part.position.x, part.position.y, 80, 34, {
    isStatic: true,
    angle: part.angle,
    label: part.id,
    render: { fillStyle: "#596475" },
  });
}
