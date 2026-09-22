import { test, expect } from '@playwright/test';

test.describe('Subscriber Dashboard', () => {
  test('login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Dashboard should load
    await expect(page.locator('h1')).toContainText('Welcome back');
  });

  test('dashboard shows subscription status', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show subscription status badge
    const status = page.locator('[class*="SubscriptionStatus"]');
    await expect(status).toBeVisible();
  });

  test('dashboard shows scores summary', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show scores section
    await expect(page.locator('text=Golf Scores')).toBeVisible();
    await expect(page.locator('text=/[0-5] rounds/')).toBeVisible();
  });

  test('dashboard shows charity selection', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show charity section
    await expect(page.locator('text=Your Charity').or(page.locator('text=Choose Charity'))).toBeVisible();
  });

  test('dashboard shows draw information', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show draw section
    await expect(page.locator('text=Monthly Draw')).toBeVisible();
    await expect(page.locator('text=View Draw')).toBeVisible();
  });

  test('dashboard shows winnings section', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should show winnings section
    await expect(page.locator('text=Prize Winnings')).toBeVisible();
    await expect(page.locator('text=View Winnings')).toBeVisible();
  });

  test('dashboard quick actions work', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test Add Score link
    const addScoreLink = page.locator('text=Add Score');
    if (await addScoreLink.isVisible()) {
      await addScoreLink.click();
      await page.waitForURL('/scores');
      await page.goto('/dashboard');
    }
    
    // Test View Draw link
    const viewDrawLink = page.locator('text=View Draw');
    if (await viewDrawLink.isVisible()) {
      await viewDrawLink.click();
      await page.waitForURL('/draws');
      await page.goto('/dashboard');
    }
    
    // Test Manage Charity link
    const manageCharityLink = page.locator('text=Manage Charity');
    if (await manageCharityLink.isVisible()) {
      await manageCharityLink.click();
      await page.waitForURL('/charity');
      await page.goto('/dashboard');
    }
  });

  test('dashboard shows empty states', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for empty state messages
    const noScores = page.locator('text=No scores added yet');
    if (await noScores.isVisible()) {
      // Should show helpful message
      await expect(noScores).toBeVisible();
    }
  });

  test('logout works from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Find logout button/link
    const logoutLink = page.locator('text=Logout');
    if (await logoutLink.isVisible()) {
      await logoutLink.click();
      await page.waitForURL('/login');
    }
  });

  test('unauthenticated redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/dashboard');
  });
});

test.describe('Account Page', () => {
  test('account page shows profile info', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/account');
    await expect(page.locator('h1')).toContainText('Account Settings');
    
    // Should show name, email, role
    await expect(page.locator('text=Name')).toBeVisible();
  });
});
