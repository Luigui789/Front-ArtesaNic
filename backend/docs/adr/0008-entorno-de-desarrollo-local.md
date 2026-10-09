# ADR-008 — Entorno de desarrollo local del backend

**Estado:** Propuesta. Implementada en la rama `feat/backend-foundation-auth` de `Back-Artesanic`; se acepta al integrar esa rama.

**Fecha:** 2026-10-04

**Decisiones previas relacionadas:** [ADR-004 — Ubicación del backend](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0004-ubicacion-del-backend.md) y [ADR-005 — Infraestructura y persistencia](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0005-infraestructura-y-persistencia.md), ambos en el repositorio del frontend.

**Sustituye parcialmente:** la decisión 3 del ADR-005 («El backend se ejecuta contenedorizado con Docker, con dos servicios […] Django se comunica con la base de datos por el nombre del servicio de Docker, nunca por `localhost`»), **solo para el desarrollo local**. El resto del ADR-005 sigue vigente. Se conserva su texto; este ADR registra la sustitución.

## Contexto

El ADR-005 previó Django y PostgreSQL en contenedores, y el plan de la fase D (`docs/plans/2026-08-15-fase-d-preparacion-del-backend.md`, nunca autorizado ni ejecutado) lo detallaba con un `Dockerfile` y dos servicios. Las instrucciones de esta fase piden otra cosa: `compose.yaml` solo para las dependencias locales —inicialmente PostgreSQL—, sin contenerizar todo desde el primer día y sin infraestructura de despliegue.

En la máquina de trabajo, comprobado el 4 de octubre de 2026:

- El puerto 5432 lo ocupa un PostgreSQL instalado en el sistema.
- El puerto 5433 lo publica el contenedor de base de datos de otro proyecto.
- Python 3.13.3 y `uv` 0.12 están instalados; Docker Desktop 29.7 con Compose v5.

## Decisión

1. **PostgreSQL 17 en Docker Compose.** `compose.yaml` define un único servicio, `db`, con volumen con nombre, comprobación de salud con `pg_isready` y puerto publicado **solo en `127.0.0.1`**, por defecto el **5434**. El nombre del proyecto Compose es fijo (`artesanic`), así que el volumen no depende de la carpeta del repositorio.
2. **Django se ejecuta en el host** y se conecta a `127.0.0.1:5434`. Se mantienen el motor PostgreSQL y el controlador `psycopg` (ADR-005, decisiones 1 y 2).
3. **Un único mecanismo de dependencias: `uv`**, con `pyproject.toml` y el archivo de bloqueo `uv.lock` versionado. Python 3.13 (`.python-version`). No hay `requirements.txt`.
4. **Configuración por variables de entorno** (ADR-005, decisión 5): `.env` sin versionar, cargado por `python-dotenv` y leído también por Compose; `.env.example` con marcadores. La configuración de Django es un paquete (`config/settings/base.py`, `local.py`, `test.py`): `base` trae valores por defecto seguros, `local` los de desarrollo y `test` un hash rápido de contraseñas.
5. **Ningún otro servicio** —Redis, Celery, Nginx, colas— (ADR-005, decisión 4).
6. **La contenedorización de Django** para despliegue se decidirá en la fase de despliegue, junto con la topología del frontend y la API.

## Consecuencias

**Positivas**

- Ciclo de desarrollo más corto en Windows: sin reconstruir imágenes ni montar el código dentro de un contenedor, y con el depurador del editor sobre el proceso real.
- La base de datos es idéntica para todo el equipo y no choca con instalaciones locales de PostgreSQL.
- `uv sync --locked` reproduce exactamente las versiones verificadas.

**Negativas y costos asumidos**

- Quien trabaje en el backend necesita Python 3.13 (o dejar que `uv` lo instale), `uv` y Docker.
- La paridad entre desarrollo y despliegue queda pendiente hasta la fase de despliegue.
- Si el repositorio está dentro de una carpeta sincronizada (OneDrive), el entorno virtual `.venv` también se sincroniza; puede moverse fuera con la variable `UV_PROJECT_ENVIRONMENT` (ver `docs/desarrollo-local.md`).

## Respecto del plan de la fase D

El plan no llegó a ejecutarse. Esta fase conserva de él: Django 5.2, PostgreSQL 17, `psycopg`, `django-cors-headers`, español y zona horaria de Managua, `.gitattributes` con finales de línea LF, ningún servicio adicional y el superusuario creado a mano. Se aparta en el paquete de configuración (el plan proponía un único `settings.py`), en `uv` frente a `requirements.txt`, en Compose solo para la base de datos y en el endpoint de salud (`/api/v1/salud/`, versionado como el resto del contrato).
