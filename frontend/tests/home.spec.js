import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display home page with navigation links', async ({ page }) => {
    await page.goto('/');

    // Check that the main heading is visible
    await expect(page.getByRole('heading', { name: 'Welcome to CRUD App' })).toBeVisible();

    // Check that the description is visible
    await expect(page.getByText('Manage your Products and Users with ease')).toBeVisible();

    // Check Products Management card
    await expect(page.getByRole('heading', { name: 'Products Management' })).toBeVisible();
    await expect(page.getByText('Create, read, update, and delete products')).toBeVisible();

    // Check Users Management card
    await expect(page.getByRole('heading', { name: 'Users Management' })).toBeVisible();
    await expect(page.getByText('Manage user accounts with email')).toBeVisible();

    // Check navigation buttons
    await expect(page.getByRole('link', { name: 'View Products' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Product' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Users' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create User' })).toBeVisible();
  });

  test('should navigate to products page from home', async ({ page }) => {
    await page.goto('/');

    // Click on "View Products" button
    await page.getByRole('link', { name: 'View Products' }).click();

    // Verify navigation to products page
    await expect(page).toHaveURL('/products');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });

  test('should navigate to users page from home', async ({ page }) => {
    await page.goto('/');

    // Click on "View Users" button
    await page.getByRole('link', { name: 'View Users' }).click();

    // Verify navigation to users page
    await expect(page).toHaveURL('/users');
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  });
});

