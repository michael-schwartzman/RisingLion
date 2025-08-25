class TargetManager {
    constructor() {
        this.targets = {
            natanz: {
                x: 700, y: 500, width: 80, height: 120,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Natanz Facility',
                // Offensive capabilities
                missiles: 8,
                maxMissiles: 8,
                attackCooldown: 0,
                attackFrequency: 4000, // 4 seconds
                missileSpeed: 4.5,
                accuracy: 0.85,
                threatLevel: 'high' // High priority target
            },
            fordow: {
                x: 850, y: 450, width: 60, height: 100,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Fordow Complex',
                // Offensive capabilities
                missiles: 12,
                maxMissiles: 12,
                attackCooldown: 0,
                attackFrequency: 3500, // 3.5 seconds - underground facility is more aggressive
                missileSpeed: 5.0,
                accuracy: 0.90,
                threatLevel: 'critical' // Most dangerous
            },
            arak: {
                x: 600, y: 530, width: 70, height: 110,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Arak Reactor',
                // Offensive capabilities
                missiles: 6,
                maxMissiles: 6,
                attackCooldown: 0,
                attackFrequency: 5000, // 5 seconds
                missileSpeed: 4.0,
                accuracy: 0.80,
                threatLevel: 'high'
            },
            esfahan: {
                x: 500, y: 480, width: 65, height: 90,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Esfahan Facility',
                // Offensive capabilities
                missiles: 5,
                maxMissiles: 5,
                attackCooldown: 0,
                attackFrequency: 4500, // 4.5 seconds
                missileSpeed: 4.2,
                accuracy: 0.82,
                threatLevel: 'medium'
            },
            bushehr: {
                x: 1000, y: 480, width: 90, height: 130,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Bushehr Nuclear Power Plant',
                // Offensive capabilities
                missiles: 10,
                maxMissiles: 10,
                attackCooldown: 0,
                attackFrequency: 3800, // 3.8 seconds - power plant has good defenses
                missileSpeed: 4.8,
                accuracy: 0.88,
                threatLevel: 'critical'
            },
            tehran: {
                x: 400, y: 450, width: 55, height: 85,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Tehran Research Facility',
                // Offensive capabilities
                missiles: 4,
                maxMissiles: 4,
                attackCooldown: 0,
                attackFrequency: 6000, // 6 seconds - research facility less combat focused
                missileSpeed: 3.8,
                accuracy: 0.75,
                threatLevel: 'medium'
            },
            ardakan: {
                x: 300, y: 520, width: 65, height: 85,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Ardakan Yellowcake Plant',
                // Offensive capabilities
                missiles: 3,
                maxMissiles: 3,
                attackCooldown: 0,
                attackFrequency: 7000, // 7 seconds - least threatening
                missileSpeed: 3.5,
                accuracy: 0.70,
                threatLevel: 'low'
            }
        };
    }
    
    reset() {
        Object.values(this.targets).forEach(target => {
            target.health = target.maxHealth;
            target.destroyed = false;
            target.missiles = target.maxMissiles;
            target.attackCooldown = 0;
        });
    }
    
    update() {
        // Update attack cooldowns for all facilities
        Object.values(this.targets).forEach(target => {
            if (target.attackCooldown > 0) {
                target.attackCooldown--;
            }
        });
    }
    
    canFacilityAttack(facility) {
        return !facility.destroyed && 
               facility.missiles > 0 && 
               facility.attackCooldown <= 0;
    }
    
    launchFacilityAttack(facility, israeliBase, interceptors) {
        if (!this.canFacilityAttack(facility)) return false;
        
        // Calculate trajectory to Israeli base
        const accuracyVariation = (1 - facility.accuracy) * 80;
        const targetX = israeliBase.x + israeliBase.width/2 + (Math.random() - 0.5) * accuracyVariation;
        const targetY = israeliBase.y + israeliBase.height/2 + (Math.random() - 0.5) * accuracyVariation;
        
        const launchX = facility.x + facility.width/2;
        const launchY = facility.y + facility.height/2;
        
        const dx = targetX - launchX;
        const dy = targetY - launchY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Create facility missile
        const facilityMissile = {
            x: launchX,
            y: launchY,
            vx: (dx / distance) * facility.missileSpeed,
            vy: (dy / distance) * facility.missileSpeed,
            life: 300, // Long range missiles
            type: 'iranian',
            trail: [],
            fromFacility: facility.name,
            target: 'israeli-base',
            damage: this.getFacilityDamage(facility),
            isOffensive: true
        };
        
        interceptors.push(facilityMissile);
        facility.missiles--;
        facility.attackCooldown = facility.attackFrequency / 16.67; // Convert ms to frames (60fps)
        
        console.log(`${facility.name} launched missile! Remaining: ${facility.missiles}`);
        return true;
    }
    
    getFacilityDamage(facility) {
        // Damage based on facility threat level
        const damages = {
            'critical': 35,
            'high': 25,
            'medium': 18,
            'low': 12
        };
        return damages[facility.threatLevel] || 15;
    }
    
    getActiveFacilities(currentLevel) {
        const facilityUnlockOrder = [
            'natanz',    // Level 1
            'fordow',    // Level 2  
            'esfahan',   // Level 3
            'arak',      // Level 4
            'tehran',    // Level 5
            'bushehr',   // Level 6
            'ardakan'    // Level 7
        ];
        
        const activeFacilities = {};
        for (let i = 0; i < Math.min(currentLevel, facilityUnlockOrder.length); i++) {
            const facilityKey = facilityUnlockOrder[i];
            if (this.targets[facilityKey]) {
                activeFacilities[facilityKey] = this.targets[facilityKey];
            }
        }
        
        return activeFacilities;
    }
    
    hitTarget(targetKey, damage) {
        const target = this.targets[targetKey];
        if (!target || target.destroyed) return false;
        
        target.health -= damage;
        
        if (target.health <= 0) {
            target.health = 0;
            target.destroyed = true;
            return true; // Target destroyed
        }
        
        return false; // Target hit but not destroyed
    }
    
    getActiveTargets() {
        return Object.entries(this.targets).filter(([key, target]) => !target.destroyed);
    }
    
    getAllTargetsDestroyed() {
        return Object.values(this.targets).every(target => target.destroyed);
    }
    
    update() {
        // Any target-specific update logic can go here
    }
}
