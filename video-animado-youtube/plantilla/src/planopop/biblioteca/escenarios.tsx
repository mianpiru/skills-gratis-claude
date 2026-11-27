// Biblioteca Plano Pop · fondos, paisajes, texturas y transiciones (Marco, del kit, es la entrada de cada escena)
// Piezas COPIADAS de los videos viejos (los originales siguen en su sitio y no se tocan) con props genéricas.
// Todas van dentro de <Lienzo> (1920×1080). f = fotograma local de la escena; s = escala (1 = tamaño base).
// Catálogo con ejemplos: ./CATALOGO.md
import React from "react";
import { random } from "remotion";
import { C, W, H } from "../kit";
import { PB as P } from "./paleta";
import { Pez } from "./animales";

// del canal original (Rayas)
export const FondoRayas: React.FC<{ f: number; color?: string }> = ({ f, color = C.lila }) => (
  <g>
    {[0, 1, 2, 3, 4].map((k) => (
      <rect
        key={k}
        x={-400 + k * 520 + ((f * 1.2) % 520)}
        y={-300}
        width={170}
        height={1900}
        fill={color}
        opacity={0.13}
        transform="rotate(24 960 540)"
      />
    ))}
  </g>
);

// del canal original
export const Rejilla: React.FC<{ color?: string; o?: number }> = ({ color = C.lila, o = 0.08 }) => (
  <g>
    {Array.from({ length: 12 }, (_, k) => (
      <rect key={`c${k}`} x={k * 170 - 20} y={0} width={4} height={H} fill={color} opacity={o} />
    ))}
    {Array.from({ length: 7 }, (_, k) => (
      <rect key={`f${k}`} x={0} y={k * 170 + 30} width={W} height={4} fill={color} opacity={o} />
    ))}
  </g>
);

// del canal original
export const Suelo: React.FC<{
  y?: number;
  color?: string;
  borde?: string;
}> = ({ y = 860, color = C.navy2, borde = C.morado }) => (
  <g>
    <rect x={0} y={y} width={W} height={H - y} fill={color} />
    <rect x={0} y={y} width={W} height={14} fill={borde} opacity={0.6} />
  </g>
);

// del canal original
export const FondoTundra: React.FC = () => (
  <>
    <circle cx={1560} cy={200} r={150} fill={C.crema} opacity={0.45} />
    <circle cx={1560} cy={200} r={90} fill={C.crema} />
    <path
      d="M0,640 L260,380 L470,560 L700,330 L980,600 L1240,410 L1500,590 L1750,440 L1920,560 L1920,800 L0,800 Z"
      fill="#9CCFE0"
    />
    <path
      d="M700,330 L770,400 L700,420 L640,395 Z M260,380 L320,440 L250,450 L205,432 Z M1240,410 L1300,470 L1230,476 L1185,455 Z"
      fill={C.nieve}
    />
    <path d="M0,720 Q480,640 960,720 T1920,700 L1920,1080 L0,1080 Z" fill={C.hielo} />
    <path d="M0,800 Q480,740 960,790 T1920,780 L1920,1080 L0,1080 Z" fill={C.nieve} />
  </>
);

// del canal original
export const FondoMar: React.FC<{
  f: number;
  profundo?: number;
  luz?: number;
}> = ({ f, profundo = 0, luz = 1 }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill={P.agua} />
    <rect x={0} y={360} width={1920} height={720} fill={P.agua2} opacity={0.7} />
    <rect x={0} y={760} width={1920} height={320} fill={P.agua3} opacity={0.8} />
    <rect x={0} y={0} width={1920} height={1080} fill={P.abismo} opacity={0.85 * profundo} />
    {luz > 0.01
      ? [260, 700, 1180, 1600].map((rx, k) => (
          <path
            key={rx}
            d={`M${rx - 60},0 L${rx + 60},0 L${rx + 260 + Math.sin(f / 30 + k) * 30},1080 L${rx + 60 + Math.sin(f / 30 + k) * 30},1080 Z`}
            fill={C.blanco}
            opacity={0.05 * luz * (1 - profundo)}
          />
        ))
      : null}
    {Array.from({ length: 40 }, (_, k) => (
      <circle
        key={k}
        cx={(random(`mx${k}`) * 1920 + f * 0.4) % 1920}
        cy={(random(`my${k}`) * 1080 - f * 0.3 + 1080) % 1080}
        r={2 + random(`mr${k}`) * 3}
        fill={C.blanco}
        opacity={0.18}
      />
    ))}
  </g>
);

// del canal original
export const Costa: React.FC<{ f: number; productiva?: number }> = ({ f, productiva = 1 }) => {
  const orilla = 520 - 220 * (1 - productiva);
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill={C.cielo} />
      <circle cx={1600} cy={160} r={80} fill={C.amarillo} />
      <rect x={0} y={360} width={1920} height={720} fill="#4F9BD9" />
      <path
        d={`M0,360 ${Array.from({ length: 25 }, (_, k) => `Q${k * 80 + 40},${352 + Math.sin(f / 9 + k) * 4} ${(k + 1) * 80},360`).join(" ")} L1920,372 L0,372 Z`}
        fill={P.espuma}
      />
      <path
        d={`M0,300 L${orilla - 160},300 Q${orilla},330 ${orilla + 120},430 Q${orilla + 600},760 1920,880 L1920,1080 L0,1080 Z`}
        fill={P.arena}
      />
      <path d={`M0,250 L${orilla - 220},250 Q${orilla - 140},280 ${orilla - 100},300 L0,300 Z`} fill={P.pasto} />
      <path
        d={`M${orilla + 120},430 Q${orilla + 600},760 1920,880 L1920,900 Q${orilla + 600},790 ${orilla + 120},460 Z`}
        fill={P.arena2}
      />
      {Array.from({ length: 16 }, (_, k) => {
        const px = orilla + 160 + k * 60;
        const py = 450 + (px - orilla - 120) * 0.62;
        return k / 16 < productiva ? (
          <path
            key={k}
            d={`M${px},${py} q${Math.sin(f / 12 + k) * 12},-50 ${Math.sin(f / 12 + k) * 6},-90`}
            stroke={P.pasto}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
          />
        ) : null;
      })}
      {Array.from({ length: 8 }, (_, k) =>
        k / 8 < productiva ? (
          <Pez
            key={k}
            x={orilla + 380 + k * 150 + Math.sin(f / 15 + k) * 30}
            y={520 + (k % 3) * 70}
            s={0.45}
            f={f + k * 5}
            color={k % 2 ? C.amarillo : C.naranja}
          />
        ) : null,
      )}
    </g>
  );
};

// del canal original
export const CampoMaiz: React.FC<{
  x: number;
  y: number;
  w: number;
  f: number;
  ceniza?: number;
}> = ({ x, y, w, f, ceniza = 0 }) => {
  const n = Math.max(3, Math.floor(w / 90));
  const alto = ceniza * 130;
  return (
    <g>
      <rect x={x} y={y - 10} width={w} height={30} fill={P.roca} />
      {Array.from({ length: n }, (_, k) => {
        const sx = x + 45 + k * ((w - 90) / (n - 1));
        const bal = Math.sin(f / 14 + k) * 4;
        return (
          <g key={k} transform={`translate(${sx},${y - 10}) rotate(${bal})`}>
            <rect x={-6} y={-220} width={12} height={220} rx={6} fill={P.pasto2} />
            <ellipse cx={-34} cy={-120} rx={40} ry={11} fill={P.pasto} transform="rotate(-30,-34,-120)" />
            <ellipse cx={34} cy={-160} rx={40} ry={11} fill={P.pasto} transform="rotate(30,34,-160)" />
            <ellipse cx={14} cy={-112} rx={14} ry={34} fill={C.amarillo} />
            <path d="M0,-230 L-12,-266 M0,-230 L10,-262" stroke="#C9A43A" strokeWidth={5} />
          </g>
        );
      })}
      {alto > 1 ? (
        <path
          d={`M${x},${y + 20} L${x},${y - 10 - alto} ${Array.from({ length: 13 }, (_, k) => `L${(x + (k / 12) * w).toFixed(1)},${(y - 10 - alto + Math.sin(k * 1.7) * 6).toFixed(1)}`).join(" ")} L${x + w},${y + 20} Z`}
          fill={P.ceniza4}
        />
      ) : null}
    </g>
  );
};

// del canal original (VolcanCono)
export const Volcan: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  erupcion?: number;
}> = ({ x, y, s = 1, f, erupcion = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {erupcion > 0.001
      ? Array.from({ length: 12 }, (_, k) => {
          const t = k / 11;
          const yy = -420 - t * 560 * erupcion;
          const r = 50 + t * 90;
          return (
            <g key={k}>
              <circle cx={-r * 0.4 + Math.sin(f / 8 + k) * 8} cy={yy} r={r * 0.6} fill={t > 0.5 ? P.nube2 : P.nube} />
              <circle cx={r * 0.4 + Math.cos(f / 9 + k) * 8} cy={yy - 10} r={r * 0.6} fill={t > 0.5 ? P.nube2 : P.nube} />
            </g>
          );
        })
      : null}
    <ellipse cx={0} cy={6} rx={420} ry={22} fill="rgba(18,12,46,0.3)" />
    <path d="M-380,0 L-90,-400 Q0,-428 90,-400 L380,0 Z" fill="#7B5A4B" />
    <path d="M0,-418 Q40,-412 90,-400 L380,0 L120,0 Z" fill="#634638" />
    <path
      d="M-90,-400 Q0,-428 90,-400 L150,-318 Q110,-300 80,-326 Q40,-290 0,-330 Q-40,-296 -70,-326 Q-110,-300 -150,-318 Z"
      fill={C.nieve}
    />
    {erupcion > 0.001 ? <ellipse cx={0} cy={-416} rx={70} ry={12} fill={P.fundido} /> : null}
  </g>
);

// del canal original
export const Motas: React.FC<{
  semilla: string;
  n: number;
  x: number;
  y: number;
  w: number;
  h: number;
  esc?: number;
}> = ({ semilla, n, x, y, w, h, esc = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, k) => {
      const claro = random(`${semilla}c${k}`) > 0.5;
      return (
        <ellipse
          key={k}
          cx={x + random(`${semilla}x${k}`) * w}
          cy={y + random(`${semilla}y${k}`) * h}
          rx={(12 + random(`${semilla}r${k}`) * 40) * esc}
          ry={(7 + random(`${semilla}s${k}`) * 15) * esc}
          fill={claro ? C.blanco : C.negro}
          opacity={claro ? 0.08 : 0.17}
        />
      );
    })}
  </g>
);

// del canal original
export const Cristales: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  n: number;
  semilla: string;
}> = ({ x, y, w, h, n, semilla }) => (
  <g>
    {Array.from({ length: n }, (_, k) => {
      const cx = x + random(`${semilla}x${k}`) * w;
      const cy = y + random(`${semilla}y${k}`) * h;
      const r = 8 + random(`${semilla}r${k}`) * 18;
      const tipo = random(`${semilla}t${k}`);
      const color = tipo > 0.66 ? C.blanco : tipo > 0.33 ? C.piel : C.negro;
      return (
        <path
          key={k}
          d={`M${cx},${cy - r} L${cx + r * 0.9},${cy - r * 0.2} L${cx + r * 0.5},${cy + r} L${cx - r * 0.6},${cy + r * 0.7} L${cx - r},${cy - r * 0.3} Z`}
          fill={color}
          opacity={tipo > 0.33 ? 0.28 : 0.22}
        />
      );
    })}
  </g>
);

/** Destello blanco de pantalla completa para marcar un golpe o un corte (de V08 cap08). dura en fotogramas. */
export const Flash: React.FC<{
  f: number;
  desde: number;
  dura?: number;
  fuerza?: number;
  color?: string;
}> = ({ f, desde, dura = 12, fuerza = 0.22, color = C.blanco }) =>
  f >= desde && f < desde + dura ? <rect width={W} height={H} fill={color} opacity={fuerza * (1 - (f - desde) / dura)} /> : null;
