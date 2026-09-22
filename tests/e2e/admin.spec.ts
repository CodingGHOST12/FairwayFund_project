import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test('admin login shows admin panel', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
    
    // Admin panel should load
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('admin can navigate to all admin sections', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');

    // Test navigation
    await page.locator('text=Users').click();
    await expect(page).toHaveURL('/admin/users');

    await page.locator('text=Subscriptions').click();
    await expect(page).toHaveURL('/admin/subscriptions');

    await page.locator('text=Draws').click();
    await expect(page).toHaveURL('/admin/draws');

    await page.locator('text=Charities').click();
    await expect(page).toHaveURL('/admin/charities');

    await page.locator('text=Winners').click();
    await expect(page).toHaveURL('/admin/winners');

    await page.locator('text=Reports').click();
    await expect(page).toHaveURL('/admin/reports');
  });

  test('subscriber cannot access admin pages', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Try to access admin pages
    await page.goto('/admin');
    expect(page.url()).not.toContain('/admin');

    await page.goto('/admin/users');
    expect(page.url()).not.toContain('/admin/users');
  });

  test('admin can view user management', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');

    await page.goto('/admin/users');
    await expect(page.locator('h1')).toContainText('User Management');
    await expect(page.locator('text=User')).toBeVisible();
  });

  test('admin can view subscription management', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');

    await page.goto('/admin/subscriptions');
    await expect(page.locator('h1')).toContainText('Subscription Management');
    await expect(page.locator('text=Plan')).toBeVisible();
  });

  test('admin can view charity management', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');

    await page.goto('/admin/charities');
    await expect(page.locator('h1')).toContainText('Charity Management');
    await expect(page.locator('text=Charity')).toBeVisible();
  });

  test('admin can view winner management', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');

    await page.goto('/admin/winners');
    await expect(page.locator('h1')).toContainText('Winner Management');
    await expect(page.locator('text=Winner')).toBeVisible();
  });

  test('admin can view reports', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');

    await page.goto('/admin/reports');
    await expect(page.locator('h1')).toContainText('Reports & Analytics');
    await expect(page.locator('text=User')).toBeVisible();
  });
});
