FROM node:22-alpine
ENV NODE_VERSION=22.21.1
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
EXPOSE 5000
CMD ["node", "index.js"]