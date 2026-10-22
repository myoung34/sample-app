import { expect, test } from "@playwright/test";

const env = process.env.EXPECTED_ENV;
const release = process.env.EXPECTED_RELEASE;

test("the API serves the promoted release and records a visit", async ({ request }) => {
  const res = await request.get("/api/visits");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body).toMatchObject({ env, version: release });
  expect(body.visits).toBeGreaterThan(0);
});

test("the page shows the promoted release and the API's answer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Sample App" })).toBeVisible();
  await expect(page.getByText(`Web release: ${release}`)).toBeVisible();
  await expect(page.getByText(`Visits in ${env}`)).toBeVisible();
});
