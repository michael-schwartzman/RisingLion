class EnemySystem {
    constructor() {
        // Iranian offensive capabilities - increased speed and accuracy (matches original)
        this.iranianOffensive = {
            attackCooldown: 0,
            missileSpeed: 5.5,     // Significantly faster (was 3)
            accuracy: 0.95,        // Much more accurate (was 0.85)
            attackFrequency: 2000, // More frequent attacks (was 3000ms)
            baseAttackChance: 0.25, // Base chance of attack per cycle
            salvoMode: false,      // Can launch multiple missiles at once
            salvoSize: 1,          // Number of missiles in a salvo
            adaptiveAI: true       // Learns from player behavior
        };
        
        // Advanced AI tracking
        this.aiTracking = {
            playerFireRate: 0,
            playerAccuracy: 0,
            lastPlayerTargets: [],
            threatLevel: 1,        // Escalates based on Israeli success
            adaptationTimer: 0
        };
        
        // Defense systems - adjusted for 700px height
        this.defenseSystems = [
            { x: 800, y: 550, radius: 200, active: true, cooldown: 0, name: 'Northern Defense Grid', missiles: 10 },
            { x: 1000, y: 400, radius: 180, active: true, cooldown: 0, name: 'Eastern Defense System', missiles: 8 },
            { x: 900, y: 600, radius: 160, active: true, cooldown: 0, name: 'Southern Interceptor Base', missiles: 6 },
            { x: 1100, y: 500, radius: 170, active: true, cooldown: 0, name: 'Central Command', missiles: 12 },
            { x: 850, y: 450, radius: 150, active: true, cooldown: 0, name: 'Western Outpost', missiles: 5 }
        ];
    }
    
    reset() {
        this.iranianOffensive.attackCooldown = 0;
        this.iranianOffensive.salvoSize = 1;
        this.aiTracking = {
            playerFireRate: 0,
            playerAccuracy: 0,
            lastPlayerTargets: [],
            threatLevel: 1,
            adaptationTimer: 0
        };
        this.defenseSystems.forEach(system => {
            system.active = true;
            system.cooldown = 0;
            system.missiles = system.name === 'Central Command' ? 12 : 
                            system.name === 'Northern Defense Grid' ? 10 :
                            system.name === 'Eastern Defense System' ? 8 : 6;
        });
    }
    
    update(interceptors, projectiles) {
        this.updateDefenseSystems();
        this.updateInterceptors(interceptors);
        this.updateIranianOffensive();
        
        // Check if we should launch interceptors
        if (this.shouldLaunchInterceptor(projectiles)) {
            const targetProjectile = this.findTargetProjectile(projectiles);
            if (targetProjectile) {
                const interceptor = this.launchInterceptor(targetProjectile.x, targetProjectile.y);
                if (interceptor) {
                    interceptors.push(interceptor);
                }
            }
        }
    }
    
    updateDefenseSystems() {
        this.defenseSystems.forEach(system => {
            if (system.cooldown > 0) {
                system.cooldown--;
            }
        });
    }
    
    updateIranianOffensive() {
        // Reduce attack cooldown
        if (this.iranianOffensive.attackCooldown > 0) {
            this.iranianOffensive.attackCooldown--;
        }
    }

    shouldLaunchOffensiveAttack() {
        // Check if enough time has passed since last attack
        if (this.iranianOffensive.attackCooldown > 0) return false;
        
        // Random chance to attack based on frequency and difficulty
        return Math.random() < this.iranianOffensive.baseAttackChance;
    }

    launchOffensiveAttack(israeliBase, interceptors) {
        if (!this.shouldLaunchOffensiveAttack()) return;
        
        // Find an active defense system with missiles
        const activeSystems = this.defenseSystems.filter(system => 
            system.active && system.cooldown === 0 && system.missiles > 0);
        if (activeSystems.length === 0) return;
        
        // Choose system based on strategic value (prefer closer, better equipped systems)
        const launchSystem = this.chooseBestLaunchSystem(activeSystems, israeliBase);
        
        // Launch salvo of missiles
        const salvoSize = Math.min(this.iranianOffensive.salvoSize, launchSystem.missiles);
        
        for (let i = 0; i < salvoSize; i++) {
            // Calculate predictive targeting
            const targetPoint = this.calculatePredictiveTarget(israeliBase);
            
            // Add spread for multiple missiles
            const spreadX = (Math.random() - 0.5) * 20 * i;
            const spreadY = (Math.random() - 0.5) * 20 * i;
            
            const finalTargetX = targetPoint.x + spreadX;
            const finalTargetY = targetPoint.y + spreadY;
            
            const dx = finalTargetX - launchSystem.x;
            const dy = finalTargetY - launchSystem.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = this.iranianOffensive.missileSpeed;
            
            // Create Iranian offensive missile
            const iranianMissile = {
                x: launchSystem.x,
                y: launchSystem.y,
                vx: (dx / distance) * speed,
                vy: (dy / distance) * speed,
                life: 240, // Longer life for offensive missiles
                type: 'iranian', // Mark as Iranian missile
                trail: [],
                fromSystem: launchSystem,
                target: 'israeli-base',
                damage: 20, // Significant damage
                isOffensive: true
            };
            
            interceptors.push(iranianMissile);
            launchSystem.missiles--;
        }
        
        // Set cooldown and attack cooldown
        launchSystem.cooldown = 60; // 1 second cooldown
        this.iranianOffensive.attackCooldown = this.iranianOffensive.attackFrequency;
        
        console.log(`Iran launched ${salvoSize} missile salvo from ${launchSystem.name}`);
    }
    
    chooseBestLaunchSystem(activeSystems, israeliBase) {
        // Score systems based on distance, missile count, and strategic value
        return activeSystems.reduce((best, current) => {
            const distToCurrent = Math.sqrt(
                Math.pow(current.x - israeliBase.x, 2) + 
                Math.pow(current.y - israeliBase.y, 2)
            );
            const distToBest = Math.sqrt(
                Math.pow(best.x - israeliBase.x, 2) + 
                Math.pow(best.y - israeliBase.y, 2)
            );
            
            // Prefer systems that are closer and have more missiles
            const currentScore = (1000 - distToCurrent) + current.missiles * 10;
            const bestScore = (1000 - distToBest) + best.missiles * 10;
            
            return currentScore > bestScore ? current : best;
        });
    }
    
    calculatePredictiveTarget(israeliBase) {
        // Basic predictive targeting - aim for center of base with slight lead
        const baseSpeed = 0; // Israeli base doesn't move, but we can add spread
        const accuracyVariation = (1 - this.iranianOffensive.accuracy) * 100;
        
        return {
            x: israeliBase.x + israeliBase.width/2 + (Math.random() - 0.5) * accuracyVariation,
            y: israeliBase.y + israeliBase.height/2 + (Math.random() - 0.5) * accuracyVariation
        };
    }

    updateInterceptors(interceptors) {
        for (let i = interceptors.length - 1; i >= 0; i--) {
            const interceptor = interceptors[i];
            
            interceptor.x += interceptor.vx;
            interceptor.y += interceptor.vy;
            interceptor.life--;
            
            if (interceptor.life <= 0 || interceptor.x < 0 || interceptor.y > 600) {
                interceptors.splice(i, 1);
            }
        }
    }
    
    updateIranianOffensive() {
        // Reduce attack cooldown
        if (this.iranianOffensive.attackCooldown > 0) {
            this.iranianOffensive.attackCooldown--;
        }
    }
    
    shouldLaunchInterceptor(projectiles) {
        if (this.iranianOffensive.attackCooldown > 0) return false;
        
        // Check if any projectiles are in range of defense systems
        for (const projectile of projectiles) {
            for (const system of this.defenseSystems) {
                if (!system.active || system.cooldown > 0) continue;
                
                const dx = projectile.x - system.x;
                const dy = projectile.y - system.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < system.radius) {
                    return Math.random() < 0.1; // 10% chance per frame when in range
                }
            }
        }
        
        return false;
    }
    
    findTargetProjectile(projectiles) {
        // Find the closest projectile to any defense system
        let closestProjectile = null;
        let closestDistance = Infinity;
        
        for (const projectile of projectiles) {
            for (const system of this.defenseSystems) {
                if (!system.active || system.cooldown > 0) continue;
                
                const dx = projectile.x - system.x;
                const dy = projectile.y - system.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < system.radius && distance < closestDistance) {
                    closestDistance = distance;
                    closestProjectile = projectile;
                }
            }
        }
        
        return closestProjectile;
    }
    
    launchInterceptor(targetX, targetY) {
        // Find closest active defense system
        let closestSystem = null;
        let closestDistance = Infinity;
        
        for (const system of this.defenseSystems) {
            if (!system.active || system.cooldown > 0) continue;
            
            const dx = targetX - system.x;
            const dy = targetY - system.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance && distance < system.radius) {
                closestDistance = distance;
                closestSystem = system;
            }
        }
        
        if (!closestSystem) return null;
        
        closestSystem.cooldown = 60; // 1 second cooldown at 60 FPS
        this.iranianOffensive.attackCooldown = 30; // Global cooldown
        
        const dx = targetX - closestSystem.x;
        const dy = targetY - closestSystem.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = this.iranianOffensive.missileSpeed;
        
        return {
            x: closestSystem.x,
            y: closestSystem.y,
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            life: 120,
            fromSystem: closestSystem
        };
    }
    
    updateAITracking(playerStats, recentTargets) {
        this.aiTracking.adaptationTimer++;
        
        // Update threat level based on Israeli success
        const playerSuccessRate = playerStats.hits / Math.max(1, playerStats.shotsFired);
        if (playerSuccessRate > 0.7) {
            this.aiTracking.threatLevel = Math.min(5, this.aiTracking.threatLevel + 0.1);
        }
        
        // Track player targeting patterns
        if (recentTargets.length > 0) {
            this.aiTracking.lastPlayerTargets = recentTargets.slice(-5);
        }
        
        // Adapt Iranian response based on threat level
        if (this.aiTracking.adaptationTimer % 300 === 0) { // Every 5 seconds
            this.adaptIranianStrategy();
        }
    }
    
    adaptIranianStrategy() {
        const threatLevel = this.aiTracking.threatLevel;
        
        // Increase aggression based on threat
        this.iranianOffensive.baseAttackChance = Math.min(0.5, 0.15 + threatLevel * 0.05);
        this.iranianOffensive.salvoSize = Math.floor(1 + threatLevel / 2);
        
        // Improve accuracy and speed
        this.iranianOffensive.accuracy = Math.min(0.98, 0.85 + threatLevel * 0.025);
        this.iranianOffensive.missileSpeed = 4.5 + threatLevel * 0.3;
        
        console.log(`Iranian AI adapted - Threat Level: ${threatLevel}, Salvo Size: ${this.iranianOffensive.salvoSize}`);
    }
}
