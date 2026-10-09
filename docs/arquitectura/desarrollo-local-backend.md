# Desarrollo local del backend

El backend usa Python 3.13, uv 0.12.22 y PostgreSQL 17. Dependencias y versiones se conservan en `apps/backend/pyproject.toml` y `apps/backend/uv.lock`. No usar SQLite para las pruebas ni sustituir uv por requirements paralelos.

## Puesta en marcha

Desde raíz, copiar `.env.example` a `.env` y ejecutar `docker compose up -d db --wait`. Si el volumen ya existe, usar sus credenciales originales locales; no recrearlo para resolver una contraseña incorrecta. El puerto de host es 5434.

Desde `apps/backend`:

```bash
uv sync --locked
uv run python manage.py migrate
uv run python manage.py runserver
uv run python manage.py check
uv run python manage.py makemigrations --check --dry-run
uv run python manage.py test
uv run ruff check .
uv run ruff format --check .
```

La suite crea y destruye `test_artesanic` en PostgreSQL. No afecta la base de aplicación. `manage.py test` usa `config.settings.test`; el resto usa `config.settings.local`, salvo configuración explícita.

## Variables reales

| Variable | Uso |
|---|---|
| `DJANGO_SECRET_KEY` | Clave de Django; ejemplo local sin valor de producción |
| `DJANGO_DEBUG` | Depuración local |
| `DJANGO_ALLOWED_HOSTS` | Hosts exactos admitidos |
| `DJANGO_FRONTEND_ORIGINS` | Orígenes de CORS con credenciales y confianza CSRF |
| `DJANGO_SECURE_COOKIES`, `DJANGO_COOKIE_SAMESITE` | Cookies de sesión, CSRF y renovación |
| `DJANGO_NUM_PROXIES` | Proxies de confianza; 0 por defecto |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Identidad de la base |
| `POSTGRES_HOST`, `POSTGRES_PORT` | En host: 127.0.0.1:5434; en Compose: db:5432 |
| `POSTGRES_VOLUME` | Nombre del volumen persistente; lo lee Compose |

No se introduce `DATABASE_URL`: el código usa `POSTGRES_*`. Las variables exportadas prevalecen sobre los archivos `.env`. El archivo específico en `apps/backend/.env` prevalece sobre el de raíz. No versionar ninguno.

## Contrato y disponibilidad

[OpenAPI](../api/openapi.yaml) se genera desde el código y se verifica por pruebas. Desde `apps/backend`:

```bash
uv run python manage.py spectacular --validate --fail-on-warn --file ../../docs/api/openapi.yaml
```

Salud: `GET /api/v1/salud/` responde `{"estado":"ok"}` sin comprobar la base. Verificar PostgreSQL separadamente con una consulta SQL o las migraciones. [Contrato de autenticación](../api/autenticacion.md).

`docker compose stop` detiene sin borrar datos. `make clean` y `dev.ps1 -Task Clean` hacen lo mismo. Para bases existentes, nunca cambiar o borrar el volumen como parte de esta reorganización. El entorno anterior queda documentado en [ADR-008](../adr/0008-entorno-de-desarrollo-local.md); el nuevo, en [ADR-010](../adr/0010-monorepo-y-entorno-de-desarrollo.md).
