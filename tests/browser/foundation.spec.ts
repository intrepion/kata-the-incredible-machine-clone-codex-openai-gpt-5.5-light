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
