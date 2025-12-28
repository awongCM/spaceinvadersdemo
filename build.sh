#!/bin/bash

# Build script for Space Invaders - builds both legacy and modern versions

echo "🚀 Building Space Invaders Games..."
echo ""

# Build Legacy Edition
echo "📦 Building Legacy Edition..."
cd legacy
npm run build
if [ $? -eq 0 ]; then
  echo "✅ Legacy build complete!"
else
  echo "❌ Legacy build failed!"
  exit 1
fi
cd ..

echo ""

# Build Modern Edition
echo "📦 Building Modern Edition..."
cd modern
npm run build
if [ $? -eq 0 ]; then
  echo "✅ Modern build complete!"
else
  echo "❌ Modern build failed!"
  exit 1
fi
cd ..

echo ""
echo "🎉 All builds complete!"
echo ""
echo "To view the games, serve the root directory and open index.html"
echo "Example: python3 -m http.server 8000"
