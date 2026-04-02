import { test, expect } from "@playwright/test";

test("user can filter images from the library", async ({ page }) => {
  await page.goto("/");

  await page.selectOption("#garmentTypeFilter", "Dress");

  await expect(page.getByText("1 result(s)")).toBeVisible();
});
