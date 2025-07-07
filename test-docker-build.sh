#!/bin/bash

# Test Docker build
echo "Testing Docker build..."

# Build the Docker image
docker build \
  --no-cache \
  -t wood-panel-frontend:test \
  .

if [ $? -eq 0 ]; then
    echo "✅ Docker build completed successfully!"
    echo "You can now run: docker run -p 3000:3000 wood-panel-frontend:test"
else
    echo "❌ Docker build failed!"
    exit 1
fi
