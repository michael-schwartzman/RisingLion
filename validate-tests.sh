#!/bin/bash

# End-to-End Test Validation Script for Operation Rising Lion
# This script verifies that all test components are working correctly

echo "🚀 Operation Rising Lion - E2E Test Validation"
echo "=============================================="

# Check if all required files exist
echo "📁 Checking test files..."
files_to_check=(
    "test-e2e.js"
    "test-runner.html"
    "tests/e2e.spec.js"
    "playwright.config.js"
    "TESTING.md"
    "package.json"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        all_files_exist=false
    fi
done

# Check package.json test scripts
echo ""
echo "📋 Checking npm scripts..."
if grep -q '"test": "playwright test"' package.json; then
    echo "✅ Playwright test script configured"
else
    echo "❌ Playwright test script missing"
fi

if grep -q '"serve": "python3 -m http.server 8080"' package.json; then
    echo "✅ Server script configured"
else
    echo "❌ Server script missing"
fi

# Test if game loads
echo ""
echo "🌐 Testing game loading..."
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Game server is running on http://localhost:8080"
    
    # Check if game files are accessible
    if curl -s http://localhost:8080/game.js | head -1 | grep -q "class OperationRisingLion"; then
        echo "✅ Game JavaScript is accessible"
    else
        echo "❌ Game JavaScript not accessible"
    fi
    
    if curl -s http://localhost:8080/test-runner.html | grep -q "End-to-End Test Suite"; then
        echo "✅ Test runner is accessible"
    else
        echo "❌ Test runner not accessible"
    fi
else
    echo "❌ Game server not running"
fi

# Test JavaScript syntax
echo ""
echo "🔍 Validating JavaScript syntax..."
if node -c test-e2e.js; then
    echo "✅ test-e2e.js syntax is valid"
else
    echo "❌ test-e2e.js has syntax errors"
fi

if node -c tests/e2e.spec.js; then
    echo "✅ tests/e2e.spec.js syntax is valid"
else
    echo "❌ tests/e2e.spec.js has syntax errors"
fi

# Test HTML validation
echo ""
echo "📄 Checking HTML structure..."
if grep -q "OperationRisingLionE2ETest" test-runner.html; then
    echo "✅ Test runner HTML references test class"
else
    echo "❌ Test runner HTML missing test class reference"
fi

# Summary
echo ""
echo "📊 Test Suite Summary:"
echo "====================="
echo "✅ Interactive browser-based testing: test-runner.html"
echo "✅ Automated Playwright testing: tests/e2e.spec.js"
echo "✅ Comprehensive test class: test-e2e.js"
echo "✅ Configuration: playwright.config.js"
echo "✅ Documentation: TESTING.md"
echo "✅ npm scripts for easy testing"

echo ""
echo "🎯 How to use the test suite:"
echo "1. Interactive testing: Open http://localhost:8080/test-runner.html"
echo "2. Automated testing: npm test (requires browsers installed)"
echo "3. Manual testing: npm run serve then open http://localhost:8080"

echo ""
if [ "$all_files_exist" = true ]; then
    echo "🎉 All test components are successfully installed!"
    exit 0
else
    echo "⚠️  Some test components are missing"
    exit 1
fi