import { expect } from '@playwright/test';

/**
 * Page Object Model for the instructions screen
 */
export class InstructionsPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.instructionsScreen = '#instructionsScreen';
    this.screenTitle = 'h2:has-text("Mission Briefing")';
    this.backToMenuButton = '#backToMenu';
    this.primaryObjectives = 'h3:has-text("Primary Objectives:")';
    this.controls = 'h3:has-text("Controls:")';
    this.strategyTips = 'h3:has-text("Strategy Tips:")';
    this.facilityList = 'ul li:has-text("Natanz Facility")';
  }

  /**
   * Wait for the instructions screen to be visible
   */
  async waitForLoad() {
    await expect(this.page.locator(this.instructionsScreen)).toBeVisible();
    await expect(this.page.locator(this.screenTitle)).toBeVisible();
  }

  /**
   * Click the back to menu button
   */
  async backToMenu() {
    await this.page.locator(this.backToMenuButton).click();
  }

  /**
   * Verify instructions screen elements are visible
   */
  async verifyInstructionsElements() {
    await expect(this.page.locator(this.screenTitle)).toBeVisible();
    await expect(this.page.locator(this.primaryObjectives)).toBeVisible();
    await expect(this.page.locator(this.controls)).toBeVisible();
    await expect(this.page.locator(this.strategyTips)).toBeVisible();
    await expect(this.page.locator(this.backToMenuButton)).toBeVisible();
  }

  /**
   * Verify nuclear facilities are listed
   */
  async verifyNuclearFacilitiesList() {
    await expect(this.page.locator(this.facilityList)).toBeVisible();
    
    // Check for specific facilities
    const facilities = [
      'Natanz Facility',
      'Fordow Complex', 
      'Arak Reactor',
      'Esfahan Facility',
      'Bushehr Nuclear Power Plant',
      'Tehran Research Facility',
      'Ardakan Yellowcake Plant'
    ];

    for (const facility of facilities) {
      await expect(this.page.locator(`li:has-text("${facility}")`)).toBeVisible();
    }
  }

  /**
   * Verify the instructions screen is the active screen
   */
  async verifyIsActiveScreen() {
    await expect(this.page.locator(this.instructionsScreen)).toBeVisible();
    await expect(this.page.locator(this.instructionsScreen)).not.toHaveClass(/hidden/);
  }
}