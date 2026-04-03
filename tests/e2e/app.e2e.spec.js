import { test, expect } from "@playwright/test";
import path from "node:path";

test("user can upload, classify, and filter images", async ({ page }) => {
  await page.goto("/");

  const fixturePath = path.resolve(
    "tests/fixtures/dress-street-blue-floral-seoul-korea-summer-july-2026.svg",
  );
  await page.setInputFiles('input[type="file"]', fixturePath);
  await page
    .getByRole("button", { name: "Run Demo AI Classification" })
    .click();

  await page.selectOption("#cityFilter", "Seoul");
  await page.selectOption("#monthFilter", "July");
  await page.selectOption("#garmentTypeFilter", "Dress");

  await expect(page.getByText("1 result(s)")).toBeVisible();
});
