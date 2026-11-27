// Biblioteca Plano Pop · gráficos: barras, líneas, dispersión, progreso, medidores, cotas, línea de tiempo y contador
// Piezas COPIADAS de los videos viejos (los originales siguen en su sitio y no se tocan) con props genéricas.
// Todas van dentro de <Lienzo> (1920×1080). f = fotograma local de la escena; s = escala (1 = tamaño base).
// Catálogo con ejemplos: ./CATALOGO.md
import React from "react";
import { random } from "remotion";
import { C, T, Pin, miles } from "../kit";
import { PB as P, anchoT, lim } from "./paleta";

// del canal original (Histograma)
export const Barras: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  f: number;
  barras: number[];
  progreso?: number;
  pico?: number;
  etiquetas?: string[];
  color?: string;
}> = ({ x, y, w, h, barras, progreso = 1, pico, etiquetas = [], color = C.teal }) => {
  const n = barras.length;
  const bw = w / n;
  return (
    <g>
      <rect x={x - 6} y={y + h} width={w + 12} height={6} fill={C.blanco} opacity={0.6} />
      {barras.map((v, k) => {
        const hh = v * h * lim(progreso * 1.4 - (k / n) * 0.4, 0, 1);
        return (
          <g key={k}>
            <rect x={x + k * bw + 3} y={y + h - hh} width={bw - 6} height={hh} rx={4} fill={pico === k ? C.amarillo : color} />
            {etiquetas[k] ? (
              <T x={x + k * bw + bw / 2} y={y + h + 46} size={30} weight={700} fill={pico === k ? C.amarillo : C.blanco}>
                {etiquetas[k]}
              </T>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

// del canal original
export const Grafica: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  f: number;
  serie: number[];
  color: string;
  progreso?: number;
}> = ({ x, y, w, h, serie, color, progreso = 1 }) => {
  const n = serie.length;
  const lim = Math.max(1, Math.floor((n - 1) * Math.max(0, Math.min(1, progreso))) + 1);
  const pts = serie.slice(0, lim).map((v, k) => `${(x + (k / (n - 1)) * w).toFixed(1)},${(y + h - v * h).toFixed(1)}`);
  return (
    <g>
      <rect x={x - 6} y={y} width={6} height={h + 6} fill={C.blanco} opacity={0.6} />
      <rect x={x - 6} y={y + h} width={w + 12} height={6} fill={C.blanco} opacity={0.6} />
      {lim > 1 ? (
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </g>
  );
};

// del canal original
export const Dispersion: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  f: number;
  puntos: {
    px: number;
    py: number;
    tacha?: number;
    texto?: string;
    color?: string;
  }[];
  banda?: { a: number; b: number; o: number };
  vertical?: { px: number; texto: string; color?: string };
}> = ({ x, y, w, h, puntos, banda, vertical }) => (
  <g>
    <rect x={x - 6} y={y} width={6} height={h + 6} fill={C.blanco} opacity={0.6} />
    <rect x={x - 6} y={y + h} width={w + 12} height={6} fill={C.blanco} opacity={0.6} />
    {banda && banda.o > 0.01 ? (
      <rect x={x + banda.a * w} y={y} width={(banda.b - banda.a) * w} height={h} fill={C.lila} opacity={0.3 * banda.o} />
    ) : null}
    {vertical ? (
      <g>
        <rect x={x + vertical.px * w - 3} y={y - 20} width={6} height={h + 20} fill={vertical.color ?? C.rojo} />
        <T x={x + vertical.px * w} y={y - 36} size={40} fill={vertical.color ?? C.rojo}>
          {vertical.texto}
        </T>
      </g>
    ) : null}
    {puntos.map((p, k) => {
      const cx = x + p.px * w;
      const cy = y + h - p.py * h;
      const t = p.tacha ?? 0;
      return (
        <g key={k}>
          <circle cx={cx} cy={cy} r={16} fill={p.color ?? C.amarillo} opacity={1 - 0.6 * t} />
          {t > 0.01 ? (
            <g transform={`translate(${cx},${cy}) scale(${t})`}>
              <rect x={-26} y={-6} width={52} height={12} rx={6} fill={C.rojo} transform="rotate(45)" />
              <rect x={-26} y={-6} width={52} height={12} rx={6} fill={C.rojo} transform="rotate(-45)" />
            </g>
          ) : null}
          {p.texto && t > 0.01 ? (
            <T x={cx} y={cy - 32} size={26} fill={C.rojo} opacity={t} borde={C.navy}>
              {p.texto}
            </T>
          ) : null}
        </g>
      );
    })}
  </g>
);

// del canal original
export const Barra: React.FC<{
  x: number;
  y: number;
  w: number;
  progreso: number;
  color?: string;
  h?: number;
}> = ({ x, y, w, progreso, color = C.amarillo, h = 44 }) => (
  <g>
    <rect x={x + 6} y={y + 7} width={w} height={h} rx={h / 2} fill="rgba(0,0,0,0.3)" />
    <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={C.navy2} />
    <rect
      x={x}
      y={y}
      width={Math.max(h, w * Math.max(0, Math.min(1, progreso)))}
      height={h}
      rx={h / 2}
      fill={color}
      opacity={progreso > 0 ? 1 : 0}
    />
  </g>
);

// del canal original
export const Mosaico: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  llenos?: number;
  punto?: number;
}> = ({ x, y, s = 1, f, llenos = 60, punto = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: 60 }, (_, k) => {
      const c = k % 10;
      const r = Math.floor(k / 10);
      const vis = Math.max(0, Math.min(1, llenos - k));
      return vis > 0.01 ? (
        <g key={k} opacity={vis}>
          <rect x={c * 90} y={r * 90} width={84} height={84} rx={6} fill={P.espacio} stroke={C.navy2} strokeWidth={3} />
          {random(`mo${k}`) > 0.8 ? (
            <circle
              cx={c * 90 + 20 + random(`mx${k}`) * 44}
              cy={r * 90 + 20 + random(`my${k}`) * 44}
              r={3}
              fill={C.blanco}
              opacity={0.6}
            />
          ) : null}
        </g>
      ) : null;
    })}
    {punto > 0.01 ? (
      <g opacity={punto}>
        <rect x={2 * 90 + 10} y={2 * 90} width={6} height={84} fill={C.crema} opacity={0.25} />
        <circle cx={2 * 90 + 14} cy={2 * 90 + 46} r={4} fill={P.azul} />
        <circle cx={2 * 90 + 14} cy={2 * 90 + 46} r={14 + 3 * Math.sin(f / 6)} fill="none" stroke={C.amarillo} strokeWidth={3} />
      </g>
    ) : null}
  </g>
);

// del canal original (MedidorFundido)
export const Medidor: React.FC<{
  x: number;
  y: number;
  f: number;
  nivel: number;
  max?: number;
  linea?: number;
  lineaTexto?: string;
  texto?: string;
  s?: number;
  color?: string;
}> = ({ x, y, f, nivel, max = 50, linea, lineaTexto, texto, s = 1, color = P.fundido }) => {
  const alto = 360;
  const h = (lim(nivel, 0, max) / max) * alto;
  const yl = linea !== undefined ? -60 - (linea / max) * alto : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-47} y={-412} width={110} height={420} rx={55} fill="rgba(18,12,46,0.4)" />
      <rect x={-55} y={-420} width={110} height={420} rx={55} fill={C.blanco} />
      <rect x={-34} y={-60 - h} width={68} height={h + 40} rx={20} fill={color} />
      <circle cx={0} cy={-40} r={36} fill={color} />
      <rect x={-34} y={-60 - h} width={68} height={10} rx={5} fill={C.amarillo} opacity={0.5 + 0.5 * Math.sin(f / 6)} />
      {linea !== undefined ? (
        <g>
          <rect x={-74} y={yl - 5} width={148} height={10} rx={5} fill={C.rojo} />
          {lineaTexto ? (
            <T x={92} y={yl + 14} size={38} anchor="start" fill={C.rojo} borde={C.navy}>
              {lineaTexto}
            </T>
          ) : null}
        </g>
      ) : null}
      {texto ? (
        <T x={0} y={-446} size={64} fill={C.amarillo} borde={C.navy}>
          {texto}
        </T>
      ) : null}
    </g>
  );
};

// del canal original
export const CotaH: React.FC<{
  x1: number;
  x2: number;
  y: number;
  o: number;
}> = ({ x1, x2, y, o }) =>
  o <= 0.01 ? null : (
    <g opacity={Math.min(1, o * 1.5)}>
      <rect x={x1} y={y - 4} width={(x2 - x1) * Math.min(1, o)} height={8} rx={4} fill={C.amarillo} />
      <rect x={x1 - 4} y={y - 22} width={8} height={44} rx={4} fill={C.amarillo} />
      {o >= 0.98 ? <rect x={x2 - 4} y={y - 22} width={8} height={44} rx={4} fill={C.amarillo} /> : null}
    </g>
  );

// del canal original
export const CotaV: React.FC<{
  x: number;
  y1: number;
  y2: number;
  o: number;
}> = ({ x, y1, y2, o }) =>
  o <= 0.01 ? null : (
    <g opacity={Math.min(1, o * 1.5)}>
      <rect x={x - 4} y={y1} width={8} height={(y2 - y1) * Math.min(1, o)} rx={4} fill={C.amarillo} />
      <rect x={x - 22} y={y1 - 4} width={44} height={8} rx={4} fill={C.amarillo} />
      {o >= 0.98 ? <rect x={x - 22} y={y2 - 4} width={44} height={8} rx={4} fill={C.amarillo} /> : null}
    </g>
  );

/**
 * Línea de tiempo genérica (a partir del reloj geológico de V08). Barra de x a x+w a la altura y; `desde` es el
 * valor del borde izquierdo y `hasta` el del derecho (sirve hacia atrás: desde 23, hasta 0). marcas = valores con
 * rayita y número (formato los escribe). marcador = pin rojo con su cifra; vivo = desde dónde la barra va teal
 * hasta el marcador. franjas = bandas {a, b, texto?, color?}. pregunta 0..1 = «?» junto al pin.
 */
export const LineaTiempo: React.FC<{
  f: number;
  desde: number;
  hasta: number;
  marcas: number[];
  x?: number;
  y?: number;
  w?: number;
  s?: number;
  titulo?: string;
  formato?: (v: number) => string;
  marcador?: number;
  textoMarcador?: string;
  vivo?: number;
  franjas?: { a: number; b: number; texto?: string; color?: string }[];
  pregunta?: number;
}> = ({
  f,
  desde,
  hasta,
  marcas,
  x = 160,
  y = 820,
  w = 1600,
  s = 1,
  titulo,
  formato = (v) => String(v),
  marcador,
  textoMarcador,
  vivo,
  franjas = [],
  pregunta = 0,
}) => {
  const X = (v: number) => x + ((v - desde) / (hasta - desde)) * w;
  const cx = x + w / 2;
  return (
    <g transform={`translate(${cx},${y}) scale(${s}) translate(${-cx},${-y})`}>
      {titulo ? (
        <T x={x} y={y - 120} size={34} anchor="start" fill={C.hielo} ls={3}>
          {titulo}
        </T>
      ) : null}
      <rect x={x - 14} y={y - 14} width={w + 28} height={28} rx={14} fill={C.navy2} />
      {vivo !== undefined && marcador !== undefined ? (
        <rect
          x={Math.min(X(vivo), X(marcador))}
          y={y - 14}
          width={Math.abs(X(marcador) - X(vivo))}
          height={28}
          rx={14}
          fill={C.teal}
        />
      ) : null}
      {franjas.map((b, k) => (
        <g key={k}>
          <rect
            x={Math.min(X(b.a), X(b.b))}
            y={y - 40}
            width={Math.abs(X(b.b) - X(b.a))}
            height={80}
            rx={14}
            fill={b.color ?? C.lila}
            opacity={0.75}
          />
          {b.texto ? (
            <T x={(X(b.a) + X(b.b)) / 2} y={y + 96} size={32} fill={b.color ?? C.lila}>
              {b.texto}
            </T>
          ) : null}
        </g>
      ))}
      {marcas.map((m) => (
        <g key={m}>
          <rect x={X(m) - 3} y={y + 18} width={6} height={22} fill={C.blanco} opacity={0.7} />
          <T x={X(m)} y={y + 140} size={34} weight={700} opacity={0.85}>
            {formato(m)}
          </T>
        </g>
      ))}
      {marcador !== undefined ? (
        <g>
          <g transform={`translate(${X(marcador)},${y - 46}) scale(1.5) translate(0,-30)`}>
            <Pin x={0} y={0} />
          </g>
          {(() => {
            const txt = textoMarcador ?? formato(marcador);
            const ancho = Math.max(184, anchoT(txt, 54) + 50);
            return (
              <g transform={`translate(${X(marcador)},${y - 176})`}>
                <rect x={-ancho / 2} y={-62} width={ancho} height={80} rx={16} fill={C.rojo} />
                <T x={0} y={-6} size={54}>
                  {txt}
                </T>
              </g>
            );
          })()}
          {pregunta > 0.01 ? (
            <T x={X(marcador) + 140} y={y - 160 + Math.sin(f / 8) * 6} size={110 * pregunta} fill={C.amarillo}>
              ?
            </T>
          ) : null}
        </g>
      ) : null}
    </g>
  );
};

/**
 * Panel contador (el de «DEPTH · 12,262 · FEET» del pozo de Kola, con texto propio). x,y = esquina de arriba;
 * 520×372 a s=1. valor se redondea y lleva comas (miles); resaltado = cifra en amarillo.
 */
export const Contador: React.FC<{
  x: number;
  y: number;
  valor: number;
  titulo: string;
  unidad?: string;
  s?: number;
  resaltado?: boolean;
  w?: number;
  texto?: string;
}> = ({ x, y, valor, titulo, unidad, s = 1, resaltado, w = 520, texto }) => {
  const cifra = texto ?? miles(valor);
  const size = Math.min(132, (w - 60) / Math.max(1, cifra.length * 0.72));
  return (
    <g transform={`translate(${x + w / 2},${y + 186}) scale(${s}) translate(${-x - w / 2},${-y - 186})`}>
      <rect x={x + 8} y={y + 8} width={w} height={372} rx={30} fill="rgba(18,12,46,0.35)" />
      <rect x={x} y={y} width={w} height={372} rx={30} fill={C.navy} />
      <rect x={x} y={y} width={w} height={86} rx={30} fill={C.morado} />
      <rect x={x} y={y + 50} width={w} height={36} fill={C.morado} />
      <T x={x + w / 2} y={y + 60} size={44} ls={6}>
        {titulo}
      </T>
      <T x={x + w / 2} y={y + 248} size={size} fill={resaltado ? C.amarillo : C.blanco}>
        {cifra}
      </T>
      {unidad ? (
        <T x={x + w / 2} y={y + 332} size={50} fill={C.teal} ls={8}>
          {unidad}
        </T>
      ) : null}
    </g>
  );
};
