// Biblioteca Plano Pop · mar y barcos (nuevas en V12, Triángulo de las Bermudas). Todos los barcos van de perfil,
// proa a la DERECHA, con x,y = línea de flotación al centro del casco: se mecen solos (mece), se escoran (inclina),
// se hunden (hunde 0..1, en plano lejano y sin gente) y se recortan solos en la línea del agua, así que van ENCIMA
// del fondo de mar (Oceano, MarTormenta) sin que el casco «flote» sobre las olas. Dos tonos, ojos de buey,
// luces de noche (luces 0..1), humo de chimenea (Humo de efectos-ricos). Sin nombres, banderas ni marcas.
// Además: fondo de mar con tormenta, fondo marino, arrecife en corte, salvavidas, huracán visto desde arriba,
// corriente que corre como un río, brújula de dos agujas y anemómetro.
import React, { useId } from "react";
import { interpolate, random } from "remotion";
import { C, H, T, W, fijo } from "../kit";
import { Humo } from "./efectos-ricos";
import { CamaraFondo, NubeVolumen, TonosNube } from "./fondos-ricos";
import { anchoT, lim, PB } from "./paleta";
import { Relampago } from "./vivas";
import { aclarar, dosTonos, mezclaColor, oscurecer } from "./volumen";

const idL = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const fx = (n: number) => n.toFixed(1);

// =====================================================================================================
// Flotación común
// =====================================================================================================
type FlotaProps = {
  x: number;
  y: number;
  f: number;
  s?: number;
  flip?: boolean;
  /** 0..2 cuánto se mece con las olas (por defecto 1) */
  mece?: number;
  /** escora fija en grados (+ = la proa sube) */
  inclina?: number;
  /** 0..1 se hunde (baja y se inclina de popa); úsalo en plano lejano */
  hunde?: number;
  /** 0..1 deja ver la parte bajo el agua (translúcida), para cortes y diagramas */
  bajoAgua?: number;
  /** 0..1 espuma de proa y estela (el barco avanza) */
  avanza?: number;
  /** false = no recorta en la línea del agua (naufragio en el fondo, tarjetas) */
  recorta?: boolean;
};

const Flota: React.FC<FlotaProps & { largo: number; arte: () => React.ReactNode }> = ({
  x,
  y,
  f,
  s = 1,
  flip,
  mece = 1,
  inclina = 0,
  hunde = 0,
  bajoAgua = 0,
  avanza = 0,
  recorta = true,
  largo,
  arte,
}) => {
  const uid = "fl" + idL(useId());
  const h = lim(hunde, 0, 1);
  const bob = Math.sin(f / 22) * 4 * mece * s;
  const rot = Math.sin(f / 31) * 1.4 * mece + inclina - h * 9;
  const dy = h * h * 420 * s;
  const tr = `translate(${fx(x)},${fx(y + bob + dy)}) rotate(${fx(flip ? -rot : rot)}) scale(${flip ? -s : s},${s})`;
  const L = (largo / 2 + 120) * s;
  const espuma = (
    <g>
      {Array.from({ length: 9 }, (_, k) => {
        const t = ((f * 0.9 + k * 23) % 80) / 80;
        const px = x - (largo / 2) * s + t * largo * s * 1.1;
        return (
          <ellipse
            key={k}
            cx={px}
            cy={y + 2}
            rx={(18 + 30 * random(`${uid}e${k}`)) * s}
            ry={5 * s}
            fill={C.blanco}
            opacity={(0.35 + 0.3 * Math.sin(f / 7 + k)) * (1 - h)}
          />
        );
      })}
      {avanza > 0.01 ? (
        <g opacity={avanza * (1 - h)}>
          {[0, 1, 2].map((k) => {
            const bx = x + (flip ? -1 : 1) * (largo / 2 - 10) * s;
            const ph = Math.sin(f / 4 + k) * 6;
            return (
              <path
                key={k}
                d={`M${bx},${y + 4} q${(flip ? -1 : 1) * (30 + k * 20) * s},${(-30 - k * 12 + ph) * s} ${(flip ? -1 : 1) * (70 + k * 30) * s},${6 * s}`}
                fill={C.blanco}
                opacity={0.8 - k * 0.2}
              />
            );
          })}
          <path
            d={`M${x - (flip ? -1 : 1) * (largo / 2) * s},${y + 3} l${-(flip ? -1 : 1) * 380 * s},${-6 * s} l0,${16 * s} Z`}
            fill={C.blanco}
            opacity={0.35}
          />
        </g>
      ) : null}
    </g>
  );
  if (!recorta) return <g transform={tr}>{arte()}</g>;
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-a`} clipPathUnits="userSpaceOnUse">
          <rect x={x - L} y={y - 4000} width={2 * L} height={4000 + 3} />
        </clipPath>
        <clipPath id={`${uid}-b`} clipPathUnits="userSpaceOnUse">
          <rect x={x - L} y={y + 3} width={2 * L} height={4000} />
        </clipPath>
      </defs>
      {bajoAgua > 0.01 ? (
        <g clipPath={`url(#${uid}-b)`} opacity={0.55 * bajoAgua}>
          <g transform={tr}>{arte()}</g>
        </g>
      ) : null}
      <g clipPath={`url(#${uid}-a)`}>
        <g transform={tr}>{arte()}</g>
      </g>
      {espuma}
    </g>
  );
};

const ojosBuey = (xs: number[], yy: number, r: number, luces: number, color = "#2A2E3E", key = "ob") => (
  <g key={key}>
    {xs.map((px) => (
      <g key={px}>
        <circle cx={px} cy={yy} r={r + 2.5} fill={color} />
        <circle cx={px} cy={yy} r={r} fill={luces > 0.01 ? mezclaColor("#2E4C78", C.amarillo, luces) : "#2E4C78"} />
        {luces > 0.01 ? <circle cx={px} cy={yy} r={r * 2.6} fill={C.amarillo} opacity={0.18 * luces} /> : null}
        <circle cx={px - r * 0.3} cy={yy - r * 0.3} r={r * 0.3} fill={C.blanco} opacity={0.6} />
      </g>
    ))}
  </g>
);

const LucesNav: React.FC<{ f: number; luces: number; tope: [number, number]; proa: [number, number]; popa?: [number, number] }> = ({ f, luces, tope, proa, popa }) => {
  if (luces <= 0.01) return null;
  const late = 0.75 + 0.25 * Math.sin(f / 9);
  const L = (p: [number, number], c: string, r = 7) => (
    <g>
      <circle cx={p[0]} cy={p[1]} r={r * 3.4} fill={c} opacity={0.22 * luces * late} />
      <circle cx={p[0]} cy={p[1]} r={r} fill={c} opacity={luces} />
    </g>
  );
  return (
    <g>
      {L(tope, "#FFF6D0", 8)}
      {L(proa, "#5BE38A")}
      {popa ? L(popa, "#FFF6D0", 6) : null}
    </g>
  );
};

// =====================================================================================================
// Barcos
// =====================================================================================================
export type BarcoProps = FlotaProps & {
  /** 0..1 luces de noche (ojos de buey, ventanas, luces de navegación) */
  luces?: number;
  /** humo en la chimenea */
  humo?: boolean;
};

/** Puntos útiles del carbonero (locales, sin carga; multiplica por s y suma x,y): motor, bodega, puente, chimenea. */
export const PUNTOS_CARBONERO = { motor: [-420, 20] as [number, number], bodega: [60, 10] as [number, number], puente: [450, -220] as [number, number], chimenea: [-450, -330] as [number, number] };

/**
 * Carbonero de la Marina de 1910 (tipo USS Cyclops; ≈ 1210 × 480 a s=1): casco gris largo, puente a proa, seis
 * grúas en forma de marco a lo largo de la cubierta (postes con travesaño y plumas), chimenea a popa.
 * carga 0..1 = va hundido hasta la línea de flotación por el mineral (la borda casi toca el agua).
 * corte 0..1 = muestra por dentro las bodegas llenas de mineral y el motor (úsalo con bajoAgua={1});
 * motorRoto 0..1 = grieta roja en un cilindro del motor (en el corte).
 * Ej.: <Carbonero x={960} y={700} f={f} s={0.9} carga={1} humo avanza={0.6} />
 *      <Carbonero x={960} y={700} f={f} carga={1} corte={1} bajoAgua={1} motorRoto={pop(f, w(8))} mece={0.3} />
 */
export const Carbonero: React.FC<BarcoProps & { carga?: number; corte?: number; motorRoto?: number }> = ({
  luces = 0,
  humo,
  carga = 0,
  corte = 0,
  motorRoto = 0,
  ...fl
}) => {
  const dz = 34 * lim(carga, 0, 1);
  const g = dosTonos("#6B7385");
  const sup = dosTonos("#D9DCE3", 0.6);
  const POSTES = [300, 170, 40, -90, -220, -350];
  const arte = () => (
    <g transform={`translate(0,${dz})`}>
      {/* casco */}
      <path d="M598,-128 L584,80 L-540,80 Q-596,60 -604,-112 L-600,-114 Q0,-86 598,-128 Z" fill={g.base} />
      <path d={`M598,${-dz - 2} L584,80 L-540,80 Q-596,60 -603,${-dz - 2} Z`} fill={C.rojo2} />
      <path d={`M598,${-dz - 14} L597,${-dz} L-603,${-dz} L-603,${-dz - 12} Z`} fill={C.negro} />
      <path d="M598,-128 L594,-70 Q0,-40 -604,-60 L-604,-112 Q0,-86 598,-128 Z" fill={g.luz} opacity={0.35} />
      <path d="M-604,-112 Q0,-86 598,-128" stroke={g.sombra} strokeWidth={6} fill="none" />
      {ojosBuey([520, 470, 420, -470, -520], -76, 8, luces)}
      {[400, 200, 0, -200, -400].map((px) => (
        <path key={px} d={`M${px},-100 L${px - 4},${-dz - 14}`} stroke={g.sombra} strokeWidth={2} opacity={0.5} />
      ))}
      {/* castillo y puente a proa */}
      <path d="M430,-112 L598,-128 L600,-160 L430,-150 Z" fill={g.base} stroke={g.sombra} strokeWidth={3} />
      <rect x={400} y={-252} width={100} height={110} fill={sup.base} />
      <rect x={460} y={-252} width={40} height={110} fill={sup.sombra} opacity={0.6} />
      <rect x={388} y={-268} width={124} height={18} rx={4} fill={sup.luz} stroke={g.sombra} strokeWidth={3} />
      {[410, 440, 470].map((px) => (
        <rect key={px} x={px} y={-238} width={20} height={20} rx={3} fill={luces > 0.01 ? mezclaColor("#2E4C78", C.amarillo, luces) : "#2E4C78"} />
      ))}
      <path d="M476,-268 L476,-480 M444,-430 L508,-430" stroke={g.sombra} strokeWidth={7} strokeLinecap="round" />
      {/* bodegas (escotillas) */}
      {POSTES.map((px) => (
        <rect key={`h${px}`} x={px - 52} y={-112} width={44} height={14} rx={3} fill={g.sombra} />
      ))}
      {/* grúas en forma de marco */}
      {POSTES.map((px, k) => (
        <g key={px}>
          <path d={`M${px + 18},-104 L${px + 18},-372`} stroke={oscurecer("#6B7385", 0.45)} strokeWidth={11} />
          <path d={`M${px},-108 L${px},-384`} stroke={g.base} strokeWidth={14} />
          <path d={`M${px - 4},-108 L${px - 4},-384`} stroke={g.luz} strokeWidth={4} opacity={0.6} />
          <rect x={px - 12} y={-392} width={44} height={14} rx={3} fill={g.sombra} />
          <path d={`M${px},-150 L${px + (k % 2 ? -120 : 120)},-306`} stroke={g.sombra} strokeWidth={7} strokeLinecap="round" />
          <path d={`M${px},-380 L${px + (k % 2 ? -120 : 120)},-306`} stroke={C.navy} strokeWidth={2} opacity={0.6} />
          <path d={`M${px + (k % 2 ? -120 : 120)},-306 L${px + (k % 2 ? -120 : 120)},-${200 + Math.sin(fl.f / 20 + k) * 6}`} stroke={C.navy} strokeWidth={2} opacity={0.5} />
        </g>
      ))}
      {/* popa: casa, chimenea y palo */}
      <rect x={-600} y={-158} width={190} height={50} fill={sup.base} />
      <rect x={-600} y={-158} width={190} height={10} fill={sup.luz} />
      {ojosBuey([-570, -530, -490, -450], -132, 7, luces, "#5A6070", "ob2")}
      <rect x={-490} y={-336} width={50} height={180} fill={C.negro} />
      <rect x={-484} y={-336} width={14} height={180} fill={C.gris2} opacity={0.5} />
      <rect x={-494} y={-346} width={58} height={22} rx={4} fill={oscurecer(C.negro, 0.2)} />
      <path d="M-560,-158 L-560,-420" stroke={g.sombra} strokeWidth={7} strokeLinecap="round" />
      {humo ? <Humo x={-465} y={-346} f={fl.f + 200} s={0.7} variante="chimenea" viento={-1.2} semilla="carbon" /> : null}
      <LucesNav f={fl.f} luces={luces} tope={[476, -486]} proa={[560, -150]} popa={[-560, -426]} />
      {/* corte: bodegas con mineral y motor */}
      {corte > 0.01 ? (
        <g opacity={corte}>
          <path d="M560,-104 L548,70 L-520,70 Q-570,52 -576,-98 Q0,-74 560,-104 Z" fill="#2A2347" />
          {[-280, -120, 40, 200, 360].map((bx, k) => (
            <g key={bx}>
              <rect x={bx - 70} y={-80} width={140} height={146} fill="#3A3058" stroke={C.navy} strokeWidth={4} />
              {Array.from({ length: 14 }, (_, i) => {
                const rx = bx - 60 + random(`mn${k}x${i}`) * 120;
                const ry = -66 + random(`mn${k}y${i}`) * 120;
                const r = 10 + random(`mn${k}r${i}`) * 10;
                return (
                  <g key={i}>
                    <path d={`M${rx - r},${ry} L${rx - r * 0.4},${ry - r} L${rx + r * 0.7},${ry - r * 0.7} L${rx + r},${ry + r * 0.2} L${rx + r * 0.2},${ry + r} L${rx - r * 0.8},${ry + r * 0.7} Z`} fill={i % 3 ? "#5A5470" : "#6E6688"} />
                    <path d={`M${rx - r * 0.4},${ry - r} L${rx + r * 0.7},${ry - r * 0.7} L${rx + r * 0.1},${ry - r * 0.1} Z`} fill="#8E87A6" />
                  </g>
                );
              })}
            </g>
          ))}
          {/* motor */}
          <rect x={-500} y={-60} width={150} height={120} rx={8} fill="#4A5068" stroke={C.navy} strokeWidth={4} />
          {[-470, -425, -380].map((cx, k) => (
            <g key={cx}>
              <rect x={cx - 16} y={-90} width={32} height={70} rx={6} fill={k === 1 ? mezclaColor("#7C849C", C.rojo, lim(motorRoto, 0, 1) * 0.5) : "#7C849C"} stroke={C.navy} strokeWidth={3} />
              <rect x={cx - 10} y={-86} width={8} height={60} rx={3} fill={C.blanco} opacity={0.3} />
            </g>
          ))}
          {motorRoto > 0.01 ? (
            <path
              d="M-432,-90 L-424,-72 L-432,-60 L-420,-44 L-428,-26"
              stroke={C.rojo}
              strokeWidth={5}
              fill="none"
              strokeLinejoin="round"
              strokeDasharray="1 1"
              pathLength={1}
              strokeDashoffset={1 - lim(motorRoto, 0, 1)}
            />
          ) : null}
        </g>
      ) : null}
    </g>
  );
  return <Flota {...fl} largo={1210} arte={arte} />;
};

/**
 * Carguero chico de vapor de los años 20 (tipo Cotopaxi; ≈ 810 × 420 a s=1): casco negro de tres islas (castillo,
 * casa central blanca con puente, toldilla), chimenea alta crema con borde negro, dos palos con plumas.
 * naufragio 0..1 = el casco en el fondo del mar: verdoso, cubierto de corales, esponjas y algas, con peces,
 * chimenea y palos rotos y medio enterrado en arena (usa recorta={false}, mece={0}).
 * Ej.: <CargueroVapor x={960} y={680} f={f} s={1.1} humo mece={1.8} inclina={-6} />
 *      <CargueroVapor x={960} y={820} f={f} naufragio={1} recorta={false} mece={0} inclina={-4} />
 */
export const CargueroVapor: React.FC<BarcoProps & { naufragio?: number }> = ({ luces = 0, humo, naufragio = 0, ...fl }) => {
  const n = lim(naufragio, 0, 1);
  const tinte = (c: string) => (n > 0 ? mezclaColor(c, "#4F6A5A", 0.7 * n) : c);
  const casco = dosTonos(tinte("#2C2F3E"));
  const casa = dosTonos(tinte("#EDEAE0"), 0.6);
  const chim = dosTonos(tinte("#E2C27A"));
  const arte = () => (
    <g>
      <path d="M400,-112 L384,60 L-350,60 Q-396,44 -404,-104 L-290,-104 L-290,-84 L280,-84 L280,-112 Z" fill={casco.base} />
      {n < 0.5 ? <path d="M398,-2 L384,60 L-350,60 Q-396,44 -402,-2 Z" fill={C.rojo2} /> : null}
      <path d="M400,-112 L398,-60 L-404,-58 L-404,-104 L-290,-104 L-290,-84 L280,-84 L280,-112 Z" fill={casco.luz} opacity={0.3} />
      <path d="M-404,-104 L-290,-104 L-290,-84 L280,-84 L280,-112 L400,-112" stroke={casco.sombra} strokeWidth={5} fill="none" />
      {ojosBuey([350, 310, -340, -310], -60, 7, luces * (1 - n), "#1A1C28")}
      {/* casa central y puente */}
      <rect x={-70} y={-170} width={150} height={86} fill={casa.base} />
      <rect x={30} y={-170} width={50} height={86} fill={casa.sombra} opacity={0.6} />
      <rect x={-40} y={-214} width={110} height={46} fill={casa.base} stroke={casa.sombra} strokeWidth={3} />
      {[-30, 0, 30].map((px) => (
        <rect key={px} x={px} y={-204} width={20} height={18} rx={3} fill={luces > 0.01 && n < 0.5 ? mezclaColor("#2E4C78", C.amarillo, luces) : tinte("#2E4C78")} />
      ))}
      {ojosBuey([-50, -20, 10, 40], -130, 7, luces * (1 - n), tinte("#8A8A80"), "ob2")}
      {/* chimenea */}
      <g transform={n > 0.5 ? "rotate(-18 -10 -214)" : undefined}>
        <rect x={-32} y={n > 0.5 ? -290 : -340} width={46} height={n > 0.5 ? 76 : 126} fill={chim.base} />
        <rect x={-26} y={n > 0.5 ? -290 : -340} width={12} height={n > 0.5 ? 76 : 126} fill={chim.luz} opacity={0.6} />
        {n < 0.5 ? <rect x={-36} y={-352} width={54} height={26} rx={4} fill={C.negro} /> : null}
      </g>
      {/* palos y plumas */}
      <g transform={n > 0.5 ? "rotate(24 210 -84)" : undefined}>
        <path d="M210,-84 L210,-390" stroke={casco.sombra} strokeWidth={9} strokeLinecap="round" />
        <path d="M210,-130 L320,-250" stroke={casco.sombra} strokeWidth={6} strokeLinecap="round" />
      </g>
      <path d={`M-220,-84 L-220,${n > 0.5 ? -230 : -380}`} stroke={casco.sombra} strokeWidth={9} strokeLinecap="round" />
      <path d="M-220,-130 L-320,-250" stroke={casco.sombra} strokeWidth={6} strokeLinecap="round" opacity={n > 0.5 ? 0 : 1} />
      <path d="M210,-390 L-40,-214 M-220,-380 L-40,-214 M210,-390 L398,-112 M-220,-380 L-404,-104" stroke={C.navy} strokeWidth={2} opacity={n > 0.5 ? 0 : 0.5} />
      {humo && n < 0.5 ? <Humo x={-9} y={-352} f={fl.f + 200} s={0.6} variante="chimenea" viento={-1.4} semilla="cotopaxi" /> : null}
      <LucesNav f={fl.f} luces={luces * (1 - n)} tope={[210, -396]} proa={[380, -120]} popa={[-220, -386]} />
      {/* naufragio */}
      {n > 0.01 ? (
        <g opacity={n}>
          {[[-200, -40, 34, 22], [120, -30, 40, 24], [300, -50, 22, 18]].map(([hx, hy, rx, ry], k) => (
            <ellipse key={k} cx={hx} cy={hy} rx={rx} ry={ry} fill="#18242A" />
          ))}
          {Array.from({ length: 26 }, (_, k) => {
            const px = -390 + random(`cv${k}`) * 780;
            const py = -110 + random(`cw${k}`) * 70 - (Math.abs(px) < 80 ? 70 : 0);
            const col = [C.rojo, "#F49AB0", C.naranja, "#9AD28C", C.lila, C.amarillo][k % 6];
            const r = 9 + random(`cr${k}`) * 18;
            return (
              <g key={k}>
                <circle cx={px} cy={py} r={r} fill={oscurecer(col, 0.15)} />
                <circle cx={px - r * 0.25} cy={py - r * 0.3} r={r * 0.6} fill={col} />
                <circle cx={px - r * 0.4} cy={py - r * 0.45} r={r * 0.22} fill={aclarar(col, 0.5)} />
              </g>
            );
          })}
          {[-330, -120, 80, 250].map((px, k) => (
            <path key={px} d={`M${px},-100 Q${px + 18 + Math.sin(fl.f / 17 + k) * 12},-170 ${px + Math.sin(fl.f / 14 + k) * 18},-240`} stroke="#4E9A6A" strokeWidth={9} fill="none" strokeLinecap="round" />
          ))}
          {[0, 1, 2, 3, 4].map((k) => {
            const a = fl.f / 30 + k * 1.3;
            const px = Math.cos(a) * (300 - k * 30);
            const py = -230 + Math.sin(a * 1.4) * 60 - k * 14;
            return (
              <g key={k} transform={`translate(${px},${py}) scale(${Math.sin(a) > 0 ? -1 : 1},1)`}>
                <path d="M-18,0 Q0,-12 18,0 Q0,12 -18,0 Z M18,0 L30,-10 L30,10 Z" fill={[C.amarillo, C.teal, C.naranja][k % 3]} />
              </g>
            );
          })}
          <path d="M-560,60 Q-260,-30 0,10 Q260,-36 560,60 L620,700 L-620,700 Z" fill="#3E4A5E" />
          <path d="M-560,60 Q-260,-30 0,10 Q260,-36 560,60 L556,78 Q260,-16 0,28 Q-260,-12 -556,78 Z" fill="#56627A" />
        </g>
      ) : null}
    </g>
  );
  return <Flota {...fl} largo={810} arte={arte} />;
};

/** Puntos del tanquero (locales, ×s + x,y): la punta del ala del puente para el vigía, la chimenea y la proa. */
export const PUNTOS_TANQUERO = { vigia: [230, -232] as [number, number], chimenea: [-510, -300] as [number, number], proa: [640, -110] as [number, number] };

/**
 * Tanquero de los años 40 (tipo T2; ≈ 1310 × 380 a s=1): casco largo y bajo, castillo a proa, casa del puente
 * en el medio (blanca), casa de máquinas a popa con chimenea, pasarela elevada de proa a popa y tuberías en
 * cubierta. Para poner al vigía: PUNTOS_TANQUERO.vigia. De noche: luces={1}.
 * Ej.: <Tanquero x={960} y={760} f={f} s={1.2} luces={1} humo />
 */
export const Tanquero: React.FC<BarcoProps> = ({ luces = 0, humo, ...fl }) => {
  const casco = dosTonos("#3D4458");
  const casa = dosTonos("#E8E6DE", 0.6);
  const ventana = luces > 0.01 ? mezclaColor("#2E4C78", C.amarillo, luces) : "#2E4C78";
  const arte = () => (
    <g>
      <path d="M650,-112 L628,60 L-600,60 Q-646,40 -652,-78 L520,-78 L520,-112 Z" fill={casco.base} />
      <path d="M648,-2 L628,60 L-600,60 Q-646,40 -650,-2 Z" fill={C.rojo2} />
      <path d="M648,-14 L648,-2 L-650,-2 L-650,-12 Z" fill={C.negro} />
      <path d="M-652,-78 L520,-78 L520,-112 L650,-112" stroke={casco.sombra} strokeWidth={5} fill="none" />
      <path d="M650,-112 L646,-60 L-652,-48 L-652,-78 L520,-78 L520,-112 Z" fill={casco.luz} opacity={0.25} />
      {/* tuberías y pasarela */}
      <path d="M500,-86 L-400,-86" stroke={casco.sombra} strokeWidth={6} />
      <path d="M500,-92 L-400,-92" stroke={C.gris} strokeWidth={3} opacity={0.6} />
      <path d="M520,-120 L230,-120 M60,-120 L-420,-120" stroke={C.gris2} strokeWidth={5} />
      {[480, 380, 280, 0, -100, -200, -300, -400].map((px) => (
        <path key={px} d={`M${px},-120 L${px},-78`} stroke={C.gris2} strokeWidth={3} />
      ))}
      {/* casa del puente */}
      <rect x={60} y={-160} width={170} height={82} fill={casa.base} />
      <rect x={170} y={-160} width={60} height={82} fill={casa.sombra} opacity={0.55} />
      <rect x={80} y={-220} width={130} height={62} fill={casa.base} stroke={casa.sombra} strokeWidth={3} />
      <rect x={40} y={-236} width={210} height={16} rx={4} fill={casa.luz} stroke={casa.sombra} strokeWidth={3} />
      {[92, 124, 156, 188].map((px) => (
        <rect key={px} x={px} y={-208} width={22} height={20} rx={3} fill={ventana} />
      ))}
      {ojosBuey([80, 110, 140], -122, 7, luces, "#8A8A80")}
      <path d="M150,-236 L150,-330 M126,-300 L174,-300" stroke={casco.sombra} strokeWidth={6} strokeLinecap="round" />
      {/* popa: casa de máquinas y chimenea */}
      <rect x={-650} y={-170} width={240} height={92} fill={casa.base} />
      <rect x={-650} y={-170} width={240} height={12} fill={casa.luz} />
      {ojosBuey([-620, -580, -540, -500, -460], -126, 7, luces, "#8A8A80", "ob2")}
      <path d="M-540,-170 L-536,-300 L-482,-300 L-478,-170 Z" fill={casco.base} />
      <path d="M-540,-170 L-536,-300 L-522,-300 L-526,-170 Z" fill={casco.luz} opacity={0.4} />
      <rect x={-540} y={-262} width={62} height={18} fill={C.rojo} />
      {/* palos */}
      <path d="M570,-112 L570,-330 M540,-290 L600,-290" stroke={casco.sombra} strokeWidth={7} strokeLinecap="round" />
      <path d="M-300,-120 L-300,-300" stroke={casco.sombra} strokeWidth={6} strokeLinecap="round" />
      {humo ? <Humo x={-509} y={-302} f={fl.f + 200} s={0.6} variante="chimenea" viento={-1.2} semilla="tanq" /> : null}
      <LucesNav f={fl.f} luces={luces} tope={[570, -336]} proa={[620, -118]} popa={[-300, -306]} />
    </g>
  );
  return <Flota {...fl} largo={1310} arte={arte} />;
};

/**
 * Lancha de paseo con cabina (≈ 450 × 200 a s=1). variante "guardacostas": casco blanco con franja diagonal roja,
 * cabina gris, barra de luces y reflector (foco 0..1 = haz de luz hacia adelante). tripulantes 0..2 = siluetas
 * sencillas en la cubierta de atrás (sin caras). De noche: luces={1}.
 * Ej.: <Lancha x={900} y={700} f={f} s={1.4} luces={1} tripulantes={2} />
 *      <Lancha x={1200} y={700} f={f} variante="guardacostas" foco={suave(f, w(4), w(5))} avanza={1} />
 */
export const Lancha: React.FC<BarcoProps & { variante?: "paseo" | "guardacostas"; tripulantes?: number; foco?: number }> = ({
  luces = 0,
  variante = "paseo",
  tripulantes = 0,
  foco = 0,
  ...fl
}) => {
  const gc = variante === "guardacostas";
  const casco = dosTonos("#F4F2EC", 0.5);
  const cab = dosTonos(gc ? "#9AA3B5" : "#E9E2D0", 0.6);
  const arte = () => (
    <g>
      {foco > 0.01 ? <path d="M80,-150 L900,-260 L900,40 Z" fill="#FFF6C8" opacity={0.28 * foco} /> : null}
      <path d="M232,-68 L200,-8 Q180,16 120,20 L-200,16 L-210,-52 Z" fill={casco.base} />
      <path d="M200,-8 Q180,16 120,20 L-200,16 L-204,-6 Z" fill={casco.sombra} />
      <path d="M228,-60 L-208,-44" stroke={gc ? C.navy : "#2D6FA8"} strokeWidth={8} />
      {gc ? <path d="M150,-60 L110,-60 L70,14 L110,16 Z" fill={C.rojo} /> : null}
      {gc ? <path d="M96,-60 L80,-60 L40,14 L56,15 Z" fill="#2D6FA8" /> : null}
      <path d="M232,-68 L-210,-52" stroke={casco.sombra} strokeWidth={4} />
      {/* cabina */}
      <path d="M130,-66 L96,-128 L-70,-130 L-80,-58 Z" fill={cab.base} />
      <path d="M-20,-130 L-70,-130 L-80,-58 L-20,-60 Z" fill={cab.sombra} opacity={0.5} />
      <path d="M118,-70 L92,-116 L40,-118 L40,-70 Z" fill={luces > 0.01 ? mezclaColor("#4D7FB0", C.amarillo, luces * 0.7) : "#4D7FB0"} />
      <path d="M26,-118 L-40,-118 L-44,-74 L26,-72 Z" fill={luces > 0.01 ? mezclaColor("#4D7FB0", C.amarillo, luces * 0.7) : "#4D7FB0"} />
      <path d="M86,-112 L60,-78" stroke={C.blanco} strokeWidth={5} opacity={0.5} strokeLinecap="round" />
      <path d="M100,-130 L-74,-132" stroke={cab.sombra} strokeWidth={6} />
      {/* barandas y antena */}
      <path d="M-80,-92 L-200,-84 M-200,-84 L-200,-52 M-140,-88 L-140,-52" stroke={C.gris2} strokeWidth={4} />
      <path d="M0,-132 L-10,-230" stroke={C.gris2} strokeWidth={4} strokeLinecap="round" />
      {gc ? (
        <g>
          <rect x={-20} y={-148} width={90} height={14} rx={6} fill={C.navy2} />
          <rect x={-14} y={-146} width={30} height={10} rx={4} fill={(fl.f % 20) < 10 ? C.rojo : "#3E86E0"} />
          <rect x={30} y={-146} width={30} height={10} rx={4} fill={(fl.f % 20) < 10 ? "#3E86E0" : C.rojo} />
          <circle cx={92} cy={-140} r={14} fill={C.gris} stroke={C.navy} strokeWidth={3} />
          <circle cx={98} cy={-140} r={7} fill="#FFF6C8" opacity={0.4 + 0.6 * foco} />
        </g>
      ) : null}
      {Array.from({ length: Math.round(lim(tripulantes, 0, 2)) }, (_, k) => (
        <g key={k} transform={`translate(${-130 - k * 46},-54)`}>
          <path d="M-20,0 Q-20,-40 0,-42 Q20,-40 20,0 Z" fill={C.navy2} />
          <circle cx={0} cy={-54} r={15} fill={C.navy2} />
        </g>
      ))}
      <LucesNav f={fl.f} luces={luces} tope={[-10, -236]} proa={[210, -64]} />
    </g>
  );
  return <Flota {...fl} largo={gc ? 470 : 450} arte={arte} />;
};

/**
 * Velero alto de dos palos (goleta de tipo clíper de Baltimore; ≈ 820 × 760 a s=1 con el bauprés): casco negro y
 * bajo, palos inclinados hacia atrás, velas cangrejas grandes, gavia arriba en el trinquete y foques al bauprés.
 * viento 0..1 = las velas se hinchan y el gallardete flamea; inclina = escora (negativa = se recuesta a babor,
 * hacia el agua de adelante). tripulacion 0..1 = siluetas chicas en cubierta.
 * Ej.: <VeleroAlto x={900} y={720} f={f} s={0.8} viento={0.4} />   ·   ráfaga: inclina={-interpolate(…, [0, 28])}
 */
export const VeleroAlto: React.FC<BarcoProps & { viento?: number; tripulacion?: number }> = ({ luces = 0, viento = 0.4, tripulacion = 0, ...fl }) => {
  const casco = dosTonos("#23263A");
  const vela = dosTonos("#F3EAD3", 0.5);
  const v = lim(viento, 0, 1.5);
  const ola = Math.sin(fl.f / 6) * (6 + 10 * v);
  const b = 30 + 70 * v; // panza de las velas
  const Vela = ({ d, panza }: { d: [number, number][]; panza: number }) => {
    const [a, gb, c, dd] = d;
    const p = `M${a[0]},${a[1]} L${gb[0]},${gb[1]} Q${(gb[0] + c[0]) / 2 + panza},${(gb[1] + c[1]) / 2} ${c[0]},${c[1]} L${dd[0]},${dd[1]} Q${(dd[0] + a[0]) / 2 + panza * 0.3},${(dd[1] + a[1]) / 2 + 10} ${a[0]},${a[1]} Z`;
    return (
      <g>
        <path d={p} fill={vela.base} stroke={vela.sombra} strokeWidth={3} strokeLinejoin="round" />
        <path d={`M${(a[0] + gb[0]) / 2},${(a[1] + gb[1]) / 2} Q${(gb[0] + c[0]) / 2 + panza * 0.6},${(gb[1] + c[1]) / 2 + 40} ${(c[0] + dd[0]) / 2},${(c[1] + dd[1]) / 2}`} stroke={vela.sombra} strokeWidth={22} fill="none" opacity={0.35} />
        {[0.25, 0.5, 0.75].map((t) => (
          <path
            key={t}
            d={`M${a[0] + (dd[0] - a[0]) * t},${a[1] + (dd[1] - a[1]) * t} L${gb[0] + (c[0] - gb[0]) * t},${gb[1] + (c[1] - gb[1]) * t}`}
            stroke={vela.sombra}
            strokeWidth={2}
            opacity={0.5}
          />
        ))}
      </g>
    );
  };
  const arte = () => (
    <g>
      {/* bauprés y foques */}
      <path d="M300,-96 L540,-150" stroke={casco.sombra} strokeWidth={9} strokeLinecap="round" />
      <path d={`M96,-560 L530,-146 Q${330 + b},-300 ${190},-110 Z`} fill={vela.base} stroke={vela.sombra} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M100,-470 L420,-124 Q${270 + b * 0.8},-250 ${170},-110 Z`} fill={vela.luz} stroke={vela.sombra} strokeWidth={3} strokeLinejoin="round" />
      {/* casco */}
      <path d="M330,-110 L290,0 Q260,30 200,34 L-250,30 Q-300,20 -318,-84 L-300,-88 Q0,-70 330,-110 Z" fill={casco.base} />
      <path d="M-318,-84 L-300,-88 Q0,-70 330,-110 L326,-96 Q0,-56 -312,-70 Z" fill={C.amarillo} opacity={0.85} />
      <path d="M290,0 Q260,30 200,34 L-250,30 Q-290,20 -306,-10 Z" fill={casco.sombra} />
      {ojosBuey([200, 60, -80, -220], -40, 6, luces, "#14161F")}
      {/* palos */}
      <path d="M140,-90 L80,-660" stroke="#8A5E3A" strokeWidth={13} strokeLinecap="round" />
      <path d="M-110,-88 L-180,-720" stroke="#8A5E3A" strokeWidth={14} strokeLinecap="round" />
      {/* velas */}
      <Vela d={[[-118, -110], [-168, -580], [-410, -440], [-420, -110]]} panza={-b} />
      <Vela d={[[132, -110], [92, -520], [-70, -420], [-82, -112]]} panza={-b * 0.9} />
      <path d={`M30,-620 L150,-620 Q${100 - b * 0.4},-590 160,-560 L20,-560 Z`} fill={vela.base} stroke={vela.sombra} strokeWidth={3} />
      <path d="M20,-622 L160,-622 M14,-560 L166,-560" stroke="#6E4A2E" strokeWidth={6} strokeLinecap="round" />
      {/* gallardete */}
      <path d={`M-180,-720 L-110,${-712 + ola * 0.4} L-180,-700 Z`} fill={C.rojo} />
      {/* jarcia */}
      <path d="M80,-660 L330,-110 M-180,-720 L80,-660 M-180,-720 L-318,-84 M80,-660 L-110,-88" stroke={C.navy} strokeWidth={2} opacity={0.5} />
      {tripulacion > 0.01
        ? [-40, -150, 230].map((px, k) => (
            <g key={k} opacity={tripulacion} transform={`translate(${px},-96)`}>
              <path d="M-9,0 Q-9,-22 0,-24 Q9,-22 9,0 Z" fill={C.navy} />
              <circle cx={0} cy={-30} r={8} fill={C.navy} />
            </g>
          ))
        : null}
      <LucesNav f={fl.f} luces={luces} tope={[-180, -726]} proa={[300, -100]} />
    </g>
  );
  return <Flota {...fl} largo={700} arte={arte} />;
};

/**
 * Crucero moderno genérico (≈ 1410 × 420 a s=1): casco blanco con franja azul, seis cubiertas escalonadas con
 * filas de ventanas y balcones, botes salvavidas naranjas, chimenea a popa con franja de color. Sin nombre ni marca.
 * Ej.: <Crucero x={1000} y={760} f={f} s={0.9} avanza={0.8} luces={0.4} />
 */
export const Crucero: React.FC<BarcoProps & { franja?: string }> = ({ luces = 0, franja = C.teal2, ...fl }) => {
  const b = dosTonos("#F6F7FA", 0.5);
  const vidrio = luces > 0.01 ? mezclaColor("#3A5E8E", C.amarillo, luces * 0.8) : "#3A5E8E";
  const CUB: [number, number, number][] = [
    // [y, x0 (popa), x1 (proa)]
    [-120, -680, 640],
    [-160, -660, 560],
    [-200, -640, 500],
    [-240, -600, 440],
    [-280, -560, 360],
    [-320, -500, 260],
  ];
  const arte = () => (
    <g>
      <path d="M705,-120 L660,30 Q640,50 580,52 L-660,50 Q-700,30 -706,-120 Z" fill={b.base} />
      <path d="M690,-50 L660,30 Q640,50 580,52 L-660,50 Q-700,30 -704,-50 Z" fill="#1F3A6E" />
      <path d="M694,-62 L-704,-62" stroke={franja} strokeWidth={10} />
      {CUB.map(([yy, x0, x1], k) => (
        <g key={k}>
          <path d={`M${x0},${yy} L${x1},${yy} L${x1 + 30},${yy + 40} L${x0},${yy + 40} Z`} fill={k % 2 ? b.base : b.luz} />
          <path d={`M${x0 + 20},${yy + 22} L${x1 - 10},${yy + 22}`} stroke={vidrio} strokeWidth={14} strokeDasharray="22 10" />
          <path d={`M${x0},${yy + 38} L${x1 + 28},${yy + 38}`} stroke={b.sombra} strokeWidth={3} />
        </g>
      ))}
      {/* botes salvavidas */}
      <path d="M-560,-118 L380,-118" stroke={C.naranja} strokeWidth={22} strokeDasharray="60 22" strokeLinecap="round" />
      <path d="M-560,-124 L380,-124" stroke={aclarar(C.naranja, 0.4)} strokeWidth={5} strokeDasharray="60 22" strokeLinecap="round" />
      {/* puente y chimenea */}
      <path d="M260,-320 L330,-320 L360,-280 L260,-280 Z" fill={b.luz} stroke={b.sombra} strokeWidth={3} />
      <path d="M268,-304 L340,-304" stroke="#22365C" strokeWidth={12} />
      <path d="M-470,-320 L-460,-420 L-360,-420 L-340,-320 Z" fill={b.base} stroke={b.sombra} strokeWidth={3} />
      <path d="M-466,-386 L-358,-386" stroke={franja} strokeWidth={22} />
      <rect x={-462} y={-432} width={100} height={16} rx={6} fill="#2A2E3E" />
      <circle cx={100} cy={-346} r={24} fill={b.luz} stroke={b.sombra} strokeWidth={3} />
      <path d="M-704,-120 L705,-120" stroke={b.sombra} strokeWidth={4} />
      <LucesNav f={fl.f} luces={luces} tope={[100, -374]} proa={[690, -126]} />
    </g>
  );
  return <Flota {...fl} largo={1410} arte={arte} />;
};

// =====================================================================================================
// Mar: fondos y piezas
// =====================================================================================================
/**
 * Fondo de mar con tormenta: cielo de nubarrones en 3 capas que corren, lluvia en diagonal, relámpagos en los
 * fotogramas `rayos`, y filas de olas picadas con espuma en las crestas, de más chicas (lejos) a enormes (cerca).
 * intensidad 0..1 (0 = mar oscuro y en calma, 1 = tormenta); noche = más oscuro; lluvia 0..1 (por defecto =
 * intensidad). Va primero dentro del Lienzo/RigCamara; los barcos se ponen encima en y ≈ horizonte + 120…300.
 * Ej.: <MarTormenta f={f} intensidad={suave(f, w(2), w(6))} rayos={[w(5), w(9)]} camara={cam} />
 */
export const MarTormenta: React.FC<{
  f: number;
  camara?: CamaraFondo;
  intensidad?: number;
  noche?: boolean;
  lluvia?: number;
  rayos?: number[];
  horizonte?: number;
  filas?: number;
  semilla?: string;
  id?: string;
}> = ({ f, camara, intensidad = 1, noche, lluvia, rayos = [], horizonte = 520, filas = 9, semilla = "mt", id = "mt" }) => {
  const I = lim(intensidad, 0, 1);
  const cx = camara?.x ?? 0;
  const cy = camara?.y ?? 0;
  const cielo = noche ? ["#0B0F26", "#1A2142", "#2A3358"] : ["#262B48", "#3D4566", "#5D6787"];
  const marLejos = noche ? "#1C2B4A" : "#3B5872";
  const marCerca = noche ? "#0A1530" : "#16304A";
  const nubeT: TonosNube = noche
    ? { luz: "#4A557F", base: "#2A3157", sombra: "#181D3C" }
    : { luz: "#8D96B4", base: "#5C6585", sombra: "#3A4262" };
  const ll = lluvia ?? I;
  const destello = rayos.reduce((m, r) => {
    const t = f - r;
    return t >= 0 && t < 16 ? Math.max(m, [1, 0.7, 0.3, 0.9, 0.5, 0.2, 0.1][Math.min(6, Math.floor(t / 2))]) : m;
  }, 0);
  const capasNube = [0.25, 0.5, 0.8].map((p, k) => {
    const n = 6 - k;
    const vel = (0.6 + 1.6 * I) * (k + 1);
    return (
      <g key={k} transform={`translate(${-cx * p},${-cy * p * 0.5})`}>
        {Array.from({ length: n }, (_, i) => {
          const w0 = 2600;
          const px = ((((i / n) * w0 - f * vel + random(`${semilla}nx${k}${i}`) * 200) % w0) + w0) % w0 - 340;
          const py = 70 + k * 120 + random(`${semilla}ny${k}${i}`) * 90;
          return (
            <NubeVolumen
              key={i}
              x={px}
              y={py}
              s={1.3 + k * 0.6}
              ancho={1.6 + random(`${semilla}na${k}${i}`)}
              semilla={`${semilla}n${k}${i}`}
              tonos={nubeT}
              luzX={-0.4}
              o={0.75 + 0.25 * I}
            />
          );
        })}
      </g>
    );
  });
  const filasL = Array.from({ length: filas }, (_, k) => {
    const t = (k + 1) / filas;
    const yk = horizonte + (H + 60 - horizonte) * Math.pow(t, 1.6);
    const amp = (4 + 95 * Math.pow(t, 1.4)) * (0.3 + 1.0 * I);
    const lam = 110 + 640 * t;
    const vel = (0.012 + 0.04 * t) * (1 + I);
    const ph = f * vel + random(`${semilla}f${k}`) * 10;
    const col = mezclaColor(mezclaColor(marLejos, marCerca, Math.pow(t, 0.7)), k % 2 ? "#000000" : "#FFFFFF", 0.05);
    const pts: string[] = [];
    const paso = lam / 10;
    const crestas: number[] = [];
    for (let xx = -120; xx <= W + 120; xx += paso) {
      const u = (xx - cx * t * 0.6) / lam + ph;
      const yy = yk - amp * Math.pow(1 - Math.abs(Math.sin(Math.PI * u)), 0.85);
      pts.push(`${fx(xx)},${fx(yy)}`);
    }
    for (let m = Math.floor(ph - 1); m < ph + (W + 240) / lam + 1; m++) {
      const xx = (m - ph) * lam + cx * t * 0.6;
      if (xx > -100 && xx < W + 100) crestas.push(xx);
    }
    return { k, t, yk, amp, col, d: `M-120,${H + 80} L${pts.join(" L")} L${W + 120},${H + 80} Z`, crestas };
  });
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-cielo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cielo[0]} />
          <stop offset="0.6" stopColor={cielo[1]} />
          <stop offset="1" stopColor={cielo[2]} />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={horizonte + 260} fill={`url(#${id}-cielo)`} />
      {destello > 0 ? <rect x={-200} y={-200} width={W + 400} height={horizonte + 260} fill="#C9D2F2" opacity={0.35 * destello} /> : null}
      {capasNube}
      {rayos.map((r, k) => (
        <Relampago key={k} x={300 + random(`${semilla}rx${k}`) * 1300} y1={60} y2={horizonte + 10} f={f} desde={r} semilla={`${id}r${k}`} flash={false} />
      ))}
      <rect x={-200} y={horizonte - 30} width={W + 400} height={60} fill={cielo[2]} opacity={0.7} />
      {filasL.map((r) => (
        <g key={r.k}>
          <path d={r.d} fill={r.col} />
          <path d={r.d} fill="none" stroke={aclarar(r.col, 0.22)} strokeWidth={4 + 16 * r.t} opacity={0.45} />
          <path d={r.d} fill="none" stroke={aclarar(r.col, 0.45)} strokeWidth={2 + 3 * r.t} opacity={0.7} />
          {I > 0.15
            ? r.crestas.map((xx, i) => (
                <path
                  key={i}
                  d={`M${fx(xx - 30 * r.t - 10)},${fx(r.yk - r.amp + 4)} q${fx(20 * r.t + 8)},${fx(-10 * r.t - 4)} ${fx(40 * r.t + 18)},${fx(-2)} q${fx(14 * r.t + 4)},${fx(8 * r.t + 3)} ${fx(30 * r.t + 10)},${fx(10 * r.t + 4)} Z`}
                  fill={C.blanco}
                  opacity={(0.55 + 0.35 * I) * (0.5 + 0.5 * r.t)}
                />
              ))
            : null}
        </g>
      ))}
      {/* espuma que vuela cerca */}
      {I > 0.3
        ? Array.from({ length: 18 }, (_, k) => {
            const t = ((f * (1.2 + random(`${semilla}s${k}`)) + k * 37) % 90) / 90;
            const px = W + 100 - t * (W + 300);
            const py = H - 140 - random(`${semilla}sy${k}`) * 260 - Math.sin(t * Math.PI) * 80;
            return <circle key={k} cx={px} cy={py} r={4 + random(`${semilla}sr${k}`) * 6} fill={C.blanco} opacity={0.5 * I * Math.sin(t * Math.PI)} />;
          })
        : null}
      {/* lluvia */}
      {ll > 0.02 ? (
        <g opacity={0.5 * ll} stroke={noche ? "#8FA0D0" : "#C9D4EA"} strokeWidth={3} strokeLinecap="round">
          {Array.from({ length: 70 }, (_, k) => {
            const t = ((f * 26 + k * 97) % (H + 200)) - 100;
            const px = ((random(`${semilla}l${k}`) * (W + 400) - t * 0.35) % (W + 400)) - 100;
            return <path key={k} d={`M${fx(px)},${fx(t)} l-16,46`} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

/**
 * Fondo marino profundo: degradado de abismo, rayos de luz que se mecen desde arriba, rocas lejanas y medias con
 * paralaje, piso de arena con ondas y nieve marina que deriva. oscuro 0..1 lo apaga (solo se ve lo que ilumina un
 * Sumergible). suelo = y del piso. Va primero dentro del Lienzo/RigCamara.
 * Ej.: <FondoMarino f={f} oscuro={0.7} camara={cam} />
 */
export const FondoMarino: React.FC<{ f: number; camara?: CamaraFondo; oscuro?: number; suelo?: number; semilla?: string; id?: string }> = ({
  f,
  camara,
  oscuro = 0,
  suelo = 820,
  semilla = "fm",
  id = "fm",
}) => {
  const cx = camara?.x ?? 0;
  const roca = (p: number, color: string, y0: number, alto: number, k0: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 14; i++) {
      const xx = -300 + i * 180;
      const yy = y0 - alto * (0.4 + 0.6 * random(`${semilla}${k0}r${i}`));
      pts.push(`${xx},${fx(yy)}`);
    }
    return <path d={`M-300,${H + 50} L${pts.join(" L")} L${W + 300},${H + 50} Z`} fill={color} transform={`translate(${-cx * p},0)`} />;
  };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C4478" />
          <stop offset="0.5" stopColor="#0F2A55" />
          <stop offset="1" stopColor="#081733" />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BDE6F1" stopOpacity={0.28} />
          <stop offset="1" stopColor="#BDE6F1" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id}-g)`} />
      {[0, 1, 2, 3, 4].map((k) => {
        const x0 = 200 + k * 380 + Math.sin(f / 40 + k) * 40 - cx * 0.1;
        return <path key={k} d={`M${x0},-20 L${x0 + 90},-20 L${x0 + 260},${suelo} L${x0 + 60},${suelo} Z`} fill={`url(#${id}-r)`} opacity={0.6 + 0.4 * Math.sin(f / 23 + k * 2)} />;
      })}
      {roca(0.2, "#14335F", suelo - 120, 200, 1)}
      {roca(0.5, "#1A3D6A", suelo - 30, 150, 2)}
      <g transform={`translate(${-cx * 0.9},0)`}>
        <path d={`M-400,${suelo} Q200,${suelo - 30} 900,${suelo} T2300,${suelo} L2300,${H + 100} L-400,${H + 100} Z`} fill="#3E4A5E" />
        <path d={`M-400,${suelo} Q200,${suelo - 30} 900,${suelo} T2300,${suelo} L2300,${suelo + 18} Q1600,${suelo - 8} 900,${suelo + 16} T-400,${suelo + 16} Z`} fill="#56627A" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <path key={k} d={`M${-300 + k * 420},${suelo + 70 + (k % 2) * 40} q60,-12 120,0 t120,0`} stroke="#5A667E" strokeWidth={5} fill="none" opacity={0.7} />
        ))}
      </g>
      {Array.from({ length: 40 }, (_, k) => {
        const px = ((random(`${semilla}p${k}`) * (W + 200) + f * 0.4 - cx * 0.6) % (W + 200)) - 100;
        const py = ((random(`${semilla}q${k}`) * H + f * 0.6) % H);
        return <circle key={k} cx={fx(px)} cy={fx(py)} r={1.5 + random(`${semilla}z${k}`) * 2.5} fill="#DDEFFF" opacity={0.35} />;
      })}
      {oscuro > 0.01 ? <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#030A1C" opacity={0.75 * oscuro} /> : null}
    </g>
  );
};

/**
 * Sumergible de exploración (≈ 380 × 190 a s=1, mira a la derecha), amarillo, con ventana redonda, propulsores,
 * brazo y dos focos. luz 0..1 = cono de luz hacia adelante (largo ≈ 1000·s); burbujas que suben.
 * Ej.: <Sumergible x={500} y={520} f={f} s={0.9} luz={suave(f, w(2), w(3))} />
 */
export const Sumergible: React.FC<{ x: number; y: number; f: number; s?: number; flip?: boolean; rot?: number; luz?: number }> = ({ x, y, f, s = 1, flip, rot = 0, luz = 1 }) => {
  const uid = "sub" + idL(useId());
  const a = dosTonos(C.amarillo);
  const bob = Math.sin(f / 19) * 6;
  return (
    <g transform={`translate(${x},${y + bob}) rotate(${rot + Math.sin(f / 27) * 1.5}) scale(${flip ? -s : s},${s})`}>
      <defs>
        <linearGradient id={`${uid}-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFF6C8" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FFF6C8" stopOpacity={0} />
        </linearGradient>
      </defs>
      {luz > 0.01 ? <path d="M170,-20 L1100,-300 L1100,420 L170,30 Z" fill={`url(#${uid}-l)`} opacity={luz} /> : null}
      <rect x={-190} y={60} width={340} height={12} rx={6} fill={C.gris2} />
      <path d="M-150,40 L-160,64 M100,40 L110,64" stroke={C.gris2} strokeWidth={8} />
      <path d="M-180,-40 Q-180,-96 -80,-100 L80,-100 Q180,-96 190,-10 Q180,50 80,52 L-120,52 Q-180,46 -180,-40 Z" fill={a.base} />
      <path d="M-180,-10 Q-176,46 -120,52 L80,52 Q180,50 190,-10 Q150,30 80,30 L-120,30 Q-170,24 -180,-10 Z" fill={a.sombra} />
      <path d="M-150,-78 Q-80,-92 40,-90" stroke={a.luz} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />
      <rect x={-60} y={-128} width={90} height={32} rx={8} fill={a.sombra} />
      <circle cx={-14} cy={-136} r={8} fill={(f % 30) < 15 ? C.rojo : "#7A2B2B"} />
      <circle cx={120} cy={-20} r={44} fill={C.gris2} />
      <circle cx={120} cy={-20} r={34} fill="#2C5D8E" />
      <circle cx={108} cy={-32} r={10} fill={C.blanco} opacity={0.6} />
      {[-10, 30].map((ly, k) => (
        <g key={k}>
          <rect x={160} y={ly - 10} width={26} height={20} rx={4} fill={C.gris2} />
          <circle cx={188} cy={ly} r={9} fill="#FFF6C8" opacity={0.5 + 0.5 * luz} />
        </g>
      ))}
      <path d="M60,46 L110,90 L150,80" stroke={C.gris2} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={-210} y={-40} width={36} height={56} rx={10} fill={C.gris2} />
      <path d="M-212,-30 L-232,-12 M-212,6 L-232,-12" stroke={C.gris} strokeWidth={4} />
      {Array.from({ length: 6 }, (_, k) => {
        const t = ((f + k * 15) % 90) / 90;
        return <circle key={k} cx={-224 + Math.sin(t * 9 + k) * 10} cy={-20 - t * 260} r={4 + t * 6} fill="none" stroke="#DDEFFF" strokeWidth={2.5} opacity={0.7 * (1 - t)} />;
      })}
    </g>
  );
};

/**
 * Arrecife en corte (vista de lado del agua poco profunda): superficie arriba en y, agua turquesa clara con
 * reflejos, fondo de arena a `prof` px y cabezas de coral que casi tocan la superficie, pastos que se mecen y
 * peces. x,y = centro de la superficie; w = ancho. Encima va un casco que roza (CargueroVapor con recorta).
 * Ej.: <ArrecifeCorte x={960} y={620} w={2000} prof={300} f={f} />
 */
export const ArrecifeCorte: React.FC<{ x: number; y: number; w?: number; prof?: number; f: number; semilla?: string }> = ({ x, y, w = 1920, prof = 260, f, semilla = "ar" }) => {
  const uid = "arr" + idL(useId());
  const x0 = x - w / 2;
  const n = Math.round(w / 170);
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5FD3D0" />
          <stop offset="1" stopColor="#2E9FB0" />
        </linearGradient>
      </defs>
      <rect x={x0} y={y} width={w} height={prof + 200} fill={`url(#${uid}-a)`} />
      {[0, 1, 2, 3].map((k) => (
        <path
          key={k}
          d={`M${x0 + ((f * 1.2 + k * 300) % w)},${y + 40 + k * 50} q40,-10 80,0 t80,0`}
          stroke={C.blanco}
          strokeWidth={4}
          fill="none"
          opacity={0.3}
        />
      ))}
      <path d={`M${x0},${y + prof} Q${x0 + w * 0.25},${y + prof - 40} ${x0 + w * 0.5},${y + prof} T${x0 + w},${y + prof} L${x0 + w},${y + prof + 220} L${x0},${y + prof + 220} Z`} fill={PB.arena} />
      <path d={`M${x0},${y + prof + 30} Q${x0 + w * 0.25},${y + prof - 10} ${x0 + w * 0.5},${y + prof + 30} T${x0 + w},${y + prof + 30} L${x0 + w},${y + prof + 220} L${x0},${y + prof + 220} Z`} fill={PB.arena2} />
      {Array.from({ length: n }, (_, k) => {
        const cx = x0 + (k + 0.5) * (w / n) + (random(`${semilla}x${k}`) - 0.5) * 60;
        const alto = prof * (0.35 + 0.55 * random(`${semilla}h${k}`));
        const col = ["#F07A8E", C.naranja, "#B58BE0", "#F2C14E", "#E5605A"][k % 5];
        const t = dosTonos(col);
        return (
          <g key={k}>
            <path d={`M${cx - 60},${y + prof + 10} Q${cx - 70},${y + prof - alto} ${cx},${y + prof - alto - 10} Q${cx + 70},${y + prof - alto} ${cx + 60},${y + prof + 10} Z`} fill={t.base} />
            <path d={`M${cx + 10},${y + prof - alto - 8} Q${cx + 70},${y + prof - alto} ${cx + 60},${y + prof + 10} L${cx + 20},${y + prof + 10} Z`} fill={t.sombra} opacity={0.7} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={cx - 30 + i * 28} cy={y + prof - alto * (0.4 + 0.2 * i)} r={8} fill={t.luz} opacity={0.8} />
            ))}
            <path d={`M${cx + 70},${y + prof + 6} q${8 + Math.sin(f / 15 + k) * 10},-50 ${Math.sin(f / 13 + k) * 14},-100`} stroke="#3FAF7E" strokeWidth={7} fill="none" strokeLinecap="round" />
            {k % 2 ? (
              <g stroke={t.luz} strokeWidth={14} strokeLinecap="round" fill="none">
                <path d={`M${cx - 90},${y + prof + 8} L${cx - 100},${y + prof - alto * 0.5} L${cx - 120},${y + prof - alto * 0.75}`} />
                <path d={`M${cx - 100},${y + prof - alto * 0.45} L${cx - 70},${y + prof - alto * 0.7}`} />
              </g>
            ) : null}
          </g>
        );
      })}
      {[0, 1, 2].map((k) => {
        const px = x0 + ((f * (1.5 + k * 0.4) + k * 500) % (w + 100)) - 50;
        const py = y + prof * (0.35 + 0.15 * k) + Math.sin(f / 10 + k) * 10;
        return <path key={k} d={`M${px - 20},${py} Q${px},${py - 13} ${px + 20},${py} Q${px},${py + 13} ${px - 20},${py} Z M${px - 20},${py} L${px - 34},${py - 11} L${px - 34},${py + 11} Z`} fill={[C.amarillo, C.blanco, C.naranja][k]} />;
      })}
      <rect x={x0} y={y - 3} width={w} height={8} fill={C.blanco} opacity={0.55} />
    </g>
  );
};

/**
 * Salvavidas de anillo (blanco con cuartos rojos y cabo), que flota meciéndose. x,y = centro; r = radio (60).
 * Ej.: <Salvavidas x={interpolate(f, [w(3), w(9)], [700, 1300], fijo)} y={640} f={f} />
 */
export const Salvavidas: React.FC<{ x: number; y: number; f: number; r?: number; rot?: number }> = ({ x, y, f, r = 60, rot = 0 }) => {
  const c = 2 * Math.PI * r;
  const bob = Math.sin(f / 13) * 5;
  return (
    <g transform={`translate(${x},${y + bob}) rotate(${rot + Math.sin(f / 20) * 8}) scale(1,0.62)`}>
      <circle r={r} fill="none" stroke="rgba(18,12,46,0.35)" strokeWidth={r * 0.46} transform="translate(4,8)" />
      <circle r={r} fill="none" stroke={C.blanco} strokeWidth={r * 0.44} />
      <circle r={r} fill="none" stroke={C.rojo} strokeWidth={r * 0.44} strokeDasharray={`${c / 8} ${c / 8}`} />
      <circle r={r - r * 0.12} fill="none" stroke={C.navy} strokeWidth={2} opacity={0.3} />
      <circle r={r} fill="none" stroke={PB.arena2} strokeWidth={4} strokeDasharray={`${c / 16} ${c / 16}`} />
    </g>
  );
};

/**
 * Huracán visto desde arriba (para mapas): bandas en espiral que giran en sentido antihorario, ojo y pared del
 * ojo brillante. x,y = ojo; r = radio (160). o = opacidad (para que aparezca y se vaya).
 * Ej.: <Huracan x={interpolate(f, [0, 120], [1400, 700], fijo)} y={interpolate(f, [0, 120], [800, 420], fijo)} f={f} r={110} />
 */
export const Huracan: React.FC<{ x: number; y: number; f: number; r?: number; o?: number; giro?: number }> = ({ x, y, f, r = 160, o = 1, giro = 2.2 }) => {
  if (o <= 0.01) return null;
  const brazo = (k: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const a = k * ((2 * Math.PI) / 4) + t * 4.2;
      const rr = r * (0.16 + 0.9 * t);
      pts.push(`${fx(Math.cos(a) * rr)},${fx(Math.sin(a) * rr)}`);
    }
    return `M${pts.join(" L")}`;
  };
  return (
    <g transform={`translate(${x},${y}) rotate(${-f * giro})`} opacity={o}>
      <circle r={r * 1.05} fill={C.blanco} opacity={0.12} />
      <circle r={r * 0.7} fill={C.blanco} opacity={0.18} />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <path d={brazo(k)} stroke="#C9D2E6" strokeWidth={r * 0.26} fill="none" strokeLinecap="round" opacity={0.55} />
          <path d={brazo(k)} stroke={C.blanco} strokeWidth={r * 0.12} fill="none" strokeLinecap="round" opacity={0.8} />
        </g>
      ))}
      <circle r={r * 0.2} fill="#E9EEF8" />
      <circle r={r * 0.09} fill="#2C3D63" />
    </g>
  );
};

/**
 * Corriente que corre como un río a lo largo de `puntos` (pantalla): franja ancha translúcida, núcleo claro, rayas
 * que fluyen y flechas que avanzan. p 0..1 = se dibuja desde el primer punto. vel = rapidez del flujo.
 * Ej. (Corriente del Golfo en un mapa): <CorrienteRio puntos={GOLFO.map(([lo, la]) => [pr(lo, la).x, pr(lo, la).y])} f={f} p={suave(f, w(2), w(5))} />
 */
export const CorrienteRio: React.FC<{
  puntos: [number, number][];
  f: number;
  p?: number;
  ancho?: number;
  color?: string;
  vel?: number;
  flechas?: number;
  o?: number;
}> = ({ puntos, f, p = 1, ancho = 46, color = "#3FD6C8", vel = 1, flechas = 6, o = 1 }) => {
  if (p <= 0.001 || puntos.length < 2) return null;
  // camino suave (Catmull-Rom → Bézier)
  const P = puntos;
  let d = `M${fx(P[0][0])},${fx(P[0][1])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(P.length - 1, i + 2)];
    d += ` C${fx(p1[0] + (p2[0] - p0[0]) / 6)},${fx(p1[1] + (p2[1] - p0[1]) / 6)} ${fx(p2[0] - (p3[0] - p1[0]) / 6)},${fx(p2[1] - (p3[1] - p1[1]) / 6)} ${fx(p2[0])},${fx(p2[1])}`;
  }
  const largos = P.slice(1).map((q, i) => Math.hypot(q[0] - P[i][0], q[1] - P[i][1]));
  const total = largos.reduce((a, b) => a + b, 0);
  const enLargo = (u: number) => {
    let L = u * total;
    for (let i = 0; i < largos.length; i++) {
      if (L <= largos[i] || i === largos.length - 1) {
        const t = largos[i] ? L / largos[i] : 0;
        const a = P[i];
        const b = P[i + 1];
        return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, ang: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
      }
      L -= largos[i];
    }
    return { x: P[0][0], y: P[0][1], ang: 0 };
  };
  const dash = { pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - lim(p, 0, 1) };
  return (
    <g opacity={o}>
      <path d={d} stroke={color} strokeWidth={ancho * 1.6} fill="none" strokeLinecap="round" opacity={0.18} {...dash} />
      <path d={d} stroke={color} strokeWidth={ancho} fill="none" strokeLinecap="round" opacity={0.45} {...dash} />
      <path d={d} stroke={aclarar(color, 0.4)} strokeWidth={ancho * 0.35} fill="none" strokeLinecap="round" opacity={0.6} {...dash} />
      <path d={d} stroke={C.blanco} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="26 60" strokeDashoffset={-f * 4 * vel} opacity={0.75 * lim(p * 2 - 1, 0, 1)} />
      {Array.from({ length: flechas }, (_, k) => {
        const u = ((k / flechas + (f * 0.004 * vel)) % 1) * lim(p, 0, 1);
        const q = enLargo(u);
        return (
          <g key={k} transform={`translate(${fx(q.x)},${fx(q.y)}) rotate(${fx(q.ang)})`} opacity={0.9 * lim(p * 3 - k / flechas, 0, 1)}>
            <path d={`M${-ancho * 0.3},${-ancho * 0.3} L${ancho * 0.15},0 L${-ancho * 0.3},${ancho * 0.3}`} stroke={C.blanco} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
};

/**
 * Brújula náutica con dos agujas: `verdadero` (roja, «TRUE») y `magnetico` (teal, «MAGNETIC»; sin ella, una sola
 * aguja). Rosa de los vientos con N E S W, aro de laton con volumen y vidrio con reflejo. etiquetas 0..1 = pastillas
 * TRUE / MAGNETIC junto a la punta de cada aguja, una a cada lado (size 40; ocupan hasta y − 1,5 r). out 0..1 = la brújula falla: la aguja da vueltas sin
 * rumbo, la rosa se apaga y entra un letrero rojo «OUT» (o `textoOut`). rumbo = giro de la rosa (grados).
 * x,y = centro; r = radio (220). Mide ≈ 2,3 r de ancho con el aro.
 * Ej.: <BrujulaDoble x={960} y={560} f={f} verdadero={0} magnetico={interpolate(f, [w(3), w(6)], [0, -14], fijo)} etiquetas={pop(f, w(4))} />
 *      <BrujulaDoble x={1500} y={700} f={f} r={150} out={pop(f, w(7))} />
 */
export const BrujulaDoble: React.FC<{
  x: number;
  y: number;
  f: number;
  r?: number;
  verdadero?: number;
  magnetico?: number;
  etiquetas?: number;
  out?: number;
  textoOut?: string;
  rumbo?: number;
  tiembla?: number;
}> = ({ x, y, f, r = 220, verdadero = 0, magnetico, etiquetas = 0, out = 0, textoOut = "OUT", rumbo = 0, tiembla = 0.4 }) => {
  const laton = dosTonos(PB.oro);
  const O = lim(out, 0, 1);
  const loco = O > 0 ? f * 9 * O + Math.sin(f / 3) * 60 * O : 0;
  const temb = Math.sin(f / 4) * 2.5 * tiembla;
  const Aguja = ({ ang, color, larga }: { ang: number; color: string; larga: number }) => (
    <g transform={`rotate(${ang})`}>
      <path d={`M0,${-r * larga} L${r * 0.07},0 L0,${r * 0.12} L${-r * 0.07},0 Z`} fill={color} />
      <path d={`M0,${-r * larga} L${r * 0.07},0 L0,0 Z`} fill={oscurecer(color, 0.25)} />
      <path d={`M0,${r * larga * 0.75} L${r * 0.06},0 L${-r * 0.06},0 Z`} fill={C.crema} stroke={C.navy} strokeWidth={2} />
    </g>
  );
  const pastilla = (ang: number, texto: string, color: string, lado: 1 | -1) => {
    if (etiquetas <= 0.01) return null;
    const a = ((ang - 90) * Math.PI) / 180;
    const wT = anchoT(texto, 40) * 0.9 + 36;
    const px = Math.cos(a) * (r * 1.22) + lado * (wT / 2 + 6);
    const py = Math.sin(a) * (r * 1.22) - 20;
    return (
      <g transform={`translate(${fx(px)},${fx(py)}) scale(${etiquetas})`}>
        <rect x={-wT / 2 + 5} y={-28} width={wT} height={62} rx={14} fill="rgba(18,12,46,0.35)" />
        <rect x={-wT / 2} y={-34} width={wT} height={62} rx={14} fill={color} stroke={C.navy} strokeWidth={4} />
        <T x={0} y={11} size={40} fill={C.blanco}>
          {texto}
        </T>
      </g>
    );
  };
  const vAng = verdadero + temb + loco;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={10} cy={16} r={r * 1.16} fill="rgba(18,12,46,0.35)" />
      <circle r={r * 1.16} fill={laton.sombra} />
      <circle r={r * 1.12} fill={laton.base} />
      <path d={`M${-r * 0.9},${-r * 0.62} A${r * 1.1},${r * 1.1} 0 0 1 ${r * 0.62},${-r * 0.92}`} stroke={laton.brillo} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" opacity={0.7} />
      <circle r={r * 1.0} fill={laton.sombra} />
      <g opacity={1 - 0.45 * O}>
        <circle r={r * 0.97} fill={C.crema} />
        <g transform={`rotate(${rumbo})`}>
          {Array.from({ length: 72 }, (_, k) => (
            <path
              key={k}
              d={`M0,${-r * 0.95} L0,${-r * (k % 9 === 0 ? 0.8 : k % 3 === 0 ? 0.86 : 0.9)}`}
              stroke={C.navy}
              strokeWidth={k % 9 === 0 ? 4 : 2}
              transform={`rotate(${k * 5})`}
            />
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, k) => (
            <path
              key={a}
              d={`M0,${-r * (k % 2 ? 0.42 : 0.66)} L${r * 0.07},0 L0,0 Z`}
              fill={k % 2 ? C.gris : C.navy2}
              transform={`rotate(${a})`}
              opacity={0.85}
            />
          ))}
          {["N", "E", "S", "W"].map((l, k) => (
            <g key={l} transform={`rotate(${k * 90}) translate(0,${-r * 0.62}) rotate(${-k * 90 - rumbo})`}>
              <T x={0} y={r * 0.08} size={r * 0.22} fill={l === "N" ? C.rojo : C.navy}>
                {l}
              </T>
            </g>
          ))}
        </g>
      </g>
      {magnetico !== undefined ? <Aguja ang={magnetico + temb * 0.8 + loco * 0.7} color={C.teal2} larga={0.78} /> : null}
      <Aguja ang={vAng} color={C.rojo} larga={0.86} />
      <circle r={r * 0.07} fill={laton.base} stroke={C.navy} strokeWidth={3} />
      <ellipse cx={-r * 0.35} cy={-r * 0.45} rx={r * 0.42} ry={r * 0.16} fill={C.blanco} opacity={0.22} transform={`rotate(-35 ${-r * 0.35} ${-r * 0.45})`} />
      {pastilla(vAng, "TRUE", C.rojo, magnetico !== undefined && magnetico > vAng ? -1 : 1)}
      {magnetico !== undefined ? pastilla(magnetico, "MAGNETIC", C.teal2, magnetico > vAng ? 1 : -1) : null}
      {O > 0.01 ? (
        <g transform={`translate(0,${r * 0.55}) rotate(-8) scale(${(2 - O) * O})`}>
          <rect x={-anchoT(textoOut, 70) / 2 - 34} y={-50} width={anchoT(textoOut, 70) + 68} height={100} rx={16} fill={C.rojo} stroke={C.blanco} strokeWidth={6} />
          <T x={0} y={24} size={70}>
            {textoOut}
          </T>
        </g>
      ) : null}
    </g>
  );
};

/**
 * Anemómetro: tacitas que giran arriba (más rápido con más viento) y esfera de aguja de 0 a `max` MPH con
 * zonas verde, amarilla y roja; la aguja tiembla con ráfagas. texto = pastilla con la lectura (p. ej. «60–90 MPH»).
 * x,y = centro de la esfera; r = radio (200). Ocupa ≈ 2,2 r de ancho y de y−2 r a y+1,5 r.
 * Ej.: <Anemometro x={1500} y={620} f={f} valor={interpolate(f, [w(4), w(5)], [20, 75], fijo)} texto="60–90 MPH" />
 */
export const Anemometro: React.FC<{ x: number; y: number; f: number; valor: number; r?: number; max?: number; texto?: string; textoP?: number }> = ({
  x,
  y,
  f,
  valor,
  r = 200,
  max = 100,
  texto,
  textoP = 1,
}) => {
  const a0 = -120;
  const a1 = 120;
  const ang = (v: number) => a0 + (a1 - a0) * lim(v / max, 0, 1);
  const rafaga = Math.sin(f / 2.3) * 2 * (valor / max) + Math.sin(f / 5.1) * 3 * (valor / max);
  const arco = (v0: number, v1: number, color: string) => {
    const p = (v: number) => {
      const a = ((ang(v) - 90) * Math.PI) / 180;
      return [Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82];
    };
    const [x0, y0] = p(v0);
    const [x1, y1] = p(v1);
    return <path d={`M${fx(x0)},${fx(y0)} A${r * 0.82},${r * 0.82} 0 0 1 ${fx(x1)},${fx(y1)}`} stroke={color} strokeWidth={r * 0.12} fill="none" />;
  };
  const giro = f * (2 + valor * 0.5);
  const marco = dosTonos(C.gris2);
  const wT = texto ? anchoT(texto, 48) * 0.9 + 50 : 0;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* tacitas */}
      <path d={`M0,${-r * 1.05} L0,${-r * 1.55}`} stroke={marco.base} strokeWidth={14} />
      <g transform={`translate(0,${-r * 1.6}) scale(1,0.35)`}>
        {[0, 120, 240].map((a) => {
          const t = ((a + giro) * Math.PI) / 180;
          const cx = Math.cos(t) * r * 0.5;
          const cy = Math.sin(t) * r * 0.5;
          return (
            <g key={a}>
              <path d={`M0,0 L${fx(cx)},${fx(cy)}`} stroke={marco.sombra} strokeWidth={10} />
              <circle cx={fx(cx)} cy={fx(cy)} r={r * 0.13} fill={Math.cos(t) > 0 ? C.rojo : C.rojo2} />
            </g>
          );
        })}
      </g>
      <circle cx={8} cy={14} r={r * 1.08} fill="rgba(18,12,46,0.35)" />
      <circle r={r * 1.08} fill={marco.sombra} />
      <circle r={r} fill={C.crema} />
      {arco(0, 30, "#3DBA6A")}
      {arco(30, 60, C.amarillo)}
      {arco(60, max, C.rojo)}
      {Array.from({ length: 11 }, (_, k) => (
        <path key={k} d={`M0,${-r * 0.95} L0,${-r * 0.72}`} stroke={C.navy} strokeWidth={k % 5 === 0 ? 6 : 3} transform={`rotate(${ang((k * max) / 10)})`} />
      ))}
      {[0, 50, 100].filter((v) => v <= max).map((v) => {
        const a = ((ang(v) - 90) * Math.PI) / 180;
        return (
          <T key={v} x={Math.cos(a) * r * 0.5} y={Math.sin(a) * r * 0.5 + r * 0.08} size={r * 0.2} fill={C.navy}>
            {v}
          </T>
        );
      })}
      <T x={0} y={r * 0.62} size={r * 0.2} fill={C.gris2}>
        MPH
      </T>
      <g transform={`rotate(${ang(valor) + rafaga})`}>
        <path d={`M-8,${r * 0.1} L0,${-r * 0.86} L8,${r * 0.1} Z`} fill={C.rojo} />
        <path d={`M0,${-r * 0.86} L8,${r * 0.1} L0,${r * 0.1} Z`} fill={C.rojo2} />
      </g>
      <circle r={r * 0.08} fill={C.navy} />
      <ellipse cx={-r * 0.35} cy={-r * 0.45} rx={r * 0.4} ry={r * 0.14} fill={C.blanco} opacity={0.3} transform={`rotate(-35 ${-r * 0.35} ${-r * 0.45})`} />
      {texto && textoP > 0.01 ? (
        <g transform={`translate(0,${r * 1.32}) scale(${textoP})`}>
          <rect x={-wT / 2 + 6} y={-38} width={wT} height={76} rx={18} fill="rgba(18,12,46,0.4)" />
          <rect x={-wT / 2} y={-44} width={wT} height={76} rx={18} fill={valor >= 60 ? C.rojo : C.navy2} stroke={C.blanco} strokeWidth={4} />
          <T x={0} y={10} size={48}>
            {texto}
          </T>
        </g>
      ) : null}
    </g>
  );
};

/** Lleva un valor de 0..1 a fotogramas: utilidad para el anemómetro (ráfaga brusca). */
export const rafagaViento = (f: number, en: number, de = 20, a = 75, dura = 8) =>
  interpolate(f, [en, en + dura], [de, a], fijo);
