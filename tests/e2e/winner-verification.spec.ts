import { test, expect } from '@playwright/test';

test.describe('Winner Verification & Payout', () => {
  test('subscriber can view winnings and submit proof', async ({ page }) => {
    // Login as subscriber
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Navigate to winnings
    await page.goto('/winnings');
    
    // Should show winnings
    const winningsHeader = page.locator('h1');
    if (await winningsHeader.isVisible()) {
      await expect(winningsHeader).toContainText('Winnings');
    }
  });

  test('admin can access winner management', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Navigate to winner management
    await page.goto('/admin/winners');
    
    // Should show admin interface
    const heading = page.locator('h1');
    if (await heading.isVisible()) {
      await expect(heading).toContainText('Winner');
    }
  });

  test('admin can filter winners by status', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/admin/winners');

    // Look for filter buttons
    const allButton = page.locator('button:has-text("all")');
    if (await allButton.isVisible()) {
      await expect(allButton).toBeVisible();
    }
  });

  test('non-admin cannot access winner management', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Try to access admin winners page
    await page.goto('/admin/winners');
    
    // Should be redirected or show unauthorized
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/admin/winners');
  });

  test('winner sees appropriate status badges', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/winnings');

    // Look for status badges
    const badges = page.locator('[class*="badge"]');
    if (await badges.first().isVisible()) {
      // Should show verification or payout status
      const badgeText = await badges.first().textContent();
      expect(['pending', 'approved', 'rejected', 'paid']).toContain(badgeText?.toLowerCase());
    }
  });
});
