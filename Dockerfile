# ==============================
# CLOUDSHIP DOCKERFILE
# ==============================

# Base Image
FROM node:18

# Create App Directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy backend files
COPY backend ./

# Cloud Run Port
EXPOSE 8080

# Environment Variable
ENV PORT=8080

# Start Server
CMD ["node", "server.js"]