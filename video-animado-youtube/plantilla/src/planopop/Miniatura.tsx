// Miniatura de YouTube (1280×720): un arte 16:9 SIN texto (hecho con IA o un cuadro del video) y, encima, un solo
// renglón blanco arriba y centrado, de 1 a 4 palabras, que se ajusta solo al ancho. Sin cifras, flechas ni fichas.
//   npx remotion still MiniaturaTop salida.png --props='{"arte":"miniaturas/01-tema.png","texto":"NO WAY BACK"}' --scale=2
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fontFamily } from "./kit";

export type MiniaturaTopProps = {
  /** imagen de public/ (16:9, sin texto, con la franja de arriba libre) */
  arte: string;
  /** de 1 a 4 palabras, en mayúsculas, sin cifras */
  texto: string;
  /** ancho que debe ocupar el renglón, en fracción del cuadro (por defecto 0,84; 0,93 si pasa de 14 letras) */
  ancho?: number;
  /** tope del alto de la letra, en px de 1280×720 */
  tamMax?: number;
  /** borde de arriba del renglón */
  y?: number;
  /** color de la letra */
  color?: string;
  /** mueven o amplían el arte para acomodar la cara debajo del texto */
  zoom?: number;
  dx?: number;
  dy?: number;
};

// ancho aproximado de cada letra de Montserrat 900 en mayúsculas, en fracción del tamaño de letra
const ANCHO_LETRA = (c: string): number =>
  c === " " ? 0.3 : "I'.,!:".includes(c) ? 0.36 : "MW".includes(c) ? 0.98 : "?JL1".includes(c) ? 0.6 : 0.74;

export const MiniaturaTop: React.FC<MiniaturaTopProps> = ({ arte, texto, ancho, tamMax = 150, y = 14, color = "#fff", zoom = 1, dx = 0, dy = 0 }) => {
  const t = texto.toUpperCase();
  const unidades = [...t].reduce((a, c) => a + ANCHO_LETRA(c), 0);
  // un texto largo va más ancho, para que la letra no baje del 12 % del alto del cuadro
  const tam = Math.min(tamMax, (1280 * (ancho ?? (t.length > 14 ? 0.93 : 0.84))) / Math.max(1, unidades));
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0A2E", overflow: "hidden", fontFamily }}>
      <Img
        src={staticFile(arte)}
        style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, objectFit: "cover", transform: `translate(${dx}px, ${dy}px) scale(${zoom})`, transformOrigin: "50% 60%" }}
      />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 260, background: "linear-gradient(to bottom, rgba(8,6,36,0.6) 0, rgba(8,6,36,0.35) 45%, rgba(8,6,36,0) 100%)" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1280,
          top: y,
          textAlign: "center",
          fontWeight: 900,
          fontSize: tam,
          lineHeight: 1,
          letterSpacing: -tam * 0.012,
          color,
          whiteSpace: "nowrap",
          textShadow: `0 ${tam * 0.06}px 0 #05041C, 0 ${tam * 0.09}px ${tam * 0.2}px rgba(5,4,28,0.95), 0 0 ${tam * 0.45}px rgba(5,4,28,0.75)`,
        }}
      >
        {t}
      </div>
    </AbsoluteFill>
  );
};
