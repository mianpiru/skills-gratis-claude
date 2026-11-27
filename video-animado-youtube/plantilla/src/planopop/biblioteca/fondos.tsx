// Biblioteca Plano Pop · fondos animados en 2–3 capas con paralaje (la referencia nunca tiene un fondo quieto).
// Todos llenan el cuadro (1920×1080) y van primero dentro del <Lienzo>. `vel` multiplica la velocidad (1 = normal).
// Los que usan degradados llevan `id`: si hay dos del mismo tipo en la misma escena, dale ids distintos.
import React from "react";
import { interpolateColors, random } from "remotion";
import { C, H, W } from "../kit";
import { aclarar, oscurecer } from "./volumen";

const envolver = (v: number, m: number) => ((v % m) + m) % m;

/**
 * Rayos radiales que giran despacio y laten (el estallido y las pantallas de título de la referencia), con anillos
 * concéntricos que salen del centro. colores: [fondo, rayo]; el rayo alterna con una versión más clara.
 */
export const FondoRayos: React.FC<{
  f: number;
  colores?: [string, string];
  cx?: number;
  cy?: number;
  n?: number;
  vel?: number;
  anillos?: boolean;
}> = ({ f, colores = [C.morado, C.lila], cx = W / 2, cy = H / 2, n = 18, vel = 1, anillos = true }) => {
  const [fondo, rayo] = colores;
  const giro = f * 0.25 * vel;
  const late = 1 + 0.04 * Math.sin((f * vel) / 7);
  const L = 2400;
  return (
    <g>
      <rect width={W} height={H} fill={fondo} />
      <g transform={`translate(${cx},${cy}) rotate(${giro}) scale(${late})`}>
        {Array.from({ length: n }, (_, k) => {
          const a = (k / n) * Math.PI * 2;
          const b = a + (Math.PI / n) * 0.9;
          return (
            <path
              key={k}
              d={`M0,0 L${Math.cos(a) * L},${Math.sin(a) * L} L${Math.cos(b) * L},${Math.sin(b) * L} Z`}
              fill={k % 2 ? rayo : aclarar(rayo, 0.15)}
              opacity={0.45}
            />
          );
        })}
      </g>
      {anillos
        ? [0, 1, 2, 3].map((k) => {
            const t = envolver((f * vel) / 70 + k / 4, 1);
            return (
              <circle
                key={k}
                cx={cx}
                cy={cy}
                r={80 + t * 1100}
                fill="none"
                stroke={aclarar(rayo, 0.3)}
                strokeWidth={26 * (1 - t)}
                opacity={0.35 * (1 - t)}
              />
            );
          })
        : null}
      <circle cx={cx} cy={cy} r={170 + 10 * Math.sin(f / 6)} fill={aclarar(rayo, 0.5)} opacity={0.25} />
    </g>
  );
};

/** Campo de estrellas en 3 capas con paralaje (las lejanas, chicas y lentas) más galaxias de colores que derivan. */
export const FondoEstrellas: React.FC<{
  f: number;
  fondo?: string;
  color?: string;
  vel?: number;
  n?: number;
  galaxias?: boolean;
  semilla?: string;
}> = ({ f, fondo = "#140E33", color = C.crema, vel = 1, n = 70, galaxias = true, semilla = "fe" }) => {
  const capas = [
    { v: 0.15, r: 1.6, o: 0.5 },
    { v: 0.4, r: 2.6, o: 0.75 },
    { v: 0.9, r: 4, o: 1 },
  ];
  const tonos = [C.teal, C.naranja, C.amarillo, "#F27BC4", C.lila];
  return (
    <g>
      <rect width={W} height={H} fill={fondo} />
      <ellipse
        cx={W * 0.65}
        cy={H * 0.45}
        rx={900}
        ry={420}
        fill={aclarar(fondo, 0.08)}
        opacity={0.8}
        transform={`rotate(-12 ${W * 0.65} ${H * 0.45})`}
      />
      {capas.map((c, ci) =>
        Array.from({ length: n }, (_, k) => {
          const x = envolver(random(`${semilla}x${ci}-${k}`) * (W + 100) - f * c.v * vel, W + 100) - 50;
          const y = random(`${semilla}y${ci}-${k}`) * H;
          const brilla = 0.55 + 0.45 * Math.sin(f / (8 + random(`${semilla}t${ci}-${k}`) * 12) + k);
          return (
            <circle
              key={`${ci}-${k}`}
              cx={x}
              cy={y}
              r={c.r * (0.7 + random(`${semilla}r${ci}-${k}`) * 0.6)}
              fill={color}
              opacity={c.o * brilla}
            />
          );
        }),
      )}
      {galaxias
        ? Array.from({ length: 5 }, (_, k) => {
            const x = envolver(random(`${semilla}gx${k}`) * (W + 400) - f * 0.6 * vel, W + 400) - 200;
            const y = 120 + random(`${semilla}gy${k}`) * (H - 240);
            const col = tonos[k % tonos.length];
            const s = 0.4 + random(`${semilla}gs${k}`) * 0.5;
            return (
              <g key={`g${k}`} transform={`translate(${x},${y}) scale(${s}) rotate(${-20 + f * 0.3 + k * 50})`} opacity={0.85}>
                <ellipse rx={150} ry={64} fill={col} opacity={0.25} />
                <path d="M0,0 C60,-50 140,-20 150,20" fill="none" stroke={col} strokeWidth={16} strokeLinecap="round" />
                <path d="M0,0 C-60,50 -140,20 -150,-20" fill="none" stroke={col} strokeWidth={16} strokeLinecap="round" />
                <ellipse rx={50} ry={26} fill={aclarar(col, 0.5)} />
                <circle r={16} fill="#FFFFFF" />
              </g>
            );
          })
        : null}
    </g>
  );
};

/**
 * Rejilla en perspectiva que avanza hacia la cámara y ondula (el espacio-tiempo de la referencia). Piso y, con
 * `techo`, también techo. horizonte = altura del punto de fuga. ondula 0..1 = cuánto tiemblan las líneas.
 */
export const FondoRejilla: React.FC<{
  f: number;
  fondo?: string;
  color?: string;
  vel?: number;
  ondula?: number;
  techo?: boolean;
  horizonte?: number;
}> = ({ f, fondo = "#1E3346", color = C.teal, vel = 1, ondula = 0.5, techo = true, horizonte = H / 2 }) => {
  const cx = W / 2;
  const mitad = (signo: 1 | -1) => {
    const borde = signo === 1 ? H : 0;
    const prof = Math.abs(borde - horizonte);
    const verticales = Array.from({ length: 29 }, (_, k) => {
      const xb = cx + (k - 14) * 210;
      const pts = Array.from({ length: 9 }, (_, j) => {
        const t = j / 8;
        const x = cx + (xb - cx) * t + Math.sin(f / 6 + j * 1.3 + k) * 6 * ondula * t;
        const y = horizonte + signo * prof * t;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      });
      return <polyline key={`v${k}`} points={pts.join(" ")} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />;
    });
    const fase = envolver((f * vel) / 40, 1);
    const horizontales = Array.from({ length: 12 }, (_, k) => {
      const t = Math.pow((k + fase) / 12, 2.2);
      const y = horizonte + signo * prof * t;
      const pts = Array.from({ length: 25 }, (_, j) => {
        const x = (j / 24) * W;
        return `${x.toFixed(0)},${(y + Math.sin(f / 5 + j * 1.7 + k) * 5 * ondula * t).toFixed(1)}`;
      });
      return (
        <polyline
          key={`h${k}`}
          points={pts.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={2 + 5 * t}
          opacity={0.3 + 0.7 * t}
        />
      );
    });
    return (
      <g>
        {verticales}
        {horizontales}
      </g>
    );
  };
  return (
    <g>
      <rect width={W} height={H} fill={fondo} />
      {mitad(1)}
      {techo ? mitad(-1) : null}
      <rect x={0} y={horizonte - 60} width={W} height={120} fill={fondo} opacity={0.85} />
    </g>
  );
};

/** Nubes planas tipo «píldora» en 3 capas que se desplazan a distinta velocidad (fondo de noche de la referencia). */
export const FondoNubes: React.FC<{ f: number; fondo?: string; color?: string; vel?: number; n?: number; semilla?: string }> = ({
  f,
  fondo = "#0F1430",
  color = "#2A3050",
  vel = 1,
  n = 7,
  semilla = "fn",
}) => {
  const capas = [
    { v: 0.3, s: 0.6, c: oscurecer(color, 0.25) },
    { v: 0.7, s: 0.9, c: color },
    { v: 1.3, s: 1.25, c: aclarar(color, 0.12) },
  ];
  return (
    <g>
      <rect width={W} height={H} fill={fondo} />
      {capas.map((cp, ci) =>
        Array.from({ length: n }, (_, k) => {
          const anchoN = 420 * cp.s;
          const x = envolver(random(`${semilla}x${ci}-${k}`) * (W + anchoN * 2) - f * cp.v * vel, W + anchoN * 2) - anchoN;
          const y = 60 + random(`${semilla}y${ci}-${k}`) * (H - 120);
          const h = 26 * cp.s;
          return (
            <g key={`${ci}-${k}`} transform={`translate(${x},${y})`} fill={cp.c}>
              <rect x={0} y={0} width={anchoN} height={h} rx={h / 2} />
              <rect x={anchoN * 0.18} y={-h * 1.25} width={anchoN * 0.5} height={h} rx={h / 2} />
              <rect x={anchoN * 0.4} y={h * 1.25} width={anchoN * 0.7} height={h} rx={h / 2} />
              <rect x={-anchoN * 0.15} y={h * 2.5} width={anchoN * 0.4} height={h} rx={h / 2} />
            </g>
          );
        }),
      )}
    </g>
  );
};

/** Fondo de tela cósmica: manchas grandes de color que flotan y burbujas translúcidas que suben en 3 capas. */
export const FondoBurbujas: React.FC<{
  f: number;
  fondo?: string;
  color?: string;
  vel?: number;
  n?: number;
  semilla?: string;
}> = ({ f, fondo = "#3B1675", color = "#C04BD8", vel = 1, n = 22, semilla = "fb" }) => (
  <g>
    <rect width={W} height={H} fill={fondo} />
    {[0, 1, 2].map((k) => (
      <ellipse
        key={`m${k}`}
        cx={W * (0.2 + k * 0.32) + Math.sin(f / 50 + k) * 60}
        cy={H * (0.75 - k * 0.2) + Math.cos(f / 60 + k) * 40}
        rx={520 - k * 80}
        ry={200 - k * 20}
        fill={k === 1 ? oscurecer(fondo, 0.25) : color}
        opacity={k === 1 ? 0.5 : 0.35}
        transform={`rotate(${-15 + k * 12} ${W * (0.2 + k * 0.32)} ${H * (0.75 - k * 0.2)})`}
      />
    ))}
    {[0.4, 0.8, 1.4].map((v, ci) =>
      Array.from({ length: n }, (_, k) => {
        const r = (6 + random(`${semilla}r${ci}-${k}`) * 16) * (0.6 + ci * 0.5);
        const x = random(`${semilla}x${ci}-${k}`) * W + Math.sin(f / 25 + k) * 12;
        const y = envolver(random(`${semilla}y${ci}-${k}`) * (H + 100) - f * v * vel, H + 100) - 50;
        return (
          <g key={`${ci}-${k}`} opacity={0.25 + ci * 0.18}>
            <circle cx={x} cy={y} r={r} fill={aclarar(color, 0.4)} opacity={0.5} />
            <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.25} fill="#FFFFFF" opacity={0.7} />
          </g>
        );
      }),
    )}
  </g>
);

/**
 * Degradado radial que respira: el centro se mueve en un óvalo, el radio late y los colores van y vienen entre
 * `colores` y `colores2` (si se da). Es el fondo «tranquilo» para personajes y textos grandes.
 */
export const FondoDegradado: React.FC<{
  f: number;
  colores?: [string, string];
  colores2?: [string, string];
  vel?: number;
  periodo?: number;
  id?: string;
}> = ({ f, colores = [C.morado, C.navy], colores2, vel = 1, periodo = 240, id = "fdeg" }) => {
  const t = 0.5 + 0.5 * Math.sin(((f * vel) / periodo) * Math.PI * 2);
  const c0 = colores2 ? interpolateColors(t, [0, 1], [colores[0], colores2[0]]) : colores[0];
  const c1 = colores2 ? interpolateColors(t, [0, 1], [colores[1], colores2[1]]) : colores[1];
  const cx = 50 + 8 * Math.sin((f * vel) / 90);
  const cy = 45 + 6 * Math.cos((f * vel) / 110);
  const r = 70 + 8 * Math.sin((f * vel) / 45);
  return (
    <g>
      <defs>
        <radialGradient id={id} cx={`${cx}%`} cy={`${cy}%`} r={`${r}%`}>
          <stop offset="0%" stopColor={aclarar(c0, 0.18)} />
          <stop offset="55%" stopColor={c0} />
          <stop offset="100%" stopColor={c1} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
    </g>
  );
};
