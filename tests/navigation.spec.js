import { test, expect } from '@playwright/test';
import { MainMenuPage } from './pages/MainMenuPage.js';
import { InstructionsPage } from './pages/InstructionsPage.js';
import { GamePage } from './pages/GamePage.js';

test.describe('Navigation Flow', () => {
  test('should load main menu correctly', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    
    await mainMenu.goto();
    await mainMenu.waitForLoad();
    await mainMenu.verifyMainMenuElements();
  });

  test('should navigate from main menu to instructions and back', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    const instructions = new InstructionsPage(page);
    
    // Start at main menu
    await mainMenu.goto();
    await mainMenu.waitForLoad();
    await mainMenu.verifyIsActiveScreen();
    
    // Navigate to instructions
    await mainMenu.showInstructions();
    await instructions.waitForLoad();
    await instructions.verifyIsActiveScreen();
    await instructions.verifyInstructionsElements();
    
    // Navigate back to main menu
    await instructions.backToMenu();
    await mainMenu.waitForLoad();
    await mainMenu.verifyIsActiveScreen();
  });

  test('should navigate from main menu to game screen', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    const gameScreen = new GamePage(page);
    
    // Start at main menu
    await mainMenu.goto();
    await mainMenu.waitForLoad();
    
    // Start game
    await mainMenu.startGame();
    await gameScreen.waitForLoad();
    await gameScreen.verifyIsActiveScreen();
    await gameScreen.verifyGameHUDElements();
  });

  test('should display nuclear facilities list in instructions', async ({ page }) => {
    const mainMenu = new MainMenuPage(page);
    const instructions = new InstructionsPage(page);
    
    await mainMenu.goto();
    await mainMenu.waitForLoad();
    
    await mainMenu.showInstructions();
    await instructions.waitForLoad();
    await instructions.verifyNuclearFacilitiesList();
  });
});