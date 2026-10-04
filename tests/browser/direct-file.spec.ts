import { pathToFileURL } from "node:url";
import { expect, test } from "@playwright/test";

test("root direct file app boots the Level 1 fixture", async ({ page }) => {
  await page.goto(pathToFileURL(`${process.cwd()}/index.html`).toString());

  await expect(page.getByRole("heading", { name: "Basket Case" })).toBeVisible();
  const snapshot = await page.evaluate(() => window.clockworkMischiefTest.snapshot());
  expect(snapshot.levelId).toBe("level-1");
});

test("root direct file app completes the Level 1 loop", async ({ page }) => {
  await page.goto(pathToFileURL(`${process.cwd()}/index.html`).toString());

  await page.evaluate(() => {
    window.clockworkMischiefTest.placePart({
      id: "ramp-direct",
      kind: "ramp",
      position: { x: 300, y: 270 },
      angle: 0.35,
    });
    window.clockworkMischiefTest.start();
  });

  await expect.poll(async () => page.evaluate(() => window.clockworkMischiefTest.snapshot().outcome)).toBe("success");
});

test("file-dist direct file app also boots", async ({ page }) => {
  await page.goto(pathToFileURL(`${process.cwd()}/file-dist/index.html`).toString());

  await expect(page.getByRole("heading", { name: "Basket Case" })).toBeVisible();
  const snapshot = await page.evaluate(() => window.clockworkMischiefTest.snapshot());
  expect(snapshot.levelId).toBe("level-1");
});
