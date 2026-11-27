// Biblioteca Plano Pop · tiempo: contador de rodillos (cuentakilómetros) y calendario de mesa que pasa hojas.
// Nuevas en V11 (once días despierto); genéricas para cualquier video que cuente horas, días, metros o votos.
import React from "react";
import { C, T, fontFamily } from "../kit";
import { anchoT, lim } from "./paleta";
import { dosTonos } from "./volumen";

const sombraPlana = "rgba(18,12,46,0.35)";

/**
 * Contador mecánico de rodillos (tipo cuentakilómetros o marcador de feria). x,y = esquina de arriba a la izquierda.
 *   valor     número que muestra; acepta decimales: el rodillo de las unidades gira continuo y los de la izquierda
 *             solo ruedan cuando el de su derecha pasa de 9 a 0 (como un odómetro de verdad).
 *   digitos   cuántos rodillos (3 por defecto). titulo = placa de arriba (size 38). w = ancho de la caja (330).
 *   sacude    0..1: tirón (la caja salta y se ladea un poco); anímalo con `1 - sale(f, t, t + 10)` en cada cambio.
 *   resalta   0..1: los rodillos se ponen amarillos (récord, cifra final). id = prefijo del clipPath (uno por copia).
 * Mide w × 170 (con título) a s=1. Cifras de 84 px.
 */
export const ContadorRodillo: React.FC<{
  x: number;
  y: number;
  valor: number;
  f?: number;
  id: string;
  digitos?: number;
  titulo?: string;
  w?: number;
  s?: number;
  sacude?: number;
  resalta?: number;
  color?: string;
}> = ({ x, y, valor, f = 0, id, digitos = 3, titulo, w = 330, s = 1, sacude = 0, resalta = 0, color = C.morado }) => {
  const caja = dosTonos(color);
  const dw = 84;
  const dh = 98;
  const gap = 10;
  const total = digitos * dw + (digitos - 1) * gap;
  const x0 = (w - total) / 2;
  const yT = titulo ? 58 : 18;
  const h = yT + dh + 18;
  const v = Math.max(0, valor);
  const dx = Math.sin(f * 1.9) * 7 * sacude;
  const rot = Math.sin(f * 1.3) * 2.5 * sacude;
  const sizeT = titulo ? Math.min(38, (w - 36) / (titulo.length * 0.7)) : 38;
  return (
    <g transform={`translate(${x + w / 2 + dx},${y + h / 2 - 6 * sacude}) rotate(${rot}) scale(${s}) translate(${-w / 2},${-h / 2})`}>
      <defs>
        {Array.from({ length: digitos }, (_, k) => (
          <clipPath key={k} id={`${id}-d${k}`}>
            <rect x={x0 + k * (dw + gap)} y={yT} width={dw} height={dh} rx={10} />
          </clipPath>
        ))}
      </defs>
      <rect x={8} y={10} width={w} height={h} rx={26} fill={sombraPlana} />
      <rect width={w} height={h} rx={26} fill={caja.sombra} />
      <rect width={w} height={h - 8} rx={26} fill={caja.base} />
      <rect x={10} y={8} width={w - 20} height={10} rx={5} fill={caja.luz} opacity={0.6} />
      {[16, w - 16].map((sx) => (
        <g key={sx}>
          <circle cx={sx} cy={h - 22} r={6} fill={caja.sombra} />
          <path d={`M${sx - 4},${h - 22} L${sx + 4},${h - 22}`} stroke={caja.luz} strokeWidth={2} />
        </g>
      ))}
      {titulo ? (
        <T x={w / 2} y={44} size={sizeT} fill={C.crema} ls={2}>
          {titulo}
        </T>
      ) : null}
      {/* bisel de la ventana de los rodillos */}
      <rect x={x0 - 12} y={yT - 10} width={total + 24} height={dh + 20} rx={16} fill={C.negro} />
      {Array.from({ length: digitos }, (_, k) => {
        const pos = digitos - 1 - k; // 0 = unidades
        const base = Math.pow(10, pos);
        const vv = v / base;
        const d = Math.floor(vv) % 10;
        let frac = 0;
        if (pos === 0) frac = vv - Math.floor(vv);
        else {
          const resto = v % base;
          frac = lim(resto - (base - 1), 0, 1);
        }
        const off = (d + frac) * dh;
        const rx = x0 + k * (dw + gap);
        const fondoD = resalta > 0.5 ? C.amarillo : C.blanco;
        return (
          <g key={k}>
            <g clipPath={`url(#${id}-d${k})`}>
              <rect x={rx} y={yT} width={dw} height={dh} fill={fondoD} />
              <g transform={`translate(0,${-off})`}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, j) => (
                  <text
                    key={j}
                    x={rx + dw / 2}
                    y={yT + j * dh + dh * 0.79}
                    fontFamily={fontFamily}
                    fontWeight={900}
                    fontSize={84}
                    fill={C.navy}
                    textAnchor="middle"
                  >
                    {n}
                  </text>
                ))}
              </g>
              {/* sombreado de cilindro: arriba y abajo más oscuros */}
              <rect x={rx} y={yT} width={dw} height={dh * 0.22} fill={C.navy} opacity={0.28} />
              <rect x={rx} y={yT + dh * 0.78} width={dw} height={dh * 0.22} fill={C.navy} opacity={0.32} />
              <rect x={rx} y={yT + dh * 0.22} width={dw} height={6} fill={C.blanco} opacity={0.35} />
            </g>
            <rect x={rx} y={yT} width={dw} height={dh} rx={10} fill="none" stroke={C.negro} strokeWidth={3} />
          </g>
        );
      })}
      {/* aguja indicadora y vidrio */}
      <path d={`M${x0 - 14},${yT + dh / 2} l-12,-10 l0,20 Z`} fill={C.rojo} />
      <path d={`M${x0 + total + 14},${yT + dh / 2} l12,-10 l0,20 Z`} fill={C.rojo} />
      <path d={`M${x0 - 4},${yT - 2} L${x0 + 60},${yT - 2} L${x0 + 10},${yT + dh} L${x0 - 4},${yT + dh} Z`} fill={C.blanco} opacity={0.14} />
    </g>
  );
};

export type HojaCalendario = { arriba: string; grande: string; etiqueta?: string; abajo?: string; color?: string };

/**
 * Calendario de mesa con hojas que se arrancan y vuelan. x,y = centro de la hoja. Hoja de 240×250 a s=1 (con atril).
 *   hojas    lista de hojas: arriba (franja de color, size 40, ≤ 7 letras), etiqueta (chica, size 38, p. ej. «DAY»),
 *            grande (cifra, size 110, ≤ 3 caracteres), abajo (opcional, size 38), color de la franja.
 *   pagina   índice de la hoja de arriba; la parte decimal es la hoja arrancándose (sube, gira y vuela a la derecha).
 *            Anímalo de 3 a 4 en ~12 fotogramas en la palabra «Day four». Pasado el final se queda en la última.
 *   tiembla  0..1: la hoja tiembla (antes de pasar). vuelo = 1 a la derecha, −1 a la izquierda.
 */
export const CalendarioMesa: React.FC<{
  x: number;
  y: number;
  f: number;
  hojas: HojaCalendario[];
  pagina: number;
  s?: number;
  tiembla?: number;
  vuelo?: 1 | -1;
  w?: number;
}> = ({ x, y, f, hojas, pagina, s = 1, tiembla = 0, vuelo = 1, w = 240 }) => {
  const n = hojas.length;
  const p = lim(pagina, 0, n - 1);
  const i = Math.floor(p);
  const t = p - i;
  const h = 250;
  const atril = dosTonos(C.navy2);
  const Hoja: React.FC<{ hoja: HojaCalendario }> = ({ hoja }) => {
    const col = dosTonos(hoja.color ?? C.rojo);
    const sizeA = Math.min(40, (w - 30) / Math.max(1, hoja.arriba.length * 0.7));
    const sizeG = Math.min(110, (w - 30) / Math.max(1, hoja.grande.length * 0.7));
    return (
      <g>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={C.blanco} />
        <rect x={-w / 2} y={h / 2 - 16} width={w} height={16} rx={8} fill={C.crema} />
        <rect x={-w / 2} y={-h / 2} width={w} height={64} rx={14} fill={col.base} />
        <rect x={-w / 2} y={-h / 2 + 40} width={w} height={24} fill={col.base} />
        <rect x={-w / 2} y={-h / 2 + 56} width={w} height={8} fill={col.sombra} />
        <T x={0} y={-h / 2 + 47} size={sizeA} ls={2}>
          {hoja.arriba}
        </T>
        {hoja.etiqueta ? (
          <T x={0} y={-h / 2 + 106} size={38} fill={C.gris2} ls={4}>
            {hoja.etiqueta}
          </T>
        ) : null}
        <T x={0} y={hoja.etiqueta ? h / 2 - (hoja.abajo ? 52 : 26) : 52} size={sizeG} fill={C.navy}>
          {hoja.grande}
        </T>
        {hoja.abajo ? (
          <T x={0} y={h / 2 - 16} size={34} fill={C.gris2}>
            {hoja.abajo}
          </T>
        ) : null}
      </g>
    );
  };
  const vibra = Math.sin(f * 2.3) * 3 * tiembla;
  // la hoja que vuela: se levanta desde los anillos, gira y sale
  const vx = vuelo * (t * t * 520);
  const vy = -t * 260 + t * t * 120;
  const vr = vuelo * t * 70;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* atril de mesa */}
      <path d={`M${-w / 2 - 20},${h / 2 + 26} L${-w / 2 + 6},${-h / 2 + 30} L${w / 2 - 6},${-h / 2 + 30} L${w / 2 + 20},${h / 2 + 26} Z`} fill={atril.sombra} />
      <rect x={-w / 2 - 26} y={h / 2 + 8} width={w + 52} height={26} rx={10} fill={atril.base} />
      <rect x={-w / 2 - 20} y={h / 2 + 10} width={w + 40} height={7} rx={3} fill={atril.luz} opacity={0.5} />
      <rect x={-w / 2 + 12} y={h / 2 + 34} width={w - 24} height={10} rx={5} fill={sombraPlana} />
      {/* grosor del taco que queda (más fino a medida que se arrancan hojas) */}
      {Array.from({ length: Math.max(1, Math.min(5, n - i)) }, (_, k) => (
        <rect key={k} x={-w / 2 + 3} y={-h / 2 + 6 + (k + 1) * 4} width={w - 6} height={h} rx={14} fill={k % 2 ? C.crema : "#E9DFC8"} />
      ))}
      {i + 1 < n ? (
        <g opacity={t > 0 ? 1 : 0}>
          <Hoja hoja={hojas[i + 1]} />
        </g>
      ) : null}
      <g transform={`translate(${vx},${vy + (t > 0 ? 0 : vibra)}) rotate(${vr + (t > 0 ? 0 : vibra * 0.6)}, 0, ${-h / 2})`} opacity={1 - lim((t - 0.7) / 0.3, 0, 1)}>
        <g transform={`skewY(${-t * 14 * vuelo})`}>
          <Hoja hoja={hojas[i]} />
          {t > 0 ? <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={C.navy} opacity={t * 0.18} /> : null}
        </g>
      </g>
      {/* anillos */}
      {[-w * 0.3, -w * 0.1, w * 0.1, w * 0.3].map((ax) => (
        <g key={ax}>
          <rect x={ax - 7} y={-h / 2 - 22} width={14} height={36} rx={7} fill={C.gris2} />
          <rect x={ax - 3} y={-h / 2 - 20} width={5} height={30} rx={2.5} fill={C.blanco} opacity={0.6} />
        </g>
      ))}
    </g>
  );
};

/** Ancho de una cifra del ContadorRodillo para `digitos` (para encajarlo con otras piezas). */
export const anchoContador = (digitos: number) => digitos * 84 + (digitos - 1) * 10 + 60;
/** Útil para títulos de marcadores: ¿cabe `texto` a `size` en `ancho`? */
export const cabe = (texto: string, size: number, ancho: number) => anchoT(texto, size) <= ancho;
