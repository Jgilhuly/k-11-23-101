import { test, expect } from '@playwright/test';

test.describe('Create User', () => {
  test('should create a new user successfully', async ({ page }) => {
    await page.goto('/users/new');

    // Generate unique email to avoid conflicts
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@example.com`;

    // Fill in the user form
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill(testEmail);
    await page.getByLabel('Password').fill('SecurePassword123!');

    // Submit the form
    await page.getByRole('button', { name: 'Create User' }).click();

    // Wait for success message
    await expect(page.getByText('Saved successfully!')).toBeVisible({ timeout: 5000 });

    // Wait for navigation to user detail page
    await page.waitForURL(/\/users\/\d+/, { timeout: 5000 });

    // Verify we're on the user detail page
    const url = page.url();
    expect(url).toMatch(/\/users\/\d+/);
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/users/new');

    // Try to submit form without filling required fields
    await page.getByRole('button', { name: 'Create User' }).click();

    // HTML5 validation should prevent submission
    // Check that the form is still on the page (not navigated away)
    await expect(page.getByRole('heading', { name: 'Create User' })).toBeVisible();

    // Verify required fields are marked (browser validation)
    const nameInput = page.getByLabel('Name');
    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Password');

    // Check HTML5 validation attributes
    await expect(nameInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/users/new');

    // Fill in form with invalid email
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').fill('Password123');

    // Try to submit
    await page.getByRole('button', { name: 'Create User' }).click();

    // HTML5 email validation should prevent submission
    // The email input should have type="email" which triggers browser validation
    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Form should still be on the page
    await expect(page.getByRole('heading', { name: 'Create User' })).toBeVisible();
  });

  test('should cancel and return to users list', async ({ page }) => {
    await page.goto('/users/new');

    // Fill in some data
    await page.getByLabel('Name').fill('Test User');

    // Click cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify navigation back to users list
    await expect(page).toHaveURL('/users');
  });
});

