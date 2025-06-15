# Project Brief - Operation Rising Lion

## Project Definition
**Operation Rising Lion** is a web-based arcade strategy game inspired by classic Worms-style gameplay mechanics. The game simulates a military conflict scenario where players control Israeli forces attacking Iranian nuclear facilities using various weapons while defending against interception systems.

## Core Requirements

### Gameplay Mechanics
- **Trajectory-based combat**: Mouse-controlled aiming with power adjustment
- **Weapon variety**: Standard missiles, guided missiles, aircraft, cruise missiles
- **Defense systems**: AI-controlled interceptor missiles
- **Target destruction**: Two nuclear facilities (Nataz and Bohasher)
- **Time-limited missions**: 180-second gameplay sessions

### Visual Requirements
- **Israeli side**: Blue and white flag, F-16 fighter aircraft with Sara Netanyahu as pilot
- **Iranian side**: Green/white/red flag, realistic nuclear facility designs
- **Special effects**: Atomic explosion animations with mushroom clouds
- **Character integration**: Literal photo of Sara Netanyahu as pilot character

### Technical Constraints
- **Platform**: Web browser (HTML5/CSS/JavaScript)
- **No external dependencies**: Pure vanilla JavaScript implementation
- **Performance**: Smooth 60fps gameplay with particle effects
- **Compatibility**: Modern browser support with graceful degradation

## Success Criteria
1. **Playable game loop**: Start → Aim → Fire → Hit/Miss → Victory/Defeat
2. **Visual authenticity**: Realistic nuclear facilities and character representation
3. **Engaging effects**: Satisfying explosion animations and screen shake
4. **Stable performance**: No crashes or memory leaks during gameplay
5. **Complete UI**: Intuitive controls and clear game state feedback

## Project Scope
- **In scope**: Single-player arcade game with specified theme and mechanics
- **Out of scope**: Multiplayer, campaign mode, mobile optimization, sound effects
- **Future considerations**: Additional weapons, levels, and enhanced features

## Constraints & Considerations
- **Thematic sensitivity**: Military simulation game with real-world references
- **Image usage**: Integration of actual photograph with proper fallback systems
- **Performance limits**: Browser-based particle systems and animations
- **Code maintainability**: Clear documentation and error handling required

Created: June 13, 2025
