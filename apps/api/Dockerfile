# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@11.3.0

# Copy workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy packages
COPY packages ./packages

# Copy api app
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build API
RUN pnpm --filter @repo/api build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@11.3.0

# Copy package files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./

# Copy packages (needed for imports)
COPY --from=builder /app/packages ./packages

# Copy api dist and package from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8000) + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Environment variables defaults
ENV NODE_ENV=production
ENV PORT=8000
ENV BASE_URL=http://localhost:8000

# Expose port
EXPOSE 8000

# Start the API
CMD ["node", "apps/api/dist/index.js"]
