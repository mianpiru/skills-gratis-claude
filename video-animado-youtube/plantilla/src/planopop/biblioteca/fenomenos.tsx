// Biblioteca Plano Pop · fenómenos: fuego, explosiones, humo, agua, ondas, frío
// Piezas COPIADAS de los videos viejos (los originales siguen en su sitio y no se tocan) con props genéricas.
// Todas van dentro de <Lienzo> (1920×1080). f = fotograma local de la escena; s = escala (1 = tamaño base).
// Catálogo con ejemplos: ./CATALOGO.md
import React from "react";
import { random } from "remotion";
import { C } from "../kit";
import { PB as P } from "./paleta";

// del canal original
export const Llamas: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  color?: string;
  centro?: string;
  n?: number;
}> = ({ x, y, f, s = 1, color = C.rojo, centro = C.amarillo, n = 3 }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: n }, (_, k) => (k - (n - 1) / 2) * 80).map((dx, k) => {
        const h = 1 + 0.18 * Math.sin(f / 2.3 + k * 2);
        return (
          <g key={k} transform={`translate(${dx},0) scale(1,${h})`}>
            <path d="M0,-90 C30,-50 46,-24 46,0 A46,46 0 0 1 -46,0 C-46,-24 -30,-50 0,-90 Z" fill={color} />
            <path
              d="M0,-50 C16,-28 24,-14 24,0 A24,24 0 0 1 -24,0 C-24,-14 -16,-28 0,-50 Z"
              fill={centro}
              transform="translate(0,18)"
            />
          </g>
        );
      })}
    </g>
  );

// del canal original (Estallido)
export const Explosion: React.FC<{
  x: number;
  y: number;
  r?: number;
  f: number;
  s?: number;
  colores?: [string, string, string];
}> = ({ x, y, r = 200, f, s = 1, colores = [C.rojo, C.naranja, C.amarillo] }) => {
  if (s <= 0.001) return null;
  const punta = (rr: number, n: number, gir: number) =>
    Array.from({ length: n * 2 }, (_, k) => {
      const a = (k / (n * 2)) * Math.PI * 2 + gir;
      const d = k % 2 ? rr * 0.55 : rr;
      return `${(Math.cos(a) * d).toFixed(1)},${(Math.sin(a) * d).toFixed(1)}`;
    }).join(" ");
  const late = 1 + Math.sin(f / 5) * 0.03;
  return (
    <g transform={`translate(${x},${y}) scale(${s * late})`}>
      <polygon points={punta(r, 12, 0)} fill={colores[0]} />
      <polygon points={punta(r * 0.72, 10, 0.3)} fill={colores[1]} />
      <polygon points={punta(r * 0.42, 8, 0.1)} fill={colores[2]} />
    </g>
  );
};

// del canal original (Estallido)
export const EstallidoRayos: React.FC<{
  x: number;
  y: number;
  s: number;
  f: number;
  color?: string;
}> = ({ x, y, s, f, color = C.amarillo }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${f * 2})`}>
      {Array.from({ length: 10 }, (_, k) => (
        <rect key={k} x={-12} y={-190} width={24} height={110} rx={12} fill={color} transform={`rotate(${k * 36})`} />
      ))}
      <circle r={90} fill={C.naranja} />
      <circle r={55} fill={C.crema} />
    </g>
  );

// del canal original (Estallido)
export const ColumnaHumo: React.FC<{
  x: number;
  y: number;
  f: number;
  alto: number;
  golpes?: number[];
}> = ({ x, y, f, alto, golpes = [] }) => {
  const N = 14;
  return (
    <g>
      {/* anillos de choque en cada golpe */}
      {golpes.map((g, k) => {
        const t = (f - g) / 22;
        if (t < 0 || t > 1) return null;
        return (
          <ellipse
            key={`g${k}`}
            cx={x}
            cy={y}
            rx={60 + t * 520}
            ry={(60 + t * 520) * 0.45}
            fill="none"
            stroke={C.blanco}
            strokeWidth={14 * (1 - t)}
            opacity={1 - t}
          />
        );
      })}
      <circle cx={x} cy={y} r={70 + Math.sin(f / 3) * 6} fill={C.naranja} opacity={0.55} />
      <circle cx={x} cy={y} r={40} fill={C.amarillo} />
      {/* columna */}
      {Array.from({ length: N }, (_, k) => {
        const t = k / (N - 1);
        const yy = y - 30 - t * alto + Math.sin(f / 7 + k) * 6;
        const r = 46 + t * 120;
        const dx = Math.sin(f / 10 + k * 1.3) * 10;
        return (
          <g key={k}>
            <circle cx={x - r * 0.45 + dx} cy={yy} r={r * 0.62} fill={k % 2 ? P.nube : P.nube2} />
            <circle cx={x + r * 0.45 - dx} cy={yy - 12} r={r * 0.62} fill={k % 2 ? P.nube2 : P.nube} />
          </g>
        );
      })}
      {/* paraguas arriba */}
      {[-1, 1].map((lado) => (
        <ellipse key={lado} cx={x + lado * (230 + Math.sin(f / 12) * 14)} cy={y - alto - 40} rx={230} ry={90} fill={P.nube} />
      ))}
      <ellipse cx={x} cy={y - alto - 70} rx={260} ry={110} fill={P.nube2} />
      {/* bombas volcánicas */}
      {Array.from({ length: 9 }, (_, k) => {
        const t = ((f + k * 7) % 34) / 34;
        const dir = (random(`bm${k}`) - 0.5) * 2;
        const vy = 300 + random(`bv${k}`) * 260;
        return (
          <circle
            key={`b${k}`}
            cx={x + dir * t * 320}
            cy={y - vy * t + 420 * t * t}
            r={11 - t * 5}
            fill={C.negro}
            opacity={0.85}
          />
        );
      })}
    </g>
  );
};

// del canal original
export const Vapor: React.FC<{ f: number; x: number; y: number }> = ({ f, x, y }) => (
  <g>
    {[0, 1, 2].map((k) => {
      const t = (f + k * 12) % 36;
      return <circle key={k} cx={x + (k - 1) * 46} cy={y - t * 3} r={18 + t * 0.9} fill={C.blanco} opacity={0.5 - t / 80} />;
    })}
  </g>
);

// del canal original
const gotaD = (r: number) =>
  `M0,${-1.75 * r} C${0.45 * r},${-1.05 * r} ${r},${-0.6 * r} ${r},0 A${r},${r} 0 0 1 ${-r},0 C${-r},${-0.6 * r} ${-0.45 * r},${-1.05 * r} 0,${-1.75 * r} Z`;

// del canal original
export const Gota: React.FC<{
  x: number;
  y: number;
  r: number;
  s?: number;
  color?: string;
  op?: number;
}> = ({ x, y, r, s = 1, color = "#3E9BE6", op = 1 }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
      <path d={gotaD(r)} transform={`translate(${r * 0.08},${r * 0.1})`} fill="rgba(18,12,46,0.25)" />
      <path d={gotaD(r)} fill={color} />
      <ellipse
        cx={-r * 0.42}
        cy={-r * 0.15}
        rx={r * 0.16}
        ry={r * 0.3}
        fill={C.blanco}
        opacity={0.55}
        transform={`rotate(20 ${-r * 0.42} ${-r * 0.15})`}
      />
    </g>
  );

// del canal original
export const Burbujas: React.FC<{
  x: number;
  y: number;
  f: number;
  n?: number;
  alto?: number;
}> = ({ x, y, f, n = 8, alto = 400 }) => (
  <g>
    {Array.from({ length: n }, (_, k) => {
      const t = ((f * (1.2 + random(`bv${k}`)) + random(`bt${k}`) * alto) % alto) / alto;
      return (
        <circle
          key={k}
          cx={x + Math.sin(f / 10 + k) * 14 + (random(`bx${k}`) - 0.5) * 40}
          cy={y - t * alto}
          r={5 + random(`br${k}`) * 9}
          fill="none"
          stroke={C.blanco}
          strokeWidth={3}
          opacity={0.6 * (1 - t)}
        />
      );
    })}
  </g>
);

// del canal original (Arcos)
export const Ondas: React.FC<{
  x: number;
  y: number;
  f: number;
  color: string;
  dir?: number;
  abre?: number;
  r0?: number;
  r1?: number;
  n?: number;
  vel?: number;
  grosor?: number;
  op?: number;
}> = ({ x, y, f, color, dir = 0, abre = 40, r0 = 60, r1 = 400, n = 4, vel = 5, grosor = 14, op = 0.8 }) => {
  const rad = (a: number) => (a * Math.PI) / 180;
  const tramo = r1 - r0;
  const a1 = rad(dir - abre);
  const a2 = rad(dir + abre);
  return (
    <g fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round">
      {Array.from({ length: n }, (_, k) => {
        const r = r0 + ((Math.max(0, f) * vel + (k * tramo) / n) % tramo);
        return (
          <path
            key={k}
            d={`M${x + r * Math.cos(a1)},${y + r * Math.sin(a1)} A${r},${r} 0 0 1 ${x + r * Math.cos(a2)},${y + r * Math.sin(a2)}`}
            opacity={op * (1 - (r - r0) / tramo)}
          />
        );
      })}
    </g>
  );
};

// del canal original (Anillos)
export const Pulso: React.FC<{
  f: number;
  desde: number;
  x: number;
  y: number;
  color?: string;
}> = ({ f, desde, x, y, color = C.amarillo }) => {
  if (f < desde) return null;
  return (
    <g>
      {[0, 1].map((k) => {
        const t = ((f - desde + k * 12) % 24) / 24;
        return <circle key={k} cx={x} cy={y} r={26 + t * 70} fill="none" stroke={color} strokeWidth={8} opacity={1 - t} />;
      })}
    </g>
  );
};

// del canal original
export const PulsoLuz: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  vuelta?: boolean;
}> = ({ x, y, f, s = 1, vuelta }) => {
  const dir = vuelta ? 1 : -1;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: 9 }, (_, k) => (
        <circle key={k} cx={dir * (k + 1) * 16} cy={0} r={15 - k * 1.4} fill={C.amarillo} opacity={0.55 - k * 0.055} />
      ))}
      <circle cx={0} cy={0} r={34 + Math.sin(f / 3) * 4} fill={C.amarillo} opacity={0.25} />
      <circle cx={0} cy={0} r={18} fill={C.amarillo} />
      <circle cx={0} cy={0} r={9} fill={C.crema} />
    </g>
  );
};

// del canal original
export const OndaPortadora: React.FC<{
  x1: number;
  x2: number;
  y: number;
  f: number;
  amp?: number;
  frente?: number;
  datos?: boolean;
  color?: string;
}> = ({ x1, x2, y, f, amp = 22, frente = 1, datos, color = C.teal }) => {
  if (frente <= 0.001) return null;
  const xf = x2 - (x2 - x1) * Math.min(1, frente);
  const lam = 60;
  const pts: string[] = [];
  for (let x = x2; x >= xf; x -= 10)
    pts.push(`${x.toFixed(1)},${(y + Math.sin(((x + f * 9) / lam) * Math.PI) * amp).toFixed(1)}`);
  pts.push(`${xf.toFixed(1)},${(y + Math.sin(((xf + f * 9) / lam) * Math.PI) * amp).toFixed(1)}`);
  const n = Math.floor((x2 - xf) / 120);
  return (
    <g>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      {datos
        ? Array.from({ length: n }, (_, k) => {
            const xx = x2 - 60 - k * 120 - ((f * 6) % 120);
            if (xx < xf || xx > x2) return null;
            const yy = y + Math.sin(((xx + f * 9) / lam) * Math.PI) * amp;
            return <rect key={k} x={xx - 14} y={yy - 44} width={28} height={28} rx={5} fill={C.amarillo} />;
          })
        : null}
    </g>
  );
};

// del canal original
export const Destello: React.FC<{
  x: number;
  y: number;
  s: number;
  color?: string;
}> = ({ x, y, s, color = C.blanco }) =>
  s <= 0.001 ? null : (
    <path d="M0,-34 L9,-9 L34,0 L9,9 L0,34 L-9,9 L-34,0 L-9,-9 Z" fill={color} transform={`translate(${x},${y}) scale(${s})`} />
  );

// del canal original
export const Escarcha: React.FC<{
  x: number;
  y: number;
  s?: number;
  o?: number;
}> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o} stroke={C.hielo} strokeWidth={8} strokeLinecap="round">
    {[0, 60, 120].map((r) => (
      <line key={r} x1={-30} y1={0} x2={30} y2={0} transform={`rotate(${r})`} />
    ))}
  </g>
);

// del canal original
export const Grietas: React.FC<{
  x: number;
  y: number;
  s?: number;
  n?: number;
}> = ({ x, y, s = 1, n = 3 }) => {
  const rayos = ["M0,0 L30,-40 L22,-80 L50,-120", "M0,0 L-36,-20 L-60,-70", "M0,0 L20,40 L60,52 L80,96", "M0,0 L-30,44 L-24,90"];
  return (
    <g
      transform={`translate(${x},${y}) scale(${s})`}
      fill="none"
      stroke={C.negro}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {rayos.slice(0, Math.max(1, Math.min(4, n))).map((d, k) => (
        <path key={k} d={d} />
      ))}
    </g>
  );
};

/** Copos que caen por toda la pantalla: ceniza (por defecto), nieve sucia o polvo. Sacado de MapaEEUU (V09). */
export const Copos: React.FC<{
  f: number;
  o?: number;
  n?: number;
  colores?: [string, string];
  vel?: number;
  semilla?: string;
}> = ({ f, o = 1, n = 80, colores = [P.ceniza4, P.ceniza2], vel = 1, semilla = "cp" }) =>
  o <= 0.001 ? null : (
    <g opacity={o}>
      {Array.from({ length: n }, (_, k) => {
        const v = (1.4 + random(`${semilla}v${k}`) * 2) * vel;
        const cy = (random(`${semilla}y${k}`) * 1080 + f * v) % 1080;
        const cx = random(`${semilla}x${k}`) * 1920 + Math.sin((f + k * 9) / 26) * 14;
        return (
          <circle
            key={k}
            cx={cx}
            cy={cy}
            r={3 + random(`${semilla}r${k}`) * 4}
            fill={k % 3 ? colores[0] : colores[1]}
            opacity={0.85}
          />
        );
      })}
    </g>
  );

const nubeForma = (cx: number, cy: number, r: number, f: number, sem: string, n = 40) =>
  Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2;
    const rr = r * (1 + 0.06 * Math.sin(k * 2.3 + f / 9) + 0.05 * (random(`${sem}${k}`) - 0.5));
    return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr * 0.86).toFixed(1)}`;
  }).join(" ");

/** Nube vista desde arriba (sobre un mapa): tres capas que respiran. r = radio exterior. Sacada de MapaEEUU (V09). */
export const NubeMancha: React.FC<{
  cx: number;
  cy: number;
  r: number;
  f: number;
  o?: number;
  colores?: [string, string, string];
  semilla?: string;
}> = ({ cx, cy, r, f, o = 0.9, colores = [P.nube, "#7A7F90", "#666B7C"], semilla = "nm" }) =>
  r <= 0.5 ? null : (
    <g opacity={o}>
      <polygon points={nubeForma(cx, cy, r, f, `${semilla}a`)} fill={colores[0]} />
      <polygon points={nubeForma(cx, cy, r * 0.7, f + 20, `${semilla}b`)} fill={colores[1]} />
      <polygon points={nubeForma(cx, cy, r * 0.35, f + 40, `${semilla}c`)} fill={colores[2]} />
    </g>
  );

/**
 * Nubarrón con lluvia, de lado. (x, y) = centro de la fila de nubes; las gotas caen `alto` px por debajo, en un
 * ancho `w`. o 0..1. Sacado de TechoCeniza (V09).
 */
export const Lluvia: React.FC<{
  x: number;
  y: number;
  f: number;
  w?: number;
  alto?: number;
  o?: number;
  n?: number;
  nube?: string;
  gota?: string;
  nubes?: boolean;
}> = ({ x, y, f, w = 560, alto = 220, o = 1, n = 22, nube = C.gris2, gota = C.cielo, nubes = true }) =>
  o <= 0.001 ? null : (
    <g opacity={o}>
      {nubes
        ? [-0.32, -0.07, 0.2, 0.41].map((px, k) => (
            <circle key={k} cx={x + px * w} cy={y + (k % 2) * 20} r={(90 + (k % 2) * 20) * (w / 560)} fill={nube} />
          ))
        : null}
      {Array.from({ length: n }, (_, k) => {
        const lx = x - w / 2 + random(`ll${k}`) * w;
        const ly = y + 60 + ((random(`lm${k}`) * alto + f * 14) % alto);
        return <rect key={k} x={lx} y={ly} width={6} height={30} rx={3} fill={gota} />;
      })}
    </g>
  );
