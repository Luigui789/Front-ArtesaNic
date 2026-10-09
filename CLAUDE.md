# ArtesaNic monorepo

Frontend: `apps/frontend`, React Router/Vite y pnpm. Backend: `apps/backend`, Django/DRF, PostgreSQL, uv y `uv.lock`. Documentación compartida: `docs/`; fuente de alcance actual: `docs/requisitos/requisitos.md` (24 RF y 15 RNF). Contexto específico en los CLAUDE.md de cada aplicación.

No reescribir historial publicado. Mantener los mocks durante esta migración; la única comunicación real autorizada es el endpoint existente `/api/v1/salud/`. No eliminar ramas, repositorios ni volúmenes. Ver `docs/adr/0010-monorepo-y-entorno-de-desarrollo.md` y `CONTRIBUTING.md`.

No crear ni modificar notas de Obsidian automáticamente: requiere autorización explícita para esa operación. Las fuentes de verdad están en `docs/`, no en notas externas.
