const { test, expect } = require('@playwright/test');
const { MainMenuPage } = require('./pages/MainMenuPage.js');
const { GamePage } = require('./pages/GamePage.js');
const { TestCleanup, GameConfig } = require('./utils/testUtils.js');

test.describe('Core Gameplay Mechanics', () => {
  let mainMenuPage;
  let gamePage;

  test.beforeEach(async ({ page }) => {
    mainMenuPage = new MainMenuPage(page);
    gamePage = new GamePage(page);
    
    await TestCleanup.clearBrowserState(page);
    await mainMenuPage.goto();
    await mainMenuPage.clickStartMission();
    await gamePage.waitForGameLoad();
  });

  test('should initialize game with correct default values', async () => {
    const score = await gamePage.getScore();
    expect(score).toBe(GameConfig.INITIAL_VALUES.SCORE);
    
    const timeLeft = await gamePage.getTimeLeft();
    expect(timeLeft).toBeGreaterThan(170);
    expect(timeLeft).toBeLessThanOrEqual(180);
  });

  test('should display all weapon options correctly', async () => {
    const weaponOptions = await gamePage.getWeaponOptions();
    expect(weaponOptions.length).toBeGreaterThan(0);
    
    const weaponValues = weaponOptions.map(w => w.value);
    expect(weaponValues).toContain(GameConfig.WEAPONS.MISSILE);
    expect(weaponValues).toContain(GameConfig.WEAPONS.CRUISE);
  });

  test('should allow weapon selection', async () => {
    await gamePage.selectWeapon(GameConfig.WEAPONS.MISSILE);
    let selectedWeapon = await gamePage.getSelectedWeapon();
    expect(selectedWeapon).toBe(GameConfig.WEAPONS.MISSILE);
    
    await gamePage.selectWeapon(GameConfig.WEAPONS.CRUISE);
    selectedWeapon = await gamePage.getSelectedWeapon();
    expect(selectedWeapon).toBe(GameConfig.WEAPONS.CRUISE);
  });

  test('should handle basic firing mechanics', async () => {
    await gamePage.clickToFire(600, 350);
    expect(await gamePage.isVisible()).toBeTruthy();
    expect(await gamePage.isHudVisible()).toBeTruthy();
  });

  test('should track time countdown', async ({ page }) => {
    const initialTime = await gamePage.getTimeLeft();
    await page.waitForTimeout(3000);
    const newTime = await gamePage.getTimeLeft();
    expect(newTime).toBeLessThan(initialTime);
  });
});