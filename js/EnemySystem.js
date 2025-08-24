class EnemySystem {
    constructor() {
        // Iranian offensive capabilities - increased speed and accuracy (matches original)
        this.iranianOffensive = {
            attackCooldown: 0,
            missileSpeed: 5.5,     // Significantly faster (was 3)
            accuracy: 0.95,        // Much more accurate (was 0.85)
            attackFrequency: 2000, // More frequent attacks (was 3000ms)
            baseAttackChance: 0.25 // Base chance of attack per cycle
        };
        
        // Defense systems - increased number and improved capabilities (matches original)
        this.defenseSystems = [
            { x: 800, y: 450, radius: 200, active: true, cooldown: 0, name: 'Northern Defense Grid' },
            { x: 1000, y: 300, radius: 180, active: true, cooldown: 0, name: 'Eastern Defense System' },
            { x: 900, y: 500, radius: 160, active: true, cooldown: 0, name: 'Southern Interceptor Base' },
            { x: 1100, y: 400, radius: 170, active: true, cooldown: 0, name: 'Central Command' },
            { x: 850, y: 350, radius: 150, active: true, cooldown: 0, name: 'Western Outpost' }
        ];
    }
    
    reset() {
        this.iranianOffensive.attackCooldown = 0;
        this.defenseSystems.forEach(system => {
            system.active = true;
            system.cooldown = 0;
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
}
