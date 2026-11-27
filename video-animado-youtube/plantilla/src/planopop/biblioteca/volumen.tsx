// Biblioteca Plano Pop · volumen: sombras, brillos, viñeta, grano y colores de luz y sombra.
// La referencia (The Infographics Show) no tiene objetos «pegatina»: cada cosa lleva dos tonos, un brillo y una
// sombra. Pon <DefsVolumen /> una vez por <Lienzo> y usa los filtros con filter="url(#vol-sombra)" etc.
import React from "react";
import { random } from "remotion";
import { C, H, W } from "../kit";

// ---------- colores ----------
const aRGB = (hex: string): [number, number, number] | null => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const aHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((v) =>
      Math.max(0, Math.min(255, Math.round(v)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");

/** Mezcla dos colores hex (t = 0 → a, 1 → b). Si alguno no es #RRGGBB, devuelve a. */
export const mezclaColor = (a: string, b: string, t: number) => {
  const x = aRGB(a);
  const y = aRGB(b);
  if (!x || !y) return a;
  return aHex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t);
};
/** Aclara un color hacia el blanco (t 0..1). */
export const aclarar = (c: string, t = 0.25) => mezclaColor(c, "#FFFFFF", t);
/** Oscurece un color hacia el navy del estilo (t 0..1): la sombra nunca es negra pura. */
export const oscurecer = (c: string, t = 0.25) => mezclaColor(c, C.negro, t);
/** Luz, base y sombra de un color: el sombreado de dos tonos de la referencia (más un brillo). */
export const dosTonos = (color: string, fuerza = 1) => ({
  luz: aclarar(color, 0.28 * fuerza),
  base: color,
  sombra: oscurecer(color, 0.3 * fuerza),
  brillo: aclarar(color, 0.65 * fuerza),
});

// ---------- defs ----------
/**
 * Filtros y degradados reutilizables. Una vez por <Lienzo> (con `pre` distinto si hay dos lienzos a la vez):
 *   url(#vol-sombra)   sombra proyectada suave (abajo a la derecha)
 *   url(#vol-sombra-dura)  sombra plana desplazada (textos)
 *   url(#vol-brillo)   resplandor (núcleos, chispas, pantallas)
 *   url(#vol-grano)    grano leve (úsalo en <Grano />)
 *   url(#vol-vineta)   degradado radial de la viñeta (úsalo en <Vineta />)
 *   url(#vol-esfera)   degradado radial blanco→transparente para dar volumen a esferas (encima del color)
 */
export const DefsVolumen: React.FC<{ pre?: string; sombra?: string }> = ({ pre = "vol", sombra = C.negro }) => (
  <defs>
    <filter id={`${pre}-sombra`} x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx={8} dy={14} stdDeviation={10} floodColor={sombra} floodOpacity={0.38} />
    </filter>
    <filter id={`${pre}-sombra-dura`} x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx={6} dy={8} stdDeviation={0} floodColor={sombra} floodOpacity={0.45} />
    </filter>
    <filter id={`${pre}-brillo`} x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={14} result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id={`${pre}-grano`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={3} result="r" />
      <feColorMatrix in="r" type="saturate" values="0" />
    </filter>
    <radialGradient id={`${pre}-vineta`} cx="50%" cy="50%" r="75%">
      <stop offset="55%" stopColor={sombra} stopOpacity={0} />
      <stop offset="100%" stopColor={sombra} stopOpacity={0.55} />
    </radialGradient>
    <radialGradient id={`${pre}-esfera`} cx="35%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.45} />
      <stop offset="45%" stopColor="#FFFFFF" stopOpacity={0.08} />
      <stop offset="100%" stopColor={sombra} stopOpacity={0.35} />
    </radialGradient>
  </defs>
);

/** Viñeta oscura en los bordes (escenas oscuras). Necesita <DefsVolumen />. */
export const Vineta: React.FC<{ o?: number; pre?: string }> = ({ o = 1, pre = "vol" }) => (
  <rect width={W} height={H} fill={`url(#${pre}-vineta)`} opacity={o} pointerEvents="none" />
);

/** Grano leve que cambia cada 2 fotogramas (textura de papel/pantalla). Necesita <DefsVolumen />. */
export const Grano: React.FC<{ f: number; o?: number; pre?: string }> = ({ f, o = 0.06, pre = "vol" }) => {
  const k = Math.floor(f / 2) % 4;
  return (
    <g opacity={o} style={{ mixBlendMode: "overlay" }} pointerEvents="none">
      <rect x={-k * 7} y={-k * 5} width={W + 40} height={H + 40} filter={`url(#${pre}-grano)`} />
    </g>
  );
};

/** Sombra en el suelo bajo un personaje u objeto; `alto` (px sobre el suelo) la achica y aclara. */
export const SombraSuelo: React.FC<{
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  o?: number;
  alto?: number;
  color?: string;
}> = ({ x, y, rx = 110, ry = 18, o = 0.22, alto = 0, color = C.negro }) => {
  const k = 1 / (1 + Math.max(0, alto) / 300);
  return <ellipse cx={x} cy={y} rx={rx * k} ry={ry * k} fill={color} opacity={o * k} />;
};

/** Brillo de esfera: pon encima de un círculo de color para que se vea redondo. Necesita <DefsVolumen />. */
export const BrilloEsfera: React.FC<{ cx: number; cy: number; r: number; pre?: string }> = ({ cx, cy, r, pre = "vol" }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${pre}-esfera)`} />
    <ellipse
      cx={cx - r * 0.38}
      cy={cy - r * 0.42}
      rx={r * 0.2}
      ry={r * 0.12}
      fill="#FFFFFF"
      opacity={0.55}
      transform={`rotate(-35 ${cx - r * 0.38} ${cy - r * 0.42})`}
    />
  </g>
);

/** Motas de polvo o luz que flotan delante de todo (profundidad barata). */
export const Polvo: React.FC<{ f: number; n?: number; color?: string; o?: number; semilla?: string }> = ({
  f,
  n = 26,
  color = "#FFFFFF",
  o = 0.35,
  semilla = "pv",
}) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, k) => {
      const v = 0.3 + random(`${semilla}v${k}`) * 0.7;
      const x = ((random(`${semilla}x${k}`) * (W + 200) + f * v) % (W + 200)) - 100;
      const y = random(`${semilla}y${k}`) * H + Math.sin(f / 30 + k) * 20;
      return (
        <circle
          key={k}
          cx={x}
          cy={y}
          r={2 + random(`${semilla}r${k}`) * 4}
          fill={color}
          opacity={0.4 + 0.4 * Math.sin(f / 12 + k)}
        />
      );
    })}
  </g>
);
