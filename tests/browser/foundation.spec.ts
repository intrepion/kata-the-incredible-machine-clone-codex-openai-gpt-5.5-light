import { expect, test } from "@playwright/test";

test("served app boots the Level 1 fixture and exposes the test seam", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Basket Case" })).toBeVisible();
  await expect(page.getByTestId("machine-board")).toBeVisible();

  const snapshot = await page.evaluate(() => window.clockworkMischiefTest.snapshot());
  expect(snapshot.levelId).toBe("level-1");
  expect(snapshot.outcome).toBe("idle");
  expect(snapshot.placedParts.map((part) => part.kind)).toEqual(["ball", "basket"]);
});

test("player can complete Level 1 by placing a ramp and running the machine", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    window.clockworkMischiefTest.placePart({
      id: "ramp-solution",
      kind: "ramp",
      position: { x: 300, y: 270 },
      angle: 0.35,
    });
    window.clockworkMischiefTest.start();
  });

  await expect.poll(async () => page.evaluate(() => window.clockworkMischiefTest.snapshot().outcome)).toBe("success");
  await expect(page.getByText("Success!")).toBeVisible();

  const resetSnapshot = await page.evaluate(() => window.clockworkMischiefTest.reset());
  expect(resetSnapshot.outcome).toBe("idle");
});

test("solutions and completions persist per level", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    window.clockworkMischiefTest.placePart({
      id: "ramp-solution",
      kind: "ramp",
      position: { x: 300, y: 270 },
      angle: 0.35,
    });
    window.clockworkMischiefTest.start();
  });
  await expect.poll(async () => page.evaluate(() => window.clockworkMischiefTest.snapshot().outcome)).toBe("success");

  await page.reload();
  const snapshot = await page.evaluate(() => window.clockworkMischiefTest.snapshot());

  expect(snapshot.completedLevels).toContain("level-1");
  expect(snapshot.placedParts.some((part) => part.id === "ramp-solution")).toBe(true);
});

test("fan force can complete the fan level", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    window.clockworkMischiefTest.loadLevel("level-4");
    window.clockworkMischiefTest.placePart({ id: "ramp-4", kind: "ramp", position: { x: 300, y: 270 }, angle: 0.35 });
    window.clockworkMischiefTest.placePart({ id: "fan-4", kind: "fan", position: { x: 560, y: 455 }, angle: 0 });
    window.clockworkMischiefTest.start();
  });

  await expect.poll(async () => page.evaluate(() => window.clockworkMischiefTest.snapshot().outcome)).toBe("success");
});

test("buttoned conveyor can complete the final launch level", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    window.clockworkMischiefTest.loadLevel("level-5");
    window.clockworkMischiefTest.placePart({ id: "ramp-5", kind: "ramp", position: { x: 200, y: 270 }, angle: 0.35 });
    window.clockworkMischiefTest.placePart({ id: "button-5", kind: "button", position: { x: 395, y: 486 }, angle: 0 });
    window.clockworkMischiefTest.placePart({ id: "conveyor-5", kind: "conveyor", position: { x: 620, y: 486 }, angle: 0 });
    window.clockworkMischiefTest.start();
  });

  await expect.poll(async () => page.evaluate(() => window.clockworkMischiefTest.snapshot().outcome)).toBe("success");
});

test("keyboard shortcuts reveal hints and control selected parts", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("A simple ramp can turn falling into rolling.")).toBeHidden();
  await page.keyboard.press("h");
  await expect(page.getByText("A simple ramp can turn falling into rolling.")).toBeVisible();

  await page.evaluate(() => {
    window.clockworkMischiefTest.placePart({ id: "ramp-keyboard", kind: "ramp", position: { x: 300, y: 270 }, angle: 0 });
  });
  await page.keyboard.press("]");

  const rotated = await page.evaluate(() => window.clockworkMischiefTest.snapshot().placedParts.find((part) => part.id === "ramp-keyboard")?.angle);
  expect(rotated).toBeGreaterThan(0);

  await page.keyboard.press("Backspace");
  const removed = await page.evaluate(() => window.clockworkMischiefTest.snapshot().placedParts.some((part) => part.id === "ramp-keyboard"));
  expect(removed).toBe(false);
});
