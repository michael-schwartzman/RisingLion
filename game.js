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
        
        // Weapons inventory
        this.weapons = {
            missile: { count: Infinity, name: 'Missile' },
            guided: { count: 5, name: 'Guided Missile' },
            aircraft: { count: 3, name: 'Aircraft' },
            cruise: { count: 2, name: 'Cruise Missile' }
        };
        
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
        this.loadSaraImage();
        this.loadHaminaiImage();
        
        // Targets - Iranian Nuclear Facilities
        this.targets = {
            natanz: {
                x: 700,
                y: 400,
                width: 80,
                height: 120,
                health: 100,
                maxHealth: 100,
                destroyed: false,
                name: 'Natanz Facility'
            },
            fordow: {
                x: 850,
                y: 350,
                width: 60,
                height: 100,
                health: 100,
                maxHealth: 100,
                destroyed: false,
                name: 'Fordow Complex'
            },
            arak: {
                x: 600,
                y: 430,
                width: 70,
                height: 110,
                health: 100,
                maxHealth: 100,
                destroyed: false,
                name: 'Arak Reactor'
            },
            esfahan: {
                x: 500,
                y: 380,
                width: 65,
                height: 90,
                health: 100,
                maxHealth: 100,
                destroyed: false,
                name: 'Esfahan Facility'
            },
            bushehr: {
                x: 1000,
                y: 380,
                width: 90,
                height: 130,
                health: 100,
                maxHealth: 100,
                destroyed: false,
                name: 'Bushehr Nuclear Power Plant'
            },
            tehran: {
                x: 400,
                y: 350,
                width: 55,
                height: 85,
                health: 100,
                maxHealth: 100,
                destroyed: false,
                name: 'Tehran Research Facility'
            },
            ardakan: {
                x: 300,
                y: 420,
                width: 65,
                height: 85,
                health: 100,
                maxHealth: 100,
                destroyed: false,
                name: 'Ardakan Yellowcake Plant'
            }
        };
        
        // Launch platform (Israeli side)
        this.launchPlatform = {
            x: 50,
            y: 500,
            width: 100,
            height: 40,
            health: 100,         // Adding health to Israeli platform
            maxHealth: 100,
            destroyed: false,
            name: 'Israeli Base'
        };
        
        // Iranian offensive capabilities - progressive difficulty
        this.iranianOffensive = {
            attackCooldown: 0,
            missileSpeed: 2.0,     // Start slower, will increase with levels
            accuracy: 0.3,         // Start less accurate, will increase with levels
            attackFrequency: 5000, // Start with less frequent attacks
            baseAttackChance: 0.0, // Start with no attacks (Level 1 tutorial)
            enabled: false         // Disabled for tutorial level
        };
        
        // Defense systems - increased number and improved capabilities
        this.defenseSystems = [
            { x: 800, y: 450, radius: 200, active: true, cooldown: 0, name: 'Northern Defense Grid' },
            { x: 1000, y: 300, radius: 180, active: true, cooldown: 0, name: 'Eastern Defense System' },
            { x: 900, y: 500, radius: 160, active: true, cooldown: 0, name: 'Southern Interceptor Base' },
            { x: 1100, y: 400, radius: 170, active: true, cooldown: 0, name: 'Central Command' },
            { x: 850, y: 350, radius: 150, active: true, cooldown: 0, name: 'Western Outpost' }
        ];
        
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
            this.setupEventListeners();
            console.log('Event listeners set up');
            
            // Set up orientation handling for mobile
            this.setupOrientationHandling();
            console.log('Orientation handling set up');
            
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
            this.showScreen('mainMenu');
            console.log('Main menu displayed');
            
            // Initialize theme
            this.initializeTheme();
            console.log('Theme initialized');
            
            // Start the game loop
            this.gameLoop();
            console.log('Game loop started');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }
    
    setupEventListeners() {
        try {
            console.log('Setting up event listeners...');
            
            // Menu buttons - with more robust null checks
            const startGameBtn = document.getElementById('startGame');
            if (startGameBtn) {
                console.log('Start game button found, adding click listener');
                // Remove any existing listeners to prevent duplicates
                const newStartBtn = startGameBtn.cloneNode(true);
                startGameBtn.parentNode.replaceChild(newStartBtn, startGameBtn);
                
                newStartBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    console.log('Start game button clicked');
                    this.startGame();
                });
            } else {
                console.error('Start game button not found');
            }
            
            const showInstructionsBtn = document.getElementById('showInstructions');
            if (showInstructionsBtn) {
                showInstructionsBtn.addEventListener('click', () => this.showScreen('instructionsScreen'));
            }
            
            const showSettingsBtn = document.getElementById('showSettings');
            if (showSettingsBtn) {
                showSettingsBtn.addEventListener('click', () => this.showScreen('settingsScreen'));
            }
            
            const backToMenuBtn = document.getElementById('backToMenu');
            if (backToMenuBtn) {
                backToMenuBtn.addEventListener('click', () => this.showScreen('mainMenu'));
            }
            
            const backToMenuFromSettingsBtn = document.getElementById('backToMenuFromSettings');
            if (backToMenuFromSettingsBtn) {
                backToMenuFromSettingsBtn.addEventListener('click', () => this.showScreen('mainMenu'));
            }
            
            // Theme toggle functionality
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
            }
            
            const playAgainBtn = document.getElementById('playAgain');
            console.log('Play Again Button found:', playAgainBtn);
            if (playAgainBtn) {
                // Remove existing listeners to prevent duplicates
                playAgainBtn.removeEventListener('click', this.playAgainHandler);
                
                // Create a bound handler for the click event
                this.playAgainHandler = () => {
                    console.log('Play Again button clicked, starting new game');
                    // Make sure to clear any existing timers
                    if (this.gameTimer) clearInterval(this.gameTimer);
                    if (this.defenseTimer) clearInterval(this.defenseTimer);
                    this.startGame();
                };
                
                console.log('Adding click event listener to Play Again button');
                playAgainBtn.addEventListener('click', this.playAgainHandler);
            }
            
            const backToMainMenuBtn = document.getElementById('backToMainMenu');
            if (backToMainMenuBtn) {
                backToMainMenuBtn.addEventListener('click', () => this.showScreen('mainMenu'));
            }
            
            // Canvas events - Mouse and Touch support
            if (this.canvas) {
                // Mouse events
                this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
                this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
                this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
                
                // Touch events for mobile with proper coordinate handling
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const coords = this.getCanvasCoordinates(touch.clientX, touch.clientY);
                    this.debugTouch('touchstart', { raw: {x: touch.clientX, y: touch.clientY}, canvas: coords });
                    
                    const mouseEvent = {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        preventDefault: () => {}
                    };
                    this.handleMouseDown(mouseEvent);
                }, { passive: false });
                
                this.canvas.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const coords = this.getCanvasCoordinates(touch.clientX, touch.clientY);
                    this.debugTouch('touchmove', { raw: {x: touch.clientX, y: touch.clientY}, canvas: coords });
                    
                    const mouseEvent = {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        preventDefault: () => {}
                    };
                    this.handleMouseMove(mouseEvent);
                }, { passive: false });
                
                this.canvas.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.debugTouch('touchend', { released: true });
                    
                    const mouseEvent = {
                        clientX: 0,
                        clientY: 0,
                        preventDefault: () => {}
                    };
                    this.handleMouseUp(mouseEvent);
                }, { passive: false });
                
                // Prevent context menu on long press
                this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
            }
            
            // Keyboard events
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
            
            // Weapon selection
            const weaponTypeSelect = document.getElementById('weaponType');
            if (weaponTypeSelect) {
                weaponTypeSelect.addEventListener('change', (e) => {
                    this.currentWeapon = e.target.value;
                });
            }
            
            console.log('Event listeners setup complete');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }
    
    showScreen(screenId) {
        console.log(`Showing screen: ${screenId}`);
        document.querySelectorAll('.screen').forEach(screen => {
            console.log(`Adding 'hidden' class to: ${screen.id}`);
            screen.classList.add('hidden');
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            console.log(`Removing 'hidden' class from: ${screenId}`);
            targetScreen.classList.remove('hidden');
        } else {
            console.error(`Screen element not found: ${screenId}`);
        }
        
        // Check orientation when showing main menu
        if (screenId === 'mainMenu') {
            setTimeout(() => this.checkOrientation(), 100);
        }
    }
    
    startGame() {
        console.log('startGame method called');
        
        // Prevent starting game in portrait mode on mobile
        if (this.isMobile() && window.innerHeight > window.innerWidth) {
            console.log('Cannot start game in portrait mode on mobile');
            this.checkOrientation(); // Show landscape prompt
            return;
        }
        
        try {
            console.log('Setting game state to playing');
            this.gameState = 'playing';
            this.score = 0;
            this.timeLeft = 180;
            this.stats = { shotsFired: 0, hits: 0, targetsDestroyed: 0 };
            
            // Initialize progressive difficulty system
            this.currentLevel = 1;
            this.levelStartTime = 0;
            this.difficultyMultiplier = 1.0;
            this.speedMultiplier = 1.0;
            
            // Reset all facilities to non-destroyed state
            Object.keys(this.targets).forEach(key => {
                this.targets[key].destroyed = false;
                this.targets[key].health = this.targets[key].maxHealth;
            });
            
            // Ensure targets are properly initialized
            if (!this.targets || Object.keys(this.targets).length === 0) {
                console.log('Targets not properly initialized, reinitializing...');
                this.targets = {
                    natanz: {
                        x: 950,
                        y: 400,
                        width: 80,
                        height: 120,
                        health: 100,
                        maxHealth: 100,
                        destroyed: false,
                        name: 'Natanz Facility'
                    },
                    fordow: {
                        x: 1050,
                        y: 350,
                        width: 60,
                        height: 100,
                        health: 100,
                        maxHealth: 100,
                        destroyed: false,
                        name: 'Fordow Complex'
                    },
                    arak: {
                        x: 850,
                        y: 430,
                        width: 70,
                        height: 110,
                        health: 100,
                        maxHealth: 100,
                        destroyed: false,
                        name: 'Arak (IR-40) Reactor'
                    },
                    esfahan: {
                        x: 1000,
                        y: 250,
                        width: 65,
                        height: 90,
                        health: 100,
                        maxHealth: 100,
                        destroyed: false,
                        name: 'Esfahan (Isfahan) Facility'
                    },
                    bushehr: {
                        x: 1150,
                        y: 380,
                        width: 90,
                        height: 130,
                        health: 100,
                        maxHealth: 100,
                        destroyed: false,
                        name: 'Bushehr Nuclear Power Plant'
                    },
                    tehran: {
                        x: 900,
                        y: 280,
                        width: 55,
                        height: 85,
                        health: 100,
                        maxHealth: 100,
                        destroyed: false,
                        name: 'Tehran Research Reactor'
                    },
                    bonab: {
                        x: 980,
                        y: 320,
                        width: 70,
                        height: 100,
                        health: 100,
                        maxHealth: 100,
                        destroyed: false,
                        name: 'Bonab Heavy Water Plant'
                    },
                    darkovin: {
                        x: 1100,
                        y: 450,
                        width: 75,
                        height: 95,
                        health: 100,
                        maxHealth: 100,
                        destroyed: false,
                        name: 'Darkovin Nuclear Power Plant'
                    },
                    parchin: {
                        x: 800,
                        y: 380,
                        width: 65,
                        height: 85,
                        health: 100,
                        maxHealth: 100,
                        destroyed: false,
                        name: 'Parchin Military Complex'
                    }
                };
            } else {            // Reset targets
            Object.values(this.targets).forEach(target => {
                target.health = target.maxHealth;
                target.destroyed = false;
            });
            
            // Reset launch platform
            if (this.launchPlatform) {
                console.log('Resetting launch platform');
                this.launchPlatform.health = this.launchPlatform.maxHealth;
                this.launchPlatform.destroyed = false;
            }
            }
            
            // Reset weapons - only missile and cruise missile available
            this.weapons.missile = { count: Infinity, name: 'Missile' };
            this.weapons.cruise = { count: 2, name: 'Cruise Missile' };
            
            // Clear game objects
            this.projectiles = [];
            this.interceptors = [];
            this.explosions = [];
            this.particles = [];
            this.aircrafts = [];
            this.screenShake = null;
            
            // Reset Iranian systems
            if (this.iranianOffensive) {
                console.log('Resetting Iranian offensive systems');
                this.iranianOffensive = {
                    attackCooldown: 0,
                    missileSpeed: 2.0,     // Start slower
                    accuracy: 0.3,         // Start less accurate
                    attackFrequency: 5000, // Start with less frequent attacks
                    baseAttackChance: 0.0, // Start with no attacks (Level 1 tutorial)
                    enabled: false         // Disabled for tutorial level
                };
            }
            
            // Reset defense systems
            if (this.defenseSystems) {
                console.log('Resetting defense systems');
                this.defenseSystems.forEach(system => {
                    system.active = true;
                    system.cooldown = 0;
                });
            }
            
            this.showScreen('gameScreen');
            this.startTimer();
            this.safelyUpdateHUD();
            
            // Initialize difficulty for level 1 (tutorial mode)
            this.updateDifficulty();
            
            console.log('Game started successfully');
        } catch (error) {
            console.error('Error starting game:', error);
        }
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
            this.safelyUpdateHUD();
            
            // Make the game progressively harder
            if (this.timeLeft % 30 === 0 && this.timeLeft < 150) {
                // Every 30 seconds, increase difficulty
                this.iranianOffensive.accuracy += 0.05; // Make Iranian attacks more accurate
                this.iranianOffensive.missileSpeed += 0.3; // Make missiles faster
                this.iranianOffensive.attackFrequency = Math.max(2000, this.iranianOffensive.attackFrequency - 300); // More frequent attacks
            }
            
            if (this.timeLeft <= 0) {
                console.log('Time expired, ending game');
                this.endGame();
            }
        }, 1000);
        
        // Spawn interceptors periodically - more frequently as time goes on
        this.defenseTimer = setInterval(() => {
            // Calculate delay based on remaining time (shorter as game progresses)
            const progressFactor = 1 - (this.timeLeft / 180);
            const baseDelay = 3000 - (progressFactor * 1500); // 3000ms down to 1500ms
            
            this.spawnRandomInterceptor();
            
            // Clear and reset the interval with progressively shorter times
            clearInterval(this.defenseTimer);
            this.defenseTimer = setInterval(() => {
                this.spawnRandomInterceptor();
            }, baseDelay + Math.random() * 1500);
            
        }, 3000 + Math.random() * 2000);
    }
    
    getCanvasCoordinates(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    handleMouseDown(e) {
        if (this.gameState !== 'playing') return;
        
        const coords = this.getCanvasCoordinates(e.clientX, e.clientY);
        this.aimStartX = coords.x;
        this.aimStartY = coords.y;
        this.isAiming = true;
        
        document.getElementById('powerMeter').classList.remove('hidden');
    }
    
    handleMouseMove(e) {
        if (!this.isAiming) return;
        
        const coords = this.getCanvasCoordinates(e.clientX, e.clientY);
        this.aimEndX = coords.x;
        this.aimEndY = coords.y;
        
        // Update power meter
        const distance = Math.sqrt(
            Math.pow(this.aimEndX - this.aimStartX, 2) + 
            Math.pow(this.aimEndY - this.aimStartY, 2)
        );
        const power = Math.min(distance / 3, 100);
        document.getElementById('powerFill').style.width = power + '%';
    }
    
    handleMouseUp(e) {
        if (!this.isAiming) return;
        
        this.isAiming = false;
        document.getElementById('powerMeter').classList.add('hidden');
        
        this.fireWeapon();
    }
    
    handleKeyDown(e) {
        if (this.gameState !== 'playing') return;
        
        switch(e.key) {
            case '1':
                this.currentWeapon = 'missile';
                break;
            case '2':
                this.currentWeapon = 'cruise';
                break;
            // Removed aircraft and guided missile options
        }
        this.updateWeaponSelect();
    }
    
    fireWeapon() {
        const weapon = this.weapons[this.currentWeapon];
        if (weapon.count <= 0) return;
        
        const dx = this.aimEndX - this.aimStartX;
        const dy = this.aimEndY - this.aimStartY;
        const power = Math.sqrt(dx * dx + dy * dy) / 300;
        
        const projectile = {
            x: this.launchPlatform.x + this.launchPlatform.width,
            y: this.launchPlatform.y + this.launchPlatform.height / 2,
            vx: dx * power * 0.1,
            vy: dy * power * 0.1,
            type: this.currentWeapon,
            trail: [],
            life: 1000,
            guided: this.currentWeapon === 'guided',
            targetX: this.aimEndX,
            targetY: this.aimEndY
        };
        
        this.projectiles.push(projectile);
        this.stats.shotsFired++;
        
        if (weapon.count !== Infinity) {
            weapon.count--;
        }
        
        this.safelyUpdateHUD();
        this.createLaunchEffect();
    }
    
    deployAircraft() {
        if (this.weapons.aircraft.count <= 0) return;
        
        const aircraft = {
            x: this.launchPlatform.x + this.launchPlatform.width / 2,  // Center exactly on base
            y: this.launchPlatform.y + this.launchPlatform.height / 2,  // Center exactly on base
            vx: 3,
            vy: -0.5 + Math.random() * 1,
            bombs: 2,
            life: 300,
            bombing: false
        };
        
        this.aircrafts.push(aircraft);
        this.weapons.aircraft.count--;
        this.updateHUD();
    }
    
    spawnRandomInterceptor() {
        if (this.projectiles.length === 0) return;
        
        const activeSystems = this.defenseSystems.filter(sys => sys.active && sys.cooldown <= 0);
        if (activeSystems.length === 0) return;
        
        const system = activeSystems[Math.floor(Math.random() * activeSystems.length)];
        
        // Choose which projectile to target - sometimes target the newest (most threatening) projectile
        const targetIndex = Math.random() < 0.6 ? 0 : this.projectiles.length - 1;
        const target = this.projectiles[targetIndex];
        
        // Increased speed and more intelligent tracking
        const progressFactor = 1 - (this.timeLeft / 180); // 0 at start, 1 at end
        const speedBoost = 1 + progressFactor; // Speed increases as game progresses
        
        const interceptor = {
            x: system.x,
            y: system.y,
            targetX: target.x,
            targetY: target.y,
            speed: 4.5 + speedBoost,
            life: 200,
            trail: []
        };
        
        this.interceptors.push(interceptor);
        
        // Shorter cooldown as game progresses
        const baseCooldown = 120; // 2 seconds at 60fps
        const adaptiveCooldown = baseCooldown - (progressFactor * 60); // Down to 1 second at end game
        system.cooldown = Math.max(60, adaptiveCooldown); 
        
        // Sometimes launch multiple interceptors for harder difficulty
        if (Math.random() < 0.2 + (progressFactor * 0.3)) { // 20%-50% chance based on progress
            setTimeout(() => {
                if (this.projectiles.length > 0 && this.gameState === 'playing') {
                    const followupTarget = this.projectiles[Math.floor(Math.random() * this.projectiles.length)];
                    const followupInterceptor = {
                        x: system.x,
                        y: system.y,
                        targetX: followupTarget.x,
                        targetY: followupTarget.y,
                        speed: 5 + speedBoost,
                        life: 200,
                        trail: []
                    };
                    this.interceptors.push(followupInterceptor);
                }
            }, 300); // Launch second interceptor after a short delay
        }
    }
    
    launchIranianMissile() {
        // Select a random defense system to launch from
        const activeSystems = this.defenseSystems.filter(sys => sys.active);
        if (activeSystems.length === 0) return;
        
        const system = activeSystems[Math.floor(Math.random() * activeSystems.length)];
        
        // Much improved targeting system
        // Smaller accuracy variation - more missiles hit their target
        const accuracyVariation = Math.random() * (1 - this.iranianOffensive.accuracy) * 40; // Was 100
        
        // Target the center of the platform more consistently
        const targetX = this.launchPlatform.x + (this.launchPlatform.width/2) + (Math.random() > 0.5 ? accuracyVariation : -accuracyVariation);
        const targetY = this.launchPlatform.y + (this.launchPlatform.height/2) + (Math.random() > 0.7 ? accuracyVariation : -accuracyVariation/2);
        
        // Create attack missile with increased damage and improved properties
        const missile = {
            x: system.x,
            y: system.y,
            targetX: targetX,
            targetY: targetY,
            speed: this.iranianOffensive.missileSpeed,
            type: 'iranian',
            damage: 15 + Math.floor(Math.random() * 15), // 15-30 damage (was 10-20)
            life: 200,
            trail: [],
            directHoming: Math.random() < 0.6, // 60% of missiles have direct homing capability
            homingStrength: 0.2 + (Math.random() * 0.3) // Variable homing strength
        };
        
        this.interceptors.push(missile);
        
        // Visual and audio feedback
        this.createLaunchEffect(system.x, system.y);
        
        // Reset cooldown
        this.iranianOffensive.attackCooldown = this.iranianOffensive.attackFrequency;
    }
    
    updateIranianOffensive() {
        // Skip Iranian attacks if not enabled (tutorial level)
        if (!this.iranianOffensive.enabled) {
            return;
        }
        
        if (this.iranianOffensive.attackCooldown > 0) {
            this.iranianOffensive.attackCooldown -= 16.67; // Approximately 60fps
        } else if (this.gameState === 'playing' && !this.launchPlatform.destroyed) {
            // Much more aggressive attack pattern
            const progressFactor = 1 - (this.timeLeft / 180); // 0 at start, 1 at end
            const attackProbability = this.iranianOffensive.baseAttackChance + (progressFactor * 0.6); // 25% at start, 85% at end
            
            if (Math.random() < attackProbability) {
                this.launchIranianMissile();
                
                // Sometimes launch multiple missiles in a salvo attack
                const salvoChance = 0.2 + (progressFactor * 0.4); // 20%-60% chance based on time
                if (Math.random() < salvoChance) {
                    // Schedule additional missile launches
                    setTimeout(() => {
                        if (this.gameState === 'playing' && !this.launchPlatform.destroyed) {
                            this.launchIranianMissile();
                        }
                    }, 300 + Math.random() * 200); // 300-500ms delay
                    
                    // Late game can have triple missile salvos
                    if (progressFactor > 0.6 && Math.random() < 0.4) {
                        setTimeout(() => {
                            if (this.gameState === 'playing' && !this.launchPlatform.destroyed) {
                                this.launchIranianMissile();
                            }
                        }, 600 + Math.random() * 300); // 600-900ms delay
                    }
                }
                
                // Set a bit longer cooldown after firing a missile
                this.iranianOffensive.attackCooldown = this.iranianOffensive.attackFrequency;
            } else {
                // Set a much shorter cooldown for next check - faster reaction time
                this.iranianOffensive.attackCooldown = 200 + Math.random() * 200; // 200-400ms (was 500)
            }
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Progressive difficulty updates
        this.checkLevelProgression();
        this.updateDifficulty();
        
        this.updateProjectiles();
        this.updateInterceptors();
        this.updateAircrafts();
        this.updateExplosions();
        this.updateParticles();
        this.updateDefenseSystems();
        this.updateIranianOffensive(); // Add Iranian offensive updates
        this.checkCollisions();
        this.checkVictoryConditions();
    }
    
    updateProjectiles() {
        this.projectiles = this.projectiles.filter(projectile => {
            // Update position with speed multiplier
            projectile.x += projectile.vx * this.speedMultiplier;
            projectile.y += projectile.vy * this.speedMultiplier;
            
            // Apply gravity
            if (projectile.type !== 'cruise') {
                projectile.vy += 0.2;
            }
            
            // Guided missile behavior
            if (projectile.guided && projectile.life > 500) {
                const dx = projectile.targetX - projectile.x;
                const dy = projectile.targetY - projectile.y;
                const angle = Math.atan2(dy, dx);
                projectile.vx += Math.cos(angle) * 0.1;
                projectile.vy += Math.sin(angle) * 0.1;
            }
            
            // Cruise missile behavior (low altitude)
            if (projectile.type === 'cruise') {
                if (projectile.y > 550) {
                    projectile.vy = -0.5;
                }
                if (projectile.y < 520) {
                    projectile.vy = 0.5;
                }
            }
            
            // Add to trail
            projectile.trail.push({ x: projectile.x, y: projectile.y, life: 30 });
            projectile.trail = projectile.trail.filter(point => point.life-- > 0);
            
            projectile.life--;
            
            // Remove if out of bounds or life expired
            return projectile.x < this.canvas.width && 
                   projectile.y < this.canvas.height && 
                   projectile.life > 0;
        });
    }
    
    updateInterceptors() {
        this.interceptors = this.interceptors.filter(interceptor => {
            // Iranian missiles with directHoming will actively track the Israeli base
            if (interceptor.type === 'iranian' && interceptor.directHoming) {
                // Update target coordinates to current platform position for continuous tracking
                interceptor.targetX = this.launchPlatform.x + (this.launchPlatform.width/2);
                interceptor.targetY = this.launchPlatform.y + (this.launchPlatform.height/2);
                
                // Add a slight variation for less predictable patterns
                if (Math.random() < 0.1) {
                    interceptor.targetX += (Math.random() - 0.5) * 5;
                    interceptor.targetY += (Math.random() - 0.5) * 5;
                }
            }
            
            // Move towards target
            const dx = interceptor.targetX - interceptor.x;
            const dy = interceptor.targetY - interceptor.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
                // Enhanced movement with improved homing for Iranian missiles
                const speedMultiplier = interceptor.type === 'iranian' ? 
                    (1 + ((200 - interceptor.life) / 200) * 0.3) : 1; // Speed increases as missile gets closer
                
                interceptor.x += (dx / distance) * interceptor.speed * speedMultiplier;
                interceptor.y += (dy / distance) * interceptor.speed * speedMultiplier;
                
                // Iranian missiles have unpredictable movement patterns
                if (interceptor.type === 'iranian') {
                    if (Math.random() < 0.15) { // More erratic movement (was 0.1)
                        interceptor.x += (Math.random() - 0.5) * 2.5;
                        interceptor.y += (Math.random() - 0.5) * 2.5;
                    }
                    
                    // Boost towards target as they get closer
                    if (distance < 150 && interceptor.homingStrength) {
                        const homing = interceptor.homingStrength * (1 - (distance / 150));
                        interceptor.x += (dx / distance) * homing;
                        interceptor.y += (dy / distance) * homing;
                    }
                }
            }
            
            // Add to trail - Iranian missiles have a distinctive trail
            const trailLife = interceptor.type === 'iranian' ? 30 : 20;
            interceptor.trail.push({ 
                x: interceptor.x, 
                y: interceptor.y, 
                life: trailLife,
                type: interceptor.type || 'normal'
            });
            
            interceptor.trail = interceptor.trail.filter(point => point.life-- > 0);
            
            interceptor.life--;
            return interceptor.life > 0;
        });
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
    
    updateExplosions() {
        this.explosions = this.explosions.filter(explosion => {
            if (!explosion || explosion.life === undefined) return false;
            
            explosion.life--;
            
            try {
                if (explosion.type === 'atomic') {
                    // Atomic explosion phases
                    if (explosion.life > 80) {
                        explosion.phase = 'initial';
                        explosion.radius = Math.min(explosion.radius + explosion.expansion, explosion.maxRadius);
                    } else if (explosion.life > 40) {
                        explosion.phase = 'expanding';
                        explosion.radius = Math.min(explosion.radius + 2, explosion.maxRadius);
                        if (explosion.mushroomStem) {
                            explosion.mushroomStem.height = Math.min(
                                explosion.mushroomStem.height + 3,
                                explosion.mushroomStem.maxHeight
                            );
                        }
                    } else {
                        explosion.phase = 'mushroom';
                        if (explosion.mushroomCap) {
                            explosion.mushroomCap.radius = Math.min(
                                explosion.mushroomCap.radius + 1.5,
                                explosion.mushroomCap.maxRadius
                            );
                        }
                    }
                    explosion.alpha = Math.max(0, explosion.life / 120);
                } else if (explosion.type === 'flash') {
                    explosion.radius = Math.min(explosion.radius + explosion.expansion, explosion.maxRadius || 500);
                    explosion.alpha = Math.max(0, explosion.life / 15);
                } else if (explosion.type === 'shockwave') {
                    explosion.radius = Math.min(explosion.radius + explosion.expansion, explosion.maxRadius || 400);
                    explosion.alpha = Math.max(0, explosion.life / 40) * 0.6;
                } else {
                    explosion.radius = Math.min(explosion.radius + explosion.expansion, explosion.maxRadius || 100);
                    explosion.alpha = Math.max(0, explosion.alpha - 0.02);
                }
            } catch (error) {
                console.warn('Error updating explosion:', error);
                return false;
            }
            
            return explosion.life > 0 && explosion.alpha > 0;
        });
        
        // Update screen shake
        if (this.screenShake) {
            this.screenShake.current++;
            if (this.screenShake.current >= this.screenShake.duration) {
                this.screenShake = null;
            }
        }
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.type === 'atomic-debris') {
                particle.vy += 0.15; // stronger gravity for debris
                particle.vx *= 0.99; // air resistance
            } else if (particle.type === 'smoke') {
                particle.vy -= 0.05; // smoke rises
                particle.vx *= 0.98; // air resistance
                particle.size += 0.1; // smoke expands
            } else {
                particle.vy += 0.1; // normal gravity
            }
            
            particle.life--;
            particle.alpha = Math.max(0, particle.alpha - 0.01);
            return particle.life > 0 && particle.alpha > 0;
        });
    }
    
    updateDefenseSystems() {
        this.defenseSystems.forEach(system => {
            if (system.cooldown > 0) {
                system.cooldown--;
            }
        });
    }
    
    checkCollisions() {
        // Ensure targets exist before checking collisions
        if (!this.targets || Object.keys(this.targets).length === 0) {
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
                this.createExplosion(projectile.x, projectile.y, 30);
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
                // Greatly increased collision area to make hits more reliable
                const expandedCollisionBuffer = 50; // pixels of extra collision area (increased from 30)
                if (!this.launchPlatform.destroyed &&
                    interceptor.x > this.launchPlatform.x - expandedCollisionBuffer &&
                    interceptor.x < this.launchPlatform.x + this.launchPlatform.width + expandedCollisionBuffer &&
                    interceptor.y > this.launchPlatform.y - expandedCollisionBuffer &&
                    interceptor.y < this.launchPlatform.y + this.launchPlatform.height + expandedCollisionBuffer) {
                    
                    this.hitIsraeliBase(interceptor);
                    this.interceptors.splice(iIndex, 1);
                    interceptorHit = true;
                    
                    // Add visual feedback for the hit
                    this.createExplosion(interceptor.x, interceptor.y, 35);
                    continue;
                }
                
                // Additional check: if missile gets close to the bottom of the screen
                // and it was heading toward the Israeli base, count it as a hit
                if (!this.launchPlatform.destroyed && 
                    interceptor.y > this.canvas.height - 100 &&
                    interceptor.x > this.launchPlatform.x - 100 &&
                    interceptor.x < this.launchPlatform.x + this.launchPlatform.width + 100) {
                    
                    this.hitIsraeliBase(interceptor);
                    this.interceptors.splice(iIndex, 1);
                    interceptorHit = true;
                    
                    // Add visual feedback for the hit
                    this.createExplosion(interceptor.x, interceptor.y, 35);
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
                    this.createExplosion(projectile.x, projectile.y, 25);
                    this.interceptors.splice(iIndex, 1);
                    this.projectiles.splice(pIndex, 1);
                    interceptorHit = true;
                }
            }
        }
        
        // Interceptor vs Aircraft collisions - use reverse loops
        for (let iIndex = this.interceptors.length - 1; iIndex >= 0; iIndex--) {
            const interceptor = this.interceptors[iIndex];
            let interceptorHit = false;
            
            for (let aIndex = this.aircrafts.length - 1; aIndex >= 0; aIndex--) {
                if (interceptorHit) break;
                
                const aircraft = this.aircrafts[aIndex];
                const dx = interceptor.x - aircraft.x;
                const dy = interceptor.y - aircraft.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 30) {
                    this.createExplosion(aircraft.x, aircraft.y, 35);
                    this.interceptors.splice(iIndex, 1);
                    this.aircrafts.splice(aIndex, 1);
                    interceptorHit = true;
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
            this.createAtomicExplosion(target.x + target.width/2, target.y + target.height/2);
            
            // Show the Haminai image for 2 seconds when a facility is destroyed
            this.showHaminaiImage();
        } else {
            this.createExplosion(projectile.x, projectile.y, 40);
        }
        
        this.safelyUpdateHUD();
    }
    
    // Function to display the Haminai image when a facility is destroyed
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
    
    createExplosion(x, y, radius) {
        this.explosions.push({
            x: x,
            y: y,
            radius: 5,
            maxRadius: radius,
            expansion: 2,
            life: 30,
            alpha: 1
        });
        
        // Create particles
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30 + Math.random() * 20,
                alpha: 1,
                color: `hsl(${Math.random() * 60}, 100%, 50%)`
            });
        }
    }
    
    createLaunchEffect(sourceX, sourceY) {
        // If no coordinates provided, use launch platform (player missile)
        let x, y;
        if (sourceX === undefined || sourceY === undefined) {
            x = this.launchPlatform.x + this.launchPlatform.width;
            y = this.launchPlatform.y + this.launchPlatform.height / 2;
        } else {
            x = sourceX;
            y = sourceY;
        }
        
        // Determine color based on whether it's Iranian or Israeli
        const isIranian = sourceX !== undefined && sourceY !== undefined;
        const color = isIranian ? 'green' : 'orange';
        const particleCount = isIranian ? 15 : 10; // Iranian launchers have more particles
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - (isIranian ? 0 : 1)) * 3, // Direction depends on side
                vy: (Math.random() - 0.5) * 2,
                life: 20,
                alpha: 1,
                color: color
            });
        }
    }
    
    createAtomicExplosion(x, y) {
        try {
            // Create massive mushroom cloud explosion
            this.explosions.push({
                x: x,
                y: y,
                radius: 10,
                maxRadius: 200,
                expansion: 3,
                life: 120,
                alpha: 1,
                type: 'atomic',
                phase: 'initial', // initial, expanding, mushroom
                mushroomStem: { height: 0, maxHeight: 150 },
                mushroomCap: { radius: 0, maxRadius: 80 }
            });
            
            // Create intense flash
            this.explosions.push({
                x: x,
                y: y,
                radius: 300,
                maxRadius: 400,
                expansion: 10,
                life: 15,
                alpha: 0.9,
                type: 'flash'
            });
            
            // Create shockwave
            this.explosions.push({
                x: x,
                y: y,
                radius: 50,
                maxRadius: 350,
                expansion: 8,
                life: 40,
                alpha: 0.6,
                type: 'shockwave'
            });
            
            // Create massive particle debris
            for (let i = 0; i < 50; i++) { // Reduced particle count to prevent lag
                const angle = Math.random() * Math.PI * 2;
                const speed = 5 + Math.random() * 15;
                this.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - Math.random() * 5,
                    life: 100 + Math.random() * 100,
                    alpha: 1,
                    size: 2 + Math.random() * 4,
                    color: `hsl(${Math.random() * 60}, 100%, ${50 + Math.random() * 30}%)`,
                    type: 'atomic-debris'
                });
            }
            
            // Create rising smoke particles
            for (let i = 0; i < 25; i++) { // Reduced particle count
                this.particles.push({
                    x: x + (Math.random() - 0.5) * 100,
                    y: y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -2 - Math.random() * 3,
                    life: 150 + Math.random() * 100,
                    alpha: 0.8,
                    size: 5 + Math.random() * 10,
                    color: `rgba(${100 + Math.random() * 50}, ${100 + Math.random() * 50}, ${100 + Math.random() * 50}, 0.8)`,
                    type: 'smoke'
                });
            }
            
            // Screen shake effect
            this.screenShake = {
                intensity: 20,
                duration: 60,
                current: 0
            };
        } catch (error) {
            console.error('Error creating atomic explosion:', error);
            // Fallback to regular explosion
            this.createExplosion(x, y, 60);
        }
    }
    
    checkVictoryConditions() {
        // Check if Israeli base is destroyed
        if (this.launchPlatform && this.launchPlatform.destroyed) {
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
    
    endGame(victory = false) {
        console.log(`Ending game with victory=${victory}`);
        this.gameState = 'gameOver';
        
        // Make sure timers are cleared
        if (this.gameTimer) {
            console.log('Clearing game timer');
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        if (this.defenseTimer) {
            console.log('Clearing defense timer');
            clearInterval(this.defenseTimer);
            this.defenseTimer = null;
        }
        
        // Calculate final score
        const timeBonus = victory ? this.timeLeft * 10 : 0;
        const accuracyBonus = this.stats.shotsFired > 0 ? 
            Math.floor((this.stats.hits / this.stats.shotsFired) * 500) : 0;
        
        this.score += timeBonus + accuracyBonus;
        
        // Show the game over screen
        setTimeout(() => {
            this.showGameOverScreen(victory, timeBonus, accuracyBonus);
        }, 100);
    }
    
    showGameOverScreen(victory, timeBonus, accuracyBonus) {
        document.getElementById('gameOverTitle').textContent = 
            victory ? 'Mission Accomplished!' : 'Mission Failed';
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('targetsDestroyed').textContent = 
            `${this.stats.targetsDestroyed}/${Object.keys(this.targets).length}`;
        document.getElementById('accuracy').textContent = 
            this.stats.shotsFired > 0 ? 
            Math.round((this.stats.hits / this.stats.shotsFired) * 100) + '%' : '0%';
        document.getElementById('timeBonus').textContent = timeBonus;
        
        const resultDiv = document.getElementById('missionResult');
        const victoryImageContainer = document.getElementById('victoryImageContainer');
        
        if (victory) {
            resultDiv.textContent = 'All 9 Iranian nuclear facilities neutralized!';
            // Show Sara image when player wins
            victoryImageContainer.classList.remove('hidden');
        } else if (this.launchPlatform && this.launchPlatform.destroyed) {
            resultDiv.textContent = 'Israeli base destroyed by Iranian counterattack!';
            victoryImageContainer.classList.add('hidden');
        } else {
            resultDiv.textContent = 'Mission incomplete. Time expired.';
            victoryImageContainer.classList.add('hidden');
        }
        
        resultDiv.className = `mission-status ${victory ? 'victory' : 'defeat'}`;
        
        this.showScreen('gameOverScreen');
    }
    
    updateHUD() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('timer').textContent = this.timeLeft;
        
        // Update level display
        const levelDisplay = document.getElementById('levelDisplay');
        if (levelDisplay) {
            levelDisplay.textContent = this.currentLevel || 1;
        }
        
        // Update difficulty display
        const difficultyDisplay = document.getElementById('difficultyDisplay');
        if (difficultyDisplay) {
            let difficultyText = 'Tutorial';
            if (this.currentLevel === 1) difficultyText = 'Tutorial';
            else if (this.currentLevel === 2) difficultyText = 'Easy';
            else if (this.currentLevel === 3) difficultyText = 'Moderate';
            else if (this.currentLevel === 4) difficultyText = 'Hard';
            else if (this.currentLevel === 5) difficultyText = 'Very Hard';
            else if (this.currentLevel === 6) difficultyText = 'Expert';
            else difficultyText = 'Master';
            
            difficultyDisplay.textContent = difficultyText;
            
            // Add color coding for difficulty
            difficultyDisplay.className = 'difficulty-' + difficultyText.toLowerCase().replace(' ', '-');
        }
        
        // Update target health bars only for active facilities
        const israeliBaseHealth = document.getElementById('israeliBaseHealth');
        const activeFacilities = this.getActiveFacilities();
        
        // Update health bars for active targets only
        if (activeFacilities) {
            Object.keys(activeFacilities).forEach(targetKey => {
                const target = activeFacilities[targetKey];
                const healthBarId = targetKey + 'Health';
                const healthBar = document.getElementById(healthBarId);
                
                if (target && healthBar) {
                    const healthPercent = (target.health / target.maxHealth) * 100;
                    healthBar.style.width = healthPercent + '%';
                    this.updateHealthBarColor(healthBar, healthPercent);
                    
                    // Show active facility health bars
                    const facilityContainer = healthBar.closest('.facility-health');
                    if (facilityContainer) {
                        facilityContainer.style.display = 'block';
                    }
                }
            });
            
            // Hide inactive facility health bars
            if (this.targets) {
                Object.keys(this.targets).forEach(targetKey => {
                    if (!activeFacilities[targetKey]) {
                        const healthBarId = targetKey + 'Health';
                        const healthBar = document.getElementById(healthBarId);
                        if (healthBar) {
                            const facilityContainer = healthBar.closest('.facility-health');
                            if (facilityContainer) {
                                facilityContainer.style.display = 'none';
                            }
                        }
                    }
                });
            }
        }
        
        // Update Israeli base health
        if (this.launchPlatform && israeliBaseHealth) {
            const israeliPercent = (this.launchPlatform.health / this.launchPlatform.maxHealth) * 100;
            israeliBaseHealth.style.width = israeliPercent + '%';
            this.updateHealthBarColor(israeliBaseHealth, israeliPercent);
        }
        
        // Update weapon select
        this.updateWeaponSelect();
    }
    
    safelyUpdateHUD() {
        try {
            // Only update HUD if game is in playing state
            if (this.gameState === 'playing') {
                this.updateHUD();
            }
        } catch (error) {
            console.warn('Error in safelyUpdateHUD:', error);
        }
    }
    
    updateHealthBarColor(healthBar, percent) {
        healthBar.className = 'health-fill';
        if (percent < 30) {
            healthBar.classList.add('critical');
        } else if (percent < 60) {
            healthBar.classList.add('damaged');
        }
    }
    
    updateWeaponSelect() {
        const select = document.getElementById('weaponType');
        if (!select) return;
        
        select.value = this.currentWeapon;
        
        // Update option text with counts
        Array.from(select.options).forEach(option => {
            const weapon = this.weapons[option.value];
            if (!weapon) return;
            
            const count = weapon.count === Infinity ? '∞' : weapon.count;
            option.textContent = `${weapon.name} (${count})`;
            option.disabled = weapon.count <= 0;
        });
    }
    
    render() {
        // Apply screen shake if active
        if (this.screenShake) {
            const shakeIntensity = this.screenShake.intensity * 
                (1 - this.screenShake.current / this.screenShake.duration);
            const shakeX = (Math.random() - 0.5) * shakeIntensity;
            const shakeY = (Math.random() - 0.5) * shakeIntensity;
            this.ctx.save();
            this.ctx.translate(shakeX, shakeY);
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState === 'playing') {
            this.drawBackground();
            this.drawTerrain();
            this.drawFlags();
            this.drawLaunchPlatform();
            this.drawTargets();
            this.drawDefenseSystems();
            this.drawProjectiles();
            this.drawInterceptors();
            this.drawAircrafts();
            this.drawExplosions();
            this.drawParticles();
            this.drawAimingLine();
            this.drawLevelIndicator(); // Draw the level indicator
        }
        
        if (this.screenShake) {
            this.ctx.restore();
        }
    }
    
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#DEB887');
        gradient.addColorStop(1, '#8B4513');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawTerrain() {
        // Ground
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
        
        // Mountains in background
        this.ctx.fillStyle = '#654321';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 100);
        for (let x = 0; x < this.canvas.width; x += 50) {
            const y = this.canvas.height - 100 - Math.random() * 80;
            this.ctx.lineTo(x, y);
        }
        this.ctx.lineTo(this.canvas.width, this.canvas.height - 100);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawFlags() {
        // Israeli flag (left side)
        this.drawIsraeliFlag(20, 20, 60, 40);
        
        // Iranian flag (right side)
        this.drawIranianFlag(this.canvas.width - 80, 20, 60, 40);
    }
    
    drawIsraeliFlag(x, y, width, height) {
        // White background
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(x, y, width, height);
        
        // Blue stripes
        this.ctx.fillStyle = '#0038b8';
        this.ctx.fillRect(x, y + height * 0.15, width, height * 0.1);
        this.ctx.fillRect(x, y + height * 0.75, width, height * 0.1);
        
        // Star of David (simplified)
        this.ctx.fillStyle = '#0038b8';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('✡', x + width/2, y + height/2 + 6);
        
        // Border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
    }
    
    drawIranianFlag(x, y, width, height) {
        // Green stripe
        this.ctx.fillStyle = '#239f40';
        this.ctx.fillRect(x, y, width, height / 3);
        
        // White stripe
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(x, y + height / 3, width, height / 3);
        
        // Red stripe
        this.ctx.fillStyle = '#da0000';
        this.ctx.fillRect(x, y + (2 * height / 3), width, height / 3);
        
        // Border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
    }
    
    drawLaunchPlatform() {
        const platform = this.launchPlatform;
        
        // Draw unified Israeli military base with integrated aircraft
        this.drawUnifiedIsraeliBase(platform.x, platform.y, platform.width, platform.height);
    }
    
    drawUnifiedIsraeliBase(x, y, width, height) {
        // Main base structure
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(x, y, width, height);
        
        // Aircraft integrated into the base (positioned on top of the base)
        const aircraftX = x + 10; // Slightly offset from left edge
        const aircraftY = y - 15;  // Positioned on top of the base
        
        // Aircraft body (compact F-16 style integrated with base)
        this.ctx.fillStyle = '#4a90e2';
        this.ctx.fillRect(aircraftX, aircraftY, 60, 15);
        
        // Nose cone
        this.ctx.beginPath();
        this.ctx.moveTo(aircraftX + 60, aircraftY + 2);
        this.ctx.lineTo(aircraftX + 75, aircraftY + 7);
        this.ctx.lineTo(aircraftX + 60, aircraftY + 13);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Wings integrated with base
        this.ctx.fillStyle = '#3a7bd5';
        this.ctx.fillRect(aircraftX + 15, aircraftY - 5, 30, 6);  // Top wing
        this.ctx.fillRect(aircraftX + 15, aircraftY + 14, 30, 6);  // Bottom wing
        
        // Tail
        this.ctx.fillRect(aircraftX - 3, aircraftY + 2, 10, 12);
        
        // Cockpit canopy
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(aircraftX + 35, aircraftY + 2, 15, 11);
        
        // Sara Netanyahu portrait in cockpit
        this.drawSaraNetanyahu(aircraftX + 42, aircraftY + 7);
        
        // Israeli Air Force markings on aircraft
        this.ctx.fillStyle = '#0038b8';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('IAF', aircraftX + 30, aircraftY + 25);
        
        // Star of David on wing
        this.ctx.font = '10px Arial';
        this.ctx.fillText('✡', aircraftX + 30, aircraftY - 2);
        
        // Launch tube (part of the base)
        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(x + width - 20, y - 10, 15, 25);
        
        // Base details and outline
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Aircraft outline
        this.ctx.strokeStyle = '#2c5aa0';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(aircraftX, aircraftY, 60, 15);
        
        // Base/aircraft connection details
        this.ctx.fillStyle = '#555';
        this.ctx.fillRect(aircraftX + 20, y - 2, 20, 4); // Connection strut
    }
    
    drawIsraeliAircraft(x, y) {
        // Aircraft body (F-16 style)
        this.ctx.fillStyle = '#4a90e2';
        this.ctx.fillRect(x, y + 20, 80, 20);
        
        // Nose cone
        this.ctx.beginPath();
        this.ctx.moveTo(x + 80, y + 25);
        this.ctx.lineTo(x + 100, y + 30);
        this.ctx.lineTo(x + 80, y + 35);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Wings
        this.ctx.fillStyle = '#3a7bd5';
        this.ctx.fillRect(x + 20, y + 10, 40, 8);  // Top wing
        this.ctx.fillRect(x + 20, y + 42, 40, 8);  // Bottom wing
        
        // Tail
        this.ctx.fillRect(x - 5, y + 15, 15, 20);
        
        // Cockpit canopy
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(x + 50, y + 22, 20, 16);
        
        // Sara Netanyahu detailed portrait based on the provided image
        this.drawSaraNetanyahu(x + 60, y + 30);
        
        // Israeli Air Force markings
        this.ctx.fillStyle = '#0038b8';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('IAF', x + 40, y + 55);
        
        // Star of David on wing
        this.ctx.fillStyle = '#0038b8';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('✡', x + 40, y + 18);
        
        // Aircraft outline
        this.ctx.strokeStyle = '#2c5aa0';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y + 20, 80, 20);
    }
    
    drawSaraNetanyahu(centerX, centerY) {
        // Try to draw the actual image first
        if (this.saraImage && this.saraImage.complete && this.saraImage.naturalWidth > 1) {
            try {
                // Save context for clipping
                this.ctx.save();
                
                // Create circular clipping region for the photo
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
                this.ctx.clip();
                
                // Draw the actual Sara Netanyahu photo
                this.ctx.drawImage(
                    this.saraImage,
                    centerX - 12, centerY - 12, 24, 24
                );
                
                this.ctx.restore();
                
                // Add pilot helmet overlay
                this.ctx.strokeStyle = 'rgba(44, 91, 160, 0.8)';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY - 2, 14, Math.PI, Math.PI * 2);
                this.ctx.stroke();
                
                // Add visor reflection
                this.ctx.fillStyle = 'rgba(135, 206, 235, 0.2)';
                this.ctx.beginPath();
                this.ctx.ellipse(centerX, centerY - 1, 8, 6, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
                return; // Successfully drew image, exit function
            } catch (error) {
                console.warn('Error drawing Sara image, falling back to drawn portrait:', error);
            }
        }
        
        // Fallback to drawn portrait if image fails to load
        // Save context for transformations
        this.ctx.save();
        
        // Face shape (oval)
        this.ctx.fillStyle = '#FDBCB4'; // Skin tone matching the image
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 8, 10, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Hair (blonde, styled) - based on the image
        this.ctx.fillStyle = '#F4E09C'; // Blonde hair color from image
        this.ctx.beginPath();
        // Hair outline - voluminous blonde hair
        this.ctx.ellipse(centerX, centerY - 3, 10, 8, 0, 0, Math.PI);
        this.ctx.fill();
        
        // Hair layers for more realistic look
        this.ctx.fillStyle = '#E6D080'; // Slightly darker blonde for depth
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - 3, centerY - 5, 4, 6, -0.3, 0, Math.PI);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 3, centerY - 5, 4, 6, 0.3, 0, Math.PI);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - 2.5, centerY - 1, 1.5, 1, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 2.5, centerY - 1, 1.5, 1, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eye pupils
        this.ctx.fillStyle = '#4A4A4A';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 2.5, centerY - 1, 0.8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(centerX + 2.5, centerY - 1, 0.8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eyebrows
        this.ctx.strokeStyle = '#D4B975';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 4, centerY - 3);
        this.ctx.lineTo(centerX - 1, centerY - 4);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(centerX + 1, centerY - 4);
        this.ctx.lineTo(centerX + 4, centerY - 3);
        this.ctx.stroke();
        
        // Nose
        this.ctx.strokeStyle = '#E8A899';
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(centerX + 0.5, centerY + 1);
        this.ctx.stroke();
        
        // Mouth - slight smile as in the image
        this.ctx.strokeStyle = '#D4756B';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY + 2, 2, 0.2, Math.PI - 0.2);
        this.ctx.stroke();
        
        // Earrings (she appears to be wearing earrings in the image)
        this.ctx.fillStyle = '#FFD700'; // Gold earrings
        this.ctx.beginPath();
        this.ctx.arc(centerX - 7, centerY + 1, 1, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(centerX + 7, centerY + 1, 1, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Pilot helmet/headset
        this.ctx.strokeStyle = '#2c5aa0';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY - 2, 9, Math.PI, Math.PI * 2);
        this.ctx.stroke();
        
        // Pilot visor reflection
        this.ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY - 1, 6, 4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
        
        // Name tag on uniform
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillRect(centerX - 6, centerY + 8, 12, 3);
        this.ctx.fillStyle = '#000';
        this.ctx.font = '6px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('S. NETANYAHU', centerX, centerY + 10);
    }
    
    drawTargets() {
        // Only draw active facilities based on current level
        const activeFacilities = this.getActiveFacilities();
        
        Object.values(activeFacilities).forEach(target => {
            if (target.destroyed) {
                // Draw destroyed facility with radiation area
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(target.x, target.y + target.height * 0.7, target.width, target.height * 0.3);
                
                // Radiation zone
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
                this.ctx.beginPath();
                this.ctx.arc(target.x + target.width/2, target.y + target.height/2, 100, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Radioactive particles
                for (let i = 0; i < 5; i++) {
                    this.ctx.fillStyle = `rgba(0, 255, 0, ${0.3 + Math.random() * 0.4})`;
                    this.ctx.beginPath();
                    this.ctx.arc(
                        target.x + target.width/2 + (Math.random() - 0.5) * 80,
                        target.y + target.height/2 + (Math.random() - 0.5) * 80,
                        2 + Math.random() * 3,
                        0, Math.PI * 2
                    );
                    this.ctx.fill();
                }
            } else {
                this.drawNuclearFacility(target);
            }
        });
        
        // Draw level indicator
        this.drawLevelIndicator();
    }
    
    drawNuclearFacility(target) {
        // Main reactor building
        this.ctx.fillStyle = '#606060';
        this.ctx.fillRect(target.x, target.y, target.width, target.height);
        
        // Reactor dome
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.beginPath();
        this.ctx.arc(target.x + target.width/2, target.y + 20, target.width/3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Cooling towers
        const towerWidth = target.width / 4;
        for (let i = 0; i < 2; i++) {
            const towerX = target.x + 10 + i * (target.width - towerWidth - 20);
            this.ctx.fillStyle = '#505050';
            this.ctx.fillRect(towerX, target.y - 30, towerWidth, target.height + 30);
            
            // Tower top
            this.ctx.fillStyle = '#404040';
            this.ctx.fillRect(towerX - 2, target.y - 35, towerWidth + 4, 8);
            
            // Steam effect
            this.ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
            for (let j = 0; j < 3; j++) {
                this.ctx.beginPath();
                this.ctx.arc(
                    towerX + towerWidth/2 + (Math.random() - 0.5) * 10,
                    target.y - 40 - j * 15,
                    3 + j * 2,
                    0, Math.PI * 2
                );
                this.ctx.fill();
            }
        }
        
        // Security perimeter
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(target.x - 10, target.y - 10, target.width + 20, target.height + 20);
        this.ctx.setLineDash([]);
        
        // Warning signs
        for (let i = 0; i < 3; i++) {
            const signX = target.x + 15 + i * 20;
            const signY = target.y + target.height - 30;
            
            // Warning triangle
            this.ctx.fillStyle = '#ffff00';
            this.ctx.beginPath();
            this.ctx.moveTo(signX, signY);
            this.ctx.lineTo(signX + 10, signY + 15);
            this.ctx.lineTo(signX - 10, signY + 15);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Radiation symbol
            this.ctx.fillStyle = '#000';
            this.ctx.font = '8px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('☢', signX, signY + 10);
        }
        
        // Facility windows/vents
        this.ctx.fillStyle = '#87CEEB';
        for (let i = 0; i < 4; i++) {
            this.ctx.fillRect(target.x + 10 + i * 15, target.y + 40, 8, 12);
        }
        
        // Iranian flag on facility
        this.drawIranianFlag(target.x + target.width - 35, target.y + 5, 30, 20);
        
        // Nuclear symbol
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('☢', target.x + target.width/2, target.y + target.height - 10);
        
        // Facility name
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(target.name, target.x + target.width/2, target.y - 5);
        
        // Health bar above target
        const barWidth = target.width;
        const barHeight = 6;
        const healthPercent = target.health / target.maxHealth;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(target.x, target.y - 25, barWidth, barHeight);
        
        this.ctx.fillStyle = healthPercent > 0.6 ? '#27ae60' : 
                           healthPercent > 0.3 ? '#f39c12' : '#e74c3c';
        this.ctx.fillRect(target.x, target.y - 25, barWidth * healthPercent, barHeight);
        
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(target.x, target.y - 25, barWidth, barHeight);
    }
    
    drawDefenseSystems() {
        this.defenseSystems.forEach(system => {
            if (!system.active) return;
            
            // Defense radius (when cooling down)
            if (system.cooldown > 0) {
                this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(system.x, system.y, system.radius, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            // Defense installation
            this.ctx.fillStyle = system.cooldown > 0 ? '#ff4444' : '#444';
            this.ctx.beginPath();
            this.ctx.arc(system.x, system.y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = '#222';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
    
    drawProjectiles() {
        this.projectiles.forEach(projectile => {
            // Draw trail
            this.ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            projectile.trail.forEach((point, index) => {
                const alpha = point.life / 30;
                this.ctx.globalAlpha = alpha;
                if (index === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
            
            // Draw projectile
            this.ctx.fillStyle = projectile.type === 'guided' ? '#00ff00' :
                               projectile.type === 'cruise' ? '#ffff00' :
                               projectile.type === 'bomb' ? '#ff8800' : '#ff0000';
            
            this.ctx.beginPath();
            this.ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }
    
    drawInterceptors() {
        this.interceptors.forEach(interceptor => {
            // Set color based on type
            const isIranian = interceptor.type === 'iranian';
            const trailColor = isIranian ? 'rgba(0, 100, 0, 0.7)' : 'rgba(255, 0, 0, 0.6)';
            const missileColor = isIranian ? '#006600' : '#ff0000';
            const trailWidth = isIranian ? 2 : 1;
            const maxLife = isIranian ? 30 : 20;
            
            // Draw trail
            this.ctx.strokeStyle = trailColor;
            this.ctx.lineWidth = trailWidth;
            this.ctx.beginPath();
            interceptor.trail.forEach((point, index) => {
                const alpha = point.life / maxLife;
                this.ctx.globalAlpha = alpha;
                if (index === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
            
            // Draw interceptor
            this.ctx.fillStyle = missileColor;
            this.ctx.beginPath();
            this.ctx.arc(interceptor.x, interceptor.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawAircrafts() {
        this.aircrafts.forEach(aircraft => {
            // Aircraft body
            this.ctx.fillStyle = '#0066cc';
            this.ctx.fillRect(aircraft.x - 15, aircraft.y - 3, 30, 6);
            
            // Wings
            this.ctx.fillRect(aircraft.x - 10, aircraft.y - 8, 20, 3);
            this.ctx.fillRect(aircraft.x - 10, aircraft.y + 5, 20, 3);
            
            // Cockpit
            this.ctx.fillStyle = '#003366';
            this.ctx.fillRect(aircraft.x + 8, aircraft.y - 2, 6, 4);
        });
    }
    
    drawExplosions() {
        this.explosions.forEach(explosion => {
            try {
                if (explosion.type === 'atomic') {
                    this.drawAtomicExplosion(explosion);
                } else if (explosion.type === 'flash') {
                    this.drawFlashExplosion(explosion);
                } else if (explosion.type === 'shockwave') {
                    this.drawShockwave(explosion);
                } else {
                    this.drawRegularExplosion(explosion);
                }
            } catch (error) {
                console.warn('Error drawing explosion:', error);
            }
        });
    }
    
    drawAtomicExplosion(explosion) {
        if (!explosion || !explosion.x || !explosion.y) return;
        
        const { x, y, radius, alpha, phase, mushroomStem, mushroomCap } = explosion;
        
        if (!phase) return;
        
        try {
            if (phase === 'initial') {
                // Initial fireball
                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius || 50);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha || 1})`);
                gradient.addColorStop(0.3, `rgba(255, 255, 0, ${(alpha || 1) * 0.9})`);
                gradient.addColorStop(0.6, `rgba(255, 165, 0, ${(alpha || 1) * 0.7})`);
                gradient.addColorStop(1, `rgba(255, 69, 0, ${(alpha || 1) * 0.3})`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius || 50, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (phase === 'expanding' || phase === 'mushroom') {
                // Mushroom stem
                if (mushroomStem && mushroomStem.height > 0) {
                    const stemGradient = this.ctx.createLinearGradient(x - 30, y, x + 30, y);
                    stemGradient.addColorStop(0, `rgba(100, 100, 100, ${(alpha || 1) * 0.3})`);
                    stemGradient.addColorStop(0.5, `rgba(150, 150, 150, ${(alpha || 1) * 0.8})`);
                    stemGradient.addColorStop(1, `rgba(100, 100, 100, ${(alpha || 1) * 0.3})`);
                    
                    this.ctx.fillStyle = stemGradient;
                    this.ctx.fillRect(x - 30, y - mushroomStem.height, 60, mushroomStem.height);
                }
                
                // Mushroom cap
                if (mushroomCap && mushroomCap.radius > 0) {
                    const stemHeight = mushroomStem ? mushroomStem.height : 0;
                    const capGradient = this.ctx.createRadialGradient(
                        x, y - stemHeight, 0,
                        x, y - stemHeight, mushroomCap.radius
                    );
                    capGradient.addColorStop(0, `rgba(255, 165, 0, ${(alpha || 1) * 0.8})`);
                    capGradient.addColorStop(0.4, `rgba(200, 100, 50, ${(alpha || 1) * 0.6})`);
                    capGradient.addColorStop(0.8, `rgba(150, 150, 150, ${(alpha || 1) * 0.4})`);
                    capGradient.addColorStop(1, `rgba(100, 100, 100, ${(alpha || 1) * 0.2})`);
                    
                    this.ctx.fillStyle = capGradient;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y - stemHeight, mushroomCap.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // Cap underside
                    this.ctx.fillStyle = `rgba(80, 80, 80, ${(alpha || 1) * 0.6})`;
                    this.ctx.beginPath();
                    this.ctx.ellipse(x, y - stemHeight + 10, mushroomCap.radius * 0.8, mushroomCap.radius * 0.3, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                // Base explosion glow
                const baseGradient = this.ctx.createRadialGradient(x, y, 0, x, y, (radius || 50) * 0.7);
                baseGradient.addColorStop(0, `rgba(255, 200, 0, ${(alpha || 1) * 0.8})`);
                baseGradient.addColorStop(0.5, `rgba(255, 100, 0, ${(alpha || 1) * 0.5})`);
                baseGradient.addColorStop(1, `rgba(200, 50, 0, ${(alpha || 1) * 0.2})`);
                
                this.ctx.fillStyle = baseGradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, (radius || 50) * 0.7, 0, Math.PI * 2);
                this.ctx.fill();
            }
        } catch (error) {
            console.warn('Error in drawAtomicExplosion:', error);
        }
    }
    
    drawFlashExplosion(explosion) {
        const gradient = this.ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, explosion.radius
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${explosion.alpha})`);
        gradient.addColorStop(0.3, `rgba(255, 255, 200, ${explosion.alpha * 0.8})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawShockwave(explosion) {
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${explosion.alpha})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Inner shockwave
        this.ctx.strokeStyle = `rgba(255, 200, 0, ${explosion.alpha * 0.7})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius * 0.8, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    drawRegularExplosion(explosion) {
        const gradient = this.ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, explosion.radius
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 0, ${explosion.alpha})`);
        gradient.addColorStop(0.3, `rgba(255, 165, 0, ${explosion.alpha * 0.8})`);
        gradient.addColorStop(0.6, `rgba(255, 69, 0, ${explosion.alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(139, 0, 0, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.alpha;
            
            if (particle.type === 'atomic-debris') {
                // Glowing debris particles
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size || 2
                );
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size || 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (particle.type === 'smoke') {
                // Smoke particles
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size || 5, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // Regular particles
                this.ctx.fillStyle = particle.color || '#ff6600';
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size || 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawAimingLine() {
        if (!this.isAiming) return;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.aimStartX, this.aimStartY);
        this.ctx.lineTo(this.aimEndX, this.aimEndY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw power indicator
        const distance = Math.sqrt(
            Math.pow(this.aimEndX - this.aimStartX, 2) + 
            Math.pow(this.aimEndY - this.aimStartY, 2)
        );
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            `Power: ${Math.min(Math.floor(distance / 3), 100)}%`,
            this.aimEndX,
            this.aimEndY - 10
        );
    }
    
    // Draw level indicator on screen
    drawLevelIndicator() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 60);
        
        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, 200, 60);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText(`LEVEL ${this.currentLevel}`, 20, 30);
        
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Facilities: ${Object.keys(this.getActiveFacilities()).length}/${this.maxLevel}`, 20, 45);
        
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fillText(`Difficulty: ${Math.round(this.difficultyMultiplier * 100)}%`, 20, 60);
        
        this.ctx.restore();
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Mobile detection and responsive setup
OperationRisingLion.prototype.isMobile = function() {
    return window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

OperationRisingLion.prototype.setupResponsiveCanvas = function() {
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
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = `${(viewportHeight - canvasHeight) / 2}px`;
        this.canvas.style.left = `${(viewportWidth - canvasWidth) / 2}px`;
        this.canvas.style.zIndex = '1';
        
        // Position HUD for mobile
        const hud = document.getElementById('hud');
        if (hud) {
            hud.style.position = 'fixed';
            hud.style.top = '10px';
            hud.style.left = '10px';
            hud.style.right = '10px';
            hud.style.zIndex = '10';
            hud.style.background = 'rgba(0,0,0,0.8)';
            hud.style.borderRadius = '8px';
            hud.style.padding = '8px';
            hud.style.fontSize = '14px';
        }
    } else {
        // Desktop setup
        this.canvas.width = 1200;
        this.canvas.height = 700;
        this.canvas.style.width = '1200px';
        this.canvas.style.height = '700px';
        this.canvas.style.position = 'relative';
        this.canvas.style.top = 'auto';
        this.canvas.style.left = 'auto';
        this.canvas.style.zIndex = '1';
        
        // Reset HUD for desktop
        const hud = document.getElementById('hud');
        if (hud) {
            hud.style.position = 'relative';
            hud.style.top = 'auto';
            hud.style.left = 'auto';
            hud.style.right = 'auto';
            hud.style.zIndex = 'auto';
            hud.style.background = 'transparent';
            hud.style.borderRadius = 'none';
            hud.style.padding = '0';
            hud.style.fontSize = 'inherit';
        }
    }
    
    console.log(`Canvas setup for ${this.isMobile() ? 'mobile' : 'desktop'}: logical=${this.canvas.width}x${this.canvas.height}, display=${this.canvas.style.width}x${this.canvas.style.height}`);
};

OperationRisingLion.prototype.handleResize = function() {
    this.setupResponsiveCanvas();
    // Adjust game elements for new size if needed
    if (this.gameState === 'playing') {
        this.safelyUpdateHUD();
    }
};

// Orientation and landscape requirement for mobile
OperationRisingLion.prototype.checkOrientation = function() {
    console.log('checkOrientation called, isMobile:', this.isMobile());
    
    if (!this.isMobile()) return;
    
    const landscapePrompt = document.getElementById('landscapePrompt');
    if (!landscapePrompt) {
        console.log('Landscape prompt element not found!');
        return;
    }
    
    const isPortrait = window.innerHeight > window.innerWidth;
    console.log('isPortrait:', isPortrait, 'dimensions:', window.innerWidth, 'x', window.innerHeight);
    
    if (isPortrait) {
        console.log('Showing landscape prompt');
        // Show landscape prompt and block all game interaction
        landscapePrompt.classList.remove('hidden');
        landscapePrompt.style.display = 'flex'; // Force display
        
        // Disable game canvas interaction
        if (this.canvas) {
            this.canvas.style.pointerEvents = 'none';
        }
        
        // Hide other screens
        document.querySelectorAll('.screen').forEach(screen => {
            if (screen.id !== 'landscapePrompt') {
                screen.classList.add('hidden');
            }
        });
        
        // Pause the game if it's running
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        }
    } else {
        console.log('Hiding landscape prompt');
        // Hide prompt and re-enable game
        landscapePrompt.classList.add('hidden');
        landscapePrompt.style.display = 'none';
        
        // Re-enable game canvas interaction
        if (this.canvas) {
            this.canvas.style.pointerEvents = 'auto';
        }
        
        // Show main menu if no other screen is active
        if (this.gameState === 'menu' || this.gameState === 'paused') {
            this.showScreen('mainMenu');
            if (this.gameState === 'paused') {
                this.gameState = 'playing';
            }
        }
    }
};

// Theme Management Methods
OperationRisingLion.prototype.initializeTheme = function() {
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('risingLionTheme') || 'dark';
    this.applyTheme(savedTheme);
};

OperationRisingLion.prototype.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    
    // Save to localStorage
    localStorage.setItem('risingLionTheme', newTheme);
};

OperationRisingLion.prototype.applyTheme = function(theme) {
    // Apply theme to document
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Update toggle button text
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const themeLabel = themeToggle.querySelector('.theme-label');
        if (themeLabel) {
            themeLabel.textContent = theme === 'light' ? 'Light' : 'Dark';
        }
    }
    
    console.log('Theme applied:', theme);
};
OperationRisingLion.prototype.setupOrientationHandling = function() {
    if (!this.isMobile()) return;
    
    // Check orientation on load and resize
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            this.checkOrientation();
            this.setupResponsiveCanvas();
        }, 100);
    });
    
    window.addEventListener('resize', () => {
        this.checkOrientation();
        this.setupResponsiveCanvas();
    });
    
    // Initial check
    this.checkOrientation();
};

// Progressive difficulty - facility unlock order
OperationRisingLion.prototype.getFacilityUnlockOrder = function() {
    return [
        'natanz',     // Level 1 - Start with Natanz
        'fordow',     // Level 2 - Add Fordow
        'arak',       // Level 3 - Add Arak
        'esfahan',    // Level 4 - Add Esfahan
        'bushehr',    // Level 5 - Add Bushehr
        'tehran',     // Level 6 - Add Tehran Research
        'ardakan'     // Level 7 - Add Ardakan (final level)
    ];
};

// Get active facilities based on current level
OperationRisingLion.prototype.getActiveFacilities = function() {
    const unlockOrder = this.getFacilityUnlockOrder();
    const activeFacilities = {};
    
    // Unlock facilities progressively based on current level
    for (let i = 0; i < Math.min(this.currentLevel, unlockOrder.length); i++) {
        const facilityKey = unlockOrder[i];
        if (this.targets[facilityKey]) {
            activeFacilities[facilityKey] = this.targets[facilityKey];
        }
    }
    
    // Debug logging
    console.log(`Current level: ${this.currentLevel}, Active facilities:`, Object.keys(activeFacilities));
    
    return activeFacilities;
};

// Update difficulty based on level and time
OperationRisingLion.prototype.updateDifficulty = function() {
    // Progressive difficulty scaling based on current level
    console.log(`Updating difficulty for level ${this.currentLevel}`);
    
    if (this.currentLevel === 1) {
        // Level 1: Tutorial mode - No Iranian attacks
        this.iranianOffensive.enabled = false;
        this.iranianOffensive.baseAttackChance = 0.0;
        console.log('Level 1: Tutorial mode - No Iranian attacks');
        
    } else if (this.currentLevel === 2) {
        // Level 2: Easy mode - Very weak attacks
        this.iranianOffensive.enabled = true;
        this.iranianOffensive.baseAttackChance = 0.05; // Very low attack chance
        this.iranianOffensive.accuracy = 0.3;
        this.iranianOffensive.missileSpeed = 2.0;
        this.iranianOffensive.attackFrequency = 6000; // 6 seconds between attack attempts
        console.log('Level 2: Easy mode - Weak Iranian attacks enabled');
        
    } else if (this.currentLevel === 3) {
        // Level 3: Moderate difficulty
        this.iranianOffensive.enabled = true;
        this.iranianOffensive.baseAttackChance = 0.1;
        this.iranianOffensive.accuracy = 0.5;
        this.iranianOffensive.missileSpeed = 3.0;
        this.iranianOffensive.attackFrequency = 4500;
        console.log('Level 3: Moderate difficulty');
        
    } else if (this.currentLevel === 4) {
        // Level 4: Getting harder
        this.iranianOffensive.enabled = true;
        this.iranianOffensive.baseAttackChance = 0.15;
        this.iranianOffensive.accuracy = 0.65;
        this.iranianOffensive.missileSpeed = 3.5;
        this.iranianOffensive.attackFrequency = 3500;
        console.log('Level 4: Increased difficulty');
        
    } else if (this.currentLevel === 5) {
        // Level 5: Hard mode
        this.iranianOffensive.enabled = true;
        this.iranianOffensive.baseAttackChance = 0.2;
        this.iranianOffensive.accuracy = 0.75;
        this.iranianOffensive.missileSpeed = 4.0;
        this.iranianOffensive.attackFrequency = 3000;
        console.log('Level 5: Hard difficulty');
        
    } else if (this.currentLevel === 6) {
        // Level 6: Very hard
        this.iranianOffensive.enabled = true;
        this.iranianOffensive.baseAttackChance = 0.25;
        this.iranianOffensive.accuracy = 0.85;
        this.iranianOffensive.missileSpeed = 4.5;
        this.iranianOffensive.attackFrequency = 2500;
        console.log('Level 6: Very hard difficulty');
        
    } else {
        // Level 7+: Expert mode
        this.iranianOffensive.enabled = true;
        this.iranianOffensive.baseAttackChance = 0.3;
        this.iranianOffensive.accuracy = 0.95;
        this.iranianOffensive.missileSpeed = 5.0;
        this.iranianOffensive.attackFrequency = 2000;
        console.log('Level 7+: Expert difficulty');
    }
    
    // Base difficulty increases with level for defense systems
    this.difficultyMultiplier = 1.0 + (this.currentLevel - 1) * 0.2;
    
    // Speed increases with level and time
    const timeElapsed = 180 - this.timeLeft; // Total time elapsed
    const timeBasedIncrease = timeElapsed / 120; // Slower increase every 2 minutes
    this.speedMultiplier = 1.0 + (this.currentLevel - 1) * 0.15 + timeBasedIncrease * 0.05;
    
    // Apply difficulty to defense systems (more gradually)
    this.defenseSystems.forEach(system => {
        if (system.originalCooldown === undefined) {
            system.originalCooldown = system.maxCooldown;
            system.originalAccuracy = system.accuracy;
        }
        
        // Gradually faster defense systems at higher levels
        system.maxCooldown = Math.max(15, system.originalCooldown / (1 + (this.currentLevel - 1) * 0.1));
        // Gradually more accurate defense systems
        system.accuracy = Math.min(0.9, system.originalAccuracy * (1 + (this.currentLevel - 1) * 0.05));
    });
};

// Check if level should advance
OperationRisingLion.prototype.checkLevelProgression = function() {
    if (this.gameState !== 'playing') return;
    
    const activeFacilities = this.getActiveFacilities();
    const activeCount = Object.keys(activeFacilities).length;
    const destroyedCount = Object.values(activeFacilities).filter(f => f.destroyed).length;
    
    // Debug logging
    console.log(`Level ${this.currentLevel}: ${destroyedCount}/${activeCount} facilities destroyed`);
    console.log('Active facilities:', Object.keys(activeFacilities));
    console.log('Destroyed facilities:', Object.keys(activeFacilities).filter(key => activeFacilities[key].destroyed));
    
    // Level complete when all active facilities are destroyed
    if (destroyedCount === activeCount && this.currentLevel < this.maxLevel) {
        console.log(`Level ${this.currentLevel} complete! Advancing to level ${this.currentLevel + 1}`);
        this.advanceLevel();
    }
};

// Advance to next level
OperationRisingLion.prototype.advanceLevel = function() {
    this.currentLevel++;
    this.levelStartTime = 180 - this.timeLeft;
    
    // Bonus score for completing level
    this.score += 500 * this.currentLevel;
    
    // Show level advance notification
    this.showLevelAdvanceNotification();
    
    // Update difficulty
    this.updateDifficulty();
    
    // Add time bonus for higher levels
    this.timeLeft += Math.min(30, 10 + this.currentLevel * 2);
    
    console.log(`Advanced to level ${this.currentLevel}`);
};

// Show level advancement notification
OperationRisingLion.prototype.showLevelAdvanceNotification = function() {
    // Determine difficulty level text and description
    let difficultyInfo = {};
    if (this.currentLevel === 1) {
        difficultyInfo = {
            name: 'Tutorial',
            description: 'Learn the basics - No Iranian counterattacks'
        };
    } else if (this.currentLevel === 2) {
        difficultyInfo = {
            name: 'Easy',
            description: 'Iranian forces begin weak counterattacks'
        };
    } else if (this.currentLevel === 3) {
        difficultyInfo = {
            name: 'Moderate',
            description: 'Increased missile accuracy and frequency'
        };
    } else if (this.currentLevel === 4) {
        difficultyInfo = {
            name: 'Hard',
            description: 'Faster missiles and better targeting'
        };
    } else if (this.currentLevel === 5) {
        difficultyInfo = {
            name: 'Very Hard',
            description: 'Frequent accurate missile salvos'
        };
    } else if (this.currentLevel === 6) {
        difficultyInfo = {
            name: 'Expert',
            description: 'Elite Iranian defense systems activated'
        };
    } else {
        difficultyInfo = {
            name: 'Master',
            description: 'Maximum Iranian resistance - Stay alert!'
        };
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'level-notification';
    notification.innerHTML = `
        <h2>LEVEL ${this.currentLevel} - ${difficultyInfo.name.toUpperCase()}</h2>
        <p>New target facility activated!</p>
        <p class="difficulty-description">${difficultyInfo.description}</p>
        <p class="bonus-points">+${500 * this.currentLevel} Bonus Points</p>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 2.5 seconds (shorter since it's less intrusive)
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 2500);
};

// Implement Sara Netanyahu image loading with proper fallback
OperationRisingLion.prototype.loadSaraImage = function() {
    console.log('Loading Sara Netanyahu image...');
    try {
        // Create a new image object
        this.saraImage = new Image();
        
        // Set up success handler
        this.saraImage.onload = () => {
            console.log('Sara Netanyahu image loaded successfully');
        };
        
        // Set up error handler with fallback
        this.saraImage.onerror = (error) => {
            console.warn('Failed to load Sara Netanyahu image, will use drawn portrait fallback', error);
            // Keep saraImage as null to trigger fallback
            this.saraImage = null;
        };            // Base64 string for the Sara Netanyahu photo
            // Replace this with your actual base64 string generated from image-converter.html
            // Example: const base64String = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBD...";
            const base64String = ""; // Empty for now, user needs to add their own image
        
        // Only attempt to load if there's actually a base64 string
        if (base64String && base64String.length > 0) {
            this.saraImage.src = base64String.startsWith('data:image') ? 
                base64String : 'data:image/jpeg;base64,' + base64String;
        } else {
            console.log('No base64 string provided for Sara Netanyahu image, using fallback');
            this.saraImage = null;
        }
    } catch (error) {
        console.error('Error in loadSaraImage:', error);
        this.saraImage = null;
    }
};

// Implement Haminai image loading for facility destruction
OperationRisingLion.prototype.loadHaminaiImage = function() {
    console.log('Loading Haminai image...');
    try {
        // Create a new image object
        this.haminaiImage = new Image();
        
        // Set up success handler
        this.haminaiImage.onload = () => {
            console.log('Haminai image loaded successfully');
        };
        
        // Set up error handler
        this.haminaiImage.onerror = (error) => {
            console.warn('Failed to load Haminai image', error);
            this.haminaiImage = null;
        };
        
        // Set the source of the image
        this.haminaiImage.src = 'images/haminai.png';
    } catch (error) {
        console.error('Error in loadHaminaiImage:', error);
        this.haminaiImage = null;
    }
};

// Initialize game when page loads
function initGame() {
    console.log('Initializing game...');
    try {
        window.game = new OperationRisingLion();
        
        // Perform a validation check on critical game objects
        if (!window.game.targets || Object.keys(window.game.targets).length === 0) {
            console.warn('Game targets not properly initialized, attempting to fix...');
            window.game.targets = {
                natanz: {
                    x: 950,
                    y: 400,
                    width: 80,
                    height: 120,
                    health: 100,
                    maxHealth: 100,
                    destroyed: false,
                    name: 'Natanz Facility'
                },
                fordow: {
                    x: 1050,
                    y: 350,
                    width: 60,
                    height: 100,
                    health: 100,
                    maxHealth: 100,
                    destroyed: false,
                    name: 'Fordow Complex'
                },
                arak: {
                    x: 850,
                    y: 430,
                    width: 70,
                    height: 110,
                    health: 100,
                    maxHealth: 100,
                    destroyed: false,
                    name: 'Arak (IR-40) Reactor'
                },
                esfahan: {
                    x: 1000,
                    y: 250,
                    width: 65,
                    height: 90,
                    health: 100,
                    maxHealth: 100,
                    destroyed: false,
                    name: 'Esfahan (Isfahan) Facility'
                },
                bushehr: {
                    x: 1150,
                    y: 380,
                    width: 90,
                    height: 130,
                    health: 100,
                    maxHealth: 100,
                    destroyed: false,
                    name: 'Bushehr Nuclear Power Plant'
                },
                tehran: {
                    x: 900,
                    y: 280,
                    width: 55,
                    height: 85,
                    health: 100,
                    maxHealth: 100,
                    destroyed: false,
                    name: 'Tehran Research Reactor'
                }
            };
        }
        
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

// Check if the DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM is already loaded, initialize immediately
    initGame();
}

// Additional safety check - attach click handler directly to the button after a delay
setTimeout(() => {
    console.log('Running final safety check for start button...');
    const startBtn = document.getElementById('startGame');
    if (startBtn) {
        console.log('Start button found in safety check, ensuring it has a click handler');
        startBtn.onclick = function(event) {
            console.log('Start button clicked via direct onclick handler');
            if (window.game) {
                window.game.startGame();
            }
        };
    }
}, 500); // Give everything time to initialize

// Debug function to test if buttons work
window.testStartButton = function() {
    console.log('Testing start button...');
    const btn = document.getElementById('startGame');
    if (btn) {
        console.log('Start button found, triggering click...');
        btn.click();
    } else {
        console.error('Start button not found!');
    }
};

// Alternative way to start game if button fails
window.forceStartGame = function() {
    console.log('Force starting game...');
    if (window.game) {
        window.game.startGame();
    } else {
        console.error('Game instance not found!');
    }
};

// Handle Iranian missiles hitting the Israeli base
OperationRisingLion.prototype.hitIsraeliBase = function(missile) {
    if (!this.launchPlatform || this.launchPlatform.destroyed) return;
    
    // Apply increased damage to the Israeli base
    const damage = missile.damage || 20; // Increased base damage from 10 to 20
    this.launchPlatform.health -= damage;
    
    // Update the score to reflect damage taken
    this.score = Math.max(0, this.score - Math.floor(damage * 5)); // Reduce score on hit
    
    // Create a missile impact explosion with green fire
    const fireX = this.launchPlatform.x + this.launchPlatform.width/2;
    const fireY = this.launchPlatform.y;
    
    // Create green fire particles
    for (let i = 0; i < 20; i++) {
        this.particles.push({
            x: fireX + (Math.random() - 0.5) * 40,
            y: fireY + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 3,
            vy: -1 - Math.random() * 3,
            life: 60 + Math.random() * 40,
            alpha: 0.8,
            size: 5 + Math.random() * 10,
            color: `rgba(0, ${120 + Math.random() * 135}, 0, 0.8)`, // Green fire
            type: 'fire'
        });
    }
    
    // Create regular explosion
    this.createExplosion(fireX, fireY, 50);
    
    // Add stronger screen shake
    this.screenShake = {
        intensity: 15,
        duration: 40,
        current: 0
    };
    
    // Check if the base is destroyed
    if (this.launchPlatform.health <= 0) {
        this.launchPlatform.health = 0;
        this.launchPlatform.destroyed = true;
        
        // Create a large explosion for base destruction
        this.createExplosion(
            this.launchPlatform.x + this.launchPlatform.width/2,
            this.launchPlatform.y,
            60
        );
        
        // End game with defeat
        this.endGame(false);
    }
    
    // Update HUD
    this.safelyUpdateHUD();
};

// Orientation and landscape requirement for mobile
OperationRisingLion.prototype.checkOrientation = function() {
    console.log('checkOrientation called, isMobile:', this.isMobile());
    
    if (!this.isMobile()) return;
    
    const landscapePrompt = document.getElementById('landscapePrompt');
    if (!landscapePrompt) {
        console.log('Landscape prompt element not found!');
        return;
    }
    
    const isPortrait = window.innerHeight > window.innerWidth;
    console.log('isPortrait:', isPortrait, 'dimensions:', window.innerWidth, 'x', window.innerHeight);
    
    if (isPortrait) {
        console.log('Showing landscape prompt');
        // Show landscape prompt and block all game interaction
        landscapePrompt.classList.remove('hidden');
        landscapePrompt.style.display = 'flex'; // Force display
        
        // Disable game canvas interaction
        if (this.canvas) {
            this.canvas.style.pointerEvents = 'none';
        }
        
        // Hide other screens
        document.querySelectorAll('.screen').forEach(screen => {
            if (screen.id !== 'landscapePrompt') {
                screen.classList.add('hidden');
            }
        });
        
        // Pause the game if it's running
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        }
    } else {
        console.log('Hiding landscape prompt');
        // Hide prompt and re-enable game
        landscapePrompt.classList.add('hidden');
        landscapePrompt.style.display = 'none';
        
        // Re-enable game canvas interaction
        if (this.canvas) {
            this.canvas.style.pointerEvents = 'auto';
        }
        
        // Show main menu if no other screen is active
        if (this.gameState === 'menu' || this.gameState === 'paused') {
            this.showScreen('mainMenu');
            if (this.gameState === 'paused') {
                this.gameState = 'playing';
            }
        }
    }
};

OperationRisingLion.prototype.setupOrientationHandling = function() {
    if (!this.isMobile()) return;
    
    // Check orientation on load and resize
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            this.checkOrientation();
            this.setupResponsiveCanvas();
        }, 100);
    });
    
    window.addEventListener('resize', () => {
        this.checkOrientation();
        this.setupResponsiveCanvas();
    });
    
    // Initial check
    this.checkOrientation();
};

// Debug function for mobile touch events
OperationRisingLion.prototype.debugTouch = function(message, coords) {
    if (this.isMobile() && console && console.log) {
        console.log(`Touch Debug: ${message}`, coords);
    }
};
