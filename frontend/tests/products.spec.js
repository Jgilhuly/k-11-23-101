import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test('should display products list and allow navigation', async ({ page }) => {
    await page.goto('/products');

    // Wait for the page to load (check for either loading spinner or content)
    const loadingSpinner = page.locator('.loading .spinner');
    const productsTitle = page.getByRole('heading', { name: 'Products' });

    // Wait for loading to finish
    await loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

    // Verify page title is visible
    await expect(productsTitle).toBeVisible();

    // Verify "New Product" button is visible
    await expect(page.getByRole('link', { name: 'New Product' })).toBeVisible();

    // Check if products table exists or empty state
    const table = page.locator('.table');
    const emptyState = page.getByText('No products found');

    const hasTable = await table.count() > 0;
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    if (hasTable) {
      // If table exists, verify table headers
      await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Category' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Stock' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
    } else if (hasEmptyState) {
      // If empty state, verify it's displayed correctly
      await expect(emptyState).toBeVisible();
      await expect(page.getByText('Start by creating your first product')).toBeVisible();
    }
  });

  test('should navigate to create product form', async ({ page }) => {
    await page.goto('/products');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Click on "New Product" button
    await page.getByRole('link', { name: 'New Product' }).click();

    // Verify navigation to create product page
    await expect(page).toHaveURL('/products/new');

    // Verify form elements are present
    await expect(page.getByRole('heading', { name: 'Create Product' })).toBeVisible();
    await expect(page.getByLabel('Product Name')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.getByLabel('Price')).toBeVisible();
    await expect(page.getByLabel('Category')).toBeVisible();
  });
});

