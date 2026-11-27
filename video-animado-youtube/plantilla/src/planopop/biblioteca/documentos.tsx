// Biblioteca Plano Pop · utilería de datos y documentos: tarjeta que se voltea, factura que se desenrolla,
// tarjeta de trofeo (récord), cronómetro, termómetro con escala, reloj de arena, bolsa de dinero y medalla.
// Nuevas para V10 (SR-71) pero genéricas. Todas van dentro de <Lienzo> (1920×1080). f = fotograma local; s = escala.
// Catálogo con ejemplos: ./CATALOGO.md
import React from "react";
import { C, T } from "../kit";
import { anchoT, lim } from "./paleta";
import { Sello } from "./rotulos";
import { dosTonos } from "./volumen";

/**
 * Tarjeta que se da vuelta como una carta (p 0..1: 0 = frente, 1 = dorso; el giro es en X con un saltito).
 * x,y = centro; w×h; frente y dorso se dibujan con origen en el centro de la tarjeta.
 */
export const TarjetaVolteo: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
  frente: React.ReactNode;
  dorso: React.ReactNode;
  s?: number;
  fondo?: string;
  fondoDorso?: string;
  rot?: number;
}> = ({ x, y, w, h, p, frente, dorso, s = 1, fondo = C.crema, fondoDorso = C.blanco, rot = 0 }) => {
  if (s <= 0.001) return null;
  const q = lim(p, 0, 1);
  const sx = Math.max(0.02, Math.abs(Math.cos(q * Math.PI)));
  const salto = Math.sin(q * Math.PI) * 40;
  const dorsoVis = q >= 0.5;
  return (
    <g transform={`translate(${x},${y - salto}) rotate(${rot}) scale(${s * sx},${s})`}>
      <rect x={-w / 2 + 10} y={-h / 2 + 14 + salto * 0.5} width={w} height={h} rx={26} fill="rgba(18,12,46,0.35)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill={dorsoVis ? fondoDorso : fondo} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h * 0.12} rx={26} fill="#FFFFFF" opacity={0.25} />
      {dorsoVis ? dorso : frente}
    </g>
  );
};

/**
 * Factura o recibo largo que se desenrolla hacia abajo (desenrolla 0..1). x,y = centro del borde de arriba; w = ancho.
 * lineas = [{texto, monto?}] (size 40; texto a la izquierda, monto a la derecha). titulo arriba; total opcional.
 * sello = texto de un sello rojo que cae debajo de las líneas, sin taparlas (selloP 0..1; el papel se alarga
 * 150 px para él). Borde de abajo en zigzag de papel cortado. Alto total ≈ 220 + 74·líneas (+100 total, +150 sello).
 */
export const Factura: React.FC<{
  x: number;
  y: number;
  lineas: { texto: string; monto?: string }[];
  desenrolla: number;
  w?: number;
  titulo?: string;
  total?: string;
  sello?: string;
  selloP?: number;
  s?: number;
}> = ({ x, y, lineas, desenrolla, w = 600, titulo = "INVOICE", total, sello, selloP = 0, s = 1 }) => {
  const ySello = 130 + lineas.length * 74 + (total ? 100 : 0) + 90;
  const altoTotal = ySello - 60 + (sello ? 150 : 0);
  const alto = Math.max(40, altoTotal * lim(desenrolla, 0, 1));
  const n = Math.max(2, Math.round(w / 40));
  const zig = Array.from({ length: n + 1 }, (_, k) => `L${-w / 2 + (w * k) / n},${alto + (k % 2 ? 16 : 0)}`);
  const papel = `M${-w / 2},0 L${w / 2},0 L${w / 2},${alto} ${zig.reverse().join(" ")} Z`;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <clipPath id={`fac-${Math.round(x)}-${Math.round(y)}`}>
          <rect x={-w / 2 - 20} y={-30} width={w + 40} height={alto + 20} />
        </clipPath>
      </defs>
      <path d={papel} transform="translate(12,14)" fill="rgba(18,12,46,0.3)" />
      <path d={papel} fill={C.blanco} />
      <g clipPath={`url(#fac-${Math.round(x)}-${Math.round(y)})`}>
        <rect x={-w / 2} y={0} width={w} height={96} fill={C.navy} />
        <T x={0} y={66} size={52} fill={C.amarillo} ls={6}>
          {titulo}
        </T>
        {lineas.map((l, k) => (
          <g key={k}>
            <T x={-w / 2 + 40} y={170 + k * 74} size={40} anchor="start" fill={C.navy}>
              {l.texto}
            </T>
            {l.monto ? (
              <T x={w / 2 - 40} y={170 + k * 74} size={40} anchor="end" fill={C.rojo}>
                {l.monto}
              </T>
            ) : null}
            <line x1={-w / 2 + 40} y1={192 + k * 74} x2={w / 2 - 40} y2={192 + k * 74} stroke={C.gris} strokeWidth={3} strokeDasharray="6 10" />
          </g>
        ))}
        {total ? (
          <g>
            <rect x={-w / 2 + 30} y={130 + lineas.length * 74} width={w - 60} height={80} rx={14} fill={C.amarillo} />
            <T x={0} y={186 + lineas.length * 74} size={48} fill={C.navy}>
              {total}
            </T>
          </g>
        ) : null}
      </g>
      {sello && alto >= ySello ? <Sello x={0} y={ySello} s={selloP > 0.001 ? 2.2 - 1.2 * selloP : 0} texto={sello} rot={-8} /> : null}
    </g>
  );
};

/** Copa de trofeo dorada (≈ 200×240; x,y = base). brillo pasa una franja de luz. */
export const Copa: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => {
  const oro = dosTonos("#E9B44C");
  const luz = (f % 90) / 90;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-70} y={-34} width={140} height={34} rx={8} fill={C.navy2} />
      <rect x={-46} y={-60} width={92} height={28} rx={6} fill={oro.sombra} />
      <rect x={-12} y={-110} width={24} height={52} fill={oro.sombra} />
      <path d="M-80,-240 L80,-240 Q80,-120 0,-108 Q-80,-120 -80,-240 Z" fill={oro.base} />
      <path d="M20,-240 L80,-240 Q80,-120 0,-108 Q40,-150 20,-240 Z" fill={oro.sombra} opacity={0.6} />
      <path d="M-80,-220 Q-128,-216 -116,-176 Q-104,-146 -66,-150" stroke={oro.base} strokeWidth={14} fill="none" />
      <path d="M80,-220 Q128,-216 116,-176 Q104,-146 66,-150" stroke={oro.sombra} strokeWidth={14} fill="none" />
      <path d={`M${-80 + luz * 150},-240 L${-60 + luz * 150},-240 L${-80 + luz * 140},-120 L${-96 + luz * 140},-130 Z`} fill={C.blanco} opacity={0.35} />
    </g>
  );
};

/**
 * Tarjeta de récord con trofeo: copa arriba, cifra grande (size 76) y fecha o subtítulo (size 44).
 * 560×600; x,y = centro. La cifra debe caber en 500 px (≤ 9 caracteres a size 76).
 */
export const TarjetaTrofeo: React.FC<{ x: number; y: number; f: number; cifra: string; sub?: string; s?: number; rot?: number }> = ({
  x,
  y,
  f,
  cifra,
  sub,
  s = 1,
  rot = 0,
}) => {
  if (s <= 0.001) return null;
  const size = Math.min(76, 500 / Math.max(1, cifra.length * 0.7));
  return (
    <g transform={`translate(${x},${y + Math.sin(f / 12) * 5}) rotate(${rot}) scale(${s})`}>
      <rect x={-270} y={-286} width={560} height={600} rx={30} fill="rgba(18,12,46,0.35)" />
      <rect x={-280} y={-300} width={560} height={600} rx={30} fill={C.navy2} />
      <rect x={-264} y={-284} width={528} height={568} rx={22} fill="none" stroke="#E9B44C" strokeWidth={6} />
      <Copa x={0} y={20} f={f} s={1} />
      <T x={0} y={140} size={size} fill={C.amarillo}>
        {cifra}
      </T>
      {sub ? (
        <T x={0} y={220} size={44} fill={C.teal} ls={4}>
          {sub}
        </T>
      ) : null}
    </g>
  );
};

/**
 * Cronómetro de mano: aguja que corre (corre = true) y lectura en una pastilla debajo (texto, size 56).
 * x,y = centro de la esfera; r = radio (≈ 2,1·r de alto con la pastilla).
 */
export const Cronometro: React.FC<{ x: number; y: number; f: number; texto: string; r?: number; corre?: boolean; s?: number }> = ({
  x,
  y,
  f,
  texto,
  r = 150,
  corre = true,
  s = 1,
}) => {
  const a = corre ? f * 12 : 0;
  const caja = dosTonos(C.gris);
  const wT = anchoT(texto, 56) + 60;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-22} y={-r - 52} width={44} height={36} rx={8} fill={caja.sombra} />
      <rect x={-34} y={-r - 66} width={68} height={22} rx={10} fill={caja.base} />
      <rect x={r * 0.62} y={-r * 0.92} width={30} height={24} rx={6} fill={caja.sombra} transform={`rotate(40 ${r * 0.62} ${-r * 0.92})`} />
      <circle cx={8} cy={12} r={r + 16} fill="rgba(18,12,46,0.3)" />
      <circle r={r + 16} fill={caja.base} />
      <circle r={r} fill={C.blanco} />
      {Array.from({ length: 12 }, (_, k) => (
        <rect key={k} x={-4} y={-r + 10} width={8} height={k % 3 ? 16 : 28} rx={4} fill={C.navy} transform={`rotate(${k * 30})`} />
      ))}
      <g transform={`rotate(${a})`}>
        <rect x={-5} y={-r + 26} width={10} height={r - 16} rx={5} fill={C.rojo} />
      </g>
      <circle r={14} fill={C.navy} />
      <ellipse cx={-r * 0.4} cy={-r * 0.45} rx={r * 0.3} ry={r * 0.12} fill={C.blanco} opacity={0.4} transform={`rotate(-35 ${-r * 0.4} ${-r * 0.45})`} />
      <g transform={`translate(0,${r + 70})`}>
        <rect x={-wT / 2 + 6} y={-38} width={wT} height={84} rx={20} fill="rgba(18,12,46,0.35)" />
        <rect x={-wT / 2} y={-44} width={wT} height={84} rx={20} fill={C.navy} />
        <T x={0} y={18} size={56} fill={C.amarillo}>
          {texto}
        </T>
      </g>
    </g>
  );
};

/**
 * Termómetro grande con escala: x,y = centro del bulbo; alto = largo del tubo (por defecto 560).
 * min..max con `marcas` (rótulos size 38 a la izquierda, con `unidad`); valor = nivel; lectura = pastilla a la
 * derecha arriba («600 °F»). caliente = color del líquido (azul si valor < 0 y frio no se da). tiembla 0..1.
 */
export const TermometroEscala: React.FC<{
  x: number;
  y: number;
  f: number;
  valor: number;
  min?: number;
  max?: number;
  marcas?: number[];
  unidad?: string;
  alto?: number;
  lectura?: string;
  color?: string;
  tiembla?: number;
  s?: number;
}> = ({ x, y, f, valor, min = -100, max = 700, marcas, unidad = "°F", alto = 560, lectura, color, tiembla = 0, s = 1 }) => {
  const yv = (v: number) => -60 - ((lim(v, min, max) - min) / (max - min)) * (alto - 40);
  const liquido = color ?? (valor < 32 ? "#3E86E0" : C.rojo);
  const dx = tiembla > 0 ? Math.sin(f * 2.1) * 5 * tiembla : 0;
  const ms = marcas ?? [min, (min + max) / 2, max];
  const lw = lectura ? anchoT(lectura, 48) + 50 : 0;
  return (
    <g transform={`translate(${x + dx},${y}) scale(${s})`}>
      <rect x={-34 + 8} y={-alto - 30 + 12} width={68} height={alto + 30} rx={34} fill="rgba(18,12,46,0.3)" />
      <rect x={-34} y={-alto - 30} width={68} height={alto + 30} rx={34} fill={C.blanco} />
      <circle cx={8} cy={12} r={70} fill="rgba(18,12,46,0.3)" />
      <circle r={70} fill={C.blanco} />
      <rect x={-18} y={yv(valor)} width={36} height={-yv(valor) + 10} rx={18} fill={liquido} />
      <circle r={52} fill={liquido} />
      <ellipse cx={-20} cy={-22} rx={14} ry={9} fill={C.blanco} opacity={0.5} />
      <rect x={-26} y={-alto - 16} width={12} height={alto - 60} rx={6} fill={C.blanco} opacity={0.5} />
      {ms.map((v) => (
        <g key={v}>
          <rect x={-62} y={yv(v) - 3} width={28} height={6} rx={3} fill={C.blanco} />
          <T x={-76} y={yv(v) + 13} size={38} anchor="end" fill={C.blanco} borde={C.navy}>
            {`${v}${unidad}`}
          </T>
        </g>
      ))}
      {lectura ? (
        <g transform={`translate(${70 + lw / 2},${yv(valor)})`}>
          <rect x={-lw / 2 + 6} y={-36} width={lw} height={76} rx={18} fill="rgba(18,12,46,0.35)" />
          <rect x={-lw / 2} y={-42} width={lw} height={76} rx={18} fill={liquido} />
          <T x={0} y={14} size={48}>
            {lectura}
          </T>
        </g>
      ) : null}
    </g>
  );
};

/**
 * Reloj de arena: arena 0..1 = cuánto cayó (arriba se vacía, abajo se llena, chorrito en medio); gira 0..1 = lo
 * voltea 180°. x,y = centro (≈ 180×280 a s=1).
 */
export const RelojArena: React.FC<{ x: number; y: number; f: number; arena?: number; gira?: number; s?: number }> = ({
  x,
  y,
  f,
  arena = 0.5,
  gira = 0,
  s = 1,
}) => {
  const a = lim(arena, 0, 1);
  const madera = dosTonos("#A8703E");
  const sand = "#E9B44C";
  const hArriba = 100 * (1 - a);
  const hAbajo = 100 * a;
  return (
    <g transform={`translate(${x},${y}) rotate(${gira * 180}) scale(${s})`}>
      <rect x={-90} y={-140} width={180} height={24} rx={8} fill={madera.base} />
      <rect x={-90} y={116} width={180} height={24} rx={8} fill={madera.sombra} />
      <rect x={-80} y={-116} width={12} height={232} fill={madera.sombra} />
      <rect x={68} y={-116} width={12} height={232} fill={madera.sombra} />
      <path d="M-56,-116 L56,-116 Q56,-40 8,0 Q56,40 56,116 L-56,116 Q-56,40 -8,0 Q-56,-40 -56,-116 Z" fill={C.cielo} opacity={0.45} />
      {hArriba > 1 ? <path d={`M${-50 * (hArriba / 100) - 6},${-hArriba} L${50 * (hArriba / 100) + 6},${-hArriba} L6,-6 L-6,-6 Z`} fill={sand} /> : null}
      {a < 1 ? <rect x={-3} y={-6} width={6} height={112 - hAbajo * 0.6} fill={sand} opacity={0.6 + 0.4 * Math.sin(f)} /> : null}
      {hAbajo > 1 ? <path d={`M-52,112 L52,112 L${20},${112 - hAbajo * 0.6} L-20,${112 - hAbajo * 0.6} Z`} fill={sand} /> : null}
      <path d="M-40,-104 Q-44,-60 -14,-20" stroke={C.blanco} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} />
    </g>
  );
};

/** Bolsa de dinero con «$» y una ficha con texto debajo (size 44; p. ej. «$100 MILLION»). x,y = base de la bolsa. */
export const BolsaDinero: React.FC<{ x: number; y: number; f: number; texto?: string; s?: number }> = ({ x, y, f, texto, s = 1 }) => {
  const t = dosTonos("#3DBA6A");
  const wT = texto ? anchoT(texto, 44) + 50 : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={140} ry={18} fill="rgba(18,12,46,0.25)" />
      <g transform={`rotate(${Math.sin(f / 15) * 3} 0 0)`}>
        <path d="M-50,-250 Q0,-210 50,-250 L36,-200 Q150,-150 130,-50 Q120,0 0,0 Q-120,0 -130,-50 Q-150,-150 -36,-200 Z" fill={t.base} />
        <path d="M30,-200 Q150,-150 130,-50 Q120,0 0,0 Q100,-60 30,-200 Z" fill={t.sombra} opacity={0.6} />
        <rect x={-46} y={-214} width={92} height={22} rx={10} fill={t.sombra} />
        <T x={0} y={-44} size={140} fill={C.amarillo} borde={t.sombra}>
          $
        </T>
      </g>
      {texto ? (
        <g transform="translate(0,64)">
          <rect x={-wT / 2 + 6} y={-34} width={wT} height={72} rx={18} fill="rgba(18,12,46,0.35)" />
          <rect x={-wT / 2} y={-40} width={wT} height={72} rx={18} fill={C.amarillo} />
          <T x={0} y={12} size={44} fill={C.navy}>
            {texto}
          </T>
        </g>
      ) : null}
    </g>
  );
};

/** Medalla con cinta y estrella (≈ 140×260; x,y = centro del disco). color = disco. */
export const Medalla: React.FC<{ x: number; y: number; f: number; s?: number; color?: string; cinta?: string }> = ({
  x,
  y,
  f,
  s = 1,
  color = "#E9B44C",
  cinta = C.rojo,
}) => {
  if (s <= 0.001) return null;
  const t = dosTonos(color);
  const pts = Array.from({ length: 10 }, (_, k) => {
    const r = k % 2 ? 18 : 40;
    const a = (k * 36 - 90) * (Math.PI / 180);
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
  return (
    <g transform={`translate(${x},${y}) rotate(${Math.sin(f / 10) * 5} 0 -150) scale(${s})`}>
      <path d="M-50,-170 L-10,-60 L10,-60 L-10,-170 Z" fill={cinta} />
      <path d="M50,-170 L10,-60 L-10,-60 L10,-170 Z" fill={dosTonos(cinta).sombra} />
      <circle cx={6} cy={8} r={70} fill="rgba(18,12,46,0.3)" />
      <circle r={70} fill={t.base} />
      <circle r={54} fill={t.sombra} />
      <polygon points={pts} fill={t.brillo} />
      <ellipse cx={-26} cy={-34} rx={18} ry={9} fill={C.blanco} opacity={0.45} transform="rotate(-35 -26 -34)" />
    </g>
  );
};
