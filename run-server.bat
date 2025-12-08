@echo off
echo Compiling Java server...
javac src/*.java
if %errorlevel% neq 0 (
    echo Compilation failed!
    pause
    exit /b 1
)
echo.
echo Starting server on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
java -cp src NetworkServer

