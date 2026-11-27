// Biblioteca Plano Pop · mente y sueño: cerebro caricatura, batería por partes, barra de nivel, iconos de síntomas,
// tira de EEG (ondas despierto → microsueño), cables de EEG sobre la PersonaViva, «Zzz», ojo vigilante y osciloscopio.
// Nuevas en V11 (once días despierto); sirven para cualquier video de cerebro, sueño, salud o cansancio.
import React from "react";
import { random } from "remotion";
import { C, T } from "../kit";
import { lim } from "./paleta";
import { dosTonos, mezclaColor } from "./volumen";

export const VERDE_NIVEL = "#3DBA6A";
/** Color de un nivel 0..1: verde (lleno) → amarillo → rojo (casi vacío). */
export const colorNivel = (n: number) =>
  n >= 0.66 ? VERDE_NIVEL : n >= 0.33 ? mezclaColor(C.amarillo, VERDE_NIVEL, (n - 0.33) / 0.33 * 0.4) : mezclaColor(C.rojo, C.amarillo, lim(n / 0.33, 0, 1) * 0.5);

const ROSA = "#F29BB2";

/** Contorno del cerebro (vista de lado, frente a la izquierda), ≈ 300×200 centrado en 0,0. */
const CEREBRO_D =
  "M-140,12 C-162,-52 -112,-112 -48,-104 C-20,-132 44,-130 72,-102 C126,-104 164,-56 148,-4 C162,38 132,78 90,76 C72,100 32,104 10,88 C-22,104 -72,98 -88,74 C-132,80 -158,48 -140,12 Z";
const PLIEGUES = [
  "M-110,-20 C-90,-40 -70,-10 -50,-30 C-34,-48 -14,-30 -6,-52",
  "M-120,30 C-96,14 -80,44 -56,26 C-36,10 -22,40 0,22",
  "M-60,-80 C-48,-62 -26,-74 -16,-60",
  "M10,-92 C20,-70 44,-82 52,-62 C60,-42 86,-56 96,-38",
  "M20,-30 C36,-10 60,-28 76,-8 C92,12 112,-6 124,10",
  "M-40,58 C-20,44 0,66 22,52 C44,38 60,60 80,50",
  "M100,-70 C110,-52 128,-56 134,-36",
];

/**
 * Cerebro caricatura de dos tonos (≈ 300×200 a s=1; x,y = centro), con pliegues, cerebelo, tallo y brillo. Late apenas.
 *   cansancio 0..1: se apaga de color (rosa → gris lila) y se encorva. brillo 0..1: halo (ideas, recarga).
 *   apagon 0..1: se pone negro un instante (microsueño). cara: ojitos y boca (expresión simple) para usarlo de personaje.
 */
export const Cerebro: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  color?: string;
  cansancio?: number;
  brillo?: number;
  apagon?: number;
  cara?: "ninguna" | "normal" | "cansado" | "dormido" | "feliz";
}> = ({ x, y, f, s = 1, color = ROSA, cansancio = 0, brillo = 0, apagon = 0, cara = "ninguna" }) => {
  const col = dosTonos(mezclaColor(color, "#A99BB8", cansancio * 0.8));
  const late = 1 + Math.sin(f / 9) * 0.015 * (1 - cansancio * 0.6);
  const caido = cansancio * 8;
  return (
    <g transform={`translate(${x},${y + caido}) rotate(${cansancio * 6}) scale(${s * late})`}>
      {brillo > 0.01 ? <ellipse cx={0} cy={0} rx={190} ry={150} fill={C.amarillo} opacity={0.22 * brillo} /> : null}
      <ellipse cx={14} cy={150} rx={120} ry={14} fill="rgba(18,12,46,0.22)" />
      {/* tallo y cerebelo */}
      <path d="M26,70 C30,104 34,124 44,146 L70,146 C60,120 58,98 60,72 Z" fill={col.sombra} />
      <ellipse cx={86} cy={80} rx={52} ry={32} fill={col.sombra} />
      {[66, 80, 94].map((yy) => (
        <path key={yy} d={`M44,${yy} Q86,${yy + 8} 128,${yy - 2}`} stroke={col.base} strokeWidth={5} fill="none" opacity={0.6} />
      ))}
      <path d={CEREBRO_D} fill={col.base} />
      {/* sombra de la parte de abajo */}
      <path d="M-140,12 C-158,48 -132,80 -88,74 C-72,98 -22,104 10,88 C32,104 72,100 90,76 C132,78 162,38 148,-4 C120,40 60,50 0,52 C-60,56 -110,44 -140,12 Z" fill={col.sombra} opacity={0.75} />
      {/* surco entre lóbulos */}
      <path d="M-10,-100 C-24,-60 10,-30 -8,0 C-22,24 6,50 -4,86" stroke={col.sombra} strokeWidth={9} fill="none" strokeLinecap="round" />
      {PLIEGUES.map((d, k) => (
        <path key={k} d={d} stroke={col.sombra} strokeWidth={7} fill="none" strokeLinecap="round" />
      ))}
      {PLIEGUES.slice(0, 4).map((d, k) => (
        <path key={k} d={d} stroke={col.luz} strokeWidth={4} fill="none" strokeLinecap="round" transform="translate(-3,-5)" opacity={0.6} />
      ))}
      <ellipse cx={-70} cy={-74} rx={36} ry={14} fill={C.blanco} opacity={0.35} transform="rotate(-24 -70 -74)" />
      {cara !== "ninguna" ? (
        <g transform="translate(-40,10)">
          {cara === "dormido" || cara === "cansado" ? (
            <g stroke={C.navy} strokeWidth={6} fill="none" strokeLinecap="round">
              <path d={cara === "dormido" ? "M-34,0 Q-24,10 -14,0" : "M-34,2 L-14,2"} />
              <path d={cara === "dormido" ? "M14,0 Q24,10 34,0" : "M14,2 L34,2"} />
            </g>
          ) : (
            <g fill={C.navy}>
              <circle cx={-24} cy={0} r={8} />
              <circle cx={24} cy={0} r={8} />
              <circle cx={-27} cy={-3} r={2.5} fill={C.blanco} />
              <circle cx={21} cy={-3} r={2.5} fill={C.blanco} />
            </g>
          )}
          <path
            d={cara === "feliz" ? "M-14,22 Q0,38 14,22" : cara === "cansado" ? "M-12,28 Q0,22 12,28" : "M-10,26 Q0,32 10,26"}
            stroke={C.navy}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ) : null}
      {apagon > 0.01 ? <path d={CEREBRO_D} fill={C.negro} opacity={apagon} /> : null}
    </g>
  );
};

export type Sintoma = "ojo" | "equilibrio" | "animo" | "memoria" | "habla" | "foco" | "vigilante" | "cuerpo" | "rayo";

/** Icono blanco de un síntoma o capacidad, ≈ 2r de ancho (x,y = centro). Para batería, fichas y listas. */
export const IconoSintoma: React.FC<{ x: number; y: number; tipo: Sintoma; r?: number; color?: string }> = ({ x, y, tipo, r = 20, color = C.blanco }) => {
  const k = r / 20;
  const st = { stroke: color, strokeWidth: 4.5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let d: React.ReactNode = null;
  switch (tipo) {
    case "ojo":
    case "vigilante":
      d = (
        <g>
          <path d="M-20,0 Q0,-18 20,0 Q0,18 -20,0 Z" {...st} />
          <circle r={6} fill={color} />
          {tipo === "vigilante" ? <path d="M-12,-18 L-6,-12 M0,-21 L0,-14 M12,-18 L6,-12" {...st} strokeWidth={3.5} /> : null}
        </g>
      );
      break;
    case "equilibrio":
      d = (
        <g {...st}>
          <path d="M0,-16 L0,16 M-12,16 L12,16 M-18,-8 L18,-14" />
          <path d="M-18,-8 L-24,4 L-12,4 Z M18,-14 L12,-2 L24,-2 Z" strokeWidth={3} />
        </g>
      );
      break;
    case "animo":
      d = (
        <g>
          <circle r={17} {...st} />
          <circle cx={-6} cy={-4} r={2.6} fill={color} />
          <circle cx={6} cy={-4} r={2.6} fill={color} />
          <path d="M-8,8 Q0,2 8,8" {...st} strokeWidth={3.5} />
        </g>
      );
      break;
    case "memoria":
      d = (
        <g {...st}>
          <rect x={-16} y={-13} width={32} height={26} rx={4} />
          <path d="M-8,-13 L-8,-19 M0,-13 L0,-19 M8,-13 L8,-19 M-8,13 L-8,19 M0,13 L0,19 M8,13 L8,19" strokeWidth={3.5} />
          <rect x={-6} y={-5} width={12} height={10} rx={2} fill={color} stroke="none" />
        </g>
      );
      break;
    case "habla":
      d = (
        <g {...st}>
          <path d="M-18,-12 Q-18,-17 -13,-17 L13,-17 Q18,-17 18,-12 L18,4 Q18,9 13,9 L-4,9 L-12,17 L-11,9 L-13,9 Q-18,9 -18,4 Z" />
          <path d="M-9,-4 L9,-4" strokeWidth={3.5} />
        </g>
      );
      break;
    case "foco":
      d = (
        <g {...st}>
          <circle r={17} />
          <circle r={9} />
          <circle r={2.5} fill={color} />
        </g>
      );
      break;
    case "cuerpo":
      d = (
        <g>
          <circle cx={0} cy={-12} r={7} fill={color} />
          <path d="M-12,18 L-8,-2 L8,-2 L12,18 M-16,4 L-8,-2 M16,4 L8,-2" {...st} />
        </g>
      );
      break;
    case "rayo":
      d = <path d="M4,-20 L-10,3 L0,3 L-4,20 L10,-4 L0,-4 Z" fill={color} />;
      break;
  }
  return <g transform={`translate(${x},${y}) scale(${k})`}>{d}</g>;
};

/**
 * Batería por partes (segmentos con nombre o icono). x,y = esquina de arriba a la izquierda; w,h = caja sin el borne.
 *   niveles   0..1 por segmento (se llenan con su color: verde → amarillo → rojo; vacío = hueco oscuro).
 *   orientacion "vertical" = filas apiladas (el primero arriba; borne arriba; cada fila se llena de izquierda a derecha)
 *               "horizontal" = columnas (el primero a la izquierda; borne a la derecha; cada una se llena de abajo arriba).
 *   etiquetas textos dentro de cada segmento (solo en vertical; size = alto de fila × 0,58, mínimo 38 → filas ≥ 66 px).
 *   iconos    Sintoma por segmento (a la izquierda en vertical, arriba en horizontal).
 *   parpadeo  0..1: los segmentos en rojo laten. apagon 0..1: negro sobre toda la batería (microsueño); ruido = estática.
 *   carga     0..1: barrido brillante que recorre la batería (recarga). resalta = índice del segmento que se marca.
 */
export const BateriaSegmentos: React.FC<{
  x: number;
  y: number;
  f: number;
  niveles: number[];
  w: number;
  h: number;
  orientacion?: "vertical" | "horizontal";
  etiquetas?: string[];
  iconos?: Sintoma[];
  parpadeo?: number;
  apagon?: number;
  carga?: number;
  resalta?: number;
  s?: number;
}> = ({ x, y, f, niveles, w, h, orientacion = "vertical", etiquetas, iconos, parpadeo = 0, apagon = 0, carga = 0, resalta, s = 1 }) => {
  const n = niveles.length;
  const pad = 12;
  const gap = 8;
  const vert = orientacion === "vertical";
  const caja = dosTonos(C.gris2);
  const largo = vert ? (h - pad * 2 - gap * (n - 1)) / n : (w - pad * 2 - gap * (n - 1)) / n;
  const late = 0.55 + 0.45 * Math.sin(f / 3.2);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={10} y={12} width={w} height={h} rx={22} fill="rgba(18,12,46,0.35)" />
      {/* borne */}
      {vert ? (
        <rect x={w / 2 - w * 0.18} y={-22} width={w * 0.36} height={30} rx={8} fill={caja.sombra} />
      ) : (
        <rect x={w - 8} y={h / 2 - h * 0.18} width={30} height={h * 0.36} rx={8} fill={caja.sombra} />
      )}
      <rect width={w} height={h} rx={22} fill={caja.sombra} />
      <rect x={4} y={4} width={w - 8} height={h - 8} rx={18} fill={C.negro} />
      {niveles.map((nv0, k) => {
        const nv = lim(nv0, 0, 1);
        const col = dosTonos(colorNivel(nv));
        const sx = vert ? pad : pad + k * (largo + gap);
        const sy = vert ? pad + k * (largo + gap) : pad;
        const sw = vert ? w - pad * 2 : largo;
        const sh = vert ? largo : h - pad * 2;
        const rojo = nv < 0.33;
        const op = rojo ? 1 - parpadeo * (1 - late) : 1;
        const fw = vert ? sw * nv : sw;
        const fh = vert ? sh : sh * nv;
        const fx = sx;
        const fy = vert ? sy : sy + sh - fh;
        const et = etiquetas?.[k];
        const ic = iconos?.[k];
        const sizeE = Math.max(38, Math.min(48, sh * 0.58));
        return (
          <g key={k}>
            <rect x={sx} y={sy} width={sw} height={sh} rx={10} fill={C.navy2} />
            {nv > 0.005 ? (
              <g opacity={op}>
                <rect x={fx} y={fy} width={fw} height={fh} rx={10} fill={col.base} />
                <rect x={fx} y={fy} width={vert ? fw : fw * 0.32} height={vert ? fh * 0.3 : fh} rx={10} fill={col.luz} opacity={0.55} />
                <rect x={vert ? fx : fx + fw * 0.72} y={vert ? fy + fh * 0.78 : fy} width={vert ? fw : fw * 0.28} height={vert ? fh * 0.22 : fh} rx={8} fill={col.sombra} opacity={0.6} />
              </g>
            ) : null}
            {resalta === k ? <rect x={sx - 4} y={sy - 4} width={sw + 8} height={sh + 8} rx={13} fill="none" stroke={C.amarillo} strokeWidth={5} opacity={late} /> : null}
            {ic ? <IconoSintoma x={vert ? sx + sh * 0.5 + 4 : sx + sw / 2} y={vert ? sy + sh / 2 : sy + 26} tipo={ic} r={vert ? Math.min(22, sh * 0.32) : Math.min(18, sw * 0.32)} /> : null}
            {vert && et ? (
              <T x={sx + (ic ? sh + 14 : 20)} y={sy + sh / 2 + sizeE * 0.36} size={sizeE} anchor="start" fill={C.blanco} borde={C.navy} ls={1}>
                {et}
              </T>
            ) : null}
          </g>
        );
      })}
      {carga > 0.001 && carga < 0.999 ? (
        vert ? (
          <rect x={6} y={h - 6 - (h - 12) * carga - 14} width={w - 12} height={14} rx={7} fill={C.blanco} opacity={0.55} />
        ) : (
          <rect x={6 + (w - 12) * carga} y={6} width={14} height={h - 12} rx={7} fill={C.blanco} opacity={0.55} />
        )
      ) : null}
      {/* vidrio */}
      <path d={`M14,10 L${w * 0.45},10 L${w * 0.25},${h - 10} L14,${h - 10} Z`} fill={C.blanco} opacity={0.07} />
      {apagon > 0.01 ? (
        <g opacity={apagon}>
          <rect width={w} height={h} rx={22} fill={C.negro} />
          {Array.from({ length: 10 }, (_, k) => {
            const ry = random(`bat-r${k}-${Math.floor(f / 2)}`) * h;
            return <rect key={k} x={8} y={ry} width={w - 16} height={2 + random(`bat-h${k}`) * 3} fill={C.gris2} opacity={0.35} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

/** Barra de nivel vertical con rótulo de lado (CUERPO, ENERGÍA…). x,y = esquina de arriba; w×h. Brilla si está llena. */
export const BarraNivel: React.FC<{
  x: number;
  y: number;
  f: number;
  w: number;
  h: number;
  nivel: number;
  color?: string;
  etiqueta?: string;
  icono?: Sintoma;
  s?: number;
}> = ({ x, y, f, w, h, nivel, color = VERDE_NIVEL, etiqueta, icono, s = 1 }) => {
  const col = dosTonos(color);
  const nv = lim(nivel, 0, 1);
  const pad = 7;
  const fh = (h - pad * 2) * nv;
  const brillo = nv > 0.95 ? 0.5 + 0.5 * Math.sin(f / 7) : 0;
  const size = Math.min(44, Math.max(38, w * 0.8));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={8} y={10} width={w} height={h} rx={w / 2.6} fill="rgba(18,12,46,0.35)" />
      {brillo > 0 ? <rect x={-8} y={-8} width={w + 16} height={h + 16} rx={w / 2} fill={col.luz} opacity={0.25 * brillo} /> : null}
      <rect width={w} height={h} rx={w / 2.6} fill={C.gris2} />
      <rect x={4} y={4} width={w - 8} height={h - 8} rx={w / 3} fill={C.negro} />
      <rect x={pad} y={h - pad - fh} width={w - pad * 2} height={fh} rx={w / 3.4} fill={col.base} />
      <rect x={pad} y={h - pad - fh} width={(w - pad * 2) * 0.35} height={fh} rx={w / 4} fill={col.luz} opacity={0.6} />
      {etiqueta ? (
        <g transform={`translate(${w / 2 + size * 0.36},${h / 2}) rotate(-90)`}>
          <T x={0} y={0} size={size} fill={C.blanco} borde={C.navy}>
            {etiqueta}
          </T>
        </g>
      ) : null}
      {icono ? <IconoSintoma x={w / 2} y={h + 34} tipo={icono} r={Math.min(22, w * 0.4)} /> : null}
    </g>
  );
};

/**
 * Tira de papel de EEG que corre hacia la izquierda con la pluma a la derecha. x,y = esquina; w×h.
 *   lentoDesde / lentoHasta (fotogramas): mientras tanto el cerebro manda ondas lentas y anchas (microsueño, sueño
 *   profundo); fuera de ese tramo, ondas rápidas y apretadas (despierto). Como el papel corre, la parte lenta nace en la
 *   pluma y se va hacia la izquierda. amplitud 0..1 (0 = línea plana). vel = px por fotograma. etiqueta = rótulo amarillo
 *   que aparece sobre el tramo lento (size 44). color de la tinta.
 */
export const TiraEEG: React.FC<{
  x: number;
  y: number;
  f: number;
  w: number;
  h: number;
  lentoDesde?: number;
  lentoHasta?: number;
  amplitud?: number;
  vel?: number;
  etiqueta?: string;
  color?: string;
  s?: number;
  semilla?: string;
}> = ({ x, y, f, w, h, lentoDesde = 1e9, lentoHasta = 2e9, amplitud = 1, vel = 6, etiqueta, color = C.navy, s = 1, semilla = "eeg" }) => {
  const mezclaEn = (t: number) => lim((t - lentoDesde) / 8, 0, 1) * (1 - lim((t - lentoHasta) / 8, 0, 1));
  const mid = h / 2;
  const pts: string[] = [];
  const paso = 4;
  for (let px = 0; px <= w; px += paso) {
    const t = f - (w - px) / vel;
    const m = mezclaEn(t);
    const rapida = 0.55 * Math.sin(t * 2.2) + 0.3 * Math.sin(t * 3.9 + 1.3) + 0.25 * (random(`${semilla}${Math.floor(t * 2)}`) - 0.5);
    const lenta = Math.sin(t * 0.42) * 0.95 + 0.12 * Math.sin(t * 1.7);
    const a = (1 - m) * rapida * 0.38 + m * lenta * 0.85;
    pts.push(`${px},${(mid - a * mid * 0.92 * amplitud).toFixed(1)}`);
  }
  // tramo lento visible (para el rótulo): de dónde a dónde está en la tira
  const xL0 = w - (f - lentoDesde) * vel;
  const xL1 = w - (f - lentoHasta) * vel;
  const a0 = Math.max(0, xL0 < w ? xL0 : w);
  const a1 = Math.min(w, Math.max(0, xL1));
  const hayLento = f > lentoDesde && a0 < w;
  const yPluma = (() => {
    const t = f;
    const m = mezclaEn(t);
    const rapida = 0.55 * Math.sin(t * 2.2) + 0.3 * Math.sin(t * 3.9 + 1.3);
    const lenta = Math.sin(t * 0.42) * 0.95;
    return mid - ((1 - m) * rapida * 0.38 + m * lenta * 0.85) * mid * 0.92 * amplitud;
  })();
  const scroll = (f * vel) % 40;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={8} y={10} width={w} height={h} rx={10} fill="rgba(18,12,46,0.3)" />
      <rect width={w} height={h} rx={10} fill={C.crema} />
      {hayLento ? <rect x={Math.min(a0, a1)} y={0} width={Math.abs(a1 - a0)} height={h} fill={C.amarillo} opacity={0.22} /> : null}
      {Array.from({ length: Math.ceil(w / 40) + 1 }, (_, k) => (
        <line key={k} x1={k * 40 - scroll} y1={0} x2={k * 40 - scroll} y2={h} stroke="#E4B9B0" strokeWidth={k % 5 ? 1.2 : 2.4} />
      ))}
      {Array.from({ length: Math.floor(h / 40) + 1 }, (_, k) => (
        <line key={k} x1={0} y1={k * 40} x2={w} y2={k * 40} stroke="#E4B9B0" strokeWidth={1.2} />
      ))}
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />
      <rect x={0} y={0} width={w} height={h} rx={10} fill="none" stroke={C.gris2} strokeWidth={4} />
      {/* pluma */}
      <g transform={`translate(${w},${yPluma})`}>
        <path d="M0,0 L46,-16 L58,-8 L10,6 Z" fill={C.gris2} />
        <circle r={6} fill={C.rojo} />
      </g>
      {hayLento && etiqueta ? (
        <g transform={`translate(${lim((a0 + a1) / 2, 140, w - 140)},${-36})`}>
          <rect x={-etiqueta.length * 15.4 - 22} y={-36} width={etiqueta.length * 30.8 + 44} height={60} rx={14} fill={C.amarillo} />
          <T x={0} y={8} size={44} fill={C.navy}>
            {etiqueta}
          </T>
        </g>
      ) : null}
    </g>
  );
};

const movCabeza = (f: number, fase = 0) => {
  const ff = f + fase * 17;
  return { sube: Math.sin(ff / 11) * 3, cabeza: Math.sin(ff / 23) * 2.5 };
};

/**
 * Cables de EEG pegados a la cabeza de una PersonaViva: pásale las mismas x, y, s, f, flip y fase que a la persona y
 * ponlo DESPUÉS de ella. Electrodos de colores en el cuero cabelludo y cables que bajan hacia `hacia` (x,y en
 * coordenadas de la persona: por defecto atrás y abajo, −190, −120). p 0..1 = los cables se van poniendo.
 */
export const CablesEEG: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  flip?: boolean;
  fase?: number;
  p?: number;
  hacia?: [number, number];
}> = ({ x, y, f, s = 1, flip, fase = 0, p = 1, hacia = [-190, -120] }) => {
  const { sube, cabeza } = movCabeza(f, fase);
  const puntos: [number, number, string][] = [
    [-50, -372, C.rojo],
    [-14, -398, C.amarillo],
    [26, -394, C.teal2],
    [56, -366, C.morado],
    [-64, -336, C.naranja],
  ];
  const n = Math.round(lim(p, 0, 1) * puntos.length);
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s}) translate(0,${sube})`}>
      <g transform={`rotate(${cabeza} 0 -262)`}>
        {puntos.slice(0, n).map(([px, py, col], k) => (
          <g key={k}>
            <path
              d={`M${px},${py} C${px - 40},${py - 30} ${hacia[0] + 40},${hacia[1] - 160 + k * 18} ${hacia[0] + k * 6},${hacia[1] + k * 8}`}
              stroke={col}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={px} cy={py} r={10} fill={C.gris} />
            <circle cx={px} cy={py} r={6} fill={col} />
            <circle cx={px - 2} cy={py - 2} r={2} fill={C.blanco} />
          </g>
        ))}
      </g>
    </g>
  );
};

/** «Z z z» que suben, se mecen y se desvanecen desde (x, y). n letras; color; s escala. */
export const Zzz: React.FC<{ x: number; y: number; f: number; s?: number; n?: number; color?: string; o?: number }> = ({
  x,
  y,
  f,
  s = 1,
  n = 3,
  color = C.blanco,
  o = 1,
}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    {Array.from({ length: n }, (_, k) => {
      const ciclo = 60;
      const t = ((f + (k * ciclo) / n) % ciclo) / ciclo;
      const size = 44 + t * 40;
      const op = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
      return (
        <g key={k} transform={`translate(${t * 90 + Math.sin(t * 6 + k) * 14},${-t * 200}) rotate(${-12 + Math.sin(t * 5) * 10})`} opacity={op}>
          <T x={0} y={0} size={size} fill={color} borde={C.navy}>
            Z
          </T>
        </g>
      );
    })}
  </g>
);

/**
 * Ojo grande vigilante (paranoia, alguien que mira): almendra con iris que mira a los lados, párpados que parpadean,
 * pestañas y rayitas que vibran. ≈ 420×240 a s=1, x,y = centro. mira = [−1..1, −1..1] (si no, pasea solo).
 * abre 0..1. Amable: sin venas ni sangre.
 */
export const OjoVigilante: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  mira?: [number, number];
  abre?: number;
  iris?: string;
  id?: string;
}> = ({ x, y, f, s = 1, mira, abre = 1, iris = C.morado, id = "ojo-vig" }) => {
  const [mx, my] = mira ?? [Math.sin(f / 17) * 0.9, Math.sin(f / 23) * 0.3];
  const parp = f % 110 < 5 ? 0.1 : 1;
  const a = lim(abre, 0, 1) * parp;
  const ir = dosTonos(iris);
  const vib = Math.sin(f / 2) * 3;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: 9 }, (_, k) => {
        const ang = -150 + k * 15;
        const r0 = 150;
        const r1 = 186 + (k % 2) * 18 + vib;
        const ra = (ang * Math.PI) / 180;
        return (
          <line key={k} x1={Math.cos(ra) * r0 * 1.4} y1={Math.sin(ra) * r0 * 0.8} x2={Math.cos(ra) * r1 * 1.4} y2={Math.sin(ra) * r1 * 0.8} stroke={C.amarillo} strokeWidth={8} strokeLinecap="round" opacity={a} />
        );
      })}
      <path d="M-210,8 Q0,-150 210,8 Q0,140 -210,8 Z" fill="rgba(18,12,46,0.35)" transform="translate(8,12)" />
      <path d="M-210,0 Q0,-150 210,0 Q0,150 -210,0 Z" fill={C.blanco} />
      <g transform={`scale(1,${Math.max(0.04, a)})`}>
        <clipPath id={`${id}-clip`}>
          <path d="M-210,0 Q0,-150 210,0 Q0,150 -210,0 Z" />
        </clipPath>
        <g clipPath={`url(#${id}-clip)`}>
          <rect x={-220} y={-160} width={440} height={320} fill={C.blanco} />
          <path d="M-210,0 Q0,-150 210,0 L210,-160 L-210,-160 Z" fill={C.hielo} opacity={0.6} />
          <g transform={`translate(${mx * 80},${my * 30})`}>
            <circle r={78} fill={ir.base} />
            <circle r={78} fill="none" stroke={ir.sombra} strokeWidth={10} />
            {Array.from({ length: 14 }, (_, k) => (
              <line key={k} x1={0} y1={-40} x2={0} y2={-70} stroke={ir.luz} strokeWidth={4} transform={`rotate(${k * 25.7})`} opacity={0.6} />
            ))}
            <circle r={36} fill={C.negro} />
            <circle cx={-22} cy={-24} r={14} fill={C.blanco} opacity={0.9} />
            <circle cx={20} cy={18} r={6} fill={C.blanco} opacity={0.6} />
          </g>
        </g>
      </g>
      {/* párpado de arriba con pestañas */}
      <path d={`M-210,0 Q0,${-150 * Math.max(0.04, a)} 210,0`} stroke={C.navy} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d={`M-210,0 Q0,${150 * Math.max(0.04, a)} 210,0`} stroke={C.navy} strokeWidth={8} fill="none" strokeLinecap="round" />
      {[-120, -60, 0, 60, 120].map((px) => {
        const py = -75 * Math.max(0.04, a) * (1 - (px / 210) * (px / 210)) - 4;
        return <line key={px} x1={px} y1={py} x2={px * 1.15} y2={py - 34} stroke={C.navy} strokeWidth={9} strokeLinecap="round" />;
      })}
    </g>
  );
};

/**
 * Osciloscopio de laboratorio con pantalla verde: la traza ondula (voz con entonación) o se aplana (voz plana).
 * x,y = centro; ≈ 520×380 a s=1. plano 0..1 (1 = línea casi plana). etiqueta opcional debajo de la pantalla (size 38).
 */
export const Osciloscopio: React.FC<{ x: number; y: number; f: number; s?: number; plano?: number; etiqueta?: string }> = ({
  x,
  y,
  f,
  s = 1,
  plano = 0,
  etiqueta,
}) => {
  const caja = dosTonos("#8E97AE");
  const sw = 400;
  const sh = 230;
  const pts: string[] = [];
  for (let px = 0; px <= sw; px += 5) {
    const t = px / 28 + f / 4;
    const env = 0.6 + 0.4 * Math.sin(px / 60 + f / 9);
    const a = (Math.sin(t) * 0.7 + Math.sin(t * 2.7 + 1) * 0.3) * env * (1 - lim(plano, 0, 1) * 0.94);
    pts.push(`${px - sw / 2},${(-a * sh * 0.38).toFixed(1)}`);
  }
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-252} y={-180} width={520} height={380} rx={30} fill="rgba(18,12,46,0.35)" />
      <rect x={-260} y={-190} width={520} height={380} rx={30} fill={caja.sombra} />
      <rect x={-260} y={-190} width={520} height={366} rx={30} fill={caja.base} />
      <rect x={-250} y={-184} width={500} height={14} rx={7} fill={caja.luz} opacity={0.6} />
      <rect x={-sw / 2 - 14} y={-sh / 2 - 44} width={sw + 28} height={sh + 28} rx={20} fill={C.negro} />
      <g transform="translate(0,-30)">
        <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} rx={14} fill="#0F3B33" />
        {Array.from({ length: 9 }, (_, k) => (
          <line key={k} x1={-sw / 2 + k * (sw / 8)} y1={-sh / 2} x2={-sw / 2 + k * (sw / 8)} y2={sh / 2} stroke="#2A6B5C" strokeWidth={1.5} />
        ))}
        {Array.from({ length: 5 }, (_, k) => (
          <line key={k} x1={-sw / 2} y1={-sh / 2 + k * (sh / 4)} x2={sw / 2} y2={-sh / 2 + k * (sh / 4)} stroke="#2A6B5C" strokeWidth={1.5} />
        ))}
        <polyline points={pts.join(" ")} fill="none" stroke="#7CFFB2" strokeWidth={10} opacity={0.25} />
        <polyline points={pts.join(" ")} fill="none" stroke="#B8FFD6" strokeWidth={4} />
        <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh * 0.4} rx={14} fill={C.blanco} opacity={0.06} />
      </g>
      {[-170, -90].map((kx) => (
        <g key={kx}>
          <circle cx={kx} cy={140} r={22} fill={C.negro} />
          <rect x={kx - 3} y={120} width={6} height={18} rx={3} fill={C.gris} transform={`rotate(${Math.sin(f / 20 + kx) * 40} ${kx} 140)`} />
        </g>
      ))}
      {etiqueta ? (
        <T x={80} y={154} size={38} fill={C.navy}>
          {etiqueta}
        </T>
      ) : null}
    </g>
  );
};

/**
 * Rata de laboratorio amable, de lado y mirando a la derecha (≈ 260×130 a s=1; x,y = patas al centro). Blanca con
 * orejas, nariz y cola rosadas. camina 0..1 = patas en movimiento; dormida = ojos cerrados y respiración lenta;
 * cables = electrodos chiquitos en la cabeza con cable que sube (hasta y −220); color del pelo. Sin heridas.
 */
export const Rata: React.FC<{ x: number; y: number; f: number; s?: number; flip?: boolean; camina?: number; dormida?: boolean; cables?: boolean; color?: string }> = ({
  x,
  y,
  f,
  s = 1,
  flip,
  camina = 0,
  dormida,
  cables,
  color = "#F4F1EA",
}) => {
  const c = dosTonos(color);
  const rosa = "#F2A6B4";
  const resp = dormida ? Math.sin(f / 14) * 3 : Math.sin(f / 6) * 1.5;
  const paso = Math.sin(f / 2.2) * 10 * camina;
  const cola = Math.sin(f / 9) * 10;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={4} rx={120} ry={12} fill="rgba(18,12,46,0.25)" />
      <path d={`M-90,-30 Q-170,${-20 + cola} -230,${10 + cola * 0.5}`} stroke={rosa} strokeWidth={9} fill="none" strokeLinecap="round" />
      {[-60, 40].map((px, k) => (
        <ellipse key={px} cx={px + (k ? paso : -paso)} cy={-6} rx={18} ry={8} fill={rosa} />
      ))}
      <g transform={`translate(0,${-resp * 0.3})`}>
        <path d={`M-110,-30 Q-110,${-96 - resp} -20,${-98 - resp} Q60,-100 100,-56 Q130,-40 136,-28 Q120,-8 60,-6 L-80,-6 Q-112,-8 -110,-30 Z`} fill={c.base} />
        <path d="M-110,-30 Q-112,-8 -80,-6 L60,-6 Q120,-8 136,-28 Q100,-22 40,-24 Q-60,-20 -110,-30 Z" fill={c.sombra} opacity={0.7} />
        <path d={`M-70,${-80 - resp} Q-20,${-96 - resp} 30,-86`} stroke={C.blanco} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
        <ellipse cx={60} cy={-84} rx={24} ry={28} fill={c.sombra} />
        <ellipse cx={60} cy={-84} rx={15} ry={18} fill={rosa} />
        <circle cx={138} cy={-30} r={9} fill={rosa} />
        {dormida ? (
          <path d="M92,-56 Q100,-50 108,-56" stroke={C.navy} strokeWidth={4} fill="none" strokeLinecap="round" />
        ) : (
          <g>
            <circle cx={100} cy={-56} r={8} fill={C.navy} />
            <circle cx={97} cy={-59} r={2.5} fill={C.blanco} />
          </g>
        )}
        <g stroke={C.gris} strokeWidth={2.5}>
          <line x1={130} y1={-30} x2={166} y2={-40} />
          <line x1={130} y1={-26} x2={168} y2={-24} />
        </g>
        {cables ? (
          <g>
            <path d={`M40,-96 Q30,-160 0,-220`} stroke={C.gris2} strokeWidth={4} fill="none" />
            <path d={`M70,-98 Q70,-160 10,-220`} stroke={C.rojo} strokeWidth={4} fill="none" />
            <rect x={30} y={-108} width={46} height={14} rx={6} fill={C.gris} />
          </g>
        ) : null}
      </g>
    </g>
  );
};
