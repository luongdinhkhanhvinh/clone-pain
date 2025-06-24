#!/bin/bash

# Docker management scripts for Benjamin Moore Clone

case "$1" in
  "build")
    echo "Building Docker image..."
    docker-compose build --no-cache
    ;;
  "up")
    echo "Starting containers..."
    docker-compose up -d
    ;;
  "down")
    echo "Stopping containers..."
    docker-compose down
    ;;
  "restart")
    echo "Restarting containers..."
    docker-compose down
    docker-compose up -d
    ;;
  "logs")
    echo "Showing logs..."
    docker-compose logs -f benjamin-moore-app
    ;;
  "pm2-logs")
    echo "Showing PM2 logs..."
    docker exec -it benjamin-moore-clone pm2 logs
    ;;
  "pm2-status")
    echo "Showing PM2 status..."
    docker exec -it benjamin-moore-clone pm2 status
    ;;
  "pm2-restart")
    echo "Restarting PM2 processes..."
    docker exec -it benjamin-moore-clone pm2 restart all
    ;;
  "shell")
    echo "Opening shell in container..."
    docker exec -it benjamin-moore-clone sh
    ;;
  "clean")
    echo "Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    ;;
  *)
    echo "Usage: $0 {build|up|down|restart|logs|pm2-logs|pm2-status|pm2-restart|shell|clean}"
    echo ""
    echo "Commands:"
    echo "  build       - Build Docker image"
    echo "  up          - Start containers"
    echo "  down        - Stop containers"
    echo "  restart     - Restart containers"
    echo "  logs        - Show container logs"
    echo "  pm2-logs    - Show PM2 logs"
    echo "  pm2-status  - Show PM2 status"
    echo "  pm2-restart - Restart PM2 processes"
    echo "  shell       - Open shell in container"
    echo "  clean       - Clean up Docker resources"
    exit 1
    ;;
esac
