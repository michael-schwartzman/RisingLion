@echo off
REM Operation Rising Lion - Browser Launcher Script for Windows
REM This script makes it easy to launch the game in a web browser

echo.
echo 🦁 Operation Rising Lion - Browser Launcher
echo ==========================================
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ Error: index.html not found in current directory
    echo Please run this script from the RisingLion game directory
    pause
    exit /b 1
)

echo 🎮 Launching Operation Rising Lion in web browser...
echo.

REM Check if Python is available for local server
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🐍 Starting local Python server...
    echo 🌐 Server will run on port 8080
    echo 🚀 Opening browser to http://localhost:8080/launch.html
    echo.
    echo To play the game:
    echo   • Main game: http://localhost:8080/index.html
    echo   • Launcher: http://localhost:8080/launch.html
    echo   • Image converter: http://localhost:8080/image-converter.html
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    
    REM Start browser first
    start http://localhost:8080/launch.html
    
    REM Then start server (this will block)
    python -m http.server 8080
    
) else (
    REM Try Python 3
    python3 --version >nul 2>&1
    if %errorlevel% == 0 (
        echo 🐍 Starting local Python 3 server...
        echo 🌐 Server will run on port 8080
        echo 🚀 Opening browser to http://localhost:8080/launch.html
        echo.
        
        REM Start browser first
        start http://localhost:8080/launch.html
        
        REM Then start server (this will block)
        python3 -m http.server 8080
        
    ) else (
        echo ⚠️  Python not found. Opening file directly...
        echo.
        
        REM Try to open the HTML file directly
        if exist "launch.html" (
            echo 🚀 Opening launch.html in browser...
            start launch.html
        ) else (
            echo 🚀 Opening index.html in browser...
            start index.html
        )
        
        echo.
        echo 📝 Note: For best experience, install Python and run:
        echo    python -m http.server 8080
        echo    Then open: http://localhost:8080/launch.html
        echo.
        pause
    )
)

echo.
echo 🎯 Game Controls:
echo   • Mouse: Click and drag to aim and fire missiles
echo   • Keyboard (1-4): Select weapon types
echo   • Objective: Destroy all Iranian nuclear facilities
echo.
echo Enjoy the game! 🦁
echo.