FROM node:20-bookworm-slim AS deps

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/content-schema/package.json packages/content-schema/package.json
COPY packages/db/package.json packages/db/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS builder

COPY apps apps
COPY packages packages
COPY content content

RUN pnpm --filter web build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV HOSTNAME=0.0.0.0
ENV KAKEHASHI_CONTENT_DIR=/app/content
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=8080

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

RUN test -f content/insights/enterprise-ai-reference-guide/en.md \
  && test -f content/apps/ai-transformation-command-center/en.md \
  && test ! -d content/content

USER nextjs

EXPOSE 8080

CMD ["node", "apps/web/server.js"]
