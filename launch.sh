#!/bin/bash

# Operation Rising Lion - Browser Launcher Script
# This script makes it easy to launch the game in a web browser

echo "🦁 Operation Rising Lion - Browser Launcher"
echo "=========================================="
echo

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found in current directory"
    echo "Please run this script from the RisingLion game directory"
    exit 1
fi

echo "🎮 Launching Operation Rising Lion in web browser..."
echo

# Function to open URL in default browser
open_browser() {
    local url="$1"
    case "$(uname -s)" in
        Darwin*)
            open "$url"
            ;;
        Linux*)
            if command -v xdg-open > /dev/null; then
                xdg-open "$url"
            elif command -v firefox > /dev/null; then
                firefox "$url" &
            elif command -v google-chrome > /dev/null; then
                google-chrome "$url" &
            else
                echo "Please open your browser and navigate to: $url"
            fi
            ;;
        CYGWIN*|MINGW32*|MSYS*|MINGW*)
            start "$url"
            ;;
        *)
            echo "Please open your browser and navigate to: $url"
            ;;
    esac
}

# Check if Python is available for local server
if command -v python3 > /dev/null; then
    echo "🐍 Starting local Python server..."
    
    # Find an available port
    PORT=8080
    while netstat -tuln 2>/dev/null | grep -q ":$PORT "; do
        PORT=$((PORT + 1))
    done
    
    echo "🌐 Server will run on port $PORT"
    echo "🚀 Opening browser to http://localhost:$PORT/launch.html"
    echo
    echo "To play the game:"
    echo "  • Main game: http://localhost:$PORT/index.html"
    echo "  • Launcher: http://localhost:$PORT/launch.html"
    echo "  • Image converter: http://localhost:$PORT/image-converter.html"
    echo
    echo "Press Ctrl+C to stop the server"
    echo
    
    # Start server in background and open browser
    python3 -m http.server $PORT &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 2
    
    # Open browser to launcher page
    open_browser "http://localhost:$PORT/launch.html"
    
    # Wait for server
    wait $SERVER_PID
    
elif command -v python > /dev/null; then
    echo "🐍 Starting local Python server..."
    
    # Find an available port
    PORT=8080
    while netstat -tuln 2>/dev/null | grep -q ":$PORT "; do
        PORT=$((PORT + 1))
    done
    
    echo "🌐 Server will run on port $PORT"
    echo "🚀 Opening browser to http://localhost:$PORT/launch.html"
    echo
    
    # Start server in background and open browser
    python -m SimpleHTTPServer $PORT &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 2
    
    # Open browser to launcher page
    open_browser "http://localhost:$PORT/launch.html"
    
    # Wait for server
    wait $SERVER_PID
    
else
    echo "⚠️  Python not found. Attempting to open file directly..."
    echo
    
    # Try to open the HTML file directly
    if [ -f "launch.html" ]; then
        echo "🚀 Opening launch.html in browser..."
        open_browser "file://$(pwd)/launch.html"
    else
        echo "🚀 Opening index.html in browser..."
        open_browser "file://$(pwd)/index.html"
    fi
    
    echo
    echo "📝 Note: For best experience, run a local web server:"
    echo "   python3 -m http.server 8080"
    echo "   Then open: http://localhost:8080/launch.html"
fi

echo
echo "🎯 Game Controls:"
echo "  • Mouse: Click and drag to aim and fire missiles"
echo "  • Keyboard (1-4): Select weapon types"
echo "  • Objective: Destroy all Iranian nuclear facilities"
echo
echo "Enjoy the game! 🦁"