// Biblioteca Plano Pop · textos con entrada (letra a letra con rebote, escala con sobrepaso, deslizar, máquina),
// etiqueta blanca con chispa y el sello de prohibido. Un solo <text> con <tspan> por letra: nada se encima.
import React from "react";
import { Easing, interpolate, spring } from "remotion";
import { C, FPS_INF, fijo, fontFamily } from "../kit";
import { anchoT } from "./paleta";

export type ModoTexto = "letras" | "rebote" | "deslizar" | "maquina";

const resorte = (f: number, en: number, damping = 9) =>
  f < en ? 0 : spring({ frame: f - en, fps: FPS_INF, config: { damping, stiffness: 190, mass: 0.6 } });

/** Chispa de 4 rayitas que salta y se apaga en ~10 fotogramas (al terminar una palabra o al aparecer algo). */
export const Chispa: React.FC<{ x: number; y: number; f: number; desde: number; s?: number; color?: string }> = ({
  x,
  y,
  f,
  desde,
  s = 1,
  color = C.amarillo,
}) => {
  const t = (f - desde) / 10;
  if (t < 0 || t >= 1) return null;
  const d0 = 18 + t * 40;
  const d1 = d0 + 26 * (1 - t);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} stroke={color} strokeWidth={8 * (1 - t) + 2} strokeLinecap="round">
      {[-90, -30, 30, 90, 150, 210].map((a) => {
        const r = (a * Math.PI) / 180;
        return <line key={a} x1={Math.cos(r) * d0} y1={Math.sin(r) * d0} x2={Math.cos(r) * d1} y2={Math.sin(r) * d1} />;
      })}
    </g>
  );
};

/**
 * Texto que entra. modo:
 *   "letras"   letra a letra, cada una sube con rebote (vel = fotogramas entre letras, 2 por defecto)
 *   "rebote"   todo el texto crece con sobrepaso
 *   "deslizar" entra desde un lado (dir) con freno
 *   "maquina"  letra a letra seca, con cursor (solo anchor "start")
 * caja = {fondo, pad?, radio?, tinta?}: caja detrás que entra con escala. sombra = sombra dura desplazada.
 * contorno = color del borde del texto. chispa = chispa al terminar. Solo mayúsculas para que `anchoT` acierte.
 */
export const TextoEntra: React.FC<{
  x: number;
  y: number;
  texto: string;
  f: number;
  desde?: number;
  size?: number;
  modo?: ModoTexto;
  color?: string;
  anchor?: "start" | "middle" | "end";
  vel?: number;
  dir?: 1 | -1;
  caja?: { fondo: string; pad?: number; radio?: number };
  sombra?: boolean | string;
  contorno?: string;
  chispa?: boolean | string;
  ls?: number;
  weight?: number;
  sale?: number;
}> = ({
  x,
  y,
  texto,
  f,
  desde = 0,
  size = 90,
  modo = "letras",
  color = C.blanco,
  anchor = "middle",
  vel = 2,
  dir = -1,
  caja,
  sombra = true,
  contorno,
  chispa,
  ls = 0,
  weight = 900,
  sale,
}) => {
  if (f < desde) return null;
  const letras = Array.from(texto);
  const ancho = anchoT(texto, size) + ls * letras.length;
  const x0 = anchor === "start" ? x : anchor === "middle" ? x - ancho / 2 : x - ancho;
  const fin = modo === "letras" || modo === "maquina" ? desde + letras.length * vel : desde + 8;
  // salida opcional: se encoge y desvanece en 8 fotogramas desde `sale`
  const fuera = sale === undefined ? 1 : 1 - interpolate(f, [sale, sale + 8], [0, 1], fijo);
  if (fuera <= 0.001) return null;
  const sc = modo === "rebote" ? resorte(f, desde, 7) : 1;
  const desliza =
    modo === "deslizar" ? interpolate(f, [desde, desde + 12], [1, 0], { ...fijo, easing: Easing.out(Easing.back(1.6)) }) : 0;
  const opDesl = modo === "deslizar" ? interpolate(f, [desde, desde + 6], [0, 1], fijo) : 1;
  const colSombra = typeof sombra === "string" ? sombra : "rgba(18,12,46,0.55)";
  const cajaS = caja ? resorte(f, desde - 2, 10) : 0;
  const pad = caja?.pad ?? size * 0.35;
  const tspans = (relleno: string | undefined, conBorde: boolean) => {
    let prev = 0;
    return letras.map((ch, k) => {
      const en = desde + k * vel;
      let op = 1;
      let off = 0;
      if (modo === "letras") {
        const r = resorte(f, en, 8);
        op = Math.min(1, r * 2.5);
        off = (1 - r) * size * 0.55;
      } else if (modo === "maquina") {
        op = f >= en ? 1 : 0;
      }
      const dy = off - prev;
      prev = off;
      return (
        <tspan key={k} dy={dy} fillOpacity={op} strokeOpacity={conBorde ? op : 0} fill={relleno}>
          {ch}
        </tspan>
      );
    });
  };
  const visibles = modo === "maquina" ? Math.min(letras.length, Math.floor((f - desde) / vel) + 1) : letras.length;
  const cursorX = x0 + anchoT(letras.slice(0, visibles).join(""), size) + ls * visibles + 8;
  const base = {
    x,
    y,
    fontFamily,
    fontWeight: weight,
    fontSize: size,
    textAnchor: anchor,
    letterSpacing: ls,
  } as const;
  return (
    <g
      opacity={opDesl * fuera}
      transform={`translate(${desliza * dir * 260},0) translate(${x0 + ancho / 2},${y - size * 0.35}) scale(${sc * (0.6 + 0.4 * fuera)}) translate(${-x0 - ancho / 2},${-y + size * 0.35})`}
    >
      {caja && cajaS > 0.001 ? (
        <g
          transform={`translate(${x0 + ancho / 2},${y - size * 0.35}) scale(${cajaS}) translate(${-x0 - ancho / 2},${-y + size * 0.35})`}
        >
          <rect
            x={x0 - pad + 8}
            y={y - size * 0.95 - pad * 0.5 + 10}
            width={ancho + pad * 2}
            height={size * 1.25 + pad}
            rx={caja.radio ?? 20}
            fill="rgba(18,12,46,0.35)"
          />
          <rect
            x={x0 - pad}
            y={y - size * 0.95 - pad * 0.5}
            width={ancho + pad * 2}
            height={size * 1.25 + pad}
            rx={caja.radio ?? 20}
            fill={caja.fondo}
          />
        </g>
      ) : null}
      {sombra ? (
        <text {...base} x={x + size * 0.06} y={y + size * 0.08} fill={colSombra}>
          {tspans(undefined, false)}
        </text>
      ) : null}
      <text
        {...base}
        fill={color}
        stroke={contorno}
        strokeWidth={contorno ? size * 0.12 : 0}
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        {tspans(undefined, !!contorno)}
      </text>
      {modo === "maquina" && anchor === "start" && f < fin + 20 && Math.floor(f / 8) % 2 === 0 ? (
        <rect x={cursorX} y={y - size * 0.8} width={size * 0.08} height={size * 0.9} fill={color} />
      ) : null}
      {chispa ? (
        <Chispa
          x={x0 + ancho + size * 0.4}
          y={y - size * 0.75}
          f={f}
          desde={fin}
          s={size / 90}
          color={typeof chispa === "string" ? chispa : C.amarillo}
        />
      ) : null}
    </g>
  );
};

/**
 * Etiqueta blanca con texto oscuro (SINGULARITY, nombres, PLANCK SCALE…): la caja entra con escala, el texto
 * letra a letra y al final salta una chispa. icono: "usuario" | "check" | "x" a la izquierda. x,y = centro.
 * (Se llama EtiquetaCaja porque `Etiqueta`, la ficha amarilla de V09, ya existía en rotulos.tsx.)
 */
export const EtiquetaCaja: React.FC<{
  x: number;
  y: number;
  texto: string;
  f: number;
  desde?: number;
  size?: number;
  fondo?: string;
  tinta?: string;
  icono?: "usuario" | "check" | "x";
  chispa?: boolean;
  sale?: number;
}> = ({ x, y, texto, f, desde = 0, size = 56, fondo = C.blanco, tinta = C.navy, icono, chispa = true, sale }) => {
  if (f < desde) return null;
  const ic = icono ? size * 1.1 : 0;
  const ancho = anchoT(texto, size) + size * 0.9 + ic;
  const alto = size * 1.6;
  const s = resorte(f, desde, 11);
  const fuera = sale === undefined ? 1 : 1 - interpolate(f, [sale, sale + 8], [0, 1], fijo);
  if (fuera <= 0.001) return null;
  const x0 = -ancho / 2;
  const iconoS = resorte(f, desde + 4, 7);
  return (
    <g transform={`translate(${x},${y}) scale(${s * fuera})`} opacity={fuera}>
      <rect x={x0 + 8} y={-alto / 2 + 10} width={ancho} height={alto} rx={alto * 0.3} fill="rgba(18,12,46,0.35)" />
      <rect x={x0} y={-alto / 2} width={ancho} height={alto} rx={alto * 0.3} fill={fondo} />
      <rect x={x0} y={alto / 2 - alto * 0.16} width={ancho} height={alto * 0.16} rx={alto * 0.08} fill="rgba(18,12,46,0.08)" />
      {icono ? (
        <g transform={`translate(${x0 + size * 0.45 + ic / 2},0) scale(${iconoS * (size / 56)})`}>
          {icono === "usuario" ? (
            <g fill={tinta}>
              <circle cx={0} cy={-10} r={12} />
              <path d="M-22,22 Q-22,2 0,2 Q22,2 22,22 Z" />
            </g>
          ) : icono === "check" ? (
            <g>
              <circle r={24} fill={C.teal2} />
              <path
                d="M-11,1 L-3,10 L13,-9"
                fill="none"
                stroke={C.blanco}
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ) : (
            <g stroke={C.rojo} strokeWidth={9} strokeLinecap="round">
              <line x1={-15} y1={-15} x2={15} y2={15} />
              <line x1={15} y1={-15} x2={-15} y2={15} />
            </g>
          )}
        </g>
      ) : null}
      <TextoEntra
        x={x0 + size * 0.45 + ic}
        y={size * 0.36}
        texto={texto}
        f={f}
        desde={desde + 3}
        size={size}
        modo="letras"
        vel={1}
        color={tinta}
        anchor="start"
        sombra={false}
      />
      {chispa ? <Chispa x={-x0 + 6} y={-alto / 2 - 4} f={f} desde={desde + 3 + Array.from(texto).length} s={size / 70} /> : null}
    </g>
  );
};

/**
 * El sello de prohibido: círculo rojo con barra diagonal que cae desde arriba con rebote (escala 2,2 → 1).
 * children = lo prohibido, dibujado debajo del sello con origen en (x, y). r = radio del círculo.
 */
export const SelloProhibido: React.FC<{
  x: number;
  y: number;
  f: number;
  desde?: number;
  r?: number;
  color?: string;
  rot?: number;
  children?: React.ReactNode;
}> = ({ x, y, f, desde = 0, r = 160, color = C.rojo, rot = -8, children }) => {
  const k = resorte(f, desde, 7);
  const e = f < desde ? 0 : 2.2 - 1.2 * k;
  const g = r * 0.2;
  return (
    <g>
      {children ? <g transform={`translate(${x},${y})`}>{children}</g> : null}
      {f >= desde ? (
        <g transform={`translate(${x},${y}) rotate(${rot}) scale(${e})`} opacity={Math.min(1, (f - desde) / 3)}>
          <circle cx={6} cy={10} r={r} fill="none" stroke="rgba(18,12,46,0.35)" strokeWidth={g} />
          <line
            x1={-r * 0.7 + 6}
            y1={-r * 0.7 + 10}
            x2={r * 0.7 + 6}
            y2={r * 0.7 + 10}
            stroke="rgba(18,12,46,0.35)"
            strokeWidth={g}
          />
          <circle r={r} fill="none" stroke={color} strokeWidth={g} />
          <line x1={-r * 0.7} y1={-r * 0.7} x2={r * 0.7} y2={r * 0.7} stroke={color} strokeWidth={g} strokeLinecap="butt" />
          <circle r={r + g / 2} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.35} />
        </g>
      ) : null}
    </g>
  );
};
