# 1. Entorno de desarrollo

## Stack real del frontend

| Capa | Tecnología |
|---|---|
| Lenguaje | TypeScript (modo estricto) |
| UI | React 19 |
| Enrutamiento | **React Router 8** (`react-router`) |
| Datos / caché | **TanStack Query 5** (`@tanstack/react-query`) |
| Formularios | React Hook Form + Zod |
| Estilos | Tailwind CSS v4 + shadcn/ui + Radix UI |
| Build | Vite 8 (salida SPA estática en `dist/`) |
| Gestor de paquetes | pnpm |

El proyecto **no usa** TanStack Start, TanStack Router, Nitro, Cloudflare Workers ni renderizado en servidor (SSR). Esa infraestructura fue retirada deliberadamente; ver [ADR-001](docs/adr/0001-sistema-de-routing.md). No reintroducirla sin una nueva decisión arquitectónica registrada.

> **No confundir TanStack Router con TanStack Query.** Son paquetes independientes. Se retiró el primero; el segundo es la capa de datos del proyecto y se conserva.

El árbol de rutas se declara explícitamente en `src/app/App.tsx`. **No** hay enrutamiento por convención de nombre de archivo: los nombres con puntos en `src/routes/` (por ejemplo `panel.pedidos.$id.tsx`) son un vestigio de la plantilla original y no afectan la URL. Ver [`src/routes/README.md`](src/routes/README.md).

## Gestor de paquetes

Este proyecto utiliza **pnpm**. No utilizar `bun` ni `npm` para instalar, agregar o eliminar dependencias, ya que generarían archivos de bloqueo paralelos e inconsistentes con `pnpm-lock.yaml`.

| Acción | Comando |
|---|---|
| Instalar dependencias | `pnpm install` |
| Agregar una dependencia | `pnpm add <paquete>` |
| Eliminar una dependencia | `pnpm remove <paquete>` |
| Compilar | `pnpm run build` |
| Servidor de desarrollo | `pnpm run dev` |
| Lint | `pnpm run lint` |

El archivo de bloqueo válido es `pnpm-lock.yaml`. El proyecto fue generado originalmente con Bun; `bun.lock` fue eliminado tras verificar la instalación con pnpm.

## Verificación de cambios

`pnpm run build` **no ejecuta la verificación de tipos**. Para comprobar errores de TypeScript hay que ejecutar además:

```
npx tsc --noEmit
```

Ambos comandos deben pasar antes de considerar un cambio como verificado.

# 2. Alcance actual y arquitectura objetivo

## Alcance actual del repositorio

Este repositorio contiene actualmente el frontend web del proyecto.

En esta fase, las operaciones utilizan datos mock y servicios simulados.

NO implementar todavía dentro de este repositorio:

- Django;
- Django REST Framework;
- SQL Server;
- base de datos;
- migraciones;
- infraestructura backend.

## Arquitectura objetivo del proyecto

El sistema completo tendrá una arquitectura desacoplada. Cada capa resuelve una responsabilidad distinta:

```text
                    FRONTEND
┌─────────────────────────────────────────┐
│ React + TypeScript                      │
│                                         │
│ React Router 8.3.0   → navegación       │
│        ↓                                │
│ Vistas / componentes                    │
│        ↓                                │
│ TanStack Query       → caché y estado   │
│        ↓               de servidor      │
│ Servicios de acceso a datos             │
│        ↓                                │
│ Mock API (actual)                       │
└───────────────────┬─────────────────────┘
                    │
                    │ FUTURO HTTP/JSON
                    ▼
┌─────────────────────────────────────────┐
│ BACKEND                                 │
│ Django REST Framework → recursos HTTP   │
│        ↓                                │
│ SQL Server                              │
└─────────────────────────────────────────┘
```

**El router no es una capa de comunicación con el backend.** React Router resuelve únicamente la navegación entre vistas; TanStack Query resuelve la obtención, caché y estado de los datos de servidor; Django REST Framework expone los recursos vía HTTP/JSON. Son responsabilidades diferentes y ejes independientes: no documentar la arquitectura como una cadena `React → React Router → Django`.

El backend Django/DRF será desarrollado de manera separada.

El frontend debe diseñarse de forma que pueda sustituir los servicios mock por servicios HTTP reales sin necesidad de reescribir la interfaz completa.

### Regla fundamental

La implementación actual mediante mocks representa una sustitución temporal de la API real.

No diseñar nuevas funcionalidades suponiendo que los mocks son la arquitectura definitiva.

Cuando exista una funcionalidad que posteriormente dependa del backend:

- definir claramente los datos que necesita;
- mantener una interfaz de servicio desacoplada;
- evitar colocar lógica de negocio crítica exclusivamente en componentes;
- evitar depender directamente de estructuras internas de `seed.ts`;
- evitar utilizar `localStorage` como sustituto permanente de persistencia;
- evitar hardcodes que impidan sustituir los mocks por API REST.
