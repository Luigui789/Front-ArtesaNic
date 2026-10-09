# ADR-004 — Ubicación y repositorio del backend

**Estado:** Aceptada (decisión registrada; **no implementada** — no existe todavía código del backend).

**Fecha:** 2026-08-15

**Decisión previa relacionada:** [ADR-002 — Acceso a datos y contratos](0002-acceso-a-datos-y-contratos.md)

## Contexto

El [ADR-002](0002-acceso-a-datos-y-contratos.md) ya establecía que la API REST sería «desarrollada en un repositorio separado», pero lo hizo de pasada, dentro de una frase dedicada a otro asunto, y sin nombrar el repositorio. Esa formulación ha resultado insuficiente: al planificar el arranque del backend se propuso crear un directorio `backend/` dentro del repositorio del frontend, lo que contradice la decisión sin que nadie tuviera la impresión de estar contradiciéndola.

Un ADR cuyo contenido hay que deducir de una subordinada no cumple su función. Este documento eleva esa disposición a decisión propia, con su nombre de repositorio, su justificación y sus consecuencias.

El estado real comprobado en el momento de escribir este ADR es que **no existe ninguna línea de código del backend**: no hay `manage.py`, ni `requirements.txt`, ni `Dockerfile`, ni `docker-compose.yml` en ningún punto del árbol. La decisión se toma, por tanto, antes de que exista nada que reubicar.

## Decisión

1. **El backend vive en un repositorio independiente del frontend.** Se confirma y se eleva a decisión propia lo que el ADR-002 enunciaba de pasada.
2. **El repositorio del backend es `Back-Artesanic`.** No se acuña ningún otro nombre.
3. **El frontend permanece en su repositorio actual**, que es el que contiene este documento y que en el disco de trabajo corresponde a la carpeta `masaya-artisan-connect`.
4. **No se crea un directorio `backend/` dentro del repositorio del frontend.** Ninguna parte del código Django, de su configuración o de sus dependencias reside aquí.
5. **La infraestructura de contenedores del backend pertenece a `Back-Artesanic`.** El `Dockerfile`, el `docker-compose.yml` y las variables de entorno del backend viven en ese repositorio, porque lo que se contenedoriza es Django y su base de datos, no el frontend.
6. **La comunicación entre ambos repositorios es exclusivamente HTTP/JSON**, según el contrato definido en [`docs/api/contrato-api.md`](../api/contrato-api.md). No hay dependencia de código, ni importaciones cruzadas, ni artefactos compartidos por sistema de archivos.

### Arquitectura resultante

```text
  Repositorio del frontend            Repositorio Back-Artesanic
┌──────────────────────────┐        ┌──────────────────────────┐
│ React + TypeScript       │        │ Django + DRF             │
│ React Router  → nav.     │        │        ↓                 │
│        ↓                 │        │ PostgreSQL               │
│ TanStack Query → caché   │        │                          │
│        ↓                 │        │ Docker vive aquí         │
│ Servicios                │        │                          │
└────────────┬─────────────┘        └────────────▲─────────────┘
             │                                   │
             └───────────  HTTP/JSON  ───────────┘
                        34 endpoints
                    (contrato-api.md)
```

La única superficie de acoplamiento entre los dos repositorios es el contrato de API. Esa es precisamente la propiedad que la separación busca preservar.

## Consecuencias

**Positivas**

- El contrato de API queda como **única** superficie de acoplamiento, lo que hace comprobable la afirmación de que la arquitectura está desacoplada: si el frontend no puede importar nada del backend, la independencia no depende de la disciplina de quien programa.
- Cada repositorio conserva su propio historial, su propio ciclo de vida y sus propias herramientas. El historial del frontend, que ya documenta la migración de routing y las fases A, B y C, no queda mezclado con el arranque de Django.
- Las herramientas de cada lado no interfieren: `pnpm` y Vite en uno, `pip` y Django en el otro, sin archivos de configuración compitiendo en la raíz.
- El despliegue de cada parte es independiente. Publicar una corrección de interfaz no obliga a redesplegar el backend.

**Negativas y costos asumidos**

- Un cambio que atraviesa el contrato exige **dos commits en dos repositorios**, y nada garantiza automáticamente que ambos lados estén sincronizados. La coherencia recae en el contrato como documento y en la disciplina de actualizarlo.
- No es posible una verificación de tipos de extremo a extremo entre el modelo de Django y los tipos de TypeScript. La correspondencia se sostiene en el contrato escrito, no en el compilador.
- Levantar el sistema completo en desarrollo exige clonar y arrancar dos repositorios.
- El contrato de API se duplica como referencia en ambos lados, o bien vive en uno y se consulta desde el otro. Este ADR no resuelve dónde reside la copia autoritativa.

## Cuestiones que este ADR no resuelve

| Cuestión | Dónde corresponde decidirse |
|---|---|
| Motor de base de datos, dependencias de Python y contenedorización | [ADR-005 — Infraestructura y persistencia del backend](0005-infraestructura-y-persistencia.md) |
| En qué repositorio reside la copia autoritativa del contrato de API y cómo se sincroniza | Decisión posterior, al arrancar `Back-Artesanic` |
| Estructura interna de aplicaciones Django dentro de `Back-Artesanic` | Fase de modelado de datos |
| Origen permitido para CORS y configuración de despliegue conjunto | Fase de configuración del backend |

## Siguiente paso

Registrar el [ADR-005](0005-infraestructura-y-persistencia.md) antes de crear ningún archivo en `Back-Artesanic`.
