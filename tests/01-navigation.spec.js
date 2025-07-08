const { test, expect } = require('@playwright/test');
const { MainMenuPage } = require('./pages/MainMenuPage.js');
const { InstructionsPage } = require('./pages/InstructionsPage.js');
const { GamePage } = require('./pages/GamePage.js');
const { TestCleanup } = require('./utils/testUtils.js');

test.describe('Menu Navigation Flow', () => {
  let mainMenuPage;
  let instructionsPage;
  let gamePage;

  test.beforeEach(async ({ page }) => {
    mainMenuPage = new MainMenuPage(page);
    instructionsPage = new InstructionsPage(page);
    gamePage = new GamePage(page);
    
    await TestCleanup.clearBrowserState(page);
    await mainMenuPage.goto();
    await mainMenuPage.waitForLoad();
  });

  test('should display main menu correctly', async () => {
    expect(await mainMenuPage.isVisible()).toBeTruthy();
    
    const title = await mainMenuPage.getTitle();
    expect(title).toBe('Operation Rising Lion');
    
    expect(await mainMenuPage.areButtonsVisible()).toBeTruthy();
    expect(await mainMenuPage.areFlagsVisible()).toBeTruthy();
    
    const vsText = await mainMenuPage.getVsText();
    expect(vsText).toBe('VS');
  });

  test('should navigate to instructions and back', async () => {
    await mainMenuPage.clickInstructions();
    expect(await instructionsPage.isVisible()).toBeTruthy();
    
    const title = await instructionsPage.getTitle();
    expect(title).toBe('Mission Briefing');
    
    await instructionsPage.clickBackToMenu();
    expect(await mainMenuPage.isVisible()).toBeTruthy();
  });

  test('should start game from main menu', async () => {
    await mainMenuPage.clickStartMission();
    await gamePage.waitForGameLoad();
    
    expect(await gamePage.isVisible()).toBeTruthy();
    expect(await gamePage.isHudVisible()).toBeTruthy();
    
    const score = await gamePage.getScore();
    expect(score).toBe(0);
    
    const timeLeft = await gamePage.getTimeLeft();
    expect(timeLeft).toBeGreaterThan(170);
  });
});