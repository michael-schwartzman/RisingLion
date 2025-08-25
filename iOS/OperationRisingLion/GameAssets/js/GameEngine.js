class OperationRisingLion {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'menu'; // menu, playing, gameOver
        this.score = 0;
        this.timeLeft = 180;
        this.isAiming = false;
        this.aimStartX = 0;
        this.aimStartY = 0;
        this.aimEndX = 0;
        this.aimEndY = 0;
        
        // Initialize subsystems
        this.soundManager = new SoundManager();
        this.weaponSystem = new WeaponSystem();
        this.targetManager = new TargetManager();
        this.enemySystem = new EnemySystem();
        this.effectsManager = new EffectsManager();
        this.renderer = new GameRenderer(this.ctx);
        this.inputHandler = new InputHandler(this);
        this.uiManager = new UIManager(this);
        
        // Current weapon
        this.currentWeapon = 'missile';
        
        // Game objects
        this.projectiles = [];
        this.interceptors = [];
        this.explosions = [];
        this.particles = [];
        this.aircrafts = [];
        this.screenShake = null;

        // Load images
        this.saraImage = null;
        this.haminaiImage = null;
        
        // Game statistics
        this.stats = {
            shotsFired: 0,
            hits: 0,
            targetsDestroyed: 0
        };
        
        // Progressive difficulty system
        this.currentLevel = 1;
        this.maxLevel = 7; // One for each facility
        this.levelStartTime = 0;
        this.levelDuration = 30; // 30 seconds per level initially
        this.difficultyMultiplier = 1.0;
        this.speedMultiplier = 1.0;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded before setting up event listeners
        console.log('Initializing game elements...');
        try {
            // Set up responsive canvas
            this.setupResponsiveCanvas();
            console.log('Canvas setup complete');
            
            // Always set up the event listeners
            this.inputHandler.setupEventListeners();
            console.log('Event listeners set up');
            
            // Set up orientation handling for mobile
            this.setupOrientationHandling();
            console.log('Orientation handling set up');
            
            // Load images after everything else is initialized
            this.loadSaraImage();
            this.loadHaminaiImage();
            console.log('Images loading...');
            
            // Force immediate orientation check on mobile
            if (this.isMobile()) {
                setTimeout(() => this.checkOrientation(), 100);
            }
            
            // Add resize listener for responsive behavior
            window.addEventListener('resize', () => this.handleResize());
            window.addEventListener('orientationchange', () => {
                setTimeout(() => this.handleResize(), 500); // Delay for orientation change
            });
            
            // Show main menu
            this.uiManager.showScreen('mainMenu');
            console.log('Main menu displayed');
            
            // Start the game loop
            this.gameLoop();
            console.log('Game loop started');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }
    
    startGame() {
        console.log('startGame called');
        if (this.isMobile() && window.innerHeight > window.innerWidth) {
            this.showOrientationPrompt();
            return;
        }
        
        console.log('Setting game state to playing and showing game screen');
        this.gameState = 'playing';
        this.resetGame();
        this.startTimer();
        this.uiManager.showScreen('gameScreen');
        console.log('Game screen should now be visible');
    }
    
    resetGame() {
        this.score = 0;
        this.timeLeft = 180;
        this.currentLevel = 1;
        this.currentWeapon = 'missile';
        this.projectiles = [];
        this.interceptors = [];
        this.explosions = [];
        this.particles = [];
        this.aircrafts = [];
        this.screenShake = null;
        
        this.weaponSystem.reset();
        this.targetManager.reset();
        this.enemySystem.reset();
        this.stats = { shotsFired: 0, hits: 0, targetsDestroyed: 0 };
    }
    
    startTimer() {
        console.log('Starting game timer');
        
        // Clear existing timer if it exists
        if (this.gameTimer) {
            console.log('Clearing existing game timer');
            clearInterval(this.gameTimer);
        }
        
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.uiManager.updateHUD();
            
            // Make the game progressively harder
            if (this.timeLeft % 30 === 0 && this.timeLeft < 150) {
                // Every 30 seconds, increase difficulty
                this.enemySystem.iranianOffensive.accuracy += 0.05; // Make Iranian attacks more accurate
                this.enemySystem.iranianOffensive.missileSpeed += 0.3; // Make missiles faster
                this.enemySystem.iranianOffensive.attackFrequency = Math.max(2000, this.enemySystem.iranianOffensive.attackFrequency - 300); // More frequent attacks
            }
            
            if (this.timeLeft <= 0) {
                console.log('Time expired, ending game');
                this.endGame(false);
            }
        }, 1000);
    }
    
    endGame(victory) {
        this.gameState = 'gameOver';
        
        // Clear existing timers
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        const timeBonus = victory ? this.timeLeft * 10 : 0;
        const accuracy = this.stats.shotsFired > 0 ? (this.stats.hits / this.stats.shotsFired) : 0;
        const accuracyBonus = Math.floor(accuracy * 1000);
        
        this.score += timeBonus + accuracyBonus;
        
        this.soundManager.playSound(victory ? 'victory' : 'defeat');
        
        if (victory) {
            this.showSaraImage();
        }
        
        this.uiManager.showGameOverScreen(victory, timeBonus, accuracyBonus);
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.weaponSystem.update(this.projectiles);
        this.targetManager.update();
        
        // Update AI tracking with current player performance
        this.enemySystem.updateAITracking(this.stats, []);
        
        this.enemySystem.update(this.interceptors, this.projectiles);
        
        // Iranian offensive attacks against Israeli base
        this.enemySystem.launchOffensiveAttack(this.weaponSystem.launchPlatform, this.interceptors);
        
        // Facility attacks against Israeli base
        this.processFacilityAttacks();
        
        // Update missile trails for all projectiles
        this.projectiles.forEach(projectile => {
            this.effectsManager.createMissileTrail(projectile);
        });
        
        this.interceptors.forEach(interceptor => {
            this.effectsManager.createMissileTrail(interceptor);
        });
        
        // Check for incoming Iranian missiles and activate warning
        const iranianMissiles = this.interceptors.filter(m => m.type === 'iranian');
        if (iranianMissiles.length > 0 && !this.effectsManager.warningSystem.active) {
            this.effectsManager.activateIncomingMissileWarning();
        }
        
        this.effectsManager.update(this.explosions, this.particles);
        
        this.updateAircrafts();
        this.checkCollisions();
        this.checkLevelProgression(); // Check for level advancement
        this.checkVictoryConditions();
        this.checkLevelProgression();
        
        if (this.screenShake) {
            this.screenShake.duration--;
            if (this.screenShake.duration <= 0) {
                this.screenShake = null;
            }
        }
    }

    getActiveFacilities() {
        // Use TargetManager to get active facilities for current level
        return this.targetManager.getActiveFacilities(this.currentLevel);
    }
    
    // Enhanced level progression with dramatic reveals
    checkLevelProgression() {
        const activeFacilities = this.getActiveFacilities();
        const destroyedCount = Object.values(activeFacilities).filter(target => target.destroyed).length;
        const totalActiveCount = Object.keys(activeFacilities).length;
        
        // Advance level when all current facilities are destroyed
        if (destroyedCount === totalActiveCount && totalActiveCount > 0 && this.currentLevel < this.maxLevel) {
            this.advanceLevel();
        }
    }

    advanceLevel() {
        this.currentLevel++;
        console.log(`Advancing to level ${this.currentLevel}`);
        
        // Show level transition effect with facility reveal
        this.showLevelTransition();
        
        // Increase difficulty
        this.updateDifficulty();
        
        // Announce new facility unlock
        this.announceNewFacility();
    }

    announceNewFacility() {
        const facilityUnlockOrder = [
            'Natanz Facility',
            'Fordow Complex', 
            'Esfahan Facility',
            'Arak Reactor',
            'Tehran Research Facility',
            'Bushehr Nuclear Power Plant',
            'Ardakan Yellowcake Plant'
        ];
        
        if (this.currentLevel <= facilityUnlockOrder.length) {
            const newFacilityName = facilityUnlockOrder[this.currentLevel - 1];
            console.log(`NEW TARGET REVEALED: ${newFacilityName}`);
            
            // Create announcement effect
            this.facilityAnnouncement = {
                active: true,
                text: `NEW TARGET: ${newFacilityName}`,
                duration: 180, // 3 seconds
                fadeIn: 30
            };
        }
    }

    showLevelTransition() {
        // Create visual effect for level transition
        this.levelTransitionEffect = {
            active: true,
            duration: 120, // 2 seconds at 60fps
            alpha: 1.0
        };
        
        // Add dramatic explosion effect
        this.effectsManager.createExplosion(this.explosions, 600, 350, 100, 'flash');
        
        // Screen shake
        this.screenShake = {
            intensity: 20,
            duration: 60
        };
    }

    updateDifficulty() {
        // Increase Iranian attack frequency and accuracy
        const difficultyMultiplier = 1 + (this.currentLevel - 1) * 0.3;
        
        this.enemySystem.iranianOffensive.attackFrequency = Math.max(1000, 
            this.enemySystem.iranianOffensive.attackFrequency - 200);
        this.enemySystem.iranianOffensive.accuracy = Math.min(0.98, 
            this.enemySystem.iranianOffensive.accuracy + 0.02);
        this.enemySystem.iranianOffensive.missileSpeed += 0.2;
        this.enemySystem.iranianOffensive.baseAttackChance = Math.min(0.4, 
            this.enemySystem.iranianOffensive.baseAttackChance + 0.03);
        
        console.log(`Difficulty increased for level ${this.currentLevel}:`,
            `Frequency: ${this.enemySystem.iranianOffensive.attackFrequency}ms,`,
            `Accuracy: ${this.enemySystem.iranianOffensive.accuracy},`,
            `Speed: ${this.enemySystem.iranianOffensive.missileSpeed}`);
    }
    
    checkVictoryConditions() {
        // Check if Israeli base is destroyed
        if (this.weaponSystem.launchPlatform && this.weaponSystem.launchPlatform.destroyed) {
            // Game over - defeat
            this.endGame(false);
            return;
        }
        
        // Check victory: all facilities destroyed AND reached max level
        const activeFacilities = this.getActiveFacilities();
        const allActiveTargetsDestroyed = Object.values(activeFacilities).every(target => target.destroyed);
        
        if (allActiveTargetsDestroyed && this.currentLevel >= this.maxLevel) {
            this.endGame(true);
        }
        
        // Check if time has run out
        if (this.timeLeft <= 0) {
            this.endGame(false);
        }
    }

    updateAircrafts() {
        this.aircrafts = this.aircrafts.filter(aircraft => {
            aircraft.x += aircraft.vx;
            aircraft.y += aircraft.vy;
            
            // Drop bombs over targets
            if (aircraft.x > 800 && aircraft.bombs > 0 && !aircraft.bombing) {
                aircraft.bombing = true;
                this.dropBomb(aircraft);
                aircraft.bombs--;
            }
            
            aircraft.life--;
            return aircraft.x < this.canvas.width + 50 && aircraft.life > 0;
        });
    }

    dropBomb(aircraft) {
        const bomb = {
            x: aircraft.x,
            y: aircraft.y + 10,
            vx: aircraft.vx * 0.5,
            vy: 2,
            type: 'bomb',
            trail: [],
            life: 200
        };
        this.projectiles.push(bomb);
    }

    checkCollisions() {
        // Ensure targets exist before checking collisions
        if (!this.targetManager.targets || Object.keys(this.targetManager.targets).length === 0) {
            return;
        }
        
        // Get only active facilities for current level
        const activeFacilities = this.getActiveFacilities();
        
        // Projectile vs Target collisions - use reverse loop to avoid index issues
        for (let pIndex = this.projectiles.length - 1; pIndex >= 0; pIndex--) {
            if (pIndex >= this.projectiles.length || pIndex < 0) continue;
            
            const projectile = this.projectiles[pIndex];
            if (!projectile) continue;
            
            let projectileHit = false;
            
            // Only check collisions with ACTIVE facilities
            Object.values(activeFacilities).forEach(target => {
                if (target.destroyed || projectileHit) return;
                
                if (projectile.x > target.x && 
                    projectile.x < target.x + target.width &&
                    projectile.y > target.y && 
                    projectile.y < target.y + target.height) {
                    
                    this.hitTarget(target, projectile);
                    this.projectiles.splice(pIndex, 1);
                    projectileHit = true;
                }
            });
            
            // Ground collision - only check if projectile wasn't already removed
            if (!projectileHit && projectile.y > this.canvas.height - 100) {
                this.effectsManager.createExplosion(this.explosions, projectile.x, projectile.y, 30);
                this.projectiles.splice(pIndex, 1);
            }
        }
        
        // Interceptor vs Projectile collisions - use reverse loops
        for (let iIndex = this.interceptors.length - 1; iIndex >= 0; iIndex--) {
            const interceptor = this.interceptors[iIndex];
            let interceptorHit = false;
            
            // Check if Iranian missile hits Israeli base
            if (interceptor.type === 'iranian') {
                // Much more lenient collision detection for Iranian missiles with the Israeli base
                const expandedCollisionBuffer = 50;
                if (!this.weaponSystem.launchPlatform.destroyed &&
                    interceptor.x > this.weaponSystem.launchPlatform.x - expandedCollisionBuffer &&
                    interceptor.x < this.weaponSystem.launchPlatform.x + this.weaponSystem.launchPlatform.width + expandedCollisionBuffer &&
                    interceptor.y > this.weaponSystem.launchPlatform.y - expandedCollisionBuffer &&
                    interceptor.y < this.weaponSystem.launchPlatform.y + this.weaponSystem.launchPlatform.height + expandedCollisionBuffer) {
                    
                    this.hitIsraeliBase(interceptor);
                    this.interceptors.splice(iIndex, 1);
                    interceptorHit = true;
                    
                    this.effectsManager.createExplosion(this.explosions, interceptor.x, interceptor.y, 35);
                    continue;
                }
                
                // Additional check: if missile gets close to the bottom of the screen
                if (!this.weaponSystem.launchPlatform.destroyed && 
                    interceptor.y > this.canvas.height - 100 &&
                    interceptor.x > this.weaponSystem.launchPlatform.x - 100 &&
                    interceptor.x < this.weaponSystem.launchPlatform.x + this.weaponSystem.launchPlatform.width + 100) {
                    
                    this.hitIsraeliBase(interceptor);
                    this.interceptors.splice(iIndex, 1);
                    interceptorHit = true;
                    
                    this.effectsManager.createExplosion(this.explosions, interceptor.x, interceptor.y, 35);
                    continue;
                }
            }
            
            for (let pIndex = this.projectiles.length - 1; pIndex >= 0; pIndex--) {
                if (interceptorHit) break;
                
                const projectile = this.projectiles[pIndex];
                const dx = interceptor.x - projectile.x;
                const dy = interceptor.y - projectile.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 20) {
                    this.effectsManager.createExplosion(this.explosions, projectile.x, projectile.y, 25);
                    this.interceptors.splice(iIndex, 1);
                    this.projectiles.splice(pIndex, 1);
                    interceptorHit = true;
                    break;
                }
            }
        }
    }

    hitTarget(target, projectile) {
        if (!target || !projectile) return;
        
        const damage = this.calculateDamage(projectile.type);
        target.health -= damage;
        
        this.score += damage * 10;
        this.stats.hits++;
        
        if (target.health <= 0) {
            target.health = 0;
            target.destroyed = true;
            this.stats.targetsDestroyed++;
            this.score += 500; // Destruction bonus
            this.effectsManager.createAtomicExplosion(this.explosions, target.x + target.width/2, target.y + target.height/2);
            
            // Show the Haminai image for 2 seconds when a facility is destroyed
            this.showHaminaiImage();
        } else {
            this.effectsManager.createExplosion(this.explosions, projectile.x, projectile.y, 40);
        }
        
        this.soundManager.playSound('hit');
    }

    hitIsraeliBase(interceptor) {
        if (!this.weaponSystem.launchPlatform || this.weaponSystem.launchPlatform.destroyed) return;
        
        const damage = interceptor.damage || 20; // Iranian missile damage
        this.weaponSystem.launchPlatform.health -= damage;
        
        // Create dramatic explosion at base
        this.effectsManager.createExplosion(
            this.explosions, 
            this.weaponSystem.launchPlatform.x + this.weaponSystem.launchPlatform.width/2,
            this.weaponSystem.launchPlatform.y + this.weaponSystem.launchPlatform.height/2,
            60,
            'shockwave'
        );
        
        // Intense screen shake
        this.screenShake = {
            intensity: 25,
            duration: 90
        };
        
        // Create debris particles
        const debrisParticles = this.effectsManager.createLaunchSmoke(
            this.weaponSystem.launchPlatform.x + this.weaponSystem.launchPlatform.width/2,
            this.weaponSystem.launchPlatform.y
        );
        this.particles.push(...debrisParticles);
        
        if (this.weaponSystem.launchPlatform.health <= 0) {
            this.weaponSystem.launchPlatform.health = 0;
            this.weaponSystem.launchPlatform.destroyed = true;
            
            // Create massive atomic explosion when base is destroyed
            this.effectsManager.createAtomicExplosion(
                this.explosions,
                this.weaponSystem.launchPlatform.x + this.weaponSystem.launchPlatform.width/2,
                this.weaponSystem.launchPlatform.y + this.weaponSystem.launchPlatform.height/2
            );
            
            // Extreme screen shake
            this.screenShake = {
                intensity: 40,
                duration: 180
            };
            
            this.endGame(false); // Game over if Israeli base is destroyed
        }
        
        this.soundManager.playSound('explosion');
        console.log(`Israeli base hit! Health: ${this.weaponSystem.launchPlatform.health}/${this.weaponSystem.launchPlatform.maxHealth}`);
    }

    calculateDamage(weaponType) {
        const damages = {
            missile: 25,
            guided: 35,
            aircraft: 30,
            cruise: 40,
            bomb: 30
        };
        return damages[weaponType] || 20;
    }

    showHaminaiImage() {
        const haminaiContainer = document.getElementById('haminaiContainer');
        if (!haminaiContainer) return;
        
        // Show the image
        haminaiContainer.classList.remove('hidden');
        
        // Hide it after 2 seconds
        setTimeout(() => {
            haminaiContainer.classList.add('hidden');
        }, 2000);
    }

    loadSaraImage() {
        console.log('Loading Sara image...');
        try {
            this.saraImage = new Image();
            
            this.saraImage.onload = () => {
                console.log('Sara image loaded');
            };
            
            this.saraImage.onerror = (error) => {
                console.warn('Failed to load Sara image, will use drawn portrait fallback', error);
                this.saraImage = null;
            };
            
            // Try to load from images folder first
            this.saraImage.src = 'images/sara.png';
        } catch (error) {
            console.error('Error in loadSaraImage:', error);
            this.saraImage = null;
        }
    }

    loadHaminaiImage() {
        console.log('Loading Haminai image...');
        try {
            this.haminaiImage = new Image();
            
            this.haminaiImage.onload = () => {
                console.log('Haminai image loaded');
            };
            
            this.haminaiImage.onerror = (error) => {
                console.warn('Failed to load Haminai image', error);
                this.haminaiImage = null;
            };
            
            this.haminaiImage.src = 'images/haminai.png';
        } catch (error) {
            console.error('Error in loadHaminaiImage:', error);
            this.haminaiImage = null;
        }
    }

    setupResponsiveCanvas() {
        if (!this.canvas) return;
        
        if (this.isMobile()) {
            // Mobile setup - maintain aspect ratio
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const gameAspectRatio = 1200 / 700; // Original game aspect ratio
            
            // Calculate canvas size while maintaining aspect ratio
            let canvasWidth, canvasHeight;
            
            if (viewportWidth / viewportHeight > gameAspectRatio) {
                // Viewport is wider than game aspect ratio - fit to height
                canvasHeight = viewportHeight;
                canvasWidth = canvasHeight * gameAspectRatio;
            } else {
                // Viewport is taller than game aspect ratio - fit to width
                canvasWidth = viewportWidth;
                canvasHeight = canvasWidth / gameAspectRatio;
            }
            
            // Set canvas logical size (game coordinates)
            this.canvas.width = 1200;
            this.canvas.height = 700;
            
            // Set canvas display size (what user sees)
            this.canvas.style.width = `${canvasWidth}px`;
            this.canvas.style.height = `${canvasHeight}px`;
        } else {
            // Desktop setup
            this.canvas.width = 1200;
            this.canvas.height = 700;
            this.canvas.style.width = '100%';
            this.canvas.style.height = 'auto';
        }
        
        // Center the canvas
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '0 auto';
    }
    
    handleResize() {
        this.setupResponsiveCanvas();
    }
    
    setupOrientationHandling() {
        const landscapePrompt = document.getElementById('landscapePrompt');
        if (landscapePrompt) {
            landscapePrompt.addEventListener('click', () => {
                landscapePrompt.style.display = 'none';
            });
        }
    }
    
    showOrientationPrompt() {
        const landscapePrompt = document.getElementById('landscapePrompt');
        if (landscapePrompt) {
            landscapePrompt.style.display = 'block';
        }
    }
    
    checkOrientation() {
        if (!this.isMobile()) return;
        
        const landscapePrompt = document.getElementById('landscapePrompt');
        if (!landscapePrompt) return;
        
        const isPortrait = window.innerHeight > window.innerWidth;
        
        if (isPortrait && this.gameState === 'menu') {
            landscapePrompt.style.display = 'block';
        } else {
            landscapePrompt.style.display = 'none';
        }
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && window.innerHeight <= 1024);
    }
    
    render() {
        // Apply screen shake if active
        if (this.screenShake) {
            const shakeIntensity = this.screenShake.intensity * 
                (this.screenShake.duration / this.screenShake.duration);
            const shakeX = (Math.random() - 0.5) * shakeIntensity;
            const shakeY = (Math.random() - 0.5) * shakeIntensity;
            this.ctx.save();
            this.ctx.translate(shakeX, shakeY);
        }
        
        this.renderer.clear();
        
        // Always draw background and basic elements
        this.renderer.drawBackground();
        this.renderer.drawTerrain();
        this.renderer.drawFlags();
        this.renderer.drawLaunchPlatform(this.weaponSystem.launchPlatform);
        
        // Draw targets based on current level progression
        const targetsToShow = this.gameState === 'playing' ? this.getActiveFacilities() : this.targetManager.targets;
        this.renderer.drawTargets(targetsToShow);
        this.renderer.drawDefenseSystems(this.enemySystem.defenseSystems);
        
        if (this.gameState === 'playing') {
            this.renderer.drawProjectiles(this.projectiles);
            this.renderer.drawInterceptors(this.interceptors);
            this.renderer.drawAircrafts(this.aircrafts);
            this.renderer.drawExplosions(this.explosions);
            this.renderer.drawParticles(this.particles);
            
            // Draw incoming missile warning overlay
            this.renderer.drawIncomingMissileWarning(this.effectsManager.warningSystem);
            
            if (this.isAiming) {
                this.renderer.drawAimingLine(this.aimStartX, this.aimStartY, this.aimEndX, this.aimEndY);
            }
            
            this.renderer.drawLevelIndicator(this.currentLevel, this.maxLevel);
            
            // Draw threat assessment
            const activeFacilities = this.getActiveFacilities();
            this.renderer.drawThreatAssessment(activeFacilities);
            
            // Draw facility announcement if active
            if (this.facilityAnnouncement) {
                this.renderer.drawFacilityAnnouncement(this.facilityAnnouncement);
                
                // Update announcement
                if (this.facilityAnnouncement.fadeIn > 0) {
                    this.facilityAnnouncement.fadeIn--;
                }
                this.facilityAnnouncement.duration--;
                if (this.facilityAnnouncement.duration <= 0) {
                    this.facilityAnnouncement = null;
                }
            }
            
            // Draw screen shake visual effect
            if (this.screenShake) {
                this.renderer.drawScreenShakeEffect(this.screenShake.intensity);
            }
        }
        
        if (this.screenShake) {
            this.ctx.restore();
        }
    }
    
    gameLoop() {
        this.update();
        this.render();
        this.uiManager.updateHUD();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    processFacilityAttacks() {
        const activeFacilities = this.getActiveFacilities();
        
        Object.values(activeFacilities).forEach(facility => {
            if (!facility.destroyed && Math.random() < 0.02) { // 2% chance per frame for each facility
                // Higher chance for critical facilities
                let attackChance = 0.02;
                if (facility.threatLevel === 'critical') attackChance = 0.035;
                else if (facility.threatLevel === 'high') attackChance = 0.025;
                
                if (Math.random() < attackChance) {
                    const launched = this.targetManager.launchFacilityAttack(
                        facility, 
                        this.weaponSystem.launchPlatform, 
                        this.interceptors
                    );
                    
                    if (launched) {
                        // Create launch smoke effect at facility
                        const smokeParticles = this.effectsManager.createLaunchSmoke(
                            facility.x + facility.width/2,
                            facility.y + facility.height/2
                        );
                        this.particles.push(...smokeParticles);
                        
                        this.soundManager.playSound('launch');
                    }
                }
            }
        });
    }
}
