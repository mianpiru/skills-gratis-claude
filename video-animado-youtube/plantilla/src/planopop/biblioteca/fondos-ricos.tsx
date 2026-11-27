// Biblioteca Plano Pop · fondos ricos (desde el 2026-11-24, tras el SR-71: «los fondos se ven súper básicos»).
// Reemplazan a FondoEstrellas, FondoNubes, FondoTundra, etc. en los videos nuevos. Estilo vectorial plano del canal,
// pero con profundidad: 3–5 capas con paralaje, luz y sombra de dos o tres tonos, bruma entre planos y brillo.
//
// Todos llenan el cuadro (1920×1080), van PRIMERO dentro del <Lienzo> y son deterministas (random() de Remotion).
// Props comunes:
//   f        fotograma local
//   camara   {x, y, zoom} opcional: lo que se movió la cámara (px a la derecha / abajo, zoom 1 = normal). Cada capa
//            se mueve según su profundidad (la lejana casi nada, la cercana todo), así el paralaje sigue a la cámara.
//   vel      multiplica la velocidad de la deriva (0 = quieto salvo el titilar y el oleaje)
//   semilla  cambia la disposición (estrellas, nubes, montañas…)
//   id       prefijo de degradados y filtros: si hay dos fondos del mismo tipo en una escena, dale ids distintos
import React from "react";
import { interpolateColors, random } from "remotion";
import { H, W } from "../kit";
import { aclarar, mezclaColor, oscurecer } from "./volumen";

// =====================================================================================================
// utilidades
// =====================================================================================================
export type CamaraFondo = { x?: number; y?: number; zoom?: number };

const envolver = (v: number, m: number) => ((v % m) + m) % m;
const r0 = (s: string) => random(s);
const fx = (n: number) => n.toFixed(1);

/**
 * Desplazamiento y zoom de una capa de profundidad d (0 = infinito, 1 = plano de la cámara). Al alejar la cámara
 * (zoom < 1) las capas NO se encogen: si lo hicieran dejarían ver bordes vacíos (lección del 2026-11-24). Interior, que
 * sí se aleja, extiende su caja según el zoom.
 */
const capa = (cam: CamaraFondo | undefined, d: number) => ({
  dx: (cam?.x ?? 0) * d,
  dy: (cam?.y ?? 0) * d,
  s: 1 + (Math.max(1, cam?.zoom ?? 1) - 1) * d,
});
/** transform de una capa entera (para lo que no se repite en bucle). */
const capaT = (cam: CamaraFondo | undefined, d: number) => {
  const { dx, dy, s } = capa(cam, d);
  return `translate(${fx(W / 2 - dx)},${fx(H / 2 - dy)}) scale(${s.toFixed(4)}) translate(${-W / 2},${-H / 2})`;
};
/** Solo el zoom de la capa (para lo que se repite en bucle y ya lleva el desplazamiento en su posición). */
const zoomT = (cam: CamaraFondo | undefined, d: number) => {
  const { s } = capa(cam, d);
  return `translate(${W / 2},${H / 2}) scale(${s.toFixed(4)}) translate(${-W / 2},${-H / 2})`;
};

type Momento = "dia" | "atardecer" | "noche";

/** Tiñe un color del día según la hora (atardecer: cálido y violeta; noche: azul oscuro). */
const tintar = (c: string, m: Momento, k = 1) =>
  m === "dia" ? c : m === "atardecer" ? mezclaColor(c, "#8A4672", 0.3 * k) : mezclaColor(c, "#141A3E", 0.64 * k);

/** Colores de un cielo de arriba (0) al horizonte (1). */
const colorCielo = (stops: string[], t: number) =>
  interpolateColors(
    t,
    stops.map((_, i) => i / (stops.length - 1)),
    stops,
  );

// =====================================================================================================
// piezas compartidas
// =====================================================================================================

/**
 * Cielo por franjas: degradado en bandas planas (estilo vectorial), concéntricas a la curvatura de la Tierra.
 * R = radio de la Tierra en px (grande = horizonte recto). Ocupa todo el cuadro hasta el horizonte.
 */
const CieloFranjas: React.FC<{ stops: string[]; horizonte: number; R: number; n?: number; cam?: CamaraFondo; d?: number }> = ({
  stops,
  horizonte,
  R,
  n = 14,
  cam,
  d = 0.04,
}) => {
  const cx = W / 2;
  const cy = horizonte + R;
  return (
    <g transform={capaT(cam, d)}>
      <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={stops[0]} />
      {Array.from({ length: n }, (_, k) => {
        const t = (k + 1) / n;
        const alto = (horizonte + 260) * Math.pow(1 - t, 1.25) + 6;
        return <circle key={k} cx={cx} cy={cy} r={R + alto} fill={colorCielo(stops, Math.pow(t, 0.9))} />;
      })}
    </g>
  );
};

/** Sol o luna con halo grande en capas (el halo es lo que da la luz al cielo). */
const Astro: React.FC<{
  x: number;
  y: number;
  r: number;
  color: string;
  halo: string;
  f: number;
  id: string;
  luna?: boolean;
  fuerza?: number;
}> = ({ x, y, r, color, halo, f, id, luna, fuerza = 1 }) => {
  const late = 1 + 0.03 * Math.sin(f / 20);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0%" stopColor={halo} stopOpacity={0.75 * fuerza} />
          <stop offset="25%" stopColor={halo} stopOpacity={0.35 * fuerza} />
          <stop offset="60%" stopColor={halo} stopOpacity={0.1 * fuerza} />
          <stop offset="100%" stopColor={halo} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 9 * late} fill={`url(#${id}-halo)`} />
      <circle cx={x} cy={y} r={r * 2.1} fill={halo} opacity={0.18 * fuerza} />
      <circle cx={x} cy={y} r={r * 1.45} fill={halo} opacity={0.25 * fuerza} />
      <circle cx={x} cy={y} r={r} fill={color} />
      {luna ? (
        <g>
          <circle cx={x + r * 0.18} cy={y + r * 0.12} r={r} fill={oscurecer(color, 0.12)} opacity={0.5} />
          <circle cx={x} cy={y} r={r} fill="none" stroke={aclarar(color, 0.5)} strokeWidth={r * 0.06} opacity={0.6} />
          {[
            [-0.35, -0.25, 0.22],
            [0.3, 0.1, 0.16],
            [-0.1, 0.4, 0.13],
            [0.38, -0.42, 0.09],
            [-0.5, 0.15, 0.08],
          ].map(([a, b, c], k) => (
            <g key={k}>
              <circle cx={x + a * r} cy={y + b * r} r={c * r} fill={oscurecer(color, 0.2)} opacity={0.55} />
              <circle cx={x + a * r - c * r * 0.18} cy={y + b * r - c * r * 0.18} r={c * r * 0.72} fill={oscurecer(color, 0.08)} opacity={0.6} />
            </g>
          ))}
        </g>
      ) : (
        <circle cx={x - r * 0.15} cy={y - r * 0.15} r={r * 0.7} fill="#FFFFFF" opacity={0.55} />
      )}
    </g>
  );
};

export type TonosNube = { luz: string; base: string; sombra: string };

/**
 * Nube (o copa de árbol, o arbusto) con volumen: silueta de bultos sobre una base plana, en 3 tonos (sombra abajo,
 * base, luz arriba hacia la fuente). ≈ 300 × 200 px a s=1 (ancho la estira). x,y = centro de la base.
 * luzX: -1 luz desde la izquierda … 1 desde la derecha. aplana < 1 la achata (nube vista desde arriba o lejos).
 * contraluz = solo un borde iluminado del lado de la luz (nubes de noche bajo la luna, siluetas a contraluz).
 */
export const NubeVolumen: React.FC<{
  x: number;
  y: number;
  s?: number;
  ancho?: number;
  semilla?: string;
  tonos?: TonosNube;
  luzX?: number;
  borde?: string;
  o?: number;
  aplana?: number;
  contraluz?: boolean;
}> = ({
  x,
  y,
  s = 1,
  aplana = 1,
  contraluz = false,
  ancho = 1,
  semilla = "nv",
  tonos = { luz: "#FFFFFF", base: "#EAF4FB", sombra: "#B9CDE3" },
  luzX = -0.6,
  borde,
  o = 1,
}) => {
  const k = Math.max(3, Math.round(3 + ancho * 1.6 + r0(`${semilla}k`) * 1.5));
  const ancho2 = 300 * ancho;
  const alto = 56;
  const bultos = Array.from({ length: k }, (_, i) => {
    const t = (i + 0.5) / k;
    const campana = Math.sin(t * Math.PI);
    const r = (34 + 58 * campana) * (0.75 + r0(`${semilla}r${i}`) * 0.5) * Math.min(1.25, 0.75 + ancho * 0.25);
    const cx = -ancho2 / 2 + 30 + (ancho2 - 60) * t + (r0(`${semilla}x${i}`) - 0.5) * 30;
    return { cx, cy: -alto * 0.45 - r * 0.62, r };
  });
  const capaTono = (color: string, dy: number, kr: number, conBase: boolean, dxr = 0) => (
    <g fill={color}>
      {conBase ? (
        <rect x={-ancho2 / 2 + 8 * (1 - kr)} y={-alto} width={ancho2 - 16 * (1 - kr)} height={alto - dy * 1.4} rx={(alto - dy) / 2} />
      ) : null}
      {bultos.map((b, i) => (
        <circle key={i} cx={b.cx + dxr * b.r} cy={b.cy - dy * (b.r / 60)} r={b.r * kr} />
      ))}
    </g>
  );
  return (
    <g transform={`translate(${fx(x)},${fx(y)}) scale(${s},${s * aplana})`} opacity={o}>
      {borde ? (
        <g fill={borde}>
          <rect x={-ancho2 / 2 - 4} y={-alto - 4} width={ancho2 + 8} height={alto + 8} rx={(alto + 8) / 2} />
          {bultos.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r={b.r + 4} />
          ))}
        </g>
      ) : null}
      {capaTono(tonos.sombra, 0, 1, true)}
      {contraluz ? (
        <g>
          <g fill={tonos.luz}>
            {bultos.map((b, i) => (
              <circle key={i} cx={b.cx + luzX * b.r * 0.1} cy={b.cy - b.r * 0.1} r={b.r * 0.86} />
            ))}
          </g>
          <g fill={tonos.base}>
            <rect x={-ancho2 / 2 + 10} y={-alto + 2} width={ancho2 - 20} height={alto - 14} rx={(alto - 14) / 2} />
            {bultos.map((b, i) => (
              <circle key={i} cx={b.cx - luzX * b.r * 0.1} cy={b.cy + b.r * 0.06} r={b.r * 0.8} />
            ))}
          </g>
        </g>
      ) : (
        <g>
          {capaTono(tonos.base, 8, 0.9, true)}
          <g fill={tonos.luz}>
            {bultos.map((b, i) => (
              <circle key={i} cx={b.cx + luzX * b.r * 0.16} cy={b.cy - b.r * 0.26} r={b.r * 0.6} />
            ))}
          </g>
        </g>
      )}
    </g>
  );
};

/** Estrella brillante con destello de 4 puntas (y uno chico en diagonal) y halo. */
export const EstrellaDestello: React.FC<{ x: number; y: number; r?: number; f: number; color?: string; fase?: number }> = ({
  x,
  y,
  r = 22,
  f,
  color = "#FFFFFF",
  fase = 0,
}) => {
  const t = 0.75 + 0.25 * Math.sin(f / 9 + fase);
  const L = r * 2.4 * t;
  const w = r * 0.16;
  const punta = (l: number) =>
    `M0,${-l} Q${w},${-w} ${l},0 Q${w},${w} 0,${l} Q${-w},${w} ${-l},0 Q${-w},${-w} 0,${-l}Z`;
  return (
    <g transform={`translate(${fx(x)},${fx(y)})`}>
      <circle r={r * 1.6 * t} fill={color} opacity={0.12} />
      <circle r={r * 0.8} fill={color} opacity={0.22} />
      <path d={punta(L)} fill={color} />
      <path d={punta(L * 0.45)} fill={color} opacity={0.7} transform={`rotate(45) scale(${0.9 + 0.1 * Math.sin(f / 6 + fase)})`} />
      <circle r={r * 0.28} fill="#FFFFFF" />
    </g>
  );
};

/** Campo de estrellas de una capa con deriva y paralaje (cada estrella se repite en bucle dentro del cuadro). */
const CapaEstrellas: React.FC<{
  f: number;
  n: number;
  semilla: string;
  cam?: CamaraFondo;
  d: number;
  deriva: number;
  r: [number, number];
  o: [number, number];
  colores: string[];
  titila?: number;
  y0?: number;
  y1?: number;
  desvanece?: boolean;
}> = ({ f, n, semilla, cam, d, deriva, r, o, colores, titila = 0, y0 = 0, y1 = H, desvanece }) => {
  const { dx, dy } = capa(cam, d);
  const m = 60;
  const spanX = W + 2 * m;
  const spanY = y1 - y0 + 2 * m;
  return (
    <g transform={zoomT(cam, d)}>
      {Array.from({ length: n }, (_, k) => {
        const x = envolver(r0(`${semilla}x${k}`) * spanX - f * deriva - dx, spanX) - m;
        const y = y0 + envolver(r0(`${semilla}y${k}`) * spanY - dy, spanY) - m;
        const rr = r[0] + (r[1] - r[0]) * Math.pow(r0(`${semilla}r${k}`), 2);
        const base = o[0] + (o[1] - o[0]) * r0(`${semilla}o${k}`);
        const tw = titila ? 1 - titila * (0.5 + 0.5 * Math.sin(f / (5 + r0(`${semilla}t${k}`) * 9) + k * 1.7)) : 1;
        const fade = desvanece ? Math.max(0, 1 - (y - y0) / (y1 - y0)) : 1;
        return <circle key={k} cx={fx(x)} cy={fx(y)} r={rr} fill={colores[k % colores.length]} opacity={base * tw * fade} />;
      })}
    </g>
  );
};

// =====================================================================================================
// EspacioProfundo
// =====================================================================================================
const TONOS_ESPACIO = {
  violeta: { fondo: ["#22124F", "#120A33", "#06041A"], neb: ["#7B3FD0", "#E04FA0", "#3E86E0", "#2FA99A"], brillo: "#FFD7F0" },
  azul: { fondo: ["#0E2557", "#081638", "#030817"], neb: ["#2C63B8", "#3EC6E0", "#7B3FD0", "#5BE0C8"], brillo: "#D8F4FF" },
  rojo: { fondo: ["#3E1030", "#1E0820", "#0B030E"], neb: ["#E5482F", "#F2823A", "#B5307F", "#FFC93C"], brillo: "#FFE6C8" },
  verde: { fondo: ["#08343A", "#041D24", "#020C10"], neb: ["#2FA99A", "#7FE0D0", "#3E86E0", "#B6E86A"], brillo: "#E2FFF6" },
} as const;
export type TonoEspacio = keyof typeof TONOS_ESPACIO;

/** Galaxia espiral con brazos de polvo, estrellas a lo largo de los brazos, disco y núcleo brillante; gira lento. */
export const GalaxiaEspiral: React.FC<{
  x: number;
  y: number;
  r?: number;
  f: number;
  rot?: number;
  incl?: number;
  colores?: [string, string];
  vel?: number;
  brazos?: number;
  semilla?: string;
  id?: string;
}> = ({ x, y, r = 220, f, rot = -25, incl = 0.45, colores = ["#7FB8FF", "#FFE9B0"], vel = 1, brazos = 2, semilla = "gx", id = "gx" }) => {
  const [cb, cn] = colores;
  const giro = f * 0.12 * vel;
  const vueltas = 1.35;
  const brazo = (a: number) => {
    const pts: [number, number, number][] = [];
    const N = 28;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const th = a + t * vueltas * Math.PI * 2;
      const rad = r * (0.1 + 0.9 * t);
      pts.push([Math.cos(th) * rad, Math.sin(th) * rad, t]);
    }
    return pts;
  };
  const cinta = (pts: [number, number, number][], ancho: number) => {
    const izq: string[] = [];
    const der: string[] = [];
    pts.forEach(([px, py, t], i) => {
      const [qx, qy] = pts[Math.min(pts.length - 1, i + 1)];
      const [ox, oy] = pts[Math.max(0, i - 1)];
      const tx = qx - ox;
      const ty = qy - oy;
      const l = Math.hypot(tx, ty) || 1;
      const w = ancho * (1 - t * 0.85) * (0.4 + 0.6 * Math.sin(Math.min(1, t * 4) * Math.PI * 0.5));
      izq.push(`${fx(px - (ty / l) * w)},${fx(py + (tx / l) * w)}`);
      der.unshift(`${fx(px + (ty / l) * w)},${fx(py - (tx / l) * w)}`);
    });
    return `M${izq.join(" L")} L${der.join(" L")} Z`;
  };
  const listaBrazos = Array.from({ length: brazos }, (_, k) => brazo((k / brazos) * Math.PI * 2));
  return (
    <g transform={`translate(${fx(x)},${fx(y)}) rotate(${rot}) scale(1,${incl}) rotate(${fx(giro)})`}>
      <defs>
        <radialGradient id={`${id}-disco`}>
          <stop offset="0%" stopColor={cn} stopOpacity={0.9} />
          <stop offset="30%" stopColor={cb} stopOpacity={0.35} />
          <stop offset="100%" stopColor={cb} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0%" stopColor={cn} stopOpacity={0.28} />
          <stop offset="40%" stopColor={cb} stopOpacity={0.12} />
          <stop offset="100%" stopColor={cb} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-nucleo`}>
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
          <stop offset="35%" stopColor={cn} stopOpacity={0.9} />
          <stop offset="100%" stopColor={cn} stopOpacity={0} />
        </radialGradient>
        <filter id={`${id}-suave`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={r * 0.045} />
        </filter>
      </defs>
      <circle r={r * 1.9} fill={`url(#${id}-halo)`} />
      <circle r={r * 1.15} fill={`url(#${id}-disco)`} />
      <g filter={`url(#${id}-suave)`}>
        {listaBrazos.map((pts, k) => (
          <path key={`a${k}`} d={cinta(pts, r * 0.3)} fill={cb} opacity={0.6} />
        ))}
        {listaBrazos.map((pts, k) => (
          <path key={`b${k}`} d={cinta(pts, r * 0.12)} fill={aclarar(cb, 0.55)} opacity={0.85} />
        ))}
      </g>
      {listaBrazos.map((pts, k) => (
        <path
          key={`p${k}`}
          d={cinta(
            pts.map(([a, b, t]) => [a * 0.97, b * 0.97, t]),
            r * 0.03,
          )}
          fill={oscurecer(cb, 0.55)}
          opacity={0.22}
        />
      ))}
      {listaBrazos.flatMap((pts, k) =>
        Array.from({ length: Math.round(Math.max(22, r / 4.5)) }, (_, i) => {
          const j = Math.floor(r0(`${semilla}${k}j${i}`) * (pts.length - 2)) + 1;
          const [px, py, t] = pts[j];
          const sx = (r0(`${semilla}${k}u${i}`) - 0.5) * r * 0.22 * (1 - t * 0.5);
          const sy = (r0(`${semilla}${k}v${i}`) - 0.5) * r * 0.22 * (1 - t * 0.5);
          return (
            <circle
              key={`s${k}-${i}`}
              cx={fx(px + sx)}
              cy={fx(py + sy)}
              r={1.2 + r0(`${semilla}${k}w${i}`) * r * 0.014}
              fill={i % 4 === 0 ? cn : "#FFFFFF"}
              opacity={0.55 + 0.45 * r0(`${semilla}${k}z${i}`)}
            />
          );
        }),
      )}
      <circle r={r * 0.32} fill={`url(#${id}-nucleo)`} />
      <circle r={r * 0.07} fill="#FFFFFF" />
    </g>
  );
};

export type PlanetaOpc = { x?: number; y?: number; r?: number; color?: string; color2?: string; atmosfera?: string; anillo?: boolean };

/** Planeta con bandas, lado nocturno suave, atmósfera que brilla en el borde y anillo opcional (luz arriba a la izq.). */
export const PlanetaRico: React.FC<PlanetaOpc & { f: number; id?: string }> = ({
  x = 1620,
  y = 900,
  r = 260,
  color = "#E07B4F",
  color2 = "#F6C08A",
  atmosfera = "#FFB27A",
  anillo = false,
  f,
  id = "plr",
}) => {
  const anilloP = (mitad: "atras" | "frente") => (
    <g clipPath={`url(#${id}-${mitad})`}>
      <ellipse cx={x} cy={y} rx={r * 1.9} ry={r * 0.42} fill="none" stroke={aclarar(color2, 0.25)} strokeWidth={r * 0.16} opacity={0.75} />
      <ellipse cx={x} cy={y} rx={r * 1.62} ry={r * 0.34} fill="none" stroke={color2} strokeWidth={r * 0.07} opacity={0.6} />
    </g>
  );
  const giro = (f * 0.25) % (r * 2);
  return (
    <g>
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
        <clipPath id={`${id}-atras`}>
          <rect x={x - r * 3} y={y - r * 2} width={r * 6} height={r * 2} />
        </clipPath>
        <clipPath id={`${id}-frente`}>
          <rect x={x - r * 3} y={y} width={r * 6} height={r * 2} />
        </clipPath>
        <radialGradient id={`${id}-atm`} cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor={atmosfera} stopOpacity={0} />
          <stop offset="84%" stopColor={atmosfera} stopOpacity={0.6} />
          <stop offset="100%" stopColor={atmosfera} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-luz`} cx="30%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="75%" stopColor="#0A0620" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#0A0620" stopOpacity={0.85} />
        </radialGradient>
        <filter id={`${id}-noche`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={r * 0.12} />
        </filter>
      </defs>
      {anillo ? anilloP("atras") : null}
      <circle cx={x} cy={y} r={r * 1.27} fill={`url(#${id}-atm)`} />
      <circle cx={x} cy={y} r={r} fill={color} />
      <g clipPath={`url(#${id}-clip)`}>
        {Array.from({ length: 7 }, (_, k) => {
          const by = y - r + (k + 0.6) * ((2 * r) / 7);
          return (
            <g key={k}>
              <ellipse cx={x - giro * 0.2} cy={by} rx={r * 1.6} ry={r * (0.05 + 0.04 * (k % 3))} fill={k % 2 ? color2 : oscurecer(color, 0.18)} opacity={0.55} />
              <ellipse cx={x - r * 0.4 + ((k * 97 + giro) % (r * 1.6))} cy={by + r * 0.03} rx={r * 0.18} ry={r * 0.035} fill={aclarar(color2, 0.3)} opacity={0.6} />
            </g>
          );
        })}
        <circle cx={x} cy={y} r={r} fill={`url(#${id}-luz)`} />
        <circle cx={x + r * 0.55} cy={y + r * 0.45} r={r * 0.95} fill="#0A0620" opacity={0.55} filter={`url(#${id}-noche)`} />
      </g>
      <path
        d={`M${fx(x - r * 0.98)},${fx(y + r * 0.15)} A${r},${r} 0 0 1 ${fx(x + r * 0.2)},${fx(y - r * 0.98)}`}
        fill="none"
        stroke={aclarar(atmosfera, 0.5)}
        strokeWidth={r * 0.025}
        strokeLinecap="round"
        opacity={0.8}
      />
      {anillo ? anilloP("frente") : null}
    </g>
  );
};

/**
 * Espacio profundo en capas: fondo con degradado, polvo de estrellas, nebulosas de manchas superpuestas con bordes
 * en contornos (bandas planas de transparencia), galaxias espirales que giran, estrellas que titilan, estrellas
 * brillantes con destello y, opcional, un planeta con atmósfera.
 */
export const EspacioProfundo: React.FC<{
  f: number;
  camara?: CamaraFondo;
  vel?: number;
  tono?: TonoEspacio;
  colores?: { fondo?: [string, string, string]; nebulosa?: string[] };
  nebulosa?: number;
  galaxias?: number;
  planeta?: boolean | PlanetaOpc;
  brillantes?: number;
  semilla?: string;
  id?: string;
}> = ({ f, camara, vel = 1, tono = "violeta", colores, nebulosa = 1, galaxias = 2, planeta = false, brillantes = 7, semilla = "ep", id = "ep" }) => {
  const T = TONOS_ESPACIO[tono];
  const fondo = colores?.fondo ?? T.fondo;
  const neb = colores?.nebulosa ?? [...T.neb];
  const sem = Math.floor(r0(`${semilla}seed`) * 900) + 1;
  // la nebulosa sigue una banda diagonal (como la Vía Láctea)
  const ang = -0.35 + (r0(`${semilla}ang`) - 0.5) * 0.5;
  const manchas = Array.from({ length: 8 }, (_, k) => {
    const t = (k + 0.5) / 8;
    const u = (t - 0.5) * 2300;
    const off = (r0(`${semilla}mo${k}`) - 0.5) * 380;
    return {
      x: W / 2 + Math.cos(ang) * u - Math.sin(ang) * off,
      y: H / 2 + Math.sin(ang) * u + Math.cos(ang) * off,
      rx: 260 + r0(`${semilla}mrx${k}`) * 300,
      ry: 170 + r0(`${semilla}mry${k}`) * 160,
      rot: (ang * 180) / Math.PI + (r0(`${semilla}mr${k}`) - 0.5) * 50,
      c: k % neb.length,
    };
  });
  const respira = (k: number) => 1 + 0.04 * Math.sin(f / 50 + k * 1.3);
  const deriva = 0.25 * vel;
  const desp = (d: number) => -f * deriva * d * 4;
  const coloresGal: [string, string][] = [
    ["#7FB8FF", "#FFE9B0"],
    ["#E07BD0", "#FFD7A8"],
    ["#7FE0D0", "#FFF4DC"],
  ];
  const posGal = [
    { x: 1340, y: 360, r: 360, rot: -24, incl: 0.5 },
    { x: 330, y: 800, r: 150, rot: 18, incl: 0.55 },
    { x: 1760, y: 880, r: 95, rot: -60, incl: 0.35 },
  ];
  const pl: PlanetaOpc | null = planeta ? (planeta === true ? {} : planeta) : null;
  const filtroNeb = (nombre: string, seed: number, freq: string, tabla: string, desX: number) => (
    <filter id={`${id}-${nombre}`} filterUnits="userSpaceOnUse" x={-350} y={-280} width={W + 700} height={H + 560}>
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={4} seed={seed} result="n0" />
      <feOffset in="n0" dx={desX} dy={desX * 0.4} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  2.3 0 0 0 -0.62" result="na" />
      <feComposite in="SourceGraphic" in2="na" operator="arithmetic" k1={1.7} k2={0.15} k3={0} k4={0} result="m" />
      <feComponentTransfer in="m">
        <feFuncA type="discrete" tableValues={tabla} />
      </feComponentTransfer>
    </filter>
  );
  // deriva acotada (±90 px): el ruido se mueve dentro de la zona del filtro aunque la escena sea larga
  const mov = (60 * Math.sin(f / 90) + 30 * Math.sin(f / 37)) * Math.min(1.5, vel);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-bg`} cx="55%" cy="45%" r="75%">
          <stop offset="0%" stopColor={fondo[0]} />
          <stop offset="55%" stopColor={fondo[1]} />
          <stop offset="100%" stopColor={fondo[2]} />
        </radialGradient>
        {neb.map((c, k) => (
          <radialGradient key={k} id={`${id}-nb${k}`}>
            <stop offset="0%" stopColor={c} stopOpacity={1} />
            <stop offset="45%" stopColor={c} stopOpacity={0.75} />
            <stop offset="100%" stopColor={c} stopOpacity={0} />
          </radialGradient>
        ))}
        <radialGradient id={`${id}-brillo`}>
          <stop offset="0%" stopColor={T.brillo} stopOpacity={0.55} />
          <stop offset="100%" stopColor={T.brillo} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-vin`} cx="50%" cy="50%" r="72%">
          <stop offset="60%" stopColor="#000010" stopOpacity={0} />
          <stop offset="100%" stopColor="#000010" stopOpacity={0.55} />
        </radialGradient>
        {filtroNeb("neb1", sem, "0.0024 0.0042", "0 0.16 0.3 0.46 0.62", mov)}
        {filtroNeb("neb2", sem + 7, "0.0045 0.007", "0 0 0.22 0.4 0.6", -mov * 0.7)}
        <filter id={`${id}-franja`} filterUnits="userSpaceOnUse" x={-350} y={-280} width={W + 700} height={H + 560}>
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={sem + 13} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale={34} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation={13} />
        </filter>
      </defs>
      {/* 0 · fondo */}
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id}-bg)`} />
      {/* 1 · resplandor suave de la banda (lo más lejano) */}
      <g transform={`${capaT(camara, 0.06)} translate(${fx(desp(0.06))},0)`} opacity={0.5 * nebulosa}>
        {manchas.map((m, k) => (
          <ellipse
            key={k}
            cx={m.x}
            cy={m.y}
            rx={m.rx * 1.5}
            ry={m.ry * 1.6}
            fill={`url(#${id}-nb${m.c})`}
            opacity={0.35}
            transform={`rotate(${m.rot} ${m.x} ${m.y})`}
          />
        ))}
      </g>
      {/* 2 · polvo de estrellas fino */}
      <CapaEstrellas f={f} n={240} semilla={`${semilla}p`} cam={camara} d={0.08} deriva={deriva * 0.3} r={[0.7, 1.8]} o={[0.25, 0.7]} colores={["#FFFFFF", "#CFE0FF", "#FFE9C8"]} />
      {/* 3 · nebulosa principal en contornos */}
      {nebulosa > 0 ? (
        <g transform={`${capaT(camara, 0.12)} translate(${fx(desp(0.12))},0)`} opacity={nebulosa}>
          <g filter={`url(#${id}-neb1)`}>
            {manchas.map((m, k) => (
              <ellipse
                key={k}
                cx={m.x}
                cy={m.y}
                rx={m.rx * respira(k)}
                ry={m.ry * respira(k + 3)}
                fill={`url(#${id}-nb${m.c})`}
                transform={`rotate(${m.rot} ${m.x} ${m.y})`}
              />
            ))}
          </g>
          {/* franjas de polvo: finas, curvas y difusas, siguiendo la banda de la nebulosa (como en la Vía Láctea) */}
          <g filter={`url(#${id}-franja)`} opacity={0.55}>
            {[
              { off: -40, a: 70, w: 40, ph: 0.3 },
              { off: 60, a: 50, w: 22, ph: 1.9 },
              { off: 140, a: 90, w: 14, ph: 3.1 },
            ].map((l, k) => {
              const pts = Array.from({ length: 25 }, (_, i) => {
                const u = -1300 + (i / 24) * 2600;
                const off = l.off + l.a * Math.sin(u / 340 + l.ph + f / 400) + 25 * Math.sin(u / 120 + k);
                return `${fx(W / 2 + Math.cos(ang) * u - Math.sin(ang) * off)},${fx(H / 2 + Math.sin(ang) * u + Math.cos(ang) * off)}`;
              });
              return <polyline key={k} points={pts.join(" ")} fill="none" stroke={fondo[2]} strokeWidth={l.w} strokeLinecap="round" strokeLinejoin="round" />;
            })}
          </g>
        </g>
      ) : null}
      {/* 4 · segunda nebulosa más clara y chica, otra profundidad */}
      {nebulosa > 0 ? (
        <g transform={`${capaT(camara, 0.18)} translate(${fx(desp(0.18))},0)`} opacity={nebulosa}>
          <g filter={`url(#${id}-neb2)`}>
            {manchas
              .filter((_, k) => k % 2 === 0)
              .map((m, k) => (
                <ellipse
                  key={k}
                  cx={m.x + 40}
                  cy={m.y - 20}
                  rx={m.rx * 0.6 * respira(k + 5)}
                  ry={m.ry * 0.55}
                  fill={`url(#${id}-nb${(m.c + 1) % neb.length})`}
                  transform={`rotate(${m.rot + 15} ${m.x} ${m.y})`}
                />
              ))}
          </g>
          {manchas
            .filter((_, k) => k % 3 === 1)
            .map((m, k) => (
              <circle key={k} cx={m.x} cy={m.y} r={m.ry * 0.9 * respira(k)} fill={`url(#${id}-brillo)`} />
            ))}
        </g>
      ) : null}
      {/* 5 · galaxias */}
      {posGal.slice(0, Math.max(0, Math.min(3, galaxias))).map((g, k) => (
        <g key={k} transform={`${capaT(camara, 0.22 + k * 0.04)} translate(${fx(desp(0.22 + k * 0.04))},0)`}>
          <GalaxiaEspiral
            x={g.x}
            y={g.y}
            r={g.r}
            rot={g.rot}
            incl={g.incl}
            f={f}
            vel={vel * (k % 2 ? -1 : 1)}
            colores={coloresGal[(k + Math.floor(r0(`${semilla}gc`) * 3)) % 3]}
            semilla={`${semilla}g${k}`}
            id={`${id}-g${k}`}
          />
        </g>
      ))}
      {/* 6 · estrellas medianas que titilan */}
      <CapaEstrellas f={f} n={80} semilla={`${semilla}m`} cam={camara} d={0.35} deriva={deriva * 1.2} r={[1.8, 3.6]} o={[0.6, 1]} titila={0.6} colores={["#FFFFFF", "#FFF4DC", "#CFE6FF", "#FFD2E8"]} />
      {/* 7 · estrellas brillantes con destello */}
      <g transform={zoomT(camara, 0.6)}>
        {Array.from({ length: brillantes }, (_, k) => {
          const { dx, dy } = capa(camara, 0.6);
          const x = envolver(r0(`${semilla}bx${k}`) * (W + 200) - f * deriva * 2.4 - dx, W + 200) - 100;
          const y = envolver(r0(`${semilla}by${k}`) * (H + 200) - dy, H + 200) - 100;
          return (
            <EstrellaDestello
              key={k}
              x={x}
              y={y}
              r={10 + r0(`${semilla}br${k}`) * 16}
              f={f}
              fase={k * 2.1}
              color={k % 3 === 0 ? T.brillo : "#FFFFFF"}
            />
          );
        })}
      </g>
      {/* 8 · planeta */}
      {pl ? (
        <g transform={capaT(camara, 0.85)}>
          <PlanetaRico {...pl} f={f} id={`${id}-pl`} />
        </g>
      ) : null}
      <rect x={-50} y={-50} width={W + 100} height={H + 100} fill={`url(#${id}-vin)`} />
    </g>
  );
};

// =====================================================================================================
// CieloAlto
// =====================================================================================================
const CIELOS = {
  dia: {
    stops: ["#2B66C8", "#3F86DC", "#6AAAE9", "#9DCEF4", "#D3EDFB"],
    bruma: "#EAF6FD",
    sol: { x: 1480, y: 200, r: 46, color: "#FFFBEA", halo: "#FFF3C4" },
    tierra: "#8DB4DA",
    nube: { luz: "#FFFFFF", base: "#E9F2FB", sombra: "#B4C8E2" },
  },
  atardecer: {
    stops: ["#2A2668", "#5B3FA8", "#B8508F", "#F2823A", "#FFC27A"],
    bruma: "#FFD5A0",
    sol: { x: 560, y: 0, r: 70, color: "#FFF1C9", halo: "#FFB65C" },
    tierra: "#7C4A78",
    nube: { luz: "#FFE0B8", base: "#F0A89B", sombra: "#8C6BAE" },
  },
  estratosfera: {
    stops: ["#03051A", "#0B1442", "#1C3A8A", "#3E80D2", "#A6DCF6"],
    bruma: "#C3EBFB",
    sol: { x: 1560, y: 150, r: 32, color: "#FFFFFF", halo: "#DDF3FF" },
    tierra: "#2A5E9C",
    nube: { luz: "#FFFFFF", base: "#E1ECF7", sombra: "#A3B8D4" },
  },
} as const;
export type MomentoCielo = keyof typeof CIELOS;

/** Banda de bruma que sigue la curvatura del horizonte. */
const Bruma: React.FC<{ cx: number; cy: number; R: number; color: string; alto: number; id: string; o?: number }> = ({ cx, cy, R, color, alto, id, o = 0.85 }) => {
  const Rt = R + alto;
  const a = (R - alto * 0.8) / Rt;
  const b = R / Rt;
  return (
    <g>
      <defs>
        <radialGradient id={id} cx={cx} cy={cy} r={Rt} gradientUnits="userSpaceOnUse">
          <stop offset={a} stopColor={color} stopOpacity={0} />
          <stop offset={b} stopColor={color} stopOpacity={o} />
          <stop offset={1} stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={Rt} fill={`url(#${id})`} />
    </g>
  );
};

/**
 * Cielo alto (de día, al atardecer o en la estratosfera): cielo por franjas, sol con halo, curvatura de la Tierra
 * opcional, nubes con volumen en 3 profundidades que pasan a distinta velocidad (sensación de vuelo), bruma en el
 * horizonte y, con `rafagas`, líneas de velocidad. dir = 1: las nubes van a la izquierda (avanzamos a la derecha).
 */
export const CieloAlto: React.FC<{
  f: number;
  camara?: CamaraFondo;
  vel?: number;
  momento?: MomentoCielo;
  curvatura?: boolean;
  horizonte?: number;
  dir?: 1 | -1;
  nubes?: number;
  rafagas?: number;
  sol?: boolean;
  semilla?: string;
  id?: string;
}> = ({ f, camara, vel = 1, momento = "dia", curvatura, horizonte = 760, dir = 1, nubes = 1, rafagas = 0, sol = true, semilla = "ca", id = "ca" }) => {
  const P = CIELOS[momento];
  const alto = momento === "estratosfera";
  const curva = curvatura ?? alto;
  const R = curva ? 2900 : 60000;
  const cx = W / 2;
  const cy = horizonte + R;
  const sag = (x: number) => R - Math.sqrt(Math.max(0, R * R - (x - cx) * (x - cx)));
  const solY = momento === "atardecer" ? horizonte - 70 : P.sol.y;
  const brumaN = (t: number) => ({
    luz: mezclaColor(P.nube.luz, P.bruma, t),
    base: mezclaColor(P.nube.base, P.bruma, t),
    sombra: mezclaColor(P.nube.sombra, P.bruma, t),
  });
  // capas de nubes: [profundidad, velocidad px/f, n, escala, banda y, bruma]
  const capas = alto
    ? [
        { d: 0.12, v: 1.2, n: 14, s: [0.28, 0.42], y: [horizonte + 16, horizonte + 60], bruma: 0.5, ancho: [2.2, 3.6], ap: 0.38 },
        { d: 0.4, v: 5, n: 8, s: [0.55, 0.85], y: [horizonte + 110, horizonte + 230], bruma: 0.22, ancho: [1.6, 2.6], ap: 0.5 },
        { d: 1, v: 18, n: 3, s: [1.2, 1.5], y: [H + 70, H + 130], bruma: 0, ancho: [1.6, 2.4], ap: 0.62 },
      ]
    : [
        { d: 0.12, v: 1.2, n: 12, s: [0.28, 0.42], y: [horizonte - 6, horizonte + 40], bruma: 0.5, ancho: [2, 3.4], ap: 0.55 },
        { d: 0.4, v: 5, n: 6, s: [0.6, 0.95], y: [horizonte - 330, horizonte - 60], bruma: 0.22, ancho: [1, 1.8], ap: 0.85 },
        { d: 1, v: 18, n: 3, s: [1.5, 2.1], y: [130, 230], bruma: 0, ancho: [1, 1.6], ap: 0.9 },
      ];
  return (
    <g>
      <CieloFranjas stops={[...P.stops]} horizonte={horizonte} R={R} cam={camara} />
      {alto ? (
        <CapaEstrellas f={f} n={70} semilla={`${semilla}e`} cam={camara} d={0.02} deriva={0} r={[0.8, 2]} o={[0.3, 0.9]} titila={0.4} colores={["#FFFFFF"]} y0={0} y1={horizonte * 0.55} desvanece />
      ) : null}
      {sol ? (
        <g transform={capaT(camara, 0.03)}>
          <Astro x={P.sol.x} y={solY} r={P.sol.r} color={P.sol.color} halo={P.sol.halo} f={f} id={`${id}-sol`} fuerza={momento === "atardecer" ? 1.2 : 1} />
        </g>
      ) : null}
      {/* Tierra (debajo del horizonte) con su borde de atmósfera */}
      <g transform={capaT(camara, 0.1)}>
        <defs>
          <radialGradient id={`${id}-tierra`} cx={cx} cy={horizonte} r={H} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={aclarar(P.tierra, 0.35)} />
            <stop offset="100%" stopColor={oscurecer(P.tierra, 0.35)} />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={R} fill={`url(#${id}-tierra)`} />
        <Bruma cx={cx} cy={cy} R={R} color={P.bruma} alto={curva ? 150 : 170} id={`${id}-bruma`} />
        {curva ? <circle cx={cx} cy={cy} r={R + 3} fill="none" stroke={aclarar(P.bruma, 0.4)} strokeWidth={5} opacity={0.9} /> : null}
      </g>
      {/* estratosfera: manchas de tierra bajo la bruma */}
      {alto ? (
        <g transform={capaT(camara, 0.1)} opacity={0.55}>
          {Array.from({ length: 6 }, (_, k) => {
            const x = envolver(r0(`${semilla}tx${k}`) * (W + 1200) - f * 0.8 * vel * dir, W + 1200) - 600;
            const y = horizonte + 40 + r0(`${semilla}ty${k}`) * 260;
            const t = (y - horizonte) / 300;
            return (
              <NubeVolumen
                key={k}
                x={x}
                y={y + sag(x)}
                s={0.6 + t * 0.9}
                ancho={2.5 + r0(`${semilla}ta${k}`) * 2}
                aplana={0.25 + t * 0.15}
                semilla={`${semilla}t${k}`}
                tonos={{ luz: mezclaColor("#8FB38A", P.bruma, 0.45), base: mezclaColor("#6E9A74", P.bruma, 0.5), sombra: mezclaColor("#4E7A62", P.bruma, 0.5) }}
              />
            );
          })}
        </g>
      ) : null}
      {/* día y atardecer: mar de nubes debajo del horizonte, en filas con perspectiva */}
      {!alto && nubes > 0
        ? [0, 1, 2, 3].map((k) => {
            const t = k / 3;
            const d = 0.15 + 0.6 * t;
            const { dx, dy } = capa(camara, d);
            const sc = 0.42 + 1.25 * t;
            const an = 2.2;
            const paso = 300 * sc * an * 0.62;
            const n = Math.ceil((W + paso * 3) / paso);
            const span = n * paso;
            const y = horizonte + 34 + (H + 90 - horizonte - 34) * Math.pow(t, 1.25) - dy;
            const tn = brumaN(0.45 * (1 - t));
            return (
              <g key={`m${k}`} transform={zoomT(camara, d)}>
                {k === 0 ? <rect x={-300} y={horizonte + 10 - dy} width={W + 600} height={H} fill={mezclaColor(P.nube.sombra, P.bruma, 0.35)} /> : null}
                {Array.from({ length: n }, (_, i) => {
                  const x = envolver(i * paso + r0(`${semilla}mx${k}${i}`) * paso * 0.4 - f * (1.5 + 10 * t) * vel * dir - dx, span) - paso * 1.5;
                  return (
                    <NubeVolumen
                      key={i}
                      x={x}
                      y={y + r0(`${semilla}my${k}${i}`) * 26 * sc}
                      s={sc * (0.85 + r0(`${semilla}ms${k}${i}`) * 0.3)}
                      ancho={an}
                      aplana={0.5 + 0.25 * t}
                      semilla={`${semilla}m${k}-${i}`}
                      tonos={tn}
                      luzX={Math.max(-1, Math.min(1, (P.sol.x - x) / 900))}
                    />
                  );
                })}
              </g>
            );
          })
        : null}
      {/* nubes en 3 profundidades */}
      {nubes > 0
        ? capas.map((c, ci) => {
            const { dx, dy } = capa(camara, c.d);
            const n = Math.round(c.n * nubes);
            const anchoMax = 330 * c.s[1] * c.ancho[1];
            const span = W + anchoMax * 2;
            return (
              <g key={ci} transform={zoomT(camara, c.d)}>
                {Array.from({ length: n }, (_, k) => {
                  const kk = `${semilla}${ci}-${k}`;
                  const s = c.s[0] + (c.s[1] - c.s[0]) * r0(`${kk}s`);
                  const an = c.ancho[0] + (c.ancho[1] - c.ancho[0]) * r0(`${kk}a`);
                  const x = envolver(((k + r0(`${kk}x`) * 0.8) / n) * span - f * c.v * vel * dir - dx, span) - anchoMax;
                  let y = c.y[0] + (c.y[1] - c.y[0]) * r0(`${kk}y`) - dy;
                  if (curva && c.y[0] > horizonte - 50) y += sag(x) * (1 - c.d * 0.5);
                  return (
                    <NubeVolumen
                      key={k}
                      x={x}
                      y={y}
                      s={s}
                      ancho={an}
                      semilla={kk}
                      tonos={brumaN(c.bruma)}
                      aplana={c.ap}
                      luzX={Math.max(-1, Math.min(1, (P.sol.x - x) / 900))}
                    />
                  );
                })}
              </g>
            );
          })
        : null}
      {/* líneas de velocidad */}
      {rafagas > 0 ? (
        <g opacity={rafagas}>
          {Array.from({ length: 16 }, (_, k) => {
            const largo = 180 + r0(`${semilla}rl${k}`) * 320;
            const span = W + largo * 2;
            const x = envolver(r0(`${semilla}rx${k}`) * span - f * 70 * vel * dir, span) - largo;
            const y = 40 + r0(`${semilla}ry${k}`) * (H - 80);
            return <rect key={k} x={x} y={y} width={largo} height={3 + r0(`${semilla}rh${k}`) * 4} rx={3} fill="#FFFFFF" opacity={0.25 + 0.35 * r0(`${semilla}ro${k}`)} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

// =====================================================================================================
// CieloNocturno
// =====================================================================================================
/**
 * Cielo de noche con luna llena y halo, estrellas en 2 capas que titilan y nubes oscuras en 3 profundidades
 * iluminadas por la luna (la cara que mira a la luna se aclara, y más cuanto más cerca). suelo = colinas oscuras.
 */
export const CieloNocturno: React.FC<{
  f: number;
  camara?: CamaraFondo;
  vel?: number;
  luna?: { x?: number; y?: number; r?: number };
  nubes?: number;
  suelo?: boolean;
  dir?: 1 | -1;
  semilla?: string;
  id?: string;
}> = ({ f, camara, vel = 1, luna, nubes = 1, suelo = true, dir = 1, semilla = "cn", id = "cn" }) => {
  const lx = luna?.x ?? 1380;
  const ly = luna?.y ?? 260;
  const lr = luna?.r ?? 70;
  const stops = ["#05071E", "#0D1440", "#1C2A66", "#34448A", "#5A64A6"];
  const horizonte = 900;
  const capas = [
    { d: 0.15, v: 0.6, n: 8, s: [0.35, 0.55], y: [640, 840], tono: 0.55 },
    { d: 0.45, v: 2.2, n: 5, s: [0.6, 0.85], y: [420, 720], tono: 0.25 },
    { d: 1, v: 7, n: 3, s: [1.1, 1.4], y: [930, 1060], tono: 0 },
  ];
  const tonoN = (x: number, y: number, bruma: number): TonosNube => {
    const dist = Math.hypot(x - lx, y - ly);
    const cerca = Math.max(0, 1 - dist / 900);
    const base = mezclaColor("#2E3670", "#5A64A6", bruma);
    return {
      sombra: mezclaColor("#1A1F4A", "#3B4585", bruma),
      base: mezclaColor(base, "#6E77B8", cerca * 0.6),
      luz: mezclaColor(mezclaColor("#5D68AE", "#7B84C2", bruma), "#DDE3FF", 0.25 + cerca * 0.6),
    };
  };
  return (
    <g>
      <CieloFranjas stops={stops} horizonte={horizonte} R={60000} cam={camara} n={12} />
      <CapaEstrellas f={f} n={200} semilla={`${semilla}p`} cam={camara} d={0.03} deriva={0.04 * vel} r={[0.7, 1.7]} o={[0.25, 0.75]} colores={["#FFFFFF", "#CFE0FF"]} y1={horizonte} desvanece />
      <CapaEstrellas f={f} n={45} semilla={`${semilla}m`} cam={camara} d={0.08} deriva={0.08 * vel} r={[1.8, 3.2]} o={[0.6, 1]} titila={0.7} colores={["#FFFFFF", "#FFF4DC"]} y1={horizonte * 0.8} />
      <g transform={capaT(camara, 0.05)}>
        {[0, 1, 2].map((k) => (
          <EstrellaDestello key={k} x={[260, 820, 1700][k]} y={[150, 90, 420][k]} r={[14, 10, 12][k]} f={f} fase={k * 2} />
        ))}
        <Astro x={lx} y={ly} r={lr} color="#EEF0FF" halo="#9FB0FF" f={f} id={`${id}-luna`} luna fuerza={1.1} />
        {/* rayos de luna muy suaves */}
        <g opacity={0.07 + 0.02 * Math.sin(f / 25)}>
          {[-30, -12, 8, 26].map((a, k) => (
            <path
              key={k}
              d={`M${lx},${ly} L${fx(lx + Math.sin(((a - 6) * Math.PI) / 180) * 1400)},${fx(ly + Math.cos(((a - 6) * Math.PI) / 180) * 1400)} L${fx(lx + Math.sin(((a + 6) * Math.PI) / 180) * 1400)},${fx(ly + Math.cos(((a + 6) * Math.PI) / 180) * 1400)} Z`}
              fill="#CFD8FF"
            />
          ))}
        </g>
      </g>
      {nubes > 0
        ? capas.map((c, ci) => {
            const { dx, dy } = capa(camara, c.d);
            const n = Math.round(c.n * nubes);
            const anchoMax = 330 * c.s[1] * 2;
            const span = W + anchoMax * 2;
            return (
              <g key={ci} transform={zoomT(camara, c.d)}>
                {Array.from({ length: n }, (_, k) => {
                  const kk = `${semilla}${ci}-${k}`;
                  const s = c.s[0] + (c.s[1] - c.s[0]) * r0(`${kk}s`);
                  const an = 1 + r0(`${kk}a`) * 1.2;
                  const x = envolver(((k + r0(`${kk}x`) * 0.8) / n) * span - f * c.v * vel * dir - dx, span) - anchoMax;
                  const y = c.y[0] + (c.y[1] - c.y[0]) * r0(`${kk}y`) - dy;
                  const t = tonoN(x, y, c.tono);
                  return (
                    <NubeVolumen
                      key={k}
                      x={x}
                      y={y}
                      s={s}
                      ancho={an}
                      semilla={kk}
                      tonos={t}
                      contraluz
                      luzX={Math.max(-1, Math.min(1, (lx - x) / 700))}
                    />
                  );
                })}
              </g>
            );
          })
        : null}
      {suelo ? (
        <g transform={capaT(camara, 0.7)}>
          <path
            d={`M-300,${horizonte + 40} ${Array.from({ length: 13 }, (_, k) => {
              const x = -300 + k * 210;
              return `Q${x + 105},${horizonte - 30 - 40 * r0(`${semilla}h${k}`)} ${x + 210},${horizonte + 10 + 30 * r0(`${semilla}g${k}`)}`;
            }).join(" ")} L${W + 300},${H + 300} L-300,${H + 300} Z`}
            fill="#141838"
          />
          <path
            d={`M-300,${horizonte + 90} ${Array.from({ length: 9 }, (_, k) => {
              const x = -300 + k * 320;
              return `Q${x + 160},${horizonte + 20 - 30 * r0(`${semilla}j${k}`)} ${x + 320},${horizonte + 80}`;
            }).join(" ")} L${W + 300},${H + 300} L-300,${H + 300} Z`}
            fill="#0C0F28"
          />
          {/* lucecitas de casas a lo lejos */}
          {Array.from({ length: 14 }, (_, k) => (
            <circle key={k} cx={100 + r0(`${semilla}lx${k}`) * 1720} cy={horizonte + 40 + r0(`${semilla}ly${k}`) * 40} r={2.5} fill="#FFD27A" opacity={0.5 + 0.5 * Math.sin(f / 13 + k)} />
          ))}
        </g>
      ) : null}
      <rect x={-50} y={-50} width={W + 100} height={H + 100} fill="#05071E" opacity={0} />
    </g>
  );
};

// =====================================================================================================
// Paisaje
// =====================================================================================================
const PAISAJES = {
  desierto: {
    cielo: ["#3A7BD8", "#6CA9E6", "#A9D2F0", "#F6E3B4"],
    bruma: "#F7DDB0",
    lejos: { luz: "#E0A27E", sombra: "#B47160", base: "#C98A6A" },
    medio: { luz: "#F2C27A", sombra: "#C9874A", base: "#E2A962" },
    cerca: { luz: "#F6D394", sombra: "#D9A35F", base: "#EBBD7A" },
  },
  selva: {
    cielo: ["#3A7BD8", "#74B2E6", "#B4DDEE", "#DDF2E8"],
    bruma: "#D3EEE2",
    lejos: { luz: "#7FB5A2", sombra: "#4F8A7A", base: "#649F8C" },
    medio: { luz: "#4FC383", sombra: "#1F6A4E", base: "#2F8C63" },
    cerca: { luz: "#3FAF5A", sombra: "#1D5F37", base: "#2A7A44" },
  },
  ciudad: {
    cielo: ["#3B72C8", "#6FA4E2", "#AFCFEE", "#E4EEF5"],
    bruma: "#DCE7F2",
    lejos: { luz: "#A3B5D6", sombra: "#7D90B8", base: "#8FA2C7" },
    medio: { luz: "#7A8DBB", sombra: "#435279", base: "#5B6E9A" },
    cerca: { luz: "#B5BDCC", sombra: "#3A3F55", base: "#4A5068" },
  },
  montana: {
    cielo: ["#2F6DB5", "#5E9BD8", "#A2CDEE", "#D8EEF7"],
    bruma: "#DDEBF5",
    lejos: { luz: "#A7B6DA", sombra: "#5D6C99", base: "#7C8DB8" },
    medio: { luz: "#6DB07E", sombra: "#2F6B4E", base: "#4E8F6A" },
    cerca: { luz: "#79C26A", sombra: "#3F8A4A", base: "#5DAA5F" },
  },
} as const;
export type VariantePaisaje = keyof typeof PAISAJES;

const CIELO_HORA: Record<Momento, string[] | null> = {
  dia: null,
  atardecer: ["#2E2A72", "#7A3F9E", "#D9628A", "#F79A4C", "#FFD08A"],
  noche: ["#060922", "#0F1747", "#22306E", "#3A4686"],
};

type Tri = { luz: string; sombra: string; base: string };
const tintarTri = (t: Tri, m: Momento, k = 1): Tri => ({ luz: tintar(t.luz, m, k), sombra: tintar(t.sombra, m, k), base: tintar(t.base, m, k) });

/** Pino de dos tonos (mitad iluminada a la izquierda), x,y = base del tronco. */
const PinoLuz: React.FC<{ x: number; y: number; h: number; t: Tri; tronco: string }> = ({ x, y, h, t, tronco }) => {
  const w = h * 0.42;
  const pisos = [0, 1, 2].map((i) => {
    const yb = y - h * 0.12 - i * h * 0.26;
    const ww = w * (1 - i * 0.24);
    const top = yb - h * 0.42;
    return { yb, ww, top };
  });
  return (
    <g>
      <rect x={x - h * 0.03} y={y - h * 0.16} width={h * 0.06} height={h * 0.16} fill={tronco} />
      {pisos.map((p, i) => (
        <g key={i}>
          <path d={`M${fx(x)},${fx(p.top)} L${fx(x - p.ww / 2)},${fx(p.yb)} L${fx(x)},${fx(p.yb + h * 0.02)} Z`} fill={t.luz} />
          <path d={`M${fx(x)},${fx(p.top)} L${fx(x + p.ww / 2)},${fx(p.yb)} L${fx(x)},${fx(p.yb + h * 0.02)} Z`} fill={t.sombra} />
        </g>
      ))}
    </g>
  );
};

/**
 * Paisaje en 3 planos con paralaje y luz: lejano (montañas, mesetas o cerros con niebla), medio (dunas, selva,
 * edificios o colinas con pinos) y cercano (suelo con detalle: cactus y rocas, helechos, calle con farolas, pasto y
 * pinos). Cielo con sol o luna, nubes con volumen y bruma entre planos. vel = velocidad del travelling lateral.
 */
export const Paisaje: React.FC<{
  f: number;
  camara?: CamaraFondo;
  vel?: number;
  variante?: VariantePaisaje;
  momento?: Momento;
  horizonte?: number;
  dir?: 1 | -1;
  semilla?: string;
  id?: string;
}> = ({ f, camara, vel = 1, variante = "montana", momento = "dia", horizonte = 600, dir = 1, semilla = "pj", id = "pj" }) => {
  const B = PAISAJES[variante];
  const m = momento;
  const cielo = CIELO_HORA[m] ?? [...B.cielo];
  const bruma = m === "dia" ? B.bruma : m === "atardecer" ? "#FFB98A" : "#2C3A78";
  const lejos = tintarTri(B.lejos, m, 0.8);
  const medio = tintarTri(B.medio, m);
  const cerca = tintarTri(B.cerca, m);
  const noche = m === "noche";
  const astro = m === "noche" ? { x: 1450, y: 190, r: 56 } : m === "atardecer" ? { x: 640, y: horizonte - 250, r: 76 } : { x: 420, y: 180, r: 54 };
  const nubeT: TonosNube =
    m === "dia"
      ? { luz: "#FFFFFF", base: "#EEF5FB", sombra: "#BFD1E6" }
      : m === "atardecer"
        ? { luz: "#FFDDB0", base: "#F2A49A", sombra: "#8D69AC" }
        : { luz: "#7C86C6", base: "#3A447F", sombra: "#252C5C" };
  // repetición en bucle de una tira de ancho P, con desplazamiento por la deriva y la cámara
  const tira = (nombre: string, d: number, v: number, P: number) => {
    const { dx, dy } = capa(camara, d);
    const o = envolver(f * v * vel * dir + dx, P);
    return (
      <g transform={zoomT(camara, d)}>
        {[-1, 0, 1, 2].map((k) => (
          <use key={k} href={`#${id}-${nombre}`} x={fx(-o + k * P)} y={fx(-dy)} />
        ))}
      </g>
    );
  };
  // --------- plano lejano ---------
  const PL = 2400;
  const yL = horizonte + 40;
  const picos = Array.from({ length: 9 }, (_, k) => {
    const alto =
      variante === "montana" ? 230 + r0(`${semilla}lh${k}`) * 230 : variante === "ciudad" ? 90 + r0(`${semilla}lh${k}`) * 110 : 120 + r0(`${semilla}lh${k}`) * 160;
    return {
      x: ((k + 0.5) / 9) * PL + (r0(`${semilla}lx${k}`) - 0.5) * 120,
      h: alto,
      b: alto * (variante === "montana" ? 1.05 : 1.6) * (0.85 + r0(`${semilla}lb${k}`) * 0.4),
      q: r0(`${semilla}lq${k}`),
    };
  }).sort((a, b) => a.h - b.h);
  const lejano = (
    <g id={`${id}-lejano`}>
      {picos.map((p, k) => {
        const ap = { x: p.x + (p.q - 0.5) * p.b * 0.3, y: yL - p.h };
        if (variante === "desierto") {
          // meseta de cima plana con caras y estratos
          const tw = p.b * 0.35;
          const pts = `${fx(p.x - p.b)},${yL} ${fx(p.x - tw)},${fx(yL - p.h)} ${fx(p.x + tw)},${fx(yL - p.h)} ${fx(p.x + p.b)},${yL}`;
          return (
            <g key={k}>
              <polygon points={pts} fill={lejos.base} />
              <polygon points={`${fx(p.x + tw * 0.2)},${fx(yL - p.h)} ${fx(p.x + tw)},${fx(yL - p.h)} ${fx(p.x + p.b)},${yL} ${fx(p.x + p.b * 0.3)},${yL}`} fill={lejos.sombra} />
              <rect x={p.x - tw} y={yL - p.h} width={tw * 2} height={8} fill={lejos.luz} />
              {[0.35, 0.62].map((t, j) => (
                <line key={j} x1={p.x - tw - (p.b - tw) * t} y1={yL - p.h * (1 - t)} x2={p.x + tw + (p.b - tw) * t} y2={yL - p.h * (1 - t)} stroke={lejos.sombra} strokeWidth={5} opacity={0.5} />
              ))}
            </g>
          );
        }
        if (variante === "selva") {
          return (
            <g key={k}>
              <path d={`M${fx(p.x - p.b)},${yL} Q${fx(ap.x - p.b * 0.4)},${fx(ap.y - p.h * 0.35)} ${fx(ap.x)},${fx(ap.y)} Q${fx(ap.x + p.b * 0.45)},${fx(ap.y - p.h * 0.2)} ${fx(p.x + p.b)},${yL} Z`} fill={lejos.base} />
              <path d={`M${fx(ap.x)},${fx(ap.y)} Q${fx(ap.x + p.b * 0.45)},${fx(ap.y - p.h * 0.2)} ${fx(p.x + p.b)},${yL} L${fx(ap.x + p.b * 0.15)},${yL} Q${fx(ap.x + p.b * 0.05)},${fx(yL - p.h * 0.5)} ${fx(ap.x)},${fx(ap.y)} Z`} fill={lejos.sombra} />
            </g>
          );
        }
        // montaña (y cerros lejanos de la ciudad): caras de luz y sombra, aristas y nieve
        const mid = { x: ap.x + p.b * 0.12, y: yL };
        const nieve = variante === "montana" && p.h > 280;
        const ny = ap.y + p.h * 0.32;
        return (
          <g key={k}>
            <polygon points={`${fx(p.x - p.b)},${yL} ${fx(ap.x)},${fx(ap.y)} ${fx(mid.x)},${yL}`} fill={lejos.luz} />
            <polygon points={`${fx(ap.x)},${fx(ap.y)} ${fx(p.x + p.b)},${yL} ${fx(mid.x)},${yL}`} fill={lejos.sombra} />
            <polygon points={`${fx(ap.x)},${fx(ap.y)} ${fx(ap.x - p.b * 0.25)},${fx(yL - p.h * 0.25)} ${fx(ap.x - p.b * 0.12)},${yL}`} fill={lejos.base} opacity={0.7} />
            {nieve ? (
              <g>
                <polygon
                  points={`${fx(ap.x)},${fx(ap.y)} ${fx(ap.x - (ap.x - (p.x - p.b)) * 0.32)},${fx(ny)} ${fx(ap.x - p.b * 0.12)},${fx(ny - 22)} ${fx(ap.x - p.b * 0.04)},${fx(ny + 8)} ${fx(ap.x + p.b * 0.02)},${fx(ny - 16)}`}
                  fill="#F4FBFF"
                />
                <polygon
                  points={`${fx(ap.x)},${fx(ap.y)} ${fx(ap.x + p.b * 0.02)},${fx(ny - 16)} ${fx(ap.x + p.b * 0.12)},${fx(ny + 4)} ${fx(ap.x + (p.x + p.b - ap.x) * 0.3)},${fx(ny - 10)}`}
                  fill={tintar("#B9CBE6", m)}
                />
              </g>
            ) : null}
          </g>
        );
      })}
      {variante === "ciudad"
        ? Array.from({ length: 30 }, (_, k) => {
            const w = 50 + r0(`${semilla}sw${k}`) * 70;
            const h = 60 + r0(`${semilla}sh${k}`) * 190;
            const x = (k / 30) * PL + r0(`${semilla}sx${k}`) * 30;
            return (
              <g key={`s${k}`}>
                <rect x={x} y={yL - h} width={w} height={h} fill={mezclaColor(lejos.base, bruma, 0.25)} />
                <rect x={x + w * 0.78} y={yL - h} width={w * 0.22} height={h} fill={mezclaColor(lejos.sombra, bruma, 0.25)} />
                {noche
                  ? Array.from({ length: 4 }, (_, j) => (
                      <rect key={j} x={x + 6 + r0(`${semilla}sl${k}${j}`) * (w - 18)} y={yL - h + 10 + r0(`${semilla}sm${k}${j}`) * (h - 20)} width={5} height={7} fill="#FFD27A" opacity={0.6} />
                    ))
                  : null}
              </g>
            );
          })
        : null}
      <rect x={-10} y={yL - 2} width={PL + 20} height={H} fill={lejos.base} />
    </g>
  );
  // --------- plano medio ---------
  const PM = 2200;
  const yM = horizonte + 150;
  const medioG = (() => {
    if (variante === "desierto") {
      const dunas = Array.from({ length: 6 }, (_, k) => ({
        c: ((k + 0.5) / 6) * PM + (r0(`${semilla}dc${k}`) - 0.5) * 120,
        b: 260 + r0(`${semilla}db${k}`) * 160,
        h: 70 + r0(`${semilla}dh${k}`) * 70,
      }));
      return (
        <g id={`${id}-medio`}>
          {dunas.map((d, k) => {
            const cr = { x: d.c + d.b * 0.15, y: yM - d.h };
            return (
              <g key={k}>
                <path d={`M${fx(d.c - d.b)},${yM} Q${fx(d.c - d.b * 0.35)},${fx(yM - d.h * 1.05)} ${fx(cr.x)},${fx(cr.y)} Q${fx(d.c + d.b * 0.55)},${fx(yM - d.h * 0.55)} ${fx(d.c + d.b)},${yM} Z`} fill={medio.luz} />
                <path d={`M${fx(cr.x)},${fx(cr.y)} Q${fx(d.c + d.b * 0.55)},${fx(yM - d.h * 0.55)} ${fx(d.c + d.b)},${yM} L${fx(d.c + d.b * 0.3)},${yM} Q${fx(cr.x + d.b * 0.02)},${fx(yM - d.h * 0.45)} ${fx(cr.x)},${fx(cr.y)} Z`} fill={medio.sombra} />
              </g>
            );
          })}
          <rect x={-10} y={yM - 2} width={PM + 20} height={H} fill={medio.base} />
        </g>
      );
    }
    if (variante === "selva") {
      const n = 13;
      return (
        <g id={`${id}-medio`}>
          <rect x={-10} y={yM - 60} width={PM + 20} height={H} fill={medio.sombra} />
          {Array.from({ length: n }, (_, k) => (
            <NubeVolumen
              key={k}
              x={((k + 0.5) / n) * PM}
              y={yM + 20 - r0(`${semilla}cy${k}`) * 70}
              s={0.75 + r0(`${semilla}cs${k}`) * 0.4}
              ancho={0.8}
              semilla={`${semilla}copa${k}`}
              tonos={medio}
            />
          ))}
          {Array.from({ length: 5 }, (_, k) => {
            const x = ((k + 0.3) / 5) * PM;
            return (
              <g key={`p${k}`}>
                <rect x={x - 6} y={yM - 220} width={12} height={180} fill={oscurecer(medio.sombra, 0.2)} />
                {[-60, -25, 15, 50, 85].map((a, j) => (
                  <path
                    key={j}
                    d={`M${x},${yM - 220} q${fx(Math.cos(((a - 90) * Math.PI) / 180) * 60)},${fx(Math.sin(((a - 90) * Math.PI) / 180) * 60 - 20)} ${fx(Math.cos(((a - 90) * Math.PI) / 180) * 120)},${fx(Math.sin(((a - 90) * Math.PI) / 180) * 120 + 40)}`}
                    fill="none"
                    stroke={j % 2 ? medio.base : medio.luz}
                    strokeWidth={14}
                    strokeLinecap="round"
                  />
                ))}
              </g>
            );
          })}
          <rect x={-10} y={yM + 30} width={PM + 20} height={H} fill={medio.base} />
        </g>
      );
    }
    if (variante === "ciudad") {
      let x = 0;
      const edif: { x: number; w: number; h: number; k: number }[] = [];
      let k = 0;
      while (x < PM) {
        const w = 90 + r0(`${semilla}ew${k}`) * 130;
        edif.push({ x, w: Math.min(w, PM - x), h: 150 + r0(`${semilla}eh${k}`) * 300, k });
        x += w + 8 + r0(`${semilla}eg${k}`) * 20;
        k++;
      }
      return (
        <g id={`${id}-medio`}>
          {edif.map((e) => {
            const top = yM - e.h;
            const lado = e.w * 0.16;
            return (
              <g key={e.k}>
                <rect x={e.x} y={top} width={e.w} height={e.h + 40} fill={medio.base} />
                <rect x={e.x + e.w - lado} y={top} width={lado} height={e.h + 40} fill={medio.sombra} />
                <rect x={e.x} y={top} width={e.w} height={7} fill={medio.luz} />
                <rect x={e.x + 10} y={top + 18} width={e.w - lado - 20} height={e.h - 30} fill={`url(#${id}-ventanas${e.k % 2})`} />
                {e.k % 3 === 0 ? <line x1={e.x + e.w * 0.4} y1={top} x2={e.x + e.w * 0.4} y2={top - 50} stroke={medio.sombra} strokeWidth={4} /> : null}
                {e.k % 3 === 0 && noche ? <circle cx={e.x + e.w * 0.4} cy={top - 52} r={5} fill="#FF5A4A" opacity={0.5 + 0.5 * Math.sin(f / 8 + e.k)} /> : null}
                {e.k % 4 === 1 ? <rect x={e.x + e.w * 0.2} y={top - 26} width={e.w * 0.25} height={26} rx={4} fill={medio.sombra} /> : null}
              </g>
            );
          })}
          <rect x={-10} y={yM + 30} width={PM + 20} height={H} fill={medio.sombra} />
        </g>
      );
    }
    // montaña: colinas con pinos
    return (
      <g id={`${id}-medio`}>
        <path
          d={`M0,${yM} ${Array.from({ length: 5 }, (_, k) => {
            const x = (k * PM) / 5;
            return `Q${fx(x + PM / 10)},${fx(yM - 90 - 60 * r0(`${semilla}ch${k}`))} ${fx(x + PM / 5)},${yM}`;
          }).join(" ")} L${PM},${H + 200} L0,${H + 200} Z`}
          fill={medio.base}
        />
        {Array.from({ length: 5 }, (_, k) => {
          const x0 = (k * PM) / 5;
          const cy = yM - 90 - 60 * r0(`${semilla}ch${k}`);
          const xm = x0 + PM / 10;
          const ym = (yM + cy) / 2;
          return (
            <path
              key={`s${k}`}
              d={`M${fx(xm)},${fx(ym)} Q${fx(x0 + (3 * PM) / 20)},${fx((cy + yM) / 2)} ${fx(x0 + PM / 5)},${yM} L${fx(xm + 60)},${yM} Q${fx(xm + 40)},${fx(ym + 30)} ${fx(xm)},${fx(ym)} Z`}
              fill={medio.sombra}
              opacity={0.45}
            />
          );
        })}
        {Array.from({ length: 34 }, (_, k) => {
          const x = r0(`${semilla}px${k}`) * PM;
          const h = 70 + r0(`${semilla}ph${k}`) * 70;
          return <PinoLuz key={k} x={x} y={yM - 20 + r0(`${semilla}py${k}`) * 60} h={h} t={{ luz: medio.luz, sombra: medio.sombra, base: medio.base }} tronco={oscurecer(medio.sombra, 0.3)} />;
        })}
      </g>
    );
  })();
  // --------- plano cercano ---------
  const PC = 2000;
  const yC = horizonte + 300;
  const cercaG = (() => {
    const suelo = (
      <g>
        <path
          d={`M0,${yC} ${Array.from({ length: 8 }, (_, k) => `Q${fx(((k + 0.5) * PC) / 8)},${fx(yC - 14 - 14 * r0(`${semilla}sq${k}`))} ${fx(((k + 1) * PC) / 8)},${yC}`).join(" ")} L${PC},${H + 300} L0,${H + 300} Z`}
          fill={cerca.base}
        />
        <rect x={0} y={yC + 70} width={PC} height={H} fill={cerca.sombra} opacity={0.35} />
      </g>
    );
    if (variante === "desierto") {
      return (
        <g id={`${id}-cerca`}>
          {suelo}
          {Array.from({ length: 14 }, (_, k) => {
            const x = r0(`${semilla}rx${k}`) * PC;
            const y = yC + 40 + r0(`${semilla}ry${k}`) * 150;
            return <path key={`o${k}`} d={`M${fx(x)},${fx(y)} q60,-14 120,0 q60,14 120,0`} fill="none" stroke={cerca.sombra} strokeWidth={4} opacity={0.5} />;
          })}
          {[0.15, 0.62].map((t, k) => {
            const x = t * PC;
            const h = 230 + k * 60;
            const yb = yC + 30;
            return (
              <g key={`c${k}`}>
                <rect x={x - 26} y={yb - h} width={52} height={h} rx={26} fill={tintar("#3F9A5E", m)} />
                <rect x={x} y={yb - h} width={26} height={h} rx={13} fill={tintar("#2E7748", m)} />
                <path d={`M${x - 26},${yb - h * 0.45} h-40 a22,22 0 0 1 -22,-22 v-70 a22,22 0 0 1 44,0 v48 h18 Z`} fill={tintar("#3F9A5E", m)} />
                <path d={`M${x + 26},${yb - h * 0.6} h40 a22,22 0 0 0 22,-22 v-60 a22,22 0 0 0 -44,0 v38 h-18 Z`} fill={tintar("#2E7748", m)} />
                {[-12, 0, 12].map((d, j) => (
                  <line key={j} x1={x + d} y1={yb - h + 18} x2={x + d} y2={yb - 8} stroke={tintar("#246139", m)} strokeWidth={3} opacity={0.6} />
                ))}
              </g>
            );
          })}
          {[0.35, 0.82, 0.48].map((t, k) => {
            const x = t * PC;
            const y = yC + 60 + k * 40;
            const s = 1 + k * 0.4;
            return (
              <g key={`r${k}`} transform={`translate(${x},${y}) scale(${s})`}>
                <path d="M-70,0 L-50,-48 L-6,-66 L40,-40 L66,0 Z" fill={tintar("#B07255", m)} />
                <path d="M-6,-66 L40,-40 L66,0 L4,0 Z" fill={tintar("#8A5543", m)} />
                <path d="M-50,-48 L-6,-66 L-14,-40 Z" fill={tintar("#CC906E", m)} />
              </g>
            );
          })}
        </g>
      );
    }
    if (variante === "selva") {
      return (
        <g id={`${id}-cerca`}>
          {suelo}
          {Array.from({ length: 6 }, (_, k) => (
            <NubeVolumen key={`b${k}`} x={((k + 0.5) / 6) * PC} y={yC + 40} s={0.7 + r0(`${semilla}bs${k}`) * 0.4} ancho={1.1} semilla={`${semilla}arb${k}`} tonos={cerca} />
          ))}
          {Array.from({ length: 4 }, (_, k) => {
            const x = ((k + 0.25) / 4) * PC;
            const y = yC + 130;
            return (
              <g key={`h${k}`}>
                {[-70, -40, -12, 15, 45, 75].map((a, j) => {
                  const ra = ((a - 90) * Math.PI) / 180;
                  const L = 170 + (j % 2) * 40;
                  const ex = Math.cos(ra) * L;
                  const ey = Math.sin(ra) * L;
                  return (
                    <path
                      key={j}
                      d={`M${x},${y} Q${fx(x + ex * 0.5 - ey * 0.25)},${fx(y + ey * 0.5 + ex * 0.25)} ${fx(x + ex)},${fx(y + ey)} Q${fx(x + ex * 0.5 + ey * 0.2)},${fx(y + ey * 0.5 - ex * 0.2)} ${x},${y} Z`}
                      fill={j % 2 ? cerca.luz : tintar("#2E8C4E", m)}
                    />
                  );
                })}
              </g>
            );
          })}
          {Array.from({ length: 16 }, (_, k) => (
            <circle key={`f${k}`} cx={r0(`${semilla}fx${k}`) * PC} cy={yC + 60 + r0(`${semilla}fy${k}`) * 120} r={7} fill={k % 2 ? tintar("#FF6B5A", m) : tintar("#FFC93C", m)} />
          ))}
        </g>
      );
    }
    if (variante === "ciudad") {
      return (
        <g id={`${id}-cerca`}>
          {Array.from({ length: 9 }, (_, k) => (
            <NubeVolumen key={`sb${k}`} x={((k + 0.5) / 9) * PC} y={yC - 6} s={0.42 + r0(`${semilla}sb${k}`) * 0.15} ancho={1.4} semilla={`${semilla}seto${k}`} tonos={tintarTri({ luz: "#5DBB6E", base: "#3E9457", sombra: "#2A6B44" }, m)} />
          ))}
          <rect x={0} y={yC - 10} width={PC} height={36} fill={cerca.luz} />
          <rect x={0} y={yC + 22} width={PC} height={12} fill={oscurecer(cerca.luz, 0.3)} />
          <rect x={0} y={yC + 34} width={PC} height={H} fill={cerca.sombra} />
          {Array.from({ length: 10 }, (_, k) => (
            <rect key={`l${k}`} x={k * 200 + 30} y={yC + 120} width={110} height={10} rx={5} fill={tintar("#FFC93C", m, 0.6)} />
          ))}
          {Array.from({ length: 20 }, (_, k) => (
            <line key={`j${k}`} x1={k * 100} y1={yC - 10} x2={k * 100} y2={yC + 22} stroke={oscurecer(cerca.luz, 0.15)} strokeWidth={3} />
          ))}
          {[0.1, 0.6].map((t, k) => {
            const x = t * PC;
            return (
              <g key={`f${k}`}>
                {noche ? <path d={`M${x + 70},${yC - 300} L${x - 30},${yC + 10} L${x + 200},${yC + 10} Z`} fill="#FFE2A0" opacity={0.18} /> : null}
                {noche ? <ellipse cx={x + 85} cy={yC + 10} rx={130} ry={16} fill="#FFE2A0" opacity={0.3} /> : null}
                <rect x={x - 6} y={yC - 320} width={12} height={320} fill={tintar("#3A3F55", m)} />
                <path d={`M${x},${yC - 316} q0,-30 40,-30 h36`} fill="none" stroke={tintar("#3A3F55", m)} strokeWidth={10} />
                <rect x={x + 56} y={yC - 352} width={44} height={16} rx={6} fill={tintar("#2A2F45", m)} />
                <rect x={x + 60} y={yC - 338} width={36} height={6} fill={noche ? "#FFF2C4" : "#E8EEF7"} />
                {noche ? <circle cx={x + 78} cy={yC - 332} r={26} fill="#FFE2A0" opacity={0.35} /> : null}
              </g>
            );
          })}
        </g>
      );
    }
    return (
      <g id={`${id}-cerca`}>
        {suelo}
        {Array.from({ length: 30 }, (_, k) => {
          const x = r0(`${semilla}gx${k}`) * PC;
          const y = yC + 10 + r0(`${semilla}gy${k}`) * 160;
          return <path key={`g${k}`} d={`M${x - 14},${y} L${x - 4},${y - 26} L${x},${y} L${x + 6},${y - 32} L${x + 12},${y} Z`} fill={k % 2 ? cerca.luz : cerca.sombra} />;
        })}
        {Array.from({ length: 12 }, (_, k) => (
          <circle key={`fl${k}`} cx={r0(`${semilla}fx${k}`) * PC} cy={yC + 30 + r0(`${semilla}fy${k}`) * 140} r={6} fill={[tintar("#FFFFFF", m), tintar("#FFC93C", m), tintar("#E07BD0", m)][k % 3]} />
        ))}
        {[0.3, 0.75].map((t, k) => (
          <g key={`r${k}`} transform={`translate(${t * PC},${yC + 60}) scale(${1.2 + k * 0.3})`}>
            <path d="M-60,0 L-44,-40 L0,-54 L46,-30 L60,0 Z" fill={tintar("#9C9DB0", m)} />
            <path d="M0,-54 L46,-30 L60,0 L8,0 Z" fill={tintar("#6F7088", m)} />
          </g>
        ))}
        {[0.08, 0.5, 0.9].map((t, k) => (
          <PinoLuz key={`p${k}`} x={t * PC} y={yC + 40} h={300 + k * 40} t={{ luz: tintar("#3F8F5A", m), sombra: tintar("#245E3C", m), base: "" }} tronco={tintar("#6B4A35", m)} />
        ))}
      </g>
    );
  })();
  const ventanas = (k: number) => (
    <pattern key={k} id={`${id}-ventanas${k}`} width={17 * 7} height={22 * 9} patternUnits="userSpaceOnUse">
      {Array.from({ length: 7 }, (_, i) =>
        Array.from({ length: 9 }, (_, j) => {
          const q = r0(`${semilla}v${k}-${i}-${j}`);
          const enc = noche ? q > 0.45 : false;
          const col = enc ? (q > 0.9 ? "#FFF1C4" : "#FFD27A") : tintar(q > 0.7 ? "#C4DCF2" : k ? "#A9C7E8" : "#90B2D8", m);
          return <rect key={`${i}-${j}`} x={3 + i * 17} y={5 + j * 22} width={10} height={14} fill={col} opacity={enc ? 0.95 : noche ? 0.35 : 0.85} />;
        }),
      )}
    </pattern>
  );
  return (
    <g>
      <defs>
        {ventanas(0)}
        {ventanas(1)}
        {lejano}
        {medioG}
        {cercaG}
        <linearGradient id={`${id}-niebla1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bruma} stopOpacity={0} />
          <stop offset="70%" stopColor={bruma} stopOpacity={0.75} />
          <stop offset="100%" stopColor={bruma} stopOpacity={0.35} />
        </linearGradient>
        <linearGradient id={`${id}-niebla2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bruma} stopOpacity={0} />
          <stop offset="100%" stopColor={bruma} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <CieloFranjas stops={cielo} horizonte={horizonte + 40} R={60000} cam={camara} n={12} />
      {noche ? <CapaEstrellas f={f} n={150} semilla={`${semilla}e`} cam={camara} d={0.02} deriva={0} r={[0.8, 2.2]} o={[0.3, 1]} titila={0.5} colores={["#FFFFFF", "#FFF4DC"]} y1={horizonte} desvanece /> : null}
      <g transform={capaT(camara, 0.03)}>
        <Astro
          x={astro.x}
          y={astro.y}
          r={astro.r}
          color={noche ? "#EEF0FF" : m === "atardecer" ? "#FFF1C9" : "#FFFBEA"}
          halo={noche ? "#9FB0FF" : m === "atardecer" ? "#FFB65C" : "#FFF3C4"}
          f={f}
          id={`${id}-astro`}
          luna={noche}
        />
      </g>
      {/* nubes lejanas */}
      <g transform={zoomT(camara, 0.06)}>
        {Array.from({ length: 5 }, (_, k) => {
          const { dx } = capa(camara, 0.06);
          const span = W + 900;
          const x = envolver(((k + r0(`${semilla}nx${k}`) * 0.7) / 5) * span - f * 0.5 * vel * dir - dx, span) - 450;
          return (
            <NubeVolumen
              key={k}
              x={x}
              y={110 + r0(`${semilla}ny${k}`) * (horizonte - 330)}
              s={0.45 + r0(`${semilla}ns${k}`) * 0.35}
              ancho={1.2 + r0(`${semilla}na${k}`)}
              semilla={`${semilla}n${k}`}
              tonos={nubeT}
              luzX={astro.x < x ? -0.8 : 0.8}
            />
          );
        })}
      </g>
      {tira("lejano", 0.15, 0.6, PL)}
      <rect x={-200} y={yL - 200} width={W + 400} height={330} fill={`url(#${id}-niebla1)`} />
      {tira("medio", 0.45, 2.2, PM)}
      <rect x={-200} y={yM - 120} width={W + 400} height={260} fill={`url(#${id}-niebla2)`} />
      {tira("cerca", 1, 7, PC)}
    </g>
  );
};

// =====================================================================================================
// Interior
// =====================================================================================================
const INTERIORES = {
  hangar: { pared: "#3A4466", fondo: "#2E3656", techo: "#232946", piso: "#4A5272", luz: "#FFE6A8", acento: "#FFC93C", detalle: "#1E2440" },
  laboratorio: { pared: "#BFD8E2", fondo: "#A8C7D3", techo: "#DCEBF0", piso: "#8EAABA", luz: "#E8FBFF", acento: "#2FA99A", detalle: "#6E8EA0" },
  sala: { pared: "#D9B58A", fondo: "#C99F72", techo: "#EAD6B8", piso: "#9A6438", luz: "#FFE3B0", acento: "#5B3FA8", detalle: "#7E5230" },
} as const;
export type VarianteInterior = keyof typeof INTERIORES;

/**
 * Interior en perspectiva de un punto (hangar, laboratorio o sala): paredes y techo con profundidad y degradado,
 * columnas, lámparas con haces de luz que caen al piso, piso con reflejo y polvo que flota en la luz. La cámara
 * mueve el punto de fuga (sensación de 3D). luces = cuántas lámparas por fila (2–4).
 */
export const Interior: React.FC<{
  f: number;
  camara?: CamaraFondo;
  variante?: VarianteInterior;
  luces?: number;
  polvo?: number;
  semilla?: string;
  id?: string;
}> = ({ f, camara, variante = "hangar", luces = 3, polvo = 1, semilla = "in", id = "in" }) => {
  const P = INTERIORES[variante];
  const vx = W / 2 - (camara?.x ?? 0) * 0.35;
  const vy = 430 - (camara?.y ?? 0) * 0.35;
  const Z = 2.7;
  const pr = (x: number, y: number, z: number): [number, number] => [vx + (x - vx) / z, vy + (y - vy) / z];
  const pt = (p: [number, number]) => `${fx(p[0])},${fx(p[1])}`;
  const [bx0, by0] = pr(0, 0, Z);
  const [bx1, by1] = pr(W, H, Z);
  const zoom = camara?.zoom ?? 1;
  // Con la cámara alejada (zoom < 1) se ve más allá de 0..W × 0..H: techo, paredes y piso se prolongan hacia la cámara
  // (profundidad zc < 1) hasta cubrir todo el cuadro. Con zoom ≥ 1, zc = 1 y el dibujo es el de siempre.
  const zc = (() => {
    if (zoom >= 1) return 1;
    const X0 = W / 2 - W / (2 * zoom) - 40;
    const X1 = W / 2 + W / (2 * zoom) + 40;
    const Y0 = H / 2 - H / (2 * zoom) - 40;
    const Y1 = H / 2 + H / (2 * zoom) + 40;
    const ax = Math.max(40, Math.min(vx, W - 40));
    const ay = Math.max(40, Math.min(vy, H - 40));
    const k = Math.max(1, 1 - X0 / ax, (X1 - ax) / (W - ax), 1 - Y0 / ay, (Y1 - ay) / (H - ay));
    return 1 / (k * 1.05);
  })();
  const [e00, e10, e11, e01] = [pr(0, 0, zc), pr(W, 0, zc), pr(W, H, zc), pr(0, H, zc)];
  const quad = (a: [number, number], b: [number, number], c: [number, number], d: [number, number]) => `${pt(a)} ${pt(b)} ${pt(c)} ${pt(d)}`;
  const flick = (k: number) => 0.92 + 0.08 * Math.sin(f / 7 + k * 2.3) * (r0(`${semilla}fl${Math.floor(f / 4)}-${k}`) > 0.93 ? -3 : 1);
  const lamparas = Array.from({ length: luces }, (_, i) => (W * (i + 0.5)) / luces);
  const filas = [1.35, 2.05];
  const piso = quad(e01, e11, [bx1, by1], [bx0, by1]);
  return (
    <g transform={`translate(${W / 2},${H / 2}) scale(${zoom}) translate(${-W / 2},${-H / 2})`}>
      <defs>
        <linearGradient id={`${id}-pi`} x1="0" y1={by1} x2="0" y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={aclarar(P.piso, 0.15)} />
          <stop offset="100%" stopColor={oscurecer(P.piso, 0.35)} />
        </linearGradient>
        <linearGradient id={`${id}-pa-i`} x1="0" y1="0" x2={bx0} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={oscurecer(P.pared, 0.4)} />
          <stop offset="100%" stopColor={P.pared} />
        </linearGradient>
        <linearGradient id={`${id}-pa-d`} x1={W} y1="0" x2={bx1} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={oscurecer(P.pared, 0.45)} />
          <stop offset="100%" stopColor={oscurecer(P.pared, 0.08)} />
        </linearGradient>
        <linearGradient id={`${id}-te`} x1="0" y1="0" x2="0" y2={by0} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={oscurecer(P.techo, 0.45)} />
          <stop offset="100%" stopColor={P.techo} />
        </linearGradient>
        <linearGradient id={`${id}-haz`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.luz} stopOpacity={0.5} />
          <stop offset="100%" stopColor={P.luz} stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${id}-charco`}>
          <stop offset="0%" stopColor={P.luz} stopOpacity={0.55} />
          <stop offset="100%" stopColor={P.luz} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-refl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-mrefl`} x1="0" y1={by1} x2="0" y2={by1 + (by1 - by0) * 0.95} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
        <mask id={`${id}-mask-refl`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <rect x={0} y={by1} width={W} height={H} fill={`url(#${id}-mrefl)`} />
        </mask>
        <clipPath id={`${id}-clip-piso`}>
          <polygon points={piso} />
        </clipPath>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      {/* caja: techo, paredes, piso y fondo */}
      <polygon points={quad(e00, e10, [bx1, by0], [bx0, by0])} fill={`url(#${id}-te)`} />
      <polygon points={quad(e00, [bx0, by0], [bx0, by1], e01)} fill={`url(#${id}-pa-i)`} />
      <polygon points={quad(e10, [bx1, by0], [bx1, by1], e11)} fill={`url(#${id}-pa-d)`} />
      <polygon points={piso} fill={`url(#${id}-pi)`} />
      {/* pared del fondo con su detalle */}
      <g id={`${id}-fondo`}>
        <rect x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0} fill={P.fondo} />
        {variante === "hangar" ? (
          <g>
            {Array.from({ length: 9 }, (_, k) => (
              <rect key={k} x={bx0 + ((bx1 - bx0) * (k + 0.06)) / 9} y={by0 + (by1 - by0) * 0.22} width={((bx1 - bx0) / 9) * 0.88} height={(by1 - by0) * 0.78} fill={k % 2 ? oscurecer(P.fondo, 0.15) : aclarar(P.fondo, 0.07)} stroke={P.detalle} strokeWidth={3} />
            ))}
            <rect x={bx0} y={by0 + (by1 - by0) * 0.08} width={bx1 - bx0} height={(by1 - by0) * 0.1} fill={P.luz} opacity={0.75} />
            {Array.from({ length: 12 }, (_, k) => (
              <rect key={`v${k}`} x={bx0 + ((bx1 - bx0) * k) / 12} y={by0 + (by1 - by0) * 0.08} width={4} height={(by1 - by0) * 0.1} fill={P.detalle} />
            ))}
          </g>
        ) : variante === "laboratorio" ? (
          <g>
            {[0.1, 0.4, 0.7].map((t, k) => (
              <g key={k}>
                <rect x={bx0 + (bx1 - bx0) * t} y={by0 + (by1 - by0) * 0.2} width={(bx1 - bx0) * 0.22} height={(by1 - by0) * 0.32} rx={8} fill={P.detalle} />
                <rect x={bx0 + (bx1 - bx0) * t + 8} y={by0 + (by1 - by0) * 0.2 + 8} width={(bx1 - bx0) * 0.22 - 16} height={(by1 - by0) * 0.32 - 16} rx={4} fill="#7FE0D0" opacity={0.75 + 0.15 * Math.sin(f / 10 + k)} />
                <polyline
                  points={Array.from({ length: 8 }, (_, j) => `${fx(bx0 + (bx1 - bx0) * t + 16 + j * (((bx1 - bx0) * 0.22 - 32) / 7))},${fx(by0 + (by1 - by0) * 0.36 + Math.sin(f / 5 + j * 1.3 + k) * 14)}`).join(" ")}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={3}
                  opacity={0.8}
                />
              </g>
            ))}
            <rect x={bx0} y={by0 + (by1 - by0) * 0.66} width={bx1 - bx0} height={(by1 - by0) * 0.34} fill={oscurecer(P.fondo, 0.12)} />
            <rect x={bx0} y={by0 + (by1 - by0) * 0.66} width={bx1 - bx0} height={8} fill="#FFFFFF" opacity={0.6} />
          </g>
        ) : (
          <g>
            <rect x={bx0 + (bx1 - bx0) * 0.3} y={by0 + (by1 - by0) * 0.15} width={(bx1 - bx0) * 0.4} height={(by1 - by0) * 0.5} fill="#9FD3F0" />
            <rect x={bx0 + (bx1 - bx0) * 0.3} y={by0 + (by1 - by0) * 0.45} width={(bx1 - bx0) * 0.4} height={(by1 - by0) * 0.2} fill="#6FB07E" />
            <rect x={bx0 + (bx1 - bx0) * 0.3} y={by0 + (by1 - by0) * 0.15} width={(bx1 - bx0) * 0.4} height={(by1 - by0) * 0.5} fill="none" stroke={P.detalle} strokeWidth={12} />
            <line x1={W / 2 + (vx - W / 2) * 0} x2={bx0 + (bx1 - bx0) * 0.5} y1={by0 + (by1 - by0) * 0.15} y2={by0 + (by1 - by0) * 0.65} stroke={P.detalle} strokeWidth={8} />
            <rect x={bx0 + (bx1 - bx0) * 0.06} y={by0 + (by1 - by0) * 0.25} width={(bx1 - bx0) * 0.14} height={(by1 - by0) * 0.2} fill={P.acento} stroke={P.detalle} strokeWidth={6} />
            <rect x={bx0} y={by1 - 18} width={bx1 - bx0} height={18} fill={P.detalle} />
          </g>
        )}
      </g>
      {/* columnas y vigas en profundidad */}
      {(zc < 0.95 ? [0.88, 1.25, 1.65, 2.2] : [1.25, 1.65, 2.2]).map((z, k) => {
        const z2 = z + 0.07;
        const vigaY = pr(0, 0, z)[1];
        const ancho = 28 / z;
        return (
          <g key={k}>
            <polygon points={quad(pr(0, 0, z), pr(0, 0, z2), pr(0, H, z2), pr(0, H, z))} fill={oscurecer(P.pared, 0.25)} />
            <polygon points={quad(pr(W, 0, z), pr(W, 0, z2), pr(W, H, z2), pr(W, H, z))} fill={oscurecer(P.pared, 0.35)} />
            <rect x={pr(0, 0, z)[0]} y={vigaY} width={pr(W, 0, z)[0] - pr(0, 0, z)[0]} height={ancho} fill={P.detalle} opacity={variante === "sala" ? 0.4 : 0.9} />
            {variante === "hangar"
              ? Array.from({ length: 10 }, (_, j) => {
                  const x0 = pr(0, 0, z)[0] + ((pr(W, 0, z)[0] - pr(0, 0, z)[0]) * j) / 10;
                  const x1 = x0 + (pr(W, 0, z)[0] - pr(0, 0, z)[0]) / 10;
                  return <path key={j} d={`M${fx(x0)},${fx(vigaY + ancho)} L${fx((x0 + x1) / 2)},${fx(vigaY + ancho * 2.4)} L${fx(x1)},${fx(vigaY + ancho)}`} fill="none" stroke={P.detalle} strokeWidth={4 / z} />;
                })
              : null}
          </g>
        );
      })}
      {/* juntas del piso */}
      <g clipPath={`url(#${id}-clip-piso)`} opacity={0.35}>
        {Array.from({ length: variante === "sala" ? 15 : 9 }, (_, k) => {
          const n = variante === "sala" ? 15 : 9;
          const x = -W * 0.5 + (k * W * 2) / (n - 1);
          const [x0, y0] = pr(x, H, zc);
          return <line key={`l${k}`} x1={x0} y1={y0} x2={pr(x, H, Z)[0]} y2={by1} stroke={oscurecer(P.piso, 0.4)} strokeWidth={3} />;
        })}
        {variante !== "sala"
          ? [0.7, 0.85, 1.1, 1.3, 1.55, 1.85, 2.25].filter((z) => z >= 1.1 || z > zc).map((z, k) => <line key={`t${k}`} x1={0} x2={W} y1={pr(0, H, z)[1]} y2={pr(0, H, z)[1]} stroke={oscurecer(P.piso, 0.4)} strokeWidth={3} />)
          : null}
      </g>
      {variante === "hangar" ? (
        <g clipPath={`url(#${id}-clip-piso)`}>
          {[-1, 1].map((s) => (
            <polygon key={s} points={quad(pr(W / 2 + s * 520, H, zc), pr(W / 2 + s * 560, H, zc), pr(W / 2 + s * 560, H, Z), pr(W / 2 + s * 520, H, Z))} fill={P.acento} opacity={0.8} />
          ))}
        </g>
      ) : null}
      {variante === "sala" ? (
        <polygon points={quad(pr(W * 0.25, H, 1.25), pr(W * 0.75, H, 1.25), pr(W * 0.75, H, 2.0), pr(W * 0.25, H, 2.0))} fill={P.acento} opacity={0.85} />
      ) : null}
      {/* reflejo de la pared del fondo en el piso */}
      <g clipPath={`url(#${id}-clip-piso)`} opacity={variante === "sala" ? 0.18 : 0.3}>
        <g mask={`url(#${id}-mask-refl)`}>
          <use href={`#${id}-fondo`} transform={`translate(0,${fx(2 * by1)}) scale(1,-1)`} />
        </g>
      </g>
      {/* lámparas, haces y charcos de luz con su reflejo */}
      {filas.map((z, fi) =>
        lamparas.map((lx, li) => {
          const k = fi * 10 + li;
          const [cx, cy] = pr(lx, 0, z);
          const cuelga = 60 / z;
          const ly = cy + cuelga;
          const anchoL = 70 / z;
          const piso1 = pr(lx - 260, H, z * 1.05);
          const piso2 = pr(lx + 260, H, z * 1.05);
          const [px, py] = pr(lx, H, z * 1.05);
          const fl = flick(k);
          return (
            <g key={k}>
              <polygon points={`${fx(cx - anchoL * 0.4)},${fx(ly + 6)} ${fx(cx + anchoL * 0.4)},${fx(ly + 6)} ${pt(piso2)} ${pt(piso1)}`} fill={`url(#${id}-haz)`} opacity={0.7 * fl} />
              <ellipse cx={px} cy={py} rx={300 / z} ry={70 / z} fill={`url(#${id}-charco)`} opacity={fl} />
              <rect x={px - 30 / z} y={py} width={60 / z} height={(H - py) * 0.6} fill={`url(#${id}-refl)`} opacity={0.25 * fl} filter={`url(#${id}-blur)`} />
              <line x1={cx} y1={cy} x2={cx} y2={ly} stroke={P.detalle} strokeWidth={3 / z} />
              <path d={`M${fx(cx - anchoL / 2)},${fx(ly + 6)} L${fx(cx - anchoL / 4)},${fx(ly - 10 / z)} L${fx(cx + anchoL / 4)},${fx(ly - 10 / z)} L${fx(cx + anchoL / 2)},${fx(ly + 6)} Z`} fill={P.detalle} />
              <ellipse cx={cx} cy={ly + 6} rx={anchoL / 2} ry={7 / z} fill={P.luz} opacity={fl} />
              <circle cx={cx} cy={ly + 8} r={50 / z} fill={P.luz} opacity={0.25 * fl} />
            </g>
          );
        }),
      )}
      {/* polvo que flota (más visible dentro de los haces) */}
      {polvo > 0 ? (
        <g opacity={polvo}>
          {Array.from({ length: 70 }, (_, k) => {
            const x = envolver(r0(`${semilla}px${k}`) * W + f * (0.2 + r0(`${semilla}pv${k}`) * 0.5) + Math.sin(f / 40 + k) * 20, W);
            const y = envolver(r0(`${semilla}py${k}`) * H - f * 0.15 * r0(`${semilla}pw${k}`), H);
            const cerca = lamparas.reduce((a, lx) => Math.max(a, 1 - Math.abs(x - lx) / 260), 0);
            return <circle key={k} cx={fx(x)} cy={fx(y)} r={1.5 + r0(`${semilla}pr${k}`) * 3} fill={P.luz} opacity={(0.12 + 0.6 * Math.max(0, cerca)) * (0.6 + 0.4 * Math.sin(f / 9 + k))} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

// =====================================================================================================
// Oceano
// =====================================================================================================
const MARES: Record<Momento, { cielo: string[]; lejos: string; cerca: string; espuma: string; brillo: string; astro: { x: number; y: number; r: number; color: string; halo: string } }> = {
  dia: {
    cielo: ["#2F6FD0", "#5E9BE2", "#97C8F0", "#D6EEFA"],
    lejos: "#6FB0D8",
    cerca: "#1C4F8F",
    espuma: "#F4FBFF",
    brillo: "#FFFFFF",
    astro: { x: 1350, y: 190, r: 48, color: "#FFFBEA", halo: "#FFF3C4" },
  },
  atardecer: {
    cielo: ["#2E2A72", "#7A3F9E", "#D9628A", "#F79A4C", "#FFD08A"],
    lejos: "#E09A86",
    cerca: "#2E2662",
    espuma: "#FFE3C8",
    brillo: "#FFD08A",
    astro: { x: 960, y: 420, r: 80, color: "#FFF1C9", halo: "#FFB65C" },
  },
  noche: {
    cielo: ["#060922", "#0F1747", "#22306E", "#3A4686"],
    lejos: "#3A4A8A",
    cerca: "#0A0F2E",
    espuma: "#B9C5F0",
    brillo: "#E6ECFF",
    astro: { x: 1300, y: 230, r: 60, color: "#EEF0FF", halo: "#9FB0FF" },
  },
};

/**
 * Océano hasta el horizonte: cielo con sol o luna, nubes con volumen, filas de olas en capas (chicas y claras a lo
 * lejos, grandes y oscuras cerca) con cresta iluminada y espuma, y columna de reflejo que destella bajo el astro.
 * oleaje 0..2 = altura de las olas. vel = velocidad del oleaje y de las nubes.
 */
export const Oceano: React.FC<{
  f: number;
  camara?: CamaraFondo;
  vel?: number;
  momento?: Momento;
  horizonte?: number;
  oleaje?: number;
  filas?: number;
  nubes?: number;
  semilla?: string;
  id?: string;
}> = ({ f, camara, vel = 1, momento = "dia", horizonte = 520, oleaje = 1, filas = 10, nubes = 1, semilla = "oc", id = "oc" }) => {
  const M = MARES[momento];
  const ax = momento === "atardecer" ? M.astro.x : M.astro.x;
  const ay = momento === "atardecer" ? horizonte - 40 : M.astro.y;
  const nubeT: TonosNube =
    momento === "dia"
      ? { luz: "#FFFFFF", base: "#EEF5FB", sombra: "#BFD1E6" }
      : momento === "atardecer"
        ? { luz: "#FFDDB0", base: "#F2A49A", sombra: "#8D69AC" }
        : { luz: "#7C86C6", base: "#3A447F", sombra: "#252C5C" };
  const filasL = Array.from({ length: filas }, (_, k) => {
    const t = (k + 1) / filas;
    return {
      t,
      d: 0.1 + 0.9 * t,
      y: horizonte + (H + 40 - horizonte) * Math.pow(t, 1.7) - 10,
      amp: (2 + 44 * Math.pow(t, 1.6)) * oleaje,
      lam: 90 + 520 * t,
      vel: 0.015 + 0.045 * t,
      color: mezclaColor(M.lejos, M.cerca, Math.pow(t, 0.8)),
    };
  });
  const ola = (x: number, fila: (typeof filasL)[number], k: number, dxc: number) => {
    const th = ((x + dxc) / fila.lam) * Math.PI * 2 + f * fila.vel * vel * 2 + k * 1.7;
    return -(Math.sin(th) * 0.75 + Math.sin(th * 2.1 + 1) * 0.25) * fila.amp;
  };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-mar`} x1="0" y1={horizonte} x2="0" y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={aclarar(M.lejos, 0.2)} />
          <stop offset="100%" stopColor={M.cerca} />
        </linearGradient>
        <linearGradient id={`${id}-col`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={M.brillo} stopOpacity={0} />
          <stop offset="50%" stopColor={M.brillo} stopOpacity={0.22} />
          <stop offset="100%" stopColor={M.brillo} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-hz`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={M.cielo[M.cielo.length - 1]} stopOpacity={0} />
          <stop offset="60%" stopColor={M.cielo[M.cielo.length - 1]} stopOpacity={0.8} />
          <stop offset="100%" stopColor={M.cielo[M.cielo.length - 1]} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CieloFranjas stops={M.cielo} horizonte={horizonte} R={60000} cam={camara} n={12} />
      {momento === "noche" ? <CapaEstrellas f={f} n={140} semilla={`${semilla}e`} cam={camara} d={0.02} deriva={0} r={[0.8, 2.2]} o={[0.3, 1]} titila={0.5} colores={["#FFFFFF"]} y1={horizonte} desvanece /> : null}
      <g transform={capaT(camara, 0.03)}>
        <Astro x={ax} y={ay} r={M.astro.r} color={M.astro.color} halo={M.astro.halo} f={f} id={`${id}-astro`} luna={momento === "noche"} />
      </g>
      {nubes > 0 ? (
        <g transform={zoomT(camara, 0.08)}>
          {Array.from({ length: Math.round(6 * nubes) }, (_, k) => {
            const { dx } = capa(camara, 0.08);
            const span = W + 900;
            const x = envolver(((k + r0(`${semilla}nx${k}`) * 0.7) / 6) * span - f * 0.6 * vel - dx, span) - 450;
            const lejos = k % 2 === 0;
            return (
              <NubeVolumen
                key={k}
                x={x}
                y={lejos ? horizonte - 10 - r0(`${semilla}ny${k}`) * 40 : 120 + r0(`${semilla}ny${k}`) * (horizonte - 300)}
                s={lejos ? 0.35 : 0.55 + r0(`${semilla}ns${k}`) * 0.35}
                ancho={lejos ? 2.6 : 1.3 + r0(`${semilla}na${k}`)}
                semilla={`${semilla}n${k}`}
                tonos={lejos ? { luz: mezclaColor(nubeT.luz, M.cielo[M.cielo.length - 1], 0.4), base: mezclaColor(nubeT.base, M.cielo[M.cielo.length - 1], 0.45), sombra: mezclaColor(nubeT.sombra, M.cielo[M.cielo.length - 1], 0.45) } : nubeT}
                luzX={ax < x ? -0.8 : 0.8}
              />
            );
          })}
        </g>
      ) : null}
      <rect x={-200} y={horizonte - 2} width={W + 400} height={H} fill={`url(#${id}-mar)`} />
      {filasL.map((fila, k) => {
        const { dx, dy } = capa(camara, fila.d);
        const paso = Math.max(16, fila.lam / 10);
        const xs: number[] = [];
        for (let x = -60; x <= W + 60 + paso; x += paso) xs.push(x);
        const pts = xs.map((x) => [x, fila.y - dy + ola(x, fila, k, dx)] as const);
        const linea = pts.map(([x, y]) => `${fx(x)},${fx(y)}`).join(" L");
        const sig = filasL[k + 1];
        const bajo = (sig ? sig.y : H + 60) - dy;
        // espuma en las crestas (máximos de la ola)
        const espuma: { x: number; y: number }[] = [];
        if (fila.t > 0.35) {
          for (let i = 1; i < pts.length - 1; i++) {
            if (pts[i][1] < pts[i - 1][1] && pts[i][1] <= pts[i + 1][1] && pts[i][1] < fila.y - dy - fila.amp * 0.55 && r0(`${semilla}es${k}-${i}`) > 0.35)
              espuma.push({ x: pts[i][0] + (r0(`${semilla}ex${k}-${i}`) - 0.5) * fila.lam * 0.2, y: pts[i][1] });
          }
        }
        return (
          <g key={k}>
            <defs>
              <linearGradient id={`${id}-f${k}`} x1="0" y1={fx(fila.y - dy - fila.amp)} x2="0" y2={fx(Math.max(fila.y - dy + 4, bajo + fila.amp))} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={aclarar(fila.color, 0.16)} />
                <stop offset="45%" stopColor={fila.color} />
                <stop offset="100%" stopColor={oscurecer(fila.color, 0.22)} />
              </linearGradient>
            </defs>
            <path d={`M${linea} L${W + 100},${H + 200} L-100,${H + 200} Z`} fill={`url(#${id}-f${k})`} />
            <path d={`M${linea}`} fill="none" stroke={aclarar(fila.color, 0.45)} strokeWidth={1.5 + fila.t * 5} opacity={0.55 + 0.3 * fila.t} strokeLinejoin="round" />
            {espuma.map((e, j) => {
              const g = 0.6 + r0(`${semilla}eg${k}-${j}`) * 0.9;
              return (
                <g key={j}>
                  <path
                    d={`M${fx(e.x - fila.lam * 0.14 * g)},${fx(e.y + 3)} Q${fx(e.x)},${fx(e.y - 4 - fila.t * 10 * g)} ${fx(e.x + fila.lam * 0.14 * g)},${fx(e.y + 3)} Q${fx(e.x)},${fx(e.y + 2 + fila.t * 3)} ${fx(e.x - fila.lam * 0.14 * g)},${fx(e.y + 3)} Z`}
                    fill={M.espuma}
                    opacity={0.9}
                  />
                  {fila.t > 0.6 ? <circle cx={e.x + fila.lam * 0.17 * g} cy={e.y + 8 + fila.t * 6} r={2 + fila.t * 4} fill={M.espuma} opacity={0.6} /> : null}
                </g>
              );
            })}
          </g>
        );
      })}
      {/* columna de reflejo bajo el astro */}
      <g transform={capaT(camara, 0.2)}>
        <polygon points={`${ax - 40},${horizonte} ${ax + 40},${horizonte} ${ax + 260},${H} ${ax - 260},${H}`} fill={`url(#${id}-col)`} />
        {Array.from({ length: 46 }, (_, k) => {
          const t = r0(`${semilla}rt${k}`);
          const y = horizonte + 6 + Math.pow(t, 1.6) * (H - horizonte);
          const ancho = 40 + 230 * Math.pow(t, 1.4);
          const x = ax + (r0(`${semilla}rx${k}-${Math.floor(f / 5)}`) - 0.5) * ancho * 1.6;
          const on = r0(`${semilla}ro${k}-${Math.floor(f / 4)}`);
          return <rect key={k} x={x - ancho * 0.15} y={y} width={ancho * (0.12 + on * 0.25)} height={2 + t * 5} rx={3} fill={M.brillo} opacity={on > 0.3 ? 0.35 + on * 0.55 : 0.1} />;
        })}
      </g>
      <rect x={-200} y={horizonte - 30} width={W + 400} height={60} fill={`url(#${id}-hz)`} />
    </g>
  );
};
