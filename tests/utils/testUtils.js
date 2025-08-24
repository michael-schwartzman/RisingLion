const GameConfig = {
  WEAPONS: {
    MISSILE: 'missile',
    CRUISE: 'cruise'
  },
  
  INITIAL_VALUES: {
    LEVEL: '1',
    DIFFICULTY: 'Tutorial',
    SCORE: 0,
    TIME: 180
  }
};

class TestCleanup {
  static async clearBrowserState(page) {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      if (window.game) {
        window.game = null;
      }
    });
  }
}

module.exports = { GameConfig, TestCleanup };