import { expect } from '@playwright/test';

/**
 * Page Object Model for the game over screen
 */
export class GameOverPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.gameOverScreen = '#gameOverScreen';
    this.gameOverTitle = '#gameOverTitle';
    this.finalScore = '#finalScore';
    this.targetsDestroyed = '#targetsDestroyed';
    this.accuracy = '#accuracy';
    this.timeBonus = '#timeBonus';
    this.missionResult = '#missionResult';
    this.playAgainButton = '#playAgain';
    this.backToMainMenuButton = '#backToMainMenu';
    this.victoryImageContainer = '#victoryImageContainer';
    this.saraImage = '#saraImage';
  }

  /**
   * Wait for the game over screen to be visible
   */
  async waitForLoad() {
    await expect(this.page.locator(this.gameOverScreen)).toBeVisible();
    await expect(this.page.locator(this.gameOverTitle)).toBeVisible();
  }

  /**
   * Verify game over screen elements are visible
   */
  async verifyGameOverElements() {
    await expect(this.page.locator(this.gameOverTitle)).toBeVisible();
    await expect(this.page.locator(this.finalScore)).toBeVisible();
    await expect(this.page.locator(this.targetsDestroyed)).toBeVisible();
    await expect(this.page.locator(this.accuracy)).toBeVisible();
    await expect(this.page.locator(this.timeBonus)).toBeVisible();
    await expect(this.page.locator(this.playAgainButton)).toBeVisible();
    await expect(this.page.locator(this.backToMainMenuButton)).toBeVisible();
  }

  /**
   * Get the final score
   */
  async getFinalScore() {
    return await this.page.locator(this.finalScore).textContent();
  }

  /**
   * Get targets destroyed count
   */
  async getTargetsDestroyed() {
    return await this.page.locator(this.targetsDestroyed).textContent();
  }

  /**
   * Get accuracy percentage
   */
  async getAccuracy() {
    return await this.page.locator(this.accuracy).textContent();
  }

  /**
   * Get time bonus
   */
  async getTimeBonus() {
    return await this.page.locator(this.timeBonus).textContent();
  }

  /**
   * Get mission result text
   */
  async getMissionResult() {
    return await this.page.locator(this.missionResult).textContent();
  }

  /**
   * Click play again button
   */
  async playAgain() {
    await this.page.locator(this.playAgainButton).click();
  }

  /**
   * Click back to main menu button
   */
  async backToMainMenu() {
    await this.page.locator(this.backToMainMenuButton).click();
  }

  /**
   * Check if victory image is visible (for successful mission)
   */
  async isVictoryImageVisible() {
    const victoryContainer = this.page.locator(this.victoryImageContainer);
    return await victoryContainer.isVisible() && !(await victoryContainer.getAttribute('class')).includes('hidden');
  }

  /**
   * Verify the game over screen is the active screen
   */
  async verifyIsActiveScreen() {
    await expect(this.page.locator(this.gameOverScreen)).toBeVisible();
    await expect(this.page.locator(this.gameOverScreen)).not.toHaveClass(/hidden/);
  }

  /**
   * Verify victory state (successful mission completion)
   */
  async verifyVictoryState() {
    await expect(this.page.locator(this.gameOverTitle)).toContainText(/Mission.*Complete|Victory|Success/i);
    // Victory image should be visible
    await expect(this.page.locator(this.victoryImageContainer)).not.toHaveClass(/hidden/);
  }

  /**
   * Verify defeat state (mission failed)
   */
  async verifyDefeatState() {
    await expect(this.page.locator(this.gameOverTitle)).toContainText(/Mission.*Failed|Defeat|Game.*Over/i);
  }
}