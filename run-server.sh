#!/bin/bash
echo "Compiling Java server..."
javac src/*.java
if [ $? -ne 0 ]; then
    echo "Compilation failed!"
    exit 1
fi
echo ""
echo "Starting server on http://localhost:8080"
echo "Press Ctrl+C to stop the server"
echo ""
java -cp src NetworkServer

