FROM node:18-alpine

WORKDIR /app

COPY packages/frontend/package.json packages/frontend/package-lock.json* ./
RUN npm ci

COPY packages/frontend/next.config.js \
     packages/frontend/tsconfig.json \
     packages/frontend/postcss.config.js \
     packages/frontend/tailwind.config.js \
     packages/frontend/components.json ./

COPY packages/frontend/src/ ./src/

RUN npm run build

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]
