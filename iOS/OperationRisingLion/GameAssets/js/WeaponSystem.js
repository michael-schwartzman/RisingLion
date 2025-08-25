class WeaponSystem {
    constructor() {
        // Weapons inventory - matches original structure
        this.weapons = {
            missile: { count: Infinity, name: 'Missile' },
            guided: { count: 5, name: 'Guided Missile' },
            aircraft: { count: 3, name: 'Aircraft' },
            cruise: { count: 2, name: 'Cruise Missile' }
        };
        
        // Launch platform (Israeli side) - adjusted for 700px height
        this.launchPlatform = {
            x: 50,
            y: 600,  // Moved down to match new terrain
            width: 100,
            height: 40,
            health: 100,         // Adding health to Israeli platform
            maxHealth: 100,
            destroyed: false,
            name: 'Israeli Base'
        };
    }
    
    reset() {
        // Weapons inventory - matches original structure
        this.weapons = {
            missile: { count: Infinity, name: 'Missile' },
            guided: { count: 5, name: 'Guided Missile' },
            aircraft: { count: 3, name: 'Aircraft' },
            cruise: { count: 2, name: 'Cruise Missile' }
        };
        
        this.launchPlatform.health = 100;
        this.launchPlatform.destroyed = false;
    }
    
    canFire(currentWeapon) {
        return this.weapons[currentWeapon].count > 0 && !this.launchPlatform.destroyed;
    }
    
    fireWeapon(startX, startY, endX, endY, currentWeapon, effectsManager, particles) {
        if (!this.canFire(currentWeapon)) return null;
        
        const weapon = this.weapons[currentWeapon];
        if (weapon.count !== Infinity) {
            weapon.count--;
        }
        
        // Create launch smoke effect
        if (effectsManager && particles) {
            const smokeParticles = effectsManager.createLaunchSmoke(startX, startY);
            particles.push(...smokeParticles);
        }
        
        const projectile = this.createProjectile(startX, startY, endX, endY, currentWeapon);
        return projectile;
    }
    
    createProjectile(startX, startY, endX, endY, type) {
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = this.getWeaponSpeed(type);
        
        return {
            x: startX,
            y: startY,
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            type: type,
            trail: [],
            targetX: endX,
            targetY: endY,
            life: 1000,
            damage: this.getWeaponDamage(type)
        };
    }
    
    getWeaponSpeed(type) {
        const speeds = {
            missile: 8,
            guided: 6,
            aircraft: 4,
            cruise: 10
        };
        return speeds[type] || 8;
    }
    
    getWeaponDamage(type) {
        const damages = {
            missile: 25,
            guided: 35,
            aircraft: 20,
            cruise: 50
        };
        return damages[type] || 25;
    }
    
    update(projectiles) {
        // Update projectile physics and behavior
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];
            
            projectile.x += projectile.vx;
            projectile.y += projectile.vy;
            projectile.life--;
            
            // Add trail effect
            projectile.trail.push({ x: projectile.x, y: projectile.y });
            if (projectile.trail.length > 10) {
                projectile.trail.shift();
            }
            
            // Remove if out of bounds or life expired
            if (projectile.life <= 0 || projectile.x < 0 || projectile.x > 1200 || projectile.y < 0 || projectile.y > 600) {
                projectiles.splice(i, 1);
            }
        }
    }
}
