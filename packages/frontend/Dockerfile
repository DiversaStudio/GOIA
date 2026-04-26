FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY next.config.js tsconfig.json postcss.config.js tailwind.config.js components.json ./
COPY src/ ./src/

RUN npm run build

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]
