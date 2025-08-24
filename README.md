# Operation Rising Lion 🦁

A web-based arcade strategy game featuring classic Worms-style gameplay mechanics with a modern twist.

## 🎮 Game Overview

Operation Rising Lion is an interactive browser-based game where players control Israeli forces attacking Iranian nuclear facilities using various weapons while defending against AI-controlled interception systems. The game features realistic visual effects, character integration, and compelling gameplay mechanics.

## ✨ Features

### Core Gameplay
- **Trajectory-based Combat**: Mouse-controlled aiming with power adjustment
- **Multiple Weapon Types**: Standard missiles, guided missiles, aircraft, cruise missiles
- **AI Defense Systems**: Dynamic interceptor missiles that respond to threats
- **Realistic Targets**: Detailed nuclear facility designs with damage systems
- **Time-Limited Missions**: 180-second gameplay sessions

### Visual Effects
- **Atomic Explosions**: Multi-phase mushroom cloud animations
- **Screen Shake**: Dynamic camera effects during major explosions
- **Particle Systems**: Debris, smoke, and radiation effects
- **Authentic Flags**: Accurate Israeli and Iranian flag representations
- **Character Integration**: Sara Netanyahu as F-16 pilot character

### Technical Features
- **Pure Web Technologies**: HTML5, CSS3, and vanilla JavaScript
- **60fps Performance**: Smooth gameplay with optimized rendering
- **Error Handling**: Robust defensive programming and graceful degradation
- **Browser Compatible**: Works across modern browsers without dependencies

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/michael-schwartzman/RisingLion.git
   cd RisingLion
   ```

2. **Open the game**:
   - Simply open `index.html` in your web browser
   - No build process or server required!

3. **Play the game**:
   - Use mouse to aim and set power
   - Select weapons from dropdown menu
   - Destroy both nuclear facilities to win
   - Avoid interceptor missiles

## 🎯 Controls

- **Mouse**: Aim and set firing power
- **Keyboard Shortcuts**: 
  - `1-4`: Select weapon types
  - `Space`: Deploy aircraft
- **UI**: Click buttons for weapon selection and game controls

## 📁 Project Structure

```
RisingLion/
├── index.html              # Main game interface
├── game.js                 # Core game logic (2000+ lines)
├── styles.css              # Visual styling and animations
├── image-converter.html    # Base64 conversion utility
├── PRD.md                  # Product Requirements Document
├── MEMORY_BANK.md          # Project documentation
├── TECHNICAL_DETAILS.md    # Implementation details
├── memory-bank/            # Structured documentation
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── activeContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   └── progress.md
└── .github/
    └── custom-instructions.md
```

## 🛠 Development

### Technologies Used
- **HTML5 Canvas**: Real-time graphics rendering
- **CSS3**: Styling and animations
- **JavaScript ES6+**: Game logic and physics
- **No External Dependencies**: Pure web stack

### Key Components
- **Game Engine**: `OperationRisingLion` class with modular design
- **Physics System**: Ballistic trajectories and collision detection
- **Rendering Pipeline**: Layered canvas rendering with effects
- **AI Systems**: Defensive countermeasures and threat assessment

## 📚 Documentation

Comprehensive documentation is available in the `memory-bank/` directory:

- **Project Brief**: Core requirements and scope
- **Product Context**: Purpose and user experience goals
- **System Patterns**: Architecture and design patterns
- **Technical Context**: Technologies and constraints
- **Progress**: Current status and completion metrics
- **Active Context**: Current work focus and next steps

## 🎨 Character Integration

The game features Sara Netanyahu as the F-16 pilot character. To use her actual photo:

1. Use `image-converter.html` to convert a photo to base64
2. Update the base64 string in `game.js`
3. The game includes a fallback drawn portrait system

## 🏆 Game Objectives

- **Primary Goal**: Destroy both Nataz and Bohasher nuclear facilities
- **Secondary Goals**: Maximize score through accuracy and efficiency
- **Challenge**: Overcome AI defense systems and time constraints
- **Victory Condition**: Complete facility destruction within 180 seconds

## 🔧 Troubleshooting

- **Game won't start**: Check browser console for errors
- **Performance issues**: Reduce browser zoom or close other tabs
- **Debug access**: Use `testStartButton()` or `forceStartGame()` in console

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

This is a complete, functional game. Future enhancements could include:
- Sound effects and music
- Additional weapon types
- Campaign mode with multiple levels
- Multiplayer functionality
- Mobile touch controls

---

**Created**: June 13, 2025  
**Repository**: https://github.com/michael-schwartzman/RisingLion
# AKS Deployment Trigger - Sun Aug 24 15:02:20 IDT 2025
