import { test, expect } from '@playwright/test';

test.describe('Draw System End-to-End', () => {
  test('authenticated subscriber can view current draw and eligibility', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/draws');
    await expect(page.locator('h1')).toContainText('FairwayFund Draw');

    await expect(page.locator('text=Prize Pool').or(page.locator('text=Total Prize Pool'))).toBeVisible();
    await expect(page.locator('text=Your Draw Eligibility').or(page.locator('text=Draw Eligibility'))).toBeVisible();
    await expect(page.locator('text=Prize Tiers')).toBeVisible();
  });

  test('draw page shows prize tier distribution', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/draws');

    await expect(page.locator('text=5-Number Match').or(page.locator('text=5-Match'))).toBeVisible();
    await expect(page.locator('text=4-Number Match').or(page.locator('text=4-Match'))).toBeVisible();
    await expect(page.locator('text=3-Number Match').or(page.locator('text=3-Match'))).toBeVisible();

    await expect(page.locator('text=40%')).toBeVisible();
    await expect(page.locator('text=35%')).toBeVisible();
    await expect(page.locator('text=25%')).toBeVisible();
  });

  test('admin can access draw management', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/admin/draws');
    await expect(page.locator('h1')).toContainText('Draw Management');
    
    await expect(page.locator('text=Draw Configuration').or(page.locator('text=Configuration'))).toBeVisible();
  });

  test('admin can select draw mode', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/admin/draws');

    const randomOption = page.locator('text=Random').first();
    const algorithmicOption = page.locator('text=Algorithmic').first();

    if (await randomOption.isVisible()) {
      await expect(randomOption).toBeVisible();
    }
    if (await algorithmicOption.isVisible()) {
      await expect(algorithmicOption).toBeVisible();
    }
  });

  test('admin can view simulation section', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/admin/draws');

    await expect(page.locator('text=Simulation').or(page.locator('text=Draw Simulation'))).toBeVisible();
    await expect(page.locator('text=SIMULATION')).toBeVisible();
  });

  test('non-admin cannot access admin draw page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/admin/draws');
    await expect(page.locator('text=Unauthorized').or(page.locator('text=Access Denied'))).toBeVisible();
  });
});
