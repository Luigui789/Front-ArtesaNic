# ADR-005 — Infraestructura y persistencia del backend

**Estado:** Aceptada (decisión registrada; **no implementada** — no existe todavía código del backend).

**Fecha:** 2026-08-15

**Decisiones previas relacionadas:** [ADR-002 — Acceso a datos y contratos](0002-acceso-a-datos-y-contratos.md), [ADR-004 — Ubicación del backend](0004-ubicacion-del-backend.md)

**Sustituye:** la elección de SQL Server como motor de persistencia, enunciada en el ADR-002 y arrastrada por el resto de la documentación técnica.

## Contexto

Toda la documentación previa describe el sistema final como Django REST Framework **sobre SQL Server**. Esa elección nunca tuvo un ADR propio: aparece por primera vez en una frase de contexto del [ADR-002](0002-acceso-a-datos-y-contratos.md) y se propaga desde ahí al contrato de API, a los requisitos y a la auditoría técnica. Es decir, se comportó como una decisión vigente sin haber sido nunca decidida de forma explícita.

El momento de revisarla es ahora, y esto es lo que hace que la revisión sea barata. El estado comprobado del proyecto es:

- El contrato de API está cerrado en 34 endpoints, sin huecos abiertos.
- El documento de frontera deduce **once modelos** y cinco reglas de negocio transversales.
- **No existe ni una línea de código del backend**: sin `manage.py`, sin `models.py`, sin migraciones, sin base de datos y sin datos productivos.

Cambiar el motor de persistencia después de escribir los modelos y generar migraciones sería una migración de infraestructura. Hacerlo antes es sustituir un párrafo de documentación. La pregunta pertinente, por tanto, no es cuál motor es mejor en abstracto, sino **si conviene revisar la decisión de persistencia antes de construir el backend**; y la respuesta es que este es exactamente el punto de coste mínimo.

### Comparación de las dos opciones

La diferencia decisiva no está en las capacidades del motor —ambos sirven de sobra para el volumen que declara el RNF-007, 50 artesanos y 500 productos— sino en la longitud de la cadena de dependencias que Django necesita para hablar con cada uno:

```text
        PostgreSQL                        SQL Server

          Django                            Django
            ↓                                 ↓
          psycopg                        mssql-django     ← paquete de terceros
            ↓                                 ↓
        PostgreSQL                         pyodbc
                                              ↓
                                        Driver ODBC       ← dependencia del sistema
                                              ↓
                                         SQL Server
```

| Criterio | PostgreSQL | SQL Server |
|---|---|---|
| Soporte en Django | Backend **oficial**, incluido en `django.db.backends` | `mssql-django`, mantenido fuera del proyecto Django |
| Dependencias | `psycopg` | `mssql-django` → `pyodbc` → driver ODBC instalado en la imagen |
| Imagen de contenedor | Ligera | Pesada; además requiere instalar el driver en la imagen de Django |
| Migraciones de Django | Soporte de referencia | Funcional, con particularidades conocidas |
| Licenciamiento | Código abierto | Depende de la edición |
| Documentación previa del proyecto | Exige actualizarla | Ya coincide |

La ventaja de SQL Server es exclusivamente la coherencia con documentos que todavía no han producido código. Es una ventaja real, pero de un solo uso, y se paga una vez; la cadena de drivers se paga en cada construcción de la imagen y en cada incidencia de despliegue.

## Decisión

1. **El motor de persistencia del backend es PostgreSQL.** Sustituye a SQL Server como decisión vigente.
2. **La conexión usa el backend oficial de Django** a través de `psycopg`. No se introducen `mssql-django`, `pyodbc` ni drivers ODBC.
3. **El backend se ejecuta contenedorizado con Docker**, con dos servicios: uno para Django y otro para PostgreSQL. Django se comunica con la base de datos por el **nombre del servicio de Docker**, nunca por `localhost`.
4. **No se introducen otros servicios de infraestructura** —Nginx, Redis, Celery, colas de mensajes— mientras ningún requisito los exija.
5. **Toda la configuración sensible y dependiente del entorno viaja por variables de entorno.** No se escriben credenciales en el código ni se versionan archivos con valores reales.
6. **Esta decisión no altera el modelo conceptual.** Los once modelos deducidos del contrato, las cinco reglas de negocio transversales y los 34 endpoints permanecen exactamente iguales. Lo que cambia es la implementación de la persistencia, que el ORM de Django abstrae.
7. **La documentación previa se actualiza sin reescribir su historia.** Donde SQL Server figuraba como decisión vigente, se sustituye; donde un documento registra el estado del proyecto en un momento dado, se conserva la mención y se anota su sustitución con referencia a este ADR.

### Arquitectura resultante

```text
                    Back-Artesanic
        ┌────────────────────────────────────┐
        │             Docker                 │
        │                                    │
        │   ┌────────────────────────────┐   │
        │   │ Django + DRF               │   │
        │   │   11 modelos               │   │
        │   │   34 endpoints             │   │
        │   └─────────────┬──────────────┘   │
        │                 │ psycopg          │
        │                 │ (db:5432)        │
        │   ┌─────────────▼──────────────┐   │
        │   │ PostgreSQL                 │   │
        │   │   volumen persistente      │   │
        │   └────────────────────────────┘   │
        └────────────────────────────────────┘
```

## Consecuencias

**Positivas**

- La cadena de dependencias entre Django y la base de datos se reduce a un solo paquete, y ese paquete es el que la documentación oficial de Django toma como referencia.
- La imagen de Docker no necesita instalar drivers del sistema, lo que simplifica el `Dockerfile` y acorta el tiempo de construcción.
- El cambio se realiza **antes del modelado**, de modo que no hay migraciones que rehacer ni datos que trasladar. El coste real es documental.
- La revisión explícita de una decisión heredada, con su comparación registrada, es defendible ante un tribunal: demuestra criterio arquitectónico en lugar de inercia.

**Negativas y costos asumidos**

- Obliga a actualizar la documentación que nombra SQL Server, y a hacerlo con cuidado para no falsear el registro histórico.
- Se pierde la coherencia con cualquier expectativa previa de la institución o del equipo respecto al motor de base de datos. Si esa expectativa fuera un requisito real y no una preferencia, esta decisión tendría que revisarse.
- Introduce Docker como dependencia de desarrollo: quien trabaje en el backend necesitará tenerlo instalado y funcionando.
- Añade a la defensa de la tesis la obligación de explicar por qué la decisión cambió, en lugar de presentar una elección única desde el principio. Se asume conscientemente, porque el ADR-005 documenta ese cambio.

## Cuestiones que este ADR no resuelve

| Cuestión | Dónde corresponde decidirse |
|---|---|
| Versiones concretas de Python, Django, DRF y PostgreSQL | Plan de la fase de preparación del entorno |
| Estructura interna de las aplicaciones Django | Fase de modelado de datos |
| Caducidad y rotación de los tokens de autenticación | Pendiente, según [ADR-003](0003-autenticacion-y-autorizacion.md) y la lista B del documento de frontera |
| Política de imágenes: cantidad, dimensiones y miniaturas (RF-002) | Al implementar RF-002 |
| Estrategia de copias de seguridad y despliegue en producción | Fase de despliegue |

## Siguiente paso

Actualizar la documentación que presenta SQL Server como decisión vigente, verificar que no quedan referencias contradictorias y comprobar que ni los requisitos ni el contrato de API cambian por este ADR. Solo después se crea el primer archivo en `Back-Artesanic`.
