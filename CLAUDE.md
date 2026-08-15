# 1. Entorno de desarrollo

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

El sistema completo tendrá una arquitectura desacoplada:

Frontend React + TypeScript
        ↓
API REST
        ↓
Django REST Framework
        ↓
SQL Server

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
