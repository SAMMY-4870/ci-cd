FROM node:18

WORKDIR /app

COPY backend/package*.json ./

RUN npm install --production

COPY backend ./

COPY frontend ./frontend

EXPOSE 8080

ENV PORT=8080

CMD ["npm", "start"]