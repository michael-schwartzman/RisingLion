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
        // Sky gradient - matches original
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.ctx.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#DEB887');
        gradient.addColorStop(1, '#8B4513');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    
    drawTerrain() {
        // Ground - matches original
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.ctx.canvas.height - 100, this.ctx.canvas.width, 100);
        
        // Draw mountains and terrain features
        this.ctx.fillStyle = '#654321';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.ctx.canvas.height - 120);
        this.ctx.lineTo(200, this.ctx.canvas.height - 150);
        this.ctx.lineTo(400, this.ctx.canvas.height - 130);
        this.ctx.lineTo(600, this.ctx.canvas.height - 140);
        this.ctx.lineTo(800, this.ctx.canvas.height - 120);
        this.ctx.lineTo(1000, this.ctx.canvas.height - 130);
        this.ctx.lineTo(1200, this.ctx.canvas.height - 110);
        this.ctx.lineTo(1200, this.ctx.canvas.height);
        this.ctx.lineTo(0, this.ctx.canvas.height);
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
        
        // Enhanced platform base
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(launchPlatform.x, launchPlatform.y, launchPlatform.width, launchPlatform.height);
        
        // Platform armor plating
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillRect(launchPlatform.x + 5, launchPlatform.y + 5, launchPlatform.width - 10, launchPlatform.height - 10);
        
        // Command center structure
        this.ctx.fillStyle = '#1a202c';
        this.ctx.fillRect(launchPlatform.x + 20, launchPlatform.y - 25, 60, 30);
        
        // Israeli flag on command center
        this.drawIsraeliFlag(launchPlatform.x + 22, launchPlatform.y - 23, 16, 12);
        
        // Sara Netanyahu portrait on command center
        this.drawSaraPortraitOnBase(launchPlatform.x + 45, launchPlatform.y - 15);
        
        // Launch tubes
        this.ctx.fillStyle = '#4a5568';
        for (let i = 0; i < 3; i++) {
            this.ctx.fillRect(launchPlatform.x + 10 + i * 25, launchPlatform.y - 15, 8, 20);
        }
        
        // Platform lights (blinking effect)
        const time = Date.now();
        if (Math.floor(time / 500) % 2 === 0) {
            this.ctx.fillStyle = '#48bb78';
            this.ctx.beginPath();
            this.ctx.arc(launchPlatform.x + 15, launchPlatform.y + 10, 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(launchPlatform.x + 85, launchPlatform.y + 10, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Health bar with better styling
        const barWidth = launchPlatform.width;
        const barHeight = 8;
        const barX = launchPlatform.x;
        const barY = launchPlatform.y - 35;
        
        // Health bar background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        
        // Health bar fill
        const healthPercent = launchPlatform.health / launchPlatform.maxHealth;
        this.ctx.fillStyle = healthPercent > 0.6 ? '#48bb78' : healthPercent > 0.3 ? '#ed8936' : '#f56565';
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Health bar border
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Base label
        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ISRAELI BASE', launchPlatform.x + launchPlatform.width/2, launchPlatform.y - 40);
    }
    
    drawSaraPortraitOnBase(centerX, centerY) {
        // Try to draw the actual Sara image if loaded
        if (this.saraImage && this.saraImage.complete && this.saraImage.naturalWidth > 0) {
            this.ctx.save();
            
            // Create circular clipping region
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
            this.ctx.clip();
            
            // Draw the Sara Netanyahu photo
            this.ctx.drawImage(this.saraImage, centerX - 8, centerY - 8, 16, 16);
            this.ctx.restore();
            
            // Add portrait frame
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
            this.ctx.stroke();
        } else {
            // Fallback to drawn portrait
            this.drawSaraPortraitFallback(centerX, centerY);
        }
    }
    
    drawSaraPortraitFallback(centerX, centerY) {
        // Face shape
        this.ctx.fillStyle = '#fdbcb4';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Hair (blonde)
        this.ctx.fillStyle = '#f4e09c';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY - 2, 8, Math.PI, Math.PI * 2);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#2d3748';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 2, centerY - 1, 0.8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(centerX + 2, centerY - 1, 0.8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Smile
        this.ctx.strokeStyle = '#c53030';
        this.ctx.lineWidth = 0.8;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY + 1, 1.5, 0.2, Math.PI - 0.2);
        this.ctx.stroke();
        
        // Portrait frame
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    drawTargets(targets) {
        Object.entries(targets).forEach(([key, target]) => {
            if (target.destroyed) return;
            
            this.drawNuclearFacility(target);
        });
    }
    
    drawNuclearFacility(target) {
        const time = Date.now();
        
        // Draw facility based on its name/type
        switch(target.name) {
            case 'Natanz Facility':
                this.drawNatanzFacility(target, time);
                break;
            case 'Fordow Complex':
                this.drawFordowComplex(target, time);
                break;
            case 'Arak Reactor':
                this.drawArakReactor(target, time);
                break;
            case 'Esfahan Facility':
                this.drawEsfahanFacility(target, time);
                break;
            case 'Bushehr Nuclear Power Plant':
                this.drawBushehrPlant(target, time);
                break;
            case 'Tehran Research Facility':
                this.drawTehranResearch(target, time);
                break;
            case 'Ardakan Yellowcake Plant':
                this.drawArdakanPlant(target, time);
                break;
            default:
                this.drawGenericFacility(target, time);
        }
        
        // Common elements for all facilities
        this.drawFacilityHealthBar(target);
        this.drawFacilityLabel(target);
    }
    
    drawNatanzFacility(target, time) {
        // Main enrichment buildings
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(target.x, target.y, target.width * 0.7, target.height);
        
        // Underground entrance
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillRect(target.x + target.width * 0.75, target.y + target.height * 0.6, target.width * 0.25, target.height * 0.4);
        
        // Centrifuge halls (multiple buildings)
        this.ctx.fillStyle = '#718096';
        for (let i = 0; i < 3; i++) {
            this.ctx.fillRect(target.x + 5 + i * 20, target.y + 20, 15, target.height - 30);
        }
        
        // Security perimeter
        this.ctx.strokeStyle = '#e53e3e';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(target.x - 10, target.y - 10, target.width + 20, target.height + 20);
        this.ctx.setLineDash([]);
        
        // Animated security lights
        if (Math.floor(time / 300) % 2 === 0) {
            this.ctx.fillStyle = '#f56565';
            for (let i = 0; i < 4; i++) {
                this.ctx.beginPath();
                this.ctx.arc(target.x + i * 20, target.y - 5, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        // Missile launch indicators when facility is ready to attack
        if (target.missiles > 0 && target.attackCooldown <= 0) {
            this.drawMissileLaunchIndicators(target, time);
        }
        
        // Pulsing reactor core effect
        const pulse = Math.sin(time / 200) * 0.3 + 0.7;
        this.ctx.fillStyle = `rgba(72, 187, 120, ${pulse})`;
        this.ctx.fillRect(target.x + target.width/2 - 5, target.y + target.height/2 - 5, 10, 10);
    }
    
    drawFordowComplex(target, time) {
        // Mountain bunker entrance
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillRect(target.x, target.y, target.width, target.height * 0.3);
        
        // Underground complex (partially visible)
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(target.x + 10, target.y + target.height * 0.3, target.width - 20, target.height * 0.7);
        
        // Ventilation shafts
        this.ctx.fillStyle = '#1a202c';
        for (let i = 0; i < 2; i++) {
            this.ctx.fillRect(target.x + 15 + i * 25, target.y, 8, target.height * 0.4);
        }
        
        // Steam from ventilation (animated)
        this.ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
        for (let i = 0; i < 2; i++) {
            const steamOffset = Math.sin(time / 150 + i) * 3;
            for (let j = 0; j < 3; j++) {
                this.ctx.beginPath();
                this.ctx.arc(
                    target.x + 19 + i * 25 + steamOffset,
                    target.y - 10 - j * 8,
                    2 + j,
                    0, Math.PI * 2
                );
                this.ctx.fill();
            }
        }
        
        // Missile launch indicators when facility is ready to attack
        if (target.missiles > 0 && target.attackCooldown <= 0) {
            this.drawMissileLaunchIndicators(target, time);
        }
        
        // Blast doors
        this.ctx.fillStyle = '#a0aec0';
        this.ctx.fillRect(target.x + target.width * 0.3, target.y + target.height * 0.8, target.width * 0.4, target.height * 0.2);
    }
    
    drawArakReactor(target, time) {
        // Heavy water reactor building
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(target.x, target.y + target.height * 0.4, target.width, target.height * 0.6);
        
        // Reactor dome
        this.ctx.fillStyle = '#718096';
        this.ctx.beginPath();
        this.ctx.arc(target.x + target.width/2, target.y + target.height * 0.4, target.width * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Cooling system
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillRect(target.x + target.width * 0.1, target.y, target.width * 0.2, target.height * 0.5);
        this.ctx.fillRect(target.x + target.width * 0.7, target.y, target.width * 0.2, target.height * 0.5);
        
        // Animated cooling water effect
        const flow = Math.sin(time / 100) * 10;
        this.ctx.strokeStyle = '#4299e1';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(target.x + target.width * 0.2, target.y + target.height * 0.2 + flow);
        this.ctx.lineTo(target.x + target.width * 0.7, target.y + target.height * 0.2 + flow);
        this.ctx.stroke();
        
        // Reactor core glow (pulsing)
        const glow = Math.sin(time / 250) * 0.4 + 0.6;
        this.ctx.fillStyle = `rgba(56, 178, 172, ${glow})`;
        this.ctx.beginPath();
        this.ctx.arc(target.x + target.width/2, target.y + target.height * 0.4, target.width * 0.15, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawEsfahanFacility(target, time) {
        // Uranium conversion facility
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(target.x, target.y, target.width, target.height);
        
        // Chemical processing towers
        for (let i = 0; i < 3; i++) {
            this.ctx.fillStyle = '#2d3748';
            this.ctx.fillRect(target.x + 10 + i * 15, target.y - 20, 8, target.height + 20);
            
            // Tower caps
            this.ctx.fillStyle = '#1a202c';
            this.ctx.fillRect(target.x + 8 + i * 15, target.y - 25, 12, 8);
        }
        
        // Chemical vapor (animated)
        this.ctx.fillStyle = 'rgba(255, 165, 0, 0.4)';
        for (let i = 0; i < 3; i++) {
            const vaporOffset = Math.sin(time / 120 + i * 0.5) * 5;
            for (let j = 0; j < 4; j++) {
                this.ctx.beginPath();
                this.ctx.arc(
                    target.x + 14 + i * 15 + vaporOffset,
                    target.y - 30 - j * 6,
                    1 + j * 0.5,
                    0, Math.PI * 2
                );
                this.ctx.fill();
            }
        }
        
        // Processing glow
        const processGlow = Math.sin(time / 180) * 0.5 + 0.5;
        this.ctx.fillStyle = `rgba(237, 137, 54, ${processGlow})`;
        this.ctx.fillRect(target.x + target.width * 0.2, target.y + target.height * 0.3, target.width * 0.6, target.height * 0.4);
    }
    
    drawBushehrPlant(target, time) {
        // Nuclear power plant - largest facility
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(target.x, target.y, target.width, target.height);
        
        // Main reactor building
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillRect(target.x + target.width * 0.3, target.y + target.height * 0.2, target.width * 0.4, target.height * 0.6);
        
        // Cooling towers (iconic)
        for (let i = 0; i < 2; i++) {
            const towerX = target.x + target.width * 0.1 + i * target.width * 0.7;
            const towerY = target.y - target.height * 0.3;
            const towerW = target.width * 0.15;
            const towerH = target.height * 0.8;
            
            // Tower shape (hyperboloid)
            this.ctx.fillStyle = '#e2e8f0';
            this.ctx.beginPath();
            this.ctx.moveTo(towerX, towerY + towerH);
            this.ctx.quadraticCurveTo(towerX + towerW/2, towerY + towerH * 0.3, towerX + towerW * 0.7, towerY);
            this.ctx.lineTo(towerX + towerW * 1.3, towerY);
            this.ctx.quadraticCurveTo(towerX + towerW/2, towerY + towerH * 0.3, towerX + towerW, towerY + towerH);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Steam (animated, rotating)
            const steamRotation = (time / 100 + i * Math.PI) % (Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let j = 0; j < 8; j++) {
                const angle = steamRotation + j * Math.PI / 4;
                const steamX = towerX + towerW/2 + Math.cos(angle) * (towerW * 0.8);
                const steamY = towerY - 10 + Math.sin(angle) * 5;
                this.ctx.beginPath();
                this.ctx.arc(steamX, steamY, 3 + Math.sin(angle) * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        // Missile launch indicators when facility is ready to attack
        if (target.missiles > 0 && target.attackCooldown <= 0) {
            this.drawMissileLaunchIndicators(target, time);
        }
        
        // Reactor core glow
        const coreGlow = Math.sin(time / 200) * 0.3 + 0.7;
        this.ctx.fillStyle = `rgba(72, 187, 120, ${coreGlow})`;
        this.ctx.fillRect(target.x + target.width * 0.4, target.y + target.height * 0.3, target.width * 0.2, target.height * 0.4);
    }
    
    drawTehranResearch(target, time) {
        // Research facility with laboratory buildings
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(target.x, target.y, target.width, target.height);
        
        // Laboratory modules
        for (let i = 0; i < 2; i++) {
            this.ctx.fillStyle = '#718096';
            this.ctx.fillRect(target.x + 5 + i * 25, target.y + 10, 20, target.height - 20);
        }
        
        // Research equipment (animated scanning)
        const scanLine = (time / 50) % target.width;
        this.ctx.strokeStyle = '#4299e1';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(target.x + scanLine, target.y);
        this.ctx.lineTo(target.x + scanLine, target.y + target.height);
        this.ctx.stroke();
        
        // Blinking research indicators
        if (Math.floor(time / 200) % 3 === 0) {
            this.ctx.fillStyle = '#4299e1';
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.arc(target.x + 10 + i * 15, target.y + 5, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
    
    drawArdakanPlant(target, time) {
        // Yellowcake processing plant
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(target.x, target.y, target.width, target.height);
        
        // Processing silos
        for (let i = 0; i < 3; i++) {
            this.ctx.fillStyle = '#2d3748';
            this.ctx.beginPath();
            this.ctx.arc(target.x + 15 + i * 15, target.y + target.height * 0.7, 8, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Yellow processing glow (yellowcake)
        const yellowGlow = Math.sin(time / 150) * 0.4 + 0.6;
        this.ctx.fillStyle = `rgba(255, 215, 0, ${yellowGlow})`;
        this.ctx.fillRect(target.x + target.width * 0.2, target.y + target.height * 0.2, target.width * 0.6, target.height * 0.6);
        
        // Dust particles (animated)
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        for (let i = 0; i < 5; i++) {
            const dustX = target.x + (time / 20 + i * 50) % target.width;
            const dustY = target.y + Math.sin(time / 100 + i) * 10 + target.height * 0.5;
            this.ctx.beginPath();
            this.ctx.arc(dustX, dustY, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawGenericFacility(target, time) {
        // Fallback generic facility
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(target.x, target.y, target.width, target.height);
        
        // Generic reactor glow
        const glow = Math.sin(time / 200) * 0.3 + 0.7;
        this.ctx.fillStyle = `rgba(72, 187, 120, ${glow})`;
        this.ctx.fillRect(target.x + target.width * 0.3, target.y + target.height * 0.3, target.width * 0.4, target.height * 0.4);
    }
    
    drawFacilityHealthBar(target) {
        // Enhanced health bar
        const barWidth = target.width;
        const barHeight = 8;
        const barX = target.x;
        const barY = target.y - 20;
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        
        // Health fill with gradient
        const healthPercent = target.health / target.maxHealth;
        const gradient = this.ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
        if (healthPercent > 0.6) {
            gradient.addColorStop(0, '#48bb78');
            gradient.addColorStop(1, '#38a169');
        } else if (healthPercent > 0.3) {
            gradient.addColorStop(0, '#ed8936');
            gradient.addColorStop(1, '#dd6b20');
        } else {
            gradient.addColorStop(0, '#f56565');
            gradient.addColorStop(1, '#e53e3e');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Show missile count and threat level if facility has offensive capabilities
        if (target.missiles !== undefined) {
            this.drawFacilityThreatInfo(target);
        }
    }
    
    drawFacilityThreatInfo(target) {
        // Missile count indicator
        this.ctx.fillStyle = target.missiles > 0 ? '#ff6b35' : '#666666';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`🚀${target.missiles}`, target.x, target.y - 30);
        
        // Threat level indicator
        const threatColors = {
            'critical': '#ff0000',
            'high': '#ff6600',
            'medium': '#ffaa00',
            'low': '#ffdd00'
        };
        
        const threatColor = threatColors[target.threatLevel] || '#ffffff';
        this.ctx.fillStyle = threatColor;
        this.ctx.font = 'bold 6px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(target.threatLevel.toUpperCase(), target.x + target.width, target.y - 30);
        
        // Attack cooldown indicator
        if (target.attackCooldown > 0) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
            this.ctx.fillRect(target.x, target.y - 5, target.width, 3);
            
            const cooldownPercent = 1 - (target.attackCooldown / (target.attackFrequency / 16.67));
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.fillRect(target.x, target.y - 5, target.width * cooldownPercent, 3);
        }
    }
    
    drawFacilityLabel(target) {
        // Facility name with better styling
        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(target.name, target.x + target.width / 2, target.y - 25);
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
            // Draw missile trail first (behind missile)
            this.drawMissileTrail(projectile);
            
            // Draw the projectile
            if (projectile.type === 'israeli') {
                this.ctx.fillStyle = '#4da6ff';
            } else if (projectile.type === 'iranian') {
                this.ctx.fillStyle = '#ff4d4d';
            } else {
                this.ctx.fillStyle = '#ff6b35';
            }
            
            this.ctx.beginPath();
            this.ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw missile glow effect
            if (projectile.type === 'iranian') {
                this.ctx.shadowColor = '#ff4d4d';
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        });
    }
    
    drawMissileTrail(missile) {
        if (!missile.trail || missile.trail.length === 0) return;
        
        this.ctx.save();
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        for (let i = 1; i < missile.trail.length; i++) {
            const current = missile.trail[i];
            const previous = missile.trail[i - 1];
            
            // Color based on missile type
            let baseColor = missile.type === 'iranian' ? '255, 77, 77' : '77, 166, 255';
            
            this.ctx.strokeStyle = `rgba(${baseColor}, ${current.opacity * 0.8})`;
            this.ctx.lineWidth = 2 * current.opacity;
            
            this.ctx.beginPath();
            this.ctx.moveTo(previous.x, previous.y);
            this.ctx.lineTo(current.x, current.y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawIncomingMissileWarning(warningSystem) {
        if (!warningSystem.active) return;
        
        this.ctx.save();
        
        // Flashing red overlay
        const flashPhase = Math.floor(warningSystem.duration / warningSystem.flashInterval) % 2;
        if (flashPhase === 0) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
        
        // Warning text
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('INCOMING MISSILES!', this.ctx.canvas.width / 2, 60);
        
        // Warning indicators at screen edges
        this.ctx.fillStyle = '#ff0000';
        for (let i = 0; i < 10; i++) {
            this.ctx.fillRect(i * 30, 0, 20, 5);
            this.ctx.fillRect(i * 30, this.ctx.canvas.height - 5, 20, 5);
        }
        
        this.ctx.restore();
    }
    
    drawLevelIndicator(currentLevel, maxLevel) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Level: ${currentLevel}/${maxLevel}`, 20, 100);
    }
    
    drawThreatAssessment(activeFacilities) {
        // Calculate total threat level
        let totalMissiles = 0;
        let activeFacilityCount = 0;
        let criticalFacilities = 0;
        
        Object.values(activeFacilities).forEach(facility => {
            if (!facility.destroyed) {
                activeFacilityCount++;
                totalMissiles += facility.missiles || 0;
                if (facility.threatLevel === 'critical') criticalFacilities++;
            }
        });
        
        // Display threat assessment
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(20, 120, 200, 80);
        
        this.ctx.strokeStyle = '#ffaa00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(20, 120, 200, 80);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('THREAT ASSESSMENT', 25, 135);
        
        this.ctx.font = '10px Arial';
        this.ctx.fillText(`Active Facilities: ${activeFacilityCount}`, 25, 150);
        this.ctx.fillText(`Total Missiles: ${totalMissiles}`, 25, 165);
        this.ctx.fillText(`Critical Sites: ${criticalFacilities}`, 25, 180);
        
        // Threat level color
        let threatColor = '#00ff00'; // Green - low threat
        if (totalMissiles > 20) threatColor = '#ff0000'; // Red - high threat
        else if (totalMissiles > 10) threatColor = '#ffaa00'; // Orange - medium threat
        
        this.ctx.fillStyle = threatColor;
        this.ctx.fillText(`THREAT: ${totalMissiles > 20 ? 'CRITICAL' : totalMissiles > 10 ? 'HIGH' : 'MODERATE'}`, 25, 195);
    }
    
    drawMissileLaunchIndicators(target, time) {
        // Show missile silos/launch tubes when facility is ready to attack
        const flash = Math.floor(time / 150) % 2 === 0;
        
        if (flash) {
            // Draw missile launch tubes
            this.ctx.fillStyle = '#ff4d4d';
            for (let i = 0; i < Math.min(3, target.missiles); i++) {
                this.ctx.fillRect(
                    target.x + 10 + i * 15, 
                    target.y - 8, 
                    6, 
                    12
                );
            }
            
            // Targeting laser effect
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([2, 2]);
            this.ctx.beginPath();
            this.ctx.moveTo(target.x + target.width/2, target.y);
            this.ctx.lineTo(100, 620); // Point toward Israeli base
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    drawInterceptors(interceptors) {
        interceptors.forEach(interceptor => {
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
            
            // Draw interceptor missile
            this.ctx.fillStyle = missileColor;
            this.ctx.beginPath();
            this.ctx.arc(interceptor.x, interceptor.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawAircrafts(aircrafts) {
        aircrafts.forEach(aircraft => {
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

    drawExplosions(explosions) {
        explosions.forEach(explosion => {
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
        
        const { x, y, radius, alpha, phase } = explosion;
        
        this.ctx.globalAlpha = alpha;
        
        // Outer shockwave
        const shockRadius = radius * 1.5;
        const shockGradient = this.ctx.createRadialGradient(x, y, 0, x, y, shockRadius);
        shockGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        shockGradient.addColorStop(0.3, 'rgba(255, 200, 0, 0.6)');
        shockGradient.addColorStop(0.7, 'rgba(255, 100, 0, 0.3)');
        shockGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = shockGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, shockRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Main fireball
        const fireGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        fireGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        fireGradient.addColorStop(0.2, 'rgba(255, 255, 0, 0.9)');
        fireGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.7)');
        fireGradient.addColorStop(1, 'rgba(150, 0, 0, 0)');
        
        this.ctx.fillStyle = fireGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.globalAlpha = 1;
    }

    drawFlashExplosion(explosion) {
        if (!explosion || !explosion.x || !explosion.y) return;
        
        this.ctx.globalAlpha = explosion.alpha;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    drawShockwave(explosion) {
        if (!explosion || !explosion.x || !explosion.y) return;
        
        this.ctx.globalAlpha = explosion.alpha;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }

    drawRegularExplosion(explosion) {
        if (!explosion || !explosion.x || !explosion.y) return;
        
        this.ctx.globalAlpha = explosion.alpha;
        this.ctx.fillStyle = '#ff6600';
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    drawParticles(particles) {
        particles.forEach(particle => {
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

    drawAimingLine(aimStartX, aimStartY, aimEndX, aimEndY) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(aimStartX, aimStartY);
        this.ctx.lineTo(aimEndX, aimEndY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw power indicator
        const distance = Math.sqrt(
            Math.pow(aimEndX - aimStartX, 2) + 
            Math.pow(aimEndY - aimStartY, 2)
        );
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            `Power: ${Math.min(Math.floor(distance / 3), 100)}%`,
            aimEndX,
            aimEndY - 10
        );
    }
}
