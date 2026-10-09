/**
 * Validación de imágenes que suben las personas usuarias: fotografías de
 * producto y del taller (RF-002, RF-008) y comprobantes de pago (RF-011).
 * El servidor repetirá esta validación; aquí solo se adelanta el aviso.
 */
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const IMAGE_ACCEPT = IMAGE_TYPES.join(",");
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_RULES_TEXT = "Formatos JPG, PNG o WebP, hasta 5 MB.";

export function imageFileError(file: { type: string; size: number }): string | null {
  if (!(IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "El archivo debe ser una imagen JPG, PNG o WebP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "La imagen es muy pesada. Usa una de menos de 5 MB.";
  }
  if (file.size === 0) {
    return "El archivo está vacío.";
  }
  return null;
}

export function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No pudimos leer la imagen. Intenta con otra."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
