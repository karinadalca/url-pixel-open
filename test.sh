#!/bin/bash

# URLPixel Open Source - Quick Test Script
# This script tests the basic functionality of the service

echo "🚀 URLPixel Open Source Test Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found. Please run this script from the URLPixel Open Source directory."
    exit 1
fi

echo "✅ Found server.js"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies ready"

# Start the server in background
echo "🚀 Starting URLPixel Open Source server..."
node server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Test health endpoint
echo "🔍 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health)
if [[ $? -eq 0 ]]; then
    echo "✅ Health check passed"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "❌ Health check failed"
fi

# Test root endpoint
echo "🔍 Testing documentation endpoint..."
ROOT_RESPONSE=$(curl -s http://localhost:3000/)
if [[ $? -eq 0 ]]; then
    echo "✅ Documentation endpoint working"
else
    echo "❌ Documentation endpoint failed"
fi

# Test screenshot endpoint
echo "🔍 Testing screenshot endpoint..."
SCREENSHOT_RESPONSE=$(curl -s -X POST http://localhost:3000/screenshot \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com"}')

if [[ $SCREENSHOT_RESPONSE == *"success"* ]]; then
    echo "✅ Screenshot generation working"
    echo "   Generated screenshot for example.com"
else
    echo "❌ Screenshot generation failed"
    echo "   Response: $SCREENSHOT_RESPONSE"
fi

# Clean up
echo "🧹 Stopping server..."
kill $SERVER_PID

echo ""
echo "✅ Test complete! URLPixel Open Source is working."
echo "🌟 To get started:"
echo "   npm start"
echo "   curl -X POST http://localhost:3000/screenshot -H 'Content-Type: application/json' -d '{\"url\": \"https://example.com\"}'"
echo ""
echo "📚 Documentation: http://localhost:3000"
echo "🚀 Managed service: https://urlpixel.com"
