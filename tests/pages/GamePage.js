const { BasePage } = require('./BasePage.js');

class GamePage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      gameCanvas: '#gameCanvas',
      hudLeft: '.hud-left',
      hudRight: '.hud-right',
      scoreDisplay: '.hud-left .score',
      timeDisplay: '.hud-left .time',
      weaponSelect: '#weaponType'
    };
  }

  async isVisible() {
    try {
      await this.page.waitForSelector(this.selectors.gameCanvas, { timeout: 10000 });
      await this.page.waitForSelector(this.selectors.hudLeft, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForGameLoad() {
    await this.page.waitForSelector(this.selectors.gameCanvas, { timeout: 10000 });
    await this.page.waitForSelector(this.selectors.hudLeft);
    await this.page.waitForSelector(this.selectors.weaponSelect);
    await this.page.waitForTimeout(2000);
  }

  async getScore() {
    try {
      // Try multiple possible selectors for score
      const selectors = [
        '.hud-left > div:nth-child(2) > div:nth-child(3) > div:nth-child(2)',
        '[data-testid="score"]',
        '.score'
      ];
      
      for (const selector of selectors) {
        try {
          const scoreText = await this.page.textContent(selector);
          const score = parseInt(scoreText) || 0;
          if (!isNaN(score)) return score;
        } catch {}
      }
      return 0;
    } catch {
      return 0;
    }
  }

  async getTimeLeft() {
    try {
      const selectors = [
        '.hud-left > div:nth-child(2) > div:nth-child(4) > div:nth-child(2)',
        '[data-testid="time"]',
        '.time'
      ];
      
      for (const selector of selectors) {
        try {
          const timeText = await this.page.textContent(selector);
          const time = parseInt(timeText) || 0;
          if (!isNaN(time)) return time;
        } catch {}
      }
      return 180;
    } catch {
      return 180;
    }
  }

  async selectWeapon(weaponType) {
    await this.page.selectOption(this.selectors.weaponSelect, weaponType);
    await this.page.waitForTimeout(500);
  }

  async getSelectedWeapon() {
    return await this.page.inputValue(this.selectors.weaponSelect);
  }

  async getWeaponOptions() {
    const options = await this.page.locator(`${this.selectors.weaponSelect} option`).all();
    const weaponOptions = [];
    
    for (const option of options) {
      const value = await option.getAttribute('value');
      const text = await option.textContent();
      weaponOptions.push({ value, text });
    }
    return weaponOptions;
  }

  async clickToFire(x, y) {
    const canvas = this.page.locator(this.selectors.gameCanvas);
    await canvas.click({ position: { x, y } });
    await this.page.waitForTimeout(1000);
  }

  async aimAndFire(startX, startY, endX, endY) {
    const canvas = this.page.locator(this.selectors.gameCanvas);
    
    await canvas.hover({ position: { x: startX, y: startY } });
    await this.page.mouse.down();
    await canvas.hover({ position: { x: endX, y: endY } });
    await this.page.waitForTimeout(500);
    await this.page.mouse.up();
    await this.page.waitForTimeout(1000);
  }

  async isHudVisible() {
    const hudLeft = await this.page.isVisible(this.selectors.hudLeft);
    const hudRight = await this.page.isVisible(this.selectors.hudRight);
    return hudLeft && hudRight;
  }

  async getCanvas() {
    return this.page.locator(this.selectors.gameCanvas);
  }
}

module.exports = { GamePage };