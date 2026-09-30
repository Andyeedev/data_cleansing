/**
 * Playwright config for the Report Studio browser E2E journey.
 *
 * Deliberately narrow: only e2e/*.e2e.mjs runs here, so the existing vitest
 * unit/integration suites are untouched. The servers are assumed to be already
 * running locally (Vite on 5173 proxying FastAPI on 8000); this config does not
 * start them, because both are long-lived dev processes with real state.
 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.e2e\.mjs/,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  // The journey is stateful by design (create -> publish -> share -> verify),
  // so it runs in order and stops at the first real failure.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_WEB || 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
    },
  ],
});
