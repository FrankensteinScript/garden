FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN corepack enable && pnpm install --frozen-lockfile

RUN pnpm nx build @garden/garden_be --skip-nx-cache

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist/apps/garden_be ./dist

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
