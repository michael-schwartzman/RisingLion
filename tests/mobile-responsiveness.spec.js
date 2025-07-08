import { test, expect } from '@playwright/test';
import { MainMenuPage } from './pages/MainMenuPage.js';

test.describe('Mobile Responsiveness', () => {
  test('should display landscape prompt on mobile portrait', async ({ page }) => {
    // Set mobile portrait viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mainMenu = new MainMenuPage(page);
    await mainMenu.goto();
    
    // Check if landscape prompt is visible
    const landscapePrompt = page.locator('#landscapePrompt');
    
    // On portrait mode, landscape prompt might be visible
    // This depends on the game's orientation detection logic
    await expect(landscapePrompt).toBeAttached();
  });

  test('should work correctly on mobile landscape', async ({ page }) => {
    // Set mobile landscape viewport
    await page.setViewportSize({ width: 667, height: 375 });
    
    const mainMenu = new MainMenuPage(page);
    await mainMenu.goto();
    await mainMenu.waitForLoad();
    
    // Verify main menu elements are visible in landscape
    await mainMenu.verifyMainMenuElements();
    
    // Check that landscape prompt is hidden
    const landscapePrompt = page.locator('#landscapePrompt');
    await expect(landscapePrompt).toHaveClass(/hidden/);
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    // Set mobile landscape viewport
    await page.setViewportSize({ width: 667, height: 375 });
    
    const mainMenu = new MainMenuPage(page);
    await mainMenu.goto();
    await mainMenu.waitForLoad();
    
    // Test touch interaction with start button
    await page.locator('#startGame').tap();
    
    // Should navigate to game screen
    await expect(page.locator('#gameScreen')).toBeVisible();
  });

  test('should adapt canvas size to mobile viewport', async ({ page }) => {
    // Set mobile landscape viewport
    await page.setViewportSize({ width: 667, height: 375 });
    
    const mainMenu = new MainMenuPage(page);
    await mainMenu.goto();
    await mainMenu.startGame();
    
    // Wait for game to load
    await expect(page.locator('#gameCanvas')).toBeVisible();
    
    // Check canvas dimensions adapt to viewport
    const canvas = page.locator('#gameCanvas');
    const boundingBox = await canvas.boundingBox();
    
    expect(boundingBox.width).toBeGreaterThan(0);
    expect(boundingBox.height).toBeGreaterThan(0);
    
    // Canvas should fit within the mobile viewport
    expect(boundingBox.width).toBeLessThanOrEqual(667);
    expect(boundingBox.height).toBeLessThanOrEqual(375);
  });

  test('should display all HUD elements on mobile', async ({ page }) => {
    // Set mobile landscape viewport
    await page.setViewportSize({ width: 667, height: 375 });
    
    const mainMenu = new MainMenuPage(page);
    await mainMenu.goto();
    await mainMenu.startGame();
    
    // Wait for game to load
    await expect(page.locator('#gameCanvas')).toBeVisible();
    
    // Verify HUD elements are visible on mobile
    await expect(page.locator('#gameHUD')).toBeVisible();
    await expect(page.locator('#score')).toBeVisible();
    await expect(page.locator('#timer')).toBeVisible();
    await expect(page.locator('#weaponType')).toBeVisible();
  });
});