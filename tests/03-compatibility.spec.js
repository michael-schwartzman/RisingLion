const { test, expect, devices } = require('@playwright/test');
const { MainMenuPage } = require('./pages/MainMenuPage.js');
const { GamePage } = require('./pages/GamePage.js');
const { TestCleanup } = require('./utils/testUtils.js');

test.describe('Cross-Browser Compatibility', () => {
  test('should work on different browsers', async ({ page, browserName }) => {
    const mainMenuPage = new MainMenuPage(page);
    const gamePage = new GamePage(page);
    
    await TestCleanup.clearBrowserState(page);
    await mainMenuPage.goto();
    
    // Test basic functionality across browsers
    expect(await mainMenuPage.isVisible()).toBeTruthy();
    
    await mainMenuPage.clickStartMission();
    await gamePage.waitForGameLoad();
    
    expect(await gamePage.isVisible()).toBeTruthy();
    expect(await gamePage.isHudVisible()).toBeTruthy();
    
    // Test basic interaction
    await gamePage.clickToFire(500, 300);
    
    // Game should remain functional
    expect(await gamePage.isVisible()).toBeTruthy();
  });
});

test.describe('Error Handling', () => {
  test('should handle rapid interactions gracefully', async ({ page }) => {
    const mainMenuPage = new MainMenuPage(page);
    const gamePage = new GamePage(page);
    
    await TestCleanup.clearBrowserState(page);
    await mainMenuPage.goto();
    
    // Rapid navigation test
    for (let i = 0; i < 3; i++) {
      await mainMenuPage.clickInstructions();
      await page.waitForTimeout(100);
      await page.goBack();
      await page.waitForTimeout(100);
    }
    
    // Should still work
    expect(await mainMenuPage.isVisible()).toBeTruthy();
    
    await mainMenuPage.clickStartMission();
    await gamePage.waitForGameLoad();
    expect(await gamePage.isVisible()).toBeTruthy();
  });

  test('should handle canvas boundary interactions', async ({ page }) => {
    const mainMenuPage = new MainMenuPage(page);
    const gamePage = new GamePage(page);
    
    await TestCleanup.clearBrowserState(page);
    await mainMenuPage.goto();
    await mainMenuPage.clickStartMission();
    await gamePage.waitForGameLoad();
    
    const canvas = await gamePage.getCanvas();
    const bounds = await canvas.boundingBox();
    
    // Click at canvas boundaries
    await canvas.click({ position: { x: 0, y: 0 } });
    await canvas.click({ position: { x: bounds.width - 1, y: bounds.height - 1 } });
    
    // Game should handle boundary clicks gracefully
    expect(await gamePage.isVisible()).toBeTruthy();
  });
});