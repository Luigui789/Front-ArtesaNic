FROM node:22-bookworm-slim
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate
WORKDIR /workspace/apps/frontend
COPY apps/frontend/package.json apps/frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY apps/frontend/ ./
COPY infra/scripts/ /workspace/infra/scripts/
EXPOSE 5173
