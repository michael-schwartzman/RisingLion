import { expect } from '@playwright/test';

/**
 * Page Object Model for the game screen
 */
export class GamePage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.gameScreen = '#gameScreen';
    this.gameCanvas = '#gameCanvas';
    this.gameHUD = '#gameHUD';
    this.levelDisplay = '#levelDisplay';
    this.scoreDisplay = '#score';
    this.timerDisplay = '#timer';
    this.weaponSelect = '#weaponType';
    this.powerMeter = '#powerMeter';
    
    // Health bars
    this.israeliBaseHealth = '#israeliBaseHealth';
    this.natanzHealth = '#natanzHealth';
    this.fordowHealth = '#fordowHealth';
    
    // Flags
    this.israeliFlagMini = '.israeli-flag-mini';
    this.iranianFlagMini = '.iranian-flag-mini';
  }

  /**
   * Wait for the game screen to be visible and loaded
   */
  async waitForLoad() {
    await expect(this.page.locator(this.gameScreen)).toBeVisible();
    await expect(this.page.locator(this.gameCanvas)).toBeVisible();
    await expect(this.page.locator(this.gameHUD)).toBeVisible();
  }

  /**
   * Verify game HUD elements are visible
   */
  async verifyGameHUDElements() {
    await expect(this.page.locator(this.levelDisplay)).toBeVisible();
    await expect(this.page.locator(this.scoreDisplay)).toBeVisible();
    await expect(this.page.locator(this.timerDisplay)).toBeVisible();
    await expect(this.page.locator(this.weaponSelect)).toBeVisible();
    await expect(this.page.locator(this.israeliFlagMini)).toBeVisible();
    await expect(this.page.locator(this.iranianFlagMini)).toBeVisible();
  }

  /**
   * Verify health bars are visible
   */
  async verifyHealthBars() {
    await expect(this.page.locator(this.israeliBaseHealth)).toBeVisible();
    await expect(this.page.locator(this.natanzHealth)).toBeVisible();
    await expect(this.page.locator(this.fordowHealth)).toBeVisible();
  }

  /**
   * Get the current score
   */
  async getScore() {
    return await this.page.locator(this.scoreDisplay).textContent();
  }

  /**
   * Get the current level
   */
  async getLevel() {
    return await this.page.locator(this.levelDisplay).textContent();
  }

  /**
   * Get the current timer value
   */
  async getTimer() {
    return await this.page.locator(this.timerDisplay).textContent();
  }

  /**
   * Select a weapon type
   */
  async selectWeapon(weaponType) {
    await this.page.locator(this.weaponSelect).selectOption(weaponType);
  }

  /**
   * Click on the game canvas at specific coordinates
   */
  async clickCanvas(x = 600, y = 350) {
    await this.page.locator(this.gameCanvas).click({ position: { x, y } });
  }

  /**
   * Drag on the game canvas to simulate aiming and firing
   */
  async dragOnCanvas(startX = 100, startY = 600, endX = 600, endY = 300) {
    const canvas = this.page.locator(this.gameCanvas);
    
    // Start drag
    await canvas.hover({ position: { x: startX, y: startY } });
    await this.page.mouse.down();
    
    // Move to end position
    await canvas.hover({ position: { x: endX, y: endY } });
    
    // Release
    await this.page.mouse.up();
  }

  /**
   * Verify the game screen is the active screen
   */
  async verifyIsActiveScreen() {
    await expect(this.page.locator(this.gameScreen)).toBeVisible();
    await expect(this.page.locator(this.gameScreen)).not.toHaveClass(/hidden/);
  }

  /**
   * Wait for game initialization (canvas and game objects to be ready)
   */
  async waitForGameInitialization() {
    // Wait for canvas to be visible
    await expect(this.page.locator(this.gameCanvas)).toBeVisible();
    
    // Wait for initial score to be set
    await expect(this.page.locator(this.scoreDisplay)).toContainText(/\d+/);
    
    // Small delay to ensure game loop is running
    await this.page.waitForTimeout(1000);
  }
}