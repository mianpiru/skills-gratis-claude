// Biblioteca Plano Pop · objetos: transporte, aparatos, medidores, herramientas, casa y utilería
// Piezas COPIADAS de los videos viejos (los originales siguen en su sitio y no se tocan) con props genéricas.
// Todas van dentro de <Lienzo> (1920×1080). f = fotograma local de la escena; s = escala (1 = tamaño base).
// Catálogo con ejemplos: ./CATALOGO.md
import React from "react";
import { random } from "remotion";
import { C, T, en, fontFamily } from "../kit";
import { PB as P, anchoT, lim, mezcla } from "./paleta";
import { Sello } from "./rotulos";
import { Pez } from "./animales";

// del canal original
export const Avion: React.FC<{
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
}> = ({ x, y, s = 1, flip }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <path d="M-150,-6 Q-150,-22 -120,-22 L110,-22 Q150,-22 150,0 Q150,16 120,18 L-120,18 Q-150,18 -150,-6 Z" fill={C.blanco} />
    <path d="M-30,0 L40,0 L-40,60 L-70,60 Z" fill={C.gris} />
    <path d="M-120,-20 L-150,-70 L-120,-70 L-80,-20 Z" fill={C.gris} />
    {[-80, -50, -20, 10, 40, 70].map((px) => (
      <circle key={px} cx={px} cy={-6} r={6} fill={C.cielo} />
    ))}
  </g>
);

// del canal original (Avion)
export const AvionLado: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-10,-6 L50,-6 L96,-84 L64,-84 Z" fill={C.gris2} />
    <path d="M118,-22 L176,-22 L192,-104 L160,-104 Z" fill={C.rojo} />
    <rect x={-180} y={-30} width={370} height={60} rx={30} fill="#DDE6F2" />
    <rect x={-150} y={-16} width={44} height={16} rx={7} fill={C.navy2} />
    {[0, 1, 2, 3, 4, 5].map((k) => (
      <circle key={k} cx={-80 + k * 36} cy={-6} r={7} fill={C.lila} />
    ))}
    <path d="M-30,8 L56,8 L122,116 L84,116 Z" fill={C.gris} />
    <path d="M130,6 L176,6 L196,46 L170,46 Z" fill={C.gris} />
  </g>
);

// del canal original
export const Barco: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
}> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x},${y + Math.sin(f / 10) * 5}) rotate(${Math.sin(f / 14) * 1.2}) scale(${s})`}>
    <ellipse cx={0} cy={44} rx={300} ry={18} fill="rgba(18,12,46,0.18)" />
    <path d="M-290,-40 L290,-40 L240,50 L-240,50 Z" fill={C.navy2} />
    <path d="M-290,-40 L290,-40 L280,-14 L-280,-14 Z" fill={C.rojo} />
    <rect x={-250} y={-140} width={150} height={100} rx={10} fill={C.nieve} />
    {[-228, -184, -140].map((wx) => (
      <rect key={wx} x={wx} y={-118} width={28} height={28} rx={5} fill={C.navy2} />
    ))}
    <rect x={150} y={-120} width={54} height={80} rx={6} fill={C.amarillo} />
    <g stroke={C.navy2} strokeWidth={12} strokeLinecap="round" fill="none">
      <path d="M-62,-40 L-16,-330 M62,-40 L16,-330" />
      <path d="M-52,-110 L52,-110 M-40,-190 L40,-190 M-28,-270 L28,-270" strokeWidth={9} />
      <path d="M-52,-110 L40,-190 M52,-110 L-40,-190 M-40,-190 L28,-270 M40,-190 L-28,-270" strokeWidth={7} />
    </g>
    <rect x={-30} y={-352} width={60} height={28} rx={7} fill={C.rojo} />
  </g>
);

// del canal original
export const Velero: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  draga?: number;
}> = ({ x, y, s = 1, f, draga = 0 }) => {
  const mece = Math.sin(f / 18) * 2;
  const largo = 520 * draga;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {draga > 0.01 ? (
        <g>
          <path d={`M300,-20 Q340,${largo * 0.5} 330,${largo}`} stroke={C.crema} strokeWidth={6} fill="none" />
          <path d={`M300,${largo} L360,${largo} L350,${largo + 60} L310,${largo + 60} Z`} fill={C.gris2} />
          {Array.from({ length: 4 }, (_, k) => (
            <rect key={k} x={306 + k * 12} y={largo + 6} width={3} height={50} fill={C.gris} />
          ))}
        </g>
      ) : null}
      <g transform={`rotate(${mece})`}>
        <path d="M-380,-40 L380,-40 L320,40 L-320,40 Z" fill="#6B3F2E" />
        <rect x={-380} y={-56} width={760} height={20} rx={6} fill="#8A5A44" />
        {Array.from({ length: 7 }, (_, k) => (
          <circle key={k} cx={-270 + k * 90} cy={-4} r={10} fill={C.negro} />
        ))}
        {[-200, 20, 220].map((mx, k) => (
          <g key={mx}>
            <rect x={mx - 7} y={-560 + k * 40} width={14} height={510 - k * 40} fill="#5A3A2E" />
            <path
              d={`M${mx - 120},${-500 + k * 40} Q${mx},${-470 + k * 40} ${mx + 120},${-500 + k * 40} L${mx + 110},${-320 + k * 40} Q${mx},${-300 + k * 40} ${mx - 110},${-320 + k * 40} Z`}
              fill={C.crema}
            />
            <path
              d={`M${mx - 100},${-290 + k * 40} Q${mx},${-262 + k * 40} ${mx + 100},${-290 + k * 40} L${mx + 92},${-140 + k * 30} Q${mx},${-124 + k * 30} ${mx - 92},${-140 + k * 30} Z`}
              fill={C.crema}
            />
          </g>
        ))}
        <path d="M-210,-575 L-150,-560 L-210,-545 Z" fill={C.rojo} />
      </g>
    </g>
  );
};

// del canal original
export const Bus: React.FC<{
  x: number;
  y: number;
  s?: number;
  silueta?: boolean;
}> = ({ x, y, s = 1, silueta }) => {
  const c = silueta ? "rgba(255,255,255,0.28)" : C.amarillo;
  const v = silueta ? "rgba(255,255,255,0.18)" : C.navy2;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-200,-60 L170,-60 Q196,-60 198,-34 L200,46 L-200,46 Z" fill={c} />
      {!silueta ? <rect x={-200} y={10} width={400} height={10} fill={C.navy} /> : null}
      {Array.from({ length: 8 }, (_, k) => (
        <rect key={k} x={-184 + k * 44} y={-48} width={34} height={36} rx={5} fill={v} />
      ))}
      <rect x={172} y={-48} width={20} height={42} rx={5} fill={v} />
      {[-130, 120].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={48} r={22} fill={silueta ? "rgba(255,255,255,0.3)" : C.negro} />
          <circle cx={wx} cy={48} r={9} fill={silueta ? "rgba(255,255,255,0.15)" : C.gris} />
        </g>
      ))}
    </g>
  );
};

// del canal original
export const Celular: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  titular: string[];
  rot?: number;
  cinta?: string;
}> = ({ x, y, s = 1, f, titular, rot = 0, cinta = "BREAKING" }) => {
  const largo = Math.max(...titular.map((t) => t.length), 1);
  const size = Math.max(38, Math.min(64, 270 / (largo * 0.7)));
  return (
    <g transform={`translate(${x},${y}) rotate(${rot + Math.sin(f / 15) * 1.5}) scale(${s})`}>
      <rect x={-160} y={-310} width={340} height={640} rx={46} fill="rgba(18,12,46,0.4)" />
      <rect x={-170} y={-320} width={340} height={640} rx={46} fill={C.negro} />
      <rect x={-150} y={-280} width={300} height={560} rx={24} fill={C.blanco} />
      <rect x={-150} y={-280} width={300} height={70} rx={24} fill={C.rojo} />
      <rect x={-150} y={-240} width={300} height={30} fill={C.rojo} />
      <T x={0} y={-230} size={38}>
        {cinta}
      </T>
      <T x={0} y={-150} size={size} fill={C.navy}>
        {titular.map((t, k) => (
          <tspan key={k} x={0} dy={k === 0 ? 0 : size * 1.1}>
            {t}
          </tspan>
        ))}
      </T>
      <rect x={-120} y={40} width={240} height={150} rx={12} fill={C.gris} opacity={0.5} />
      <path d="M-120,190 L-30,90 L20,140 L60,100 L120,190 Z" fill={C.gris2} opacity={0.7} />
      {[0, 1].map((k) => (
        <rect key={k} x={-120} y={214 + k * 26} width={240 - k * 70} height={12} rx={6} fill={C.gris} opacity={0.6} />
      ))}
    </g>
  );
};

// del canal original (Celular)
export const CelularFoto: React.FC<{
  x: number;
  y: number;
  s?: number;
  foto?: number;
}> = ({ x, y, s = 1, foto = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-102} y={-202} width={220} height={420} rx={34} fill="rgba(0,0,0,0.3)" />
    <rect x={-110} y={-210} width={220} height={420} rx={34} fill={C.negro} />
    <rect x={-94} y={-180} width={188} height={360} rx={18} fill={C.navy2} />
    <clipPath id={`cel-${Math.round(x)}-${Math.round(y)}`}>
      <rect x={-94} y={-180} width={188} height={360 * Math.max(0, Math.min(1, foto))} rx={18} />
    </clipPath>
    <g clipPath={`url(#cel-${Math.round(x)}-${Math.round(y)})`}>
      <rect x={-94} y={-180} width={188} height={360} fill={C.cielo} />
      <circle cx={40} cy={-90} r={30} fill={C.amarillo} />
      <path d="M-94,120 L-30,10 L10,70 L50,20 L94,90 L94,180 L-94,180 Z" fill={C.teal2} />
    </g>
    <rect x={-30} y={-200} width={60} height={12} rx={6} fill={C.navy2} />
  </g>
);

// del canal original
export const Tele: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  texto?: string;
  children?: React.ReactNode;
}> = ({ x, y, s = 1, f, texto = "SPECIAL", children }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-60} y={240} width={120} height={70} fill={C.gris2} />
    <rect x={-180} y={300} width={360} height={24} rx={10} fill={C.gris2} />
    <rect x={-426} y={-251} width={852} height={502} rx={22} fill="rgba(18,12,46,0.35)" transform="translate(8,10)" />
    <rect x={-426} y={-251} width={852} height={502} rx={22} fill={C.negro} />
    <g transform="translate(-400,-225)">
      <rect width={800} height={450} fill={C.navy2} />
      {children}
      <rect x={0} y={370} width={800} height={80} fill={C.rojo} />
      <T x={30} y={425} size={46} anchor="start" ls={3}>
        {texto}
      </T>
      <circle cx={760} cy={410} r={12} fill={C.blanco} opacity={f % 30 < 15 ? 1 : 0.3} />
    </g>
  </g>
);

// del canal original (Tele)
export const TeleVieja: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  on: number;
  id: string;
  children?: React.ReactNode;
}> = ({ x, y, s = 1, f, on, id, children }) => {
  const a1 = 380 + Math.sin(f / 9) * 6;
  const a2 = 680 + Math.sin(f / 11 + 1) * 6;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M520,10 L${a1},-130 M520,10 L${a2},-140`} stroke={C.gris} strokeWidth={10} strokeLinecap="round" />
      <circle cx={a1} cy={-130} r={14} fill={C.gris} />
      <circle cx={a2} cy={-140} r={14} fill={C.gris} />
      <ellipse cx={520} cy={10} rx={70} ry={26} fill={C.negro} />
      <rect x={120} y={680} width={54} height={90} rx={12} fill={C.negro} />
      <rect x={866} y={680} width={54} height={90} rx={12} fill={C.negro} />
      <rect x={12} y={16} width={1040} height={700} rx={56} fill="rgba(18,12,46,0.35)" />
      <rect width={1040} height={700} rx={56} fill="#8A5A44" />
      <rect x={0} y={600} width={1040} height={100} rx={40} fill="#7A4A32" />
      <rect x={40} y={40} width={760} height={620} rx={60} fill="#5A3A2E" />
      <clipPath id={id}>
        <rect x={70} y={70} width={700} height={560} rx={70} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={70} y={70} width={700} height={560} fill="#2B2F3A" />
        {on < 1
          ? Array.from({ length: 34 }, (_, k) => {
              const t = Math.floor(f / 2);
              return (
                <rect
                  key={k}
                  x={70 + random(`tvx${id}${k}-${t}`) * 640}
                  y={70 + random(`tvy${id}${k}-${t}`) * 550}
                  width={30 + random(`tvw${id}${k}-${t}`) * 110}
                  height={6 + random(`tvh${id}${k}-${t}`) * 10}
                  fill={random(`tvc${id}${k}`) > 0.5 ? C.blanco : C.gris}
                  opacity={0.45 * (1 - on)}
                />
              );
            })
          : null}
        {on > 0 ? <g transform={`translate(0,350) scale(1,${Math.max(0.02, on)}) translate(0,-350)`}>{children}</g> : null}
        <rect x={70} y={70 + ((f * 7) % 560)} width={700} height={36} fill={C.blanco} opacity={0.06} />
        <rect x={70} y={70} width={700} height={560} fill={C.blanco} opacity={on > 0 && on < 1 ? (1 - on) * 0.7 : 0} />
        <path d="M120,130 Q170,104 270,110" stroke={C.blanco} strokeWidth={16} opacity={0.16} fill="none" strokeLinecap="round" />
      </g>
      {[170, 330].map((ky, k) => (
        <g key={ky}>
          <circle cx={920} cy={ky} r={54} fill={C.crema} />
          <circle cx={920} cy={ky} r={38} fill="#B7BFCE" />
          <rect
            x={914}
            y={ky - 36}
            width={12}
            height={34}
            rx={6}
            fill={C.navy2}
            transform={`rotate(${k ? -40 : 30} 920 ${ky})`}
          />
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <rect key={k} x={855} y={430 + k * 30} width={130} height={14} rx={7} fill="#5A3A2E" />
      ))}
      <circle cx={920} cy={640} r={12} fill={on > 0.5 && Math.floor(f / 12) % 2 === 0 ? C.rojo : C.gris2} />
    </g>
  );
};

// del canal original
export const Computadora: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  etiqueta: string;
  activa?: boolean;
  roto?: boolean;
}> = ({ x, y, s = 1, f, etiqueta, activa = true, roto }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-172} y={-112} width={360} height={240} rx={22} fill="rgba(0,0,0,0.3)" />
    <rect x={-180} y={-120} width={360} height={240} rx={22} fill={C.gris2} />
    <rect x={-150} y={-90} width={300} height={100} rx={12} fill={C.negro} />
    {Array.from({ length: 6 }, (_, k) => {
      const on = activa && !roto && random(`cp${etiqueta}${k}${Math.floor(f / 8)}`) > 0.35;
      return <circle key={k} cx={-120 + k * 48} cy={-40} r={13} fill={roto && k === 2 ? C.rojo : on ? C.teal : C.navy2} />;
    })}
    <rect x={-150} y={34} width={300} height={66} rx={12} fill={C.blanco} />
    <T x={0} y={82} size={etiqueta.length > 9 ? 38 : 44} fill={C.navy}>
      {etiqueta}
    </T>
  </g>
);

// del canal original
export const SalaControl: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  pantalla?: "espera" | "ruido" | "datos" | "onda";
}> = ({ x, y, s = 1, f, pantalla = "espera" }) => {
  const Pant = ({ px, k }: { px: number; k: number }) => (
    <g transform={`translate(${px},-330)`}>
      <rect x={-200} y={-130} width={400} height={250} rx={18} fill={C.negro} />
      <rect x={-184} y={-114} width={368} height={218} rx={10} fill={C.navy2} />
      {pantalla === "espera" ? (
        <>
          <line x1={-160} y1={0} x2={150} y2={0} stroke={C.teal} strokeWidth={6} />
          {Math.floor(f / 15) % 2 ? <rect x={150} y={-20} width={16} height={34} fill={C.teal} /> : null}
        </>
      ) : null}
      {pantalla === "ruido"
        ? Array.from({ length: 5 }, (_, fila) => (
            <text key={fila} x={-168} y={-72 + fila * 40} fontFamily={fontFamily} fontWeight={700} fontSize={30} fill={C.teal}>
              {Array.from(
                { length: 13 },
                (_, j) => "#%&@$?!*/<>=~"[Math.floor(random(`r${k}${fila}${j}${Math.floor(f / 4)}`) * 13)],
              ).join("")}
            </text>
          ))
        : null}
      {pantalla === "datos" ? (
        <>
          {Array.from({ length: 8 }, (_, j) => {
            const h = 30 + 120 * Math.abs(Math.sin(j * 1.3 + k + f / 30));
            return <rect key={j} x={-160 + j * 42} y={90 - h} width={30} height={h} rx={4} fill={j % 2 ? C.teal : C.amarillo} />;
          })}
        </>
      ) : null}
      {pantalla === "onda" ? (
        <polyline
          points={Array.from({ length: 33 }, (_, j) => `${-160 + j * 10},${Math.sin((j + f / 2) / 2.5) * 40}`).join(" ")}
          fill="none"
          stroke={C.teal}
          strokeWidth={6}
        />
      ) : null}
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[-440, 0, 440].map((px, k) => (
        <g key={k}>
          <Pant px={px} k={k} />
          <rect x={px - 20} y={-206} width={40} height={60} fill={C.gris2} />
        </g>
      ))}
      <rect x={-680} y={-150} width={1360} height={44} rx={14} fill={C.gris} />
      <rect x={-660} y={-106} width={1320} height={106} rx={10} fill={C.gris2} />
    </g>
  );
};

// del canal original (Antena70)
export const Antena: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  senal?: number;
  edificio?: number;
}> = ({ x, y, s = 1, f, senal = 0, edificio = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {/* edificio de 20 pisos a la misma escala (70 m ≈ 20 pisos de 3.5 m) */}
    {edificio > 0.001 ? (
      <g transform={`translate(360,0) scale(1,${edificio})`}>
        <rect x={-90} y={-560} width={180} height={560} fill={C.gris2} />
        {Array.from({ length: 20 }, (_, k) => (
          <g key={k}>
            <rect x={-70} y={-548 + k * 28} width={60} height={14} rx={3} fill={C.amarillo} opacity={k % 3 === 0 ? 0.9 : 0.45} />
            <rect x={10} y={-548 + k * 28} width={60} height={14} rx={3} fill={C.amarillo} opacity={k % 4 === 1 ? 0.9 : 0.45} />
          </g>
        ))}
      </g>
    ) : null}
    <ellipse cx={0} cy={6} rx={240} ry={20} fill="rgba(0,0,0,0.25)" />
    {/* pedestal */}
    <path d="M-110,0 L-60,-230 L60,-230 L110,0 Z" fill={C.gris2} />
    <rect x={-80} y={-280} width={160} height={60} rx={10} fill={C.gris} />
    {/* plato */}
    <g transform="translate(0,-330) rotate(-28)">
      <path d="M-260,-60 Q0,150 260,-60 L240,-80 Q0,110 -240,-80 Z" fill={C.blanco} />
      <path d="M-240,-80 Q0,110 240,-80 Q0,40 -240,-80 Z" fill={C.hielo} />
      <line x1={-150} y1={-20} x2={0} y2={-230} stroke={C.gris} strokeWidth={9} />
      <line x1={150} y1={-20} x2={0} y2={-230} stroke={C.gris} strokeWidth={9} />
      <rect x={-22} y={-250} width={44} height={40} rx={8} fill={C.gris} />
      {senal > 0.01
        ? [0, 1, 2].map((k) => {
            const t = (f / 36 + k / 3) % 1;
            return (
              <path
                key={k}
                d={`M${-100 - t * 60},${-300 - t * 140} Q0,${-350 - t * 160} ${100 + t * 60},${-300 - t * 140}`}
                fill="none"
                stroke={C.amarillo}
                strokeWidth={10}
                strokeLinecap="round"
                opacity={senal * (1 - t)}
              />
            );
          })
        : null}
    </g>
  </g>
);

// del canal original
export const Bombilla: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
}> = ({ x, y, s = 1, f }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: 8 }, (_, k) => (
        <rect
          key={k}
          x={-6}
          y={-150}
          width={12}
          height={40}
          rx={6}
          fill={C.amarillo}
          transform={`rotate(${k * 45 + f * 0.6})`}
          opacity={0.8}
        />
      ))}
      <circle r={96 + Math.sin(f / 6) * 6} fill={C.amarillo} opacity={0.22} />
      <circle r={70} fill={C.amarillo} />
      <circle cx={-22} cy={-22} r={18} fill={C.crema} opacity={0.8} />
      <rect x={-30} y={60} width={60} height={22} rx={6} fill={C.gris} />
      <rect x={-24} y={84} width={48} height={18} rx={6} fill={C.gris2} />
    </g>
  );

// del canal original
export const PanelSolar: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-12} y={140} width={24} height={120} fill={C.gris2} />
      <rect x={-202} y={-132} width={420} height={280} rx={14} fill="rgba(0,0,0,0.3)" />
      <rect x={-210} y={-140} width={420} height={280} rx={14} fill={C.gris} />
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => (
          <rect key={`${r}-${c}`} x={-196 + c * 66} y={-126 + r * 66} width={58} height={58} rx={6} fill={P.azul2} />
        )),
      )}
      <path d="M-196,-126 L-60,-126 L-196,0 Z" fill={C.blanco} opacity={0.18} />
    </g>
  );

// del canal original (PilaReloj)
export const Pila: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={4} cy={18} rx={64} ry={20} fill="rgba(0,0,0,0.3)" />
    <rect x={-60} y={-10} width={120} height={22} fill={C.gris2} />
    <ellipse cx={0} cy={12} rx={60} ry={18} fill={C.gris2} />
    <ellipse cx={0} cy={-10} rx={60} ry={18} fill={C.gris} />
    <ellipse cx={0} cy={-10} rx={44} ry={12} fill={C.hielo} />
    <rect x={-4} y={-22} width={8} height={24} rx={2} fill={C.gris2} />
    <rect x={-12} y={-14} width={24} height={8} rx={2} fill={C.gris2} />
  </g>
);

// del canal original
export const Interruptor: React.FC<{
  x: number;
  y: number;
  on: number;
  texto?: string;
}> = ({ x, y, on, texto = "SCENARIO" }) => {
  const k = lim(on, 0, 1);
  const color = k > 0.5 ? C.rojo : C.gris2;
  return (
    <g>
      <T x={x - 160} y={y + 22} size={60} anchor="end">
        {texto}
      </T>
      <rect x={x - 112} y={y - 52} width={240} height={120} rx={60} fill="rgba(18,12,46,0.4)" />
      <rect x={x - 120} y={y - 60} width={240} height={120} rx={60} fill={color} />
      <T x={k > 0.5 ? x - 50 : x + 50} y={y + 15} size={40} opacity={0.9}>
        {k > 0.5 ? "ON" : "OFF"}
      </T>
      <circle cx={mezcla(x - 60, x + 60, k)} cy={y} r={48} fill={C.blanco} />
    </g>
  );
};

// del canal original
export const Calendario: React.FC<{
  x: number;
  y: number;
  s?: number;
  mes: string;
  dia: string;
  anio?: string;
  tachado?: number;
}> = ({ x, y, s = 1, mes, dia, anio, tachado = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-142} y={-160} width={300} height={340} rx={24} fill="rgba(0,0,0,0.3)" />
    <rect x={-150} y={-170} width={300} height={340} rx={24} fill={C.blanco} />
    <rect x={-150} y={-170} width={300} height={90} rx={24} fill={C.rojo} />
    <rect x={-150} y={-110} width={300} height={30} fill={C.rojo} />
    <T x={0} y={-108} size={52} ls={4}>
      {mes}
    </T>
    <T x={0} y={anio ? 58 : 90} size={150} fill={C.navy}>
      {dia}
    </T>
    {anio ? (
      <T x={0} y={140} size={50} fill={C.gris2}>
        {anio}
      </T>
    ) : null}
    {tachado > 0.001 ? (
      <rect x={-130} y={-12} width={260 * tachado} height={22} rx={11} fill={C.rojo} transform="rotate(-18)" />
    ) : null}
  </g>
);

// del canal original
export const hhmm = (horas: number) => {
  const m = Math.max(0, Math.round(horas * 60));
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

// del canal original (Reloj)
export const RelojDigital: React.FC<{
  x: number;
  y: number;
  horas: number;
  s?: number;
  titulo?: string;
  color?: string;
}> = ({ x, y, horas, s = 1, titulo = "LIGHT TIME", color = C.amarillo }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-242} y={8} width={500} height={240} rx={30} fill="rgba(0,0,0,0.35)" />
      <rect x={-250} y={0} width={500} height={240} rx={30} fill={C.navy} />
      <rect x={-250} y={0} width={500} height={70} rx={30} fill={C.morado} />
      <rect x={-250} y={40} width={500} height={30} fill={C.morado} />
      <T x={0} y={50} size={40} ls={5}>
        {titulo}
      </T>
      <T x={0} y={208} size={132} fill={color} ls={4}>
        {hhmm(horas)}
      </T>
    </g>
  );

// del canal original (Reloj)
export const RelojAguja: React.FC<{
  x: number;
  y: number;
  r: number;
  horas: number;
}> = ({ x, y, r, horas }) => (
  <g transform={`translate(${x},${y})`}>
    <circle cx={10} cy={12} r={r + 18} fill="rgba(18,12,46,0.3)" />
    <circle r={r + 18} fill={C.rojo} />
    <circle r={r} fill={C.blanco} />
    {Array.from({ length: 12 }, (_, k) => (
      <rect key={k} x={-5} y={-r + 12} width={10} height={k % 3 ? 16 : 30} rx={4} fill={C.navy} transform={`rotate(${k * 30})`} />
    ))}
    <rect x={-9} y={-r * 0.5} width={18} height={r * 0.5 + 10} rx={9} fill={C.navy} transform={`rotate(${horas * 30})`} />
    <rect x={-6} y={-r * 0.78} width={12} height={r * 0.78 + 10} rx={6} fill={C.rojo} transform={`rotate(${horas * 360})`} />
    <circle r={14} fill={C.navy} />
  </g>
);

// del canal original
export const Bascula: React.FC<{
  x: number;
  y: number;
  s?: number;
  children: React.ReactNode;
}> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-262} y={-112} width={540} height={130} rx={26} fill="rgba(0,0,0,0.3)" />
    <rect x={-270} y={-120} width={540} height={130} rx={26} fill={C.gris} />
    <rect x={-300} y={-150} width={600} height={40} rx={14} fill={C.gris2} />
    <rect x={-200} y={-92} width={400} height={80} rx={14} fill={C.negro} />
    <g transform="translate(0,-30)">{children}</g>
  </g>
);

// del canal original
export const BasculaPeso: React.FC<{
  x: number;
  y: number;
  s?: number;
  lectura: string;
  sub?: string;
  carga?: number;
}> = ({ x, y, s = 1, lectura, sub, carga = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={290} ry={20} fill="rgba(18,12,46,0.3)" />
    <rect x={-260} y={-60 + carga * 8} width={520} height={60} rx={14} fill={C.gris2} />
    <rect x={-24} y={-300} width={48} height={250} fill={C.gris} />
    <rect x={-230} y={-470} width={460} height={190} rx={22} fill={C.navy2} />
    <rect x={-206} y={-448} width={412} height={146} rx={14} fill={C.cielo} />
    <T x={0} y={sub ? -382 : -358} size={48} fill={C.navy}>
      {lectura}
    </T>
    {sub ? (
      <T x={0} y={-326} size={38} fill={C.navy2}>
        {sub}
      </T>
    ) : null}
  </g>
);

// del canal original
export const Sismografo: React.FC<{
  x: number;
  y: number;
  f: number;
  amp?: number;
  w?: number;
  s?: number;
}> = ({ x, y, f, amp = 0.2, w = 700, s = 1 }) => {
  const h = 320;
  const N = 110;
  const x1 = 40;
  const x2 = w - 150;
  const mid = h / 2 + 10;
  const val = (n: number) => {
    const r = random(`sis${Math.floor(n)}`) - 0.5;
    return (Math.sin(n * 1.7) * 0.35 + r * 1.3) * amp * 110;
  };
  const pts = Array.from({ length: N }, (_, j) => {
    const n = f - (N - 1 - j);
    return `${(x1 + (j / (N - 1)) * (x2 - x1)).toFixed(1)},${(mid + val(n)).toFixed(1)}`;
  }).join(" ");
  const punta = mid + val(f);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={8} y={10} width={w} height={h} rx={24} fill="rgba(18,12,46,0.4)" />
      <rect width={w} height={h} rx={24} fill={C.gris2} />
      <rect x={24} y={30} width={w - 120} height={h - 60} rx={12} fill={C.crema} />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={24} y={60 + k * 60} width={w - 120} height={3} fill={C.gris} opacity={0.5} />
      ))}
      <polyline points={pts} fill="none" stroke={C.rojo} strokeWidth={5} strokeLinejoin="round" />
      <line x1={w - 50} y1={mid - 110} x2={x2} y2={punta} stroke={C.navy} strokeWidth={10} strokeLinecap="round" />
      <circle cx={w - 50} cy={mid - 110} r={22} fill={C.navy} />
      <circle cx={x2} cy={punta} r={10} fill={C.rojo} />
    </g>
  );
};

// del canal original
export const Vatimetro: React.FC<{
  x: number;
  y: number;
  s?: number;
  vatios: number;
  max?: number;
}> = ({ x, y, s = 1, vatios, max = 500 }) => {
  const a = -180 + Math.max(0, Math.min(1, vatios / max)) * 180;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-200,8 A200,200 0 0 1 200,8 Z" fill="rgba(0,0,0,0.3)" transform="translate(8,8)" />
      <path d="M-200,0 A200,200 0 0 1 200,0 Z" fill={C.blanco} />
      <path d="M-170,0 A170,170 0 0 1 -120,-120" fill="none" stroke={C.rojo} strokeWidth={22} />
      <path d="M-120,-120 A170,170 0 0 1 170,0" fill="none" stroke={C.teal2} strokeWidth={22} />
      <g transform={`rotate(${a})`}>
        <rect x={0} y={-7} width={160} height={14} rx={7} fill={C.navy} />
      </g>
      <circle r={22} fill={C.navy} />
      <rect x={-200} y={20} width={400} height={110} rx={20} fill={C.navy} />
      <T x={0} y={106} size={84} fill={C.amarillo}>
        {`${Math.round(vatios)} W`}
      </T>
    </g>
  );
};

// del canal original
export const Combustible: React.FC<{
  x: number;
  y: number;
  s?: number;
  nivel: number;
}> = ({ x, y, s = 1, nivel }) => {
  const a = -80 + 160 * lim(nivel, 0, 1);
  const bajo = nivel < 0.25;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-210,0 A210,210 0 0 1 210,0 Z" fill={C.navy} />
      <path d="M-180,0 A180,180 0 0 1 -150,-100" stroke={C.rojo} strokeWidth={22} fill="none" />
      <path d="M-150,-100 A180,180 0 0 1 180,0" stroke={C.teal} strokeWidth={22} fill="none" />
      <T x={-170} y={50} size={48}>
        E
      </T>
      <T x={170} y={50} size={48}>
        F
      </T>
      <g transform={`rotate(${a})`}>
        <rect x={-7} y={-170} width={14} height={170} rx={7} fill={bajo ? C.rojo : C.amarillo} />
      </g>
      <circle r={22} fill={C.crema} />
    </g>
  );
};

// del canal original
export const TermoMini: React.FC<{
  x: number;
  y: number;
  s?: number;
  nivel: number;
  color?: string;
  texto?: string;
}> = ({ x, y, s = 1, nivel, color = C.rojo, texto }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-28} y={-400} width={56} height={400} rx={28} fill={C.blanco} />
    <circle r={52} fill={C.blanco} />
    <circle r={38} fill={color} />
    <rect x={-16} y={-20 - 340 * lim(nivel, 0, 1)} width={32} height={340 * lim(nivel, 0, 1) + 30} rx={14} fill={color} />
    {[0, 1, 2, 3, 4, 5].map((k) => (
      <rect key={k} x={34} y={-80 - k * 56} width={k % 2 ? 18 : 30} height={6} rx={3} fill={C.blanco} opacity={0.7} />
    ))}
    {texto ? (
      <T x={84} y={-360 + (1 - lim(nivel, 0, 1)) * 300} size={54} anchor="start" fill={color} borde={C.navy}>
        {texto}
      </T>
    ) : null}
  </g>
);

// del canal original
export const Brujula: React.FC<{
  x: number;
  y: number;
  s?: number;
  angulo: number;
  fuerza?: number;
}> = ({ x, y, s = 1, angulo, fuerza = 0.5 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={8} cy={10} r={220} fill="rgba(0,0,0,0.3)" />
    <circle r={220} fill={C.blanco} />
    <circle r={190} fill={C.crema} />
    {Array.from({ length: 24 }, (_, k) => (
      <rect key={k} x={-3} y={-186} width={6} height={k % 6 === 0 ? 34 : 18} fill={C.gris2} transform={`rotate(${k * 15})`} />
    ))}
    <g transform={`rotate(${angulo})`}>
      <path d={`M0,-160 L${16 + fuerza * 22},0 L0,160 L${-16 - fuerza * 22},0 Z`} fill={C.navy} />
      <path d={`M0,-160 L${16 + fuerza * 22},0 L${-16 - fuerza * 22},0 Z`} fill={C.rojo} />
    </g>
    <circle r={18} fill={C.navy} />
  </g>
);

// del canal original
export const Lupa: React.FC<{
  x: number;
  y: number;
  r?: number;
  s?: number;
  rot?: number;
}> = ({ x, y, r = 130, s = 1, rot = 35 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-22} y={r + 4} width={44} height={r * 1.4} rx={20} fill="#8A5A44" />
    <circle r={r + 18} fill={C.navy} />
    <circle r={r} fill={C.cielo} opacity={0.35} />
    <path
      d={`M${-r * 0.6},${-r * 0.3} A${r * 0.7},${r * 0.7} 0 0 1 ${-r * 0.2},${-r * 0.65}`}
      stroke={C.blanco}
      strokeWidth={14}
      fill="none"
      strokeLinecap="round"
      opacity={0.8}
    />
  </g>
);

// del canal original
export const Calibrador: React.FC<{
  x: number;
  y: number;
  s?: number;
  abre?: number;
  rot?: number;
}> = ({ x, y, s = 1, abre = 0.5, rot = 0 }) => {
  const d = 60 + 300 * abre;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-260} y={-20} width={520} height={40} rx={8} fill={C.gris} />
      {Array.from({ length: 20 }, (_, k) => (
        <rect key={k} x={-240 + k * 25} y={-20} width={3} height={k % 5 ? 14 : 24} fill={C.navy} />
      ))}
      <path d="M-260,20 L-260,150 L-230,150 L-210,20 Z" fill={C.gris2} />
      <g transform={`translate(${d - 200},0)`}>
        <rect x={-60} y={-34} width={120} height={68} rx={10} fill={C.gris2} />
        <path d="M-60,34 L-60,150 L-30,150 L-10,34 Z" fill={C.gris2} />
      </g>
    </g>
  );
};

// del canal original
export const Frasco: React.FC<{
  x: number;
  y: number;
  s?: number;
  lleno?: number;
}> = ({ x, y, s = 1, lleno = 0.6 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-60} y={-180} width={120} height={180} rx={24} fill={C.blanco} opacity={0.35} />
    <rect x={-52} y={-8 - 150 * lleno} width={104} height={150 * lleno} rx={18} fill={C.crema} />
    <rect x={-44} y={-210} width={88} height={40} rx={10} fill={C.morado} />
  </g>
);

// del canal original
export const Espectrometro: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  activo?: number;
}> = ({ x, y, s = 1, f, activo = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-270} y={-380} width={560} height={390} rx={26} fill="rgba(18,12,46,0.3)" />
    <rect x={-280} y={-390} width={560} height={390} rx={26} fill={C.nieve} />
    <rect x={-280} y={-60} width={560} height={60} rx={20} fill={C.gris} />
    <rect x={-240} y={-350} width={320} height={230} rx={14} fill={C.negro} />
    <path
      d={`M-220,-150 L-150,-150 L-130,${-150 - 140 * activo} L-110,-150 L-30,-150 L-10,${-150 - 70 * activo} L10,-150 L60,-150`}
      stroke={C.teal}
      strokeWidth={6}
      fill="none"
      strokeLinejoin="round"
    />
    <circle cx={180} cy={-300} r={36} fill={C.navy2} />
    <circle cx={180} cy={-300} r={14} fill={activo > 0.5 && f % 30 < 15 ? C.rojo : C.gris2} />
    <rect x={130} y={-220} width={110} height={24} rx={8} fill={C.gris2} />
    <rect x={130} y={-180} width={110} height={24} rx={8} fill={C.gris2} />
  </g>
);

// del canal original
export const Microscopio: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
}> = ({ x, y, f, s = 1 }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x - 900},${y - 760}) ${en(900, 760, s)}`}>
      <rect x={800} y={728} width={200} height={32} rx={14} fill={C.navy2} />
      <path d="M980,740 L980,430 Q980,370 920,370 L890,370 L890,420 L930,420 L930,740 Z" fill={C.navy} />
      <rect x={790} y={598} width={170} height={24} rx={8} fill={C.gris2} />
      <rect x={815} y={590} width={100} height={10} rx={3} fill={C.blanco} />
      <circle cx={865} cy={645} r={16} fill={C.amarillo} opacity={0.6 + 0.4 * Math.sin(f / 5)} />
      <rect x={840} y={400} width={50} height={172} rx={10} fill={C.gris} />
      <rect x={846} y={336} width={38} height={70} rx={8} fill={C.navy2} />
      <rect x={852} y={570} width={26} height={24} rx={4} fill={C.gris2} />
      <circle cx={955} cy={530} r={26} fill={C.rojo} />
      <circle cx={955} cy={530} r={10} fill={C.rojo2} />
    </g>
  );

// del canal original
export const Engranaje: React.FC<{
  x: number;
  y: number;
  r: number;
  f: number;
  vel?: number;
  color?: string;
}> = ({ x, y, r, f, vel = 1, color = C.gris }) => (
  <g transform={`translate(${x},${y}) rotate(${f * vel})`}>
    {Array.from({ length: 10 }, (_, k) => (
      <rect
        key={k}
        x={-r * 0.16}
        y={-r * 1.18}
        width={r * 0.32}
        height={r * 0.4}
        rx={r * 0.06}
        fill={color}
        transform={`rotate(${k * 36})`}
      />
    ))}
    <circle r={r} fill={color} />
    <circle r={r * 0.36} fill={C.navy} />
  </g>
);

// del canal original
export const Propulsor: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  calor?: number;
  fuego?: number;
}> = ({ x, y, s = 1, f, calor = 0, fuego = 0 }) => {
  const tono = calor > 0.5 ? C.naranja : "#6FB7F2";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {fuego > 0.01 ? (
        <g opacity={fuego}>
          <path d={`M-40,120 Q0,${300 + Math.sin(f / 2) * 20} 40,120 Z`} fill={C.amarillo} />
          <path d={`M-22,120 Q0,${230 + Math.sin(f / 2 + 1) * 15} 22,120 Z`} fill={C.crema} />
        </g>
      ) : null}
      <rect x={-50} y={-160} width={100} height={130} rx={16} fill={C.gris} />
      <path d="M-34,-30 L34,-30 L70,120 L-70,120 Z" fill={C.gris2} />
      {/* calentador enrollado */}
      {[0, 1, 2, 3].map((k) => (
        <rect
          key={k}
          x={-58}
          y={-140 + k * 28}
          width={116}
          height={14}
          rx={7}
          fill={tono}
          opacity={0.6 + 0.4 * (calor > 0.5 ? 0.5 + 0.5 * Math.sin(f / 6 + k) : 1)}
        />
      ))}
      <circle cx={0} cy={-200} r={30} fill={tono} opacity={0.25 + 0.5 * calor} />
    </g>
  );
};

// del canal original
export const LlaveInglesa: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = -30 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-200} y={-26} width={340} height={52} rx={26} fill={C.gris} />
    <circle cx={170} cy={0} r={70} fill={C.gris} />
    <path d="M170,-24 L260,-50 L260,50 L170,24 Z" fill={C.navy} />
    <circle cx={-170} cy={0} r={14} fill={C.gris2} />
  </g>
);

// del canal original
export const Llave: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  hueco?: string;
}> = ({ x, y, s = 1, rot = -35, hueco = P.espacio }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-84} y={-12} width={190} height={44} rx={20} fill="rgba(0,0,0,0.3)" />
      <rect x={-90} y={-22} width={190} height={44} rx={20} fill={C.gris} />
      <circle cx={-110} cy={0} r={56} fill={C.gris} />
      <rect x={-176} y={-20} width={70} height={40} fill={hueco} />
      <circle cx={120} cy={0} r={42} fill={C.gris} />
      <circle cx={120} cy={0} r={18} fill={hueco} />
    </g>
  );

// del canal original
export const Tijeras: React.FC<{
  x: number;
  y: number;
  s: number;
  c: number;
}> = ({ x, y, s, c }) => {
  if (s <= 0.001) return null;
  const a = 26 * (1 - c);
  const Hoja = ({ r }: { r: number }) => (
    <g transform={`rotate(${r})`}>
      <path d="M-20,-14 L240,-4 Q252,0 240,6 L-20,14 Z" fill={C.gris} />
      <rect x={-70} y={-12} width={60} height={24} rx={8} fill={C.gris2} />
      <circle cx={-118} cy={0} r={46} fill="none" stroke={C.rojo} strokeWidth={24} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) rotate(90) scale(${s})`}>
      <Hoja r={-a} />
      <Hoja r={a} />
      <circle r={13} fill={C.navy} />
    </g>
  );
};

// del canal original (TechoCeniza)
export const Casa: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  capa?: number;
  lluvia?: number;
  cruje?: number;
}> = ({ x, y, s = 1, f, capa = 0, lluvia = 0, cruje = 0 }) => {
  const g = capa * 70;
  const comba = cruje * 26;
  const colorCeniza = lluvia > 0.4 ? "#6F7484" : P.ceniza4;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={360} ry={20} fill="rgba(18,12,46,0.3)" />
      <rect x={-280} y={-300} width={560} height={300} fill="#F2D7B6" />
      {[-180, 60].map((px) => (
        <g key={px}>
          <rect x={px} y={-230} width={120} height={100} rx={8} fill={C.cielo} />
          <rect x={px + 56} y={-230} width={8} height={100} fill="#F2D7B6" />
        </g>
      ))}
      <rect x={-50} y={-120} width={100} height={120} rx={8} fill={P.madera2} />
      <path d={`M-310,-300 L310,-300 L310,-330 Q0,${-330 + comba} -310,-330 Z`} fill={C.gris2} />
      {g > 0.5 ? (
        <path
          d={`M-300,-328 Q0,${-328 + comba} 300,-328 L300,${-328 - g} Q0,${-328 - g + comba} -300,${-328 - g} Z`}
          fill={colorCeniza}
        />
      ) : null}
      {lluvia > 0.001 ? (
        <g opacity={lluvia}>
          {[-180, -40, 110, 230].map((px, k) => (
            <circle key={px} cx={px} cy={-620 + (k % 2) * 20} r={90 + (k % 2) * 20} fill={C.gris2} />
          ))}
          {Array.from({ length: 22 }, (_, k) => {
            const lx = -280 + random(`ll${k}`) * 560;
            const ly = -560 + ((random(`lm${k}`) * 200 + f * 14) % 220);
            return <rect key={k} x={lx} y={ly} width={6} height={30} rx={3} fill={C.cielo} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

// del canal original (LibroVencido)
export const Libro: React.FC<{
  x: number;
  y: number;
  s?: number;
  sello?: number;
  texto?: string;
}> = ({ x, y, s = 1, sello = 0, texto = "OVERDUE" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-160} y={-210} width={340} height={440} rx={18} fill="rgba(18,12,46,0.4)" />
    <rect x={-170} y={-220} width={340} height={440} rx={18} fill={C.rojo2} />
    <rect x={-170} y={-220} width={50} height={440} rx={14} fill="#8E2618" />
    <rect x={-80} y={-160} width={210} height={26} rx={13} fill={C.crema} opacity={0.85} />
    <rect x={-80} y={-118} width={150} height={20} rx={10} fill={C.crema} opacity={0.6} />
    <rect x={-60} y={20} width={190} height={170} rx={10} fill={C.crema} />
    {[0, 1, 2, 3].map((k) => (
      <rect key={k} x={-40} y={52 + k * 34} width={150} height={6} fill={C.gris} />
    ))}
    <Sello x={20} y={-20} s={sello} texto={texto} />
  </g>
);

// del canal original
export const Pergamino: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  s?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, s = 1, children }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x + w / 2},${y + h / 2}) scale(${s}) translate(${-w / 2},${-h / 2})`}>
      <rect x={8} y={10} width={w} height={h} rx={10} fill="rgba(18,12,46,0.3)" />
      <rect width={w} height={h} rx={10} fill={C.crema} />
      <rect x={-20} y={-14} width={w + 40} height={34} rx={17} fill={P.hueso2} />
      <rect x={-20} y={h - 20} width={w + 40} height={34} rx={17} fill={P.hueso2} />
      {children}
    </g>
  );

// del canal original
export const Papelera: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={170} ry={20} fill="rgba(18,12,46,0.3)" />
    <path d="M-140,-300 L140,-300 L110,0 L-110,0 Z" fill={C.gris2} />
    {[-70, 0, 70].map((px) => (
      <rect key={px} x={px - 8} y={-260} width={16} height={230} rx={8} fill={C.gris} />
    ))}
    <rect x={-160} y={-320} width={320} height={34} rx={14} fill={C.gris} />
  </g>
);

// del canal original
export const Plato: React.FC<{
  x: number;
  y: number;
  s?: number;
  f: number;
  lleno?: number;
}> = ({ x, y, s = 1, f, lleno = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={8} cy={14} rx={320} ry={90} fill="rgba(18,12,46,0.3)" />
    <ellipse rx={320} ry={90} fill={C.blanco} />
    <ellipse rx={230} ry={60} fill={C.nieve} />
    <ellipse rx={230} ry={60} fill="none" stroke={C.hielo} strokeWidth={6} />
    {lleno > 0.01 ? (
      <g>
        <path d={`M-210,0 Q-120,${-280 * lleno} 0,${-300 * lleno} Q120,${-280 * lleno} 210,0 Z`} fill={P.ballena} />
        <Pez x={-60} y={-60 * lleno} s={0.7} f={f} />
        <Pez x={70} y={-120 * lleno} s={0.6} f={f + 7} color={C.amarillo} flip />
        <path d={`M-30,${-200 * lleno} q30,-30 60,0`} stroke={P.hueso} strokeWidth={14} fill="none" strokeLinecap="round" />
      </g>
    ) : null}
  </g>
);

// del canal original
export const Vitrina: React.FC<{
  x: number;
  y: number;
  s?: number;
  etiqueta?: string;
  children?: React.ReactNode;
}> = ({ x, y, s = 1, etiqueta = "", children }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-320} y={-120} width={640} height={120} rx={10} fill="#8A5A44" />
    <rect x={-300} y={-640} width={600} height={520} rx={8} fill={C.cielo} opacity={0.22} />
    <rect x={-300} y={-640} width={600} height={520} rx={8} fill="none" stroke={C.blanco} strokeWidth={8} opacity={0.7} />
    <path d="M-250,-600 L-180,-600 L-280,-300 L-280,-420 Z" fill={C.blanco} opacity={0.18} />
    <rect x={-330} y={-660} width={660} height={30} rx={8} fill="#6B3F2E" />
    <g transform="translate(0,-380)">{children}</g>
    {etiqueta ? (
      <g transform="translate(0,-60)">
        <rect x={-anchoT(etiqueta, 40) / 2 - 24} y={-34} width={anchoT(etiqueta, 40) + 48} height={60} rx={8} fill={C.amarillo} />
        <T x={0} y={10} size={40} fill={C.navy}>
          {etiqueta}
        </T>
      </g>
    ) : null}
  </g>
);

// del canal original
export const Foco: React.FC<{
  x: number;
  y: number;
  w?: number;
  luz?: number;
}> = ({ x, y, w = 520, luz = 1 }) =>
  luz <= 0.01 ? null : (
    <g opacity={luz}>
      <path d={`M${x - 60},0 L${x + 60},0 L${x + w / 2},${y} L${x - w / 2},${y} Z`} fill={C.crema} opacity={0.22} />
      <ellipse cx={x} cy={y} rx={w / 2} ry={w * 0.12} fill={C.crema} opacity={0.35} />
    </g>
  );

// del canal original (MonedaCanto)
export const Moneda: React.FC<{
  x: number;
  y: number;
  s?: number;
  canto?: number;
}> = ({ x, y, s = 1, canto = 0 }) => {
  const sx = 1 - 0.93 * lim(canto, 0, 1);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={8} cy={10} rx={120 * sx + 4} ry={120} fill="rgba(18,12,46,0.35)" />
      <g transform={`scale(${sx},1)`}>
        <circle r={120} fill="#AEB5C4" />
        <circle r={100} fill="#C9CED8" />
        <circle r={60} fill="#B9BFCC" />
      </g>
      {canto > 0.6
        ? Array.from({ length: 16 }, (_, k) => (
            <rect key={k} x={-3} y={-112 + k * 14} width={6} height={6} fill={C.gris2} opacity={(canto - 0.6) * 2.5} />
          ))
        : null}
    </g>
  );
};

// del canal original
export const Billete: React.FC<{
  x: number;
  y: number;
  w?: number;
  rot?: number;
}> = ({ x, y, w = 130, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <rect x={4} y={6} width={w} height={w * 0.52} rx={8} fill="rgba(18,12,46,0.25)" />
    <rect width={w} height={w * 0.52} rx={8} fill={C.teal} />
    <rect x={8} y={8} width={w - 16} height={w * 0.52 - 16} rx={5} fill="none" stroke={C.teal2} strokeWidth={4} />
    <T x={w / 2} y={w * 0.52 * 0.5 + 16} size={46} fill={C.teal2}>
      $
    </T>
  </g>
);

// del canal original
export const Lingote: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M-110,0 L-80,-70 L80,-70 L110,0 Z" fill={C.amarillo} />
    <path d="M-80,-70 L-62,-96 L98,-96 L80,-70 Z" fill="#FFE08A" />
    <path d="M80,-70 L98,-96 L128,-26 L110,0 Z" fill="#E0A21F" />
  </g>
);

// del canal original
export const Corona: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = 0 }) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-112,70 L-122,-50 L-56,10 L8,-80 L68,10 L138,-50 L128,70 Z" fill="rgba(18,12,46,0.28)" />
      <path d="M-120,60 L-130,-60 L-62,0 L0,-90 L62,0 L130,-60 L120,60 Z" fill={C.amarillo} />
      <rect x={-124} y={46} width={248} height={46} rx={12} fill="#E0A21F" />
      {[
        [-130, -60],
        [0, -90],
        [130, -60],
      ].map(([cx, cy], k) => (
        <circle key={k} cx={cx} cy={cy} r={17} fill={C.amarillo} />
      ))}
      <circle cx={-70} cy={69} r={12} fill={C.rojo} />
      <circle cx={0} cy={69} r={13} fill={C.teal2} />
      <circle cx={70} cy={69} r={12} fill={C.rojo} />
    </g>
  );

// del canal original
export const Capitolio: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={380} ry={22} fill="rgba(18,12,46,0.3)" />
    <rect x={-350} y={-42} width={700} height={42} fill={C.hielo} />
    <rect x={-310} y={-210} width={620} height={168} fill={C.nieve} />
    {Array.from({ length: 11 }, (_, k) => (
      <rect key={k} x={-270 + k * 54 - 10} y={-196} width={20} height={146} fill={C.hielo} />
    ))}
    <path d="M-330,-210 L330,-210 L300,-244 L-300,-244 Z" fill={C.blanco} />
    <rect x={-160} y={-340} width={320} height={96} fill={C.nieve} />
    {Array.from({ length: 7 }, (_, k) => (
      <rect key={k} x={-132 + k * 44 - 8} y={-330} width={16} height={80} fill={C.hielo} />
    ))}
    <rect x={-180} y={-358} width={360} height={20} fill={C.blanco} />
    <path d="M-150,-358 Q-150,-536 0,-548 Q150,-536 150,-358 Z" fill={C.blanco} />
    <path d="M-60,-362 Q-58,-500 0,-546 M60,-362 Q58,-500 0,-546" stroke={C.hielo} strokeWidth={8} fill="none" />
    <rect x={-26} y={-596} width={52} height={52} fill={C.nieve} />
    <path d="M-30,-596 Q0,-632 30,-596 Z" fill={C.blanco} />
    <rect x={-6} y={-650} width={12} height={34} fill={C.gris} />
  </g>
);

// del canal original
const estrella = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, k) => {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const rr = k % 2 ? r * 0.45 : r;
    return `${k ? "L" : "M"}${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
  }).join(" ") + " Z";

// del canal original
export const BanderaUSA: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => {
  const h = w * 0.62;
  const fr = h / 7;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height={h} fill={C.blanco} />
      {[0, 2, 4, 6].map((k) => (
        <rect key={k} y={k * fr} width={w} height={fr} fill={C.rojo} />
      ))}
      <rect width={w * 0.46} height={fr * 4} fill="#1F5FAE" />
      {[0, 1, 2].map((i) =>
        [0, 1].map((j) => (
          <circle key={`${i}-${j}`} cx={(w * 0.46 * (i + 0.5)) / 3} cy={(fr * 4 * (j + 0.5)) / 2} r={w * 0.035} fill={C.blanco} />
        )),
      )}
    </g>
  );
};

// del canal original
export const BanderaURSS: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <g transform={`translate(${x},${y})`}>
    <rect width={w} height={w * 0.62} fill={C.rojo} />
    <path d={estrella(w * 0.22, w * 0.2, w * 0.12)} fill={C.amarillo} />
  </g>
);
