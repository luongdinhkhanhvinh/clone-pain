#!/bin/bash

echo "🐳 Silklux Admin Dashboard - Docker Setup"
echo "=============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p init-db
mkdir -p server/uploads
mkdir -p logs

# Set up environment files
echo "📄 Setting up environment files..."
if [ ! -f .env.docker ]; then
    echo "⚠️  .env.docker not found, using defaults"
fi

# Choose setup type
echo ""
echo "Choose setup type:"
echo "1) Development (PostgreSQL + pgAdmin only)"
echo "2) Production (Full stack with Docker)"
echo "3) Quick Production Setup"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Setting up development environment..."
        docker-compose -f docker-compose.dev.yml up -d
        echo ""
        echo "✅ Development environment started!"
        echo "📊 pgAdmin: http://localhost:5051"
        echo "   Email: admin@woodpanel.com"
        echo "   Password: admin123"
        echo ""
        echo "🗄️  PostgreSQL: localhost:5433"
        echo "   Database: woodpanel_dev"
        echo "   Username: postgres"
        echo "   Password: postgres123"
        echo ""
        echo "🔧 Next steps:"
        echo "   1. Update server/.env with: DATABASE_URL=postgresql://postgres:postgres123@localhost:5433/woodpanel_dev"
        echo "   2. Run: npm run dev"
        ;;
    2)
        echo "🚀 Setting up production environment..."
        echo "🔨 Building Docker images..."
        docker-compose build --no-cache
        
        echo "🚀 Starting services..."
        docker-compose up -d
        
        echo "⏳ Waiting for services to be ready..."
        sleep 30
        
        echo "🗄️  Setting up database..."
        docker-compose exec -T backend npm run db:generate
        docker-compose exec -T backend npm run db:push
        
        echo ""
        echo "✅ Production environment ready!"
        echo "🌐 Frontend: http://localhost:3000"
        echo "🔌 Backend API: http://localhost:3001"
        echo "📊 pgAdmin: http://localhost:5050"
        echo "   Email: admin@woodpanel.com"
        echo "   Password: admin123"
        echo ""
        echo "🔑 Default admin login:"
        echo "   Username: admin"
        echo "   Password: admin123"
        ;;
    3)
        echo "🚀 Quick production setup..."
        make quick-prod
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🐳 Docker setup complete!"
echo ""
echo "📋 Useful commands:"
echo "   make help           - Show all available commands"
echo "   make status         - Show container status"
echo "   make logs           - View logs"
echo "   make down           - Stop all services"
echo "   make clean          - Clean up resources"
echo ""
echo "🔧 Troubleshooting:"
echo "   - Check container status: docker-compose ps"
echo "   - View logs: docker-compose logs [service-name]"
echo "   - Restart service: docker-compose restart [service-name]"
