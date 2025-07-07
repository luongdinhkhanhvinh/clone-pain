#!/bin/bash

echo "🚀 Setting up Wood Panel Admin Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

echo "📄 Setting up environment files..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
else
    echo "⚠️  .env file already exists"
fi

if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "✅ Created server/.env file from server/.env.example"
else
    echo "⚠️  server/.env file already exists"
fi

echo "🗄️  Setting up database..."
echo "Please make sure PostgreSQL is running and update the DATABASE_URL in server/.env"
echo "Then run: npm run db:generate && npm run db:push"

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update database connection in server/.env"
echo "2. Run: npm run db:generate"
echo "3. Run: npm run db:push"
echo "4. Run: npm run dev"
echo ""
echo "🌐 Access the application:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo "Admin Dashboard: http://localhost:3000/admin/login"
echo ""
echo "🔑 Default admin credentials:"
echo "Username: admin"
echo "Password: admin123"
