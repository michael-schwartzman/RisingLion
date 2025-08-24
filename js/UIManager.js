class UIManager {
    constructor(game) {
        this.game = game;
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
        }
        
        // Handle mobile orientation for main menu
        if (screenId === 'mainMenu') {
            setTimeout(() => this.checkOrientation(), 100);
        }
    }
    
    updateHUD() {
        if (this.game.gameState !== 'playing') return;
        
        this.safelyUpdateElement('timeLeft', `Time: ${this.game.timeLeft}s`);
        this.safelyUpdateElement('score', `Score: ${this.game.score}`);
        
        // Update weapon counts
        Object.entries(this.game.weaponSystem.weapons).forEach(([type, weapon]) => {
            const countElement = document.getElementById(`${type}Count`);
            if (countElement) {
                countElement.textContent = weapon.count === Infinity ? '∞' : weapon.count;
            }
        });
        
        // Update target health bars
        Object.entries(this.game.targetManager.targets).forEach(([key, target]) => {
            if (target.destroyed) return;
            
            const healthBar = document.getElementById(`${key}Health`);
            if (healthBar) {
                const percent = (target.health / target.maxHealth) * 100;
                healthBar.style.width = `${percent}%`;
                this.updateHealthBarColor(healthBar, percent);
            }
        });
        
        // Update launch platform health
        const platformHealth = document.getElementById('platformHealth');
        if (platformHealth && this.game.weaponSystem.launchPlatform) {
            const percent = (this.game.weaponSystem.launchPlatform.health / this.game.weaponSystem.launchPlatform.maxHealth) * 100;
            platformHealth.style.width = `${percent}%`;
            this.updateHealthBarColor(platformHealth, percent);
        }
    }
    
    safelyUpdateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }
    
    updateHealthBarColor(healthBar, percent) {
        if (percent > 50) {
            healthBar.style.backgroundColor = '#4CAF50';
        } else if (percent > 25) {
            healthBar.style.backgroundColor = '#FF9800';
        } else {
            healthBar.style.backgroundColor = '#F44336';
        }
    }
    
    updateWeaponSelect() {
        const weaponSelect = document.getElementById('weaponType');
        if (weaponSelect) {
            // Update the visual indication of selected weapon
            const options = weaponSelect.querySelectorAll('option');
            options.forEach(option => {
                option.style.backgroundColor = option.value === this.game.currentWeapon ? '#4CAF50' : '';
            });
        }
    }
    
    showGameOverScreen(victory, timeBonus, accuracyBonus) {
        this.showScreen('gameOverScreen');
        
        this.safelyUpdateElement('victoryStatus', victory ? 'MISSION ACCOMPLISHED!' : 'MISSION FAILED');
        this.safelyUpdateElement('finalScore', this.game.score);
        this.safelyUpdateElement('shotsFired', this.game.stats.shotsFired);
        this.safelyUpdateElement('targetsDestroyed', this.game.stats.targetsDestroyed);
        this.safelyUpdateElement('timeBonus', timeBonus);
        this.safelyUpdateElement('accuracyBonus', accuracyBonus);
        
        const statusElement = document.getElementById('victoryStatus');
        if (statusElement) {
            statusElement.style.color = victory ? '#4CAF50' : '#F44336';
        }
    }
    
    checkOrientation() {
        // Mobile orientation handling logic
        if (!this.isMobile()) return;
        
        const landscapePrompt = document.getElementById('landscapePrompt');
        if (!landscapePrompt) return;
        
        const isPortrait = window.innerHeight > window.innerWidth;
        
        if (isPortrait) {
            landscapePrompt.style.display = 'block';
        } else {
            landscapePrompt.style.display = 'none';
        }
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && window.innerHeight <= 1024);
    }
}
