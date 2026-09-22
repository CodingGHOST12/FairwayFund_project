import { test, expect } from '@playwright/test';

test.describe('Golf Scores System End-to-End', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as test subscriber
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('navigates to /scores from dashboard and displays score manager', async ({ page }) => {
    await page.click('text=Golf Scores');
    await page.waitForURL('/scores');
    await expect(page.locator('h1')).toContainText('Golf Scores');
    await expect(page.locator('text=The 5-Score Rule')).toBeVisible();
    await expect(page.locator('text=Active Slots')).toBeVisible();
  });

  test('unauthenticated visitor to /scores is redirected to /login', async ({ page }) => {
    // Logout first
    await page.goto('/account');
    await page.click('text=Logout');
    await page.waitForURL('/');

    // Try accessing protected scores page
    await page.goto('/scores');
    await page.waitForURL(/\/login/);
  });
});
