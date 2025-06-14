# Technical Context - Operation Rising Lion

## Technology Stack

### Core Technologies
- **HTML5**: Structure and Canvas element for game rendering
- **CSS3**: Styling, animations, and flag designs
- **JavaScript (ES6+)**: Game logic, physics, and interaction handling
- **Canvas 2D API**: Real-time graphics rendering and effects

### Browser APIs Used
- **Canvas 2D Context**: Graphics rendering and animation
- **RequestAnimationFrame**: Smooth game loop timing
- **Event Listeners**: Mouse and keyboard input handling
- **Image API**: Photo loading and fallback systems
- **Console API**: Debug output and error reporting

## Development Setup

### File Structure
```
/Users/mschwartzman/Documents/Code/RisingLion/
├── index.html              # Main game interface
├── game.js                 # Core game logic (2000+ lines)
├── styles.css              # Visual styling and animations
├── image-converter.html    # Base64 conversion utility
├── PRD.md                  # Product Requirements Document
├── MEMORY_BANK.md          # Original project documentation
├── TECHNICAL_DETAILS.md    # Implementation details
├── memory-bank/            # Structured memory system
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── activeContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   └── progress.md
└── .github/
    └── custom-instructions.md
```

### Development Workflow
1. **Direct file editing**: No build process required
2. **Browser testing**: Open index.html directly in browser
3. **Debug tools**: Browser developer console for troubleshooting
4. **Image conversion**: Use image-converter.html for base64 encoding

## Technical Constraints

### Performance Requirements
- **Target framerate**: 60 FPS during gameplay
- **Memory usage**: Minimal allocation/deallocation to prevent GC pauses
- **Particle limits**: Maximum 50 atomic debris, 25 smoke particles
- **Render optimization**: Skip off-screen object rendering

### Browser Compatibility
- **Minimum support**: Modern browsers with Canvas 2D support
- **ES6 features**: Classes, arrow functions, const/let declarations
- **Fallback strategy**: Graceful degradation for unsupported features
- **Testing targets**: Chrome, Firefox, Safari, Edge (latest versions)

### Resource Limitations
- **No external CDNs**: All code contained within project files
- **Image embedding**: Base64 encoding for photo integration
- **Asset management**: Programmatic generation of visual elements
- **File size**: Keep individual files under 100KB for fast loading

## Dependencies

### External Libraries
**None** - Project intentionally uses only vanilla web technologies

### Browser APIs
- **Canvas 2D Context**: Core rendering system
- **Event API**: Input handling and UI interaction
- **Image API**: Photo loading with error handling
- **Animation API**: RequestAnimationFrame for smooth timing

### Development Tools
- **Text editor**: Any modern code editor (VS Code, Sublime, etc.)
- **Web browser**: For testing and debugging
- **Image editor**: For preparing Sara Netanyahu photo (optional)
- **Base64 converter**: Included image-converter.html utility

## Implementation Details

### Code Architecture
```javascript
// Main class structure
class OperationRisingLion {
    constructor() {
        // Game state initialization
        // Canvas and context setup
        // Object array initialization
        // Event listener binding
    }
    
    // Game loop
    gameLoop() { /* update → render cycle */ }
    
    // Core systems
    update() { /* physics and AI */ }
    render() { /* visual output */ }
    
    // Input handling
    handleInput() { /* mouse and keyboard */ }
    
    // Utility methods
    debug() { /* troubleshooting tools */ }
}
```

### Data Structures
- **Arrays**: Primary storage for game objects
- **Objects**: Entity definitions with properties and methods
- **Constants**: Configuration values and game parameters
- **Flags**: Boolean state tracking throughout game

### Memory Management
- **Object pooling**: Reuse particles and effects where possible
- **Array filtering**: Regular cleanup of expired objects
- **Reference cleanup**: Clear large objects when no longer needed
- **Event management**: Proper listener addition/removal

## Configuration Management

### Game Parameters
```javascript
// Centralized in game.js constructor
const CONFIG = {
    GRAVITY: 0.2,
    MISSILE_SPEED: 8,
    AIRCRAFT_SPEED: 3,
    PARTICLE_LIMITS: { atomic: 50, smoke: 25 },
    GAME_DURATION: 180000, // 3 minutes
    SCREEN_SHAKE_INTENSITY: 20
};
```

### Visual Constants
- **Colors**: Hex codes for flags, explosions, UI elements
- **Dimensions**: Canvas size, object sizes, collision radii
- **Timing**: Animation durations, effect lifespans
- **Positions**: Target locations, UI element placement

## Development Practices

### Code Quality
- **Consistent naming**: camelCase for variables, PascalCase for classes
- **Error handling**: Try-catch blocks around critical operations
- **Documentation**: Inline comments for complex algorithms
- **Modular design**: Clear separation of concerns within single file

### Testing Strategy
- **Manual testing**: Browser-based functional testing
- **Debug functions**: Console-accessible test methods
- **Error monitoring**: Console logging for issue identification
- **Performance profiling**: Browser dev tools for optimization

### Maintenance Approach
- **Documentation first**: Update memory bank before code changes
- **Incremental updates**: Small, focused changes with immediate testing
- **Backwards compatibility**: Maintain existing functionality while adding features
- **Error resilience**: Defensive programming to handle edge cases

## Bug Fixes and Optimizations

### Critical Bug Fixes
- **Target Health Null Checks (2025-06-13)**
  - **Issue**: Game crashed with "Cannot read properties of undefined (reading 'health')" errors in `updateHUD` when trying to access target health
  - **Root Cause**: Accessing target properties before they were fully initialized or after they were destroyed
  - **Solution**: 
    - Added comprehensive null checks in `updateHUD()` to verify targets exist before accessing properties
    - Created a `safelyUpdateHUD()` wrapper method to only update when game is in "playing" state
    - Added validation in target initialization to ensure proper object structure
    - Enhanced collision detection with additional safety checks
    - Added robust error handling throughout the codebase
  - **Commit**: 58d531e "Fix game crash: Add null checks to prevent 'Cannot read properties of undefined' errors in updateHUD and target handling"
