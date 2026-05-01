# 🔹 Base image
FROM node:18

# 🔹 Working directory
WORKDIR /app

# 🔹 Copy backend code
COPY backend ./backend

# 🔹 Move inside backend
WORKDIR /app/backend

# 🔹 Install dependencies
RUN npm install --production

# 🔥 IMPORTANT: Cloud Run port
EXPOSE 8080

# 🔹 Start server
CMD ["node", "server.js"]