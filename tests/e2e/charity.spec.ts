import { test, expect } from '@playwright/test';

test.describe('Charity System End-to-End', () => {
  test('public user can browse charities and use search and filter', async ({ page }) => {
    await page.goto('/charities');
    await expect(page.locator('h1')).toContainText('Play Golf. Support Great Causes.');

    // Search for Greenside
    await page.fill('#charity-search-input', 'Greenside');
    await expect(page.locator('text=Greenside Foundation')).toBeVisible();

    // Clear search
    await page.click('button[aria-label="Clear search query"]');

    // Filter by Youth Sports
    await page.click('button:has-text("Youth Sports")');
    await expect(page.locator('text=Greenside Foundation')).toBeVisible();
  });

  test('public user can view charity details and handles invalid ID gracefully', async ({ page }) => {
    await page.goto('/charities/charity-1');
    await expect(page.locator('h1')).toContainText('Greenside Foundation');
    await expect(page.locator('text=About Greenside Foundation')).toBeVisible();

    // Invalid ID
    await page.goto('/charities/invalid-charity-id');
    await expect(page.locator('text=Charity Not Found')).toBeVisible();
  });

  test('authenticated subscriber can manage supported charity and contribution', async ({ page }) => {
    // Login as subscriber
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Go to charity page
    await page.goto('/charity');
    await expect(page.locator('h1')).toContainText('Your Supported Charity');

    // Check contribution slider / presets
    await expect(page.locator('text=Charity Contribution Percentage')).toBeVisible();
  });
});
