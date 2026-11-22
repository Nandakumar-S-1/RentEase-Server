FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma.config.ts ./
COPY src/infrastructure/database/prisma/schema.prisma ./src/infrastructure/database/prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Install Prisma
RUN npx prisma generate

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma.config.ts ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY src/infrastructure/database/prisma/ ./src/infrastructure/database/prisma/

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript code
RUN npm run type-check
RUN npx tsc
RUN npx tsc-alias

# Production stage
FROM base AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder /app/src/infrastructure/database/prisma ./src/infrastructure/database/prisma

# Install curl for health checks
RUN apk add --no-cache curl

# Switch to non-root user
USER nodejs

# Expose the API port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the server
CMD ["node", "dist/index.js"]
