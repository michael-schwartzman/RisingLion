import { expect } from '@playwright/test';

/**
 * Page Object Model for the main menu screen
 */
export class MainMenuPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.mainMenu = '#mainMenu';
    this.gameTitle = 'h1:has-text("Operation Rising Lion")';
    this.startGameButton = '#startGame';
    this.instructionsButton = '#showInstructions';
    this.settingsButton = '#showSettings';
    this.israeliFlag = '.israeli-flag';
    this.iranianFlag = '.iranian-flag';
  }

  /**
   * Navigate to the application
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Wait for the main menu to be visible
   */
  async waitForLoad() {
    await expect(this.page.locator(this.mainMenu)).toBeVisible();
    await expect(this.page.locator(this.gameTitle)).toBeVisible();
  }

  /**
   * Click the start game button
   */
  async startGame() {
    await this.page.locator(this.startGameButton).click();
  }

  /**
   * Click the instructions button
   */
  async showInstructions() {
    await this.page.locator(this.instructionsButton).click();
  }

  /**
   * Click the settings button
   */
  async showSettings() {
    await this.page.locator(this.settingsButton).click();
  }

  /**
   * Verify main menu elements are visible
   */
  async verifyMainMenuElements() {
    await expect(this.page.locator(this.gameTitle)).toBeVisible();
    await expect(this.page.locator(this.startGameButton)).toBeVisible();
    await expect(this.page.locator(this.instructionsButton)).toBeVisible();
    await expect(this.page.locator(this.settingsButton)).toBeVisible();
    await expect(this.page.locator(this.israeliFlag)).toBeVisible();
    await expect(this.page.locator(this.iranianFlag)).toBeVisible();
  }

  /**
   * Verify the main menu is the active screen
   */
  async verifyIsActiveScreen() {
    await expect(this.page.locator(this.mainMenu)).toBeVisible();
    await expect(this.page.locator(this.mainMenu)).not.toHaveClass(/hidden/);
  }
}