// Biblioteca Plano Pop · rótulos: sellos, tarjetas, globos, flechas, marcas, frases palabra por palabra y el CTA
// Piezas COPIADAS de los videos viejos (los originales siguen en su sitio y no se tocan) con props genéricas.
// Todas van dentro de <Lienzo> (1920×1080). f = fotograma local de la escena; s = escala (1 = tamaño base).
// Catálogo con ejemplos: ./CATALOGO.md
import React from "react";
import { C, T, en } from "../kit";
import { anchoT, lim } from "./paleta";

// del canal original
export const Sello: React.FC<{
  x: number;
  y: number;
  s: number;
  texto: string;
  rot?: number;
  color?: string;
  tacha?: number;
}> = ({ x, y, s, texto, rot = -12, color = C.rojo, tacha = 0 }) => {
  if (s <= 0.001) return null;
  const w = anchoT(texto, 64) + 70;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-w / 2} y={-62} width={w} height={124} rx={18} fill={color} />
      <rect x={-w / 2 + 12} y={-50} width={w - 24} height={100} rx={12} fill={C.crema} />
      <T x={0} y={23} size={64} fill={color}>
        {texto}
      </T>
      {tacha > 0.001 ? <Tachon x1={-w / 2 - 20} y1={50} x2={w / 2 + 20} y2={-50} p={tacha} color={C.navy} /> : null}
    </g>
  );
};

// del canal original (Sello)
export const SelloGrande: React.FC<{
  x: number;
  y: number;
  p: number;
  w: number;
  rot?: number;
  children: React.ReactNode;
}> = ({ x, y, p, w, rot = -7, children }) =>
  p <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${2.4 - 1.4 * p})`}>
      <rect x={-w / 2 + 10} y={-92} width={w} height={200} rx={26} fill="rgba(18,12,46,0.35)" />
      <rect x={-w / 2} y={-100} width={w} height={200} rx={26} fill={C.rojo} />
      <rect x={-w / 2 + 20} y={-80} width={w - 40} height={160} rx={16} fill="none" stroke={C.blanco} strokeWidth={8} />
      {children}
    </g>
  );

// del canal original
export const Tachon: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p: number;
  grueso?: number;
  color?: string;
}> = ({ x1, y1, x2, y2, p, grueso = 22, color = C.rojo }) => {
  if (p <= 0.001) return null;
  const t = lim(p, 0, 1);
  const xe = x1 + (x2 - x1) * t;
  const ye = y1 + (y2 - y1) * t;
  return (
    <g>
      <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={C.blanco} strokeWidth={grueso + 12} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={color} strokeWidth={grueso} strokeLinecap="round" />
    </g>
  );
};

// del canal original
export const Visto: React.FC<{
  x: number;
  y: number;
  s?: number;
  color?: string;
}> = ({ x, y, s = 1, color = C.teal2 }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle r={34} fill={color} />
      <path
        d="M-15,1 L-4,13 L17,-12"
        fill="none"
        stroke={C.blanco}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );

// del canal original
export const Aviso: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M8,-150 L178,150 L-162,150 Z" fill="rgba(0,0,0,0.3)" />
      <path d="M0,-160 L170,140 L-170,140 Z" fill={C.amarillo} strokeLinejoin="round" />
      <rect x={-16} y={-60} width={32} height={120} rx={16} fill={C.navy} />
      <circle cx={0} cy={100} r={20} fill={C.navy} />
    </g>
  );

// del canal original
export const Signo: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
}> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x},${y + Math.sin(f / 8) * 8}) scale(${s}) rotate(${Math.sin(f / 11) * 6})`}>
    <T x={6} y={8} size={220} fill="rgba(18,12,46,0.35)">
      ?
    </T>
    <T x={0} y={0} size={220} fill={C.amarillo}>
      ?
    </T>
  </g>
);

// del canal original
export const Pregunta: React.FC<{
  x: number;
  y: number;
  s: number;
  size?: number;
}> = ({ x, y, s, size = 220 }) =>
  s <= 0.001 ? null : (
    <g transform={en(x, y - size * 0.35, s)}>
      <T x={x} y={y} size={size} fill={C.rojo} borde={C.blanco}>
        ?
      </T>
    </g>
  );

// del canal original (Estrella)
export const EstrellaForma: React.FC<{
  x: number;
  y: number;
  s: number;
  fill: string;
}> = ({ x, y, s, fill }) =>
  s <= 0.001 ? null : (
    <path
      d="M0,-50 L12,-16 L48,-16 L19,6 L30,40 L0,19 L-30,40 L-19,6 L-48,-16 L-12,-16 Z"
      fill={fill}
      transform={`translate(${x},${y}) scale(${s})`}
    />
  );

// del canal original
export const Bocadillo: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  s?: number;
  cola?: "izq" | "der" | "abajo";
  children: React.ReactNode;
}> = ({ x, y, w, h, s = 1, cola = "abajo", children }) => {
  if (s <= 0.001) return null;
  const c =
    cola === "abajo"
      ? `M${w / 2 - 30},${h - 2} L${w / 2},${h + 50} L${w / 2 + 30},${h - 2} Z`
      : cola === "izq"
        ? `M2,${h / 2 - 26} L-50,${h / 2 + 30} L2,${h / 2 + 26} Z`
        : `M${w - 2},${h / 2 - 26} L${w + 50},${h / 2 + 30} L${w - 2},${h / 2 + 26} Z`;
  return (
    <g transform={`translate(${x + w / 2},${y + h / 2}) scale(${s}) translate(${-w / 2},${-h / 2})`}>
      <rect x={8} y={10} width={w} height={h} rx={34} fill="rgba(0,0,0,0.3)" />
      <rect width={w} height={h} rx={34} fill={C.blanco} />
      <path d={c} fill={C.blanco} />
      {children}
    </g>
  );
};

// del canal original
export const Tarjeta: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  s: number;
  rot?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, s, rot = 0, children }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x + w / 2},${y + h / 2}) rotate(${rot}) scale(${s}) translate(${-w / 2},${-h / 2})`}>
      <rect x={10} y={14} width={w} height={h} rx={30} fill="rgba(0,0,0,0.35)" />
      <rect width={w} height={h} rx={30} fill={C.blanco} />
      {children}
    </g>
  );

// del canal original
export const FichaSospechoso: React.FC<{
  x: number;
  y: number;
  s?: number;
  titulo: string;
  numero?: number;
  tapada?: number;
  sello?: string;
  children?: React.ReactNode;
}> = ({ x, y, s = 1, titulo, numero, tapada = 0, sello, children }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-202} y={-260} width={420} height={540} rx={26} fill="rgba(18,12,46,0.35)" />
      <rect x={-210} y={-270} width={420} height={540} rx={26} fill={C.crema} />
      <rect x={-210} y={150} width={420} height={120} rx={26} fill={C.navy} />
      <rect x={-210} y={150} width={420} height={40} fill={C.navy} />
      <T x={0} y={228} size={Math.min(52, 380 / (titulo.length * 0.7))} fill={C.amarillo}>
        {titulo}
      </T>
      {numero !== undefined ? (
        <g transform="translate(-160,-220)">
          <circle r={36} fill={C.rojo} />
          <T x={0} y={16} size={44}>
            {String(numero)}
          </T>
        </g>
      ) : null}
      <g transform="translate(0,-40)">{children}</g>
      {tapada > 0.01 ? (
        <g opacity={tapada}>
          <rect x={-190} y={-250} width={380} height={380} rx={18} fill={C.navy2} />
          <T x={0} y={-10} size={220} fill={C.lila}>
            ?
          </T>
        </g>
      ) : null}
      {sello ? <Sello x={0} y={-40} s={0.62} texto={sello} rot={-14} /> : null}
    </g>
  );

// del canal original (EtiquetaReal)
export const Etiqueta: React.FC<{
  x: number;
  y: number;
  texto: string;
  o?: number;
  anchor?: "start" | "middle" | "end";
  fondo?: string;
  tinta?: string;
}> = ({ x, y, texto, o = 1, anchor = "start", fondo = C.amarillo, tinta = C.navy }) => {
  if (o <= 0.001) return null;
  const w = anchoT(texto, 40) + 44;
  const x0 = anchor === "start" ? x : anchor === "middle" ? x - w / 2 : x - w;
  return (
    <g transform={`translate(${x0 + w / 2},${y + 30}) scale(${o}) translate(${-x0 - w / 2},${-y - 30})`}>
      <rect x={x0 + 6} y={y + 8} width={w} height={60} rx={16} fill="rgba(18,12,46,0.35)" />
      <rect x={x0} y={y} width={w} height={60} rx={16} fill={fondo} />
      <T x={x0 + w / 2} y={y + 44} size={40} fill={tinta}>
        {texto}
      </T>
    </g>
  );
};

// del canal original
export const Flecha: React.FC<{
  x: number;
  y: number;
  s: number;
  rot?: number;
  color?: string;
  largo?: number;
  ancho?: number;
}> = ({ x, y, s, rot = 0, color = C.amarillo, largo = 220, ancho = 60 }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-ancho / 2} y={-largo / 2 + ancho} width={ancho} height={largo - ancho} rx={12} fill={color} />
      <path
        d={`M${-ancho * 1.3},${-largo / 2 + ancho + 4} L${ancho * 1.3},${-largo / 2 + ancho + 4} L0,${-largo / 2 - ancho * 0.5} Z`}
        fill={color}
      />
    </g>
  );

// del canal original (Flecha)
export const FlechaLinea: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  ancho?: number;
  op?: number;
}> = ({ x1, y1, x2, y2, color = C.blanco, ancho = 6, op = 1 }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const pa = (d: number, s: number): [number, number] => [
    x2 - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s,
    y2 - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s,
  ];
  const [ax, ay] = pa(26, 14);
  const [bx, by] = pa(26, -14);
  return (
    <g opacity={op}>
      <line
        x1={x1}
        y1={y1}
        x2={x2 - Math.cos(a) * 20}
        y2={y2 - Math.sin(a) * 20}
        stroke={color}
        strokeWidth={ancho}
        strokeDasharray="14 12"
        strokeLinecap="round"
      />
      <path d={`M${x2},${y2} L${ax},${ay} L${bx},${by} Z`} fill={color} />
    </g>
  );
};

// del canal original (Giro)
export const FlechaGiro: React.FC<{
  x: number;
  y: number;
  rx: number;
  ry: number;
  s: number;
  f: number;
  color?: string;
}> = ({ x, y, rx, ry, s, f, color = C.amarillo }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path
        d={`M${-rx},0 A${rx},${ry} 0 0 0 ${rx},0`}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray="34 18"
        strokeDashoffset={-f * 3}
      />
      <path d={`M${rx - 20},10 L${rx + 20},10 L${rx},-24 Z`} fill={color} />
    </g>
  );

// del canal original
export type Parte = [string, number, string?];

// del canal original
export const Frase: React.FC<{
  x: number;
  y: number;
  size: number;
  f: number;
  w: (i: number) => number;
  partes: Parte[];
  fill?: string;
  borde?: string;
}> = ({ x, y, size, f, w, partes, fill = C.blanco, borde }) => (
  <T x={x} y={y} size={size} fill={fill} borde={borde}>
    {partes.map(([txt, i, color], k) => {
      const ve = f >= w(i) ? 1 : 0;
      return (
        <tspan key={k} fillOpacity={ve} strokeOpacity={ve} fill={color}>
          {k ? " " : ""}
          {txt}
        </tspan>
      );
    })}
  </T>
);

// del canal original
export const Pulgar: React.FC = () => (
  <g>
    <rect x={-120} y={-20} width={56} height={150} rx={14} fill={C.blanco} />
    <path
      d="M-50,-10 L-14,-120 Q0,-170 40,-150 Q64,-134 52,-96 L38,-30 L80,-30 Q110,-30 106,0 L96,110 Q92,130 70,130 L-50,130 Z"
      fill={C.blanco}
    />
    {[20, 56, 92].map((y) => (
      <rect key={y} x={10} y={y} width={80} height={8} rx={4} fill={C.navy} opacity={0.18} />
    ))}
  </g>
);

// del canal original
export const Campana: React.FC<{ rot: number; on: boolean }> = ({ rot, on }) => (
  <g transform={`rotate(${rot} 0 -70)`}>
    <circle cx={0} cy={-74} r={12} fill={on ? C.amarillo : C.gris} />
    <path d="M-56,30 Q-56,-64 0,-66 Q56,-64 56,30 L74,52 L-74,52 Z" fill={on ? C.amarillo : C.gris} />
    <circle cx={0} cy={66} r={16} fill={on ? "#D9A21F" : C.gris2} />
  </g>
);

/**
 * Tarjeta de estado con filas de pastillas de color (genérica a partir de TarjetaAlerta de V09: «VOLCANO STATUS ·
 * ALERT NORMAL · AVIATION GREEN»). 640 px de ancho; el alto crece con las filas. x,y = esquina de arriba.
 * filas: {etiqueta, valor, color, tinta?} (tinta = color del texto de la pastilla; por defecto blanco).
 */
export const TarjetaEstado: React.FC<{
  x: number;
  y: number;
  s?: number;
  titulo: string;
  filas: { etiqueta: string; valor: string; color: string; tinta?: string }[];
  sello?: string;
}> = ({ x, y, s = 1, titulo, filas, sello }) => {
  const alto = 160 + 92 * (filas.length - 1) + 48;
  const ws = sello ? anchoT(sello, 38) + 40 : 0;
  return (
    <g transform={`translate(${x + 320},${y + alto / 2}) scale(${s}) translate(${-x - 320},${-y - alto / 2})`}>
      <rect x={x + 8} y={y + 10} width={640} height={alto} rx={28} fill="rgba(18,12,46,0.4)" />
      <rect x={x} y={y} width={640} height={alto} rx={28} fill={C.blanco} />
      <rect x={x} y={y} width={640} height={76} rx={28} fill={C.navy2} />
      <rect x={x} y={y + 48} width={640} height={28} fill={C.navy2} />
      <T x={x + 320} y={y + 54} size={40} ls={4}>
        {titulo}
      </T>
      {filas.map((fl, k) => {
        const yy = y + 160 + k * 92;
        return (
          <g key={k}>
            <T x={x + 40} y={yy} size={40} anchor="start" fill={C.navy}>
              {fl.etiqueta}
            </T>
            <rect x={x + 300} y={yy - 46} width={300} height={64} rx={32} fill={fl.color} />
            <T x={x + 450} y={yy} size={40} fill={fl.tinta ?? C.blanco}>
              {fl.valor}
            </T>
          </g>
        );
      })}
      {sello ? (
        <g transform={`translate(${x + 640 - ws + 20},${y + alto - 20}) rotate(-4)`}>
          <rect x={5} y={7} width={ws} height={56} rx={14} fill="rgba(18,12,46,0.35)" />
          <rect width={ws} height={56} rx={14} fill={C.amarillo} />
          <T x={ws / 2} y={41} size={38} fill={C.navy}>
            {sello}
          </T>
        </g>
      ) : null}
    </g>
  );
};

/**
 * Fila de botones que aparecen uno tras otro; el `activa` va en amarillo y flota (de BotonesDuracion, V09).
 * x = centro de la fila, y = borde de arriba. aparece 0..1 los va mostrando.
 */
export const Botones: React.FC<{
  x: number;
  y: number;
  f: number;
  textos: string[];
  activa?: number;
  aparece?: number;
  ancho?: number;
  alto?: number;
  hueco?: number;
  size?: number;
}> = ({ x, y, f, textos, activa, aparece = 1, ancho = 300, alto = 110, hueco = 40, size = 50 }) => {
  const n = textos.length;
  const total = n * ancho + (n - 1) * hueco;
  return (
    <g>
      {textos.map((t, k) => {
        const o = lim(aparece * n - k, 0, 1);
        if (o <= 0.001) return null;
        const bx = x - total / 2 + k * (ancho + hueco);
        const on = activa === k;
        const sube = on ? Math.sin(f / 6) * 4 : 0;
        return (
          <g
            key={k}
            transform={`translate(${bx + ancho / 2},${y + alto / 2 + sube}) scale(${o}) translate(${-bx - ancho / 2},${-y - alto / 2})`}
          >
            <rect x={bx + 7} y={y + 10} width={ancho} height={alto} rx={28} fill="rgba(18,12,46,0.4)" />
            <rect x={bx} y={y} width={ancho} height={alto} rx={28} fill={on ? C.amarillo : C.blanco} />
            <T x={bx + ancho / 2} y={y + alto / 2 + size * 0.36} size={size} fill={C.navy}>
              {t}
            </T>
          </g>
        );
      })}
    </g>
  );
};
