class InputHandler {
    constructor(game) {
        this.game = game;
    }
    
    setupEventListeners() {
        // Menu buttons
        this.setupMenuButtons();
        
        // Canvas events
        if (this.game.canvas) {
            this.setupCanvasEvents();
        }
        
        // Weapon selection
        this.setupWeaponSelection();
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    setupMenuButtons() {
        try {
            console.log('Setting up menu button event listeners...');
            
            const startGameBtn = document.getElementById('startGame');
            if (startGameBtn) {
                console.log('Start game button found, adding click listener');
                // Remove any existing listeners to prevent duplicates
                const newStartBtn = startGameBtn.cloneNode(true);
                startGameBtn.parentNode.replaceChild(newStartBtn, startGameBtn);
                
                newStartBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    console.log('Start game button clicked');
                    try {
                        this.game.startGame();
                    } catch (error) {
                        console.error('Error calling startGame:', error);
                    }
                });
            } else {
                console.error('Start game button not found');
            }
            
            const showInstructionsBtn = document.getElementById('showInstructions');
            if (showInstructionsBtn) {
                console.log('Instructions button found');
                showInstructionsBtn.addEventListener('click', () => {
                    console.log('Instructions button clicked');
                    this.game.uiManager.showScreen('instructionsScreen');
                });
            }
            
            const backToMenuBtn = document.getElementById('backToMenu');
            if (backToMenuBtn) {
                console.log('Back to menu button found');
                backToMenuBtn.addEventListener('click', () => {
                    console.log('Back to menu button clicked');
                    this.game.uiManager.showScreen('mainMenu');
                });
            }
            
            const playAgainBtn = document.getElementById('playAgain');
            if (playAgainBtn) {
                console.log('Play again button found');
                playAgainBtn.addEventListener('click', () => {
                    console.log('Play again button clicked');
                    this.game.startGame();
                });
            }
            
            const backToMainMenuBtn = document.getElementById('backToMainMenu');
            if (backToMainMenuBtn) {
                console.log('Back to main menu button found');
                backToMainMenuBtn.addEventListener('click', () => {
                    console.log('Back to main menu button clicked');
                    this.game.uiManager.showScreen('mainMenu');
                });
            }
        } catch (error) {
            console.error('Error setting up menu buttons:', error);
        }
    }
    
    setupCanvasEvents() {
        // Mouse events
        this.game.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.game.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.game.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Touch events
        this.game.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {}
            };
            this.handleMouseDown(mouseEvent);
        }, { passive: false });
        
        this.game.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {}
            };
            this.handleMouseMove(mouseEvent);
        }, { passive: false });
        
        this.game.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = { preventDefault: () => {} };
            this.handleMouseUp(mouseEvent);
        }, { passive: false });
    }
    
    setupWeaponSelection() {
        const weaponTypeSelect = document.getElementById('weaponType');
        if (weaponTypeSelect) {
            weaponTypeSelect.addEventListener('change', (e) => {
                this.game.currentWeapon = e.target.value;
                this.game.uiManager.updateWeaponSelect();
            });
        }
    }
    
    getCanvasCoordinates(clientX, clientY) {
        const rect = this.game.canvas.getBoundingClientRect();
        const scaleX = this.game.canvas.width / rect.width;
        const scaleY = this.game.canvas.height / rect.height;
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    handleMouseDown(e) {
        if (this.game.gameState !== 'playing') return;
        
        const coords = this.getCanvasCoordinates(e.clientX, e.clientY);
        this.game.isAiming = true;
        this.game.aimStartX = this.game.weaponSystem.launchPlatform.x + this.game.weaponSystem.launchPlatform.width / 2;
        this.game.aimStartY = this.game.weaponSystem.launchPlatform.y;
        this.game.aimEndX = coords.x;
        this.game.aimEndY = coords.y;
    }
    
    handleMouseMove(e) {
        if (this.game.gameState !== 'playing' || !this.game.isAiming) return;
        
        const coords = this.getCanvasCoordinates(e.clientX, e.clientY);
        this.game.aimEndX = coords.x;
        this.game.aimEndY = coords.y;
    }
    
    handleMouseUp(e) {
        if (this.game.gameState !== 'playing' || !this.game.isAiming) return;
        
        this.game.isAiming = false;
        const projectile = this.game.weaponSystem.fireWeapon(
            this.game.aimStartX,
            this.game.aimStartY,
            this.game.aimEndX,
            this.game.aimEndY,
            this.game.currentWeapon
        );
        
        if (projectile) {
            this.game.projectiles.push(projectile);
            this.game.stats.shotsFired++;
            this.game.soundManager.playSound('launch');
            
            // Add launch effect
            const launchParticles = this.game.effectsManager.createLaunchEffect(
                this.game.aimStartX,
                this.game.aimStartY
            );
            this.game.particles.push(...launchParticles);
        }
    }
    
    handleKeyDown(e) {
        if (this.game.gameState !== 'playing') return;
        
        switch(e.key) {
            case '1':
                this.game.currentWeapon = 'missile';
                break;
            case '2':
                this.game.currentWeapon = 'guided';
                break;
            case '3':
                this.game.currentWeapon = 'aircraft';
                break;
            case '4':
                this.game.currentWeapon = 'cruise';
                break;
        }
        
        this.game.uiManager.updateWeaponSelect();
    }
}
