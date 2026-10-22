# syntax=docker/dockerfile:1
# The sample web app, built like web/apps/client: node alpine, Next.js
# standalone output, a non-root user, port 3008.
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS builder
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# The page shows it; the browser bundle can only read NEXT_PUBLIC_* at build.
ARG VERSION_RELEASE=local
ENV NEXT_PUBLIC_VERSION_RELEASE=$VERSION_RELEASE
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3008
ENV PORT=3008
ENV HOSTNAME="0.0.0.0"

ARG VERSION_COMMIT=local
ENV VERSION_COMMIT=$VERSION_COMMIT
ARG VERSION_RELEASE=local
ENV VERSION_RELEASE=$VERSION_RELEASE

CMD ["node", "server.js"]
