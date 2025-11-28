FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/
COPY tsconfig.base.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/backend ./apps/backend
COPY apps/backend/tsconfig.json ./apps/backend/

# Build
RUN npm run build --workspace=apps/backend

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/

# Install production dependencies only
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

WORKDIR /app/apps/backend

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main.js"]

