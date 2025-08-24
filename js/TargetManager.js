class TargetManager {
    constructor() {
        this.targets = {
            natanz: {
                x: 700, y: 400, width: 80, height: 120,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Natanz Facility'
            },
            fordow: {
                x: 850, y: 350, width: 60, height: 100,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Fordow Complex'
            },
            arak: {
                x: 600, y: 430, width: 70, height: 110,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Arak Reactor'
            },
            esfahan: {
                x: 500, y: 380, width: 65, height: 90,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Esfahan Facility'
            },
            bushehr: {
                x: 1000, y: 380, width: 90, height: 130,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Bushehr Nuclear Power Plant'
            },
            tehran: {
                x: 400, y: 350, width: 55, height: 85,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Tehran Research Facility'
            },
            ardakan: {
                x: 300, y: 420, width: 65, height: 85,
                health: 100, maxHealth: 100, destroyed: false,
                name: 'Ardakan Yellowcake Plant'
            }
        };
    }
    
    reset() {
        Object.values(this.targets).forEach(target => {
            target.health = target.maxHealth;
            target.destroyed = false;
        });
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
