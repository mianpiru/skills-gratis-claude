// Biblioteca Plano Pop · personajes y partes del cuerpo. La persona base es `Persona` de ../kit (se exporta en index.ts).
// Piezas COPIADAS de los videos viejos (los originales siguen en su sitio y no se tocan) con props genéricas.
// Todas van dentro de <Lienzo> (1920×1080). f = fotograma local de la escena; s = escala (1 = tamaño base).
// Catálogo con ejemplos: ./CATALOGO.md
import React from "react";
import { C, Persona } from "../kit";

// del canal original
export const Buzo: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
}> = ({ x, y, s = 1, f }) => {
  const pat = Math.sin(f / 4) * 14;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <g transform={`rotate(${pat},-70,0)`}>
        <path d="M-70,-6 L-112,-34 L-104,-4 Z" fill={C.amarillo} />
      </g>
      <g transform={`rotate(${-pat},-70,6)`}>
        <path d="M-70,8 L-112,30 L-100,2 Z" fill={C.amarillo} />
      </g>
      <rect x={-78} y={-14} width={120} height={30} rx={15} fill={C.navy2} />
      <rect x={-40} y={-34} width={64} height={22} rx={11} fill={C.amarillo} />
      <rect x={30} y={8} width={52} height={16} rx={8} fill={C.navy2} transform="rotate(16,30,8)" />
      <circle cx={62} cy={-2} r={24} fill={C.navy2} />
      <rect x={66} y={-14} width={24} height={18} rx={6} fill={C.teal} />
      <circle cx={94} cy={-30} r={5} fill={C.blanco} opacity={0.7} />
      <circle cx={102} cy={-48} r={7} fill={C.blanco} opacity={0.5} />
    </g>
  );
};

// del canal original
export const Mano: React.FC<{
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
}> = ({ x, y, s = 1, flip }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <rect x={-70} y={-30} width={140} height={190} rx={50} fill={C.piel} />
    {[-52, -18, 18, 52].map((dx, k) => (
      <rect key={dx} x={dx - 16} y={-165 + Math.abs(k - 1.5) * 18} width={32} height={150} rx={16} fill={C.piel} />
    ))}
    <rect x={56} y={-10} width={34} height={110} rx={17} fill={C.piel} transform="rotate(-35,72,60)" />
    <path d="M-40,40 Q0,60 40,40" stroke={C.piel2} strokeWidth={6} fill="none" strokeLinecap="round" />
    <rect x={-56} y={150} width={112} height={50} rx={14} fill={C.morado} />
  </g>
);

// del canal original
export const Bigote: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M0,-4 Q-26,-22 -52,-8 Q-62,-2 -66,12 Q-46,0 -30,10 Q-12,16 0,4 Q12,16 30,10 Q46,0 66,12 Q62,-2 52,-8 Q26,-22 0,-4 Z"
      fill="#3A2418"
    />
  </g>
);

/**
 * Persona del kit con casco de obra, chaleco con franja reflectiva y portátil opcional. Es el mismo personaje de
 * siempre (Persona) con ropa de trabajo: por defecto, la vulcanóloga/científica de campo de V09 (chaleco naranja,
 * casco amarillo, lentes). Cambia `abrigo`/`abrigo2` para otro oficio y `casco={false}` para quitarlo.
 */
export const Trabajador: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  flip?: boolean;
  cara?: "normal" | "susto" | "duda";
  brazo?: number;
  abrigo?: string;
  abrigo2?: string;
  casco?: boolean;
  colorCasco?: string;
  colorCasco2?: string;
  franja?: boolean;
  lentes?: boolean;
  barba?: boolean;
  portatil?: number;
  fase?: number;
}> = ({
  x,
  y,
  f,
  s = 1,
  flip,
  cara = "normal",
  brazo = 0,
  abrigo = C.naranja,
  abrigo2 = C.rojo2,
  casco = true,
  colorCasco = C.amarillo,
  colorCasco2 = "#E3A91E",
  franja = true,
  lentes = true,
  barba,
  portatil = 0,
  fase = 0,
}) => {
  const sube = Math.sin((f + fase * 20) / 9) * 3;
  return (
    <g>
      <Persona
        x={x}
        y={y}
        s={s}
        flip={flip}
        f={f}
        abrigo={abrigo}
        abrigo2={abrigo2}
        cara={cara}
        brazo={brazo}
        lentes={lentes}
        barba={barba}
        fase={fase}
      />
      <g transform={`translate(${x},${y + sube * s}) scale(${flip ? -s : s},${s})`}>
        {franja ? <rect x={-76} y={-170} width={152} height={14} fill={C.amarillo} opacity={0.9} /> : null}
        {casco ? (
          <g>
            <path d="M-80,-356 Q-80,-436 0,-438 Q80,-436 80,-356 Z" fill={colorCasco} />
            <rect x={-98} y={-366} width={196} height={22} rx={11} fill={colorCasco2} />
            <rect x={-10} y={-436} width={20} height={70} rx={8} fill={colorCasco2} />
          </g>
        ) : null}
        {portatil > 0.001 ? (
          <g opacity={portatil} transform="translate(0,-138)">
            <rect x={-84} y={-4} width={168} height={16} rx={6} fill={C.gris2} />
            <path d="M-78,-2 L-66,-104 L66,-104 L78,-2 Z" fill={C.gris} />
            <rect x={-56} y={-94} width={112} height={78} rx={6} fill={C.navy} />
            <polyline
              points="-46,-50 -28,-50 -20,-74 -10,-30 0,-60 10,-50 46,-50"
              fill="none"
              stroke={C.teal}
              strokeWidth={5}
              strokeLinejoin="round"
            />
          </g>
        ) : null}
      </g>
    </g>
  );
};
