// Runs against a deployed environment: Kargo's verification Job sets BASE_URL,
// EXPECTED_ENV and EXPECTED_RELEASE, and HTTPS_PROXY to reach it past the WAF.
import { defineConfig } from "@playwright/test";

const proxy = process.env.HTTPS_PROXY;

export default defineConfig({
  testDir: "tests",
  retries: 2,
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL,
    ...(proxy && { proxy: { server: proxy } }),
  },
});
