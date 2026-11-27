// Biblioteca Plano Pop · espacio: planetas, Sol, estrellas, sondas y cohetes
// Piezas COPIADAS de los videos viejos (los originales siguen en su sitio y no se tocan) con props genéricas.
// Todas van dentro de <Lienzo> (1920×1080). f = fotograma local de la escena; s = escala (1 = tamaño base).
// Catálogo con ejemplos: ./CATALOGO.md
import React from "react";
import { random } from "remotion";
import { C } from "../kit";
import { PB as P } from "./paleta";

// del canal original
export const Tierra: React.FC<{
  x: number;
  y: number;
  r?: number;
  f: number;
  luna?: boolean;
}> = ({ x, y, r = 60, f, luna }) => {
  const g = (f / 4) % 360;
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.22} fill={P.azul} opacity={0.2} />
      <circle cx={x} cy={y} r={r} fill={P.azul} />
      <clipPath id={`tierra-${Math.round(x)}-${Math.round(y)}`}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
      <g clipPath={`url(#tierra-${Math.round(x)}-${Math.round(y)})`}>
        {[0, 1].map((k) => {
          const dx = (((g / 360) * 4 * r + k * 2 * r) % (4 * r)) - 2 * r;
          return (
            <g key={k} transform={`translate(${x + dx},${y}) scale(${r / 100})`}>
              <path d="M-70,-60 Q-30,-90 0,-60 Q20,-30 -10,-10 Q-40,10 -60,-20 Z" fill={C.teal2} />
              <path d="M10,10 Q50,0 60,30 Q50,70 20,80 Q0,50 10,10 Z" fill={C.teal2} />
            </g>
          );
        })}
        <path
          d={`M${x - r},${y} A${r},${r} 0 0 0 ${x + r},${y} A${r},${r * 0.7} 0 0 1 ${x - r},${y} Z`}
          fill={P.azul2}
          opacity={0.35}
        />
      </g>
      <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.22} ry={r * 0.12} fill={C.blanco} opacity={0.5} />
      {luna ? <Planeta x={x + r * 1.9} y={y - r * 0.6} r={r * 0.27} tipo="luna" f={f} /> : null}
    </g>
  );
};

// del canal original
export const Mundo: React.FC<{
  cx: number;
  cy: number;
  r: number;
  f: number;
  id: string;
}> = ({ cx, cy, r, f, id }) => {
  const giro = (f * 2.2) % (r * 4);
  const tierras = [
    [-0.6, -0.35, 0.42, 0.3],
    [0.1, 0.25, 0.3, 0.45],
    [0.75, -0.3, 0.5, 0.28],
    [1.4, 0.3, 0.32, 0.25],
    [-1.3, 0.2, 0.36, 0.4],
  ];
  return (
    <g>
      <circle cx={cx + 10} cy={cy + 12} r={r} fill="rgba(18,12,46,0.3)" />
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill={C.teal2} />
      <g clipPath={`url(#${id})`}>
        {[0, 1].map((vuelta) =>
          tierras.map(([lx, ly, rx, ry], k) => {
            const x = cx + lx * r + giro - vuelta * r * 4;
            return <ellipse key={`${vuelta}-${k}`} cx={x} cy={cy + ly * r} rx={rx * r} ry={ry * r} fill="#1F6F6B" />;
          }),
        )}
        <ellipse cx={cx} cy={cy - r * 0.95} rx={r * 0.7} ry={r * 0.16} fill={C.nieve} />
      </g>
      <circle cx={cx - r * 0.35} cy={cy - r * 0.4} r={r * 0.14} fill={C.blanco} opacity={0.25} />
    </g>
  );
};

// del canal original
export const TierraClima: React.FC<{
  x: number;
  y: number;
  r?: number;
  f: number;
  frio?: number;
  norte?: number;
  bruma?: number;
  id?: string;
}> = ({ x, y, r = 300, f, frio = 0, norte = 0, bruma = 0, id = "tc" }) => (
  <g>
    <defs>
      <clipPath id={`${id}-clip`}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
    </defs>
    {bruma > 0.001 ? <circle cx={x} cy={y} r={r + 44 + Math.sin(f / 10) * 4} fill={P.nube2} opacity={0.45 * bruma} /> : null}
    <circle cx={x + 10} cy={y + 14} r={r} fill="rgba(18,12,46,0.4)" />
    <circle cx={x} cy={y} r={r} fill={P.mar} />
    <g clipPath={`url(#${id}-clip)`}>
      {[
        [-0.45, -0.35, 0.42, 0.3],
        [0.3, -0.42, 0.5, 0.26],
        [-0.2, 0.25, 0.26, 0.36],
        [0.42, 0.25, 0.22, 0.2],
        [0.05, -0.05, 0.16, 0.14],
      ].map(([a, b, c, d], k) => (
        <ellipse key={k} cx={x + a * r} cy={y + b * r} rx={c * r} ry={d * r} fill={C.teal2} />
      ))}
      <rect x={x - r} y={y - r} width={2 * r} height={r} fill={C.hielo} opacity={0.6 * norte} />
      <rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill={C.hielo} opacity={0.5 * frio} />
      <rect x={x - r} y={y - 8} width={2 * r} height={16} fill={C.blanco} opacity={0.3 * norte} />
    </g>
  </g>
);

// del canal original
export const PlanetaFrio: React.FC<{
  x: number;
  y: number;
  r: number;
  f: number;
  hielo?: number;
  corrientes?: number;
}> = ({ x, y, r, f, hielo = 0, corrientes = 0 }) => {
  const cap = r * (0.2 + 0.45 * hielo);
  return (
    <g>
      <circle cx={x} cy={y} r={r + 22} fill={C.cielo} opacity={0.18} />
      <circle cx={x} cy={y} r={r} fill={P.agua} />
      <path
        d={`M${x - r * 0.6},${y - r * 0.2} q${r * 0.3},${-r * 0.4} ${r * 0.55},${-r * 0.1} q${r * 0.1},${r * 0.4} ${-r * 0.2},${r * 0.6} q${-r * 0.3},${r * 0.1} ${-r * 0.35},${-r * 0.5} Z`}
        fill={C.teal2}
      />
      <path
        d={`M${x + r * 0.2},${y + r * 0.05} q${r * 0.4},${-r * 0.2} ${r * 0.55},${r * 0.15} q${-r * 0.1},${r * 0.45} ${-r * 0.35},${r * 0.4} Z`}
        fill={C.teal2}
      />
      <ellipse
        cx={x}
        cy={y - r + cap * 0.35}
        rx={Math.sqrt(Math.max(0, r * r - (r - cap * 0.6) ** 2)) + 4}
        ry={cap * 0.6}
        fill={C.nieve}
      />
      <ellipse
        cx={x}
        cy={y + r - cap * 0.35}
        rx={Math.sqrt(Math.max(0, r * r - (r - cap * 0.6) ** 2)) + 4}
        ry={cap * 0.6}
        fill={C.nieve}
      />
      {corrientes > 0.01
        ? [-0.35, 0.35].map((k, j) => {
            const yy = y + k * r;
            const fase = ((f / 40 + j * 0.5) % 1) * 2 - 1;
            return (
              <g key={k} opacity={corrientes}>
                <path
                  d={`M${x - r * 1.3},${yy} Q${x},${yy + (j ? 1 : -1) * r * 0.35} ${x + r * 1.3},${yy}`}
                  stroke={C.blanco}
                  strokeWidth={10}
                  fill="none"
                  strokeDasharray="40 30"
                  strokeDashoffset={-f * 3}
                  strokeLinecap="round"
                />
                <circle cx={x + fase * r * 1.2} cy={yy + (j ? 1 : -1) * r * 0.26 * (1 - fase * fase)} r={12} fill={C.amarillo} />
              </g>
            );
          })
        : null}
    </g>
  );
};

// del canal original
export const Sol: React.FC<{
  x: number;
  y: number;
  r?: number;
  f: number;
  brillo?: number;
}> = ({ x, y, r = 120, f, brillo = 1 }) => (
  <g>
    <circle cx={x} cy={y} r={r * (1.5 + 0.05 * Math.sin(f / 10))} fill={C.amarillo} opacity={0.12 * brillo} />
    <circle cx={x} cy={y} r={r * 1.22} fill={C.amarillo} opacity={0.25 * brillo} />
    <circle cx={x} cy={y} r={r} fill={C.amarillo} />
    <circle cx={x} cy={y} r={r * 0.7} fill={C.crema} opacity={0.5} />
  </g>
);

// del canal original
export const Planeta: React.FC<{
  x: number;
  y: number;
  r: number;
  tipo: "jupiter" | "saturno" | "urano" | "neptuno" | "marte" | "io" | "titan" | "pluton" | "luna";
  f: number;
}> = ({ x, y, r, tipo, f }) => {
  const id = `pl-${tipo}-${Math.round(x)}-${Math.round(y)}`;
  const base: Record<string, string> = {
    jupiter: "#E9A770",
    saturno: "#F1CF86",
    urano: "#A8E6E8",
    neptuno: "#4F7BE0",
    marte: C.rojo,
    io: "#F4D35E",
    titan: C.naranja,
    pluton: "#C9B8A6",
    luna: C.gris,
  };
  const anillo = (frente: boolean) =>
    tipo === "saturno" ? (
      <path
        d={
          frente
            ? `M${x - r * 2.1},${y} A${r * 2.1},${r * 0.55} 0 0 0 ${x + r * 2.1},${y}`
            : `M${x - r * 2.1},${y} A${r * 2.1},${r * 0.55} 0 0 1 ${x + r * 2.1},${y}`
        }
        fill="none"
        stroke="#D9B66A"
        strokeWidth={r * 0.28}
        opacity={0.95}
      />
    ) : tipo === "jupiter" ? (
      <path
        d={
          frente
            ? `M${x - r * 1.7},${y} A${r * 1.7},${r * 0.35} 0 0 0 ${x + r * 1.7},${y}`
            : `M${x - r * 1.7},${y} A${r * 1.7},${r * 0.35} 0 0 1 ${x + r * 1.7},${y}`
        }
        fill="none"
        stroke={C.crema}
        strokeWidth={Math.max(2, r * 0.05)}
        opacity={0.35}
      />
    ) : null;
  return (
    <g>
      {anillo(false)}
      <circle cx={x} cy={y} r={r} fill={base[tipo]} />
      <clipPath id={id}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {tipo === "jupiter" ? (
          <>
            {[-0.55, -0.2, 0.15, 0.5].map((b, k) => (
              <rect
                key={k}
                x={x - r}
                y={y + b * r}
                width={2 * r}
                height={r * 0.16}
                fill={k % 2 ? "#B9714A" : C.crema}
                opacity={0.8}
              />
            ))}
            <ellipse cx={x + r * 0.35} cy={y + r * 0.38} rx={r * 0.2} ry={r * 0.11} fill={C.rojo2} />
          </>
        ) : null}
        {tipo === "saturno" ? (
          <>
            {[-0.4, 0, 0.4].map((b, k) => (
              <rect key={k} x={x - r} y={y + b * r} width={2 * r} height={r * 0.14} fill="#D9A95A" opacity={0.6} />
            ))}
          </>
        ) : null}
        {tipo === "neptuno" || tipo === "urano" ? (
          <rect x={x - r} y={y - r * 0.15} width={2 * r} height={r * 0.18} fill={C.blanco} opacity={0.25} />
        ) : null}
        {tipo === "io" ? (
          <>
            {[
              [-0.4, -0.3],
              [0.3, 0.1],
              [-0.1, 0.5],
              [0.45, -0.45],
            ].map(([a, b], k) => (
              <circle key={k} cx={x + a * r} cy={y + b * r} r={r * 0.14} fill={C.naranja} />
            ))}
          </>
        ) : null}
        {tipo === "luna" || tipo === "pluton" ? (
          <>
            <circle cx={x - r * 0.3} cy={y - r * 0.25} r={r * 0.2} fill={C.gris2} opacity={0.6} />
            <circle cx={x + r * 0.35} cy={y + r * 0.3} r={r * 0.15} fill={C.gris2} opacity={0.6} />
          </>
        ) : null}
        {tipo === "titan" ? <rect x={x - r} y={y - r} width={2 * r} height={r * 0.6} fill={C.crema} opacity={0.3} /> : null}
        <circle cx={x + r * 0.45} cy={y + r * 0.2} r={r} fill={C.negro} opacity={0.18} />
      </g>
      {tipo === "io"
        ? [
            [-0.55, -0.6],
            [0.6, -0.5],
          ].map(([a, b], k) => {
            const t = (f / 22 + k * 0.5) % 1;
            const bx = x + a * r;
            const by = y + b * r;
            return (
              <g key={k}>
                <path
                  d={`M${bx},${by} Q${bx + a * r * 0.4},${by - r * (0.5 + t * 0.5)} ${bx + a * r * 0.8},${by + r * 0.05}`}
                  fill="none"
                  stroke={C.amarillo}
                  strokeWidth={r * 0.08}
                  opacity={1 - t * 0.6}
                />
                <circle cx={bx + a * r * 0.4} cy={by - r * (0.3 + t * 0.5)} r={r * 0.09} fill={C.naranja} opacity={1 - t} />
              </g>
            );
          })
        : null}
      {anillo(true)}
    </g>
  );
};

// del canal original
export const Estrella: React.FC<{
  x: number;
  y: number;
  r?: number;
  f: number;
}> = ({ x, y, r = 40, f }) => {
  const b = 0.85 + 0.15 * Math.sin(f / 7);
  return (
    <g transform={`translate(${x},${y}) scale(${b})`}>
      <circle r={r * 2} fill={C.crema} opacity={0.15} />
      <path
        d={`M0,${-r * 1.6} L${r * 0.3},${-r * 0.3} L${r * 1.6},0 L${r * 0.3},${r * 0.3} L0,${r * 1.6} L${-r * 0.3},${r * 0.3} L${-r * 1.6},0 L${-r * 0.3},${-r * 0.3} Z`}
        fill={C.crema}
      />
      <circle r={r * 0.45} fill={C.blanco} />
    </g>
  );
};

// del canal original
export const Galaxia: React.FC<{
  x: number;
  y: number;
  s: number;
  f: number;
}> = ({ x, y, s, f }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${-20 + f * 0.3})`}>
      <ellipse rx={150} ry={64} fill={C.lila} opacity={0.3} />
      <path d="M0,0 C60,-50 140,-20 150,20" fill="none" stroke={C.lila} strokeWidth={16} strokeLinecap="round" />
      <path d="M0,0 C-60,50 -140,20 -150,-20" fill="none" stroke={C.lila} strokeWidth={16} strokeLinecap="round" />
      <ellipse rx={56} ry={30} fill={C.crema} />
      <circle r={20} fill={C.blanco} />
    </g>
  );

// del canal original
export const Heliosfera: React.FC<{
  cx: number;
  cy: number;
  r: number;
  f: number;
  viento?: number;
  fuera?: number;
}> = ({ cx, cy, r, f, viento = 1, fuera = 0 }) => (
  <g>
    {fuera > 0.01
      ? Array.from({ length: 26 }, (_, k) => {
          const ang = random(`hrc${k}`) * Math.PI * 2;
          const t = (f / 70 + random(`hrt${k}`)) % 1;
          const d = r * (1.75 - t * 0.6);
          const xx = cx + Math.cos(ang) * d;
          const yy = cy + Math.sin(ang) * d * 0.75;
          return (
            <g key={k} opacity={fuera}>
              <line
                x1={xx}
                y1={yy}
                x2={xx + Math.cos(ang) * 40}
                y2={yy + Math.sin(ang) * 30}
                stroke={C.lila}
                strokeWidth={6}
                strokeLinecap="round"
              />
              <circle cx={xx} cy={yy} r={7} fill={C.blanco} />
            </g>
          );
        })
      : null}
    <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.78} fill={C.morado} opacity={0.35} />
    <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.78} fill="none" stroke={C.lila} strokeWidth={7} strokeDasharray="20 16" />
    {Array.from({ length: 16 }, (_, k) => {
      const ang = (k / 16) * Math.PI * 2;
      const t = (f / 45 + (k % 4) * 0.25) % 1;
      const d0 = r * (0.18 + t * 0.66);
      const xx = cx + Math.cos(ang) * d0;
      const yy = cy + Math.sin(ang) * d0 * 0.78;
      const deg = (Math.atan2(Math.sin(ang) * 0.78, Math.cos(ang)) * 180) / Math.PI;
      return (
        <g key={k} transform={`translate(${xx},${yy}) rotate(${deg})`} opacity={viento * (1 - t * 0.7)}>
          <rect x={-22} y={-4} width={36} height={8} rx={4} fill={C.amarillo} />
          <path d="M14,-12 L30,0 L14,12 Z" fill={C.amarillo} />
        </g>
      );
    })}
    <Sol x={cx} y={cy} r={r * 0.12} f={f} />
  </g>
);

// del canal original
export const Asteroide: React.FC<{
  x: number;
  y: number;
  r?: number;
  f: number;
}> = ({ x, y, r = 150, f }) => {
  const pts = Array.from({ length: 16 }, (_, k) => {
    const a = (k / 16) * Math.PI * 2;
    const q = r * (0.85 + 0.2 * random(`as${k}`));
    return `${(Math.cos(a) * q).toFixed(1)},${(Math.sin(a) * q).toFixed(1)}`;
  }).join(" ");
  return (
    <g transform={`translate(${x},${y})`}>
      {[0, 1, 2].map((k) => (
        <rect
          key={k}
          x={r * 0.3}
          y={-r * 0.5 + k * r * 0.4}
          width={r * 2.2}
          height={14}
          rx={7}
          fill={C.naranja}
          opacity={0.5 - k * 0.12}
          transform={`rotate(-30)`}
        />
      ))}
      <g transform={`rotate(${f * 0.6})`}>
        <polygon points={pts} fill={C.gris2} />
        <circle cx={-r * 0.3} cy={-r * 0.2} r={r * 0.2} fill={C.gris} />
        <circle cx={r * 0.35} cy={r * 0.25} r={r * 0.14} fill={C.gris} />
        <circle cx={r * 0.1} cy={-r * 0.5} r={r * 0.09} fill={C.gris} />
      </g>
    </g>
  );
};

// del canal original (Voyager)
export const Sonda: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  rot?: number;
  flip?: boolean;
  gemela?: boolean;
  senal?: number;
}> = ({ x, y, s = 1, f, rot = 0, flip, gemela, senal = 0 }) => {
  const acento = gemela ? C.teal : P.oro;
  const acento2 = gemela ? C.teal2 : P.oro2;
  const flota = Math.sin(f / 24) * 6;
  return (
    <g transform={`translate(${x},${y + flota}) rotate(${rot}) scale(${flip ? -s : s},${s})`}>
      {/* anillos de señal */}
      {senal > 0.01
        ? [0, 1, 2].map((k) => {
            const t = (f / 40 + k / 3) % 1;
            return (
              <path
                key={k}
                d={`M${-150 - t * 160},${-120 - t * 60} Q${-210 - t * 200},0 ${-150 - t * 160},${120 + t * 60}`}
                fill="none"
                stroke={C.amarillo}
                strokeWidth={10}
                strokeLinecap="round"
                opacity={senal * (1 - t)}
              />
            );
          })
        : null}
      {/* magnetómetro: brazo largo */}
      <line x1={60} y1={-20} x2={470} y2={-110} stroke={C.gris} strokeWidth={7} strokeLinecap="round" />
      <rect x={455} y={-124} width={30} height={30} rx={6} fill={C.blanco} />
      {/* antenas de ondas de plasma */}
      <line x1={70} y1={40} x2={330} y2={170} stroke={C.gris} strokeWidth={4} strokeLinecap="round" />
      <line x1={70} y1={40} x2={300} y2={210} stroke={C.gris} strokeWidth={4} strokeLinecap="round" />
      {/* brazo de los RTG */}
      <line x1={50} y1={50} x2={190} y2={150} stroke={C.gris2} strokeWidth={10} strokeLinecap="round" />
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${100 + k * 44},${86 + k * 32}) rotate(36)`}>
          <rect x={-30} y={-16} width={60} height={32} rx={8} fill={C.gris2} />
          {[-18, -6, 6, 18].map((d) => (
            <rect key={d} x={d - 3} y={-26} width={6} height={52} rx={3} fill={C.gris} />
          ))}
          <circle cx={0} cy={0} r={8} fill={C.naranja} opacity={0.8 + 0.2 * Math.sin(f / 8 + k)} />
        </g>
      ))}
      {/* brazo de ciencia con la plataforma */}
      <line x1={60} y1={-40} x2={200} y2={-170} stroke={C.gris2} strokeWidth={10} strokeLinecap="round" />
      <rect x={180} y={-214} width={74} height={58} rx={10} fill={C.navy2} />
      <rect x={244} y={-200} width={34} height={30} rx={6} fill={C.blanco} />
      <circle cx={268} cy={-185} r={9} fill={C.teal} />
      {/* cuerpo (decágono) */}
      <path d="M0,-70 L70,-70 L100,-36 L100,36 L70,70 L0,70 L-20,36 L-20,-36 Z" fill={acento} />
      <path d="M0,-70 L70,-70 L100,-36 L-20,-36 Z" fill={acento2} />
      <rect x={10} y={-20} width={70} height={40} rx={6} fill={acento2} opacity={0.6} />
      {/* plato */}
      <ellipse cx={-60} cy={0} rx={46} ry={180} fill={C.blanco} />
      <ellipse cx={-70} cy={0} rx={30} ry={158} fill={C.hielo} />
      <line x1={-74} y1={-140} x2={-150} y2={0} stroke={C.gris} strokeWidth={5} />
      <line x1={-74} y1={140} x2={-150} y2={0} stroke={C.gris} strokeWidth={5} />
      <circle cx={-150} cy={0} r={13} fill={C.blanco} />
    </g>
  );
};

// del canal original
export const Cohete: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  fuego?: number;
  sube?: number;
}> = ({ x, y, s = 1, f, fuego = 0, sube = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {/* torre de servicio */}
    <rect x={-300} y={-860} width={70} height={860} fill={C.rojo2} />
    {Array.from({ length: 12 }, (_, k) => (
      <rect key={k} x={-300} y={-840 + k * 70} width={70} height={10} fill={C.rojo} />
    ))}
    <rect x={-260} y={-30} width={520} height={30} rx={6} fill={C.gris2} />
    <g transform={`translate(0,${-sube})`}>
      {fuego > 0.01 ? (
        <g opacity={fuego}>
          {[-110, 110].map((dx, k) => (
            <g key={k}>
              <path d={`M${dx - 40},-40 Q${dx},${200 + Math.sin(f / 2 + k) * 30} ${dx + 40},-40 Z`} fill={C.naranja} />
              <path d={`M${dx - 22},-40 Q${dx},${120 + Math.sin(f / 2 + k + 1) * 20} ${dx + 22},-40 Z`} fill={C.amarillo} />
            </g>
          ))}
          {Array.from({ length: 10 }, (_, k) => (
            <circle
              key={k}
              cx={(random(`hu${k}`) - 0.5) * 600}
              cy={10 + random(`hv${k}`) * 40}
              r={50 + random(`hr${k}`) * 50}
              fill={C.crema}
              opacity={0.7}
            />
          ))}
        </g>
      ) : null}
      {/* cuerpos laterales */}
      {[-110, 110].map((dx) => (
        <g key={dx}>
          <rect x={dx - 42} y={-560} width={84} height={520} rx={10} fill={C.blanco} />
          <path d={`M${dx - 42},-560 L${dx},-640 L${dx + 42},-560 Z`} fill={C.blanco} />
          <rect x={dx - 42} y={-200} width={84} height={30} fill={C.gris} />
          <path d={`M${dx - 34},-40 L${dx + 34},-40 L${dx + 44},0 L${dx - 44},0 Z`} fill={C.gris2} />
        </g>
      ))}
      {/* cuerpo central */}
      <rect x={-56} y={-820} width={112} height={790} rx={10} fill={C.crema} />
      <rect x={-56} y={-640} width={112} height={26} fill={C.naranja} />
      <rect x={-56} y={-380} width={112} height={26} fill={C.naranja} />
      <path d="M-56,-820 L-56,-880 Q0,-980 56,-880 L56,-820 Z" fill={C.blanco} />
    </g>
  </g>
);

// del canal original (Cohete)
export const CoheteSimple: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  color?: string;
}> = ({ x, y, s = 1, f, color = C.rojo }) => {
  const llama = 90 + Math.sin(f * 1.3) * 18 + Math.sin(f * 2.7) * 8;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M-42,-6 Q0,${llama + 50} 42,-6 Z`} fill={C.naranja} />
      <path d={`M-22,-6 Q0,${llama * 0.6 + 24} 22,-6 Z`} fill={C.amarillo} />
      <path d="M-58,-160 L-120,-40 L-120,20 L-58,-20 Z" fill={color} />
      <path d="M58,-160 L120,-40 L120,20 L58,-20 Z" fill={color} />
      <rect x={-60} y={-340} width={120} height={340} rx={30} fill={C.blanco} />
      <path d="M-60,-320 Q-60,-420 0,-480 Q60,-420 60,-320 Z" fill={color} />
      <rect x={-60} y={-130} width={120} height={36} fill={color} />
      <circle cx={0} cy={-240} r={32} fill={C.navy2} />
      <circle cx={0} cy={-240} r={20} fill={C.cielo} />
      <rect x={-18} y={-14} width={36} height={22} rx={6} fill={C.gris} />
    </g>
  );
};
