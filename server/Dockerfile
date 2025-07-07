# Backend Dockerfile
FROM node:18-alpine

# Install curl for health checks and pnpm
RUN apk add --no-cache curl \
    && npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start the application in development mode (no build needed)
CMD ["npm", "run", "dev"]
