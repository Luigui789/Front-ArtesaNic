# Fase D — Preparación del entorno del backend — Plan

> **Para ejecutores agénticos:** este plan **no está autorizado a ejecutarse** a la fecha de escritura. La autorización se otorga por separado, después de revisar este documento, y cubre únicamente este plan. Cualquier dependencia inesperada, diferencia entre el estado real del entorno y lo aquí descrito, o hallazgo que afecte lógica de negocio, **detiene esa parte y se consulta** antes de improvisar.

**Objetivo:** dejar en `Back-Artesanic` un entorno Django + Django REST Framework + PostgreSQL ejecutándose en Docker y verificado, listo para que la Fase E comience directamente con el modelado de los once modelos.

**Naturaleza del cambio:** creación de infraestructura en un repositorio vacío. No toca el frontend, no implementa lógica de negocio y no crea ningún modelo de dominio.

**Decisiones que lo gobiernan:** [ADR-004 — Ubicación del backend](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0004-ubicacion-del-backend.md) y [ADR-005 — Infraestructura y persistencia](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0005-infraestructura-y-persistencia.md).

**Fase anterior:** cierre de la documentación arquitectónica, commit `0d8f7c7` en `Front-ArtesaNic`.

> **Fuente autoritativa de la documentación.** Los requisitos, el contrato de API, el documento de frontera y los ADR viven en **`Front-ArtesaNic`** y **no se duplican aquí**. Este repositorio los consume, nunca mantiene copia propia: dos copias del contrato serían dos contratos aparentemente válidos sin forma evidente de saber cuál manda. Por eso los enlaces de este documento son URL y no rutas relativas, que no resolverían desde otro repositorio.
>
> **Precondición de los enlaces:** a fecha de escritura, los ADR-004 y ADR-005 existen solo en commits locales sin publicar, sobre una rama de trabajo de `Front-ArtesaNic`. Los enlaces de arriba resolverán cuando esa rama se publique y llegue a `main`.

---

## Estado verificado del entorno

Comprobado en la máquina de trabajo antes de escribir este plan:

| Comprobación | Resultado | Consecuencia |
|---|---|---|
| `docker --version` | 29.5.3 | Disponible |
| `docker compose version` | v5.1.4 | Disponible, sintaxis Compose v2+ |
| `docker info` | **Falla: el demonio no responde** | Docker Desktop debe estar arrancado antes de ejecutar la fase |
| Puerto **5432** | **Ocupado** por un proceso `postgres` nativo (PID 8628, con conexión activa) | **El contenedor no puede publicar 5432 en el host.** Ver decisión 3 |
| Puerto 8000 | Libre | Django puede publicarse ahí |
| `python --version` (host) | 3.13.3 | Irrelevante para la ejecución: Python vive en el contenedor. Útil solo para herramientas locales |
| `Back-Artesanic` | Repositorio clonado y **vacío**, sin ramas ni commits | Partida limpia |

---

## Decisiones cerradas antes de escribir este plan

| # | Decisión | Motivo |
|---|---|---|
| 1 | **`config/settings.py` es un archivo único, no un paquete `config/settings/` con `base`/`dev`/`prod`.** | Separar entornos en tres archivos exige saber en qué se diferencian, y hoy no hay objetivo de despliegue definido. La diferencia real entre entornos ya viaja por variables de entorno. Cuando exista despliegue, dividirlo será un cambio pequeño y justificado; hacerlo ahora sería estructura sin contenido. **Se aparta del boceto inicial, deliberadamente.** |
| 2 | **El puerto de PostgreSQL no se publica en el host.** | Hay un PostgreSQL nativo ocupando el 5432. Django habla con la base de datos por el nombre del servicio dentro de la red de Compose (`db:5432`), así que publicarlo no aporta nada y provocaría un conflicto en el arranque. Si más adelante hace falta inspeccionar la base con un cliente gráfico, se publica en `5433:5432`, que este plan deja documentado pero no activado. |
| 3 | **No se configura `REST_FRAMEWORK` en esta fase.** | DRF entra en `INSTALLED_APPS` y nada más. La paginación, los renderizadores, los permisos por defecto y las clases de autenticación son decisiones que dependen del contrato y del [ADR-003](../adr/0003-autenticacion-y-autorizacion.md); fijarlas ahora, sin un solo endpoint de negocio, sería configurar a ciegas. Un `DEFAULT_PERMISSION_CLASSES` global mal elegido además rompería `/api/health/`. |
| 4 | **`/api/health/` no consulta la base de datos.** | Es una sonda de disponibilidad del proceso, no del sistema. Que Django pueda leer y escribir en PostgreSQL se demuestra con `migrate`, con la creación del superusuario y con el acceso al admin, que son pruebas más fuertes y no obligan a inventar un contrato para un endpoint que el contrato de API no contempla. |
| 5 | **La app `apps/core/` existe porque `/api/health/` necesita vivir en algún sitio.** | No es estructura preventiva: tiene un consumidor real desde el primer día, y establece la convención `apps/<nombre>/` que la Fase E usará para los once modelos. No se crean las demás apps. |
| 6 | **`requirements.txt` es un archivo único.** | Dividirlo en `base.txt` y `development.txt` requiere que existan dependencias exclusivas de desarrollo, y en esta fase no hay ninguna. |
| 7 | **Se añade `.gitattributes` con `* text=auto eol=lf`.** | Es obligatorio, no cosmético: un archivo con finales de línea CRLF que entre al contenedor Linux falla al ejecutarse. Dado que el repositorio del frontend arrastra precisamente ese problema (deuda T-1), fijar la normalización desde el primer commit evita heredarlo. |
| 8 | **El superusuario lo crea la persona usuaria, no el agente.** | Implica elegir una contraseña. El plan documenta el comando exacto; su ejecución es manual. No se versiona ninguna credencial ni se define `DJANGO_SUPERUSER_PASSWORD`. |
| 9 | **No se añaden Nginx, Redis, Celery ni colas.** | Ningún requisito los exige. Principio de menos tecnología, cada una justificable. |

### La arquitectura que esta fase levanta

```text
                 Back-Artesanic
   ┌───────────────────────────────────────┐
   │  red de Docker Compose                │
   │                                       │
   │   ┌───────────────────────────────┐   │
   │   │ backend                       │   │
   │   │  Django 5.2 + DRF             │   │
   │   │  /api/health/   /admin/       │◄──┼── host :8000
   │   │                               │   │
   │   └───────────────┬───────────────┘   │
   │                   │ psycopg           │
   │                   │ db:5432           │
   │   ┌───────────────▼───────────────┐   │
   │   │ db                            │   │
   │   │  postgres:17                  │   │   sin publicar:
   │   │  healthcheck: pg_isready      │   │   el 5432 del host
   │   │  volumen: postgres_data       │   │   está ocupado
   │   └───────────────────────────────┘   │
   └───────────────────────────────────────┘
```

---

## Alcance

### Entra

- Estructura inicial del proyecto Django en `Back-Artesanic`.
- `Dockerfile` y `docker-compose.yml` con los servicios `backend` y `db`.
- Dependencias: Django, Django REST Framework, `psycopg`, `django-cors-headers`.
- Configuración por variables de entorno, con `.env.example` versionado y `.env` ignorado.
- Conexión Django ↔ PostgreSQL por nombre de servicio.
- CORS configurado para el origen del servidor de desarrollo del frontend.
- Un único endpoint técnico, `GET /api/health/`.
- Django Admin accesible.
- Migraciones iniciales de las aplicaciones propias de Django.
- `README.md` con las instrucciones de arranque.

### No entra

- **Los once modelos de dominio.** Ni `models.py` de negocio, ni migraciones de negocio.
- Serializadores, vistas, permisos o rutas de los 34 endpoints del contrato.
- Autenticación: sin JWT, sin registro, sin login, sin `djangorestframework-simplejwt`.
- Registro de modelos de negocio en Django Admin.
- Configuración de `REST_FRAMEWORK` (decisión 3).
- Gestión de archivos e imágenes, Pillow, `MEDIA_ROOT`.
- Configuración de producción, despliegue, HTTPS o copias de seguridad.
- Cualquier modificación del repositorio del frontend.

---

## Tabla completa: archivo por archivo

Todos los archivos son nuevos; el repositorio está vacío.

| Archivo | Contenido | Notas |
|---|---|---|
| `.gitattributes` | `* text=auto eol=lf` | Decisión 7. Primer archivo del repositorio |
| `.gitignore` | `.env`, `__pycache__/`, `*.pyc`, `db.sqlite3`, `media/`, `staticfiles/`, `.venv/` | `.env` nunca se versiona |
| `.dockerignore` | `.git`, `.env`, `__pycache__/`, `*.pyc`, `docs/` | Reduce el contexto de construcción |
| `requirements.txt` | Las cuatro dependencias, con versión fijada | Decisión 6 |
| `Dockerfile` | Imagen `python:3.13-slim`, instalación de dependencias, `CMD` con `runserver` | Sin dependencias del sistema: `psycopg[binary]` no necesita compilar ni driver ODBC |
| `docker-compose.yml` | Servicios `backend` y `db`, volumen `postgres_data`, `healthcheck`, `depends_on` condicionado | Sin clave `version:`, obsoleta en Compose v2+ |
| `.env.example` | Todas las variables con valores de ejemplo y `DJANGO_SECRET_KEY` como marcador | Se versiona |
| `manage.py` | Generado por `django-admin startproject` | Sin modificar |
| `config/__init__.py` | Vacío | |
| `config/settings.py` | Configuración leída de variables de entorno | Decisión 1 |
| `config/urls.py` | `admin/` y `api/` | |
| `config/wsgi.py`, `config/asgi.py` | Generados | Sin modificar |
| `apps/__init__.py` | Vacío | Hace de `apps` un paquete |
| `apps/core/__init__.py` | Vacío | |
| `apps/core/apps.py` | `CoreConfig` con `name = "apps.core"` | El prefijo `apps.` es obligatorio por la ubicación |
| `apps/core/views.py` | Vista del health check | |
| `apps/core/urls.py` | Ruta `health/` | |
| `README.md` | Arranque, migraciones, superusuario, verificación | |
| `docs/plans/…` | Este documento | Ya existe |

**No se crea** `apps/core/models.py`, porque la app no define ningún modelo y Django no lo exige.

**No se crean** `docs/adr/`, `docs/api/` ni `docs/requisitos/` en este repositorio: son de `Front-ArtesaNic` y no se duplican. Lo único que vive bajo `docs/` aquí son los planes de fase del backend.

---

## Contenido concreto de las piezas que no son triviales

### Dependencias

```text
Django==5.2.*
djangorestframework==3.16.*
psycopg[binary]==3.2.*
django-cors-headers==4.*
```

Las versiones se confirman en el momento de instalar. Si alguna no existiera o entrara en conflicto, **se detiene y se consulta**; no se sustituye por otra por iniciativa propia.

### Variables de entorno

| Variable | Ejemplo | Uso |
|---|---|---|
| `DJANGO_SECRET_KEY` | *(marcador)* | Clave criptográfica. Se genera localmente, nunca se versiona |
| `DJANGO_DEBUG` | `True` | Solo desarrollo |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Lista separada por comas |
| `POSTGRES_DB` | `artesanica` | Lo consumen los dos servicios |
| `POSTGRES_USER` | `artesanica` | |
| `POSTGRES_PASSWORD` | *(marcador)* | |
| `POSTGRES_HOST` | `db` | **Nombre del servicio de Docker, nunca `localhost`** |
| `POSTGRES_PORT` | `5432` | Puerto *interno* del contenedor |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Puerto del servidor de desarrollo de Vite |

`DJANGO_DEBUG` se interpreta como verdadero solo si su valor, en minúsculas, es `true` o `1`. Las listas se obtienen partiendo por comas y descartando elementos vacíos.

### `config/settings.py` — puntos que importan

- `INSTALLED_APPS` añade `rest_framework`, `corsheaders` y `apps.core` a las aplicaciones de Django.
- `corsheaders.middleware.CorsMiddleware` va **antes** de `CommonMiddleware`.
- `DATABASES["default"]` usa `django.db.backends.postgresql` y toma todos sus valores del entorno.
- No se define `REST_FRAMEWORK` (decisión 3).
- `LANGUAGE_CODE` y `TIME_ZONE` se ajustan al contexto del proyecto: español y zona horaria de Nicaragua. Es configuración regional, no lógica de negocio.

### `/api/health/`

```
GET /api/health/  →  200  {"status": "ok"}
```

**Este endpoint es de infraestructura y no forma parte de los 34 endpoints del contrato.** El código debe llevar un comentario que lo diga, para que nadie lo cuente como parte de la superficie del contrato al revisar la cobertura en fases posteriores.

### Compose — los tres puntos delicados

1. `db` declara un `healthcheck` con `pg_isready` contra el usuario y la base configurados.
2. `backend` declara `depends_on` con `condition: service_healthy`, para no arrancar contra una base que todavía no acepta conexiones.
3. `db` **no publica puertos**. El bloque `ports` correspondiente se deja escrito y comentado, con `5433:5432`, para quien necesite inspeccionar la base desde el host.

---

## Orden de implementación

| Paso | Acción | Comprobación al terminar |
|---|---|---|
| **D1** | `.gitattributes`, `.gitignore`, `.dockerignore` | Existen antes que cualquier otro archivo |
| **D2** | `requirements.txt`, `Dockerfile`, `docker-compose.yml`, `.env.example` | — |
| **D3** | Generar el esqueleto Django (`startproject config .`) dentro del contenedor | Aparecen `manage.py` y `config/` |
| **D4** | Escribir `config/settings.py` con las variables de entorno | — |
| **D5** | Crear `apps/core/` y la vista del health check | — |
| **D6** | Enrutar `config/urls.py` → `admin/` y `api/` | — |
| **D7** | `docker compose build` | Construcción sin errores |
| **D8** | `docker compose up -d` | Ambos servicios en pie; `db` saludable |
| **D9** | `docker compose exec backend python manage.py check` | Sin problemas |
| **D10** | `docker compose exec backend python manage.py migrate` | Aplica las migraciones de Django |
| **D11** | Crear el superusuario — **manual** | Ver verificación manual |
| **D12** | `README.md` | — |

El esqueleto se genera **dentro del contenedor** (D3) y no con un Python del host, para que no dependa de que la máquina tenga Django instalado ni de la versión local de Python.

---

## Verificación

### Automática

```bash
docker compose build
```

```bash
docker compose up -d
```

```bash
docker compose ps
```

```bash
docker compose exec backend python manage.py check
```

```bash
docker compose exec backend python manage.py migrate --check
```

```bash
curl -i http://localhost:8000/api/health/
```

Se espera `200` y el cuerpo `{"status": "ok"}`.

### Manual

1. **Docker Desktop arrancado** antes de empezar. Hoy el demonio no responde.
2. `db` aparece como `healthy` en `docker compose ps`, no solo como `running`.
3. Crear el superusuario, eligiendo la contraseña en el momento:

```bash
docker compose exec backend python manage.py createsuperuser
```

4. Abrir `http://localhost:8000/admin/`, iniciar sesión con ese superusuario y comprobar que aparecen «Usuarios» y «Grupos». **Esta es la prueba real de lectura y escritura contra PostgreSQL**: la creación del superusuario escribió una fila y el inicio de sesión la leyó.
5. Detener y volver a levantar (`docker compose down` sin `-v`, luego `up -d`) y confirmar que el superusuario **sigue existiendo**. Verifica que el volumen persiste.
6. Comprobar que el PostgreSQL nativo del host sigue funcionando y no ha sido afectado.
7. Con el frontend en marcha (`pnpm run dev`), comprobar desde la consola del navegador que una petición a `http://localhost:8000/api/health/` no es bloqueada por CORS.

---

## Riesgos

| # | Riesgo | Probabilidad | Mitigación |
|---|---|---|---|
| R1 | **Conflicto de puerto 5432** con el PostgreSQL nativo del host | **Confirmado presente** | El servicio `db` no publica puertos (decisión 2) |
| R2 | **El demonio de Docker no está arrancado** | **Confirmado presente** | Arrancar Docker Desktop y confirmar `docker info` antes de D7 |
| R3 | **Finales de línea CRLF** rompen la ejecución de archivos dentro del contenedor Linux | Alta en Windows | `.gitattributes` como primer archivo (decisión 7) |
| R4 | El repositorio vive bajo una carpeta sincronizada por **OneDrive**; los montajes de Docker sobre rutas sincronizadas pueden dar lentitud, bloqueos de archivo y ruido de sincronización con `__pycache__` | Media | Añadir `__pycache__/` al `.gitignore` desde el inicio. Si aparece lentitud o bloqueos, **detener y consultar**: mover el repositorio fuera de OneDrive es una decisión del entorno, no de este plan |
| R5 | La imagen `python:3.13-slim` o `postgres:17` no está disponible en la versión fijada | Baja | Detener y consultar antes de sustituir versiones |
| R6 | `django-admin startproject` genera un `settings.py` que luego se reescribe casi entero | Media | Es lo esperado: D3 produce el esqueleto y D4 lo sustituye. No es retrabajo accidental |

---

## Criterios de aceptación

1. `docker compose build` y `docker compose up -d` terminan sin error.
2. `docker compose ps` muestra `db` en estado `healthy` y `backend` en marcha.
3. `python manage.py check` no reporta problemas.
4. `python manage.py migrate` aplica las migraciones de las aplicaciones propias de Django y **ninguna migración de negocio**.
5. `GET /api/health/` responde `200` con `{"status": "ok"}`.
6. `/admin/` carga y permite iniciar sesión con el superusuario creado manualmente.
7. El superusuario sobrevive a un ciclo de `down` y `up`.
8. No existe ningún modelo de dominio: `apps/` contiene únicamente `core`, y `core` no declara modelos.
9. `REST_FRAMEWORK` no está definido en `settings.py`.
10. No hay credenciales en ningún archivo versionado; `.env` está ignorado y `.env.example` solo contiene marcadores.
11. El PostgreSQL nativo del host sigue operativo.
12. El repositorio del frontend no tiene ni un archivo modificado.
13. `docs/` de este repositorio contiene únicamente `plans/`. No hay copia de los ADR, del contrato ni de los requisitos.

---

## Cuestiones que este plan no resuelve

| Cuestión | Dónde corresponde |
|---|---|
| Caducidad y rotación de los tokens; configuración de `simplejwt` | Fase de autenticación, según ADR-003 |
| Paginación, permisos por defecto y renderizadores de DRF | Primera fase con endpoints reales |
| Estructura definitiva de apps para los once modelos | Fase E |
| Estrategia de imágenes: Pillow, `MEDIA_ROOT`, dimensiones y miniaturas | Al implementar RF-002 |
| Configuración de producción, despliegue y copias de seguridad | Fase de despliegue |

## Siguiente paso

Revisar este plan y autorizarlo explícitamente. No se crea ningún archivo en `Back-Artesanic` hasta entonces.
