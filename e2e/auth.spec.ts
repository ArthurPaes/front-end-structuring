/**
 * @file E2E auth flow test — Playwright.
 *
 * TESTING STRATEGY:
 *   E2E tests verify critical user journeys against a running app.
 *   Run against a local dev server or staging environment.
 *
 * NOTE: These tests require a running backend OR MSW in the browser.
 */
import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should login and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // After login, should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');

    // Should be redirected to login page
    await expect(page).toHaveURL(/login/);
  });
});
