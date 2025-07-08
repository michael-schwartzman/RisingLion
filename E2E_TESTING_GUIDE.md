# End-to-End Testing Guide

## Overview

This document provides comprehensive instructions for running, maintaining, and extending the end-to-end (E2E) testing suite for Operation Rising Lion.

## Testing Framework

We use **Playwright** for E2E testing, which provides:
- Cross-browser testing (Chromium, Firefox, Safari)
- Mobile device simulation
- Screenshot and video recording on failures
- Parallel test execution
- Built-in waiting and retry mechanisms

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- Python 3 (for local development server)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suite
```bash
npx playwright test navigation.spec.js
npx playwright test game-functionality.spec.js
npx playwright test mobile-responsiveness.spec.js
npx playwright test error-handling.spec.js
```

### Headed Mode (with browser UI)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### Test Reports
```bash
npm run test:report
```

## Test Structure

### Test Suites

1. **Smoke Tests** (`smoke.spec.js`)
   - Basic application load
   - Console error detection
   - Critical path verification

2. **Navigation Tests** (`navigation.spec.js`)
   - Menu → Instructions → Back
   - Menu → Game screen
   - Screen transitions

3. **Game Functionality** (`game-functionality.spec.js`)
   - Game initialization
   - HUD elements display
   - Weapon selection
   - Canvas interactions
   - Timer updates

4. **Mobile Responsiveness** (`mobile-responsiveness.spec.js`)
   - Landscape orientation prompts
   - Touch interactions
   - Canvas adaptation
   - Mobile HUD display

5. **Error Handling** (`error-handling.spec.js`)
   - Missing elements graceful handling
   - Network error resilience
   - Rapid clicking protection
   - Window resize handling

### Page Object Models

Located in `tests/pages/`:

- `MainMenuPage.js` - Main menu interactions
- `InstructionsPage.js` - Instructions screen
- `GamePage.js` - Game screen and gameplay
- `GameOverPage.js` - Game over screen

## Test Coverage

### Core User Flows ✅
- [x] Application startup and main menu display
- [x] Navigation between screens
- [x] Game initialization and HUD display
- [x] Basic game interactions (weapon selection, canvas clicks)
- [x] Mobile responsiveness and orientation handling
- [x] Error handling and edge cases

### Browser Coverage
- [x] Chromium (Desktop)
- [x] Mobile Chrome (Pixel 5 simulation)
- [ ] Firefox (Desktop) - *Optional*
- [ ] Safari/WebKit (Desktop) - *Optional*
- [ ] Mobile Safari (iPhone) - *Optional*

## CI/CD Integration

### GitHub Actions Workflow

The E2E tests run automatically on:
- Push to `main` or `development` branches
- Pull requests to `main` or `development` branches

**Workflow file:** `.github/workflows/e2e-tests.yml`

### Artifacts
- Test reports (HTML format)
- Screenshots on failure
- Videos on failure
- Test results (JSON/XML)

## Configuration

### Playwright Config (`playwright.config.js`)

Key settings:
- **Base URL:** `http://localhost:8000`
- **Parallel execution:** Enabled
- **Retries:** 2 on CI, 0 locally
- **Screenshots:** On failure only
- **Videos:** On failure only

### Test Environment

Tests run against a local Python HTTP server that serves the static files.

## Writing New Tests

### Best Practices

1. **Use Page Object Models**
   ```javascript
   import { MainMenuPage } from './pages/MainMenuPage.js';
   
   const mainMenu = new MainMenuPage(page);
   await mainMenu.goto();
   await mainMenu.startGame();
   ```

2. **Wait for Elements**
   ```javascript
   await expect(page.locator('#element')).toBeVisible();
   ```

3. **Test User Flows, Not Implementation**
   ```javascript
   // Good: Test user behavior
   await mainMenu.startGame();
   await gameScreen.verifyIsActiveScreen();
   
   // Avoid: Testing internal implementation
   await page.evaluate(() => window.game.startGame());
   ```

4. **Handle Async Operations**
   ```javascript
   await gameScreen.waitForGameInitialization();
   ```

### Adding New Test Files

1. Create file in `tests/` directory with `.spec.js` suffix
2. Import required page objects
3. Use descriptive test names
4. Group related tests in `test.describe()` blocks

### Adding New Page Objects

1. Create file in `tests/pages/` directory
2. Export class with constructor taking `page` parameter
3. Define selectors as properties
4. Create action methods (`click`, `type`, etc.)
5. Create verification methods (`verify*`, `waitFor*`)

## Troubleshooting

### Common Issues

1. **Test timeouts**
   - Increase timeout in test or config
   - Add explicit waits for dynamic content

2. **Element not found**
   - Check selector accuracy
   - Wait for element to be attached/visible
   - Verify element exists in current game state

3. **Flaky tests**
   - Add proper waits instead of fixed timeouts
   - Use `expect` with retry logic
   - Check for race conditions

### Debug Mode

Run tests in debug mode to step through:
```bash
npx playwright test --debug navigation.spec.js
```

### Trace Viewer

View test execution traces:
```bash
npx playwright show-trace test-results/*/trace.zip
```

## Maintenance

### Regular Tasks

1. **Update dependencies** (monthly)
   ```bash
   npm update
   npx playwright install
   ```

2. **Review test coverage** (quarterly)
   - Check for new features without tests
   - Remove tests for deprecated features

3. **Performance optimization** (as needed)
   - Reduce test execution time
   - Optimize page object methods

### Extending Test Coverage

Priority areas for future test expansion:

1. **Game Logic Testing**
   - Collision detection
   - Scoring system
   - Level progression
   - Victory/defeat conditions

2. **Performance Testing**
   - Frame rate monitoring
   - Memory usage
   - Load time measurements

3. **Accessibility Testing**
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast

4. **Security Testing**
   - XSS prevention
   - Input validation

## Monitoring and Reporting

### Test Results

- **Local:** HTML report automatically opens
- **CI:** Artifacts uploaded to GitHub Actions
- **Failures:** Screenshots and videos captured

### Metrics to Monitor

- Test execution time
- Flaky test frequency
- Browser compatibility issues
- Performance regressions

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Configuration Options](https://playwright.dev/docs/test-configuration)