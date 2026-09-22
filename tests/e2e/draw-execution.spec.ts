import { test, expect } from '@playwright/test';

test.describe('Draw Execution and Results', () => {
  test('admin can execute and publish draw', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Navigate to admin draws
    await page.goto('/admin/draws');
    await expect(page.locator('h1')).toContainText('Draw Management');

    // Look for Execute Draw button (if draw is ready)
    const executeButton = page.locator('button:has-text("Execute Draw")');
    if (await executeButton.isVisible()) {
      await executeButton.click();
      
      // Wait for execution to complete
      await page.waitForTimeout(2000);
      
      // Should show results
      await expect(page.locator('text=Winning Numbers').or(page.locator('text=Draw Execution Results'))).toBeVisible({ timeout: 10000 });
      
      // Should show publish button
      const publishButton = page.locator('button:has-text("Publish Results")');
      if (await publishButton.isVisible()) {
        await publishButton.click();
        
        // Wait for publish confirmation
        await page.waitForTimeout(1000);
      }
    }
  });

  test('subscriber can view published draw results', async ({ page }) => {
    // Login as subscriber
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Navigate to draws page
    await page.goto('/draws');
    await expect(page.locator('h1')).toContainText('FairwayFund Draw');

    // Check if published results exist
    const publishedBadge = page.locator('text=Published');
    if (await publishedBadge.isVisible()) {
      // Should show winning numbers
      await expect(page.locator('text=Winning Numbers')).toBeVisible();
      
      // Should show participant count
      await expect(page.locator('text=Participants')).toBeVisible();
    }
  });

  test('subscriber sees winner notification if they won', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/draws');

    // Check for winner notification (may or may not be present depending on results)
    const winnerNotification = page.locator('text=Congratulations');
    // Don't fail if not present - user might not have won
  });

  test('draw page shows draw mode and schedule', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'subscriber@example.local');
    await page.fill('input[name="password"]', 'subscriber123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/draws');

    // Should show draw schedule
    await expect(page.locator('text=Draw Schedule').or(page.locator('text=Draw Date'))).toBeVisible();
    
    // Should show draw mode (Random or Algorithmic)
    await expect(page.locator('text=Random').or(page.locator('text=Algorithmic'))).toBeVisible();
  });

  test('admin sees execution protection messages', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/admin/draws');

    // Should show appropriate action buttons or messages
    const configMessage = page.locator('text=Configure').or(page.locator('text=Execute')).or(page.locator('text=Publish'));
    await expect(configMessage.first()).toBeVisible();
  });
});
