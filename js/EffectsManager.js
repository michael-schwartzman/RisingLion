class EffectsManager {
    constructor() {
        this.explosionTypes = {
            regular: 'regular',
            atomic: 'atomic',
            flash: 'flash',
            shockwave: 'shockwave'
        };
    }
    
    createExplosion(x, y, radius, type = 'regular') {
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
        
        return explosion;
    }
    
    createAtomicExplosion(x, y) {
        const explosion = this.createExplosion(x, y, 150, 'atomic');
        explosion.life = 180;
        explosion.maxLife = 180;
        
        // Create more dramatic particle effects
        for (let i = 0; i < 50; i++) {
            explosion.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                life: 60 + Math.random() * 60,
                color: `hsl(${Math.random() * 60 + 10}, 100%, ${50 + Math.random() * 30}%)`
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
    
    update(explosions, particles) {
        // Update explosions
        for (let i = explosions.length - 1; i >= 0; i--) {
            const explosion = explosions[i];
            explosion.life--;
            
            // Update explosion particles
            for (let j = explosion.particles.length - 1; j >= 0; j--) {
                const particle = explosion.particles[j];
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life--;
                
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
