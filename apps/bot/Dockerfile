FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/bot/package.json ./apps/bot/
COPY tsconfig.base.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/bot ./apps/bot
COPY apps/bot/tsconfig.json ./apps/bot/

# Build
RUN npm run build --workspace=apps/bot

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/bot/package.json ./apps/bot/

# Install production dependencies only
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/apps/bot/dist ./apps/bot/dist

WORKDIR /app/apps/bot

EXPOSE 3001

CMD ["node", "dist/main.js"]

