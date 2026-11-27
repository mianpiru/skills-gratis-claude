// Biblioteca Plano Pop · aviación de los años 40 (nuevas en V12, Triángulo de las Bermudas): torpedero de un motor
// (TBM Avenger), formación de torpederos, hidroavión de dos motores con casco de bote (PBM Mariner) y avioneta de
// ala alta. Todo de perfil, morro a la DERECHA, en colores de la Marina de 1945 (azul mar arriba, azul medio a los
// lados, blanco abajo), sin insignias ni marcas: solo un número blanco opcional. Dos tonos, paneles, remaches,
// vidrios con reflejo y hélices que giran (disco borroso + palas). x,y = centro del fuselaje; s = escala.
import React, { useId } from "react";
import { random } from "remotion";
import { C, T } from "../kit";
import { lim } from "./paleta";
import { aclarar, dosTonos, mezclaColor, oscurecer } from "./volumen";

const idL = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

/** Colores de la Marina de EE. UU. de 1945 (esquema de tres tonos). */
export const MARINA45 = {
  arriba: "#2C3D63",
  lado: "#4D6A94",
  abajo: "#DCE4EE",
  vidrio: "#9FD3EA",
  vidrio2: "#5E9CC6",
  metal: "#3A4156",
  cuero: "#7A4A2C",
};

/**
 * Hélice vista de canto (perfil): disco borroso + n palas que giran. x,y = cubo. largo = largo de pala.
 * gira = true (vel en grados por fotograma); quieta = palas fijas en `angulo`; dobladas = palas torcidas (naufragio).
 */
export const HeliceCanto: React.FC<{
  x: number;
  y: number;
  f: number;
  largo?: number;
  n?: number;
  gira?: boolean;
  vel?: number;
  angulo?: number;
  dobladas?: boolean;
  color?: string;
}> = ({ x, y, f, largo = 170, n = 3, gira = true, vel = 47, angulo = 20, dobladas, color = "#2A2E3E" }) => {
  const a0 = gira ? f * vel : angulo;
  return (
    <g transform={`translate(${x},${y})`}>
      {gira ? (
        <g>
          <ellipse cx={4} cy={0} rx={10} ry={largo} fill={C.blanco} opacity={0.16} />
          <ellipse cx={4} cy={0} rx={5} ry={largo * 0.96} fill="none" stroke={C.blanco} strokeWidth={2} opacity={0.25} />
        </g>
      ) : null}
      {Array.from({ length: n }, (_, k) => {
        const th = ((a0 + (k * 360) / n) * Math.PI) / 180;
        const L = largo * Math.sin(th);
        const ancho = 11 + 7 * Math.abs(Math.cos(th));
        const tuerce = dobladas ? (k === 0 ? 34 : k === 1 ? -22 : 10) : 0;
        return (
          <g key={k} opacity={gira ? 0.55 : 1} transform={tuerce ? `rotate(${tuerce} 0 0)` : undefined}>
            <path
              d={`M${-ancho / 2},0 L${-ancho / 2 + 2},${L * 0.92} Q0,${L * 1.02} ${ancho / 2 - 2},${L * 0.92} L${ancho / 2},0 Z`}
              fill={color}
            />
            <path d={`M${-ancho / 2 + 2},${L * 0.86} Q0,${L * 0.98} ${ancho / 2 - 2},${L * 0.86}`} stroke={C.amarillo} strokeWidth={5} fill="none" />
          </g>
        );
      })}
      <path d="M-6,-22 Q24,-20 30,0 Q24,20 -6,22 Z" fill={aclarar(color, 0.12)} />
      <path d="M-4,-18 Q16,-16 22,-4" stroke={C.blanco} strokeWidth={4} fill="none" opacity={0.4} strokeLinecap="round" />
    </g>
  );
};

/** Cabeza de tripulante vista de perfil dentro de una cabina (casco de cuero + gafas), mirando a la derecha. */
const CabezaCabina: React.FC<{ x: number; y: number; s?: number; casco?: string; f: number; fase?: number }> = ({ x, y, s = 1, casco = MARINA45.cuero, f, fase = 0 }) => {
  const mira = Math.sin((f + fase * 31) / 40) * 3;
  const cs = dosTonos(casco);
  return (
    <g transform={`translate(${x + mira},${y}) scale(${s})`}>
      <path d="M-16,22 L16,22 L20,40 L-22,40 Z" fill="#E2B33C" />
      <circle cx={0} cy={0} r={22} fill={C.piel} />
      <path d="M-22,2 Q-24,-24 0,-25 Q22,-24 23,-6 L14,-6 Q8,-14 -4,-12 L-8,10 Q-18,12 -22,2 Z" fill={cs.base} />
      <path d="M-22,2 Q-24,-24 0,-25 L-6,-12 Q-14,-6 -12,8 Z" fill={cs.sombra} opacity={0.6} />
      <rect x={4} y={-12} width={18} height={10} rx={4} fill={MARINA45.vidrio} stroke={C.navy} strokeWidth={3} />
      <circle cx={-9} cy={0} r={6} fill={cs.sombra} />
    </g>
  );
};

export type TorpederoProps = {
  x: number;
  y: number;
  f: number;
  s?: number;
  flip?: boolean;
  rot?: number;
  /** hélice girando (por defecto sí, salvo hundido) */
  helice?: boolean;
  /** número blanco en el fuselaje (p. ej. "28"); sin insignias */
  numero?: string;
  /** cabezas de piloto y tripulantes en la cabina (0..1) */
  tripulacion?: number;
  /** luz roja de la deriva que parpadea (vuelo nocturno o al atardecer) */
  luces?: boolean;
  /** 0..1: avión en el fondo del mar (verdoso, vidrios opacos, hélice doblada, corales y arena) */
  hundido?: number;
  /** temblor del vuelo (turbulencia) 0..1 */
  vibra?: number;
  /** resalta un punto (lupa sobre el número de cola) */
  resaltaNumero?: number;
};

/**
 * Torpedero TBM Avenger de perfil (≈ 1050 × 330 a s=1, sin hélice), morro a la derecha, x,y = centro del fuselaje.
 * Fuselaje gordo de un motor radial, cabina larga de vidrio con marcos, torreta de bola detrás, deriva alta,
 * esquema de tres azules. Puntos útiles (locales, ×s): cabina del piloto (208,−118), torreta (−82,−120),
 * número (−210,−14), cola (−520,−150), hélice (498,−2).
 * Ej.: <TorpederoTBM x={960} y={500} f={f} s={0.9} numero="28" />
 *      <TorpederoTBM x={1000} y={820} f={f} hundido={1} numero="?" />  (en el fondo del mar)
 */
export const TorpederoTBM: React.FC<TorpederoProps> = ({
  x,
  y,
  f,
  s = 1,
  flip,
  rot = 0,
  helice,
  numero,
  tripulacion = 1,
  luces,
  hundido = 0,
  vibra = 0,
  resaltaNumero = 0,
}) => {
  const uid = "tbm" + idL(useId());
  const h = lim(hundido, 0, 1);
  const tinte = (c: string) => (h > 0 ? mezclaColor(c, "#557365", 0.55 * h) : c);
  const top = dosTonos(tinte(MARINA45.arriba));
  const lado = dosTonos(tinte(MARINA45.lado));
  const bajo = dosTonos(tinte(MARINA45.abajo), 0.6);
  const gira = helice ?? h < 0.5;
  const vb = vibra > 0 ? [Math.sin(f * 2.3) * 3 * vibra, Math.cos(f * 2.9) * 2.4 * vibra] : [0, 0];
  const FUS =
    "M392,-68 L290,-84 L-40,-92 C-120,-92 -200,-80 -300,-62 L-500,-34 Q-530,-30 -536,-20 L-536,-8 L-470,0 C-380,8 -260,28 -150,48 L-132,70 C-40,98 120,100 250,86 C320,78 370,70 392,62 Z";
  const CAN = "M286,-84 L250,-142 Q244,-152 230,-152 L-20,-150 Q-40,-148 -46,-120 L-50,-92 Z";
  const ALETA = "M-340,-60 L-440,-238 Q-460,-270 -500,-264 Q-526,-258 -528,-230 L-536,-24 Z";
  const luz = luces ? ((f % 40) < 20 ? 1 : 0.25) : 0;
  return (
    <g transform={`translate(${x + vb[0]},${y + vb[1]}) rotate(${rot}) scale(${flip ? -s : s},${s})`}>
      <defs>
        <clipPath id={`${uid}-f`}>
          <path d={FUS} />
        </clipPath>
        <linearGradient id={`${uid}-v`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={h > 0.5 ? "#2D4A48" : aclarar(MARINA45.vidrio, 0.3)} />
          <stop offset="0.6" stopColor={h > 0.5 ? "#1E3436" : MARINA45.vidrio} />
          <stop offset="1" stopColor={h > 0.5 ? "#152628" : MARINA45.vidrio2} />
        </linearGradient>
      </defs>
      {/* estabilizador del lado lejano (más oscuro) */}
      <path d="M-410,-40 L-516,-44 Q-532,-44 -532,-36 L-410,-30 Z" fill={top.sombra} />
      {/* deriva */}
      <path d={ALETA} fill={lado.base} />
      <path d="M-500,-264 Q-526,-258 -528,-230 L-536,-24 L-505,-28 L-498,-250 Z" fill={lado.sombra} opacity={0.8} />
      <path d="M-440,-238 Q-460,-270 -500,-264" stroke={lado.luz} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d="M-497,-254 L-504,-30" stroke={top.sombra} strokeWidth={2.5} opacity={0.6} />
      {/* fuselaje en tres tonos */}
      <g clipPath={`url(#${uid}-f)`}>
        <rect x={-560} y={-120} width={1000} height={240} fill={lado.base} />
        <path d="M-560,-120 L440,-120 L440,-52 C300,-58 100,-62 -100,-56 C-300,-46 -450,-30 -560,-26 Z" fill={top.base} />
        <path d="M-560,30 C-300,36 0,40 440,24 L440,120 L-560,120 Z" fill={bajo.base} />
        <path d="M-560,60 C-300,64 0,74 440,54 L440,120 L-560,120 Z" fill={bajo.sombra} opacity={0.7} />
        <path d="M380,-60 C200,-70 0,-74 -300,-56" stroke={top.luz} strokeWidth={9} fill="none" opacity={0.45} strokeLinecap="round" />
        {/* paneles y remaches */}
        {[300, 150, -120, -260, -380].map((px) => (
          <path key={px} d={`M${px},-110 Q${px - 6},0 ${px},110`} stroke={top.sombra} strokeWidth={2.2} fill="none" opacity={0.5} />
        ))}
        <path d="M384,-28 L-520,-14" stroke={top.sombra} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" opacity={0.6} />
        <path d="M384,40 L-140,58" stroke={bajo.sombra} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" opacity={0.8} />
        {/* bodega de bombas y puesto ventral */}
        <path d="M-120,72 L230,84" stroke={bajo.sombra} strokeWidth={3} opacity={0.8} />
        <rect x={-232} y={22} width={58} height={22} rx={6} fill={`url(#${uid}-v)`} stroke={C.navy} strokeWidth={2.5} />
        {/* sombra general abajo */}
        <path d={FUS} fill="none" stroke={C.navy} strokeWidth={10} opacity={0.12} />
      </g>
      <path d={FUS} fill="none" stroke={oscurecer(MARINA45.arriba, 0.35)} strokeWidth={3} />
      {/* estabilizador cercano */}
      <path d="M-420,-30 L-530,-28 Q-548,-26 -548,-16 L-420,-14 Z" fill={lado.base} stroke={top.sombra} strokeWidth={2} />
      <path d="M-500,-28 L-502,-16" stroke={top.sombra} strokeWidth={2} />
      {/* ala (raíz, de canto) */}
      <path d="M250,18 C200,6 80,6 -40,18 L-60,34 C40,50 180,52 250,40 Q262,30 250,18 Z" fill={bajo.base} />
      <path d="M250,18 C200,6 80,6 -40,18 L-30,24 C80,14 200,14 252,26 Z" fill={lado.base} />
      <path d="M-60,34 C40,50 180,52 250,40 L248,46 C180,58 40,56 -58,40 Z" fill={bajo.sombra} />
      <path d="M244,22 C200,12 100,12 0,20" stroke={lado.luz} strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
      {/* capó del motor radial */}
      <path d="M392,-70 L452,-72 Q486,-70 492,-2 Q486,66 452,68 L392,64 Z" fill={top.base} />
      <path d="M392,20 L452,26 Q486,30 490,8 Q486,66 452,68 L392,64 Z" fill={top.sombra} opacity={0.8} />
      <path d="M398,-60 L448,-62 Q470,-60 478,-30" stroke={top.luz} strokeWidth={6} fill="none" opacity={0.55} strokeLinecap="round" />
      {[402, 414].map((px) => (
        <path key={px} d={`M${px},-66 L${px},62`} stroke={oscurecer(MARINA45.arriba, 0.3)} strokeWidth={2.5} />
      ))}
      <ellipse cx={489} cy={-2} rx={9} ry={58} fill={C.negro} opacity={0.85} />
      {/* escapes */}
      {[0, 1].map((k) => (
        <ellipse key={k} cx={380 - k * 10} cy={22 + k * 13} rx={11} ry={5} fill={C.negro} opacity={0.75} />
      ))}
      {/* cabina larga de vidrio */}
      <path d={CAN} fill={`url(#${uid}-v)`} />
      {tripulacion > 0.01 && h < 0.5 ? (
        <g opacity={tripulacion}>
          <CabezaCabina x={206} y={-112} f={f} />
          <CabezaCabina x={40} y={-112} f={f} fase={2} s={0.9} casco="#6B4A35" />
        </g>
      ) : null}
      <path d="M244,-146 L-20,-144 L-24,-136 L240,-138 Z" fill={C.blanco} opacity={h > 0.5 ? 0.05 : 0.35} />
      <path d="M200,-140 L150,-96 M120,-142 L84,-100" stroke={C.blanco} strokeWidth={7} opacity={h > 0.5 ? 0.04 : 0.28} strokeLinecap="round" />
      {[250, 196, 142, 88, 34, -16].map((px) => (
        <path key={px} d={`M${px},-150 L${px + (px === 250 ? 34 : 0)},-88`} stroke={MARINA45.metal} strokeWidth={5} />
      ))}
      <path d="M262,-118 L-48,-116" stroke={MARINA45.metal} strokeWidth={4.5} />
      <path d={CAN} fill="none" stroke={MARINA45.metal} strokeWidth={5} strokeLinejoin="round" />
      {/* torreta de bola con su ametralladora */}
      <path d="M-30,-92 Q-50,-150 -100,-146 Q-138,-132 -142,-90 Z" fill={top.base} />
      <rect x={-196} y={-133} width={90} height={8} rx={4} fill={MARINA45.metal} />
      <circle cx={-84} cy={-128} r={40} fill={`url(#${uid}-v)`} stroke={MARINA45.metal} strokeWidth={5} />
      <path d="M-124,-128 L-44,-128 M-84,-168 L-84,-88" stroke={MARINA45.metal} strokeWidth={3.5} />
      <path d="M-104,-150 Q-90,-162 -70,-158" stroke={C.blanco} strokeWidth={5} fill="none" opacity={h > 0.5 ? 0.05 : 0.5} strokeLinecap="round" />
      {/* antena */}
      <path d="M-20,-150 L-470,-252" stroke={MARINA45.metal} strokeWidth={2} opacity={0.8} />
      {/* número */}
      {numero ? (
        <g>
          {resaltaNumero > 0.01 ? (
            <ellipse cx={-216} cy={-30} rx={70 + numero.length * 12} ry={52} fill={C.amarillo} opacity={0.35 * resaltaNumero} />
          ) : null}
          <T x={-216} y={-14} size={50} fill={h > 0.5 ? "#C9D3C0" : C.blanco} borde={oscurecer(MARINA45.lado, 0.3)}>
            {numero}
          </T>
        </g>
      ) : null}
      {/* luz de la deriva */}
      {luz > 0 ? (
        <g>
          <circle cx={-506} cy={-258} r={20} fill={C.rojo} opacity={0.3 * luz} />
          <circle cx={-506} cy={-258} r={7} fill={C.rojo} opacity={luz} />
        </g>
      ) : null}
      <HeliceCanto x={498} y={-2} f={f} gira={gira} dobladas={h > 0.5} largo={176} color={h > 0.5 ? "#3F4A48" : "#262A38"} />
      {/* naufragio: corales, algas y arena */}
      {h > 0.01 ? (
        <g opacity={h}>
          {Array.from({ length: 16 }, (_, k) => {
            const px = -500 + random(`${uid}c${k}`) * 960;
            const py = -60 - random(`${uid}d${k}`) * 40 + (px < -300 ? 20 : 0);
            const col = [C.rojo, "#F49AB0", C.naranja, "#7FC28E", C.lila][k % 5];
            const r = 8 + random(`${uid}r${k}`) * 16;
            return (
              <g key={k}>
                <circle cx={px} cy={py} r={r} fill={col} />
                <circle cx={px - r * 0.3} cy={py - r * 0.3} r={r * 0.45} fill={aclarar(col, 0.35)} />
              </g>
            );
          })}
          {[-380, -150, 120, 330].map((px, k) => (
            <path
              key={px}
              d={`M${px},-70 Q${px + 14 + Math.sin(f / 18 + k) * 10},-130 ${px + Math.sin(f / 15 + k) * 16},-190`}
              stroke="#4E9A6A"
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
            />
          ))}
          <path d="M-640,110 Q-300,30 0,60 Q300,30 640,110 L700,700 L-700,700 Z" fill="#3E4A5E" />
          <path d="M-640,110 Q-300,30 0,60 Q300,30 640,110 L636,126 Q300,48 0,76 Q-300,48 -636,126 Z" fill="#56627A" />
        </g>
      ) : null}
    </g>
  );
};

/**
 * Formación de n torpederos TBM (por defecto 5) en escalón, con profundidad (los lejanos más chicos y
 * azulados). x,y = el líder. o = opacidad de cada avión (para que se apaguen uno a uno); separa 0..1 abre la
 * formación; baja = grados de picada (todos juntos).
 * Ej.: <FormacionTBM x={1100} y={460} f={f} s={0.55} o={[1, 1, sale(f, w(3), w(3)+8) …]} />
 */
export const FormacionTBM: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  n?: number;
  o?: number[];
  separa?: number;
  baja?: number;
  flip?: boolean;
  numeros?: string[];
  luces?: boolean;
  tripulacion?: number;
}> = ({ x, y, f, s = 0.5, n = 5, o = [], separa = 0, baja = 0, flip, numeros = [], luces, tripulacion = 1 }) => {
  const POS: [number, number, number][] = [
    [0, 0, 1],
    [-300, -120, 0.84],
    [-560, -210, 0.7],
    [260, -170, 0.76],
    [480, -270, 0.62],
  ];
  const lista = POS.slice(0, n)
    .map((p, k) => ({ p, k }))
    .sort((a, b) => a.p[2] - b.p[2]);
  const d = 1 + separa * 0.5;
  return (
    <g>
      {lista.map(({ p, k }) => {
        const oo = o[k] ?? 1;
        if (oo <= 0.01) return null;
        const bob = Math.sin((f + k * 23) / 17) * 6;
        const px = x + p[0] * s * d * (flip ? -1 : 1);
        const py = y + p[1] * s * d + bob;
        return (
          <g key={k} opacity={oo}>
            <TorpederoTBM
              x={px}
              y={py}
              f={f + k * 3}
              s={s * p[2]}
              flip={flip}
              rot={baja + Math.sin((f + k * 11) / 29) * 1.2}
              numero={numeros[k]}
              luces={luces}
              tripulacion={tripulacion}
            />
            {p[2] < 0.95 ? (
              <TorpederoBruma x={px} y={py} s={s * p[2]} o={(1 - p[2]) * 0.9} flip={flip} rot={baja} />
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/** Velo azulado encima de un avión lejano (profundidad aérea). */
const TorpederoBruma: React.FC<{ x: number; y: number; s: number; o: number; flip?: boolean; rot?: number }> = ({ x, y, s, o, flip, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${flip ? -s : s},${s})`} opacity={o}>
    <path
      d="M392,-68 L290,-84 L250,-142 L-20,-150 L-40,-92 L-300,-62 L-440,-238 L-500,-264 L-536,-24 L-536,-8 L-470,0 L-150,48 L-132,70 L250,86 L392,62 L452,68 L492,-2 L452,-72 Z"
      fill="#A8C4E4"
    />
  </g>
);

export type HidroavionProps = {
  x: number;
  y: number;
  f: number;
  s?: number;
  flip?: boolean;
  rot?: number;
  helices?: boolean;
  numero?: string;
  /** luces de navegación (punta de ala, cola) que parpadean */
  luces?: boolean;
  /** 0..1 faro de aterrizaje (cono de luz hacia adelante) */
  faro?: number;
  /** 0..1 espuma en el casco (carrera de despegue sobre el agua) */
  espuma?: number;
  vibra?: number;
};

/**
 * Hidroavión PBM Mariner de perfil (≈ 1120 × 420 a s=1), morro a la derecha, x,y = centro del casco.
 * Casco de bote hondo con escalón, ala de gaviota alta con dos motores (el lejano asoma detrás), flotador bajo el
 * ala, cola con dos derivas y torreta de proa de vidrio. Puntos útiles (locales, ×s): cabina (395,−100), motor
 * cercano (210,−198), tanques/mangueras del ala (60,−206), escalón del casco (20,72), cola (−520,−250).
 * Ej.: <HidroavionPBM x={960} y={520} f={f} s={0.8} luces faro={0.6} />
 */
export const HidroavionPBM: React.FC<HidroavionProps> = ({ x, y, f, s = 1, flip, rot = 0, helices = true, numero, luces, faro = 0, espuma = 0, vibra = 0 }) => {
  const uid = "pbm" + idL(useId());
  const top = dosTonos(MARINA45.arriba);
  const lado = dosTonos(MARINA45.lado);
  const bajo = dosTonos(MARINA45.abajo, 0.6);
  const vb = vibra > 0 ? [Math.sin(f * 2.1) * 3 * vibra, Math.cos(f * 2.7) * 2.4 * vibra] : [0, 0];
  const CASCO =
    "M540,-10 C536,-50 500,-80 430,-92 L380,-104 L120,-108 L-200,-104 C-330,-110 -440,-140 -520,-168 L-552,-170 L-556,-150 C-470,-112 -360,-70 -150,-4 L0,52 L20,72 L380,70 C460,64 520,40 540,-10 Z";
  const luz = luces ? ((f % 36) < 18 ? 1 : 0.3) : 0;
  const Motor = ({ dx, dy, lejos }: { dx: number; dy: number; lejos?: boolean }) => {
    const t = lejos ? dosTonos(oscurecer(MARINA45.arriba, 0.25)) : top;
    return (
      <g transform={`translate(${dx},${dy})`}>
        <path d="M340,-236 Q362,-236 366,-198 Q362,-160 340,-160 L-70,-176 Q-96,-198 -70,-220 Z" fill={t.base} />
        <path d="M340,-198 Q362,-198 366,-198 Q362,-160 340,-160 L-70,-176 Q-90,-186 -84,-198 Z" fill={t.sombra} opacity={0.8} />
        <path d="M330,-228 L-40,-214" stroke={t.luz} strokeWidth={6} opacity={0.5} strokeLinecap="round" />
        <ellipse cx={364} cy={-198} rx={7} ry={32} fill={C.negro} opacity={0.8} />
        {[300, 288].map((px) => (
          <path key={px} d={`M${px},-234 L${px},-162`} stroke={oscurecer(MARINA45.arriba, 0.3)} strokeWidth={2.5} />
        ))}
        <HeliceCanto x={370} y={-198} f={f + (lejos ? 7 : 0)} gira={helices} largo={150} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x + vb[0]},${y + vb[1]}) rotate(${rot}) scale(${flip ? -s : s},${s})`}>
      <defs>
        <clipPath id={`${uid}-c`}>
          <path d={CASCO} />
        </clipPath>
        <linearGradient id={`${uid}-v`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={aclarar(MARINA45.vidrio, 0.3)} />
          <stop offset="1" stopColor={MARINA45.vidrio2} />
        </linearGradient>
        <linearGradient id={`${uid}-faro`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFF6C8" stopOpacity={0.7} />
          <stop offset="1" stopColor="#FFF6C8" stopOpacity={0} />
        </linearGradient>
      </defs>
      {faro > 0.01 ? <path d="M520,-30 L1300,-200 L1300,220 Z" fill={`url(#${uid}-faro)`} opacity={faro} /> : null}
      {/* deriva lejana y estabilizador */}
      <path d="M-488,-190 Q-500,-330 -540,-338 Q-576,-330 -566,-190 Z" fill={top.sombra} />
      <path d="M-420,-176 L-570,-196 L-574,-182 L-420,-164 Z" fill={top.sombra} />
      {/* motor lejano */}
      <Motor dx={22} dy={-7} lejos />
      {/* ala (de gaviota: la parte interna sube desde el casco) */}
      <path d="M250,-108 Q240,-150 268,-186 L-10,-196 Q-40,-150 40,-108 Z" fill={lado.base} />
      <path d="M40,-108 Q-40,-150 -10,-196 L40,-194 Q20,-150 90,-108 Z" fill={lado.sombra} opacity={0.7} />
      <path d="M290,-196 C200,-228 60,-230 -40,-214 L-60,-196 C40,-188 200,-186 290,-190 Z" fill={top.base} />
      <path d="M284,-200 C200,-222 60,-224 -30,-210" stroke={top.luz} strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round" />
      {/* casco */}
      <g clipPath={`url(#${uid}-c)`}>
        <rect x={-580} y={-200} width={1140} height={300} fill={lado.base} />
        <path d="M-580,-200 L560,-200 L560,-76 C400,-84 100,-90 -150,-90 C-350,-110 -480,-150 -580,-160 Z" fill={top.base} />
        <path d="M-580,-120 C-400,-60 -200,10 0,30 L560,20 L560,100 L-580,100 Z" fill={bajo.base} />
        <path d="M0,46 L560,40 L560,100 L0,100 Z" fill={bajo.sombra} opacity={0.8} />
        <path d="M520,-60 C300,-96 0,-100 -300,-96" stroke={top.luz} strokeWidth={8} fill="none" opacity={0.45} strokeLinecap="round" />
        {[300, 120, -60, -240, -380].map((px) => (
          <path key={px} d={`M${px},-130 Q${px - 6},-20 ${px},90`} stroke={top.sombra} strokeWidth={2.2} fill="none" opacity={0.5} />
        ))}
        <path d="M500,-36 L-420,-70" stroke={top.sombra} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" opacity={0.6} />
        {/* ojos de buey */}
        {[250, 190, 130, -40, -100].map((px) => (
          <g key={px}>
            <circle cx={px} cy={-58} r={11} fill={`url(#${uid}-v)`} stroke={MARINA45.metal} strokeWidth={3} />
            <circle cx={px - 3} cy={-61} r={3} fill={C.blanco} opacity={0.7} />
          </g>
        ))}
        {luces ? [250, 190, 130, -40, -100].map((px) => <circle key={px} cx={px} cy={-58} r={9} fill={C.amarillo} opacity={0.55} />) : null}
      </g>
      <path d={CASCO} fill="none" stroke={oscurecer(MARINA45.arriba, 0.35)} strokeWidth={3} />
      <path d="M20,72 L0,52" stroke={bajo.sombra} strokeWidth={4} />
      {/* ampolla lateral de vidrio */}
      <ellipse cx={-236} cy={-74} rx={34} ry={20} fill={`url(#${uid}-v)`} stroke={MARINA45.metal} strokeWidth={4} />
      {/* cabina y torreta de proa */}
      <path d="M440,-86 L404,-112 L330,-114 L328,-98 Z" fill={`url(#${uid}-v)`} stroke={MARINA45.metal} strokeWidth={4} strokeLinejoin="round" />
      <path d="M402,-110 L396,-96 M366,-113 L364,-97" stroke={MARINA45.metal} strokeWidth={3.5} />
      <circle cx={494} cy={-58} r={26} fill={`url(#${uid}-v)`} stroke={MARINA45.metal} strokeWidth={4} />
      <path d="M494,-84 L494,-32 M468,-58 L520,-58" stroke={MARINA45.metal} strokeWidth={3} />
      <path d="M480,-74 Q492,-80 504,-76" stroke={C.blanco} strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
      {/* cola: estabilizador cercano y deriva */}
      <path d="M-420,-164 L-566,-176 Q-584,-176 -584,-164 L-420,-150 Z" fill={lado.base} stroke={top.sombra} strokeWidth={2} />
      <path d="M-500,-170 Q-512,-322 -552,-330 Q-588,-322 -580,-168 Z" fill={lado.base} />
      <path d="M-552,-330 Q-588,-322 -580,-168 L-556,-168 Q-560,-300 -548,-328 Z" fill={lado.sombra} opacity={0.8} />
      <path d="M-506,-200 Q-514,-300 -548,-318" stroke={lado.luz} strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round" />
      {/* motor cercano */}
      <Motor dx={0} dy={0} />
      {/* flotador del ala con sus puntales */}
      <path d="M118,-196 L96,-40 M60,-196 L72,-40" stroke={MARINA45.metal} strokeWidth={6} />
      <path d="M190,-30 Q170,-52 120,-50 L10,-44 Q-14,-36 4,-24 L120,-14 Q176,-12 190,-30 Z" fill={lado.base} stroke={top.sombra} strokeWidth={2.5} />
      <path d="M186,-34 Q170,-48 120,-46 L20,-40" stroke={lado.luz} strokeWidth={4} fill="none" opacity={0.6} />
      {numero ? (
        <T x={-160} y={-22} size={50} fill={C.blanco} borde={oscurecer(MARINA45.lado, 0.3)}>
          {numero}
        </T>
      ) : null}
      {luz > 0 ? (
        <g>
          <circle cx={-552} cy={-334} r={22} fill={C.blanco} opacity={0.35 * luz} />
          <circle cx={-552} cy={-334} r={7} fill={C.blanco} opacity={luz} />
          <circle cx={-40} cy={-212} r={22} fill={C.rojo} opacity={0.35 * luz} />
          <circle cx={-40} cy={-212} r={7} fill={C.rojo} opacity={luz} />
        </g>
      ) : null}
      {espuma > 0.01 ? (
        <g opacity={espuma}>
          {Array.from({ length: 14 }, (_, k) => {
            const t = ((f * 1.6 + k * 19) % 60) / 60;
            const px = 40 - t * 520 + random(`${uid}e${k}`) * 40;
            const py = 70 - t * 40 - random(`${uid}g${k}`) * 50;
            return <circle key={k} cx={px} cy={py} r={(10 + 26 * t) * (1 - t * 0.4)} fill={C.blanco} opacity={0.85 * (1 - t)} />;
          })}
          <path d="M540,0 Q600,-40 660,-10 Q600,10 540,20 Z" fill={C.blanco} opacity={0.7} />
        </g>
      ) : null}
    </g>
  );
};

/**
 * Avioneta de ala alta de perfil (≈ 470 × 190 a s=1), morro a la derecha, x,y = centro de la cabina; sin marcas.
 * color = franja (y la deriva). piloto 0..1 = cabeza en la ventana (con lentes grandes si lentes).
 * Ej.: <Avioneta x={900} y={400} f={f} s={1.2} color={C.rojo} piloto={1} lentes />
 */
export const Avioneta: React.FC<{ x: number; y: number; f: number; s?: number; flip?: boolean; rot?: number; color?: string; piloto?: number; lentes?: boolean }> = ({
  x,
  y,
  f,
  s = 1,
  flip,
  rot = 0,
  color = C.rojo,
  piloto = 1,
  lentes,
}) => {
  const b = dosTonos("#F2F4F8", 0.5);
  const c = dosTonos(color);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot + Math.sin(f / 21) * 1.2}) scale(${flip ? -s : s},${s})`}>
      <path d="M-166,-14 L-204,-98 Q-210,-112 -194,-112 L-160,-112 Q-146,-110 -148,-96 L-120,-30 Z" fill={c.base} />
      <path d="M-160,-112 Q-146,-110 -148,-96 L-120,-30 L-136,-24 Z" fill={c.sombra} opacity={0.6} />
      <path d="M-196,-104 L-162,-104" stroke={c.luz} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      <path d="M-170,-4 L-250,-6 L-250,6 L-170,8 Z" fill={b.sombra} />
      <path d="M200,-14 Q214,-8 214,6 Q206,30 170,34 L-40,30 L-230,4 L-232,-6 L-60,-36 L40,-50 L150,-44 Q190,-34 200,-14 Z" fill={b.base} />
      <path d="M214,6 Q206,30 170,34 L-40,30 L-230,4 L-40,18 L170,22 Z" fill={b.sombra} />
      <path d="M190,-6 L-220,-2" stroke={c.base} strokeWidth={12} />
      <path d="M190,-6 L-220,-2" stroke={c.luz} strokeWidth={3} opacity={0.6} />
      {/* ventanas */}
      <path d="M120,-42 L70,-48 L58,-14 L132,-12 Z" fill={MARINA45.vidrio} stroke={b.sombra} strokeWidth={4} />
      <path d="M52,-48 L-30,-40 L-26,-12 L50,-14 Z" fill={MARINA45.vidrio} stroke={b.sombra} strokeWidth={4} />
      {piloto > 0.01 ? (
        <g opacity={piloto}>
          <circle cx={84} cy={-26} r={15} fill={C.piel} />
          <path d="M70,-30 Q70,-46 86,-46 Q100,-44 100,-32 Q90,-38 80,-34 Z" fill="#5A3A28" />
          {lentes ? <rect x={86} y={-32} width={14} height={11} rx={3} fill="none" stroke={C.navy} strokeWidth={3} /> : null}
        </g>
      ) : null}
      <path d="M100,-46 L70,-24 M30,-44 L4,-22" stroke={C.blanco} strokeWidth={5} opacity={0.5} strokeLinecap="round" />
      {/* ala alta y puntal */}
      <path d="M150,-60 L-90,-58 Q-104,-56 -100,-46 L150,-48 Z" fill={b.luz} stroke={b.sombra} strokeWidth={3} />
      <path d="M40,-48 L70,22" stroke={b.sombra} strokeWidth={6} />
      {/* tren */}
      <path d="M60,30 L40,72 M150,30 L160,66" stroke={C.gris2} strokeWidth={7} />
      <circle cx={40} cy={76} r={14} fill={C.navy} />
      <circle cx={160} cy={70} r={11} fill={C.navy} />
      <HeliceCanto x={216} y={4} f={f} largo={80} n={2} />
    </g>
  );
};
