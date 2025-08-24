class GameRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.saraImage = null;
        this.haminaiImage = null;
        this.loadImages();
    }
    
    loadImages() {
        this.saraImage = new Image();
        this.saraImage.src = 'images/sara.png';
        
        this.haminaiImage = new Image();
        this.haminaiImage.src = 'images/haminai.png';
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, 400);
        
        // Ground
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, 400, this.ctx.canvas.width, this.ctx.canvas.height - 400);
    }
    
    drawTerrain() {
        // Draw mountains and terrain features
        this.ctx.fillStyle = '#654321';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 450);
        this.ctx.lineTo(200, 420);
        this.ctx.lineTo(400, 440);
        this.ctx.lineTo(600, 430);
        this.ctx.lineTo(800, 450);
        this.ctx.lineTo(1000, 440);
        this.ctx.lineTo(1200, 460);
        this.ctx.lineTo(1200, 600);
        this.ctx.lineTo(0, 600);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawFlags() {
        // Israeli flag (left side)
        this.drawIsraeliFlag(20, 20, 60, 40);
        
        // Iranian flag (right side)
        this.drawIranianFlag(1120, 20, 60, 40);
    }
    
    drawIsraeliFlag(x, y, width, height) {
        // White background
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x, y, width, height);
        
        // Blue stripes
        this.ctx.fillStyle = '#0038b8';
        this.ctx.fillRect(x, y + 5, width, 8);
        this.ctx.fillRect(x, y + height - 13, width, 8);
        
        // Star of David (simplified)
        this.ctx.strokeStyle = '#0038b8';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        // Draw triangles forming Star of David
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const size = 8;
        
        // Upper triangle
        this.ctx.moveTo(centerX, centerY - size);
        this.ctx.lineTo(centerX - size, centerY + size/2);
        this.ctx.lineTo(centerX + size, centerY + size/2);
        this.ctx.closePath();
        
        // Lower triangle
        this.ctx.moveTo(centerX, centerY + size);
        this.ctx.lineTo(centerX - size, centerY - size/2);
        this.ctx.lineTo(centerX + size, centerY - size/2);
        this.ctx.closePath();
        
        this.ctx.stroke();
    }
    
    drawIranianFlag(x, y, width, height) {
        // Green stripe
        this.ctx.fillStyle = '#239f40';
        this.ctx.fillRect(x, y, width, height / 3);
        
        // White stripe
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x, y + height / 3, width, height / 3);
        
        // Red stripe
        this.ctx.fillStyle = '#da0000';
        this.ctx.fillRect(x, y + 2 * height / 3, width, height / 3);
        
        // Simplified emblem in center
        this.ctx.fillStyle = '#da0000';
        this.ctx.beginPath();
        this.ctx.arc(x + width / 2, y + height / 2, 6, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawLaunchPlatform(launchPlatform) {
        if (launchPlatform.destroyed) return;
        
        // Platform base
        this.ctx.fillStyle = '#666666';
        this.ctx.fillRect(launchPlatform.x, launchPlatform.y, launchPlatform.width, launchPlatform.height);
        
        // Health bar
        const barWidth = launchPlatform.width;
        const barHeight = 6;
        const barX = launchPlatform.x;
        const barY = launchPlatform.y - 15;
        
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        const healthPercent = launchPlatform.health / launchPlatform.maxHealth;
        this.ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : healthPercent > 0.25 ? '#FFFF00' : '#FF0000';
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Platform details
        this.ctx.fillStyle = '#888888';
        this.ctx.fillRect(launchPlatform.x + 10, launchPlatform.y - 10, 20, 15);
        this.ctx.fillRect(launchPlatform.x + 70, launchPlatform.y - 10, 20, 15);
    }
    
    drawTargets(targets) {
        Object.entries(targets).forEach(([key, target]) => {
            if (target.destroyed) return;
            
            this.drawNuclearFacility(target);
        });
    }
    
    drawNuclearFacility(target) {
        // Main building
        this.ctx.fillStyle = '#444444';
        this.ctx.fillRect(target.x, target.y, target.width, target.height);
        
        // Cooling towers (if it's a larger facility)
        if (target.width > 70) {
            this.ctx.fillStyle = '#666666';
            this.ctx.beginPath();
            this.ctx.arc(target.x + target.width * 0.7, target.y + target.height * 0.3, 15, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(target.x + target.width * 0.9, target.y + target.height * 0.5, 12, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Health bar
        const barWidth = target.width;
        const barHeight = 6;
        const barX = target.x;
        const barY = target.y - 15;
        
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        const healthPercent = target.health / target.maxHealth;
        this.ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : healthPercent > 0.25 ? '#FFFF00' : '#FF0000';
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Label
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(target.name, target.x + target.width / 2, target.y - 20);
    }
    
    drawDefenseSystems(defenseSystems) {
        defenseSystems.forEach(system => {
            if (!system.active) return;
            
            // Defense system base
            this.ctx.fillStyle = system.cooldown > 0 ? '#FF6666' : '#66FF66';
            this.ctx.beginPath();
            this.ctx.arc(system.x, system.y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Range indicator (faint)
            this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.1)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(system.x, system.y, system.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        });
    }
    
    drawProjectiles(projectiles) {
        projectiles.forEach(projectile => {
            // Trail
            this.ctx.strokeStyle = 'rgba(255, 100, 0, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            
            if (projectile.trail.length > 1) {
                this.ctx.moveTo(projectile.trail[0].x, projectile.trail[0].y);
                for (let i = 1; i < projectile.trail.length; i++) {
                    this.ctx.lineTo(projectile.trail[i].x, projectile.trail[i].y);
                }
            }
            this.ctx.stroke();
            
            // Projectile
            this.ctx.fillStyle = this.getProjectileColor(projectile.type);
            this.ctx.beginPath();
            this.ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    getProjectileColor(type) {
        const colors = {
            missile: '#FF4444',
            guided: '#4444FF',
            aircraft: '#44FF44',
            cruise: '#FF44FF'
        };
        return colors[type] || '#FF4444';
    }
    
    drawInterceptors(interceptors) {
        interceptors.forEach(interceptor => {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.beginPath();
            this.ctx.arc(interceptor.x, interceptor.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Small trail
            this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(interceptor.x - interceptor.vx * 3, interceptor.y - interceptor.vy * 3);
            this.ctx.lineTo(interceptor.x, interceptor.y);
            this.ctx.stroke();
        });
    }
    
    drawAircrafts(aircrafts) {
        aircrafts.forEach(aircraft => {
            this.drawIsraeliAircraft(aircraft.x, aircraft.y);
        });
    }
    
    drawIsraeliAircraft(x, y) {
        this.ctx.fillStyle = '#0066CC';
        
        // Main body
        this.ctx.fillRect(x - 15, y - 3, 30, 6);
        
        // Wings
        this.ctx.fillRect(x - 20, y - 1, 40, 2);
        
        // Tail
        this.ctx.fillRect(x - 18, y - 6, 4, 12);
        
        // Cockpit
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(x + 10, y - 2, 4, 4);
    }
    
    drawExplosions(explosions) {
        explosions.forEach(explosion => {
            switch(explosion.type) {
                case 'atomic':
                    this.drawAtomicExplosion(explosion);
                    break;
                case 'flash':
                    this.drawFlashExplosion(explosion);
                    break;
                case 'shockwave':
                    this.drawShockwave(explosion);
                    break;
                default:
                    this.drawRegularExplosion(explosion);
                    break;
            }
        });
    }
    
    drawAtomicExplosion(explosion) {
        const alpha = explosion.life / explosion.maxLife;
        
        // Mushroom cloud effect
        this.ctx.save();
        this.ctx.globalAlpha = alpha * 0.8;
        
        // Main blast
        const gradient = this.ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, explosion.radius
        );
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.3, '#FFAA00');
        gradient.addColorStop(0.7, '#FF4400');
        gradient.addColorStop(1, 'rgba(139, 0, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Mushroom stem
        if (explosion.life < explosion.maxLife * 0.7) {
            this.ctx.fillStyle = `rgba(139, 69, 19, ${alpha * 0.6})`;
            this.ctx.fillRect(explosion.x - 10, explosion.y, 20, explosion.radius * 0.8);
        }
        
        this.ctx.restore();
        
        // Draw explosion particles
        explosion.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life / 60;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    drawFlashExplosion(explosion) {
        const alpha = explosion.life / explosion.maxLife;
        
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    drawShockwave(explosion) {
        const progress = 1 - (explosion.life / explosion.maxLife);
        const currentRadius = explosion.radius * progress;
        
        this.ctx.save();
        this.ctx.globalAlpha = explosion.life / explosion.maxLife;
        this.ctx.strokeStyle = '#FFAA00';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, currentRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    drawRegularExplosion(explosion) {
        const alpha = explosion.life / explosion.maxLife;
        
        // Main explosion
        const gradient = this.ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, explosion.radius
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(0.3, `rgba(255, 170, 0, ${alpha * 0.8})`);
        gradient.addColorStop(0.7, `rgba(255, 68, 0, ${alpha * 0.6})`);
        gradient.addColorStop(1, 'rgba(139, 0, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw explosion particles
        explosion.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    drawParticles(particles) {
        particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life / 40;
            this.ctx.fillStyle = particle.color || '#FFA500';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size || 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    drawAimingLine(startX, startY, endX, endY) {
        this.ctx.strokeStyle = '#FFFF00';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    drawLevelIndicator(currentLevel, maxLevel) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Level: ${currentLevel}/${maxLevel}`, 20, 100);
    }
}
