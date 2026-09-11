# -------------------------------------------------------------
# VASUNDHARA API - Production Multi-Stage Dockerfile
# -------------------------------------------------------------

# --- Stage 1: Dependencies ---
FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache openssl libc6-compat

ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* prisma.config.ts ./
COPY src/prisma/schema.prisma ./src/prisma/

RUN pnpm install --frozen-lockfile
RUN npx prisma generate

# --- Stage 2: Builder & Production Prune ---
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/generated ./src/generated
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* tsconfig.json tsconfig.build.json nest-cli.json prisma.config.ts ./
COPY src/ ./src/

RUN ./node_modules/.bin/nest build

# Prune devDependencies to keep only production dependencies
RUN pnpm prune --prod

# --- Stage 3: Production Runner ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000

RUN apk add --no-cache openssl libc6-compat

USER node

# Copy production node_modules and built code
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/src/generated ./src/generated
COPY --chown=node:node package.json prisma.config.ts ./
COPY --chown=node:node src/prisma ./src/prisma

EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 5000) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "dist/main.js"]
