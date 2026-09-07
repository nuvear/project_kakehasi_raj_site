FROM node:22-bookworm-slim AS builder
WORKDIR /build
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/diary/package.json apps/diary/package.json
RUN pnpm install --frozen-lockfile --filter @kakehashi/diary...
COPY apps/diary apps/diary
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @kakehashi/diary build
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=8080 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /build/apps/diary/.next/standalone ./
COPY --from=builder --chown=node:node /build/apps/diary/.next/static ./apps/diary/.next/static
COPY --from=builder --chown=node:node /build/apps/diary/public ./apps/diary/public
USER node
EXPOSE 8080
CMD ["node", "apps/diary/server.js"]
