import { test, expect } from '@playwright/test';

test.describe('Users Page', () => {
  test('should display users list and allow navigation', async ({ page }) => {
    await page.goto('/users');

    // Wait for the page to load
    const loadingSpinner = page.locator('.loading .spinner');
    await loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

    // Verify page title is visible
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();

    // Verify "New User" button is visible
    await expect(page.getByRole('link', { name: 'New User' })).toBeVisible();

    // Check if users table exists or empty state
    const table = page.locator('.table');
    const emptyState = page.getByText('No users found');

    const hasTable = await table.count() > 0;
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    if (hasTable) {
      // If table exists, verify table headers
      await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Joined' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
    } else if (hasEmptyState) {
      // If empty state, verify it's displayed correctly
      await expect(emptyState).toBeVisible();
      await expect(page.getByText('Start by creating your first user')).toBeVisible();
    }
  });

  test('should navigate to create user form', async ({ page }) => {
    await page.goto('/users');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Click on "New User" button
    await page.getByRole('link', { name: 'New User' }).click();

    // Verify navigation to create user page
    await expect(page).toHaveURL('/users/new');

    // Verify form elements are present
    await expect(page.getByRole('heading', { name: 'Create User' })).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });
});

