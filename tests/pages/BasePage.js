/**
 * Base Page class providing common functionality for all pages
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async getTitle() {
    return await this.page.title();
  }
}

module.exports = { BasePage };