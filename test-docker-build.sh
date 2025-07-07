#!/bin/bash

# Test Docker build with proper environment
echo "Testing Docker build with DOCKER_BUILD=true..."

# Build the Docker image
docker build \
  --build-arg DOCKER_BUILD=true \
  --no-cache \
  -t wood-panel-frontend:test \
  .

echo "Docker build completed!"
