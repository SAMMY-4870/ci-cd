# ==============================
# CLOUDSHIP DOCKERFILE
# ==============================

# Base Image
FROM node:18

# App Directory
WORKDIR /app

# Copy package files first
COPY backend/package*.json ./backend/

# Move inside backend
WORKDIR /app/backend

# Install dependencies
RUN npm install --production

# Move back
WORKDIR /app

# Copy full backend
COPY backend ./backend

# Cloud Run Port
EXPOSE 8080

# Environment
ENV PORT=8080

# Start Server
CMD ["node", "backend/server.js"]