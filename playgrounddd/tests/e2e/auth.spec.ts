import { test, expect } from '@playwright/test';

test.describe('Auth pages (smoke + client-side validation)', () => {
  test('signin page renders and has expected controls', async ({ page }) => {
    await page.goto('/signin');

    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('signup page renders and has expected controls', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('signin client-side validation: invalid email shows error', async ({ page }) => {
    await page.goto('/signin');

    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Password').fill('12345678');
    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page.getByText(/email invalid/i)).toBeVisible();
  });

  test('signin client-side validation: short password shows error', async ({ page }) => {
    await page.goto('/signin');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('short');
    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page.getByText(/password must be over 8 characters long/i)).toBeVisible();
  });

  test('home redirects to signin when not authenticated (best-effort)', async ({ page }) => {
    await page.goto('/home');

    // The app redirects client-side after session fetch resolves.
    await page.waitForURL(/\/signin$/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/signin$/);
  });

  test('callback shows loading UI (no error param)', async ({ page }) => {
    await page.goto('/callback');
    await expect(page.getByRole('heading', { name: /loading/i })).toBeVisible();
  });

  test('callback shows error UI when error param is present', async ({ page }) => {
    await page.goto('/callback?error=some_error');
    await expect(page.getByRole('heading', { name: /error/i })).toBeVisible();
    await expect(page.getByText(/some_error/i)).toBeVisible();
  });

  test('reset-password page renders request form without token', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.getByRole('heading', { name: /reset your password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();
  });
});
