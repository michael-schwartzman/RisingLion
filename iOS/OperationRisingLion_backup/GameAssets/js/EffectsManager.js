class EffectsManager {
    constructor() {
        this.explosionTypes = {
            regular: 'regular',
            atomic: 'atomic',
            flash: 'flash',
            shockwave: 'shockwave'
        };
        
        // Warning system for incoming missiles
        this.warningSystem = {
            active: false,
            duration: 0,
            maxDuration: 180, // 3 seconds at 60fps
            flashInterval: 10
        };
    }
    
    createExplosion(explosionsArray, x, y, radius, type = 'regular') {
        const explosion = {
            x: x,
            y: y,
            radius: radius,
            maxRadius: radius,
            life: 60,
            maxLife: 60,
            type: type,
            particles: []
        };
        
        // Create particles for the explosion
        for (let i = 0; i < 20; i++) {
            explosion.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30 + Math.random() * 30,
                color: `hsl(${Math.random() * 60 + 10}, 100%, 50%)`
            });
        }
        
        explosionsArray.push(explosion);
        return explosion;
    }
    
    createAtomicExplosion(explosionsArray, x, y) {
        const explosion = this.createExplosion(explosionsArray, x, y, 150, 'atomic');
        explosion.life = 240; // 4 seconds
        explosion.maxLife = 240;
        explosion.mushroomCloud = true;
        explosion.shockwaveRadius = 0;
        explosion.maxShockwaveRadius = 300;
        
        // Create mushroom cloud effect
        explosion.mushroomStem = {
            height: 0,
            maxHeight: 200,
            width: 20
        };
        
        explosion.mushroomCap = {
            radius: 0,
            maxRadius: 80,
            y: y - 200
        };
        
        // Create more dramatic particle effects
        for (let i = 0; i < 100; i++) {
            explosion.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 30,
                vy: (Math.random() - 0.5) * 30,
                life: 120 + Math.random() * 120,
                color: `hsl(${Math.random() * 60 + 10}, 100%, ${50 + Math.random() * 30}%)`,
                size: Math.random() * 6 + 2,
                type: 'atomic'
            });
        }
        
        // Create debris particles
        for (let i = 0; i < 50; i++) {
            explosion.particles.push({
                x: x + (Math.random() - 0.5) * 100,
                y: y + (Math.random() - 0.5) * 100,
                vx: (Math.random() - 0.5) * 15,
                vy: -Math.random() * 20 - 5,
                life: 180 + Math.random() * 120,
                color: '#8B4513',
                size: Math.random() * 4 + 1,
                type: 'debris',
                gravity: 0.3
            });
        }
        
        return explosion;
    }
    
    createLaunchEffect(sourceX, sourceY) {
        const particles = [];
        
        for (let i = 0; i < 15; i++) {
            particles.push({
                x: sourceX + (Math.random() - 0.5) * 20,
                y: sourceY + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 1,
                life: 20 + Math.random() * 20,
                color: `hsl(${Math.random() * 60 + 10}, 90%, 60%)`,
                size: Math.random() * 3 + 1
            });
        }
        
        return particles;
    }
    
    createMissileTrail(missile) {
        // Add trail point to missile
        if (!missile.trail) missile.trail = [];
        
        missile.trail.push({
            x: missile.x,
            y: missile.y,
            life: 30,
            opacity: 1.0
        });
        
        // Limit trail length
        if (missile.trail.length > 15) {
            missile.trail.shift();
        }
        
        // Update trail point lifetimes
        missile.trail.forEach(point => {
            point.life--;
            point.opacity = point.life / 30;
        });
        
        // Remove dead trail points
        missile.trail = missile.trail.filter(point => point.life > 0);
    }
    
    createLaunchSmoke(sourceX, sourceY) {
        const smokeParticles = [];
        
        for (let i = 0; i < 25; i++) {
            smokeParticles.push({
                x: sourceX + (Math.random() - 0.5) * 30,
                y: sourceY + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 4 - 1,
                life: 60 + Math.random() * 40,
                maxLife: 100,
                color: `rgba(100, 100, 100, ${0.8 - Math.random() * 0.3})`,
                size: Math.random() * 8 + 3,
                type: 'smoke'
            });
        }
        
        return smokeParticles;
    }
    
    activateIncomingMissileWarning() {
        this.warningSystem.active = true;
        this.warningSystem.duration = this.warningSystem.maxDuration;
    }
    
    updateWarningSystem() {
        if (this.warningSystem.active) {
            this.warningSystem.duration--;
            if (this.warningSystem.duration <= 0) {
                this.warningSystem.active = false;
            }
        }
    }
    
    update(explosions, particles) {
        this.updateWarningSystem();
        
        // Update explosions
        for (let i = explosions.length - 1; i >= 0; i--) {
            const explosion = explosions[i];
            explosion.life--;
            
            // Update shockwave for atomic explosions
            if (explosion.type === 'atomic' && explosion.shockwaveRadius < explosion.maxShockwaveRadius) {
                explosion.shockwaveRadius += 5;
            }
            
            // Update mushroom cloud for atomic explosions
            if (explosion.mushroomCloud) {
                const progress = 1 - (explosion.life / explosion.maxLife);
                
                // Grow mushroom stem
                if (progress < 0.5) {
                    explosion.mushroomStem.height = progress * 2 * explosion.mushroomStem.maxHeight;
                }
                
                // Grow mushroom cap
                if (progress > 0.3) {
                    const capProgress = (progress - 0.3) / 0.7;
                    explosion.mushroomCap.radius = capProgress * explosion.mushroomCap.maxRadius;
                }
            }
            
            // Update explosion particles
            for (let j = explosion.particles.length - 1; j >= 0; j--) {
                const particle = explosion.particles[j];
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life--;
                
                // Apply gravity to debris particles
                if (particle.type === 'debris' && particle.gravity) {
                    particle.vy += particle.gravity;
                }
                
                // Fade out particles
                if (particle.life <= 30) {
                    particle.opacity = particle.life / 30;
                }
                
                if (particle.life <= 0) {
                    explosion.particles.splice(j, 1);
                }
            }
            
            if (explosion.life <= 0) {
                explosions.splice(i, 1);
            }
        }
        
        // Update standalone particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                particles.splice(i, 1);
            }
        }
    }
}
