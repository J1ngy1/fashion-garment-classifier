import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
  },
  webServer: {
    command:
      "npm --prefix app run build && npm --prefix app run preview -- --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: true,
    env: {
      ...process.env,
      PLAYWRIGHT: "1",
    },
  },
});
