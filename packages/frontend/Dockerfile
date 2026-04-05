FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./
RUN npm install
RUN npm install geist

COPY ./src/ ./src/
COPY ./next.config.js ./next.config.js
COPY ./tsconfig.json ./tsconfig.json

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
