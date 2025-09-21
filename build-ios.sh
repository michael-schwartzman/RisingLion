#!/bin/bash

# Rising Lion iOS App Build Script
# This script builds and optionally deploys the iOS app

set -e  # Exit on any error

echo "🦁 Building Rising Lion iOS App..."

# Configuration
PROJECT_PATH="iOS/OperationRisingLion.xcodeproj"
SCHEME="OperationRisingLion"
CONFIGURATION="Release"
ARCHIVE_PATH="build/OperationRisingLion.xcarchive"
EXPORT_PATH="build/export"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    print_error "Xcode command line tools not found. Please install Xcode and command line tools."
    exit 1
fi

print_step "Xcode found"

# Check if project exists
if [ ! -d "$PROJECT_PATH" ]; then
    print_error "Project not found at $PROJECT_PATH"
    exit 1
fi

print_step "Project found at $PROJECT_PATH"

# Create build directory
mkdir -p build
print_step "Build directory created"

# Clean previous builds
print_step "Cleaning previous builds..."
xcodebuild clean -project "$PROJECT_PATH" -scheme "$SCHEME" -configuration "$CONFIGURATION"

# Build for simulator (for testing)
if [ "$1" == "simulator" ]; then
    print_step "Building for iOS Simulator..."
    xcodebuild build -project "$PROJECT_PATH" -scheme "$SCHEME" -configuration "Debug" -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 15,OS=latest'
    print_step "Build for simulator completed successfully!"
    exit 0
fi

# Archive the project
print_step "Creating archive..."
xcodebuild archive \
    -project "$PROJECT_PATH" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -archivePath "$ARCHIVE_PATH"

print_step "Archive created successfully"

# Export for App Store (requires proper provisioning profile)
if [ "$1" == "appstore" ]; then
    print_step "Exporting for App Store..."
    
    # Create export options plist
    cat > build/ExportOptions.plist << 'PLIST_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
PLIST_EOF

    xcodebuild -exportArchive \
        -archivePath "$ARCHIVE_PATH" \
        -exportPath "$EXPORT_PATH" \
        -exportOptionsPlist build/ExportOptions.plist
    
    print_step "App Store export completed!"
    print_step "IPA file location: $EXPORT_PATH"
    
elif [ "$1" == "adhoc" ]; then
    print_step "Exporting for Ad Hoc distribution..."
    
    # Create export options plist for Ad Hoc
    cat > build/ExportOptions.plist << 'PLIST_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>ad-hoc</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
PLIST_EOF

    xcodebuild -exportArchive \
        -archivePath "$ARCHIVE_PATH" \
        -exportPath "$EXPORT_PATH" \
        -exportOptionsPlist build/ExportOptions.plist
    
    print_step "Ad Hoc export completed!"
    print_step "IPA file location: $EXPORT_PATH"
    
else
    print_warning "Archive completed but not exported."
    print_warning "Use 'simulator', 'appstore', or 'adhoc' as argument to export."
fi

echo ""
print_step "🦁 Rising Lion iOS build completed!"
echo ""
echo "Usage examples:"
echo "  ./build-ios.sh simulator    # Build for iOS Simulator"
echo "  ./build-ios.sh appstore     # Build and export for App Store"
echo "  ./build-ios.sh adhoc        # Build and export for Ad Hoc distribution"
