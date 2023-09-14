FROM node:alpine
WORKDIR /app/front

COPY package.json package-lock.json ./
RUN npm install
COPY . ./