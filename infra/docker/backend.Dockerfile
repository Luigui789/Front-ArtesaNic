FROM ghcr.io/astral-sh/uv:0.12.22 AS uv
FROM python:3.13-slim
COPY --from=uv /uv /uvx /usr/local/bin/
ENV UV_PROJECT_ENVIRONMENT=/opt/venv \
    UV_LINK_MODE=copy \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"
WORKDIR /workspace/apps/backend
COPY apps/backend/pyproject.toml apps/backend/uv.lock apps/backend/README.md ./
RUN uv sync --locked --no-managed-python
COPY apps/backend/ ./
COPY docs/ /workspace/docs/
EXPOSE 8000
