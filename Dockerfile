FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production

# Copy entire src directory, including the app folder
COPY src/ .