# Desarrollo local

Django se ejecuta en la máquina con `uv` y PostgreSQL en Docker Compose ([ADR-008](adr/0008-entorno-de-desarrollo-local.md)). Los comandos valen igual en PowerShell y en Git Bash.

## Requisitos previos

| Herramienta | Versión usada | Nota |
|---|---|---|
| Python | 3.13 (`.python-version`) | Si falta, `uv` puede instalarlo: `uv python install 3.13` |
| [uv](https://docs.astral.sh/uv/) | 0.12 | Único mecanismo de instalación y bloqueo de versiones |
| Docker Desktop | 29.7, Compose v5 | Debe estar **en ejecución** antes de `docker compose up` |

## Puesta en marcha

1. **Variables de entorno.** Copiar la plantilla y reemplazar los dos marcadores (`DJANGO_SECRET_KEY` y `POSTGRES_PASSWORD`):

   ```bash
   cp .env.example .env
   ```

   En PowerShell: `Copy-Item .env.example .env`. Para generar la clave, una vez instaladas las dependencias (paso 3):

   ```bash
   uv run python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"
   ```

   Evitar los caracteres `$` y `#` en los valores de `.env`: Compose interpreta `$` como variable.

2. **PostgreSQL.**

   ```bash
   docker compose up -d
   ```

   `docker compose ps` debe mostrar el servicio `db` como `healthy`. Escucha solo en `127.0.0.1:5434`.

3. **Dependencias** (crea `.venv` con las versiones exactas de `uv.lock`):

   ```bash
   uv sync
   ```

4. **Migraciones:**

   ```bash
   uv run python manage.py migrate
   ```

5. **Servidor** en `http://127.0.0.1:8000`:

   ```bash
   uv run python manage.py runserver
   ```

   Comprobación: `http://127.0.0.1:8000/api/v1/salud/` responde `{"estado": "ok"}`. El frontend (Vite, `http://localhost:5173`) ya está admitido por CORS y CSRF en este perfil, aunque todavía no consume la API.

6. **Cuenta técnica para Django Admin** (opcional). Pide teléfono de 8 dígitos, nombre y contraseña; la contraseña la elige quien ejecuta el comando y no se guarda en ningún archivo:

   ```bash
   uv run python manage.py createsuperuser
   ```

## Pruebas y calidad

| Qué | Comando |
|---|---|
| Suite completa (crea y destruye la base `test_artesanic` en el PostgreSQL de Compose) | `uv run python manage.py test` |
| Una clase o prueba | `uv run python manage.py test apps.accounts.tests.test_authentication.LogoutTests` |
| Checks de Django | `uv run python manage.py check` |
| Migraciones pendientes de generar | `uv run python manage.py makemigrations --check --dry-run` |
| Lint | `uv run ruff check .` |
| Formato | `uv run ruff format .` (comprobar sin cambiar: `--check`) |
| Regenerar el esquema OpenAPI | `uv run python manage.py spectacular --validate --fail-on-warn --file docs/api/openapi.yaml` |
| Reproducir exactamente el bloqueo | `uv sync --locked` |

`manage.py test` usa `config.settings.test` por defecto; el resto de comandos, `config.settings.local`. `--settings` o `DJANGO_SETTINGS_MODULE` tienen prioridad.

La suite no admite SQLite: la base de pruebas es PostgreSQL, con las mismas restricciones que en desarrollo. Una prueba compara el esquema generado con `docs/api/openapi.yaml`; si se cambia un endpoint, hay que regenerarlo.

## Variables de entorno

| Variable | Obligatoria | Por defecto en `local` | Por defecto en `base` | Uso |
|---|---|---|---|---|
| `DJANGO_SECRET_KEY` | Sí | — | — | Firma de cookies y de los tokens |
| `DJANGO_DEBUG` | No | `true` | `false` | Modo depuración |
| `DJANGO_ALLOWED_HOSTS` | No | `localhost,127.0.0.1` | vacío | Hosts admitidos, separados por comas |
| `DJANGO_FRONTEND_ORIGINS` | No | `http://localhost:5173,http://127.0.0.1:5173` | vacío | Orígenes exactos para CORS con credenciales y para CSRF |
| `DJANGO_SECURE_COOKIES` | No | `false` | `true` | Atributo `Secure` de las cookies (exige HTTPS) |
| `DJANGO_COOKIE_SAMESITE` | No | `Lax` | `Lax` | `SameSite` de las cookies de la SPA (`csrftoken`, `refresh`); `None` exige `Secure` |
| `DJANGO_NUM_PROXIES` | No | `0` | `0` | Proxies de confianza delante de Django, para la IP de la limitación de intentos |
| `POSTGRES_DB` | Sí | — | — | Base de datos (también la crea Compose) |
| `POSTGRES_USER` | Sí | — | — | Usuario (también lo crea Compose) |
| `POSTGRES_PASSWORD` | Sí | — | — | Contraseña (también la fija Compose) |
| `POSTGRES_HOST` | Sí | — | — | `127.0.0.1` en local |
| `POSTGRES_PORT` | Sí | — | — | Puerto publicado por Compose; `5434` en local |

Las variables del entorno real tienen prioridad sobre las de `.env`. Una variable obligatoria ausente detiene el arranque con `ImproperlyConfigured`, y un booleano con un valor distinto de `true`/`false`/`1`/`0`/`yes`/`no`, también.

## Base de datos

| Acción | Comando |
|---|---|
| Consola `psql` | `docker compose exec db psql -U artesanic -d artesanic` |
| Detener conservando los datos | `docker compose stop` o `docker compose down` |
| **Borrar** los datos y empezar desde una base vacía | `docker compose down -v`, después `docker compose up -d` y `migrate` |

## Mantenimiento periódico

En desarrollo no hace falta. En un entorno con uso real, programar:

- `uv run python manage.py flushexpiredtokens`: elimina tokens de renovación caducados de la lista de revocación.
- `uv run python manage.py clearsessions`: elimina sesiones caducadas de Django Admin.

## Crear un administrador de plataforma

1. Entrar a `http://127.0.0.1:8000/admin/` con la cuenta técnica (`createsuperuser`).
2. **Usuarios → Añadir**: teléfono, nombre, rol `Administrador` y contraseña.
3. En la ficha creada: marcar **Acceso a Django Admin** y asignar solo los permisos necesarios (en esta fase, *Can view usuario* y *Can change usuario*). **No** marcar superusuario.

Con esos permisos puede activar y desactivar cuentas, pero no cambiar roles, privilegios ni contraseñas ajenas.

## Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| `port is already allocated` al levantar Compose | Otro proceso usa el puerto. Cambiar `POSTGRES_PORT` en `.env` y volver a ejecutar `docker compose up -d`. |
| `failed to connect to the docker API` | Docker Desktop no está en ejecución. |
| `ImproperlyConfigured: Falta la variable de entorno …` | Falta `.env` o una variable obligatoria. |
| `password authentication failed` | `.env` cambió después de crear el volumen: PostgreSQL conserva la contraseña inicial. Restaurar la anterior o recrear la base con `docker compose down -v`. |
| Lentitud o archivos bloqueados al instalar | El repositorio está en una carpeta sincronizada (OneDrive) y `.venv` se sincroniza. Se puede crear el entorno fuera con `UV_PROJECT_ENVIRONMENT`, por ejemplo `C:\Users\<usuario>\.venvs\back-artesanic`, y ejecutar los mismos comandos `uv`. |

## Versiones y fuentes

Verificadas el 4 de octubre de 2026 en la documentación oficial antes de fijarlas en `pyproject.toml`. Las exactas instaladas están en `uv.lock`.

| Componente | Versión | Soporte comprobado | Fuente |
|---|---|---|---|
| Django | 5.2.17 | LTS con soporte hasta abril de 2028; Python 3.10–3.14; PostgreSQL 14 o superior; psycopg 3.1.8 o superior | [Descargas](https://www.djangoproject.com/download/), [FAQ de instalación](https://docs.djangoproject.com/en/5.2/faq/install/), [Bases de datos](https://docs.djangoproject.com/en/5.2/ref/databases/) |
| Django REST Framework | 3.18.1 | Django 5.2 o superior, Python 3.10 o superior; incluye la corrección de seguridad de 3.17.2 | [Notas de versión](https://www.django-rest-framework.org/community/release-notes/) |
| djangorestframework-simplejwt | 5.5.1 | Declara Django 5.2 en sus metadatos, pero su documentación solo lista DRF 3.14–3.15; la compatibilidad con DRF 3.18 la verifica la suite de este repositorio (ADR-007) | [Documentación](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html), [PyPI](https://pypi.org/project/djangorestframework-simplejwt/) |
| PyJWT | 2.15.1 | Dependencia de simplejwt | [PyPI](https://pypi.org/project/PyJWT/) |
| drf-spectacular | 0.30.0 | Recomendado por DRF, cuyo generador OpenAPI propio está obsoleto | [Esquemas en DRF](https://www.django-rest-framework.org/api-guide/schemas/), [PyPI](https://pypi.org/project/drf-spectacular/) |
| django-cors-headers | 4.9.0 | Django 4.2–6.0 | [PyPI](https://pypi.org/project/django-cors-headers/) |
| psycopg (binary) | 3.3.6 | Python 3.10–3.14 | [PyPI](https://pypi.org/project/psycopg/) |
| python-dotenv | 1.2.4 | Python 3.10–3.14 | [PyPI](https://pypi.org/project/python-dotenv/) |
| ruff | 0.16.10 | Herramienta de desarrollo | [PyPI](https://pypi.org/project/ruff/) |
| PostgreSQL | 17 (imagen `postgres:17`; 17.11 al verificar) | Soporte hasta noviembre de 2029 | [Política de versiones](https://www.postgresql.org/support/versioning/) |
