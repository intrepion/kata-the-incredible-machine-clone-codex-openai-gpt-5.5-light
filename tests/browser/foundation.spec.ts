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
