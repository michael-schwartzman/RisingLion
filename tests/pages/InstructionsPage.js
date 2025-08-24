const { BasePage } = require('./BasePage.js');

class InstructionsPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      title: 'h2',
      backToMenuButton: '#backToMenu',
      instructionsScreen: '#instructionsScreen'
    };
  }

  async isVisible() {
    try {
      await this.page.waitForSelector(this.selectors.instructionsScreen, { timeout: 5000 });
      const isHidden = await this.page.getAttribute(this.selectors.instructionsScreen, 'class');
      return !isHidden.includes('hidden');
    } catch {
      return false;
    }
  }

  async getTitle() {
    await this.waitForElement(this.selectors.title);
    return await this.page.textContent(this.selectors.title);
  }

  async clickBackToMenu() {
    await this.page.click(this.selectors.backToMenuButton);
    await this.page.waitForTimeout(500);
  }
}

module.exports = { InstructionsPage };