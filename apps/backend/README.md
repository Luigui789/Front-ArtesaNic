# Backend de ArtesaNic

Django 5.2, DRF y PostgreSQL 17. Snapshot de la fase existente de cuentas, registro, login/refresh/logout, permisos, Django Admin y OpenAPI. No añade dominios de pedidos, inventario o pagos.

Desde esta carpeta, con `.env` de la raíz configurado y PostgreSQL iniciado:

```bash
uv sync --locked
uv run python manage.py migrate
uv run python manage.py runserver
uv run python manage.py check
uv run python manage.py test
uv run ruff check .
uv run ruff format --check .
```

Se conservan `pyproject.toml` y `uv.lock`, Python 3.13 y uv. Django admite también un `.env` específico local basado en [.env.example](.env.example).

La sonda pública es `/api/v1/salud/` y no consulta la base; la conexión PostgreSQL se verifica por separado. [Inicio conjunto](../../README.md), [desarrollo y variables](../../docs/arquitectura/desarrollo-local-backend.md), [arquitectura](../../docs/arquitectura/backend.md), [autenticación](../../docs/api/autenticacion.md) y [OpenAPI](../../docs/api/openapi.yaml).
