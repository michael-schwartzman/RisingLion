import { test, expect } from '@playwright/test';
import { MainMenuPage } from './pages/MainMenuPage.js';

test.describe('Error Handling', () => {
  test('should handle missing elements gracefully', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.goto();
    
    // Check console for any JavaScript errors
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await mainMenu.waitForLoad();
    
    // Give some time for any errors to occur
    await page.waitForTimeout(2000);
    
    // Start the game to trigger more code execution
    await mainMenu.startGame();
    await page.waitForTimeout(2000);
    
    // Check that there are no critical JavaScript errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('404') &&
      !error.includes('net::ERR_FAILED')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept image requests and make them fail
    await page.route('**/*.png', route => route.abort());
    await page.route('**/*.jpg', route => route.abort());
    
    const mainMenu = new MainMenuPage(page);
    await mainMenu.goto();
    
    // Should still load main menu despite missing images
    await mainMenu.waitForLoad();
    await mainMenu.verifyMainMenuElements();
    
    // Should still be able to navigate
    await mainMenu.showInstructions();
    await expect(page.locator('#instructionsScreen')).toBeVisible();
  });

  test('should handle rapid clicking gracefully', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.goto();
    await mainMenu.waitForLoad();
    
    // Rapidly click start game button multiple times
    const startButton = page.locator('#startGame');
    for (let i = 0; i < 5; i++) {
      await startButton.click({ timeout: 100 });
    }
    
    // Should navigate to game screen without errors
    await expect(page.locator('#gameScreen')).toBeVisible();
  });

  test('should maintain functionality after window resize', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.goto();
    await mainMenu.waitForLoad();
    
    // Start game
    await mainMenu.startGame();
    await expect(page.locator('#gameCanvas')).toBeVisible();
    
    // Resize window
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(500);
    
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    
    // Game should still be functional
    await expect(page.locator('#gameCanvas')).toBeVisible();
    await expect(page.locator('#gameHUD')).toBeVisible();
    
    // Try clicking on canvas
    await page.locator('#gameCanvas').click();
  });

  test('should handle invalid user inputs', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    await mainMenu.goto();
    await mainMenu.startGame();
    
    await expect(page.locator('#gameCanvas')).toBeVisible();
    
    // Try clicking outside canvas bounds
    await page.mouse.click(0, 0);
    await page.waitForTimeout(100);
    
    // Try rapid mouse movements
    for (let i = 0; i < 10; i++) {
      await page.mouse.move(Math.random() * 400, Math.random() * 300);
    }
    
    // Game should still be functional
    await expect(page.locator('#gameCanvas')).toBeVisible();
    await expect(page.locator('#gameHUD')).toBeVisible();
  });
});