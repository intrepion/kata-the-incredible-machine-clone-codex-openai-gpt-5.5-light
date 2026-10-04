import { pathToFileURL } from "node:url";
import { expect, test } from "@playwright/test";

test("direct file app boots the Level 1 fixture", async ({ page }) => {
  await page.goto(pathToFileURL(`${process.cwd()}/file-dist/index.html`).toString());

  await expect(page.getByRole("heading", { name: "Basket Case" })).toBeVisible();
  const snapshot = await page.evaluate(() => window.clockworkMischiefTest.snapshot());
  expect(snapshot.levelId).toBe("level-1");
});
