import { test, expect } from "@playwright/test";

test("トップページが開ける", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
