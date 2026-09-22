import { test, expect } from '@playwright/test';

test.describe('FairwayFund Smoke Test', () => {
  test('should load homepage with key content', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('FairwayFund')).toBeVisible();
    await expect(page.getByText(/Play Golf.*Support Charities.*Win Prizes/i)).toBeVisible();
    
    await expect(page.getByRole('link', { name: /How It Works/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Pricing/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Charities/i })).toBeVisible();
    
    await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible();
  });

  test('should navigate to How It Works page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /How It Works/i }).first().click();
    
    await expect(page).toHaveURL('/how-it-works');
    await expect(page.getByRole('heading', { name: /How FairwayFund Works/i })).toBeVisible();
  });

  test('should navigate to Pricing page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /Pricing/i }).first().click();
    
    await expect(page).toHaveURL('/pricing');
    await expect(page.getByText(/Monthly/i)).toBeVisible();
    await expect(page.getByText(/Yearly/i)).toBeVisible();
  });

  test('should navigate to Charities page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /Charities/i }).first().click();
    
    await expect(page).toHaveURL('/charities');
    await expect(page.getByRole('heading', { name: /Our Charities/i })).toBeVisible();
  });

  test('should navigate to Login page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /Login/i }).first().click();
    
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
  });

  test('should navigate to Signup page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /Get Started/i }).first().click();
    
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: /Get Started/i })).toBeVisible();
  });
});
