# Silklux Admin Dashboard

A comprehensive admin dashboard for managing Silklux products, colors, categories, articles, and customer contacts. Built with Next.js, Express.js, Drizzle ORM, and PostgreSQL.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
npm run server:install
```

### 2. Setup Environment
```bash
cp .env.example .env
cp server/.env.example server/.env
# Update database connection in server/.env
```

### 3. Database Setup
```bash
npm run db:generate
npm run db:push
```

### 4. Start Development
```bash
npm run dev  # Starts both frontend and backend
```

### 5. Access Dashboard
- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
- **API**: http://localhost:3001/api

**Default Login**: admin / admin123

## 🐳 Docker Setup

### Quick Start with Docker
```bash
# Make setup script executable
chmod +x docker-setup.sh

# Run setup script
./docker-setup.sh

# Or use Makefile commands
make quick-prod  # Full production setup
make dev-up      # Development database only
```

### Manual Docker Commands
```bash
# Development (PostgreSQL only)
docker-compose -f docker-compose.dev.yml up -d

# Production (Full stack)
docker-compose build
docker-compose up -d

# Database setup
docker-compose exec backend npm run db:generate
docker-compose exec backend npm run db:push
```

### Docker Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, Drizzle ORM, PostgreSQL
- **Features**: JWT Auth, i18n, File Upload, Role-based Access

## 📁 Structure

```
├── app/admin/          # Admin dashboard
├── server/             # Express.js API
├── components/ui/      # UI components
└── public/locales/     # Translations
```