const { BasePage } = require('./BasePage.js');

class MainMenuPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      title: 'h1',
      startMissionButton: '#startGame',
      instructionsButton: '#showInstructions',
      settingsButton: '#showSettings',
      israeliFlag: '.israeli-flag',
      iranianFlag: '.iranian-flag',
      vsText: '.vs'
    };
  }

  async isVisible() {
    try {
      await this.page.waitForSelector(this.selectors.title, { timeout: 5000 });
      const title = await this.page.textContent(this.selectors.title);
      return title.includes('Operation Rising Lion');
    } catch {
      return false;
    }
  }

  async getTitle() {
    await this.waitForElement(this.selectors.title);
    return await this.page.textContent(this.selectors.title);
  }

  async clickStartMission() {
    await this.page.click(this.selectors.startMissionButton);
    await this.page.waitForTimeout(1000);
  }

  async clickInstructions() {
    await this.page.click(this.selectors.instructionsButton);
  }

  async areButtonsVisible() {
    const buttons = [
      this.selectors.startMissionButton,
      this.selectors.instructionsButton,
      this.selectors.settingsButton
    ];

    for (const button of buttons) {
      const isVisible = await this.page.isVisible(button);
      if (!isVisible) return false;
    }
    return true;
  }

  async areFlagsVisible() {
    const israeliFlag = await this.page.isVisible(this.selectors.israeliFlag);
    const iranianFlag = await this.page.isVisible(this.selectors.iranianFlag);
    const vsText = await this.page.isVisible(this.selectors.vsText);
    return israeliFlag && iranianFlag && vsText;
  }

  async getVsText() {
    return await this.page.textContent(this.selectors.vsText);
  }
}

module.exports = { MainMenuPage };