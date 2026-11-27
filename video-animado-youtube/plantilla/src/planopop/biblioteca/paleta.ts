// Biblioteca Plano Pop · colores extra y utilidades que comparten las piezas.
// La paleta base es `C` de ../kit. `PB` junta los colores propios de V07 (espacio), V08 (mar) y V09 (volcán):
// donde dos videos tenían el mismo nombre, el color era idéntico.
export const PB = {
  // V07 · espacio
  azul: "#3E86E0",
  azul2: "#2C63B8",
  oro: "#E9B44C",
  oro2: "#C48A2C",
  espacio: "#0E0A26",
  // V08 · mar y fósiles
  agua: "#2F6DB5",
  agua2: "#21528F",
  agua3: "#163A6E",
  abismo: "#0C1838",
  espuma: "#BDE6F1",
  arena: "#E6C98F",
  arena2: "#CFAE6D",
  fosil: "#7D8597",
  fosil2: "#5C6375",
  raiz: "#6B5A4E",
  raiz2: "#4E4038",
  ballena: "#5E7FA6",
  ballena2: "#46668C",
  // V09 · tierra, ceniza y volcán
  tierra: "#FFF4DC",
  borde: "rgba(27,20,67,0.22)",
  lago: "#BDE6F1",
  ceniza1: "#4E5262",
  ceniza2: "#686D7E",
  ceniza3: "#868B9B",
  ceniza4: "#A3A7B4",
  ceniza5: "#C0C2CB",
  ceniza6: "#D9D6CC",
  nube: "#8E93A3",
  nube2: "#B5B9C4",
  roca: "#7B4F3B",
  roca2: "#5E3B4B",
  roca3: "#472C5A",
  cristal: "#C98A5A",
  cristal2: "#E2B07E",
  fundido: "#FF7A2F",
  verde: "#3DBA6A",
  lava: "#3B2E3A",
  mar: "#2F6DB5",
  madera: "#A8703E",
  madera2: "#7E5230",
  // en V08 y V09
  pasto: "#3FAF7E",
  pasto2: "#2F8C63",
  hueso: "#F1E4C6",
  hueso2: "#D8C59C",
};

/** Ancho aproximado de un texto en Montserrat 900 mayúsculas: largo × size × 0.7. */
export const anchoT = (texto: string, size: number) => texto.length * size * 0.7;
export const lim = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;
