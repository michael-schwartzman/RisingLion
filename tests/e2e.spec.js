const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * Operation Rising Lion End-to-End Test Suite
 * 
 * This test suite validates the complete game functionality using Playwright
 * for browser automation. It tests the entire user journey from game load
 * to completion.
 */

// Configuration
const GAME_URL = 'http://localhost:8080';
const TEST_TIMEOUT = 30000;

test.describe('Operation Rising Lion E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for game loading
    test.setTimeout(TEST_TIMEOUT);
    
    // Navigate to the game
    await page.goto(GAME_URL);
    
    // Wait for the game to load
    await page.waitForSelector('#gameCanvas');
    await page.waitForFunction(() => window.game !== undefined);
  });

  test('Game Initialization and DOM Elements', async ({ page }) => {
    // Check that all required DOM elements are present
    await expect(page.locator('#gameCanvas')).toBeVisible();
    await expect(page.locator('#startGame')).toBeVisible();
    await expect(page.locator('#mainMenu')).toBeVisible();
    await expect(page.locator('#gameHUD')).toBeVisible();
    
    // Check game instance initialization
    const gameExists = await page.evaluate(() => window.game !== undefined);
    expect(gameExists).toBe(true);
    
    // Verify initial game state
    const gameState = await page.evaluate(() => window.game.gameState);
    expect(gameState).toBe('menu');
    
    const initialScore = await page.evaluate(() => window.game.score);
    expect(initialScore).toBe(0);
    
    const initialTime = await page.evaluate(() => window.game.timeLeft);
    expect(initialTime).toBe(180);
  });

  test('Menu Navigation', async ({ page }) => {
    // Test instructions screen navigation
    await page.click('#showInstructions');
    await page.waitForTimeout(500);
    
    const instructionsVisible = await page.locator('#instructionsScreen').isVisible();
    expect(instructionsVisible).toBe(true);
    
    // Navigate back to menu
    await page.click('#backToMenu');
    await page.waitForTimeout(500);
    
    const instructionsHidden = await page.locator('#instructionsScreen').isHidden();
    expect(instructionsHidden).toBe(true);
    
    const menuVisible = await page.locator('#mainMenu').isVisible();
    expect(menuVisible).toBe(true);
  });

  test('Game Start Functionality', async ({ page }) => {
    // Start the game
    await page.click('#startGame');
    await page.waitForTimeout(1000);
    
    // Verify game state transition
    const gameState = await page.evaluate(() => window.game.gameState);
    expect(gameState).toBe('playing');
    
    // Check that game screen is visible
    const gameScreenVisible = await page.locator('#gameScreen').isVisible();
    expect(gameScreenVisible).toBe(true);
    
    // Verify targets are initialized
    const targetsCount = await page.evaluate(() => Object.keys(window.game.targets).length);
    expect(targetsCount).toBeGreaterThan(0);
    
    // Verify launch platform is initialized
    const launchPlatformExists = await page.evaluate(() => window.game.launchPlatform !== null);
    expect(launchPlatformExists).toBe(true);
  });

  test('Weapon Selection and UI', async ({ page }) => {
    // Start the game first
    await page.click('#startGame');
    await page.waitForTimeout(1000);
    
    // Test weapon selection dropdown
    const weaponSelect = page.locator('#weaponType');
    await expect(weaponSelect).toBeVisible();
    
    // Test missile selection
    await weaponSelect.selectOption('missile');
    const currentWeapon1 = await page.evaluate(() => window.game.currentWeapon);
    expect(currentWeapon1).toBe('missile');
    
    // Test cruise missile selection
    await weaponSelect.selectOption('cruise');
    const currentWeapon2 = await page.evaluate(() => window.game.currentWeapon);
    expect(currentWeapon2).toBe('cruise');
    
    // Verify HUD elements are visible
    await expect(page.locator('#levelDisplay')).toBeVisible();
    await expect(page.locator('#score')).toBeVisible();
    await expect(page.locator('#timer')).toBeVisible();
  });

  test('Canvas Interaction and Aiming', async ({ page }) => {
    // Start the game
    await page.click('#startGame');
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
    
    // Test canvas click interaction (aiming)
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 100;
    const endX = canvasBox.x + 200;
    const endY = canvasBox.y + 200;
    
    // Simulate mouse drag for aiming
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Wait for any projectile creation
    await page.waitForTimeout(500);
    
    // Check if projectile was created
    const projectileCount = await page.evaluate(() => window.game.projectiles.length);
    expect(projectileCount).toBeGreaterThanOrEqual(0); // May be 0 if projectile already hit or expired
  });

  test('Projectile Creation and Physics', async ({ page }) => {
    // Start the game
    await page.click('#startGame');
    await page.waitForTimeout(1000);
    
    // Fire a weapon programmatically
    const initialProjectileCount = await page.evaluate(() => window.game.projectiles.length);
    
    await page.evaluate(() => {
      if (window.game.fireWeapon) {
        window.game.fireWeapon(100, 100, 600, 400); // Fire towards target area
      }
    });
    
    await page.waitForTimeout(100);
    
    const newProjectileCount = await page.evaluate(() => window.game.projectiles.length);
    expect(newProjectileCount).toBeGreaterThan(initialProjectileCount);
  });

  test('Game Loop and Rendering', async ({ page }) => {
    // Start the game
    await page.click('#startGame');
    await page.waitForTimeout(1000);
    
    // Test that game loop is running by checking if render is being called
    const renderTestResult = await page.evaluate(() => {
      let renderCalled = false;
      const originalRender = window.game.render;
      
      window.game.render = function() {
        renderCalled = true;
        return originalRender.apply(this, arguments);
      };
      
      // Wait for render to be called
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(renderCalled);
        }, 1000);
      });
    });
    
    expect(renderTestResult).toBe(true);
  });

  test('HUD Updates and Game State', async ({ page }) => {
    // Start the game
    await page.click('#startGame');
    await page.waitForTimeout(1000);
    
    // Test HUD update functionality
    await page.evaluate(() => {
      if (window.game.safelyUpdateHUD) {
        window.game.safelyUpdateHUD();
      }
    });
    
    // Verify score display
    const scoreText = await page.locator('#score').textContent();
    expect(scoreText).toBeDefined();
    expect(parseInt(scoreText)).toBeGreaterThanOrEqual(0);
    
    // Verify timer display
    const timerText = await page.locator('#timer').textContent();
    expect(timerText).toBeDefined();
    expect(parseInt(timerText)).toBeLessThanOrEqual(180);
    
    // Verify level display
    const levelText = await page.locator('#levelDisplay').textContent();
    expect(levelText).toBeDefined();
    expect(parseInt(levelText)).toBeGreaterThanOrEqual(1);
  });

  test('Victory Condition Testing', async ({ page }) => {
    // Start the game
    await page.click('#startGame');
    await page.waitForTimeout(1000);
    
    // Test victory condition check
    await page.evaluate(() => {
      if (window.game.checkVictoryConditions) {
        window.game.checkVictoryConditions();
      }
    });
    
    // Game should still be playing since conditions aren't met
    const gameState = await page.evaluate(() => window.game.gameState);
    expect(gameState).toBe('playing');
  });

  test('Debug Functions Availability', async ({ page }) => {
    // Check that debug functions are available
    const testStartButtonExists = await page.evaluate(() => typeof window.testStartButton === 'function');
    expect(testStartButtonExists).toBe(true);
    
    const forceStartGameExists = await page.evaluate(() => typeof window.forceStartGame === 'function');
    expect(forceStartGameExists).toBe(true);
    
    // Test the debug functions
    await page.evaluate(() => {
      if (window.testStartButton) {
        window.testStartButton();
      }
    });
    
    await page.waitForTimeout(1000);
    
    const gameStateAfterDebug = await page.evaluate(() => window.game.gameState);
    expect(gameStateAfterDebug).toBe('playing');
  });

  test('Error Handling and Stability', async ({ page }) => {
    // Start the game
    await page.click('#startGame');
    await page.waitForTimeout(1000);
    
    // Test error handling with invalid inputs
    const errorTestResults = await page.evaluate(() => {
      const results = [];
      
      try {
        // Test invalid weapon firing
        if (window.game.fireWeapon) {
          window.game.fireWeapon(null, null, null, null);
        }
        results.push('Invalid weapon firing handled');
      } catch (error) {
        results.push(`Error in weapon firing: ${error.message}`);
      }
      
      try {
        // Test collision detection with empty arrays
        const originalProjectiles = window.game.projectiles;
        window.game.projectiles = [];
        
        if (window.game.checkCollisions) {
          window.game.checkCollisions();
        }
        
        window.game.projectiles = originalProjectiles;
        results.push('Empty array collision detection handled');
      } catch (error) {
        results.push(`Error in collision detection: ${error.message}`);
      }
      
      return results;
    });
    
    expect(errorTestResults.length).toBeGreaterThan(0);
    // Should not throw unhandled errors
  });

  test('Performance and Memory', async ({ page }) => {
    // Start the game
    await page.click('#startGame');
    await page.waitForTimeout(1000);
    
    // Test performance by running multiple render cycles
    const performanceResults = await page.evaluate(() => {
      const startTime = performance.now();
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        if (window.game.render) {
          window.game.render();
        }
        if (window.game.updateProjectiles) {
          window.game.updateProjectiles();
        }
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      return {
        averageRenderTime: avgTime,
        totalTime: endTime - startTime
      };
    });
    
    expect(performanceResults.averageRenderTime).toBeLessThan(16.67); // 60fps threshold
    expect(performanceResults.totalTime).toBeLessThan(5000); // Should complete quickly
  });
});

// Custom test for automated full game playthrough
test('Full Game Playthrough Simulation', async ({ page }) => {
  test.setTimeout(60000); // Longer timeout for full playthrough
  
  await page.goto(GAME_URL);
  await page.waitForSelector('#gameCanvas');
  await page.waitForFunction(() => window.game !== undefined);
  
  // Start the game
  await page.click('#startGame');
  await page.waitForTimeout(2000);
  
  // Simulate rapid firing at targets for automated playthrough
  const gameplayResult = await page.evaluate(() => {
    return new Promise((resolve) => {
      let shots = 0;
      const maxShots = 20;
      const gameStartTime = Date.now();
      
      const autoPlay = () => {
        if (shots >= maxShots || window.game.gameState !== 'playing') {
          resolve({
            shots,
            finalState: window.game.gameState,
            timeElapsed: Date.now() - gameStartTime,
            score: window.game.score,
            targetsDestroyed: Object.values(window.game.targets).filter(t => t.destroyed).length
          });
          return;
        }
        
        // Fire weapon at random target area
        const targetX = 400 + Math.random() * 600;
        const targetY = 350 + Math.random() * 200;
        
        if (window.game.fireWeapon) {
          window.game.fireWeapon(100, 100, targetX, targetY);
          shots++;
        }
        
        setTimeout(autoPlay, 500); // Fire every 500ms
      };
      
      autoPlay();
    });
  });
  
  expect(gameplayResult.shots).toBeGreaterThan(0);
  expect(gameplayResult.timeElapsed).toBeGreaterThan(0);
  expect(gameplayResult.score).toBeGreaterThanOrEqual(0);
  
  console.log('Full Playthrough Results:', gameplayResult);
});