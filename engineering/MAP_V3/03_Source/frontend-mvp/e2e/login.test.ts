import { test, expect } from '@playwright/test';

test('login flow works end-to-end', async ({ page }) => {
  // Go to login page
  await page.goto('http://localhost:5173/login');
  
  // Wait for login form
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  
  // Fill in credentials
  await page.fill('input[type="email"]', 'admin@mapnexus.com');
  await page.fill('input[type="password"]', 'Admin123456');
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard or onboarding
  const urlPromise = page.waitForURL(url => {
    const validUrls = ['/dashboard', '/onboarding/welcome', '/onboarding/setup', '/onboarding/hub'];
    return validUrls.some(u => url.includes(u));
  }, { timeout: 15000 });
  
  await urlPromise;
  
  // Check we're not stuck on login
  expect(page.url()).not.toContain('/login');
  
  // Should be on a valid page
  const validUrls = ['/dashboard', '/onboarding/welcome', '/onboarding/setup', '/onboarding/hub'];
  const isValid = validUrls.some(u => page.url().includes(u));
  expect(isValid).toBeTruthy();
});