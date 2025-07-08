import { test, expect } from '@playwright/test';
import { MainMenuPage } from './pages/MainMenuPage.js';
import { GamePage } from './pages/GamePage.js';

test.describe('Game Functionality', () => {
  test('should initialize game correctly', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    const gameScreen = new GamePage(page);
    
    await mainMenu.goto();
    await mainMenu.waitForLoad();
    await mainMenu.startGame();
    
    await gameScreen.waitForLoad();
    await gameScreen.waitForGameInitialization();
    
    // Verify initial game state
    const score = await gameScreen.getScore();
    const level = await gameScreen.getLevel();
    
    expect(score).toBeTruthy();
    expect(level).toBeTruthy();
  });

  test('should display game HUD elements correctly', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    const gameScreen = new GamePage(page);
    
    await mainMenu.goto();
    await mainMenu.startGame();
    await gameScreen.waitForLoad();
    
    await gameScreen.verifyGameHUDElements();
    await gameScreen.verifyHealthBars();
  });

  test('should allow weapon selection', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    const gameScreen = new GamePage(page);
    
    await mainMenu.goto();
    await mainMenu.startGame();
    await gameScreen.waitForLoad();
    
    // Test weapon selection
    await gameScreen.selectWeapon('cruise');
    
    // Verify weapon was selected
    const selectedWeapon = await page.locator('#weaponType').inputValue();
    expect(selectedWeapon).toBe('cruise');
    
    // Switch back to missile
    await gameScreen.selectWeapon('missile');
    const selectedWeapon2 = await page.locator('#weaponType').inputValue();
    expect(selectedWeapon2).toBe('missile');
  });

  test('should handle canvas interactions', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    const gameScreen = new GamePage(page);
    
    await mainMenu.goto();
    await mainMenu.startGame();
    await gameScreen.waitForLoad();
    await gameScreen.waitForGameInitialization();
    
    // Test clicking on canvas
    await gameScreen.clickCanvas(400, 300);
    
    // Test dragging on canvas (simulating aiming and firing)
    await gameScreen.dragOnCanvas(100, 600, 500, 200);
    
    // Wait a bit to see if any effects occur
    await page.waitForTimeout(1000);
    
    // The game should still be running (no error)
    await gameScreen.verifyIsActiveScreen();
  });

  test('should update timer during gameplay', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    const gameScreen = new GamePage(page);
    
    await mainMenu.goto();
    await mainMenu.startGame();
    await gameScreen.waitForLoad();
    await gameScreen.waitForGameInitialization();
    
    // Get initial timer value
    const initialTimer = await gameScreen.getTimer();
    
    // Wait for timer to update
    await page.waitForTimeout(2000);
    
    // Get updated timer value
    const updatedTimer = await gameScreen.getTimer();
    
    // Timer should have changed (decreased)
    expect(initialTimer).not.toBe(updatedTimer);
  });
});