# 1. Build aşaması
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# 2. Production runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# uploads klasörünü oluştur (varsa mount edilir)
RUN mkdir -p /app/public/uploads

EXPOSE 3001

CMD ["npm", "start", "--", "-p", "3001"] 