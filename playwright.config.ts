import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/browser",
  timeout: 20_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 800 },
    baseURL: "http://127.0.0.1:4177",
  },
  webServer: {
    command: "npm run dev -- --port 4177",
    url: "http://127.0.0.1:4177",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
