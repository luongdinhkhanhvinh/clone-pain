# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install pnpm and PM2 globally
RUN npm install -g pnpm pm2

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package manager files for better cache
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copy config and source code in separate steps for better cache
COPY package.json pnpm-lock.yaml* next.config.js tsconfig.json tailwind.config.ts postcss.config.mjs ./
COPY next-i18next.config.js components.json .nextignore ./
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY data ./data
COPY hooks ./hooks
COPY styles ./styles
COPY public ./public

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1
ENV DOCKER_BUILD true

RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create logs directory for PM2
RUN mkdir -p logs
RUN chown nextjs:nodejs logs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application only
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]
