FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and Prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript code and resolve path aliases
RUN npx tsc
RUN npx tsc-alias

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built files and dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/infrastructure/database/prisma ./src/infrastructure/database/prisma

# Expose the API port
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]
