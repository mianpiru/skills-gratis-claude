// Biblioteca Plano Pop · animales (el tiburón es un solo componente con especies, como pide la regla del personaje)
// Piezas COPIADAS de los videos viejos (los originales siguen en su sitio y no se tocan) con props genéricas.
// Todas van dentro de <Lienzo> (1920×1080). f = fotograma local de la escena; s = escala (1 = tamaño base).
// Catálogo con ejemplos: ./CATALOGO.md
import React from "react";
import { random } from "remotion";
import { C } from "../kit";
import { PB as P } from "./paleta";

// del canal original
export type Especie = "megalodon" | "blanco" | "mako" | "chubutensis";

// del canal original (Cara)
export type CaraAnimal = "normal" | "feroz" | "susto" | "triste" | "duda" | "feliz" | "dormido";

// del canal original
export const LARGO_TIB = 1060;

// del canal original
export const COLA_TIB = 560;

// del canal original
export const sDeLargo = (px: number) => px / LARGO_TIB;

// del canal original
const FORMA: Record<
  Especie,
  {
    dt: number;
    db: number;
    nariz: number;
    aleta: number;
    diente: number;
    c1: string;
    c2: string;
    panza: string;
  }
> = {
  megalodon: {
    dt: 150,
    db: 138,
    nariz: 1,
    aleta: 1,
    diente: 30,
    c1: "#4D566B",
    c2: "#363D4F",
    panza: "#C8CEDA",
  },
  blanco: {
    dt: 116,
    db: 102,
    nariz: 0,
    aleta: 1.18,
    diente: 19,
    c1: "#7EA6CF",
    c2: "#55799F",
    panza: "#F4FBFF",
  },
  mako: {
    dt: 92,
    db: 80,
    nariz: 0.1,
    aleta: 1,
    diente: 15,
    c1: "#3E7FC4",
    c2: "#2B5E98",
    panza: "#E8F1FA",
  },
  chubutensis: {
    dt: 138,
    db: 126,
    nariz: 0.8,
    aleta: 0.95,
    diente: 26,
    c1: "#7A6A9E",
    c2: "#5A4B7E",
    panza: "#DCD3EC",
  },
};

// del canal original
const rotar = (px: number, py: number, cx: number, cy: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  const dx = px - cx;
  const dy = py - cy;
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
};

// del canal original
const filaDientes = (a: [number, number], b: [number, number], tam: number, lado: 1 | -1, color: string) => {
  const lx = b[0] - a[0];
  const ly = b[1] - a[1];
  const largo = Math.hypot(lx, ly);
  const dx = lx / largo;
  const dy = ly / largo;
  const nx = -dy * lado;
  const ny = dx * lado;
  const n = Math.max(3, Math.floor((largo * 0.82) / (tam * 0.95)));
  return Array.from({ length: n }, (_, k) => {
    const t = 0.14 + (k / Math.max(1, n - 1)) * 0.8;
    const bx = a[0] + lx * t;
    const by = a[1] + ly * t;
    const m = tam * (0.75 + 0.25 * Math.sin(t * Math.PI));
    const hw = m * 0.46;
    return (
      <path
        key={k}
        d={`M${(bx - dx * hw).toFixed(1)},${(by - dy * hw).toFixed(1)} L${(bx + nx * m).toFixed(1)},${(by + ny * m).toFixed(1)} L${(bx + dx * hw).toFixed(1)},${(by + dy * hw).toFixed(1)} Z`}
        fill={color}
      />
    );
  });
};

// del canal original
export type TiburonProps = {
  x: number;
  y: number;
  f: number;
  especie?: Especie;
  s?: number;
  flip?: boolean;
  rot?: number;
  cara?: CaraAnimal;
  boca?: number;
  nado?: number;
  esbelto?: number;
  punteado?: boolean;
  fondo?: string;
  alpha?: number;
  cria?: boolean;
  calor?: number;
};

// del canal original
export const Tiburon: React.FC<TiburonProps> = ({
  x,
  y,
  f,
  especie = "megalodon",
  s = 1,
  flip,
  rot = 0,
  cara = "normal",
  boca = 0,
  nado = 1,
  esbelto = 0,
  punteado,
  fondo = P.agua,
  alpha = 1,
  cria,
  calor = 0,
}) => {
  if (alpha <= 0.001 || s <= 0.001) return null;
  const F = FORMA[especie];
  const { dt, db, aleta } = F;
  const n = cria ? 1 : F.nariz;
  const ky = 1 - 0.3 * esbelto;
  const sw = Math.min(14, 7 / s);
  const cola = Math.sin(f / 5) * 7 * nado;
  const pect = Math.sin(f / 7 + 1) * 4 * nado;
  const h = dt * 1.1 * aleta;

  const cuerpo = `M500,-8 C${490 - (1 - n) * 40},${-dt * (0.45 + 0.35 * n)} 340,${-dt} 170,${-dt} C-30,${-dt} -230,${-dt * 0.55} -400,-24 L-400,22 C-230,${db * 0.6} -30,${db} 170,${db} C340,${db} ${470 - (1 - n) * 30},${db * 0.55} 500,-8 Z`;
  const panza = `M498,2 C${468 - (1 - n) * 30},${db * 0.5} 340,${db * 0.97} 170,${db * 0.97} C-30,${db * 0.97} -230,${db * 0.58} -398,20 L-398,12 C-220,${db * 0.28} -20,${db * 0.44} 170,${db * 0.44} C330,${db * 0.44} 440,${db * 0.22} 498,2 Z`;
  const dorsal = `M100,${-dt * 0.97} Q20,${-dt - h * 0.55} -40,${-dt - h} Q-62,${-dt - h * 0.45} -140,${-dt * 0.9} Z`;
  const caudal = `M-392,-22 Q-470,${-dt * 0.9} -560,${-dt * 1.75} Q-526,${-dt * 0.6} -505,0 Q-526,${db * 0.6} -548,${db * 1.4} Q-462,${db * 0.8} -392,22 Z`;
  const pectoral = `M300,${db * 0.62} Q160,${db * 1.15} 70,${db * 1.6} Q170,${db * 1.3} 196,${db * 0.7} Z`;
  const dorsal2 = `M-258,${-dt * 0.6} L-300,${-dt * 0.95} L-318,${-dt * 0.52} Z`;
  const anal = `M-222,${db * 0.6} L-284,${db * 0.98} L-292,${db * 0.52} Z`;

  const Parte = ({ d, color, delante }: { d: string; color: string; delante?: boolean }) =>
    punteado ? (
      <path
        d={d}
        fill={fondo}
        fillOpacity={delante ? 0.85 : 1}
        stroke={C.blanco}
        strokeWidth={sw}
        strokeDasharray={`${sw * 3.6} ${sw * 2.4}`}
        strokeLinejoin="round"
      />
    ) : (
      <path d={d} fill={color} />
    );

  const ex = 372;
  const ey = -dt * 0.32;
  const er = (cria ? 27 : 18) * (especie === "megalodon" ? 1 : 0.9);
  const parpadeo = (f + x * 0.37) % 84 < 4 ? 0.12 : 1;

  const H: [number, number] = [300, db * 0.36];
  const U: [number, number] = [480, db * 0.1];
  const U2 = rotar(U[0], U[1], H[0], H[1], boca * 26);

  const ojo = () => {
    const brow = (x1: number, y1: number, x2: number, y2: number) => (
      <path d={`M${ex + x1},${ey + y1} L${ex + x2},${ey + y2}`} stroke={F.c2} strokeWidth={er * 0.62} strokeLinecap="round" />
    );
    const tinta = punteado ? C.blanco : C.navy;
    if (cara === "feliz")
      return (
        <g>
          <path
            d={`M${ex - er},${ey + 4} Q${ex},${ey - er * 1.5} ${ex + er},${ey + 4}`}
            stroke={tinta}
            strokeWidth={er * 0.5}
            fill="none"
            strokeLinecap="round"
          />
          {!punteado ? <circle cx={ex + 30} cy={ey + er * 1.8} r={er * 0.9} fill={C.rojo} opacity={0.3} /> : null}
        </g>
      );
    if (cara === "dormido")
      return (
        <path
          d={`M${ex - er},${ey} Q${ex},${ey + er * 0.9} ${ex + er},${ey}`}
          stroke={tinta}
          strokeWidth={er * 0.45}
          fill="none"
          strokeLinecap="round"
        />
      );
    if (cara === "susto")
      return (
        <g>
          <circle cx={ex} cy={ey} r={er * 1.45} fill={C.blanco} />
          <circle cx={ex + 3} cy={ey} r={er * 0.55} fill={C.navy} />
          {brow(-er * 1.3, -er * 2.3, er * 1.3, -er * 2.6)}
        </g>
      );
    return (
      <g>
        <g transform={`translate(${ex},${ey}) scale(1,${cara === "triste" ? 0.62 : parpadeo}) translate(${-ex},${-ey})`}>
          <circle cx={ex} cy={ey} r={er} fill={tinta} />
          {!punteado ? <circle cx={ex + er * 0.35} cy={ey - er * 0.35} r={er * 0.32} fill={C.blanco} /> : null}
        </g>
        {cara === "feroz" ? brow(-er * 1.6, -er * 1.9, er * 1.5, -er * 0.75) : null}
        {cara === "triste" ? brow(-er * 1.5, -er * 0.8, er * 1.4, -er * 1.9) : null}
        {cara === "duda" ? (
          <path
            d={`M${ex - er * 1.4},${ey - er * 1.7} Q${ex},${ey - er * 3} ${ex + er * 1.4},${ey - er * 1.9}`}
            stroke={F.c2}
            strokeWidth={er * 0.55}
            fill="none"
            strokeLinecap="round"
          />
        ) : null}
      </g>
    );
  };

  return (
    <g opacity={alpha} transform={`translate(${x},${y}) rotate(${rot}) scale(${flip ? -s : s},${s})`}>
      <g transform={`scale(1,${ky})`}>
        <g transform={`rotate(${cola},-392,0)`}>
          <Parte d={caudal} color={F.c2} />
        </g>
        <Parte d={dorsal} color={F.c2} />
        <Parte d={dorsal2} color={F.c2} />
        <Parte d={anal} color={F.c2} />
        <Parte d={cuerpo} color={F.c1} />
        {!punteado ? (
          <>
            <path d={panza} fill={F.panza} />
            {calor > 0.01 ? (
              <g opacity={calor}>
                <ellipse cx={40} cy={-dt * 0.18} rx={300} ry={dt * 0.42} fill={C.naranja} opacity={0.35} />
                <ellipse cx={40} cy={-dt * 0.18} rx={210} ry={dt * 0.26} fill={C.rojo} opacity={0.45} />
                <ellipse cx={210} cy={db * 0.42} rx={90} ry={db * 0.24} fill={C.naranja} opacity={0.45} />
              </g>
            ) : null}
            {[0, 1, 2, 3, 4].map((k) => (
              <path
                key={k}
                d={`M${236 + k * 17},${-dt * 0.3} Q${226 + k * 17},${db * 0.05} ${236 + k * 17},${db * 0.4}`}
                stroke={F.c2}
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
              />
            ))}
          </>
        ) : null}
        {/* boca */}
        {boca > 0.02 ? (
          <path
            d={`M${H[0]},${H[1]} L${U[0]},${U[1]} L${U2[0].toFixed(1)},${U2[1].toFixed(1)} Z`}
            fill={punteado ? "none" : "#5E1F2A"}
          />
        ) : null}
        {!punteado ? filaDientes(H, U, F.diente, 1, C.blanco) : null}
        {!punteado && boca > 0.08 ? filaDientes(H, U2, F.diente, -1, C.blanco) : null}
        <path
          d={`M${H[0] - 8},${H[1] + 2} L${U[0]},${U[1]}`}
          stroke={punteado ? C.blanco : F.c2}
          strokeWidth={7}
          strokeLinecap="round"
        />
        {cara === "triste" ? (
          <path d={`M${H[0] + 6},${H[1]} q-16,10 -26,30`} stroke={F.c2} strokeWidth={7} fill="none" strokeLinecap="round" />
        ) : null}
        <g transform={`rotate(${pect},250,${db * 0.66})`}>
          <Parte d={pectoral} color={F.c2} delante />
        </g>
        <g transform={`translate(${ex},${ey}) scale(1,${1 / ky}) translate(${-ex},${-ey})`}>{ojo()}</g>
      </g>
    </g>
  );
};

// del canal original
type Atajo = Omit<TiburonProps, "especie">;

// del canal original
export const Megalodon: React.FC<Atajo> = (p) => <Tiburon {...p} especie="megalodon" />;

// del canal original (Blanco)
export const TiburonBlanco: React.FC<Atajo> = (p) => <Tiburon {...p} especie="blanco" />;

// del canal original
export const Mako: React.FC<Atajo> = (p) => <Tiburon {...p} especie="mako" />;

// del canal original
export const Ballena: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  flip?: boolean;
  barbada?: boolean;
  cara?: CaraAnimal;
}> = ({ x, y, s = 1, f, flip, barbada, cara = "normal" }) => {
  const cola = Math.sin(f / 8) * 8;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <g transform={`rotate(${cola},-260,0)`}>
        <path d="M-250,-10 Q-300,-20 -330,-80 Q-340,-30 -300,0 Q-340,30 -330,80 Q-300,20 -250,10 Z" fill={P.ballena2} />
      </g>
      <path
        d="M320,0 C320,-80 200,-110 60,-110 C-100,-110 -200,-50 -260,-10 L-260,10 C-200,60 -100,100 60,100 C200,100 320,80 320,0 Z"
        fill={P.ballena}
      />
      <path
        d="M318,14 C300,70 180,96 60,96 C-80,96 -180,60 -250,12 C-150,40 -40,52 60,52 C180,52 270,40 318,14 Z"
        fill={barbada ? "#E9EEF5" : "#8FAAC8"}
      />
      {barbada
        ? Array.from({ length: 6 }, (_, k) => (
            <path
              key={k}
              d={`M${240 - k * 40},${50 + (k > 3 ? -6 : 0)} L${120 - k * 40},${70}`}
              stroke="#B9C6D6"
              strokeWidth={5}
              strokeLinecap="round"
            />
          ))
        : null}
      <path d="M150,-108 L120,-150 L80,-108 Z" fill={P.ballena2} />
      <path d="M140,40 Q90,110 30,130 Q90,70 100,40 Z" fill={P.ballena2} />
      <path d="M318,16 Q250,30 200,22" stroke={P.ballena2} strokeWidth={6} fill="none" strokeLinecap="round" />
      {barbada ? <path d="M300,18 L210,26 L212,36 L298,26 Z" fill={C.crema} opacity={0.8} /> : null}
      <g transform={`translate(220,-20) scale(1,${cara === "susto" ? 1.3 : f % 90 < 4 ? 0.12 : 1})`}>
        {cara === "susto" ? <circle r={16} fill={C.blanco} /> : null}
        <circle r={cara === "susto" ? 7 : 11} fill={C.navy} />
      </g>
    </g>
  );
};

// del canal original
export const Foca: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  flip?: boolean;
}> = ({ x, y, s = 1, f, flip }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <path d={`M-120,0 L-150,${-26 + Math.sin(f / 5) * 6} L-142,0 L-150,${26 - Math.sin(f / 5) * 6} Z`} fill="#6E5E52" />
    <ellipse cx={0} cy={0} rx={130} ry={46} fill="#8C7A6B" />
    <ellipse cx={10} cy={18} rx={100} ry={24} fill="#B8A898" />
    <circle cx={110} cy={-10} r={40} fill="#8C7A6B" />
    <circle cx={124} cy={-18} r={7} fill={C.navy} />
    <circle cx={146} cy={-4} r={5} fill={C.navy} />
    <path d="M30,30 Q10,60 -20,64 Q10,40 10,28 Z" fill="#6E5E52" />
  </g>
);

// del canal original
export const Tortuga: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  flip?: boolean;
}> = ({ x, y, s = 1, f, flip }) => {
  const a = Math.sin(f / 6) * 12;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <g transform={`rotate(${a},40,-10)`}>
        <path d="M40,-10 Q70,-80 20,-90 Q20,-40 0,-10 Z" fill={C.teal2} />
      </g>
      <g transform={`rotate(${-a},40,20)`}>
        <path d="M40,20 Q70,80 20,86 Q24,40 0,24 Z" fill={C.teal2} />
      </g>
      <circle cx={118} cy={0} r={28} fill={C.teal2} />
      <circle cx={128} cy={-8} r={6} fill={C.navy} />
      <ellipse cx={0} cy={0} rx={110} ry={62} fill="#2E7D63" />
      {[-50, 0, 50].map((dx) => (
        <path key={dx} d={`M${dx},-40 L${dx + 24},0 L${dx},40 L${dx - 24},0 Z`} fill="#3F9A7A" />
      ))}
    </g>
  );
};

// del canal original
export const Pez: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  flip?: boolean;
  color?: string;
}> = ({ x, y, s = 1, f, flip, color = C.naranja }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <path d={`M-40,0 L-70,${-24 + Math.sin(f / 3) * 5} L-70,${24 - Math.sin(f / 3) * 5} Z`} fill={color} />
    <ellipse cx={0} cy={0} rx={56} ry={26} fill={color} />
    <circle cx={30} cy={-6} r={6} fill={C.navy} />
  </g>
);

// del canal original
export const Vaca: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  capa?: number;
  flip?: boolean;
}> = ({ x, y, s = 1, f, capa = 0, flip }) => {
  const mira = Math.sin(f / 20) * 3;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={4} rx={220} ry={18} fill="rgba(18,12,46,0.25)" />
      {[-130, -80, 70, 120].map((lx) => (
        <rect key={lx} x={lx - 16} y={-120} width={32} height={124} rx={12} fill={C.crema} />
      ))}
      <rect x={-180} y={-250} width={350} height={150} rx={70} fill={C.blanco} />
      <ellipse cx={-90} cy={-200} rx={46} ry={34} fill={C.navy2} />
      <ellipse cx={60} cy={-150} rx={36} ry={26} fill={C.navy2} />
      <path d="M-180,-200 Q-226,-190 -214,-120" stroke={C.blanco} strokeWidth={12} fill="none" strokeLinecap="round" />
      <g transform={`translate(190,-250) rotate(${mira})`}>
        <rect x={-50} y={-56} width={110} height={120} rx={46} fill={C.blanco} />
        <rect x={-36} y={22} width={110} height={58} rx={28} fill={C.piel} />
        <circle cx={-6} cy={-6} r={8} fill={C.navy} />
        <circle cx={34} cy={-6} r={8} fill={C.navy} />
        <path d="M-40,-50 L-62,-82 M50,-50 L70,-82" stroke={C.crema} strokeWidth={12} strokeLinecap="round" />
        <ellipse cx={-62} cy={-28} rx={26} ry={14} fill={C.blanco} />
      </g>
      {capa > 0.001 ? (
        <g opacity={capa}>
          <path d="M-160,-246 Q0,-262 150,-246 L150,-238 Q0,-252 -160,-238 Z" fill={P.ceniza3} />
          {Array.from({ length: 12 }, (_, k) => (
            <circle key={k} cx={-150 + k * 27} cy={-250 + random(`va${k}`) * 6} r={3} fill={P.ceniza2} />
          ))}
        </g>
      ) : null}
    </g>
  );
};
