# End-to-End Testing for Operation Rising Lion

This document describes the comprehensive end-to-end testing suite for the Operation Rising Lion game.

## Overview

The testing suite includes:
- ✅ Automated browser testing with Playwright
- ✅ Interactive browser-based test runner
- ✅ Manual testing capabilities
- ✅ Performance and stability validation
- ✅ Cross-browser compatibility testing

## Test Coverage

### 1. Game Initialization
- DOM element presence and visibility
- Game instance creation
- Initial state validation
- Canvas and HUD setup

### 2. Menu Navigation
- Screen transitions (menu ↔ instructions)
- Button functionality
- UI state management

### 3. Game Start and State Management
- Game initialization process
- State transitions (menu → playing)
- Target and platform initialization
- Timer and scoring system

### 4. Weapon Systems
- Weapon selection and switching
- Projectile creation and physics
- Firing mechanics and trajectory
- Inventory management

### 5. Collision Detection
- Hit detection algorithms
- Damage calculation
- Target destruction mechanics
- Score updates

### 6. Game Mechanics
- HUD updates and display
- Victory/defeat conditions
- Game loop performance
- Rendering system

### 7. Performance and Stability
- Frame rate consistency (60fps target)
- Memory management
- Error handling
- Cross-browser compatibility

### 8. Interactive Features
- Mouse/touch input handling
- Canvas interaction
- Aiming system
- Power adjustment

## Running the Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers (if needed)
npx playwright install
```

### Automated Testing (Playwright)

```bash
# Run all tests
npm test

# Run tests with visible browser
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Open Playwright UI for interactive testing
npm run test:ui

# View test report
npm run test:report
```

### Interactive Browser Testing

```bash
# Start the game server
npm run serve

# Open the test runner in browser
# Navigate to: http://localhost:8080/test-runner.html
```

### Manual Testing

```bash
# Start the game server
npm start

# Open the game in browser
# Navigate to: http://localhost:8080
```

## Test Structure

### Automated Tests (`tests/e2e.spec.js`)
- **Game Initialization and DOM Elements**: Validates basic setup
- **Menu Navigation**: Tests screen transitions
- **Game Start Functionality**: Validates game initialization
- **Weapon Selection and UI**: Tests weapon systems
- **Canvas Interaction and Aiming**: Validates input handling
- **Projectile Creation and Physics**: Tests game mechanics
- **Game Loop and Rendering**: Performance validation
- **HUD Updates and Game State**: UI functionality
- **Victory Condition Testing**: End game scenarios
- **Debug Functions Availability**: Development tools
- **Error Handling and Stability**: Edge cases
- **Performance and Memory**: Optimization validation
- **Full Game Playthrough Simulation**: Complete gameplay test

### Interactive Test Suite (`test-e2e.js`)
- Comprehensive test class with detailed assertions
- Real-time test execution and reporting
- Performance benchmarking
- Error boundary testing

### Browser Test Runner (`test-runner.html`)
- Visual test interface
- Real-time test output
- Test summary and statistics
- Game frame integration

## Test Results and Reporting

### Automated Test Reports
- HTML report: `playwright-report/index.html`
- JSON results: `test-results.json`
- Screenshots on failure
- Video recordings for debugging

### Interactive Test Results
- Real-time console output
- Pass/fail statistics
- Performance metrics
- Error logging

## Continuous Integration

The test suite is designed to run in CI/CD environments:

```yaml
# Example GitHub Actions workflow
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Debug Functions

The game includes built-in debug functions for testing:

```javascript
// Available in browser console
window.testStartButton();    // Test start button functionality
window.forceStartGame();     // Force game start
window.game.render();        // Manual render call
window.game.fireWeapon(x1, y1, x2, y2);  // Manual weapon firing
```

## Performance Benchmarks

Expected performance metrics:
- **Frame Rate**: 60fps consistently
- **Memory Usage**: Stable, no leaks
- **Render Time**: <16.67ms average
- **Load Time**: <2 seconds on modern browsers

## Browser Compatibility

Tested browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Chrome
- ✅ Mobile Safari

## Troubleshooting

### Common Issues

1. **Tests failing to start**
   - Ensure server is running on port 8080
   - Check firewall/proxy settings

2. **Game not loading in tests**
   - Verify all game files are present
   - Check browser console for errors

3. **Performance tests failing**
   - Run on a machine with adequate resources
   - Close other applications during testing

4. **Cross-browser issues**
   - Update browser versions
   - Check for browser-specific bugs

### Debug Mode

Run tests in debug mode for detailed inspection:

```bash
npm run test:debug
```

This will:
- Open browser in headed mode
- Pause on failures
- Allow live interaction
- Provide detailed error messages

## Contributing

When adding new features:
1. Add corresponding test cases
2. Update this documentation
3. Ensure all tests pass
4. Test across supported browsers

## File Structure

```
/
├── tests/
│   └── e2e.spec.js          # Playwright test suite
├── test-e2e.js              # Interactive test class
├── test-runner.html         # Browser test interface
├── playwright.config.js     # Playwright configuration
├── package.json             # Dependencies and scripts
└── TESTING.md              # This documentation
```