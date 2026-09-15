import { defineConfig } from "@playwright/test"
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 180_000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:8451",
    headless: true,
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
      args: [
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
      ],
    },
  },
  webServer: {
    command:
      "VITE_APP_MODE=showcase npm run build && npm run preview -- --host 127.0.0.1 --port 8451",
    url: "http://127.0.0.1:8451",
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
