# Back-Artesanic

Backend de **ArtesaNic**, el sistema de comercialización de productos artesanales de las PYMEs de Masaya: Django 5.2 LTS, Django REST Framework y PostgreSQL 17, organizado como monolito modular.

El frontend vive en su propio repositorio, [Front-ArtesaNic](https://github.com/Luigui789/Front-ArtesaNic), que también contiene la fuente única de los requisitos (RF, RNF y módulos). La única superficie de acoplamiento entre ambos es el contrato HTTP/JSON.

## Estado

**Fase 1 — base técnica, cuentas y autenticación** (rama `feat/backend-foundation-auth`):

- Usuario propio con teléfono como identificador, roles `comprador`, `artesano` y `administrador`, y estado activo/inactivo.
- Registro de comprador y de artesano, login, renovación, logout y perfil, según el [ADR-003](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0003-autenticacion-y-autorizacion.md) concretado por el [ADR-007](docs/adr/0007-concrecion-de-la-autenticacion.md).
- CSRF, CORS por entorno, limitación de intentos y permisos por rol y propietario.
- Gestión de cuentas en Django Admin, sin acceso general para la administración de plataforma.
- Contrato OpenAPI generado desde el código y comprobado por pruebas.

Talleres, catálogo, pedidos, pagos, mensajería y notificaciones pertenecen a fases posteriores.

## Inicio rápido

Requisitos: Python 3.13, [uv](https://docs.astral.sh/uv/) y Docker Desktop en ejecución.

```bash
cp .env.example .env
```

Reemplazar en `.env` los marcadores de `DJANGO_SECRET_KEY` y `POSTGRES_PASSWORD`. Después:

```bash
docker compose up -d
```

```bash
uv sync
```

```bash
uv run python manage.py migrate
```

```bash
uv run python manage.py runserver
```

```bash
uv run python manage.py test
```

`http://127.0.0.1:8000/api/v1/salud/` debe responder `{"estado": "ok"}`. Guía completa, variables de entorno y solución de problemas: [docs/desarrollo-local.md](docs/desarrollo-local.md).

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/salud/` | Disponibilidad del servicio |
| `GET` | `/api/v1/auth/csrf/` | Token CSRF para la SPA |
| `POST` | `/api/v1/auth/registro/comprador/` | Registro de comprador; inicia la sesión |
| `POST` | `/api/v1/auth/registro/artesano/` | Registro de artesano; inicia la sesión |
| `POST` | `/api/v1/auth/login/` | Inicio de sesión con teléfono y contraseña |
| `POST` | `/api/v1/auth/refrescar/` | Nuevo token de acceso con la cookie de renovación |
| `POST` | `/api/v1/auth/logout/` | Cierre de sesión y revocación |
| `GET` | `/api/v1/auth/perfil/` | Identidad autenticada |
| — | `/admin/` | Django Admin |

Contrato detallado: [docs/api/autenticacion.md](docs/api/autenticacion.md). Esquema: [docs/api/openapi.yaml](docs/api/openapi.yaml).

## Documentación

| Documento | Contenido |
|---|---|
| [docs/arquitectura.md](docs/arquitectura.md) | Estructura, responsabilidades, roles y administración, y cómo crece el proyecto |
| [docs/desarrollo-local.md](docs/desarrollo-local.md) | Instalación, variables, comandos, pruebas y versiones verificadas |
| [docs/api/autenticacion.md](docs/api/autenticacion.md) | Contrato de salud, cuentas y sesión, e integración con la SPA |
| [docs/trazabilidad.md](docs/trazabilidad.md) | Correspondencia con RF y RNF, y diferencias pendientes de resolver |
| [docs/adr/](docs/adr/README.md) | Decisiones de arquitectura (numeración compartida con el frontend) |
| [docs/plans/](docs/plans/) | Planes de fase. El de la fase D no se ejecutó; ver ADR-008 |
