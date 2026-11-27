// Kit del estilo Plano Pop: las piezas básicas del estilo (paleta, texto, persona, utilidades),
// copiadas del primer video del canal original y exportadas para que los capítulos nuevos se vean iguales.
// Se pueden añadir piezas nuevas al final.
import React from "react";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame } from "remotion";

export const { fontFamily } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });

export const FPS_INF = 30;
export const W = 1920;
export const H = 1080;
export const ADELANTO = 4; // la escena corta 4 fotogramas antes de su palabra

export const C = {
  navy: "#1B1443",
  navy2: "#2A1F5E",
  negro: "#120C2E",
  morado: "#5B3FA8",
  lila: "#9C84E6",
  teal: "#7FE0D0",
  teal2: "#2FA99A",
  rojo: "#E5482F",
  rojo2: "#B8321F",
  naranja: "#F2823A",
  amarillo: "#FFC93C",
  crema: "#FFF4DC",
  blanco: "#FFFFFF",
  piel: "#F7B79A",
  piel2: "#EC9C82",
  nieve: "#F4FBFF",
  hielo: "#CFEAF3",
  cielo: "#BDE6F1",
  gris: "#9AA3B5",
  gris2: "#6C7488",
};

// ---------- utilidades ----------
export const fijo = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const pop = (f: number, en: number) =>
  f < en ? 0 : spring({ frame: f - en, fps: FPS_INF, config: { damping: 10, stiffness: 170, mass: 0.7 } });
export const suave = (f: number, a: number, b: number) =>
  interpolate(f, [a, Math.max(a + 1, b)], [0, 1], { ...fijo, easing: Easing.inOut(Easing.cubic) });
export const sale = (f: number, a: number, b: number) =>
  interpolate(f, [a, Math.max(a + 1, b)], [0, 1], { ...fijo, easing: Easing.out(Easing.cubic) });
export const en = (cx: number, cy: number, s: number, rot = 0) =>
  `translate(${cx},${cy}) rotate(${rot}) scale(${s}) translate(${-cx},${-cy})`;
export const miles = (n: number) => Math.round(n).toLocaleString("en-US");

export type EscenaProps = { w: (i: number) => number; dur: number };

export const Lienzo: React.FC<{ children: React.ReactNode; fondo?: string }> = ({ children, fondo }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", backgroundColor: fondo }}>
    {children}
  </svg>
);

export const T: React.FC<{
  x: number;
  y: number;
  size: number;
  children: React.ReactNode;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  weight?: number;
  ls?: number;
  borde?: string;
  opacity?: number;
}> = ({ x, y, size, children, fill = C.blanco, anchor = "middle", weight = 900, ls = 0, borde, opacity }) => (
  <text
    x={x}
    y={y}
    fontFamily={fontFamily}
    fontWeight={weight}
    fontSize={size}
    fill={fill}
    textAnchor={anchor}
    letterSpacing={ls}
    opacity={opacity}
    stroke={borde}
    strokeWidth={borde ? size * 0.14 : 0}
    strokeLinejoin="round"
    paintOrder="stroke"
  >
    {children}
  </text>
);

// Etiqueta blanca con sombra, como las de ubicación y dato
export const Chip: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  s?: number;
  fondo?: string;
  rot?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h = 86, s = 1, fondo = C.blanco, rot = 0, children }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x + w / 2},${y + h / 2}) rotate(${rot}) scale(${s}) translate(${-w / 2},${-h / 2})`}>
      <rect x={7} y={9} width={w} height={h} rx={16} fill="rgba(18,12,46,0.28)" />
      <rect width={w} height={h} rx={16} fill={fondo} />
      {children}
    </g>
  );

export const Pin: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M0,30 C-22,2 -24,-8 -24,-14 A24,24 0 1 1 24,-14 C24,-8 22,2 0,30 Z" fill={C.rojo} />
    <circle cx={0} cy={-14} r={9} fill={C.blanco} />
  </g>
);

export const Equis: React.FC<{ x: number; y: number; s: number; t?: number }> = ({ x, y, s, t = 150 }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(-6)`}>
      {[45, -45].map((r) => (
        <rect key={r} x={-t} y={-26} width={t * 2} height={52} rx={14} fill={C.blanco} transform={`rotate(${r})`} />
      ))}
      {[45, -45].map((r) => (
        <rect key={r} x={-t + 10} y={-17} width={t * 2 - 20} height={34} rx={9} fill={C.rojo} transform={`rotate(${r})`} />
      ))}
    </g>
  );

// Personaje plano: cabeza grande, sin bordes, abrigo y gorro de piel
export const Persona: React.FC<{
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  f: number;
  abrigo: string;
  abrigo2: string;
  cara?: "normal" | "susto" | "duda";
  lentes?: boolean;
  barba?: boolean;
  brazo?: number;
  fase?: number;
}> = ({ x, y, s = 1, flip, f, abrigo, abrigo2, cara = "normal", lentes, barba, brazo = 0, fase = 0 }) => {
  const parpadeo = (f + fase * 13) % 78 < 4 ? 0.12 : 1;
  const sube = Math.sin((f + fase * 20) / 9) * 3;
  const Brazo = ({ bx, rot }: { bx: number; rot: number }) => (
    <g transform={`translate(${bx},-228) rotate(${rot})`}>
      <rect x={-21} y={-8} width={42} height={128} rx={21} fill={abrigo2} />
      <circle cx={0} cy={124} r={24} fill={C.navy} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={4} rx={100} ry={16} fill="rgba(27,20,67,0.16)" />
      <rect x={-50} y={-100} width={40} height={94} rx={12} fill={C.navy2} />
      <rect x={10} y={-100} width={40} height={94} rx={12} fill={C.navy2} />
      <rect x={-62} y={-24} width={58} height={26} rx={11} fill={C.navy} />
      <rect x={6} y={-24} width={58} height={26} rx={11} fill={C.navy} />
      <g transform={`translate(0,${sube})`}>
        <Brazo bx={-64} rot={14} />
        <path d="M-80,-86 Q-92,-244 -42,-266 L42,-266 Q92,-244 80,-86 Q0,-68 -80,-86 Z" fill={abrigo} />
        <rect x={-5} y={-252} width={10} height={170} fill={abrigo2} />
        <path d="M-80,-86 Q0,-68 80,-86 L80,-104 Q0,-88 -80,-104 Z" fill={abrigo2} />
        <Brazo bx={64} rot={-14 - brazo} />
        <ellipse cx={0} cy={-262} rx={66} ry={26} fill={C.crema} />
        <circle cx={0} cy={-330} r={70} fill={C.piel} />
        {barba ? (
          <path d="M-62,-312 Q-56,-250 0,-250 Q56,-250 62,-312 Q32,-284 0,-286 Q-32,-284 -62,-312 Z" fill="#7A4A32" />
        ) : null}
        <path d="M-74,-342 Q-74,-414 0,-414 Q74,-414 74,-342 Z" fill="#6B3F2E" />
        <rect x={-84} y={-350} width={30} height={78} rx={15} fill="#6B3F2E" />
        <rect x={54} y={-350} width={30} height={78} rx={15} fill="#6B3F2E" />
        <rect x={-80} y={-362} width={160} height={32} rx={16} fill="#8A5A44" />
        <circle cx={-42} cy={-296} r={11} fill={C.piel2} opacity={0.75} />
        <circle cx={42} cy={-296} r={11} fill={C.piel2} opacity={0.75} />
        <g transform={`translate(0,-314) scale(1,${cara === "susto" ? 1 : parpadeo})`}>
          <circle cx={-24} cy={0} r={cara === "susto" ? 11 : 8} fill={C.navy} />
          <circle cx={24} cy={0} r={cara === "susto" ? 11 : 8} fill={C.navy} />
        </g>
        {lentes ? (
          <g fill="none" stroke={C.navy} strokeWidth={6}>
            <circle cx={-24} cy={-314} r={20} />
            <circle cx={24} cy={-314} r={20} />
            <path d="M-4,-314 L4,-314" />
          </g>
        ) : null}
        {cara === "normal" ? (
          <path d="M-16,-288 Q0,-274 16,-288" stroke={C.navy} strokeWidth={6} fill="none" strokeLinecap="round" />
        ) : cara === "susto" ? (
          <ellipse cx={0} cy={-282} rx={13} ry={17} fill="#7A2B2B" />
        ) : (
          <path d="M-12,-284 L15,-288" stroke={C.navy} strokeWidth={6} fill="none" strokeLinecap="round" />
        )}
      </g>
    </g>
  );
};

// Torre de perforación
export const Torre: React.FC<{ x: number; y: number; s?: number; f: number; activa?: boolean }> = ({ x, y, s = 1, f, activa }) => {
  const bloque = activa ? -470 + (Math.sin(f / 5) * 0.5 + 0.5) * 300 : -470;
  const niveles = [0, 1, 2, 3, 4];
  const ancho = (k: number) => 72 - k * 10; // medio ancho en cada nivel
  const alto = (k: number) => -112 - k * 90;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={230} ry={22} fill="rgba(27,20,67,0.14)" />
      <rect x={-7} y={-545} width={14} height={440} fill={C.gris} />
      <rect x={-22} y={bloque} width={44} height={50} rx={8} fill={C.amarillo} />
      <g stroke={C.navy2} strokeWidth={13} strokeLinecap="round" fill="none">
        <path d="M-72,-112 L-22,-562 M72,-112 L22,-562" />
        {niveles.map((k) => (
          <path
            key={k}
            d={`M${-ancho(k)},${alto(k)} L${ancho(k + 1)},${alto(k + 1)} M${ancho(k)},${alto(k)} L${-ancho(k + 1)},${alto(k + 1)} M${-ancho(k + 1)},${alto(k + 1)} L${ancho(k + 1)},${alto(k + 1)}`}
            strokeWidth={9}
          />
        ))}
      </g>
      <rect x={-36} y={-596} width={72} height={38} rx={8} fill={C.rojo} />
      <rect x={-3} y={-650} width={6} height={56} fill={C.navy2} />
      <path d={`M3,-650 L${50 + Math.sin(f / 6) * 4},-638 L3,-622 Z`} fill={C.rojo} />
      <rect x={-190} y={-116} width={380} height={116} rx={10} fill={C.rojo2} />
      <rect x={-204} y={-136} width={408} height={30} rx={8} fill={C.nieve} />
      <rect x={-150} y={-78} width={70} height={52} rx={6} fill={C.amarillo} />
      <rect x={-40} y={-78} width={70} height={52} rx={6} fill={C.amarillo} />
      <rect x={90} y={-84} width={62} height={84} rx={6} fill={C.navy2} />
    </g>
  );
};

export const Pino: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-9} y={-30} width={18} height={34} fill="#5A3A2E" />
    <path d="M0,-250 L62,-120 L-62,-120 Z M0,-180 L80,-30 L-80,-30 Z" fill="#1F6F6B" />
    <path d="M0,-250 L26,-196 Q0,-184 -26,-196 Z" fill={C.nieve} />
    <path d="M-52,-140 Q-20,-128 0,-140 Q24,-126 52,-140 L62,-120 L-62,-120 Z" fill={C.nieve} opacity={0.9} />
  </g>
);

export const Nieve: React.FC<{ f: number; n?: number }> = ({ f, n = 70 }) => (
  <g fill={C.blanco}>
    {Array.from({ length: n }, (_, k) => {
      const vel = 2 + random(`v${k}`) * 3;
      const y = (random(`y${k}`) * H + f * vel) % H;
      const x = random(`x${k}`) * W + Math.sin((f + k * 9) / 22) * 16;
      return <circle key={k} cx={x} cy={y} r={3 + random(`r${k}`) * 5} opacity={0.75} />;
    })}
  </g>
);

// ---------- 5 y 6. El corte de la Tierra, bajando ----------
export const K_PIE = 3600 / 40230; // píxeles por pie
export const SUP = 330; // altura de la superficie en el mundo
export const CAPAS: [number, string][] = [
  [0, "#8B5E3C"],
  [2500, "#7B4F3B"],
  [8000, "#6C4441"],
  [15000, "#5E3B4B"],
  [22000, "#523454"],
  [29000, "#472C5A"],
  [35000, "#4E2750"],
  [38500, "#63243F"],
];
// ---------- 8. Termómetros ----------
export const Termometro: React.FC<{ x: number; nivel: number; color: string; tiembla?: number }> = ({ x, nivel, color, tiembla = 0 }) => {
  const alto = 500 * Math.min(1.02, nivel);
  return (
    <g transform={`translate(${x + tiembla},0)`}>
      <rect x={-52} y={196} width={120} height={600} rx={56} fill="rgba(18,12,46,0.4)" />
      <circle cx={8} cy={838} r={104} fill="rgba(18,12,46,0.4)" />
      <rect x={-60} y={188} width={120} height={600} rx={60} fill={C.blanco} />
      <circle cx={0} cy={830} r={104} fill={C.blanco} />
      <circle cx={0} cy={830} r={78} fill={color} />
      <rect x={-34} y={760 - alto} width={68} height={alto + 30} rx={30} fill={color} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
        <rect key={k} x={74} y={716 - k * 62} width={k % 2 ? 26 : 44} height={8} rx={4} fill={C.blanco} opacity={0.7} />
      ))}
    </g>
  );
};
// ---------- 10 y 11. 19 años y la Tierra ----------
export const Estrellas: React.FC<{ f: number }> = ({ f }) => (
  <g fill={C.blanco}>
    {Array.from({ length: 90 }, (_, k) => (
      <circle key={k} cx={random(`ex${k}`) * W} cy={random(`ey${k}`) * H} r={1.5 + random(`er${k}`) * 3} opacity={0.35 + 0.35 * Math.sin(f / 9 + k)} />
    ))}
  </g>
);
export const TX = 700;
export const TY = 560;
export const TR = 390;
export const Globo: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <circle cx={TX} cy={TY} r={TR + 26} fill="#7CC3F5" opacity={0.18} />
    <circle cx={TX} cy={TY} r={TR} fill="#6B4A3A" />
    <circle cx={TX} cy={TY} r={TR - 12} fill={C.rojo} />
    <circle cx={TX} cy={TY} r={TR - 70} fill={C.naranja} />
    <circle cx={TX} cy={TY} r={215} fill={C.amarillo} />
    <circle cx={TX} cy={TY} r={96 + Math.sin(f / 7) * 5} fill={C.crema} />
  </g>
);
export const Marco: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const entra = interpolate(f, [0, 9], [1.1, 1], { ...fijo, easing: Easing.out(Easing.cubic) });
  const lento = interpolate(f, [0, dur], [1, 1.05]);
  return <AbsoluteFill style={{ transform: `scale(${entra * lento})`, overflow: "hidden" }}>{children}</AbsoluteFill>;
};


// ---------- piezas nuevas (no están en el original) ----------
/** Altura en el «mundo» del corte para una profundidad en pies. */
export const yDePie = (pie: number) => SUP + pie * K_PIE;

/**
 * El corte del suelo del video original, reutilizable: cielo, capas, piedras, nieve, la torre, el pozo y la
 * broca a la profundidad `d` (en pies, 0–40.230). La cámara sigue a la broca. Va dentro de un
 * <Lienzo fondo={C.cielo}>. Los `children` se dibujan en coordenadas del mundo (usa `yDePie`), por ejemplo
 * marcas o hallazgos a cierta profundidad; lo que deba quedar fijo en pantalla va fuera de CorteBase.
 */
export const CorteBase: React.FC<{ d: number; f: number; camaraY?: number; zoom?: number; children?: React.ReactNode }> = ({
  d,
  f,
  camaraY = 610,
  zoom = 1,
  children,
}) => {
  const yBroca = SUP + d * K_PIE;
  const cam = Math.max(0, yBroca - camaraY);
  return (
    <g transform={`translate(640,${camaraY}) scale(${zoom}) translate(-640,${-camaraY - cam})`}>
      <circle cx={300} cy={150} r={70} fill={C.crema} />
      <path d="M0,300 L200,180 L420,300 L700,200 L980,300 L1300,210 L1920,300 L1920,340 L0,340 Z" fill="#9CCFE0" />
      {CAPAS.map(([pie, color]) => (
        <rect key={pie} x={-600} y={SUP + pie * K_PIE} width={W + 1200} height={4600 - pie * K_PIE} fill={color} />
      ))}
      {Array.from({ length: 150 }, (_, k) => {
        const claro = random(`pc${k}`) > 0.5;
        return (
          <ellipse
            key={k}
            cx={random(`px${k}`) * W}
            cy={SUP + 40 + random(`py${k}`) * 3900}
            rx={14 + random(`pr${k}`) * 46}
            ry={8 + random(`ps${k}`) * 18}
            fill={claro ? C.blanco : C.negro}
            opacity={claro ? 0.07 : 0.16}
          />
        );
      })}
      <path d={`M-600,${SUP - 34} Q480,${SUP - 58} 960,${SUP - 36} T2520,${SUP - 40} L2520,${SUP + 16} L-600,${SUP + 16} Z`} fill={C.nieve} />
      <Torre x={640} y={SUP - 30} s={0.5} f={f} activa />
      {[5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000].map((p) => (
        <g key={p} opacity={0.5}>
          <rect x={668} y={SUP + p * K_PIE - 2} width={46} height={5} fill={C.blanco} />
          <T x={730} y={SUP + p * K_PIE + 13} size={34} anchor="start" weight={700}>
            {miles(p)} ft
          </T>
        </g>
      ))}
      {children}
      <rect x={625} y={SUP - 20} width={30} height={yBroca - SUP + 20} fill={C.negro} />
      <rect x={635} y={SUP - 40} width={10} height={yBroca - SUP + 30} fill={C.gris} />
      <g transform={`translate(${640 + Math.sin(f * 1.9) * 1.5},${yBroca})`}>
        <path d="M-24,-34 L24,-34 L30,4 L0,40 L-30,4 Z" fill={C.amarillo} />
        <path d="M-30,4 L30,4 L0,40 Z" fill="#D9A21F" />
      </g>
    </g>
  );
};

/** Panel fijo de profundidad del video original (arriba a la derecha). */
export const PanelProfundidad: React.FC<{ d: number; resaltado?: boolean; y?: number }> = ({ d, resaltado, y = 0 }) => (
  <g transform={`translate(0,${y})`}>
    <rect x={1338} y={108} width={520} height={372} rx={30} fill="rgba(18,12,46,0.35)" />
    <rect x={1330} y={100} width={520} height={372} rx={30} fill={C.navy} />
    <rect x={1330} y={100} width={520} height={86} rx={30} fill={C.morado} />
    <rect x={1330} y={150} width={520} height={36} fill={C.morado} />
    <T x={1590} y={160} size={44} ls={6}>
      DEPTH
    </T>
    <T x={1590} y={348} size={132} fill={resaltado ? C.amarillo : C.blanco}>
      {miles(d)}
    </T>
    <T x={1590} y={432} size={50} fill={C.teal} ls={8}>
      FEET
    </T>
  </g>
);
