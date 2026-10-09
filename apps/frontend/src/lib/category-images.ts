/**
 * Imágenes de los rubros artesanales.
 *
 * Son recursos de presentación locales: el contrato de API no contempla una
 * imagen para la categoría en ningún punto, de modo que este mapa debe
 * sobrevivir a la desaparición del mock. Por eso vive aquí y no en `seed.ts`.
 *
 * Está indexado por el `codigo` de la categoría.
 */
import catCuero from "@/assets/cat-cuero.jpg";
import catHamacas from "@/assets/cat-hamacas.jpg";
import catMadera from "@/assets/cat-madera.jpg";
import catTextiles from "@/assets/cat-textiles.jpg";
import catDulces from "@/assets/cat-dulces.jpg";
import catOtros from "@/assets/cat-otros.jpg";

export const CATEGORY_IMAGE: Record<string, string> = {
  cuero_y_calzado: catCuero,
  hamacas: catHamacas,
  madera: catMadera,
  textiles: catTextiles,
  dulces: catDulces,
  otros: catOtros,
};
