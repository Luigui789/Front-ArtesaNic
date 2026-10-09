# Informe de consolidación y migración a monorepo

Validación local completada el 9 de octubre de 2026, zona America/Managua. Rama de migración: `chore/monorepo-migration`. Repositorio base: `Luigui789/Front-ArtesaNic`; fuente del frontend: `feat/presentation-polish` (`bf15b07`) y los cambios locales registrados por separado. La implementación se realizó en una copia aislada `ArtesaNic`; las copias anteriores se conservan.

## Commits creados

| Commit | Etapa | Contenido |
|---|---|---|
| `a93a790` | Consolidación | pnpm y contexto del proyecto; 2 archivos locales |
| `7fc618c` | Consolidación | Protección de instantáneas y reversión ante fallos de persistencia; 4 archivos locales |
| `eb526c3` | Consolidación | Textos de pagos y eventos sin transición; 3 archivos locales |
| `9341431` | Consolidación | Especificación v2.1, aprobaciones históricas, módulos y revisión de la demo; 3 archivos locales |
| `f403ba7` | Consolidación | Merge del frontend avanzado y la documentación de 24 RF/15 RNF |
| `346ec6c` | Consolidación | Formato heredado; 6 archivos con cambios de contenido de formato |
| `8a6a3a6` | Snapshot backend | 60 archivos iniciales, con verificación SHA-256; excluye .env, entornos y cachés |
| `7bcebd9` | Migración | Traslado, documentación central, ADR-010, variables, Docker, scripts y CI |
| `4658c1e` | Verificación | Corrección aislada de una aserción de reloj en la prueba existente; no cambia el mock |
| `6216ca8` | Entrega | Informe con pruebas locales, preservación, discrepancias y candidatos posteriores |
| `bd5f0e3` | CI | Comillas del healthcheck PostgreSQL corregidas para el runner; sin cambio de aplicación |

Los 17 commits originales de la rama avanzada permanecen en el historial. El PR #1 fue fusionado en `main` mediante `203bb5b` y el commit exacto `3bbbb07` es ancestro de esta rama. No se reescribió historial publicado, no se hizo squash ni se eliminaron ramas.

## Archivos movidos y rutas corregidas

El [manifiesto completo](migracion-archivos.csv) contiene los 205 archivos de partida con ruta origen, destino, acción y SHA-256 de origen: **191 movimientos**, **9 archivos conservados en su ubicación** y **5 configuraciones retiradas o sustituidas**. Incluye 121 destinos en `apps/frontend`, 47 en `apps/backend` y 23 traslados documentales.

- Frontend: código, recursos, configuración, package.json, pnpm-lock.yaml y verificaciones bajo `apps/frontend`.
- Backend: manage.py, config, apps de dominio, migraciones, pyproject.toml, uv.lock y Python bajo `apps/backend`.
- Documentación: las 39 fichas actuales en `docs/requisitos`; v2.1 en `docs/requisitos/historico`; ADR únicos en `docs/adr`; contratos en `docs/api`; planes en `docs/planes`; arquitectura y trazabilidad en sus carpetas centrales.
- Dockerfiles en `infra/docker`, herramientas en `infra/scripts`, workflows en `.github/workflows` y Compose en raíz.
- Referencias internas adaptadas al destino. Las evidencias del análisis de main antiguo apuntan al commit `456f613`, donde existen router.tsx/start.ts y la arquitectura inspeccionada.
- Django calcula `REPO_ROOT` y `DOCS_DIR`; carga el .env de raíz y permite uno específico. La prueba OpenAPI usa la ruta central y el comando de regeneración usa `../../docs/api/openapi.yaml`.
- Vite recibe `API_PROXY_TARGET` y ofrece `/api` para la sonda. No se modificaron servicios HTTP de negocio ni componentes para consumir Django.

## Duplicados y configuraciones retiradas

Una sola copia central del plan inicial del backend; ambas copias de origen eran idénticas. Los .gitignore se consolidaron en raíz; la configuración LF del backend pasa a .gitattributes de raíz. Se retiraron bunfig.toml, el compose.yaml exclusivo de db y las configuraciones locales sustituidas. Sus versiones quedan en Git. No se retiraron dependencias de producto ni se actualizó una versión mayor.

## Documentación y comportamiento preservados

Las **39 fichas se compararon exactamente** con el bloque de requisitos de `3bbbb07`; mantienen campos, autores, responsables, estados y dependencias. En el archivo completo solo cambian dos enlaces hacia la matriz reubicada. RF-012 sigue postergado.

Se preservan v2.1, Anexo A con aprobaciones históricas, definiciones L-1 a L-6, módulos, auditoría, planes, contratos, matriz del PR #1 y ADR anteriores. [Discrepancias documentales](discrepancias-documentales.md): 24 RF frente a los 22 anteriores, arquitectura del main antiguo frente a la SPA avanzada, definición de entrega, plazo de corrección de pago y contratos propuestos frente a endpoints implementados. No se ratificaron decisiones funcionales pendientes.

Todo `src/**/*.ts`, `src/**/*.tsx` y `src/**/*.css` del frontend coincide con la rama de consolidación. `pnpm-lock.yaml` y `uv.lock` conservan exactamente su contenido normalizado por finales de línea. `pyproject.toml` conserva todos sus valores TOML; solo se corrigió un comentario de documentación. Las cuentas, autenticación y migraciones del backend permanecen sin cambio funcional.

## Resultados de validación local

| Verificación | Resultado |
|---|---|
| Instalación limpia frontend | `pnpm install --frozen-lockfile` en la ubicación final: aprobado, 329 paquetes, pnpm 10.30.3 |
| Lint frontend | Aprobado: 0 errores, 9 advertencias heredadas de react-refresh |
| Typecheck | `pnpm typecheck`: aprobado |
| Pruebas frontend | `pnpm test`: aprobado; cantidades, concurrencia, reservas, congelación, entregas, pagos, plazos, privacidad, clasificación, reversión y restablecimiento |
| Build frontend | `pnpm build`: aprobado, 1976 módulos; bundle principal 676.12 kB, 198.39 kB gzip |
| Instalación limpia backend | `uv sync --locked`: aprobado, entorno nuevo y 21 paquetes instalados desde uv.lock |
| Calidad backend | Ruff: aprobado; 41 archivos con formato correcto |
| Checks Django | Aprobados, sin incidencias; también comprobado dentro del contenedor |
| Migraciones pendientes | `makemigrations --check --dry-run`: sin cambios |
| Migraciones | `migrate --noinput`: todas aplicadas en la base nueva de validación |
| Tests Django | 77 pruebas aprobadas en PostgreSQL; base temporal de pruebas creada y destruida |
| OpenAPI | Regeneración validada y prueba de igualdad con el esquema generado aprobada; cambia la descripción documental del monorepo |
| PostgreSQL | 17.11 saludable; consulta SQL a `artesanic` aprobada |
| Compose | `docker compose up --build -d --wait --wait-timeout 180`: aprobado, los tres servicios saludables |
| Salud desde frontend | `GET http://127.0.0.1:5173/api/v1/salud/` por proxy de Vite: HTTP 200 y `{"estado":"ok"}` |
| Herramientas Windows | PowerShell parseado y tareas Docs y Health ejecutadas correctamente |
| Enlaces internos | 218 enlaces (archivos y anclas) aprobados al registrar la entrega |
| Revisión de secretos | Sin coincidencias en 226 archivos y 428 blobs de historial antes del commit de informe; validación final repetida al publicar |

La primera pasada de lint encontró 13411 errores de formato heredado, corregidos sin desactivar reglas. Una prueba de plazo falló por 1 ms entre dos lecturas del reloj; su aserción ahora compara las 48 horas con el intervalo real de la operación. El código de pagos sigue intacto.

El build conserva avisos de chunk mayor a 500 kB y de vite-tsconfig-paths, además de métricas de plugins. No se introduce división de código ni cambios de dependencias por esta reorganización.

## Base de datos y secretos

La revisión automática rechazó copiar el .env real anterior. Se continuó con valores de ejemplo y aislamiento: proyecto Compose `artesanic-monorepo-validation`, volumen `artesanic_monorepo_validation_data`. El .env local de esta copia está ignorado y contiene esa selección de volumen.

`artesanic_postgres_data` conserva su nombre y fecha de creación `2026-10-04T20:12:02Z`; el contenedor original `artesanic-db-1` permanece detenido y montando ese volumen. No se migraron ni alteraron sus datos ni se duplicaron sus credenciales. Las migraciones y pruebas informadas corresponden a la base nueva de validación.

La revisión local recorre archivos versionables e historial alcanzable buscando claves privadas, tokens y patrones de credenciales, sin imprimir valores ni enviar datos a terceros. No encontró coincidencias. Es una revisión por patrones, no una certificación exhaustiva. Las únicas credenciales registradas son ejemplos explícitos de desarrollo/CI y datos ficticios de pruebas.

## PR, orden de integración y pendientes

[PR #2 de consolidación](https://github.com/Luigui789/Front-ArtesaNic/pull/2) tiene base `main`. El [PR #3 de migración](https://github.com/Luigui789/Front-ArtesaNic/pull/3) tiene base `codex/frontend-consolidation`, para revisar el traslado separado de los avances funcionales existentes. Ambos quedan abiertos para revisión; no se fusionan automáticamente. Al aprobar la consolidación, se puede integrar esa rama y revisar/retargetear el PR de migración a `main` conservando sus commits.

Los workflows frontend, backend e integración están preparados con filtros de rutas. La validación local descrita está completa; el resultado remoto de GitHub Actions se informa por separado. La identificación de Lovable y su historial se preservan, pero no se verificó su editor con `apps/frontend`; comprobarlo antes de usar esa herramienta para desarrollar de nuevo.

| Rama / repositorio | Candidatura posterior | Condición |
|---|---|---|
| `feature/migrar-react-router` | Eliminar rama redundante | Sus commits están en la línea avanzada; esperar a que la migración esté integrada y aprobada |
| `feat/presentation-polish` | Eliminar rama redundante | Confirmar integración de los 17 commits y aprobación final |
| `codex/docs-24rf-15rnf` | Eliminar rama documental | PR #1 fusionado; commit exacto preservado; esperar autorización final |
| `codex/frontend-local-consolidation` local | Limpiar copia/ramas de respaldo | Verificar los cuatro commits en main y confirmar explícitamente |
| `codex/frontend-consolidation` | Eliminar después de sus PR | Solo cuando ambos PR estén integrados y haya aprobación |
| `chore/monorepo-migration` | Eliminar después de su PR | Solo tras integración y aprobación |
| `Back-Artesanic` remoto | Evaluar archivo histórico | No se archiva ahora; decisión separada del responsable |

No se eliminaron ramas remotas, repositorios ni volúmenes. No se creó una función nueva de pedidos, inventario, pagos u otros RF.

## Verificación remota de CI

GitHub Actions aprobó los tres workflows en el commit `bd5f0e3`, con instalación limpia y PostgreSQL en un runner Linux:

- [Frontend aprobado](https://github.com/Luigui789/Front-ArtesaNic/actions/runs/37891726925): instalación congelada, lint, typecheck, pruebas y build.
- [Backend aprobado](https://github.com/Luigui789/Front-ArtesaNic/actions/runs/37891726936): instalación uv bloqueada, Ruff, checks, migraciones y tests PostgreSQL.
- [Integración aprobada](https://github.com/Luigui789/Front-ArtesaNic/actions/runs/37891726944): enlaces, patrones de secretos, construcción y arranque de los tres servicios, y sonda real desde Vite.

El primer job Backend falló antes del checkout por las comillas simples del argumento `--health-cmd` de PostgreSQL. Se corrigió únicamente ese argumento a comillas dobles en `bd5f0e3`; la nueva ejecución pasó. Esta actualización final solo registra la evidencia remota, sin cambiar aplicaciones o dependencias.
