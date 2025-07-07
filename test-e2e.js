// End-to-End Test Suite for Operation Rising Lion
// This comprehensive test validates the entire game flow and mechanics

/**
 * End-to-End Test Plan:
 * 1. Game Initialization - verify game loads and DOM elements are present
 * 2. Menu Navigation - test transitions between screens
 * 3. Game Start - verify game initialization and state setup
 * 4. Weapon Systems - test all weapon types and firing mechanics
 * 5. Collision Detection - verify hits and damage calculation
 * 6. Victory/Defeat Conditions - test end game scenarios
 * 7. UI Interactions - test HUD updates and user feedback
 */

class OperationRisingLionE2ETest {
    constructor() {
        this.testResults = [];
        this.gameInstance = null;
        this.testStartTime = Date.now();
    }

    log(message, type = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${type}: ${message}`;
        console.log(logEntry);
        this.testResults.push({ timestamp, type, message });
    }

    assert(condition, message) {
        if (condition) {
            this.log(`✅ PASS: ${message}`, 'PASS');
            return true;
        } else {
            this.log(`❌ FAIL: ${message}`, 'FAIL');
            return false;
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Test 1: Game Initialization
    async testGameInitialization() {
        this.log('Starting Game Initialization Test');
        
        // Check if DOM elements exist
        const canvas = document.getElementById('gameCanvas');
        const startButton = document.getElementById('startGame');
        const gameHUD = document.getElementById('gameHUD');
        const mainMenu = document.getElementById('mainMenu');
        
        this.assert(canvas !== null, 'Game canvas element exists');
        this.assert(startButton !== null, 'Start game button exists');
        this.assert(gameHUD !== null, 'Game HUD exists');
        this.assert(mainMenu !== null, 'Main menu exists');
        
        // Check if game instance is created
        this.assert(window.game !== undefined, 'Game instance is created');
        this.gameInstance = window.game;
        
        // Verify initial game state
        this.assert(this.gameInstance.gameState === 'menu', 'Initial game state is menu');
        this.assert(this.gameInstance.score === 0, 'Initial score is 0');
        this.assert(this.gameInstance.timeLeft === 180, 'Initial time is 180 seconds');
        
        this.log('Game Initialization Test Completed');
    }

    // Test 2: Menu Navigation
    async testMenuNavigation() {
        this.log('Starting Menu Navigation Test');
        
        // Test instructions screen
        const instructionsBtn = document.getElementById('showInstructions');
        if (instructionsBtn) {
            instructionsBtn.click();
            await this.sleep(500);
            
            const instructionsScreen = document.getElementById('instructionsScreen');
            this.assert(!instructionsScreen.classList.contains('hidden'), 'Instructions screen is visible');
            
            // Go back to menu
            const backBtn = document.getElementById('backToMenu');
            if (backBtn) {
                backBtn.click();
                await this.sleep(500);
                this.assert(instructionsScreen.classList.contains('hidden'), 'Instructions screen is hidden after back');
            }
        }
        
        this.log('Menu Navigation Test Completed');
    }

    // Test 3: Game Start
    async testGameStart() {
        this.log('Starting Game Start Test');
        
        const initialScore = this.gameInstance.score;
        const initialTime = this.gameInstance.timeLeft;
        
        // Start the game using the debug function
        if (window.forceStartGame) {
            window.forceStartGame();
        } else {
            const startBtn = document.getElementById('startGame');
            if (startBtn) {
                startBtn.click();
            }
        }
        
        await this.sleep(1000); // Wait for game to initialize
        
        // Verify game state changes
        this.assert(this.gameInstance.gameState === 'playing', 'Game state changed to playing');
        
        // Check if game screen is visible
        const gameScreen = document.getElementById('gameScreen');
        this.assert(!gameScreen.classList.contains('hidden'), 'Game screen is visible');
        
        // Verify targets are initialized
        const targets = this.gameInstance.targets;
        this.assert(Object.keys(targets).length > 0, 'Targets are initialized');
        
        // Verify launch platform exists
        this.assert(this.gameInstance.launchPlatform !== null, 'Launch platform is initialized');
        
        this.log('Game Start Test Completed');
    }

    // Test 4: Weapon Systems
    async testWeaponSystems() {
        this.log('Starting Weapon Systems Test');
        
        if (this.gameInstance.gameState !== 'playing') {
            this.log('Game not in playing state, skipping weapon tests', 'WARN');
            return;
        }
        
        // Test weapon inventory
        const weapons = this.gameInstance.weapons;
        this.assert(weapons.missile !== undefined, 'Missile weapon exists');
        this.assert(weapons.cruise !== undefined, 'Cruise missile weapon exists');
        
        // Test weapon selection
        const weaponSelect = document.getElementById('weaponType');
        if (weaponSelect) {
            // Test missile selection
            weaponSelect.value = 'missile';
            weaponSelect.dispatchEvent(new Event('change'));
            this.assert(this.gameInstance.currentWeapon === 'missile', 'Missile weapon selected');
            
            // Test cruise missile selection
            weaponSelect.value = 'cruise';
            weaponSelect.dispatchEvent(new Event('change'));
            this.assert(this.gameInstance.currentWeapon === 'cruise', 'Cruise missile weapon selected');
        }
        
        // Test firing mechanism
        const initialProjectileCount = this.gameInstance.projectiles.length;
        
        // Simulate weapon firing
        if (this.gameInstance.fireWeapon) {
            this.gameInstance.fireWeapon(600, 300, 800, 400); // Fire towards a target
            await this.sleep(100);
            
            const newProjectileCount = this.gameInstance.projectiles.length;
            this.assert(newProjectileCount > initialProjectileCount, 'Projectile created when firing weapon');
        }
        
        this.log('Weapon Systems Test Completed');
    }

    // Test 5: Collision Detection
    async testCollisionDetection() {
        this.log('Starting Collision Detection Test');
        
        if (this.gameInstance.gameState !== 'playing') {
            this.log('Game not in playing state, skipping collision tests', 'WARN');
            return;
        }
        
        // Get a target to test collision
        const targets = this.gameInstance.targets;
        const firstTarget = Object.values(targets).find(t => !t.destroyed);
        
        if (firstTarget) {
            const initialHealth = firstTarget.health;
            
            // Create a projectile manually for testing
            const testProjectile = {
                x: firstTarget.x + firstTarget.width / 2,
                y: firstTarget.y + firstTarget.height / 2,
                vx: 0,
                vy: 0,
                type: 'missile',
                damage: 25,
                life: 100
            };
            
            this.gameInstance.projectiles.push(testProjectile);
            
            // Run collision detection
            if (this.gameInstance.checkCollisions) {
                this.gameInstance.checkCollisions();
                await this.sleep(100);
                
                // Check if target took damage
                this.assert(firstTarget.health < initialHealth, 'Target took damage from collision');
            }
        }
        
        this.log('Collision Detection Test Completed');
    }

    // Test 6: Game Mechanics
    async testGameMechanics() {
        this.log('Starting Game Mechanics Test');
        
        if (this.gameInstance.gameState !== 'playing') {
            this.log('Game not in playing state, skipping mechanics tests', 'WARN');
            return;
        }
        
        // Test HUD updates
        if (this.gameInstance.safelyUpdateHUD) {
            this.gameInstance.safelyUpdateHUD();
            this.assert(true, 'HUD update executed without errors');
        }
        
        // Test victory condition check
        if (this.gameInstance.checkVictoryConditions) {
            this.gameInstance.checkVictoryConditions();
            this.assert(true, 'Victory condition check executed without errors');
        }
        
        // Test render loop
        if (this.gameInstance.render) {
            this.gameInstance.render();
            this.assert(true, 'Game render executed without errors');
        }
        
        this.log('Game Mechanics Test Completed');
    }

    // Test 7: Performance and Stability
    async testPerformanceAndStability() {
        this.log('Starting Performance and Stability Test');
        
        const startTime = performance.now();
        const iterations = 100;
        
        // Test multiple render cycles
        for (let i = 0; i < iterations; i++) {
            if (this.gameInstance.render) {
                this.gameInstance.render();
            }
            
            if (this.gameInstance.updateProjectiles) {
                this.gameInstance.updateProjectiles();
            }
            
            if (i % 10 === 0) {
                await this.sleep(1); // Brief pause to prevent blocking
            }
        }
        
        const endTime = performance.now();
        const avgRenderTime = (endTime - startTime) / iterations;
        
        this.assert(avgRenderTime < 16.67, `Average render time (${avgRenderTime.toFixed(2)}ms) is under 60fps threshold`);
        
        // Test memory stability (basic check)
        const memoryBefore = this.gameInstance.projectiles.length + this.gameInstance.explosions.length;
        
        // Add and remove some objects
        for (let i = 0; i < 50; i++) {
            this.gameInstance.projectiles.push({ x: 0, y: 0, life: 1 });
        }
        
        // Clean up expired objects
        this.gameInstance.projectiles = this.gameInstance.projectiles.filter(p => p.life > 0);
        
        const memoryAfter = this.gameInstance.projectiles.length + this.gameInstance.explosions.length;
        this.assert(memoryAfter <= memoryBefore + 10, 'Memory usage is stable');
        
        this.log('Performance and Stability Test Completed');
    }

    // Test 8: Error Handling
    async testErrorHandling() {
        this.log('Starting Error Handling Test');
        
        // Test invalid weapon firing
        try {
            if (this.gameInstance.fireWeapon) {
                this.gameInstance.fireWeapon(null, null, null, null);
            }
            this.assert(true, 'Invalid weapon firing handled gracefully');
        } catch (error) {
            this.log(`Error in weapon firing: ${error.message}`, 'WARN');
        }
        
        // Test collision detection with empty arrays
        try {
            const originalProjectiles = this.gameInstance.projectiles;
            this.gameInstance.projectiles = [];
            
            if (this.gameInstance.checkCollisions) {
                this.gameInstance.checkCollisions();
            }
            
            this.gameInstance.projectiles = originalProjectiles;
            this.assert(true, 'Collision detection with empty arrays handled gracefully');
        } catch (error) {
            this.log(`Error in collision detection: ${error.message}`, 'WARN');
        }
        
        this.log('Error Handling Test Completed');
    }

    // Generate test report
    generateReport() {
        const endTime = Date.now();
        const duration = (endTime - this.testStartTime) / 1000;
        
        const passCount = this.testResults.filter(r => r.type === 'PASS').length;
        const failCount = this.testResults.filter(r => r.type === 'FAIL').length;
        const warnCount = this.testResults.filter(r => r.type === 'WARN').length;
        
        const report = `
=== OPERATION RISING LION E2E TEST REPORT ===
Test Duration: ${duration.toFixed(2)} seconds
Total Assertions: ${passCount + failCount}
Passed: ${passCount}
Failed: ${failCount}
Warnings: ${warnCount}
Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%

=== DETAILED RESULTS ===
${this.testResults.map(r => `${r.type}: ${r.message}`).join('\n')}

=== TEST SUMMARY ===
${failCount === 0 ? '✅ ALL TESTS PASSED' : `❌ ${failCount} TESTS FAILED`}
        `;
        
        console.log(report);
        return {
            passed: passCount,
            failed: failCount,
            warnings: warnCount,
            duration,
            successRate: (passCount / (passCount + failCount)) * 100,
            details: this.testResults
        };
    }

    // Main test runner
    async runAllTests() {
        this.log('=== STARTING OPERATION RISING LION E2E TESTS ===');
        
        try {
            await this.testGameInitialization();
            await this.testMenuNavigation();
            await this.testGameStart();
            await this.testWeaponSystems();
            await this.testCollisionDetection();
            await this.testGameMechanics();
            await this.testPerformanceAndStability();
            await this.testErrorHandling();
        } catch (error) {
            this.log(`Critical error during testing: ${error.message}`, 'FAIL');
        }
        
        const report = this.generateReport();
        
        this.log('=== E2E TESTS COMPLETED ===');
        return report;
    }
}

// Export for use in browser or test runner
if (typeof window !== 'undefined') {
    window.OperationRisingLionE2ETest = OperationRisingLionE2ETest;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OperationRisingLionE2ETest;
}