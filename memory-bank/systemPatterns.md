# System Patterns - Operation Rising Lion

## Architecture Overview

### Core System Design
The game follows a **single-class monolithic** pattern with clear method separation by responsibility:

```
OperationRisingLion (Main Class)
├── Game State Management
├── Physics & Movement Systems  
├── Combat & Weapons Systems
├── Visual Effects & Rendering
├── UI & Event Handling
└── Utility & Debug Functions
```

### Key Technical Decisions

#### 1. Canvas-Based Rendering
**Pattern**: Direct Canvas 2D API manipulation
**Rationale**: Maximum performance and control for real-time graphics
**Implementation**: Single canvas element with manual render loop

#### 2. Entity Component System (Implicit)
**Pattern**: Object arrays with shared update/render cycles
**Components**:
- `projectiles[]` - All flying objects (missiles, aircraft)
- `explosions[]` - Visual effects and particles
- `interceptors[]` - AI defense systems
- `targets[]` - Destructible facilities

#### 3. Game Loop Architecture
```javascript
gameLoop() {
    update();    // Physics, AI, collision detection
    render();    // Visual output and effects
    requestAnimationFrame(gameLoop);
}
```

## Component Relationships

### Data Flow Patterns
```
User Input → Game State → Physics Update → Collision Check → Visual Effects → Render
```

### Object Lifecycle Management
1. **Creation**: Objects added to appropriate arrays
2. **Update**: Modified each frame based on physics/AI
3. **Collision**: Detected and resolved with appropriate effects
4. **Cleanup**: Removed when life expires or destroyed

### Memory Management Pattern
```javascript
// Defensive filtering pattern used throughout
this.objects = this.objects.filter(obj => {
    if (!obj || obj.life === undefined) return false;
    // Update logic here
    return obj.life > 0; // Keep alive objects
});
```

## Design Patterns in Use

### 1. Strategy Pattern - Weapon Systems
Different weapon types with shared interface but unique behaviors:
- **Standard Missile**: Basic ballistic trajectory
- **Guided Missile**: Mid-flight course correction
- **Aircraft**: Complex movement with bombing capability
- **Cruise Missile**: Low-altitude flight path

### 2. Observer Pattern - Event Handling
```javascript
// Centralized event management
setupEventListeners() {
    canvas.addEventListener('mousedown', this.startAiming.bind(this));
    canvas.addEventListener('mousemove', this.updateAiming.bind(this));
    canvas.addEventListener('mouseup', this.fireWeapon.bind(this));
}
```

### 3. Factory Pattern - Object Creation
Consistent object creation with proper initialization:
```javascript
createProjectile(type, x, y, vx, vy) {
    return {
        x, y, vx, vy, type,
        life: this.getLifeForType(type),
        trail: [],
        // Type-specific properties
    };
}
```

### 4. State Machine - Game Flow
```javascript
// Screen-based state management
gameState: 'menu' | 'playing' | 'victory' | 'defeat'
showScreen(screenName) {
    // Hide all screens
    // Show target screen
    // Update game state
}
```

## System Integration Points

### Physics Integration
- **Gravity system**: Consistent acceleration applied to all projectiles
- **Collision detection**: Spatial partitioning for performance
- **Trajectory calculation**: Real-time ballistic computation

### Visual System Integration
- **Layered rendering**: Background → Targets → Projectiles → Effects → UI
- **Effect synchronization**: Visual effects triggered by game events
- **Animation timing**: Coordinated with game loop for smooth motion

### AI System Integration
- **Defensive responses**: Triggered by proximity and threat assessment
- **Timing coordination**: AI actions synchronized with player actions
- **Difficulty scaling**: Response intensity based on game progression

## Error Handling Patterns

### Defensive Programming
```javascript
// Null safety pattern used throughout
if (element && typeof element.method === 'function') {
    try {
        element.method();
    } catch (error) {
        console.warn('Method failed, using fallback');
        fallbackMethod();
    }
}
```

### Graceful Degradation
- **Image loading**: Photo → Drawn portrait fallback
- **Effect rendering**: Complex → Simple effect fallback
- **UI elements**: Advanced → Basic control fallback

## Performance Patterns

### Optimization Strategies
1. **Object pooling**: Reuse explosion and particle objects
2. **Culling**: Skip rendering for off-screen objects
3. **Batching**: Group similar render operations
4. **Throttling**: Limit particle counts and effect complexity

### Memory Leak Prevention
- **Array cleanup**: Regular filtering of expired objects
- **Event listener management**: Proper removal on state changes
- **Reference clearing**: Explicit null assignment for large objects

## Development Patterns

### Code Organization
- **Method grouping**: Related functionality kept together
- **Clear naming**: Descriptive method and variable names
- **Comment strategy**: Explain complex algorithms and decisions
- **Consistent formatting**: Uniform code style throughout

### Debug Integration
- **Console logging**: Strategic debug output for troubleshooting
- **Debug functions**: Direct access functions for testing
- **Error reporting**: Detailed error context for problem resolution
