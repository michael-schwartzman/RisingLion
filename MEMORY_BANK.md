# Operation Rising Lion - Memory Bank

## Project Overview
- **Game Name**: Operation Rising Lion
- **Type**: Web-based arcade strategy game (Worms-style gameplay)
- **Platform**: HTML5/JavaScript/CSS
- **Theme**: Israeli vs Iranian nuclear facilities conflict simulation
- **Created**: June 13, 2025

## Game Concept
A classic arcade-style game where players launch missiles and deploy aircraft to attack Iranian nuclear facilities while avoiding interception systems. Features Israeli aircraft with Sara Netanyahu as pilot character.

## Technical Architecture

### Core Files
1. **index.html** - Main game interface with screens and HUD
2. **game.js** - Complete game logic and rendering engine
3. **styles.css** - Visual styling with flag designs and animations
4. **PRD.md** - Product Requirements Document
5. **image-converter.html** - Tool for converting Sara Netanyahu photo to base64

### Key Classes & Components
- `OperationRisingLion` - Main game class
- Canvas-based rendering system
- Physics engine with ballistic trajectories
- AI defense systems with interceptor missiles
- Particle system for explosions and effects

## Game Features Implemented

### Weapons Arsenal
- **Standard Missiles** (Unlimited) - Basic ballistic projectiles
- **Guided Missiles** (5) - Mid-flight trajectory adjustment
- **Aircraft** (3) - Fighter jets with bombing capability
- **Cruise Missiles** (2) - Low-altitude, harder to intercept

### Targets
- **Nataz Nuclear Facility** - Primary target with cooling towers
- **Bohasher Nuclear Complex** - Secondary target with security perimeter
- Both facilities feature detailed nuclear infrastructure design

### Special Effects
- **Atomic Explosions** - Multi-phase mushroom cloud animations
- **Screen Shake** - Camera shake during major explosions
- **Particle Systems** - Debris, smoke, and radiation effects
- **Flash Effects** - Intense white flash on nuclear destruction

### Visual Elements
- **Israeli Flag** - Left side with Star of David
- **Iranian Flag** - Right side with proper color scheme
- **Sara Netanyahu Character** - Detailed pilot portrait in F-16 cockpit
- **Nuclear Facility Design** - Realistic industrial complex appearance

## Character Integration
### Sara Netanyahu as Pilot
- **Visual Representation**: Blonde hair, proper facial features based on provided photo
- **Military Integration**: F-16 fighter jet pilot with helmet and visor
- **Image System**: Base64 photo embedding with fallback drawn portrait
- **Identification**: Name tag "S. NETANYAHU" on uniform

## Technical Challenges Solved

### Performance Issues
- **Array Collision Detection** - Fixed index shifting during forEach loops
- **Explosion Memory Leaks** - Added proper cleanup and bounds checking
- **Particle Optimization** - Reduced particle counts to prevent lag

### Game Stability
- **Error Handling** - Try-catch blocks around critical functions
- **Null Safety** - Defensive programming for missing elements
- **DOM Loading** - Proper event listener timing

### Button Functionality
- **Event Listener Setup** - Robust DOM-ready checking
- **Debug Functions** - Backup methods for troubleshooting
- **Console Logging** - Comprehensive debugging output

## Game Mechanics

### Physics System
- **Gravity**: Realistic ballistic trajectories
- **Air Resistance**: Different for various projectile types
- **Collision Detection**: Pixel-perfect hit detection
- **Trajectory Visualization**: Aiming line with power meter

### Defense Systems
- **Interceptor Missiles** - AI-controlled counter-attacks
- **Defense Zones** - Area-based protection around facilities
- **Cooldown System** - Prevents spam of defensive measures

### Scoring System
- **Direct Hits**: 100 points
- **Splash Damage**: 25-75 points based on proximity
- **Facility Destruction**: 500 points bonus
- **Time Bonus**: Remaining time × 10
- **Accuracy Bonus**: Hit percentage × 500

## User Interface

### HUD Elements
- **Score Display** - Real-time score updates
- **Timer** - Mission countdown (180 seconds)
- **Target Health Bars** - Visual facility health status
- **Weapon Selection** - Dropdown with remaining counts
- **Flag Displays** - Mini flags for both sides

### Control Scheme
- **Mouse Aiming** - Click and drag for trajectory/power
- **Keyboard Shortcuts** - 1-4 for weapon selection, Space for aircraft
- **Power Meter** - Visual feedback for launch strength
- **Weapon Limits** - Inventory management system

## Known Issues & Solutions

### Fixed Bugs
1. **Game Crashes on Nuclear Hit** - ✅ Solved with error handling
2. **Button Not Working** - ✅ Fixed DOM loading timing
3. **Array Index Errors** - ✅ Reverse iteration in collision detection
4. **Memory Leaks** - ✅ Proper object cleanup

### Current Status
- ✅ Fully playable game
- ✅ All core features implemented
- ✅ Visual effects working
- ✅ Character integration complete
- ✅ Performance optimized

## File Dependencies
```
index.html
├── styles.css (styling)
├── game.js (logic)
└── image-converter.html (utility)
```

## Development Notes
- Game uses HTML5 Canvas for rendering
- No external libraries required
- Compatible with modern browsers
- Responsive design considerations included
- Debug functions available for troubleshooting

## Future Enhancement Ideas
- Multiplayer functionality
- Campaign mode with multiple levels
- Advanced weapon upgrades
- Destructible terrain
- Sound effects and music
- Mobile touch controls optimization
