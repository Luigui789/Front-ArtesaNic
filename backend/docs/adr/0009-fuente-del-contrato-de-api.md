# ADR-009 — Fuente del contrato de API implementado y de la documentación compartida

**Estado:** Propuesta, pendiente de revisión del equipo.

**Fecha:** 2026-10-04

**Decisiones previas relacionadas:** [ADR-004 — Ubicación del backend](https://github.com/Luigui789/Front-ArtesaNic/blob/main/docs/adr/0004-ubicacion-del-backend.md), que dejó abierta esta cuestión: «En qué repositorio reside la copia autoritativa del contrato de API y cómo se sincroniza — decisión posterior, al arrancar `Back-Artesanic`».

## Contexto

El contrato de API (`docs/api/contrato-api.md`) vive en el repositorio del frontend y se escribió antes de que existiera código del backend. Con el backend en marcha hay dos riesgos: que el documento y el código diverjan sin que nadie lo note, y que existan dos copias del contrato o de los requisitos que parezcan igual de válidas.

Además, el contrato de agosto describe 34 endpoints a partir de los 16 RF de la línea base, mientras que la especificación vigente (v2.1, incorporada al frontend el 4 de octubre de 2026) tiene 22 RF y 15 RNF, con cambios en pedidos, pagos y entregas.

## Decisión

1. **Contrato implementado: lo publica el backend.** Para cada grupo de endpoints ya implementado, la referencia es `docs/api/openapi.yaml`, generado desde el código, junto con `docs/api/<módulo>.md` para lo que OpenAPI no expresa bien (cookies, CSRF, flujos, reglas). Una prueba falla si el esquema no coincide con las rutas reales o con el archivo versionado.
2. **Contrato por implementar: sigue en el frontend.** `contrato-api.md` conserva el diseño de los endpoints que aún no existen. Al implementar un grupo, su sección debe remitir al backend en lugar de mantener una segunda versión. Esa edición pertenece al repositorio del frontend.
3. **Requisitos y módulos: una sola fuente editable**, `docs/requisitos/` del frontend. El backend los enlaza y cita por identificador; no los copia ni los renumera.
4. **Numeración de ADR única entre ambos repositorios.** Los ADR del backend viven en `docs/adr/` de este repositorio y continúan la secuencia. El ADR-006 está reservado al modelo de oferta y pedido (decisión D18 de la hoja de ratificación y `requisitos.md`). Antes de crear un ADR hay que consultar los dos repositorios; el índice está en [`README.md`](README.md).

## Consecuencias

**Positivas**

- El contrato de lo implementado no puede desviarse del código sin que falle una prueba.
- Una sola fuente por tipo de documento, con dueño claro.

**Negativas y costos asumidos**

- Quien trabaje en el frontend debe leer el contrato implementado en otro repositorio.
- La sección 3 de `contrato-api.md` queda desactualizada hasta que se edite en el frontend.
- Los enlaces entre repositorios apuntan a `main` y no resuelven hasta que ese contenido llegue allí.
- El contrato de agosto debe revisarse contra la v2.1 antes de implementar pedidos, pagos y entregas.
