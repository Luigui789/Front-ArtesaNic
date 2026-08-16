import type { Artisan, Category, Order, Product, Message } from "@/types";
import { CATEGORY_IMAGE } from "@/lib/category-images";
import taller from "@/assets/taller.jpg";

export const TALLER_IMAGE = taller;

/** Catálogo de rubros que sirve `GET /categorias/` (contrato §2.3 y §4). */
export function buildCategories(): Category[] {
  return [
    { id: 1, codigo: "cuero_y_calzado", nombre: "Cuero y calzado" },
    { id: 2, codigo: "hamacas", nombre: "Hamacas" },
    { id: 3, codigo: "madera", nombre: "Madera" },
    { id: 4, codigo: "textiles", nombre: "Textiles" },
    { id: 5, codigo: "dulces", nombre: "Dulces" },
    { id: 6, codigo: "otros", nombre: "Otros" },
  ];
}

/** Generador determinista simple (mulberry32) para datos mock reproducibles. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(r: () => number, arr: readonly T[]): T => arr[Math.floor(r() * arr.length)] as T;

const BARRIOS = [
  "Barrio Monimbó",
  "Barrio San Juan",
  "Barrio Los Sabogales",
  "Centro de Masaya",
  "Comarca La Reforma",
  "Barrio San Jerónimo",
];

const NOMBRES = [
  "María",
  "José",
  "Carmen",
  "Luis",
  "Rosa",
  "Pedro",
  "Marta",
  "Julio",
  "Elena",
  "Douglas",
  "Ana",
  "Silvio",
];
const APELLIDOS = [
  "Mendoza",
  "Gutiérrez",
  "Pavón",
  "Ortega",
  "Membreño",
  "Cárcamo",
  "Sequeira",
  "Rivas",
  "Zamora",
  "Téllez",
];

const TALLER_PREFIX = ["Taller", "Artesanías", "Casa", "Obrador", "Manos de"];

/** Indexado por el `codigo` de la categoría. */
const PRODUCTOS_POR_CATEGORIA: Record<string, string[]> = {
  cuero_y_calzado: [
    "Sandalias de cuero natural",
    "Bolso repujado a mano",
    "Cinturón de cuero grabado",
    "Cartera artesanal",
    "Zapatos de cuero cosidos a mano",
  ],
  hamacas: [
    "Hamaca matrimonial de algodón",
    "Hamaca individual multicolor",
    "Hamaca silla colgante",
    "Hamaca con fleco tejido",
  ],
  madera: [
    "Cuenco tallado de guanacaste",
    "Bandeja de madera de pochote",
    "Figura tallada tradicional",
    "Juego de cucharas de madera",
  ],
  textiles: [
    "Blusa bordada a mano",
    "Mantel bordado tradicional",
    "Camino de mesa tejido",
    "Bolso de tela bordada",
  ],
  dulces: [
    "Cajetas de leche artesanales",
    "Dulce de coco tradicional",
    "Surtido de cajetas de Masaya",
    "Melcochas artesanales",
  ],
  otros: [
    "Jarrón de barro pintado",
    "Cesta tejida de mimbre",
    "Máscara de agüizote",
    "Alcancía de barro decorada",
  ],
};

const ACABADOS = ["", " — acabado natural", " — edición del taller", " — pieza grande", " — pieza pequeña"];

export function buildArtisans(categorias: Category[]): Artisan[] {
  const r = rng(42);
  const list: Artisan[] = [];
  for (let i = 0; i < 50; i++) {
    const rubro = categorias[i % categorias.length] as Category;
    const nombre = pick(r, NOMBRES);
    const apellido = pick(r, APELLIDOS);
    const taller = `${pick(r, TALLER_PREFIX)} ${apellido}`;
    list.push({
      id: i + 1,
      nombreTaller: taller,
      responsable: `${nombre} ${apellido}`,
      historia: `El ${taller.toLowerCase()} nació en ${1970 + Math.floor(r() * 45)} en Masaya. La familia ${apellido} aprendió el oficio de ${rubro.nombre.toLowerCase()} de generación en generación y hoy sigue trabajando cada pieza a mano, con materiales de la zona.`,
      descripcion: `Piezas de ${rubro.nombre.toLowerCase()} elaboradas a mano en Masaya, bajo pedido y con posibilidad de personalización.`,
      rubro,
      ubicacion: `${pick(r, BARRIOS)}, Masaya`,
      horario: "Lunes a sábado, 8:00 a.m. – 5:00 p.m.",
      telefono: `8${Math.floor(1000000 + r() * 8999999)}`,
      whatsapp: `8${Math.floor(1000000 + r() * 8999999)}`,
      redes: {
        facebook: `facebook.com/${taller.toLowerCase().replace(/\s+/g, "")}`,
        instagram: `@${taller.toLowerCase().replace(/\s+/g, "")}`,
      },
      fotoUrl: CATEGORY_IMAGE[rubro.codigo] as string,
      portadaUrl: TALLER_IMAGE,
    });
  }
  return list;
}

export function buildProducts(artisans: Artisan[]): Product[] {
  const r = rng(7);
  const list: Product[] = [];
  for (let i = 0; i < 500; i++) {
    const artesano = artisans[i % artisans.length] as Artisan;
    const categoria = artesano.rubro;
    const base = pick(r, PRODUCTOS_POR_CATEGORIA[categoria.codigo] as string[]);
    const nombre = `${base}${pick(r, ACABADOS)}`;
    const precio = Math.round((250 + r() * 4750) / 10) * 10;
    list.push({
      id: i + 1,
      nombre,
      precio,
      categoria,
      descripcion: `${nombre}. Pieza elaborada a mano en ${artesano.nombreTaller}, ${artesano.ubicacion}. Se produce bajo pedido, por lo que puede solicitarse con medidas, colores o detalles personalizados. Tiempo estimado de elaboración: ${3 + Math.floor(r() * 12)} días.`,
      imagenes: [CATEGORY_IMAGE[categoria.codigo] as string, TALLER_IMAGE],
      artesanoId: artesano.id,
      disponible: r() > 0.08,
      creadoEn: new Date(Date.now() - Math.floor(r() * 240) * 86400000).toISOString(),
    });
  }
  return list;
}

const now = Date.now();
const iso = (daysAgo: number, hour = 10) =>
  new Date(now - daysAgo * 86400000 + hour * 3600000).toISOString();

/**
 * Identificador del usuario del dataset de demostración. Coincide con
 * `DEMO_USER_ID` de `src/services/mock-api.ts`; el seed no puede importarlo
 * desde ahí porque el mock ya importa este módulo.
 */
const USUARIO_DEMO_ID = 4;

/**
 * Los eventos de auditoría llevan identificador global, como en el contrato
 * (§7, `historial[]`). Se reinicia en cada construcción para que el dataset
 * siga siendo determinista.
 */
let ultimoEventoId = 0;
const nuevoEventoId = () => ++ultimoEventoId;

export function buildOrders(products: Product[]): Order[] {
  ultimoEventoId = 0;
  const p = (i: number) => products[i] as Product;
  const mk = (
    n: number,
    prodIndex: number,
    estado: Order["estado"],
    estadoPago: Order["estadoPago"],
    extra: Partial<Order> = {},
  ): Order => {
    const prod = p(prodIndex);
    const cantidad = 1 + (n % 3);
    return {
      id: n,
      codigo: `PM-${1000 + n}`,
      productoId: prod.id,
      artesanoId: prod.artesanoId,
      compradorId: USUARIO_DEMO_ID,
      compradorNombre: "Ana Lucía Delgado",
      cantidad,
      personalizacion:
        n % 2 === 0 ? "Color más oscuro y con las iniciales A.L.D." : "Tamaño estándar, sin cambios.",
      observaciones: n % 3 === 0 ? "Lo necesito antes de fin de mes." : "",
      estado,
      estadoPago,
      precioUnitario: prod.precio,
      costosAdicionales: n % 2 === 0 ? 150 : 0,
      costoEntrega: n % 3 === 0 ? 120 : 0,
      creadoEn: iso(10 - n),
      historial: [
        {
          id: nuevoEventoId(),
          tipo: "pedido",
          estadoAnterior: "—",
          estadoNuevo: "pendiente",
          usuario: "Ana Lucía Delgado",
          fecha: iso(10 - n),
        },
      ],
      ...extra,
    };
  };

  const orders: Order[] = [
    mk(1, 0, "pendiente", "pendiente"),
    mk(2, 3, "pendiente", "pendiente"),
    mk(3, 6, "aceptado", "pendiente", {
      entrega: { modalidad: "retiro_en_taller" },
    }),
    mk(4, 9, "en_produccion", "registrado", {
      entrega: { modalidad: "punto_de_encuentro", detalle: "Parque central de Masaya" },
      pago: {
        metodo: "transferencia",
        referencia: "TRF-98452",
        comprobanteNombre: "comprobante-transferencia.jpg",
        registradoEn: iso(3),
      },
    }),
    mk(5, 12, "listo_para_entrega", "confirmado", {
      entrega: { modalidad: "entrega_directa" },
      pago: { metodo: "transferencia", referencia: "TRF-77120", registradoEn: iso(5) },
    }),
    mk(6, 15, "entregado", "confirmado", {
      entrega: { modalidad: "retiro_en_taller" },
      pago: { metodo: "otro", registradoEn: iso(7) },
    }),
    mk(7, 18, "rechazado", "pendiente", {
      motivoRechazo: "En este momento el taller no tiene disponibilidad de material.",
    }),
    mk(8, 21, "cancelado", "pendiente", {
      motivoCancelacion: "La compradora ya no necesita la pieza.",
    }),
  ];

  // Historial coherente por pedido.
  for (const o of orders) {
    const flow: Order["estado"][] = ["aceptado", "en_produccion", "listo_para_entrega", "entregado"];
    const idx = flow.indexOf(o.estado);
    let prev: string = "pendiente";
    const steps = idx >= 0 ? flow.slice(0, idx + 1) : [];
    steps.forEach((s, i) => {
      o.historial.push({
        id: nuevoEventoId(),
        tipo: "pedido",
        estadoAnterior: prev,
        estadoNuevo: s,
        usuario: "Taller artesanal",
        fecha: iso(8 - i),
      });
      prev = s;
    });
    if (o.estado === "rechazado" || o.estado === "cancelado") {
      o.historial.push({
        id: nuevoEventoId(),
        tipo: "pedido",
        estadoAnterior: prev,
        estadoNuevo: o.estado,
        usuario: o.estado === "rechazado" ? "Taller artesanal" : "Ana Lucía Delgado",
        fecha: iso(2),
      });
    }
    if (o.estadoPago !== "pendiente") {
      o.historial.push({
        id: nuevoEventoId(),
        tipo: "pago",
        estadoAnterior: "pendiente",
        estadoNuevo: "registrado",
        usuario: "Ana Lucía Delgado",
        fecha: iso(4),
      });
    }
    if (o.estadoPago === "confirmado") {
      o.historial.push({
        id: nuevoEventoId(),
        tipo: "pago",
        estadoAnterior: "registrado",
        estadoNuevo: "confirmado",
        usuario: "Taller artesanal",
        fecha: iso(3),
      });
    }
  }

  return orders;
}

export function buildMessages(): Message[] {
  return [
    {
      id: 1,
      pedidoId: 4,
      autor: "artesano",
      autorNombre: "Taller artesanal",
      texto: "Buenos días, ya empezamos la pieza. ¿Confirma el color café oscuro?",
      fecha: iso(3, 9),
    },
    {
      id: 2,
      pedidoId: 4,
      autor: "comprador",
      autorNombre: "Ana Lucía Delgado",
      texto: "Sí, café oscuro está perfecto. Gracias.",
      fecha: iso(3, 11),
    },
    {
      id: 3,
      pedidoId: 5,
      autor: "artesano",
      autorNombre: "Taller artesanal",
      texto: "Su pedido ya está listo. Puedo entregarlo el jueves por la tarde.",
      fecha: iso(1, 15),
    },
  ];
}

/** Mensajes que "llegan" durante el polling simulado (RF-014 / RNF-010). */
export const MENSAJES_ENTRANTES = [
  "Le comparto una foto del avance cuando termine el día.",
  "El material ya llegó al taller, seguimos con la pieza.",
  "¿Le queda bien coordinar la entrega el próximo sábado?",
  "Terminamos el acabado, solo falta el secado.",
];
