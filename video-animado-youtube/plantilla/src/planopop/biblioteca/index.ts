// Biblioteca Plano Pop: piezas reutilizables para los explicativos (Remotion + SVG). Catálogo: ./CATALOGO.md
// Uso: import { Llamas, Explosion, Trabajador, MapaEEUU, Barras } from "../biblioteca";
// Lo básico del estilo (paleta C, texto T, Chip, Persona, Lienzo, Marco, utilidades) sigue en ../kit y se
// re-exporta aquí para importar todo de un solo sitio. kit.tsx no se edita.
export {
  C,
  T,
  W,
  H,
  FPS_INF,
  ADELANTO,
  fontFamily,
  fijo,
  pop,
  suave,
  sale,
  en,
  miles,
  Lienzo,
  Marco,
  Chip,
  Pin,
  Equis,
  Persona,
  Torre,
  Pino,
  Nieve,
  Estrellas,
  Termometro,
  Globo,
  CorteBase,
  PanelProfundidad,
  yDePie,
} from "../kit";
export type { EscenaProps } from "../kit";
export * from "./paleta";
export * from "./personajes";
export * from "./animales";
export * from "./fenomenos";
export * from "./espacio";
export * from "./objetos";
export * from "./rotulos";
export * from "./graficos";
export * from "./mapas";
export * from "./escenarios";
// Segunda parte (movimiento y volumen de la referencia)
export * from "./volumen";
export * from "./movimiento";
export * from "./fondos";
export * from "./textos";
export * from "./personaViva";
export * from "./vivas";
// Tercera parte (V10, SR-71): aviación, documentos y mapas regionales
export * from "./aviacion";
export * from "./documentos";
export * from "./regiones";
// Cuarta parte (calidad, 2026-11-24): efectos con volumen (humo, explosión, fuego, estela, polvo, chispas, calor)
export * from "./efectos-ricos";
// Cuarta parte (tras el SR-71): fondos con capas, luz y paralaje que siguen a la cámara
export * from "./fondos-ricos";
// Cuarta parte (tras el SR-71): cámara que cuenta (rig con tomas, rayos X, lupa, recorrido), capa de textos segura y transiciones variadas
export * from "./camara-rig";
// Quinta parte (V11, once días despierto): contador de rodillos y calendario de mesa; cerebro, batería por partes, EEG,
// rata de laboratorio; objetos cotidianos (tocadiscos, pinball, radio, balanza…); escenarios y piezas de los años 60
export * from "./tiempo";
export * from "./mente";
export * from "./cotidiano";
export * from "./epoca60";
// Sexta parte (V12, Triángulo de las Bermudas): barcos, mar con tormenta, fondo marino, brújula de dos agujas,
// anemómetro, corriente y huracán; aviones de los 40 (torpedero, hidroavión, avioneta); archivo e investigación
// (máquina de escribir, microfilm, cartas, dominó, biblioteca de los 70, taza)
export * from "./mar";
export * from "./aviacion40";
export * from "./archivo";
