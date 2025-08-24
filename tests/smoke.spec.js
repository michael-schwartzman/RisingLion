import { test, expect } from '@playwright/test';

test.describe('Basic Application Load', () => {
  test('should load the application without errors', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Operation Rising Lion');
    
    // Verify page title
    await expect(page).toHaveTitle('Operation Rising Lion');
    
    // Verify main elements are present
    await expect(page.locator('#startGame')).toBeVisible();
    await expect(page.locator('#showInstructions')).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/main-menu.png', fullPage: true });
  });

  test('should have no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Filter out network errors that are not critical
    const criticalErrors = errors.filter(error => 
      !error.includes('net::ERR_FAILED') &&
      !error.includes('404') &&
      !error.includes('Failed to load')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});