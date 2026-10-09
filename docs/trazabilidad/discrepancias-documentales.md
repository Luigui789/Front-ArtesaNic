# Discrepancias documentales preservadas

Esta migración organiza las fuentes y conserva su procedencia; no implementa nuevos RF ni ratifica reglas pendientes del equipo.

| Fuente / discrepancia | Tratamiento |
|---|---|
| PR #1: 24 RF y 15 RNF; v2.1 local: 22 RF y 15 RNF | Las 39 fichas del PR son la referencia actual. La v2.1, su Anexo A y aprobaciones se conservan como histórico, sin trasladar aprobación a las fichas nuevas |
| PR #1 y su matriz analizaron main `456f613` con TanStack Start, Bun y mocks anteriores | La matriz permanece como análisis histórico y sus enlaces de código apuntan a ese commit. El README actual describe React Router, pnpm y el frontend avanzado |
| La rama avanzada ya simula reservas, pagos, entrega e IndexedDB | Esa simulación se conserva; no se presenta como implementación de las garantías del backend ni del alcance completo |
| Definiciones L-1 a L-6 posteriores a v2.1, incluida modalidad elegida por comprador y límites de unidades | Se conservan con autor y estado pendiente de homologación. No modificar el código ni las fichas nuevas para reconciliarlas durante la reorganización |
| Bloqueo de corrección de pago después de 48 h, marcado V-4 | Se conserva como discrepancia pendiente; no resolverla cambiando el mock en esta fase |
| RF-023/RF-024: movimientos y costos; documentación previa centrada en unidades | Mantener las fichas y guía nuevas; completar lógica funcional en otra fase |
| Contrato propuesto de agosto y autenticación ya implementada | OpenAPI y autenticación del backend gobiernan los endpoints implementados; el contrato previo queda identificado como diseño pendiente |
| ADR-004 exige repos separados y ADR-008 usa Compose solo para db | Se conservan como decisiones históricas; ADR-010 documenta explícitamente la sustitución |
| Enlaces de ADR del backend a main antes de integrar el frontend | Se convierten en enlaces locales centrales; el plan antiguo también enlaza al ADR-003 correcto |
| Dos copias idénticas del plan inicial del backend | Se conserva una copia central y el snapshot Git; no se importa nuevamente la copia vacía |

RF-012 sigue postergado. La homologación de fichas y decisiones operativas corresponde al equipo. La comprobación técnica de salud no acredita integración funcional de pedidos, pagos, inventario o autenticación de la interfaz.
