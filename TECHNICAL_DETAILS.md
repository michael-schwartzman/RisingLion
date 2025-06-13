# Technical Implementation Details - Operation Rising Lion

## Code Architecture

### Main Game Class Structure
```javascript
class OperationRisingLion {
    constructor() {
        // Game state management
        // Object arrays (projectiles, explosions, etc.)
        // Target definitions
        // Weapon inventory
        // Defense systems
    }
    
    // Core game loop methods
    init() -> setupEventListeners() -> gameLoop()
    update() -> render()
}
```

### Key Methods by Category

#### Game State Management
- `startGame()` - Initialize new game session
- `endGame()` - Handle victory/defeat conditions
- `showScreen()` - Screen transition management
- `updateHUD()` - UI element updates

#### Physics & Movement
- `updateProjectiles()` - Ballistic trajectory calculations
- `updateInterceptors()` - AI missile tracking
- `updateAircrafts()` - Aircraft movement and bombing
- `updateParticles()` - Effect particle physics

#### Combat System
- `fireWeapon()` - Projectile creation and launch
- `checkCollisions()` - Hit detection algorithms
- `hitTarget()` - Damage calculation and application
- `spawnRandomInterceptor()` - Defense AI activation

#### Visual Effects
- `createAtomicExplosion()` - Multi-phase nuclear explosion
- `createExplosion()` - Standard explosion effects
- `drawExplosions()` - Explosion rendering system
- `drawAtomicExplosion()` - Mushroom cloud visualization

#### Rendering Pipeline
- `render()` - Main rendering loop with screen shake
- `drawBackground()` - Sky and terrain gradients
- `drawTargets()` - Nuclear facility rendering
- `drawIsraeliAircraft()` - F-16 with Sara Netanyahu
- `drawSaraNetanyahu()` - Character portrait system

## Data Structures

### Game Objects
```javascript
// Projectile object structure
{
    x, y: position coordinates
    vx, vy: velocity components
    type: weapon type identifier
    trail: array of trail points
    life: remaining lifetime
    guided: boolean for smart missiles
    targetX, targetY: guidance coordinates
}

// Target structure
{
    x, y: position
    width, height: dimensions
    health, maxHealth: damage system
    destroyed: boolean state
    name: display identifier
}

// Explosion object
{
    x, y: center position
    radius, maxRadius: size constraints
    expansion: growth rate
    life: duration remaining
    alpha: transparency
    type: explosion category
    phase: animation stage (for atomic)
    mushroomStem, mushroomCap: atomic-specific data
}
```

### Defense Systems
```javascript
// Defense installation
{
    x, y: position coordinates
    radius: protection zone
    active: operational status
    cooldown: reload timer
}
```

## Visual Design Implementation

### Flag Rendering System
- **Israeli Flag**: White background with blue stripes and Star of David
- **Iranian Flag**: Three-color horizontal stripes (green, white, red)
- **Implementation**: CSS-based for UI, Canvas-drawn for game elements

### Nuclear Facility Design
```javascript
// Facility components rendered
- Main reactor building (gray concrete)
- Reactor dome (darker gray sphere)
- Cooling towers (cylindrical with steam effects)
- Security perimeter (red dashed lines)
- Warning signs (yellow triangles with radiation symbols)
- Windows/vents (blue rectangles)
- Iranian flag overlay
- Health bar system
```

### Sara Netanyahu Character System
```javascript
// Portrait rendering layers
1. Face shape (oval with skin tone)
2. Blonde hair (layered for depth)
3. Facial features (eyes, eyebrows, nose, smile)
4. Accessories (gold earrings)
5. Pilot equipment (helmet, visor)
6. Name tag identification
```

## Physics Calculations

### Ballistic Trajectory
```javascript
// Basic projectile physics
projectile.x += projectile.vx;
projectile.y += projectile.vy;
projectile.vy += gravity; // 0.2 for most projectiles

// Guided missile behavior
if (guided && life > 500) {
    const angle = Math.atan2(dy, dx);
    projectile.vx += Math.cos(angle) * 0.1;
    projectile.vy += Math.sin(angle) * 0.1;
}
```

### Collision Detection Algorithm
```javascript
// Reverse iteration to prevent index shifting
for (let i = array.length - 1; i >= 0; i--) {
    // Check collisions
    // Remove objects safely
    array.splice(i, 1);
}
```

## Performance Optimizations

### Particle System Limits
- **Atomic Debris**: Reduced from 100 to 50 particles
- **Smoke Particles**: Reduced from 50 to 25 particles
- **Explosion Duration**: Limited lifetime to prevent accumulation

### Memory Management
```javascript
// Array filtering with validation
this.explosions = this.explosions.filter(explosion => {
    if (!explosion || explosion.life === undefined) return false;
    // Update logic
    return explosion.life > 0 && explosion.alpha > 0;
});
```

### Error Handling Strategy
```javascript
// Defensive programming pattern
try {
    // Risky operation
} catch (error) {
    console.warn('Operation failed, using fallback');
    // Fallback behavior
}
```

## Event System Architecture

### Input Handling Flow
1. **Mouse Events**: Canvas coordinates → Game world coordinates
2. **Keyboard Events**: Key codes → Weapon selection/actions
3. **UI Events**: Button clicks → Game state changes

### Event Listener Safety
```javascript
// Robust element checking
const element = document.getElementById('buttonId');
if (element) {
    element.addEventListener('click', handler);
} else {
    console.error('Element not found');
}
```

## Animation Systems

### Screen Shake Implementation
```javascript
// Context transformation for camera shake
if (this.screenShake) {
    const intensity = this.screenShake.intensity * 
        (1 - this.screenShake.current / this.screenShake.duration);
    const shakeX = (Math.random() - 0.5) * intensity;
    const shakeY = (Math.random() - 0.5) * intensity;
    this.ctx.translate(shakeX, shakeY);
}
```

### Explosion Phase System
```javascript
// Atomic explosion state machine
switch(explosion.phase) {
    case 'initial':   // Fireball expansion
    case 'expanding': // Stem formation
    case 'mushroom':  // Cap development
}
```

## Asset Management

### Image Loading System
```javascript
// Sara Netanyahu photo integration
this.saraImage = new Image();
this.saraImage.onload = successHandler;
this.saraImage.onerror = fallbackHandler;
this.saraImage.src = base64DataURL;
```

### Fallback Mechanisms
- **Image Loading**: Photo → Drawn portrait
- **Explosion Effects**: Atomic → Regular explosion
- **UI Elements**: Advanced → Basic fallbacks

## Debug & Development Tools

### Console Logging System
- Game initialization tracking
- Event listener setup confirmation
- Error reporting with context
- Performance monitoring points

### Debug Functions
```javascript
window.testStartButton();   // Button functionality test
window.forceStartGame();    // Direct game launch
```

## Browser Compatibility

### Modern Features Used
- HTML5 Canvas API
- ES6 Classes and Arrow Functions
- CSS3 Gradients and Animations
- Local Storage (for future features)

### Fallback Strategies
- Graceful degradation for missing features
- Error boundaries around critical code
- Console warnings for unsupported operations

## Game Mechanics

### Core Gameplay Loop
- Player launches missiles at Iranian nuclear facilities
- Iranian defense systems launch interceptors at player missiles
- Iranian offensive systems launch counterattacks at the Israeli base
- Player must destroy all targets while protecting their base

### Combat Mechanics
- **Israeli Offensive**: Player-controlled missile launches with trajectory/power aiming
- **Iranian Defensive**: Interceptor missiles that target player projectiles
- **Iranian Offensive**: Counterattack missiles that target the Israeli base
- **Dynamic Difficulty**: Enemy accuracy and attack frequency increase as time progresses

### Health System
- Target facilities have individual health pools (100 health points)
- Israeli base has a health pool (100 health points)
- Weapons deal variable damage based on type
- Iranian missiles deal 10-20 damage to the Israeli base

### Victory & Defeat Conditions
- **Victory**: Destroy all Iranian nuclear facilities
- **Defeat**: Israeli base is destroyed by counterattacks OR time expires
