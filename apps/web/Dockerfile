# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@11.3.0

# Copy workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy packages
COPY packages ./packages

# Copy web app
COPY apps/web ./apps/web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build web app
RUN pnpm --filter web build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@11.3.0

# Copy package files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./

# Copy packages (needed for imports)
COPY --from=builder /app/packages ./packages

# Copy web app
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Environment variables defaults
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=/api

# Expose port
EXPOSE 3000

# Set working directory for web app
WORKDIR /app/apps/web

# Start the Next.js app
CMD ["pnpm", "start"]
