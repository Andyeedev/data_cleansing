# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\login.test.ts >> login flow works end-to-end
- Location: e2e\login.test.ts:3:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/login
Call log:
  - navigating to "http://localhost:5173/login", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "This site can’t be reached" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - strong [ref=e9]: localhost
      - text: refused to connect.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Try:"
      - list [ref=e12]:
        - listitem [ref=e13]: Checking the connection
        - listitem [ref=e14]:
          - link "Checking the proxy and the firewall" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
    - generic [ref=e16]: ERR_CONNECTION_REFUSED
  - generic [ref=e17]:
    - button "Reload" [ref=e19] [cursor=pointer]
    - button "Details" [ref=e20] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('login flow works end-to-end', async ({ page }) => {
  4  |   // Go to login page
> 5  |   await page.goto('http://localhost:5173/login');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/login
  6  |   
  7  |   // Wait for login form
  8  |   await expect(page.locator('input[type="email"]')).toBeVisible();
  9  |   await expect(page.locator('input[type="password"]')).toBeVisible();
  10 |   
  11 |   // Fill in credentials
  12 |   await page.fill('input[type="email"]', 'admin@mapnexus.com');
  13 |   await page.fill('input[type="password"]', 'Admin123456');
  14 |   
  15 |   // Click login button
  16 |   await page.click('button[type="submit"]');
  17 |   
  18 |   // Wait for navigation to dashboard or onboarding
  19 |   const urlPromise = page.waitForURL(url => {
  20 |     const validUrls = ['/dashboard', '/onboarding/welcome', '/onboarding/setup', '/onboarding/hub'];
  21 |     return validUrls.some(u => url.includes(u));
  22 |   }, { timeout: 15000 });
  23 |   
  24 |   await urlPromise;
  25 |   
  26 |   // Check we're not stuck on login
  27 |   expect(page.url()).not.toContain('/login');
  28 |   
  29 |   // Should be on a valid page
  30 |   const validUrls = ['/dashboard', '/onboarding/welcome', '/onboarding/setup', '/onboarding/hub'];
  31 |   const isValid = validUrls.some(u => page.url().includes(u));
  32 |   expect(isValid).toBeTruthy();
  33 | });
```