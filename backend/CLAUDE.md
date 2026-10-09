## Project identity
- project-id: `masaya-artisan-connect`   (mismo id que el repositorio frontend; identificador canónico y estable, independiente del nombre físico de la carpeta)
- Repository: `Back-Artesanic` (backend) — GitHub: https://github.com/Luigui789/Back-Artesanic
- Repositorio hermano (frontend): `Front-ArtesaNic` — GitHub: https://github.com/Luigui789/Front-ArtesaNic
  (antes `masaya-artisan-connect`, nombre que conserva su carpeta local; contiene los requisitos y los ADR 001–005)

## Qué es este repositorio
Backend de ArtesaNic: Django 5.2 LTS + Django REST Framework + PostgreSQL 17, monolito
modular por dominio (`apps/<dominio>/`). Fase 1 implementada en la rama
`feat/backend-foundation-auth`: cuentas, registro, login/refresh/logout (ADR-003 concretado por
ADR-007), permisos por rol y propietario, Django Admin de cuentas y OpenAPI generado.
Estructura y crecimiento: `docs/arquitectura.md`.

## Entorno y comandos (ADR-008)
- PostgreSQL en Docker Compose (`docker compose up -d`, puerto local 5434); Django en el host con `uv`.
- Dependencias: `pyproject.toml` + `uv.lock` (`uv sync`). No usar pip ni requirements.txt.
- Pruebas (siempre contra PostgreSQL, nunca SQLite): `uv run python manage.py test`
- Calidad: `uv run ruff check .` · `uv run ruff format --check .` · `uv run python manage.py makemigrations --check --dry-run`
- Tras cambiar un endpoint, regenerar el contrato: `uv run python manage.py spectacular --validate --fail-on-warn --file docs/api/openapi.yaml` (una prueba falla si no coincide).

## Fuente de verdad (no duplicar aquí)
- RF, RNF y módulos: solo en el frontend (`docs/requisitos/`). Aquí se citan por identificador; no se copian ni se renumeran.
- Contrato de lo implementado: este repositorio (`docs/api/openapi.yaml` + `docs/api/<módulo>.md`). Lo no implementado sigue en `docs/api/contrato-api.md` del frontend (ADR-009).
- ADR: numeración única entre ambos repositorios; el 006 está reservado. Índice: `docs/adr/README.md`.

## Mapa de tareas
| Tarea | Leer primero |
|---|---|
| Cuentas, sesión, permisos | `docs/api/autenticacion.md`, ADR-003 (frontend), ADR-007 |
| Entorno, dependencias, configuración | `docs/desarrollo-local.md`, ADR-008 |
| Nuevo dominio (talleres, catálogo…) | `docs/arquitectura.md`, `docs/trazabilidad.md` (diferencias pendientes) |
| Requisitos de una funcionalidad | `docs/requisitos/` del frontend |

## Obsidian para este proyecto
- Índice: `note_read 10-Projects/masaya-artisan-connect/masaya-artisan-connect.md`; contexto: `frontmatter_query field=project value=masaya-artisan-connect`.
- Consultar **cuando aporte** (investigación, decisión arquitectónica, tema transversal, ambigüedad resoluble con conocimiento previo). No es obligatorio en tareas mecánicas ni cuando `docs/`/ADRs ya alcanzan.
- **No crear ni modificar notas de Obsidian automáticamente**: requiere pedido o aprobación explícita para *esa* escritura.
- El MCP `obsidian-vault` es solo de lectura; toda escritura en Obsidian se hace por filesystem, no por MCP.
- La aprobación es **por operación lógica**, no por cada escritura interna: mostrar la nota destino y el cambio concreto y recibir un "sí" habilita ese cambio completo, pero no habilita tocar notas no mencionadas.
- Obsidian aporta contexto; la verdad del proyecto está en `docs/`/ADRs del repositorio frontend y de este repositorio.
