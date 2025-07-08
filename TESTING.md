# E2E Testing Quick Start

## Installation
```bash
npm install
npx playwright install
```

## Running Tests
```bash
# Run all tests
npm test

# Run with browsers visible
npm run test:headed

# Run specific test file
npx playwright test 01-navigation

# Run for specific browser
npx playwright test --project=chromium
```

## Test Coverage
✅ **Menu Navigation** - UI interactions and screen transitions  
✅ **Core Gameplay** - Weapon selection, firing mechanics, game state  
✅ **Cross-Browser** - Compatibility across Chrome, Firefox, Safari  
✅ **Mobile Support** - Touch interactions and responsive behavior  
✅ **Error Handling** - Rapid interactions and edge cases  

## Framework
- **Playwright** - Cross-browser E2E testing
- **Page Object Model** - Maintainable test structure
- **CommonJS** - Node.js compatibility

Total: **50+ test scenarios** across **5 browsers/devices**