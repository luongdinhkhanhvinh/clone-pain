# Silklux Admin Dashboard - Docker Management

.PHONY: help build up down logs clean dev-up dev-down prod-up prod-down db-setup

# Default target
help:
	@echo "Silklux Admin Dashboard - Docker Commands"
	@echo ""
	@echo "Development Commands:"
	@echo "  dev-up          Start development environment (PostgreSQL only)"
	@echo "  dev-down        Stop development environment"
	@echo "  dev-logs        View development logs"
	@echo ""
	@echo "Production Commands:"
	@echo "  build           Build all Docker images"
	@echo "  up              Start production environment"
	@echo "  down            Stop production environment"
	@echo "  logs            View production logs"
	@echo ""
	@echo "Database Commands:"
	@echo "  db-setup        Setup database schema"
	@echo "  db-migrate      Run database migrations"
	@echo "  db-reset        Reset database (WARNING: destroys data)"
	@echo ""
	@echo "Utility Commands:"
	@echo "  clean           Clean up Docker resources"
	@echo "  clean-all       Clean up everything including volumes"
	@echo "  status          Show container status"

# Development environment (PostgreSQL + pgAdmin only)
dev-up:
	@echo "🚀 Starting development environment..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Development environment started!"
	@echo "📊 pgAdmin: http://localhost:5051 (admin@woodpanel.com / admin123)"
	@echo "🗄️  PostgreSQL: localhost:5433 (postgres / postgres123)"

dev-down:
	@echo "🛑 Stopping development environment..."
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Production environment
build:
	@echo "🔨 Building Docker images..."
	docker-compose build --no-cache

up:
	@echo "🚀 Starting production environment..."
	docker-compose up -d
	@echo "✅ Production environment started!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔌 Backend API: http://localhost:3001"
	@echo "📊 pgAdmin: http://localhost:5050 (admin@woodpanel.com / admin123)"

down:
	@echo "🛑 Stopping production environment..."
	docker-compose down

logs:
	docker-compose logs -f

# Database management
db-setup:
	@echo "🗄️  Setting up database schema..."
	docker-compose exec backend npm run db:generate
	docker-compose exec backend npm run db:push
	@echo "✅ Database schema setup complete!"

db-migrate:
	@echo "🗄️  Running database migrations..."
	docker-compose exec backend npm run db:migrate
	@echo "✅ Database migrations complete!"

db-reset:
	@echo "⚠️  WARNING: This will destroy all data!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ]
	docker-compose down
	docker volume rm woodpanel_postgres_data
	docker-compose up -d postgres
	@echo "🗄️  Database reset complete!"

# Utility commands
clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose down --remove-orphans
	docker system prune -f
	@echo "✅ Cleanup complete!"

clean-all:
	@echo "🧹 Cleaning up everything including volumes..."
	docker-compose down --remove-orphans --volumes
	docker system prune -af --volumes
	@echo "✅ Complete cleanup done!"

status:
	@echo "📊 Container Status:"
	docker-compose ps
	@echo ""
	@echo "📊 Development Environment Status:"
	docker-compose -f docker-compose.dev.yml ps

# Quick start commands
quick-dev:
	@echo "🚀 Quick start development environment..."
	make dev-up
	@echo "⏳ Waiting for database to be ready..."
	sleep 10
	@echo "🗄️  Database should be ready at localhost:5433"

quick-prod:
	@echo "🚀 Quick start production environment..."
	make build
	make up
	@echo "⏳ Waiting for services to be ready..."
	sleep 30
	make db-setup
	@echo "✅ Production environment ready!"
	@echo "🌐 Access: http://localhost:3000/admin/login"
	@echo "🔑 Login: admin / admin123"
