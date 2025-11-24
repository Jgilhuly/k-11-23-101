import { test, expect } from '@playwright/test';

test.describe('Create Product', () => {
  test('should create a new product successfully', async ({ page }) => {
    await page.goto('/products/new');

    // Fill in the product form
    await page.getByLabel('Product Name').fill('Test Product');
    await page.getByLabel('Description').fill('This is a test product created by Playwright');
    await page.getByLabel('Price').fill('29.99');
    await page.getByLabel('Category').fill('Electronics');
    await page.getByLabel('Tags (comma-separated)').fill('test, automated, playwright');

    // Ensure "In Stock" checkbox is checked (it should be by default)
    const inStockCheckbox = page.getByLabel('In Stock');
    if (!(await inStockCheckbox.isChecked())) {
      await inStockCheckbox.check();
    }

    // Submit the form
    await page.getByRole('button', { name: 'Create Product' }).click();

    // Wait for success message
    await expect(page.getByText('Saved successfully!')).toBeVisible({ timeout: 5000 });

    // Wait for navigation to product detail page
    await page.waitForURL(/\/products\/\d+/, { timeout: 5000 });

    // Verify we're on the product detail page
    const url = page.url();
    expect(url).toMatch(/\/products\/\d+/);
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/products/new');

    // Try to submit form without filling required fields
    await page.getByRole('button', { name: 'Create Product' }).click();

    // HTML5 validation should prevent submission
    // Check that the form is still on the page (not navigated away)
    await expect(page.getByRole('heading', { name: 'Create Product' })).toBeVisible();

    // Verify required fields are marked (browser validation)
    const nameInput = page.getByLabel('Product Name');
    const descriptionInput = page.getByLabel('Description');
    const priceInput = page.getByLabel('Price');
    const categoryInput = page.getByLabel('Category');

    // Check HTML5 validation attributes
    await expect(nameInput).toHaveAttribute('required');
    await expect(descriptionInput).toHaveAttribute('required');
    await expect(priceInput).toHaveAttribute('required');
    await expect(categoryInput).toHaveAttribute('required');
  });

  test('should cancel and return to products list', async ({ page }) => {
    await page.goto('/products/new');

    // Fill in some data
    await page.getByLabel('Product Name').fill('Test Product');

    // Click cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify navigation back to products list
    await expect(page).toHaveURL('/products');
  });
});

