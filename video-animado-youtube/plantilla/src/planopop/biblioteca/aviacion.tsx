// Biblioteca Plano Pop · aviación: avión a reacción genérico, misil con estela y trayectoria, altímetro, velocímetro
// en Mach, radar, paracaídas, satélite, dron, piloto con casco presurizado y agente de traje.
// Nuevas para V10 (SR-71) pero genéricas. Todas van dentro de <Lienzo> (1920×1080). f = fotograma local; s = escala.
// Catálogo con ejemplos: ./CATALOGO.md
import React, { useId } from "react";
import { Easing, random } from "remotion";
import { C, T, miles } from "../kit";
import { anchoT, lim } from "./paleta";
import { PersonaViva, PersonaVivaProps } from "./personaViva";
import { aclarar, dosTonos, oscurecer } from "./volumen";
import { Postquemador } from "./efectos-ricos";

// ---------- llama de tobera (postquemador), compartida ----------
/** Llama de postquemador que sale hacia la izquierda desde (0,0); largo en px, p 0..1, con diamantes de choque. */
export const LlamaTobera: React.FC<{ f: number; p: number; largo?: number; alto?: number; diamantes?: boolean }> = ({
  f,
  p,
  largo = 150,
  alto = 26,
  diamantes = true,
}) => {
  if (p <= 0.01) return null;
  const tiembla = 1 + Math.sin(f * 1.7) * 0.08 + Math.sin(f * 0.9) * 0.05;
  const L = largo * p * tiembla;
  const h = alto / 2;
  return (
    <g>
      <path d={`M0,${-h} Q${-L * 0.5},${-h * 1.2} ${-L},0 Q${-L * 0.5},${h * 1.2} 0,${h} Z`} fill={C.naranja} opacity={0.85} />
      <path d={`M0,${-h * 0.6} Q${-L * 0.4},${-h * 0.7} ${-L * 0.72},0 Q${-L * 0.4},${h * 0.7} 0,${h * 0.6} Z`} fill={C.amarillo} />
      {diamantes
        ? [0.22, 0.42, 0.6].map((k) => (
            <path
              key={k}
              d={`M${-L * k + 8},0 L${-L * k},${-h * 0.42} L${-L * k - 8},0 L${-L * k},${h * 0.42} Z`}
              fill={C.blanco}
              opacity={0.85 * p}
            />
          ))
        : null}
    </g>
  );
};

// ---------- avión a reacción genérico ----------
/**
 * Caza a reacción genérico de perfil, morro a la derecha (≈ 440×150 a s=1; x,y = centro del fuselaje).
 * color/color2 = cuerpo y franja; postquemador 0..1 = llama; apagado = motor sin llama con humo gris (falla);
 * tiembla 0..1 = vibración. Sin insignias.
 */
export const Jet: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  flip?: boolean;
  rot?: number;
  color?: string;
  color2?: string;
  postquemador?: number;
  apagado?: boolean;
  tiembla?: number;
}> = ({ x, y, f, s = 1, flip, rot = 0, color = C.gris, color2 = C.amarillo, postquemador = 0, apagado, tiembla = 0 }) => {
  const t = dosTonos(color);
  const dy = Math.sin(f / 9) * 4 + (tiembla > 0 ? Math.sin(f * 2.3) * 4 * tiembla : 0);
  return (
    <g transform={`translate(${x},${y + dy}) rotate(${rot}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={60} rx={180} ry={10} fill="rgba(18,12,46,0.16)" />
      {apagado ? (
        <g>
          {[0, 1, 2, 3].map((k) => {
            const ph = ((f + k * 9) % 36) / 36;
            return <circle key={k} cx={-236 - ph * 150} cy={-ph * 18} r={10 + ph * 26} fill={C.gris} opacity={0.55 * (1 - ph)} />;
          })}
        </g>
      ) : (
        <g transform="translate(-230,1)">
          <LlamaTobera f={f} p={postquemador} largo={150} alto={24} />
        </g>
      )}
      <path d="M-120,-20 L-196,-104 L-160,-104 L-70,-20 Z" fill={t.sombra} />
      <path d="M-128,-26 L-186,-96 L-172,-96 L-110,-26 Z" fill={t.base} opacity={0.6} />
      <path d="M222,0 Q170,-18 90,-25 L-120,-26 Q-196,-24 -214,-12 L-214,12 Q-196,19 -120,19 L90,19 Q170,15 222,0 Z" fill={t.base} />
      <path d="M222,0 Q170,15 90,19 L-120,19 Q-196,19 -214,12 L-214,5 L-120,8 L90,8 Q170,6 222,0 Z" fill={t.sombra} />
      <path d="M196,-7 Q150,-19 90,-22 L-110,-23" stroke={t.luz} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M40,10 L-150,10 L-176,32 L-40,32 Z" fill={t.sombra} />
      <path d="M30,-8 L-12,-8 L-12,14 L30,14 Q44,3 30,-8 Z" fill={oscurecer(color, 0.55)} />
      <rect x={-70} y={-5} width={130} height={8} rx={4} fill={color2} />
      <path d="M150,-14 Q128,-46 76,-44 Q44,-40 34,-22 Z" fill={C.cielo} />
      <path d="M120,-34 Q100,-42 82,-40" stroke={C.blanco} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
      <rect x={-232} y={-12} width={22} height={26} rx={6} fill={C.gris2} />
    </g>
  );
};

// ---------- misil ----------
/** Misil tierra-aire genérico, punta a la derecha con rot 0 (≈ 190 de largo a s=1; x,y = centro). llama 0..1. */
export const Misil: React.FC<{ x: number; y: number; f: number; s?: number; rot?: number; llama?: number; color?: string }> = ({
  x,
  y,
  f,
  s = 1,
  rot = 0,
  llama = 1,
  color = C.crema,
}) => {
  const t = dosTonos(color);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <g transform="translate(-92,0)">
        <LlamaTobera f={f} p={llama} largo={90} alto={16} diamantes={false} />
      </g>
      <path d="M-92,-9 L-112,-30 L-84,-30 L-66,-9 Z" fill={C.rojo2} />
      <path d="M-92,9 L-112,30 L-84,30 L-66,9 Z" fill={C.rojo} />
      <path d="M22,-9 L8,-22 L26,-22 L40,-9 Z" fill={C.rojo2} />
      <path d="M22,9 L8,22 L26,22 L40,9 Z" fill={C.rojo} />
      <rect x={-92} y={-9} width={164} height={18} rx={8} fill={t.base} />
      <rect x={-92} y={1} width={164} height={8} rx={4} fill={t.sombra} />
      <path d="M72,-9 Q98,-7 108,0 Q98,7 72,9 Z" fill={t.luz} />
      <rect x={-40} y={-9} width={10} height={18} fill={C.rojo} />
      <rect x={-88} y={-6} width={150} height={3} rx={1.5} fill={C.blanco} opacity={0.6} />
    </g>
  );
};

/** Punto de una curva cuadrática que pasa por el ápice A en t = 0,5 (control = 2A − (P0+P1)/2). */
const curva = (x0: number, y0: number, ax: number, ay: number, x1: number, y1: number) => {
  const cx = 2 * ax - (x0 + x1) / 2;
  const cy = 2 * ay - (y0 + y1) / 2;
  const pt = (t: number) => ({
    x: (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1,
    y: (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1,
  });
  const tan = (t: number) => ({ x: 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx), y: 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy) });
  return { pt, tan };
};

/**
 * Ápice de una trayectoria que se queda CORTA: por debajo (margen px) y detrás (a la izquierda) de un objetivo.
 * Determinista por semilla. techo = y mínima permitida (nunca más arriba). Úsalo con <TrayectoriaMisil>.
 */
export const apiceDebajo = (xObj: number, yObj: number, semilla: string | number, margen = 90, techo?: number) => {
  const ax = xObj - 160 - random(`apx${semilla}`) * 420;
  const ay = Math.max(yObj + margen + random(`apy${semilla}`) * 160, techo ?? -Infinity);
  return { ax, ay };
};

/**
 * Trayectoria de misil: sale de (x0, y0), pasa por el ápice (ax, ay) y cae hacia (x1, y1) (por defecto: detrás y
 * abajo). p 0..1 = avance de la cabeza; el motor se apaga en `quema` (0..1) y el misil cae siguiendo la curva.
 * Deja una línea punteada gris (rastro 0..1 = opacidad) que se queda después de que el misil se va (p ≥ 1).
 * Estela blanca de humo detrás de la cabeza mientras vuela. s = escala del misil.
 */
export const TrayectoriaMisil: React.FC<{
  x0: number;
  y0: number;
  ax: number;
  ay: number;
  x1?: number;
  y1?: number;
  p: number;
  f: number;
  s?: number;
  quema?: number;
  rastro?: number;
  colorRastro?: string;
}> = ({ x0, y0, ax, ay, x1, y1, p, f, s = 0.5, quema = 0.55, rastro = 1, colorRastro = C.gris }) => {
  if (p <= 0.001) return null;
  const ex = x1 ?? ax - (x0 - ax) * 0.55 - 120;
  const ey = y1 ?? y0 + 40;
  const { pt, tan } = curva(x0, y0, ax, ay, ex, ey);
  const q = lim(p, 0, 1);
  const N = 48;
  const camino = (a: number, b: number) =>
    Array.from({ length: N + 1 }, (_, k) => {
      const v = pt(a + ((b - a) * k) / N);
      return `${k ? "L" : "M"}${v.x.toFixed(1)},${v.y.toFixed(1)}`;
    }).join(" ");
  const cab = pt(q);
  const d = tan(q);
  const ang = (Math.atan2(d.y, d.x) * 180) / Math.PI;
  const vuela = p < 1;
  const fueraCabeza = p >= 1 ? 0 : lim((1 - p) / 0.05, 0, 1);
  const humo = Math.max(0, q - 0.3);
  return (
    <g>
      <path d={camino(0, q)} stroke={colorRastro} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" fill="none" opacity={0.85 * rastro} />
      {vuela ? (
        <g>
          <path d={camino(humo, q)} stroke={C.blanco} strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.35} />
          <path d={camino(Math.max(0, q - 0.12), q)} stroke={C.blanco} strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.75} />
        </g>
      ) : null}
      {fueraCabeza > 0.01 ? (
        <g opacity={fueraCabeza}>
          <Misil x={cab.x} y={cab.y} f={f} s={s} rot={ang} llama={q < quema ? 1 : lim(1 - (q - quema) / 0.06, 0, 1)} />
        </g>
      ) : null}
      {q > quema && q < quema + 0.15 ? (
        <circle cx={pt(quema).x} cy={pt(quema).y} r={10 + (q - quema) * 160} fill={C.blanco} opacity={0.4 * (1 - (q - quema) / 0.15)} />
      ) : null}
    </g>
  );
};

// ---------- instrumentos ----------
/** y en pantalla de una altitud sobre una regla que va de yBase (0) a yTop (max). */
export const yAltitud = (alt: number, yBase: number, yTop: number, max: number) => yBase - (alt / max) * (yBase - yTop);

/**
 * Altímetro vertical: regla con marcas cada `paso` de 0 a `max` (rótulos «10K», «20K»… a la izquierda de la línea,
 * size 38). x = la línea; yBase = 0 ft; yTop = max. valor = altitud actual (puntero amarillo que late a la derecha).
 * rayas = marcas de color que cruzan la regla ({valor, color}); el texto de cada raya lo pones tú (no cabe aquí).
 */
export const Altimetro: React.FC<{
  x: number;
  yBase: number;
  yTop: number;
  f: number;
  max?: number;
  paso?: number;
  valor?: number;
  rayas?: { valor: number; color?: string }[];
  color?: string;
  o?: number;
}> = ({ x, yBase, yTop, f, max = 90000, paso = 10000, valor, rayas = [], color = C.blanco, o = 1 }) => {
  if (o <= 0.001) return null;
  const marcas = Array.from({ length: Math.floor(max / paso) + 1 }, (_, k) => k * paso);
  const yv = (v: number) => yAltitud(v, yBase, yTop, max);
  return (
    <g opacity={o}>
      <rect x={x - 7} y={yTop - 10} width={14} height={yBase - yTop + 20} rx={7} fill={C.navy} />
      <rect x={x - 3} y={yTop - 6} width={6} height={yBase - yTop + 12} rx={3} fill={color} opacity={0.85} />
      {marcas.map((v) => (
        <g key={v}>
          <rect x={x - 26} y={yv(v) - 3} width={52} height={6} rx={3} fill={color} />
          <T x={x - 40} y={yv(v) + 13} size={38} anchor="end" fill={color}>
            {v === 0 ? "0" : `${Math.round(v / 1000)}K`}
          </T>
          {v < max
            ? [0.25, 0.5, 0.75].map((k) => (
                <rect key={k} x={x - 12} y={yv(v + paso * k) - 2} width={24} height={4} rx={2} fill={color} opacity={0.5} />
              ))
            : null}
        </g>
      ))}
      {rayas.map((r, k) => (
        <rect key={k} x={x - 34} y={yv(r.valor) - 5} width={68} height={10} rx={5} fill={r.color ?? C.rojo} />
      ))}
      {valor !== undefined ? (
        <g transform={`translate(${x + 18},${yv(lim(valor, 0, max))}) scale(${1 + Math.sin(f / 5) * 0.06})`}>
          <path d="M0,0 L34,-20 L34,20 Z" fill={C.amarillo} stroke={C.navy} strokeWidth={4} strokeLinejoin="round" />
        </g>
      ) : null}
    </g>
  );
};

/**
 * Velocímetro de aguja en Mach (0..max, 240° de recorrido, zona roja desde `roja`). x,y = centro; r = radio.
 * Debajo: «MACH 3.2» (size 44) y, con mph, «~2,100 MPH» (size 38; ≈ 660 mph por Mach en altura, redondeado a 50).
 * mph = true (calculado) | texto propio | false. La aguja tiembla apenas.
 */
export const Machmetro: React.FC<{
  x: number;
  y: number;
  f: number;
  mach: number;
  r?: number;
  max?: number;
  roja?: number;
  mph?: boolean | string;
  o?: number;
}> = ({ x, y, f, mach, r = 100, max = 3.5, roja = 3, mph = true, o = 1 }) => {
  if (o <= 0.001) return null;
  const ang = (v: number) => -210 + 240 * (lim(v, 0, max) / max);
  const pol = (a: number, rr: number) => ({ x: Math.cos((a * Math.PI) / 180) * rr, y: Math.sin((a * Math.PI) / 180) * rr });
  const arco = (a0: number, a1: number, rr: number) => {
    const p0 = pol(a0, rr);
    const p1 = pol(a1, rr);
    return `M${p0.x},${p0.y} A${rr},${rr} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p1.x},${p1.y}`;
  };
  const a = ang(mach) + Math.sin(f / 2.5) * 0.8;
  const texto = mph === true ? `~${miles(Math.round((mach * 660) / 50) * 50)} MPH` : mph || "";
  const ticks = Array.from({ length: Math.round(max / 0.5) + 1 }, (_, k) => k * 0.5);
  return (
    <g transform={`translate(${x},${y})`} opacity={o}>
      <circle r={r + 14} fill={C.navy} />
      <circle r={r + 6} fill={C.navy2} />
      <path d={arco(ang(0), ang(max), r - 6)} stroke={C.blanco} strokeWidth={6} fill="none" opacity={0.35} />
      <path d={arco(ang(roja), ang(max), r - 6)} stroke={C.rojo} strokeWidth={12} fill="none" />
      {ticks.map((v) => {
        const p0 = pol(ang(v), r - 6);
        const p1 = pol(ang(v), v % 1 === 0 ? r - 26 : r - 18);
        return <line key={v} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={C.blanco} strokeWidth={v % 1 === 0 ? 6 : 4} strokeLinecap="round" />;
      })}
      {ticks
        .filter((v) => v % 1 === 0)
        .map((v) => {
          const p = pol(ang(v), r - 44);
          return (
            <T key={v} x={p.x} y={p.y + 13} size={38} fill={C.blanco}>
              {String(v)}
            </T>
          );
        })}
      <g transform={`rotate(${a})`}>
        <path d={`M-14,-7 L${r - 14},-2 L${r - 14},2 L-14,7 Z`} fill={C.amarillo} />
      </g>
      <circle r={13} fill={C.amarillo} />
      <circle r={5} fill={C.navy} />
      <T x={0} y={r + 76} size={44} fill={C.amarillo}>
        {`MACH ${mach.toFixed(1)}`}
      </T>
      {texto ? (
        <T x={0} y={r + 120} size={38} fill={C.teal}>
          {texto}
        </T>
      ) : null}
    </g>
  );
};

/**
 * Pantalla de radar: anillos, barrido que gira y deja estela, ecos (blips {a grados, d 0..1}) que se encienden
 * cuando pasa el barrido. texto = pastilla debajo («NOT DETECTED»), entra con escala (textoP 0..1). x,y = centro.
 */
export const Radar: React.FC<{
  x: number;
  y: number;
  f: number;
  r?: number;
  blips?: { a: number; d: number }[];
  texto?: string;
  textoP?: number;
  color?: string;
  vel?: number;
}> = ({ x, y, f, r = 260, blips = [], texto, textoP = 1, color = "#3DBA6A", vel = 4 }) => {
  const barrido = (f * vel) % 360;
  const pol = (a: number, rr: number) => ({ x: Math.cos((a * Math.PI) / 180) * rr, y: Math.sin((a * Math.PI) / 180) * rr });
  const cuna = Array.from({ length: 8 }, (_, k) => {
    const a0 = barrido - (k + 1) * 6;
    const a1 = barrido - k * 6;
    const p0 = pol(a0, r);
    const p1 = pol(a1, r);
    return <path key={k} d={`M0,0 L${p0.x},${p0.y} A${r},${r} 0 0 1 ${p1.x},${p1.y} Z`} fill={color} opacity={0.42 * (1 - k / 8)} />;
  });
  const wT = texto ? anchoT(texto, 44) + 60 : 0;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={r + 30} fill={C.navy} />
      <circle cx={8} cy={12} r={r + 30} fill="rgba(18,12,46,0.3)" />
      <circle r={r + 30} fill="#5A6078" />
      <circle r={r + 14} fill="#0E1F1A" />
      <circle r={r} fill="#0B2A20" />
      {[0.33, 0.66, 1].map((k) => (
        <circle key={k} r={r * k} fill="none" stroke={color} strokeWidth={3} opacity={0.45} />
      ))}
      <line x1={-r} y1={0} x2={r} y2={0} stroke={color} strokeWidth={2} opacity={0.35} />
      <line x1={0} y1={-r} x2={0} y2={r} stroke={color} strokeWidth={2} opacity={0.35} />
      {cuna}
      {(() => {
        const p = pol(barrido, r);
        return <line x1={0} y1={0} x2={p.x} y2={p.y} stroke={aclarar(color, 0.5)} strokeWidth={5} />;
      })()}
      {blips.map((b, k) => {
        const delta = (((barrido - b.a) % 360) + 360) % 360;
        const luz = delta < 120 ? 1 - delta / 120 : 0;
        const p = pol(b.a, b.d * r);
        return <circle key={k} cx={p.x} cy={p.y} r={10 + luz * 6} fill={aclarar(color, 0.6)} opacity={0.15 + luz * 0.85} />;
      })}
      <ellipse cx={-r * 0.4} cy={-r * 0.5} rx={r * 0.35} ry={r * 0.14} fill={C.blanco} opacity={0.08} transform={`rotate(-30 ${-r * 0.4} ${-r * 0.5})`} />
      {texto && textoP > 0.01 ? (
        <g transform={`translate(0,${r + 90}) scale(${textoP})`}>
          <rect x={-wT / 2 + 6} y={-40} width={wT} height={80} rx={20} fill="rgba(18,12,46,0.4)" />
          <rect x={-wT / 2} y={-46} width={wT} height={80} rx={20} fill={C.rojo} />
          <T x={0} y={10} size={44}>
            {texto}
          </T>
        </g>
      ) : null}
    </g>
  );
};

// ---------- personas de aviación (la misma PersonaViva con casco o traje) ----------
const movCabeza = (f: number, fase = 0) => {
  const ff = f + fase * 17;
  return { sube: Math.sin(ff / 11) * 3, cabeza: Math.sin(ff / 23) * 2.5 };
};

/**
 * Piloto con traje presurizado: la PersonaViva (mismo personaje) con casco redondo de visera y anillo de cuello.
 * Acepta todas las props de PersonaViva; traje = color del traje (por defecto ocre); visera 0..1 la oscurece.
 */
export const Piloto: React.FC<PersonaVivaProps & { traje?: string; visera?: number }> = ({ traje = "#C9A24E", visera = 0, ...p }) => {
  const { sube, cabeza } = movCabeza(p.f, p.fase);
  const s = p.s ?? 1;
  const casco = dosTonos(C.blanco, 0.6);
  return (
    <g>
      <PersonaViva {...p} abrigo={traje} peinado="calvo" />
      <g transform={`translate(${p.x},${p.y}) scale(${p.flip ? -s : s},${s}) translate(0,${sube})`}>
        <path d="M-18,-262 Q-30,-200 -10,-170" stroke={C.gris2} strokeWidth={14} fill="none" strokeLinecap="round" />
        <g transform={`rotate(${cabeza} 0 -262)`}>
          <ellipse cx={0} cy={-238} rx={80} ry={22} fill={C.gris2} />
          <ellipse cx={0} cy={-242} rx={72} ry={14} fill={C.gris} />
          <path
            d="M-94,-330 A94,94 0 1 1 94,-330 A94,94 0 1 1 -94,-330 Z M-60,-318 A60,66 0 1 0 60,-318 A60,66 0 1 0 -60,-318 Z"
            fill={casco.base}
            fillRule="evenodd"
          />
          <path d="M50,-404 A94,94 0 0 1 70,-268 L48,-282 A60,66 0 0 0 40,-372 Z" fill={casco.sombra} opacity={0.6} />
          <ellipse cx={0} cy={-318} rx={60} ry={66} fill={C.cielo} opacity={0.12 + 0.55 * visera} />
          <path d="M-40,-364 Q-20,-380 8,-378" stroke={C.blanco} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />
          <rect x={-22} y={-430} width={44} height={20} rx={8} fill={C.rojo} />
        </g>
      </g>
    </g>
  );
};

/** Agente de traje oscuro con gafas negras y corbata (rol genérico, no una persona real). Props de PersonaViva. */
export const Agente: React.FC<PersonaVivaProps> = (p) => {
  const { sube, cabeza } = movCabeza(p.f, p.fase);
  const s = p.s ?? 1;
  return (
    <g>
      <PersonaViva peinado="corto" pelo="#2B2230" {...p} abrigo={p.abrigo ?? "#2E3350"} />
      <g transform={`translate(${p.x},${p.y}) scale(${p.flip ? -s : s},${s}) translate(0,${sube})`}>
        <path d="M-26,-264 L0,-206 L26,-264 Z" fill={C.blanco} />
        <path d="M-8,-252 L8,-252 L13,-176 L0,-158 L-13,-176 Z" fill={C.rojo2} />
        <g transform={`rotate(${cabeza} 0 -262)`}>
          <rect x={-48} y={-328} width={42} height={26} rx={10} fill={C.negro} />
          <rect x={6} y={-328} width={42} height={26} rx={10} fill={C.negro} />
          <rect x={-8} y={-322} width={16} height={6} rx={3} fill={C.negro} />
          <rect x={-42} y={-324} width={14} height={5} rx={2.5} fill={C.blanco} opacity={0.35} />
          <rect x={12} y={-324} width={14} height={5} rx={2.5} fill={C.blanco} opacity={0.35} />
        </g>
      </g>
    </g>
  );
};

// ---------- paracaídas, satélite, dron ----------
/**
 * Paracaídas que baja meciéndose con el piloto colgado (Piloto a s≈0,36). x,y = cima del paracaídas; ≈ 300×480.
 * abre 0..1 = el paracaídas se infla. children opcional reemplaza al piloto (origen en los pies, y+470).
 */
export const Paracaidas: React.FC<{ x: number; y: number; f: number; s?: number; abre?: number; children?: React.ReactNode }> = ({
  x,
  y,
  f,
  s = 1,
  abre = 1,
  children,
}) => {
  if (abre <= 0.01) return null;
  const rot = Math.sin(f / 14) * 7;
  const a = 0.3 + 0.7 * abre;
  const gajos = [-1, -0.6, -0.2, 0.2, 0.6, 1];
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <g transform={`scale(${a},${0.6 + 0.4 * abre})`}>
        <path d="M-150,80 Q-150,-10 0,-10 Q150,-10 150,80 Q125,64 100,80 Q75,64 50,80 Q25,64 0,80 Q-25,64 -50,80 Q-75,64 -100,80 Q-125,64 -150,80 Z" fill={C.rojo} />
        {gajos.slice(0, 5).map((g, k) =>
          k % 2 ? (
            <path key={k} d={`M${g * 150},80 Q${g * 120},10 ${(g + gajos[k + 1]) * 40},-6 Q${gajos[k + 1] * 120},10 ${gajos[k + 1] * 150},80 Z`} fill={C.blanco} />
          ) : null,
        )}
        <path d="M-150,80 Q-150,-10 0,-10 Q60,-10 100,10 Q40,0 0,4 Q-120,6 -150,80 Z" fill={C.blanco} opacity={0.2} />
      </g>
      {[-140, -70, 0, 70, 140].map((lx) => (
        <line key={lx} x1={lx * a} y1={80} x2={lx * 0.12} y2={372} stroke={C.blanco} strokeWidth={3} opacity={0.75} />
      ))}
      {children ?? <Piloto x={0} y={470} f={f} s={0.36} sombra={false} expresion="susto" />}
    </g>
  );
};

/** Satélite espía genérico: cuerpo dorado con dos paneles solares y antena (≈ 560×220; x,y = centro). Gira apenas. */
export const Satelite: React.FC<{ x: number; y: number; f: number; s?: number; rot?: number }> = ({ x, y, f, s = 1, rot = 0 }) => {
  const oro = dosTonos("#E9B44C");
  const panel = dosTonos("#2C63B8");
  const Panel = ({ px }: { px: number }) => (
    <g transform={`translate(${px},0)`}>
      <rect x={-100} y={-62} width={200} height={124} rx={8} fill={panel.base} stroke={C.navy} strokeWidth={5} />
      {[-50, 0, 50].map((gx) => (
        <line key={gx} x1={gx} y1={-62} x2={gx} y2={62} stroke={panel.sombra} strokeWidth={4} />
      ))}
      <line x1={-100} y1={0} x2={100} y2={0} stroke={panel.sombra} strokeWidth={4} />
      <rect x={-92} y={-56} width={80} height={20} rx={6} fill={C.blanco} opacity={0.25} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y + Math.sin(f / 16) * 8}) rotate(${rot + Math.sin(f / 30) * 3}) scale(${s})`}>
      <rect x={-200} y={-6} width={400} height={12} fill={C.gris2} />
      <Panel px={-200} />
      <Panel px={200} />
      <rect x={-62} y={-72} width={124} height={144} rx={14} fill={oro.base} />
      <rect x={10} y={-72} width={52} height={144} rx={14} fill={oro.sombra} opacity={0.7} />
      <path d="M-50,-60 L30,-60" stroke={oro.brillo} strokeWidth={8} strokeLinecap="round" />
      <rect x={-30} y={72} width={60} height={30} rx={6} fill={C.gris2} />
      <circle cx={0} cy={112} r={20} fill={C.navy} />
      <circle cx={0} cy={112} r={9} fill={C.teal} opacity={0.5 + 0.5 * Math.sin(f / 5)} />
      <line x1={0} y1={-72} x2={0} y2={-110} stroke={C.gris} strokeWidth={5} />
      <circle cx={0} cy={-114} r={8} fill={C.rojo} />
    </g>
  );
};

/** Dron de vigilancia genérico de perfil, morro a la derecha (≈ 440×130; x,y = centro); la hélice de atrás gira. */
export const Dron: React.FC<{ x: number; y: number; f: number; s?: number; flip?: boolean; color?: string }> = ({
  x,
  y,
  f,
  s = 1,
  flip,
  color = "#B5B9C4",
}) => {
  const t = dosTonos(color);
  const helice = Math.abs(Math.sin(f * 1.3));
  return (
    <g transform={`translate(${x},${y + Math.sin(f / 10) * 5}) scale(${flip ? -s : s},${s})`}>
      <path d="M-150,-8 L-200,-62 L-178,-62 L-120,-8 Z" fill={t.sombra} />
      <path d="M210,-6 Q210,-40 150,-42 Q110,-42 90,-20 L-170,-12 L-170,10 L120,16 Q210,18 210,-6 Z" fill={t.base} />
      <path d="M-170,4 L120,10 Q200,12 208,0 Q200,16 120,18 L-170,10 Z" fill={t.sombra} />
      <path d="M180,-30 Q160,-38 130,-36" stroke={t.luz} strokeWidth={6} fill="none" strokeLinecap="round" />
      <rect x={-60} y={-4} width={150} height={10} rx={5} fill={t.sombra} />
      <circle cx={150} cy={22} r={14} fill={C.navy} />
      <circle cx={150} cy={22} r={6} fill={C.rojo} opacity={0.6 + 0.4 * Math.sin(f / 4)} />
      <rect x={-184} y={-6} width={14} height={14} rx={4} fill={C.gris2} />
      <ellipse cx={-192} cy={1} rx={6} ry={46 * helice + 6} fill={C.navy} opacity={0.75} />
    </g>
  );
};

// =====================================================================================================
// SR-71 DETALLADO (lección del 2026-11-24: «el objeto protagonista, completo y detallado»)
// Recreado en vectores de la referencia infografias/10-sr-71-blackbird/referencias/sr71-gpt.png (perfil y planta).
// Morro a la derecha. Unidades locales: largo ≈ 1000 (x de −500, toberas, a +500, punta del pitot); x,y = centro.
// Perfil: piso en y = +100 (ruedas abajo). Planta: envergadura ≈ ±224.
// Partes animables: tren (sube/baja), tanques (formas internas para RayosX: TanquesSR71), motores (cono móvil),
// cabina, juntas (huecos que se abren, gotean y se cierran con el calor), postquemador (Postquemador de
// efectos-ricos), calor (brillo rojizo de la piel) y helada (escarcha). `resalta` marca una o varias partes.
// =====================================================================================================

type P2 = [number, number];
const idLimpio = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Piel negro-azulada en 3 tonos (+ brillo), juntas, remaches, vidrio, metal, combustible y calor. */
export const PIEL_SR71 = {
  brillo: "#9AA8CC",
  luz: "#4B5675",
  base: "#2B3247",
  sombra: "#191D2B",
  borde: "#0A0C15",
  linea: "#10131E",
  remache: "#717DA1",
  vidrio: "#21498A",
  vidrio2: "#8EC6F2",
  marco: "#3A4258",
  metal: "#9097A8",
  metal2: "#555B6B",
  tobera: "#3B3F4D",
  rojo: "#C23D2E",
  jp7: "#CDE7F0",
  calor: "#E2542C",
  calor2: "#FFB04A",
  hielo: "#CFEFFF",
};
const K = PIEL_SR71;

/** Catmull-Rom → Bézier (sin el M inicial): trazo suave que pasa por todos los puntos. */
const cr = (pts: P2[]) => {
  let d = "";
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) / 6)},${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)},${r1(
      p2[1] - (p3[1] - p1[1]) / 6,
    )} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d;
};
const poli = (pts: P2[], cerrado = true) => pts.map(([a, b], k) => `${k ? "L" : "M"}${r1(a)},${r1(b)}`).join(" ") + (cerrado ? " Z" : "");
const espejo = (pts: P2[]): P2[] => pts.map(([a, b]) => [a, -b] as P2);
const corre = (pts: P2[], dx: number, dy: number): P2[] => pts.map(([a, b]) => [a + dx, b + dy] as P2);
/** y de un contorno en x (lineal por tramos; el contorno puede ir en x creciente o decreciente). */
const yEn = (pts: P2[], x: number) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if ((x <= x0 && x >= x1) || (x >= x0 && x <= x1)) return x1 === x0 ? y0 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return Math.abs(x - pts[0][0]) < Math.abs(x - pts[pts.length - 1][0]) ? pts[0][1] : pts[pts.length - 1][1];
};
/** Punto a la fracción t (0..1) del perímetro de un polígono cerrado. */
const puntoPerimetro = (pts: P2[], t: number): P2 => {
  const lados = pts.map((p, k) => [p, pts[(k + 1) % pts.length]] as [P2, P2]);
  const largos = lados.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  let resta = lim(t, 0, 1) * largos.reduce((s, l) => s + l, 0);
  for (let k = 0; k < lados.length; k++) {
    if (resta <= largos[k] || k === lados.length - 1) {
      const u = largos[k] ? lim(resta / largos[k], 0, 1) : 0;
      const [a, b] = lados[k];
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    }
    resta -= largos[k];
  }
  return pts[0];
};
/** Punto a la fracción t de una polilínea abierta y el ángulo (grados) del tramo. */
const puntoLinea = (pts: P2[], t: number): { p: P2; a: number } => {
  const largos = pts.slice(1).map((b, k) => Math.hypot(b[0] - pts[k][0], b[1] - pts[k][1]));
  let resta = lim(t, 0, 1) * largos.reduce((s, l) => s + l, 0);
  for (let k = 0; k < largos.length; k++) {
    if (resta <= largos[k] || k === largos.length - 1) {
      const u = largos[k] ? lim(resta / largos[k], 0, 1) : 0;
      const a = pts[k];
      const b = pts[k + 1];
      return { p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], a: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
    }
    resta -= largos[k];
  }
  return { p: pts[pts.length - 1], a: 0 };
};

// ---------------------------------------- geometría de perfil ----------------------------------------
const SUELO_SR71 = 100;
const P_TOP: P2[] = [
  [452, 2], [432, -1], [404, -6], [366, -12], [330, -17], [300, -20], [270, -22], [200, -25], [150, -27], [100, -29], [40, -30],
  [-100, -31.5], [-200, -32], [-300, -31.5], [-400, -30], [-440, -28], [-470, -22], [-488, -12], [-494, -5],
];
const P_BOT: P2[] = [
  [452, 2], [420, 4.5], [380, 7.5], [320, 11], [240, 14], [120, 17], [0, 18], [-150, 17], [-300, 15], [-400, 13], [-440, 10],
  [-470, 4], [-494, -5],
];
const P_CHINE: P2[] = [[452, 2], [400, 3.6], [330, 4.8], [250, 6], [100, 8], [-60, 10], [-140, 11]];
const FUSELAJE_P = `M452,2${cr(P_TOP)}${cr([...P_BOT].reverse())} Z`;
const BAJO_CHINE_P = `M452,2${cr(P_CHINE)} L-400,12 L-400,13${cr([...P_BOT].reverse().filter(([x]) => x >= -400))} Z`;
const LOMO = P_TOP.filter(([x]) => x <= 430 && x >= -440);
const LOMO_P = `M${LOMO[0][0]},${LOMO[0][1]}${cr(LOMO)} L${LOMO[LOMO.length - 1][0]},${LOMO[LOMO.length - 1][1] + 6}${cr(
  corre([...LOMO].reverse(), 0, 6),
)} Z`;
// góndola del motor (de este lado): semialto a lo largo de x, centro en y = 2
const NAC_H: P2[] = [[-122, 24], [-135, 28], [-160, 30.5], [-200, 32], [-300, 32], [-400, 31], [-440, 29], [-462, 25]];
const NAC_Y = 2;
const nacTop = NAC_H.map(([x, h]) => [x, NAC_Y - h] as P2);
const nacBot = NAC_H.map(([x, h]) => [x, NAC_Y + h] as P2);
const GONDOLA_P = `M${nacTop[0][0]},${nacTop[0][1]}${cr(nacTop)} L${nacBot[nacBot.length - 1][0]},${nacBot[nacBot.length - 1][1]}${cr(
  [...nacBot].reverse(),
)} Z`;
const GONDOLA_SOMBRA_P = `M-123,10 L-462,10 L${nacBot[nacBot.length - 1][0]},${nacBot[nacBot.length - 1][1]}${cr([...nacBot].reverse())} Z`;
const GONDOLA_LUZ_P = `M${nacTop[1][0]},${nacTop[1][1]}${cr(nacTop.slice(1))} L-460,${NAC_Y - 19}${cr(corre([...nacTop.slice(1)].reverse(), 0, 7))} Z`;
const TOBERA_P = "M-462,-23 L-500,-19.5 L-500,23.5 L-462,27 Z";
const DERIVA_LEJOS_P = "M-268,-31 L-336,-104 L-364,-104 L-374,-31 Z";
const DERIVA_P = "M-312,-29 L-394,-114 L-428,-114 L-436,-29 Z";
const CABINA1_P = "M300,-20.5 C296,-30 288,-38 272,-40.5 L250,-40.5 C243,-38 239,-31 237,-23.5 Z";
const CABINA2_P = "M226,-24 C222,-33 214,-39 202,-40 L180,-39.5 C174,-36 171,-31 170,-26 Z";
const conoP = (dx: number) => `M${-38 + dx},2 L${-126 + dx},-17 L${-126 + dx},21 Z`;
/** x de las juntas que gotean (perfil): fuselaje y góndola. */
const JUNTAS_FUS = [360, 290, 215, 140, 60, -30];
const JUNTAS_NAC = [-140, -265, -355];
const juntaPerfil = (k: number): { x: number; y0: number; y1: number } => {
  if (k < JUNTAS_FUS.length) {
    const x = JUNTAS_FUS[k];
    return { x, y0: yEn(P_TOP, x) + 0.6, y1: yEn(P_BOT, x) - 0.4 };
  }
  const x = JUNTAS_NAC[k - JUNTAS_FUS.length];
  const h = yEn(NAC_H, x);
  return { x, y0: NAC_Y - h + 0.6, y1: NAC_Y + h - 0.4 };
};
const N_JUNTAS = JUNTAS_FUS.length + JUNTAS_NAC.length;

// ---------------------------------------- geometría de planta ----------------------------------------
const PL_NARIZ: P2[] = [[461, 0], [440, -8], [400, -18], [333, -30], [250, -36], [167, -41], [90, -45], [38, -49]];
const PL_ALA: P2[] = [[-50, -87], [-150, -141], [-345, -222], [-378, -224], [-408, -142], [-398, -84], [-438, -30], [-500, 0]];
const CONTORNO_PL = `M461,0${cr(PL_NARIZ)} ${poli(PL_ALA, false).replace(/M/g, "L")} ${poli(espejo([...PL_ALA].reverse()).slice(1), false).replace(
  /M/g,
  "L",
)} L38,49${cr(espejo([...PL_NARIZ].reverse()))} Z`;
const NAC_PL_H: P2[] = [[-36, 21], [-60, 26], [-100, 28.5], [-300, 28.5], [-380, 27], [-400, 24]];
const NAC_PL_Y = 112;
const gondolaPlanta = (yc: number) => {
  const a = NAC_PL_H.map(([x, h]) => [x, yc - h] as P2);
  const b = NAC_PL_H.map(([x, h]) => [x, yc + h] as P2);
  return `M${a[0][0]},${a[0][1]}${cr(a)} L${b[b.length - 1][0]},${b[b.length - 1][1]}${cr([...b].reverse())} Z`;
};
const anchoPlanta = (x: number) => (x >= 38 ? -yEn(PL_NARIZ, x) : 46);
const TODO_PL = CONTORNO_PL + " " + gondolaPlanta(-NAC_PL_Y) + " " + gondolaPlanta(NAC_PL_Y);

// ---------------------------------------- tanques ----------------------------------------
const rectP = (x0: number, x1: number, y0: number, y1: number): P2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
/** Los 6 tanques integrales (polígonos en unidades locales) en cada vista. */
export const TANQUES_SR71: Record<"perfil" | "planta", P2[][]> = {
  perfil: [
    rectP(166, 100, -23, 12),
    rectP(95, 25, -26, 15),
    rectP(20, -55, -27, 16),
    rectP(-60, -135, -28, 16),
    rectP(-140, -235, -29, 14),
    [[-240, -28], [-400, -26], [-400, 8], [-240, 12]],
  ],
  planta: [
    [[166, -33], [100, -37], [100, 37], [166, 33]],
    [[95, -38], [25, -41], [25, 41], [95, 38]],
    [[20, -47], [-50, -80], [-55, -80], [-55, 80], [-50, 80], [20, 47]],
    rectP(-60, -135, -80, 80),
    rectP(-140, -235, -80, 80),
    [[-240, -80], [-378, -80], [-418, -34], [-418, 34], [-378, 80], [-240, 80]],
  ],
};
const centroPoli = (pts: P2[]): P2 => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

export type VistaSR71 = "perfil" | "planta";
export type ParteSR71 = "tren" | "tanques" | "motores" | "cabina" | "juntas" | "postquemador" | "calor";

/**
 * Punto local (sin escala) de una parte, para apuntar la cámara o un rótulo: tanque k, junta k (punto de goteo),
 * cabina, trenNariz, trenPrincipal, cono, entrada, motor, tobera, cola, nariz. Para pasarlo al escenario:
 * `aEscenaSR71(x, y, s, puntoSR71("perfil", "tanque", 2))`.
 */
export const puntoSR71 = (
  vista: VistaSR71,
  parte: "tanque" | "junta" | "cabina" | "trenNariz" | "trenPrincipal" | "cono" | "entrada" | "motor" | "tobera" | "cola" | "nariz",
  k = 0,
): P2 => {
  if (parte === "tanque") return centroPoli(TANQUES_SR71[vista][lim(k, 0, 5)]);
  if (vista === "perfil") {
    if (parte === "junta") {
      const j = juntaPerfil(lim(k, 0, N_JUNTAS - 1));
      return [j.x, j.y1];
    }
    const tabla: Record<string, P2> = {
      cabina: [262, -32],
      trenNariz: [188, 70],
      trenPrincipal: [-190, 70],
      cono: [-70, 2],
      entrada: [-124, 2],
      motor: [-290, 2],
      tobera: [-490, 2],
      cola: [-400, -80],
      nariz: [440, 2],
    };
    return tabla[parte];
  }
  const tabla: Record<string, P2> = {
    junta: [[290, 140, -30, -140][lim(k, 0, 3)], 0],
    cabina: [262, 0],
    trenNariz: [188, 0],
    trenPrincipal: [-190, -NAC_PL_Y],
    cono: [10, -NAC_PL_Y],
    entrada: [-36, -NAC_PL_Y],
    motor: [-220, -NAC_PL_Y],
    tobera: [-430, -NAC_PL_Y],
    cola: [-400, -105],
    nariz: [440, 0],
  };
  return tabla[parte];
};
/** Lleva un punto local del SR-71 al escenario (mismos x, y, s y flip que el avión). */
export const aEscenaSR71 = (x: number, y: number, s: number, p: P2, flip = false): P2 => [x + p[0] * s * (flip ? -1 : 1), y + p[1] * s];

/** Ciclo de la gota de la junta k (perfil): u 0..1 y la y local de la gota (cuelga, cae y llega al piso). */
export const cicloGota = (f: number, k: number, suelo = SUELO_SR71) => {
  const per = 34 + ((k * 7) % 13);
  const u = (((f + k * 11) % per) + per) % per / per;
  const j = juntaPerfil(lim(k, 0, N_JUNTAS - 1));
  const cae = u < 0.5 ? 0 : (u - 0.5) / 0.5;
  return { u, x: j.x, y: j.y1 + 3 + cae * cae * (suelo - j.y1 - 3), r: u < 0.5 ? 0.6 + (u / 0.5) * 2.2 : 2.8, llega: u > 0.97, per };
};

// ---------------------------------------- piezas internas ----------------------------------------
const Remaches: React.FC<{ d: string; paso?: number; o?: number }> = ({ d, paso = 6, o = 0.75 }) => (
  <path d={d} fill="none" stroke={K.remache} strokeWidth={1.3} strokeLinecap="round" strokeDasharray={`0.01 ${paso}`} opacity={o} />
);

const Rueda: React.FC<{ x: number; y: number; r: number; lejos?: boolean }> = ({ x, y, r, lejos }) => (
  <g opacity={lejos ? 0.75 : 1}>
    <circle cx={x} cy={y} r={r} fill={lejos ? "#0C0D12" : "#16171E"} />
    <circle cx={x} cy={y} r={r * 0.86} fill="none" stroke="#262832" strokeWidth={r * 0.12} />
    <circle cx={x} cy={y} r={r * 0.56} fill={K.metal2} />
    <circle cx={x} cy={y} r={r * 0.42} fill={K.metal} />
    <circle cx={x} cy={y} r={r * 0.14} fill={K.metal2} />
    <path d={`M${x - r * 0.75},${y - r * 0.35} A${r * 0.82},${r * 0.82} 0 0 1 ${x - r * 0.2},${y - r * 0.8}`} fill="none" stroke="#5A5E6C" strokeWidth={r * 0.1} strokeLinecap="round" />
  </g>
);

const TrenPerfil: React.FC<{ t: number }> = ({ t }) => {
  if (t <= 0.02) return null;
  const pata = (x: number, y0: number, largo: number) => (
    <g>
      <rect x={x - 3.2} y={y0} width={6.4} height={largo * 0.62} rx={2} fill={K.metal2} />
      <rect x={x - 2.2} y={y0 + largo * 0.5} width={4.4} height={largo * 0.5} rx={1.5} fill="#C9CED9" />
      <rect x={x - 1} y={y0 + largo * 0.52} width={1.4} height={largo * 0.44} fill="#FFFFFF" opacity={0.6} />
      <path d={`M${x + 3},${y0 + largo * 0.42} L${x + 10},${y0 + largo * 0.62} L${x + 3},${y0 + largo * 0.82}`} fill="none" stroke={K.metal} strokeWidth={2.2} strokeLinejoin="round" />
    </g>
  );
  return (
    <g>
      {/* rueda de nariz: se pliega hacia adelante */}
      <g transform={`rotate(${-95 * (1 - t)} 188 14)`}>
        {pata(188, 14, 60)}
        <Rueda x={193} y={85} r={14} lejos />
        <Rueda x={188} y={85} r={15} />
      </g>
      {/* tren principal: tres ruedas, se pliega hacia adentro */}
      <g transform={`rotate(${95 * (1 - t)} -190 30)`}>
        {pata(-190, 30, 44)}
        <rect x={-210} y={78} width={40} height={6} rx={3} fill={K.metal2} />
        <Rueda x={-190} y={82} r={17} lejos />
        <Rueda x={-206} y={82} r={18} />
        <Rueda x={-174} y={82} r={18} />
      </g>
    </g>
  );
};

/** Lo que brilla cuando la piel se calienta (bordes de ataque, morro, labios, toberas), en el perfil. */
const BORDES_CALIENTES_P = `M452,2${cr(P_TOP.slice(0, 6))} M452,2${cr(P_BOT.slice(0, 5))} M452,2${cr(P_CHINE)} M-122,-22 C-124,-8 -124,12 -122,26 M-38,2 L-126,-17 M-38,2 L-126,21 M-312,-29 L-394,-114 M-268,-31 L-336,-104`;
const BORDES_CALIENTES_PL = `M461,0${cr(PL_NARIZ)} M461,0${cr(espejo(PL_NARIZ))} M-150,-141 L-345,-222 M-150,141 L-345,222 M38,-49 L-50,-87 M38,49 L-50,87 M38,-112 L-40,-131 M38,-112 L-40,-93 M38,112 L-40,131 M38,112 L-40,93`;

export type SR71DetalladoProps = {
  x: number;
  y: number;
  f: number;
  s?: number;
  vista?: VistaSR71;
  flip?: boolean;
  rot?: number;
  /** 0 recogido … 1 abajo (solo perfil) */
  tren?: number;
  /** 0 cerradas (en vuelo, calientes) … 1 abiertas (en tierra, frías) */
  juntas?: number;
  /** 0..1 cuántas juntas gotean (perfil): cuelgan, caen y salpican en el piso */
  gotea?: number;
  /** orden en que empiezan a gotear las juntas (índices 0..8; por defecto de la nariz a la cola) */
  ordenGoteo?: number[];
  /** 0..1 charquitos bajo las juntas (perfil) */
  charco?: number;
  /** y local del piso para gotas, charcos y sombra (perfil: 100) */
  suelo?: number;
  /** sombra en el piso (perfil, avión en tierra) o sombra corrida (planta) */
  sombra?: boolean;
  /** 0..1 brillo rojizo de la piel caliente */
  calor?: number;
  /** 0..1 escarcha (frío de −60 °F) */
  helada?: number;
  /** 0..1 llama del postquemador */
  postquemador?: number;
  /** 0 (adelante) … 1 (atrás, Mach 3): posición del cono móvil */
  cono?: number;
  /** 0..1 vibración */
  vibra?: number;
  /** parte(s) que laten con un contorno amarillo */
  resalta?: ParteSR71 | ParteSR71[] | null;
  /** remaches y líneas de paneles (desactívalo en tamaños muy chicos) */
  detalle?: boolean;
};

/**
 * SR-71 Blackbird detallado, de perfil o en planta (ver arriba). Nunca lleva insignias ni texto.
 *   <SR71Detallado x={1800} y={1150} f={f} s={2.6} tren={1} juntas={1} gotea={0.6} sombra />
 *   <SR71Detallado x={960} y={540} f={f} s={1.4} tren={0} postquemador={1} calor={suave(f, w(3), w(5))} />
 *   <SR71Detallado x={960} y={540} f={f} vista="planta" s={1.6} sombra />
 */
export const SR71Detallado: React.FC<SR71DetalladoProps> = ({
  x,
  y,
  f,
  s = 1,
  vista = "perfil",
  flip,
  rot = 0,
  tren = 1,
  juntas = 0.5,
  gotea = 0,
  ordenGoteo,
  charco = 0,
  suelo = SUELO_SR71,
  sombra = false,
  calor = 0,
  helada = 0,
  postquemador = 0,
  cono = 0,
  vibra = 0,
  resalta = null,
  detalle = true,
}) => {
  const uid = "sr" + idLimpio(useId());
  const partes = resalta === null ? [] : Array.isArray(resalta) ? resalta : [resalta];
  const late = 0.55 + 0.45 * Math.sin(f / 4.5);
  const vb = vibra > 0 ? [Math.sin(f * 2.7) * 2.5 * vibra, Math.cos(f * 3.3) * 1.8 * vibra] : [0, 0];
  const ej = `translate(${x + vb[0] * s},${y + vb[1] * s}) rotate(${rot}) scale(${flip ? -s : s},${s})`;
  const g = 0.7 + 4.4 * lim(juntas, 0, 1.2);
  const cal = lim(calor, 0, 1);
  const pulsoCalor = 0.85 + 0.15 * Math.sin(f / 5);
  const resaltado = (d: string, k: string) => (
    <g key={k} fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d={d} stroke={C.amarillo} strokeWidth={7} opacity={0.3 * late} />
      <path d={d} stroke={C.amarillo} strokeWidth={2.4} opacity={0.6 + 0.4 * late} />
    </g>
  );
  const defs = (
    <defs>
      <linearGradient id={`${uid}-v`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={K.vidrio2} />
        <stop offset="0.55" stopColor="#4F86C6" />
        <stop offset="1" stopColor={K.vidrio} />
      </linearGradient>
      <linearGradient id={`${uid}-t`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5B6072" />
        <stop offset="0.45" stopColor={K.tobera} />
        <stop offset="1" stopColor="#1E2029" />
      </linearGradient>
    </defs>
  );

  if (vista === "planta") {
    const gondola = (yc: number) => {
      const lado = yc < 0 ? 1 : -1; // hacia el centro
      const b = NAC_PL_H.map(([xx, h]) => [xx, yc + h] as P2);
      const dx = -14 * cono;
      return (
        <g key={yc}>
          {/* cono móvil */}
          <path d={`M${38 + dx},${yc} L${-40 + dx},${yc - 19} L${-40 + dx},${yc + 19} Z`} fill={K.base} />
          <path d={`M${38 + dx},${yc} L${-40 + dx},${yc - 19} L${-40 + dx},${yc} Z`} fill={K.luz} />
          <path d={`M${30 + dx},${yc - 1} L${-20 + dx},${yc - 12}`} stroke={K.brillo} strokeWidth={1.6} opacity={0.6} />
          {/* góndola */}
          <path d={gondolaPlanta(yc)} fill={K.base} stroke={K.borde} strokeWidth={2} />
          <path d={`M-58,${yc + 6} L-385,${yc + 6} L${b[b.length - 2][0]},${b[b.length - 2][1]}${cr([...b.slice(0, -1)].reverse())} Z`} fill={K.sombra} opacity={0.85} />
          <path d={`M-62,${yc - 18} L-380,${yc - 18}`} stroke={K.luz} strokeWidth={7} strokeLinecap="round" />
          <path d={`M-62,${yc - 20} L-300,${yc - 20}`} stroke={K.brillo} strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
          <ellipse cx={-37} cy={yc} rx={4} ry={21} fill={K.borde} opacity={0.8} />
          {detalle ? (
            <g>
              <path d={[-90, -150, -210, -270, -330, -375].map((xx) => `M${xx},${yc - 28} L${xx},${yc + 28}`).join(" ")} stroke={K.linea} strokeWidth={1.3} />
              <Remaches d={[-96, -156, -216, -276, -336].map((xx) => `M${xx},${yc - 26} L${xx},${yc + 26}`).join(" ")} paso={7} />
              <path d={`M-60,${yc + 14} L-390,${yc + 14}`} stroke={K.linea} strokeWidth={1.1} />
            </g>
          ) : null}
          {/* tobera */}
          <path d={`M-400,${yc - 23} L-440,${yc - 20} L-440,${yc + 20} L-400,${yc + 23} Z`} fill={`url(#${uid}-t)`} stroke={K.borde} strokeWidth={1.6} />
          <path d={`M-412,${yc - 22} L-412,${yc + 22} M-426,${yc - 21} L-426,${yc + 21}`} stroke="#6B7080" strokeWidth={1.2} />
          <ellipse cx={-440} cy={yc} rx={3.5} ry={19} fill={K.borde} />
          {/* deriva inclinada hacia adentro (vista desde arriba) */}
          <path d={`M-292,${yc} L-398,${yc + 26 * lado} L-430,${yc + 26 * lado} L-438,${yc} Z`} fill={K.sombra} stroke={K.borde} strokeWidth={1.8} strokeLinejoin="round" />
          <path d={`M-292,${yc} L-398,${yc + 26 * lado} L-404,${yc + 26 * lado} L-300,${yc} Z`} fill={K.luz} />
          <path d={`M-340,${yc + 12 * lado} L-432,${yc + 12 * lado}`} stroke={K.linea} strokeWidth={1.2} />
          {postquemador > 0.01 ? <Postquemador x={-442} y={yc} f={f + (yc > 0 ? 7 : 0)} largo={260} alto={34} p={postquemador} /> : null}
        </g>
      );
    };
    const lineasFus = [380, 330, 250, 160, 70, -20, -110, -200, -290, -380]
      .map((xx) => {
        const hw = Math.min(anchoPlanta(xx), 44);
        return `M${xx},${-hw} L${xx},${hw}`;
      })
      .join(" ");
    const lineasAla = [-100, -160, -220, -280, -340]
      .map((xx) => `M${xx},-82 L${xx},-48 M${xx},48 L${xx},82`)
      .join(" ");
    const bordeAla = (xx: number) => -141 - ((xx + 150) / -195) * 81;
    const lineasAlaExt = [-200, -260, -320]
      .map((xx) => `M${xx},-140 L${xx},${r1(bordeAla(xx))} M${xx},140 L${xx},${r1(-bordeAla(xx))}`)
      .join(" ");
    const pasarela = (sg: number) => poli([[10, -52 * sg], [-48, -79 * sg], [-372, -79 * sg], [-392, -52 * sg]]);
    return (
      <g>
        {defs}
        {sombra ? (
          <g transform={`translate(${x + 34 * s},${y + 46 * s}) rotate(${rot}) scale(${flip ? -s : s},${s})`} opacity={0.32}>
            <path d={TODO_PL} fill={C.negro} />
          </g>
        ) : null}
        <g transform={ej}>
          {/* cuerpo y alas */}
          <path d={CONTORNO_PL} fill={K.base} stroke={K.borde} strokeWidth={2.4} strokeLinejoin="round" />
          <path d={`M461,0${cr(espejo(PL_NARIZ))} ${poli(espejo(PL_ALA), false).replace(/M/g, "L")} Z`} fill={K.sombra} opacity={0.6} />
          <path d={`M461,0${cr(PL_NARIZ)} L-50,-87 L-150,-141 L-345,-222 L-300,-206 L-150,-128 L-40,-70 L38,-40 Z`} fill={K.luz} opacity={0.35} />
          {/* lomo del fuselaje */}
          <path d="M446,-1 C360,-9 250,-14 120,-15 L-300,-15 L-470,-6 L-470,4 L-300,8 L120,8 C250,7 360,4 446,1 Z" fill={K.luz} opacity={0.9} />
          <path d="M430,-3 C340,-10 240,-12 120,-12 L-320,-12" stroke={K.brillo} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.65} />
          <path d={`M455,-2${cr(PL_NARIZ.slice(1))}`} stroke={K.brillo} strokeWidth={1.6} fill="none" opacity={0.5} />
          <clipPath id={`${uid}-pl`}>
            <path d={CONTORNO_PL} />
          </clipPath>
          {detalle ? (
            <g clipPath={`url(#${uid}-pl)`}>
              <path d={lineasFus + " " + lineasAla + " " + lineasAlaExt} stroke={K.linea} strokeWidth={1.3} fill="none" />
              <path d="M300,-20 L-470,-20 M300,20 L-470,20 M38,-46 L-430,-46 M38,46 L-430,46 M-60,-64 L-390,-64 M-60,64 L-390,64 M-160,-178 L-360,-178 M-160,178 L-360,178" stroke={K.linea} strokeWidth={1.1} fill="none" />
              <Remaches d="M300,-23 L-470,-23 M300,23 L-470,23 M30,-43 L-430,-43 M30,43 L-430,43 M-60,-67 L-390,-67 M-60,67 L-390,67" paso={7} o={0.6} />
              {/* rejillas de ventilación */}
              {[-1, 1].map((sg) => (
                <g key={sg}>
                  {[-175, -215].map((vx) => (
                    <g key={vx}>
                      <rect x={vx - 16} y={sg * 55 - 6} width={32} height={12} rx={2} fill={K.borde} />
                      <path d={[0, 1, 2, 3, 4].map((k) => `M${vx - 12 + k * 6},${sg * 55 - 4.5} L${vx - 12 + k * 6},${sg * 55 + 4.5}`).join(" ")} stroke={K.luz} strokeWidth={1.4} />
                    </g>
                  ))}
                  <path d={pasarela(sg)} fill="none" stroke={K.rojo} strokeWidth={1.4} opacity={0.85} />
                </g>
              ))}
            </g>
          ) : null}
          {/* juntas de planta */}
          {[290, 140, -30].map((xx) => {
            const hw = Math.min(anchoPlanta(xx), 44) - 2;
            return <rect key={xx} x={xx - g / 2} y={-hw} width={g} height={hw * 2} fill={K.borde} opacity={0.9} />;
          })}
          {gondola(-NAC_PL_Y)}
          {gondola(NAC_PL_Y)}
          {/* cabinas en tándem */}
          {[
            "M318,0 C314,-9 300,-12 288,-12 L270,-11 C264,-8 262,-4 262,0 C262,4 264,8 270,11 L288,12 C300,12 314,9 318,0 Z",
            "M250,0 C247,-8 238,-11 228,-11 L212,-10 C207,-7 205,-3 205,0 C205,3 207,7 212,10 L228,11 C238,11 247,8 250,0 Z",
          ].map((d, k) => (
            <g key={k}>
              <path d={d} fill={`url(#${uid}-v)`} stroke={K.marco} strokeWidth={2.2} />
            </g>
          ))}
          <path d="M286,-12 L286,12 M226,-11 L226,11" stroke={K.marco} strokeWidth={2} />
          <path d="M310,-4 C306,-8 298,-10 290,-10 M244,-4 C240,-8 234,-9 228,-9" stroke={C.blanco} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.75} />
          {/* pitot */}
          <path d="M461,0 L500,0" stroke={K.metal2} strokeWidth={2.4} strokeLinecap="round" />
          {helada > 0.01 ? (
            <g opacity={helada}>
              <path d={TODO_PL} fill={K.hielo} opacity={0.32} />
              {Array.from({ length: 14 }, (_, k) => {
                const px = 420 - k * 62;
                const py = (random(`hp${k}`) - 0.5) * 160;
                const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / 6 + k));
                return <path key={k} d={`M${px - 5},${py} L${px + 5},${py} M${px},${py - 5} L${px},${py + 5}`} stroke={C.blanco} strokeWidth={1.6} opacity={tw} />;
              })}
            </g>
          ) : null}
          {cal > 0.01 ? (
            <g>
              <path d={`M-400,${-NAC_PL_Y - 23} L-440,${-NAC_PL_Y - 20} L-440,${-NAC_PL_Y + 20} L-400,${-NAC_PL_Y + 23} Z M-400,${NAC_PL_Y - 23} L-440,${NAC_PL_Y - 20} L-440,${NAC_PL_Y + 20} L-400,${NAC_PL_Y + 23} Z`} fill={K.calor} opacity={0.55 * cal * pulsoCalor} />
              <path d={BORDES_CALIENTES_PL} fill="none" stroke={K.calor} strokeWidth={12} opacity={0.35 * cal} strokeLinecap="round" />
              <path d={BORDES_CALIENTES_PL} fill="none" stroke={K.calor2} strokeWidth={3} opacity={cal * pulsoCalor} strokeLinecap="round" />
            </g>
          ) : null}
          {partes.map((p) =>
            p === "cabina"
              ? resaltado("M318,0 C314,-12 270,-14 262,0 C270,14 314,12 318,0 Z M250,0 C247,-12 207,-12 205,0 C207,12 247,12 250,0 Z", p)
              : p === "motores"
                ? resaltado(gondolaPlanta(-NAC_PL_Y) + " " + gondolaPlanta(NAC_PL_Y), p)
                : p === "tanques"
                  ? resaltado(TANQUES_SR71.planta.map((t) => poli(t)).join(" "), p)
                  : p === "juntas"
                    ? resaltado([290, 140, -30].map((xx) => `M${xx},-40 L${xx},40`).join(" "), p)
                    : p === "postquemador"
                      ? resaltado(`M-400,-135 L-440,-132 L-440,-92 L-400,-89 Z M-400,135 L-440,132 L-440,92 L-400,89 Z`, p)
                      : p === "calor"
                        ? resaltado(TODO_PL, p)
                        : null,
          )}
        </g>
      </g>
    );
  }

  // ------------------------------------------------ PERFIL ------------------------------------------------
  const dxCono = -10 * cono;
  const juntasDibujo = Array.from({ length: N_JUNTAS }, (_, k) => {
    const j = juntaPerfil(k);
    return (
      <g key={k}>
        <rect x={j.x - g / 2} y={j.y0} width={g} height={j.y1 - j.y0} fill={K.borde} />
        {g > 1.6 ? <line x1={j.x + g / 2 + 0.6} y1={j.y0 + 1} x2={j.x + g / 2 + 0.6} y2={j.y1 - 1} stroke={K.luz} strokeWidth={1} opacity={0.7} /> : null}
        {g > 1.6 && gotea > 0.01 ? <rect x={j.x - g / 2} y={j.y1 - 6} width={g} height={6} fill={K.jp7} opacity={0.55 * lim(gotea * 2, 0, 1)} /> : null}
      </g>
    );
  });
  const gotas =
    gotea > 0.01 ? (
      <g>
        {Array.from({ length: N_JUNTAS }, (_, k) => {
          const rango = ordenGoteo ? (ordenGoteo.indexOf(k) < 0 ? N_JUNTAS : ordenGoteo.indexOf(k)) : k;
          const act = lim((gotea - rango / (N_JUNTAS * 1.1)) * 4, 0, 1);
          if (act <= 0.01) return null;
          const c = cicloGota(f, k, suelo);
          const sal = c.u > 0.93 ? (c.u - 0.93) / 0.07 : 0;
          return (
            <g key={k} opacity={act}>
              {c.u < 0.95 ? (
                <path
                  d={`M${c.x},${c.y - c.r * 2.4} Q${c.x + c.r},${c.y - c.r * 0.6} ${c.x + c.r},${c.y} A${c.r},${c.r} 0 1 1 ${c.x - c.r},${c.y} Q${c.x - c.r},${c.y - c.r * 0.6} ${c.x},${c.y - c.r * 2.4} Z`}
                  fill={K.jp7}
                  stroke="#7FA6B8"
                  strokeWidth={0.5}
                />
              ) : null}
              {sal > 0 ? (
                <g opacity={1 - sal}>
                  <ellipse cx={c.x} cy={suelo} rx={3 + sal * 9} ry={1 + sal * 2} fill="none" stroke={K.jp7} strokeWidth={1.2} />
                  <circle cx={c.x - 3 - sal * 5} cy={suelo - sal * 5} r={0.9} fill={K.jp7} />
                  <circle cx={c.x + 3 + sal * 5} cy={suelo - sal * 4} r={0.9} fill={K.jp7} />
                </g>
              ) : null}
            </g>
          );
        })}
      </g>
    ) : null;
  const charcos =
    charco > 0.01 ? (
      <g>
        {Array.from({ length: N_JUNTAS }, (_, k) => {
          const j = juntaPerfil(k);
          const rx = (6 + 14 * charco) * (0.8 + random(`ch${k}`) * 0.4);
          return (
            <g key={k}>
              <ellipse cx={j.x} cy={suelo + 0.8} rx={rx} ry={2.2 + charco * 1.2} fill="#0E1220" opacity={0.55} />
              <ellipse cx={j.x - rx * 0.25} cy={suelo + 0.3} rx={rx * 0.45} ry={0.7} fill={K.jp7} opacity={0.45} />
            </g>
          );
        })}
      </g>
    ) : null;
  const silueta = (
    <g>
      <path d={FUSELAJE_P} />
      <path d={GONDOLA_P} />
      <path d={DERIVA_P} />
      <path d={TOBERA_P} />
      <path d={conoP(dxCono)} />
    </g>
  );
  return (
    <g>
      {defs}
      <g transform={ej}>
        {sombra ? <ellipse cx={-20} cy={suelo + 1.5} rx={440} ry={11} fill="rgba(10,8,30,0.35)" /> : null}
        {charcos}
        {/* postquemador detrás de la tobera */}
        {postquemador > 0.01 ? <Postquemador x={-500} y={NAC_Y} f={f} largo={300} alto={36} p={postquemador} /> : null}
        <TrenPerfil t={lim(tren, 0, 1)} />
        {/* deriva del otro lado */}
        <path d={DERIVA_LEJOS_P} fill={K.sombra} stroke={K.borde} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-268,-31 L-336,-104 L-342,-104 L-276,-31 Z" fill={K.base} />
        {/* fuselaje: base, sombra bajo el chine, luz del lomo */}
        <path d={FUSELAJE_P} fill={K.base} />
        <path d={BAJO_CHINE_P} fill={K.sombra} />
        <path d={LOMO_P} fill={K.luz} />
        <path d={`M412,-2.5${cr(P_TOP.slice(2, 9).map(([a, b]) => [a, b + 2.2] as P2))}`} stroke={K.brillo} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.75} />
        <path d={`M446,2.4${cr(P_CHINE.slice(1))}`} stroke={K.luz} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <path d={FUSELAJE_P} fill="none" stroke={K.borde} strokeWidth={2.4} strokeLinejoin="round" />
        {/* lomo detrás de la cabina */}
        <path d="M170,-25.5 C158,-33 130,-34 92,-31 L60,-29.8 L170,-24.5 Z" fill={K.base} stroke={K.borde} strokeWidth={1.6} />
        <path d="M165,-29 C150,-33 125,-33 95,-31" stroke={K.brillo} strokeWidth={1.4} fill="none" opacity={0.6} />
        {/* líneas de paneles y remaches del fuselaje */}
        {detalle ? (
          <g>
            <path
              d={
                [400, 330, 250, 180, 100, 20, -60, -100].map((xx) => `M${xx},${r1(yEn(P_TOP, xx) + 1)} L${xx},${r1(yEn(P_BOT, xx) - 1)}`).join(" ") +
                ` M440,-1${cr(P_TOP.slice(2, 12).map(([a, b]) => [a, b + 9] as P2))} M60,12 L-130,13`
              }
              stroke={K.linea}
              strokeWidth={1.3}
              fill="none"
            />
            <Remaches
              d={
                [396, 326, 246, 176, 96, 16, -64].map((xx) => `M${xx},${r1(yEn(P_TOP, xx) + 3)} L${xx},${r1(yEn(P_BOT, xx) - 3)}`).join(" ") +
                ` M430,1${cr(P_TOP.slice(3, 12).map(([a, b]) => [a, b + 12] as P2))}`
              }
              paso={5.5}
            />
            {/* escotillas y tomas chicas */}
            <rect x={120} y={-14} width={26} height={12} rx={1.5} fill="none" stroke={K.linea} strokeWidth={1.3} />
            <rect x={-20} y={-20} width={34} height={9} rx={1.5} fill="none" stroke={K.linea} strokeWidth={1.3} />
            <path d="M330,8 L360,6.4" stroke={K.borde} strokeWidth={2.2} strokeLinecap="round" />
            <path d="M80,15.6 L-120,15" stroke={K.rojo} strokeWidth={1.4} opacity={0.85} />
          </g>
        ) : null}
        {/* cabinas en tándem con vidrio y reflejo */}
        <circle cx={264} cy={-31} r={6.5} fill="#E8E2CC" />
        <path d="M258,-32 a6.5,6.5 0 0 1 12,0 Z" fill="#C9A24E" />
        <circle cx={196} cy={-31} r={6.5} fill="#E8E2CC" />
        <path d="M190,-32 a6.5,6.5 0 0 1 12,0 Z" fill="#C9A24E" />
        <path d={CABINA1_P} fill={`url(#${uid}-v)`} opacity={0.88} stroke={K.marco} strokeWidth={2.2} strokeLinejoin="round" />
        <path d={CABINA2_P} fill={`url(#${uid}-v)`} opacity={0.88} stroke={K.marco} strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M270,-40.5 L276,-21.6 M200,-39.8 L205,-24.6" stroke={K.marco} strokeWidth={2.2} />
        <path d="M293,-29 C287,-35.5 280,-38 270,-38.6" stroke={C.blanco} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.8} />
        <path d="M221,-31 C217,-35 212,-37.2 204,-38" stroke={C.blanco} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.65} />
        <circle cx={252} cy={-37} r={1.4} fill={C.blanco} opacity={0.8} />
        {/* raíz del ala entre el fuselaje y la góndola */}
        <path d="M-30,9 L-124,4 L-124,14 L-60,12.5 Z" fill={K.sombra} />
        {/* góndola con su cono móvil */}
        <path d={GONDOLA_P} fill={K.base} />
        <path d={GONDOLA_SOMBRA_P} fill={K.sombra} />
        <path d={GONDOLA_LUZ_P} fill={K.luz} />
        <path d={`M-140,${NAC_Y - 27}${cr(nacTop.slice(2, 6).map(([a, b]) => [a, b + 3] as P2))}`} stroke={K.brillo} strokeWidth={1.8} fill="none" opacity={0.6} />
        {detalle ? (
          <g>
            <path
              d={[-160, -205, -250, -300, -350, -400, -440].map((xx) => `M${xx},${r1(NAC_Y - yEn(NAC_H, xx) + 1)} L${xx},${r1(NAC_Y + yEn(NAC_H, xx) - 1)}`).join(" ") + ` M-140,${NAC_Y - 12} L-455,${NAC_Y - 12} M-140,${NAC_Y + 16} L-455,${NAC_Y + 18}`}
              stroke={K.linea}
              strokeWidth={1.3}
              fill="none"
            />
            <Remaches d={[-165, -210, -255, -305, -355, -405].map((xx) => `M${xx},${r1(NAC_Y - yEn(NAC_H, xx) + 3)} L${xx},${r1(NAC_Y + yEn(NAC_H, xx) - 3)}`).join(" ")} paso={5.5} />
            {[0, 1, 2, 3].map((k) => (
              <rect key={k} x={-244 + k * 8} y={NAC_Y - 7} width={4.5} height={10} rx={1} fill={K.borde} />
            ))}
          </g>
        ) : null}
        <path d={GONDOLA_P} fill="none" stroke={K.borde} strokeWidth={2.4} strokeLinejoin="round" />
        <ellipse cx={-122.5} cy={NAC_Y + 1} rx={4} ry={23.5} fill={K.borde} />
        <path d={conoP(dxCono)} fill={K.base} stroke={K.borde} strokeWidth={2} strokeLinejoin="round" />
        <path d={`M${-38 + dxCono},2 L${-126 + dxCono},-17 L${-126 + dxCono},2 Z`} fill={K.luz} />
        <path d={`M${-44 + dxCono},1 L${-112 + dxCono},-12`} stroke={K.brillo} strokeWidth={1.6} opacity={0.7} strokeLinecap="round" />
        <path d="M-120,-21.5 C-123,-8 -123,12 -120,25.5" stroke={K.brillo} strokeWidth={1.8} fill="none" opacity={0.7} />
        {/* tobera con anillos */}
        <path d={TOBERA_P} fill={`url(#${uid}-t)`} stroke={K.borde} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-472,-22 L-472,26 M-484,-21 L-484,25 M-494,-20 L-494,24" stroke="#6B7080" strokeWidth={1.3} />
        <path d="M-464,-20 L-498,-17" stroke="#7D8292" strokeWidth={2} strokeLinecap="round" />
        <ellipse cx={-500} cy={NAC_Y} rx={4.2} ry={20.5} fill={K.borde} />
        {postquemador > 0.01 ? <ellipse cx={-500} cy={NAC_Y} rx={3} ry={16} fill={C.naranja} opacity={postquemador} /> : null}
        {/* deriva de este lado (inclinada hacia adentro) */}
        <path d={DERIVA_P} fill={K.base} stroke={K.borde} strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M-312,-29 L-394,-114 L-401,-114 L-322,-29 Z" fill={K.luz} />
        <path d="M-428,-114 L-436,-29 L-428,-29 L-421,-114 Z" fill={K.sombra} />
        {detalle ? <path d="M-338,-58 L-433,-58 M-364,-88 L-430,-88 M-404,-111 L-414,-31" stroke={K.linea} strokeWidth={1.3} fill="none" /> : null}
        {/* pitot */}
        <path d="M452,2 L500,1" stroke={K.metal2} strokeWidth={2.4} strokeLinecap="round" />
        <circle cx={472} cy={1.6} r={1.6} fill={K.metal} />
        {/* juntas y goteo */}
        {juntasDibujo}
        {gotas}
        {/* escarcha */}
        {helada > 0.01 ? (
          <g opacity={helada}>
            <g opacity={0.35}>
              <path d={FUSELAJE_P} fill={K.hielo} />
              <path d={GONDOLA_P} fill={K.hielo} />
              <path d={DERIVA_P} fill={K.hielo} />
            </g>
            <path d={`M452,2${cr(P_TOP.slice(0, 14))}`} stroke={C.blanco} strokeWidth={2.4} fill="none" opacity={0.8} strokeDasharray="5 3" />
            {Array.from({ length: 16 }, (_, k) => {
              const px = 430 - k * 55;
              const py = yEn(P_TOP, px) + 4 + random(`hz${k}`) * 10;
              const tw = 0.3 + 0.7 * Math.abs(Math.sin(f / 7 + k * 1.3));
              const r = 3 + random(`hr${k}`) * 3;
              return <path key={k} d={`M${px - r},${py} L${px + r},${py} M${px},${py - r} L${px},${py + r}`} stroke={C.blanco} strokeWidth={1.4} opacity={tw} />;
            })}
          </g>
        ) : null}
        {/* calor */}
        {cal > 0.01 ? (
          <g>
            <path d={conoP(dxCono)} fill={K.calor} opacity={0.4 * cal * pulsoCalor} />
            <path d={`M452,2${cr(P_TOP.slice(0, 4))}${cr([...P_BOT.slice(0, 3)].reverse())} Z`} fill={K.calor} opacity={0.35 * cal * pulsoCalor} />
            <path d={BORDES_CALIENTES_P} fill="none" stroke={K.calor} strokeWidth={12} opacity={0.4 * cal} strokeLinecap="round" />
            <path d={BORDES_CALIENTES_P} fill="none" stroke={K.calor2} strokeWidth={3} opacity={cal * pulsoCalor} strokeLinecap="round" />
            <path d={TOBERA_P} fill={K.calor} opacity={0.55 * cal * pulsoCalor} />
            <path d="M-472,-22 L-472,26 M-484,-21 L-484,25 M-494,-20 L-494,24" stroke={K.calor2} strokeWidth={2} opacity={cal * pulsoCalor} />
          </g>
        ) : null}
        {/* resaltados */}
        {partes.map((p) =>
          p === "cabina"
            ? resaltado(CABINA1_P + " " + CABINA2_P, p)
            : p === "motores"
              ? resaltado(GONDOLA_P + " " + conoP(dxCono), p)
              : p === "tanques"
                ? resaltado(TANQUES_SR71.perfil.map((t) => poli(t)).join(" "), p)
                : p === "juntas"
                  ? resaltado(
                      Array.from({ length: N_JUNTAS }, (_, k) => juntaPerfil(k))
                        .map((j) => `M${j.x},${j.y0} L${j.x},${j.y1}`)
                        .join(" "),
                      p,
                    )
                  : p === "postquemador"
                    ? resaltado(TOBERA_P, p)
                    : p === "tren" && tren > 0.5
                      ? resaltado("M188,84 m-16,0 a16,16 0 1 0 32,0 a16,16 0 1 0 -32,0 M-190,82 m-36,0 a36,20 0 1 0 72,0 a36,20 0 1 0 -72,0", p)
                      : p === "calor"
                        ? resaltado(FUSELAJE_P + " " + GONDOLA_P, p)
                        : null,
        )}
        {/* silueta invisible: ayuda a que RayosX lea bien el borde */}
        <g opacity={0}>{silueta}</g>
      </g>
    </g>
  );
};

/**
 * Los 6 tanques integrales del SR-71 por dentro (para el `interior` de RayosX), en las mismas coordenadas que el
 * SR71Detallado (x, y, s, flip, vista). Llevan combustible JP-7 que se mece, la estructura del fuselaje (cuadernas)
 * y, de perfil, el motor J58 en fantasma.
 *   nivel      0..1 (o uno por tanque)              resalta  índice(s) 0..5 del tanque que late
 *   sellador   0..1: el cordón de sellador recorre los bordes de los tanques en orden (1 → 6), con la punta brillante
 *   curvaSellador  "lineal" o "suave" (para que la punta vaya sincronizada con una toma de cámara suave)
 *   fuga       0..1: gotitas que se escapan por el borde de abajo de cada tanque
 */
export const TanquesSR71: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  vista?: VistaSR71;
  flip?: boolean;
  nivel?: number | number[];
  resalta?: number | number[] | null;
  sellador?: number;
  curvaSellador?: "lineal" | "suave";
  fuga?: number;
  estructura?: boolean;
  motor?: boolean;
}> = ({ x, y, f, s = 1, vista = "perfil", flip, nivel = 0.72, resalta = null, sellador = 0, curvaSellador = "lineal", fuga = 0, estructura = true, motor = true }) => {
  const uid = "tq" + idLimpio(useId());
  const tanques = TANQUES_SR71[vista];
  const marcados = resalta === null ? [] : Array.isArray(resalta) ? resalta : [resalta];
  const late = 0.5 + 0.5 * Math.sin(f / 4);
  const sel = curvaSellador === "suave" ? Easing.inOut(Easing.cubic)(lim(sellador, 0, 1)) : lim(sellador, 0, 1);
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <defs>
        {tanques.map((t, k) => (
          <clipPath key={k} id={`${uid}-${k}`}>
            <path d={poli(t)} />
          </clipPath>
        ))}
      </defs>
      {estructura ? (
        <g stroke={C.teal} strokeWidth={1.4} opacity={0.32}>
          {vista === "perfil"
            ? Array.from({ length: 37 }, (_, k) => 440 - k * 25).map((xx) => <line key={xx} x1={xx} y1={yEn(P_TOP, xx) + 1} x2={xx} y2={yEn(P_BOT, xx) - 1} />)
            : Array.from({ length: 37 }, (_, k) => 440 - k * 25).map((xx) => <line key={xx} x1={xx} y1={-Math.min(anchoPlanta(xx), 44)} x2={xx} y2={Math.min(anchoPlanta(xx), 44)} />)}
          {vista === "perfil" ? <path d={`M440,-6${cr(P_TOP.slice(2, 16).map(([a, b]) => [a, b + 5] as P2))}`} fill="none" /> : <path d="M440,0 L-480,0" />}
        </g>
      ) : null}
      {motor && vista === "perfil" ? (
        <g fill="none" stroke={C.lila} strokeWidth={1.6} opacity={0.55}>
          <path d="M-150,-18 L-330,-18 L-330,22 L-150,22 Z M-330,-15 L-470,-12 L-470,16 L-330,19" />
          {[-165, -180, -195, -210, -225, -240].map((xx) => (
            <line key={xx} x1={xx} y1={-15} x2={xx} y2={19} />
          ))}
          <path d="M-130,2 L-150,-8 L-150,12 Z" />
        </g>
      ) : null}
      {tanques.map((t, k) => {
        const [cx, cy] = centroPoli(t);
        const ys = t.map((p) => p[1]);
        const xs = t.map((p) => p[0]);
        const y0 = Math.min(...ys);
        const y1 = Math.max(...ys);
        const x0 = Math.min(...xs);
        const x1 = Math.max(...xs);
        const nv = Array.isArray(nivel) ? (nivel[k] ?? 0.7) : nivel;
        const yl = y1 - (y1 - y0) * nv;
        const ola = (d: number) =>
          `M${x0 - 4},${yl + Math.sin(f / 7 + k + d) * 1.6} ` +
          Array.from({ length: 9 }, (_, i) => {
            const xx = x0 + ((x1 - x0) * (i + 1)) / 8;
            return `L${r1(xx)},${r1(yl + Math.sin(f / 7 + k + d + i * 0.9) * 1.6)}`;
          }).join(" ") +
          ` L${x1 + 4},${y1 + 4} L${x0 - 4},${y1 + 4} Z`;
        const marca = marcados.includes(k);
        const pk = lim(sel * tanques.length - k, 0, 1);
        const cabeza = pk > 0 && pk < 1 ? puntoPerimetro(t, pk) : null;
        return (
          <g key={k}>
            <path d={poli(t)} fill={C.navy} opacity={0.85} />
            <g clipPath={`url(#${uid}-${k})`}>
              {vista === "perfil" ? (
                <g>
                  <path d={ola(0)} fill={K.jp7} opacity={0.85} />
                  <path d={ola(2)} fill="#8FC4D8" opacity={0.5} transform="translate(0,3)" />
                </g>
              ) : (
                <g>
                  <path d={poli(t)} fill={K.jp7} opacity={0.6} />
                  {[0, 1, 2].map((i) => (
                    <line key={i} x1={x0} y1={cy - 20 + i * 20 + Math.sin(f / 9 + i + k) * 4} x2={x1} y2={cy - 20 + i * 20 + Math.sin(f / 9 + i + k + 1) * 4} stroke={C.blanco} strokeWidth={1.6} opacity={0.35} />
                  ))}
                </g>
              )}
              <rect x={x0 + 4} y={y0 + 3} width={Math.max(0, x1 - x0 - 8)} height={2.4} rx={1.2} fill={C.blanco} opacity={0.3} />
            </g>
            <path d={poli(t)} fill="none" stroke={marca ? C.amarillo : C.teal} strokeWidth={marca ? 2.8 : 1.8} strokeLinejoin="round" />
            {marca ? <path d={poli(t)} fill="none" stroke={C.amarillo} strokeWidth={8} opacity={0.3 * late} strokeLinejoin="round" /> : null}
            {pk > 0 ? (
              <g>
                <path d={poli(t)} pathLength={1} fill="none" stroke={C.naranja} strokeWidth={7} opacity={0.35} strokeDasharray={`${pk} 2`} strokeLinejoin="round" />
                <path d={poli(t)} pathLength={1} fill="none" stroke="#FF9A4A" strokeWidth={2.6} strokeDasharray={`${pk} 2`} strokeLinejoin="round" />
              </g>
            ) : null}
            {cabeza ? (
              <g>
                <circle cx={cabeza[0]} cy={cabeza[1]} r={6} fill={C.naranja} opacity={0.35 + 0.2 * late} />
                <circle cx={cabeza[0]} cy={cabeza[1]} r={2.6} fill={C.crema} />
              </g>
            ) : null}
            {fuga > 0.01 && vista === "perfil"
              ? [0.25, 0.6, 0.85].map((u, i) => {
                  const fx = x0 + (x1 - x0) * u;
                  const ph = ((f + k * 9 + i * 13) % 28) / 28;
                  return (
                    <circle key={i} cx={fx} cy={y1 + 1 + ph * 7} r={1.3 + (1 - ph) * 0.8} fill="#FFC967" opacity={fuga * (1 - ph)} />
                  );
                })
              : null}
            {vista === "perfil" ? <circle cx={cx} cy={y0 + 5} r={1.6} fill={C.teal} opacity={0.8} /> : null}
          </g>
        );
      })}
    </g>
  );
};

/**
 * Mancha de combustible con la silueta del SR-71 en el concreto (vista desde arriba): «el avión dejaba su propio
 * contorno en el piso». Mismas x, y, s que un SR71Detallado en planta. p 0..1 = cuánto se ha formado; contorno 0..1 =
 * un trazo que recorre el borde de la mancha.
 */
export const CharcoSR71: React.FC<{ x: number; y: number; f: number; s?: number; p?: number; contorno?: number; rot?: number }> = ({
  x,
  y,
  f,
  s = 1,
  p = 1,
  contorno = 0,
  rot = 0,
}) => {
  if (p <= 0.01) return null;
  const brilla = 0.5 + 0.5 * Math.sin(f / 13);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s * (1 + 0.04 * p)})`}>
      <path d={TODO_PL} fill="#0C0F1A" opacity={0.72 * p} />
      <path d={TODO_PL} fill="#2B4A66" opacity={0.18 * p * brilla} transform="translate(-6,-6)" />
      <path d={TODO_PL} fill="none" stroke="#07090F" strokeWidth={6} opacity={0.5 * p} strokeLinejoin="round" />
      <path d={TODO_PL} fill="none" stroke={K.jp7} strokeWidth={1.6} opacity={0.35 * p} strokeLinejoin="round" transform="translate(-3,-3)" />
      <path d="M300,-20 C150,-30 0,-40 -200,-90 M-160,-160 L-320,-200" stroke={K.jp7} strokeWidth={5} opacity={0.22 * p * brilla} strokeLinecap="round" fill="none" />
      {[290, 140, -30, -140, -265].map((xx, k) => (
        <ellipse key={xx} cx={xx} cy={k > 2 ? (k % 2 ? 112 : -112) : 0} rx={14 * p} ry={8 * p} fill="#05070C" opacity={0.55} />
      ))}
      {contorno > 0.01 ? (
        <g fill="none" strokeLinejoin="round">
          <path d={CONTORNO_PL} pathLength={1} stroke={C.amarillo} strokeWidth={9} opacity={0.3} strokeDasharray={`${contorno} 2`} />
          <path d={CONTORNO_PL} pathLength={1} stroke={C.amarillo} strokeWidth={3.5} strokeDasharray={`${contorno} 2`} />
        </g>
      ) : null}
    </g>
  );
};

// =====================================================================================================
// CORTE DEL MOTOR J58 (cutaway): cono móvil, entrada, conductos de derivación, compresor que gira, cámara de
// combustión, turbina, postquemador y tobera. Morro a la derecha; ≈ 1120×270 a s=1; x,y = centro del eje.
// =====================================================================================================

export type ParteJ58 = "cono" | "entrada" | "bypass" | "motor" | "postquemador" | "tobera";
/** Puntos locales para apuntar la cámara o los rótulos. */
export const J58_PUNTOS: Record<ParteJ58 | "combustor" | "turbina" | "labio", P2> = {
  cono: [440, -30],
  labio: [372, -110],
  entrada: [262, -82],
  bypass: [0, -101],
  motor: [60, -40],
  combustor: [-58, -50],
  turbina: [-128, -50],
  postquemador: [-320, 0],
  tobera: [-515, 0],
};
const J_OUT: P2[] = [[372, -106], [340, -120], [280, -129], [200, -134], [0, -135], [-300, -135], [-440, -131], [-480, -127], [-560, -114]];
const J_IN: P2[] = [[372, -106], [330, -106], [280, -101], [232, -97], [180, -100], [150, -105], [0, -113], [-300, -115], [-440, -113], [-480, -104], [-560, -98]];

/**
 * Motor J58 en corte (ver arriba).
 *   cono 0..1        el cono se desliza hacia atrás (a Mach 3 va atrás)       flujo 0..1  flechas de aire animadas
 *   reparto 0..1     cuánto se marca el aire que pasa de largo (derivación)  potencia 0..1  postquemador encendido
 *   gira             velocidad del compresor (1 normal)                     resalta     parte(s) que laten
 */
export const MotorJ58Corte: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  cono?: number;
  flujo?: number;
  reparto?: number;
  potencia?: number;
  gira?: number;
  resalta?: ParteJ58 | ParteJ58[] | null;
  choque?: number;
}> = ({ x, y, f, s = 1, cono = 0, flujo = 0, reparto = 0, potencia = 0, gira = 1, resalta = null, choque = 0 }) => {
  const uid = "j58" + idLimpio(useId());
  const dx = -70 * lim(cono, 0, 1);
  const partes = resalta === null ? [] : Array.isArray(resalta) ? resalta : [resalta];
  const late = 0.5 + 0.5 * Math.sin(f / 4.5);
  const paredTop = `M${J_OUT[0][0]},${J_OUT[0][1]}${cr(J_OUT)} L${J_IN[J_IN.length - 1][0]},${J_IN[J_IN.length - 1][1]}${cr([...J_IN].reverse())} Z`;
  const paredBot = `M${J_OUT[0][0]},${-J_OUT[0][1]}${cr(espejo(J_OUT))} L${J_IN[J_IN.length - 1][0]},${-J_IN[J_IN.length - 1][1]}${cr(espejo([...J_IN].reverse()))} Z`;
  const ducto = `M${J_IN[0][0]},${J_IN[0][1]}${cr(J_IN)} L${J_IN[J_IN.length - 1][0]},${-J_IN[J_IN.length - 1][1]}${cr(espejo([...J_IN].reverse()))} Z`;
  // álabes: columnas que «giran» (rayitas que suben a distinta velocidad según el ángulo)
  const etapa = (ex: number, rh: number, rt: number, k: number, color: string, rotor: boolean) => {
    const n = 7;
    return (
      <g key={`${ex}`}>
        <rect x={ex - 4} y={-rt} width={8} height={rt * 2} rx={3} fill={oscurecer(color, 0.35)} />
        {Array.from({ length: n }, (_, j) => {
          const a = (j / n) * Math.PI * 2 + (rotor ? f * 0.32 * gira : 0) + k * 0.4;
          const c = Math.cos(a);
          if (c < 0) return null;
          const yy = Math.sin(a);
          const y0 = yy * rh;
          const y1 = yy * rt;
          return (
            <path
              key={j}
              d={`M${ex - 3},${r1(y0)} L${ex + 3},${r1(y0 + 2)} L${ex + 3},${r1(y1 + 2)} L${ex - 3},${r1(y1)} Z`}
              fill={aclarar(color, 0.15 + 0.35 * c)}
              stroke={oscurecer(color, 0.5)}
              strokeWidth={0.8}
              opacity={0.35 + 0.65 * c}
            />
          );
        })}
      </g>
    );
  };
  const llamaCamara = (cx: number, k: number) => {
    const t = 1 + 0.12 * Math.sin(f * 1.3 + k);
    return (
      <g key={cx}>
        {[-1, 1].map((sg) => (
          <g key={sg}>
            <ellipse cx={cx} cy={sg * 54} rx={22 * t} ry={11} fill={C.naranja} opacity={0.75} />
            <ellipse cx={cx + 3} cy={sg * 54} rx={13 * t} ry={6} fill={C.amarillo} />
            <ellipse cx={cx + 5} cy={sg * 54} rx={5} ry={2.6} fill={C.crema} />
          </g>
        ))}
      </g>
    );
  };
  // caminos del aire (de derecha a izquierda)
  const caminoBypass = (sg: number): P2[] => [[560, sg * -88], [372, sg * -92], [250, sg * -92], [160, sg * -101], [-170, sg * -102], [-215, sg * -80], [-470, sg * -52], [-640, sg * -40]];
  const caminoNucleo = (sg: number): P2[] => [[560, sg * -60], [372, sg * -76], [240, sg * -78], [150, sg * -62], [0, sg * -55], [-160, sg * -48], [-470, sg * -24], [-640, sg * -18]];
  const flechas = (pts: P2[], n: number, vel: number, color: string, ancho: number, desfase: number) =>
    Array.from({ length: n }, (_, i) => {
      const t = ((f * vel) / 900 + i / n + desfase) % 1;
      const { p, a } = puntoLinea(pts, t);
      const op = Math.sin(Math.PI * t);
      return (
        <path
          key={i}
          d={`M${ancho * 1.2},${-ancho} L0,0 L${ancho * 1.2},${ancho}`}
          transform={`translate(${r1(p[0])},${r1(p[1])}) rotate(${r1(a + 180)})`}
          fill="none"
          stroke={color}
          strokeWidth={ancho * 0.55}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={op}
        />
      );
    });
  const linea = (pts: P2[], color: string, ancho: number, vel: number) => (
    <path d={`M${pts[0][0]},${pts[0][1]}${cr(pts)}`} fill="none" stroke={color} strokeWidth={ancho} strokeDasharray="16 22" strokeDashoffset={f * vel} strokeLinecap="round" opacity={0.75} />
  );
  const fl = lim(flujo, 0, 1);
  const rp = lim(reparto, 0, 1);
  const marcos: Record<ParteJ58, string> = {
    cono: `M${560 + dx},0 L${330 + dx},-64 L${200 + dx},-64 L${200 + dx},64 L${330 + dx},64 Z`,
    entrada: "M375,-104 L150,-104 L150,104 L375,104 Z",
    bypass: "M160,-112 L-170,-112 L-170,-92 L160,-92 Z M160,112 L-170,112 L-170,92 L160,92 Z",
    motor: "M145,-90 L-165,-90 L-165,90 L145,90 Z",
    postquemador: "M-170,-112 L-470,-112 L-470,112 L-170,112 Z",
    tobera: "M-470,-130 L-560,-114 L-560,114 L-470,130 Z",
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${uid}-d`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0C0E17" />
          <stop offset="0.5" stopColor="#232A3E" />
          <stop offset="1" stopColor="#0C0E17" />
        </linearGradient>
        <pattern id={`${uid}-h`} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={10} height={10} fill="#39425C" />
          <line x1={0} y1={0} x2={0} y2={10} stroke="#56617F" strokeWidth={3} />
        </pattern>
        <clipPath id={`${uid}-ab`}>
          <path d="M-170,-112 L-470,-110 L-560,-98 L-560,98 L-470,110 L-170,112 Z" />
        </clipPath>
        <linearGradient id={`${uid}-m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9CFDB" />
          <stop offset="0.5" stopColor={K.metal} />
          <stop offset="1" stopColor={K.metal2} />
        </linearGradient>
      </defs>
      {/* llama de salida */}
      {potencia > 0.01 ? <Postquemador x={-560} y={0} f={f} largo={420} alto={170} p={potencia} /> : null}
      {/* interior del conducto (pared del fondo) */}
      <path d={ducto} fill={`url(#${uid}-d)`} />
      {[-300, -200, -100, 0, 100].map((lx) => (
        <path key={lx} d={`M${lx},-110 C${lx - 14},-40 ${lx - 14},40 ${lx},110`} stroke="#2E3650" strokeWidth={2} fill="none" />
      ))}
      {/* postquemador encendido dentro del conducto */}
      {potencia > 0.01 ? (
        <g clipPath={`url(#${uid}-ab)`}>
          <Postquemador x={-195} y={0} f={f + 5} largo={360} alto={150} p={potencia} diamantes={0} />
        </g>
      ) : null}
      {/* conductos de derivación (6 tubos en el corte: 3 arriba, 3 abajo) */}
      {[-1, 1].map((sg) => (
        <g key={sg}>
          <path d={`M160,${sg * 92} L-170,${sg * 92} L-210,${sg * 72}`} stroke={K.metal2} strokeWidth={5} fill="none" />
          {[97, 103, 109].map((r) => (
            <path key={r} d={`M150,${sg * r} L-160,${sg * r}`} stroke="#3E4762" strokeWidth={2.4} fill="none" />
          ))}
          <path d={`M165,${sg * 92} L182,${sg * 100}`} stroke={K.metal} strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
      {/* motor: carcasa, tambor, compresor de 9 etapas, cámaras, turbina y cono de cola */}
      <path d="M150,-90 L-170,-90 L-170,90 L150,90 Z" fill="#1B2030" />
      <path d="M150,-90 L-170,-90" stroke={K.metal} strokeWidth={4} />
      <path d="M150,90 L-170,90" stroke={K.metal2} strokeWidth={4} />
      {Array.from({ length: 9 }, (_, k) => {
        const ex = 132 - k * 17;
        const rt = 84 - k * 2.2;
        return etapa(ex, 38, rt, k, "#9EA6B8", true);
      })}
      {Array.from({ length: 8 }, (_, k) => (
        <rect key={k} x={124 - k * 17} y={-80 + k * 2} width={3} height={160 - k * 4} fill="#5D6578" opacity={0.7} />
      ))}
      {[-34, -58, -82].map((cx, k) => llamaCamara(cx, k))}
      <path d="M-20,-72 L-95,-72 M-20,72 L-95,72 M-20,-36 L-95,-36 M-20,36 L-95,36" stroke="#6D5A4E" strokeWidth={3} />
      {etapa(-112, 34, 74, 1, "#C08A62", true)}
      {etapa(-134, 34, 78, 2, "#B07A5A", true)}
      <rect x={140} y={-38} width={1} height={76} fill="none" />
      <path d="M150,-38 L-150,-38 L-150,38 L150,38 Z" fill={`url(#${uid}-m)`} />
      <path d="M150,-38 L-150,-38" stroke="#E3E7EF" strokeWidth={2} opacity={0.8} />
      <path d="M-150,-38 L-205,0 L-150,38 Z" fill={K.metal2} />
      <path d="M-150,-38 L-205,0" stroke={K.metal} strokeWidth={2} />
      {/* portallamas del postquemador */}
      {[-1, 1].map((sg) =>
        [30, 62].map((r) => <path key={`${sg}${r}`} d={`M-200,${sg * r - 6} L-212,${sg * r} L-200,${sg * r + 6}`} stroke={K.metal} strokeWidth={3} fill="none" />),
      )}
      {/* cuerpo central fijo y cono móvil */}
      <path d="M210,-62 L150,-40 L150,40 L210,62 Z" fill={K.metal2} />
      <path d={`M${560 + dx},0 L${330 + dx},-64 L${200 + dx},-64 L${200 + dx},64 L${330 + dx},64 Z`} fill={K.base} stroke={K.borde} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={`M${560 + dx},0 L${330 + dx},-64 L${200 + dx},-64 L${200 + dx},0 Z`} fill={K.luz} />
      <path d={`M${548 + dx},-2 L${340 + dx},-58`} stroke={K.brillo} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      <path d={`M${330 + dx},-64 L${330 + dx},64`} stroke={K.linea} strokeWidth={2} />
      <path d={`M${300 + dx},-63 L${300 + dx},63 M${270 + dx},-63 L${270 + dx},63`} stroke={K.remache} strokeWidth={2.6} strokeDasharray="0.01 6" strokeLinecap="round" opacity={0.85} />
      {/* paredes cortadas de la góndola */}
      <path d={paredTop} fill={`url(#${uid}-h)`} stroke={K.borde} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={paredBot} fill={`url(#${uid}-h)`} stroke={K.borde} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={`M${J_OUT[0][0]},${J_OUT[0][1]}${cr(J_OUT)}`} stroke={K.luz} strokeWidth={5} fill="none" />
      <path d={`M${J_IN[0][0]},${J_IN[0][1]}${cr(J_IN)} M${J_IN[0][0]},${-J_IN[0][1]}${cr(espejo(J_IN))}`} stroke={C.rojo} strokeWidth={2.6} fill="none" opacity={0.9} />
      <path d="M372,-106 L380,-104 M372,106 L380,104" stroke={K.brillo} strokeWidth={3} strokeLinecap="round" />
      {/* tobera de eyección con puertas */}
      {[-1, 1].map((sg) => (
        <g key={sg}>
          <path d={`M-470,${sg * 104} L-505,${sg * 86} L-560,${sg * 98}`} stroke={K.metal} strokeWidth={4} fill="none" strokeLinejoin="round" />
          {[0, 1, 2].map((k) => (
            <rect key={k} x={-462 + k * 14} y={sg > 0 ? 116 : -128} width={10} height={12} rx={2} fill={K.metal2} transform={`rotate(${sg * 10} ${-457 + k * 14} ${sg * 122})`} />
          ))}
        </g>
      ))}
      {/* onda de choque del cono */}
      {choque > 0.01 ? (
        <g opacity={choque}>
          {[-1, 1].map((sg) => (
            <path key={sg} d={`M${560 + dx},0 L376,${sg * -104}`} stroke={C.teal} strokeWidth={3} strokeDasharray="10 7" strokeDashoffset={-f * 2} />
          ))}
        </g>
      ) : null}
      {/* flujo de aire */}
      {fl > 0.01 ? (
        <g opacity={fl}>
          {[-1, 1].map((sg) => (
            <g key={sg}>
              {linea(caminoNucleo(sg), "#E9E4FF", 3 - rp * 1.4, 7)}
              {linea(caminoBypass(sg), C.teal, 3 + rp * 4, 9)}
              {flechas(caminoNucleo(sg), 4, 7, "#E9E4FF", 9 - rp * 3, sg > 0 ? 0.5 : 0)}
              {flechas(caminoBypass(sg), 5, 9, C.teal, 10 + rp * 6, sg > 0 ? 0.3 : 0.1)}
            </g>
          ))}
        </g>
      ) : null}
      {partes.map((p) => (
        <g key={p} fill="none" strokeLinejoin="round">
          <path d={marcos[p]} stroke={C.amarillo} strokeWidth={14} opacity={0.25 * late} />
          <path d={marcos[p]} stroke={C.amarillo} strokeWidth={4.5} strokeDasharray="18 10" strokeDashoffset={-f * 1.5} opacity={0.7 + 0.3 * late} />
        </g>
      ))}
    </g>
  );
};
