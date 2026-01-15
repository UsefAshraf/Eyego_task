FROM node:18-alpine

# Install lightweight system tools (Alpine packages are tiny)
RUN apk add --no-cache \
    wget \
    curl \
    ca-certificates

# Create app directory
WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package*.json ./

# Install ALL heavy Node.js dependencies here (done once during build)
# Includes: express, mongoose, kafkajs, dotenv, cors, helmet, express-validator
RUN npm ci --only=production && \
    npm cache clean --force

# Copy app source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/src/app

USER nodejs

# Expose port
EXPOSE 3000

# Health check using wget (already installed above)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start application
CMD ["node", "server.js"]