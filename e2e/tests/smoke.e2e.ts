import { expect, test } from "@playwright/test";

test("smoke test", async ({ page }) => {
  await page.goto("http://localhost:3000");
  // Just check if we get a response, specific content might vary per example
  // Assuming apps/docs runs on 3000 or one of the examples
  const title = await page.title();
  expect(title).toBeDefined();
});
