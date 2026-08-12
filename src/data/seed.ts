import { CATEGORIES, type Artisan, type Category, type Order, type Product, type Message } from "@/types";
import catCuero from "@/assets/cat-cuero.jpg";
import catHamacas from "@/assets/cat-hamacas.jpg";
import catMadera from "@/assets/cat-madera.jpg";
import catTextiles from "@/assets/cat-textiles.jpg";
import catDulces from "@/assets/cat-dulces.jpg";
import catOtros from "@/assets/cat-otros.jpg";
import taller from "@/assets/taller.jpg";

export const CATEGORY_IMAGE: Record<Category, string> = {
  "Cuero y calzado": catCuero,
  Hamacas: catHamacas,
  Madera: catMadera,
  Textiles: catTextiles,
  Dulces: catDulces,
  Otros: catOtros,
};

export const TALLER_IMAGE = taller;

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

const PRODUCTOS_POR_CATEGORIA: Record<Category, string[]> = {
  "Cuero y calzado": [
    "Sandalias de cuero natural",
    "Bolso repujado a mano",
    "Cinturón de cuero grabado",
    "Cartera artesanal",
    "Zapatos de cuero cosidos a mano",
  ],
  Hamacas: [
    "Hamaca matrimonial de algodón",
    "Hamaca individual multicolor",
    "Hamaca silla colgante",
    "Hamaca con fleco tejido",
  ],
  Madera: [
    "Cuenco tallado de guanacaste",
    "Bandeja de madera de pochote",
    "Figura tallada tradicional",
    "Juego de cucharas de madera",
  ],
  Textiles: [
    "Blusa bordada a mano",
    "Mantel bordado tradicional",
    "Camino de mesa tejido",
    "Bolso de tela bordada",
  ],
  Dulces: [
    "Cajetas de leche artesanales",
    "Dulce de coco tradicional",
    "Surtido de cajetas de Masaya",
    "Melcochas artesanales",
  ],
  Otros: [
    "Jarrón de barro pintado",
    "Cesta tejida de mimbre",
    "Máscara de agüizote",
    "Alcancía de barro decorada",
  ],
};

const ACABADOS = ["", " — acabado natural", " — edición del taller", " — pieza grande", " — pieza pequeña"];

export function buildArtisans(): Artisan[] {
  const r = rng(42);
  const list: Artisan[] = [];
  for (let i = 0; i < 50; i++) {
    const rubro = CATEGORIES[i % CATEGORIES.length] as Category;
    const nombre = pick(r, NOMBRES);
    const apellido = pick(r, APELLIDOS);
    const taller = `${pick(r, TALLER_PREFIX)} ${apellido}`;
    list.push({
      id: `art-${i + 1}`,
      nombreTaller: taller,
      responsable: `${nombre} ${apellido}`,
      historia: `El ${taller.toLowerCase()} nació en ${1970 + Math.floor(r() * 45)} en Masaya. La familia ${apellido} aprendió el oficio de ${rubro.toLowerCase()} de generación en generación y hoy sigue trabajando cada pieza a mano, con materiales de la zona.`,
      descripcion: `Piezas de ${rubro.toLowerCase()} elaboradas a mano en Masaya, bajo pedido y con posibilidad de personalización.`,
      rubro,
      ubicacion: `${pick(r, BARRIOS)}, Masaya`,
      horario: "Lunes a sábado, 8:00 a.m. – 5:00 p.m.",
      telefono: `8${Math.floor(1000000 + r() * 8999999)}`,
      whatsapp: `8${Math.floor(1000000 + r() * 8999999)}`,
      redes: {
        facebook: `facebook.com/${taller.toLowerCase().replace(/\s+/g, "")}`,
        instagram: `@${taller.toLowerCase().replace(/\s+/g, "")}`,
      },
      fotoUrl: CATEGORY_IMAGE[rubro],
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
    const base = pick(r, PRODUCTOS_POR_CATEGORIA[categoria]);
    const nombre = `${base}${pick(r, ACABADOS)}`;
    const precio = Math.round((250 + r() * 4750) / 10) * 10;
    list.push({
      id: `prod-${i + 1}`,
      nombre,
      precio,
      categoria,
      descripcion: `${nombre}. Pieza elaborada a mano en ${artesano.nombreTaller}, ${artesano.ubicacion}. Se produce bajo pedido, por lo que puede solicitarse con medidas, colores o detalles personalizados. Tiempo estimado de elaboración: ${3 + Math.floor(r() * 12)} días.`,
      imagenes: [CATEGORY_IMAGE[categoria], TALLER_IMAGE],
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

export function buildOrders(products: Product[]): Order[] {
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
      id: `ped-${n}`,
      codigo: `PM-${1000 + n}`,
      productoId: prod.id,
      artesanoId: prod.artesanoId,
      compradorId: "user-comprador",
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
          id: `ev-${n}-1`,
          tipo: "pedido",
          estadoAnterior: "—",
          estadoNuevo: "Pendiente",
          usuario: "Ana Lucía Delgado",
          fecha: iso(10 - n),
        },
      ],
      ...extra,
    };
  };

  const orders: Order[] = [
    mk(1, 0, "Pendiente", "Pendiente de pago"),
    mk(2, 3, "Pendiente", "Pendiente de pago"),
    mk(3, 6, "Aceptado", "Pendiente de pago", {
      entrega: { modalidad: "Retiro en taller" },
    }),
    mk(4, 9, "En producción", "Pago registrado", {
      entrega: { modalidad: "Punto de encuentro", detalle: "Parque central de Masaya" },
      pago: {
        metodo: "Transferencia",
        referencia: "TRF-98452",
        comprobanteNombre: "comprobante-transferencia.jpg",
        registradoEn: iso(3),
      },
    }),
    mk(5, 12, "Listo para entrega", "Pago confirmado", {
      entrega: { modalidad: "Entrega directa por el artesano" },
      pago: { metodo: "Transferencia", referencia: "TRF-77120", registradoEn: iso(5) },
    }),
    mk(6, 15, "Entregado", "Pago confirmado", {
      entrega: { modalidad: "Retiro en taller" },
      pago: { metodo: "Pago contra entrega", registradoEn: iso(7) },
    }),
    mk(7, 18, "Rechazado", "Pendiente de pago", {
      motivoRechazo: "En este momento el taller no tiene disponibilidad de material.",
    }),
    mk(8, 21, "Cancelado", "Pendiente de pago", {
      motivoCancelacion: "La compradora ya no necesita la pieza.",
    }),
  ];

  // Historial coherente por pedido.
  for (const o of orders) {
    const flow: Order["estado"][] = ["Aceptado", "En producción", "Listo para entrega", "Entregado"];
    const idx = flow.indexOf(o.estado);
    let prev: string = "Pendiente";
    const steps = idx >= 0 ? flow.slice(0, idx + 1) : [];
    steps.forEach((s, i) => {
      o.historial.push({
        id: `${o.id}-p${i}`,
        tipo: "pedido",
        estadoAnterior: prev,
        estadoNuevo: s,
        usuario: "Taller artesanal",
        fecha: iso(8 - i),
      });
      prev = s;
    });
    if (o.estado === "Rechazado" || o.estado === "Cancelado") {
      o.historial.push({
        id: `${o.id}-t`,
        tipo: "pedido",
        estadoAnterior: prev,
        estadoNuevo: o.estado,
        usuario: o.estado === "Rechazado" ? "Taller artesanal" : "Ana Lucía Delgado",
        fecha: iso(2),
      });
    }
    if (o.estadoPago !== "Pendiente de pago") {
      o.historial.push({
        id: `${o.id}-pay1`,
        tipo: "pago",
        estadoAnterior: "Pendiente de pago",
        estadoNuevo: "Pago registrado",
        usuario: "Ana Lucía Delgado",
        fecha: iso(4),
      });
    }
    if (o.estadoPago === "Pago confirmado") {
      o.historial.push({
        id: `${o.id}-pay2`,
        tipo: "pago",
        estadoAnterior: "Pago registrado",
        estadoNuevo: "Pago confirmado",
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
      id: "msg-1",
      pedidoId: "ped-4",
      autor: "artesano",
      autorNombre: "Taller artesanal",
      texto: "Buenos días, ya empezamos la pieza. ¿Confirma el color café oscuro?",
      fecha: iso(3, 9),
    },
    {
      id: "msg-2",
      pedidoId: "ped-4",
      autor: "comprador",
      autorNombre: "Ana Lucía Delgado",
      texto: "Sí, café oscuro está perfecto. Gracias.",
      fecha: iso(3, 11),
    },
    {
      id: "msg-3",
      pedidoId: "ped-5",
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
