// Biblioteca Plano Pop · objetos cotidianos (con aire de los años 50–60 cuando toca): tocadiscos, botella sin etiqueta,
// ducha, máquina de pinball, aro de baloncesto y balón, cámara de flash, micrófonos, periódico, radio, teléfono de disco,
// balanza de dos platos, frasco de pastillas, cama, almohada, lápiz, archivador, pantalla de computador, libro grueso,
// escarapela de premio, casco de fútbol americano y cuadro enmarcado. Nuevas en V11; todas sin marcas ni logos.
// Convención: x,y = base al centro (lo que se apoya en el suelo o la mesa) salvo que diga otra cosa. Dos tonos y sombra.
import React from "react";
import { random } from "remotion";
import { C, T, fontFamily } from "../kit";
import { PB as P, anchoT, lim } from "./paleta";
import { dosTonos } from "./volumen";

const SOMBRA = "rgba(18,12,46,0.3)";

/** Tocadiscos de maleta de los 60 (≈ 440×230; x,y = base). El disco gira; notas 0..1 = salen notas musicales grandes. */
export const Tocadiscos: React.FC<{ x: number; y: number; f: number; s?: number; notas?: number; color?: string; gira?: boolean }> = ({
  x,
  y,
  f,
  s = 1,
  notas = 0,
  color = "#D35F4B",
  gira = true,
}) => {
  const c = dosTonos(color);
  const ang = gira ? f * 9 : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={10} cy={4} rx={240} ry={18} fill={SOMBRA} />
      <rect x={-220} y={-120} width={440} height={120} rx={18} fill={c.sombra} />
      <rect x={-220} y={-120} width={440} height={96} rx={18} fill={c.base} />
      <rect x={-214} y={-116} width={428} height={12} rx={6} fill={c.luz} opacity={0.6} />
      <rect x={-200} y={-60} width={400} height={8} rx={4} fill={C.crema} opacity={0.8} />
      {[-150, 150].map((px) => (
        <rect key={px} x={px - 20} y={-8} width={40} height={10} rx={4} fill={C.gris2} />
      ))}
      {/* plato y disco en perspectiva */}
      <ellipse cx={-30} cy={-132} rx={170} ry={44} fill={C.gris2} />
      <ellipse cx={-30} cy={-138} rx={160} ry={40} fill={C.negro} />
      <g transform="translate(-30,-138) scale(1,0.25)">
        <g transform={`rotate(${ang})`}>
          {[150, 128, 106, 84].map((r) => (
            <circle key={r} r={r} fill="none" stroke="#2A2350" strokeWidth={4} />
          ))}
          <circle r={50} fill={C.amarillo} />
          <rect x={-6} y={-46} width={12} height={22} rx={4} fill={C.rojo} />
          <circle r={7} fill={C.negro} />
          <path d="M-150,-10 A150,150 0 0 1 -60,-138" stroke={C.blanco} strokeWidth={10} fill="none" opacity={0.18} />
        </g>
      </g>
      {/* brazo */}
      <circle cx={170} cy={-140} r={22} fill={C.gris} />
      <path d="M170,-140 L110,-170 L40,-150" stroke={C.gris} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={28} y={-160} width={24} height={16} rx={4} fill={C.gris2} transform="rotate(-12 40 -152)" />
      {notas > 0.01
        ? [0, 1, 2].map((k) => {
            const t = ((f + k * 22) % 66) / 66;
            const nx = -40 + k * 70 + Math.sin(t * 6 + k) * 30;
            const ny = -200 - t * 260;
            const op = notas * (t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8);
            return (
              <g key={k} transform={`translate(${nx},${ny}) rotate(${Math.sin(t * 5) * 18}) scale(${1 + t * 0.4})`} opacity={op}>
                <ellipse cx={0} cy={0} rx={22} ry={16} fill={k % 2 ? C.amarillo : C.teal} transform="rotate(-20)" />
                <rect x={16} y={-80} width={9} height={80} fill={k % 2 ? C.amarillo : C.teal} />
                {k === 1 ? <path d="M25,-80 Q60,-70 52,-38" stroke={C.amarillo} strokeWidth={9} fill="none" /> : null}
              </g>
            );
          })
        : null}
    </g>
  );
};

/** Botella de vidrio sin etiqueta con refresco y burbujas (≈ 100×320; x,y = base). vidrio = color; liquido 0..1; id único por copia. */
export const BotellaSoda: React.FC<{ x: number; y: number; f: number; s?: number; rot?: number; vidrio?: string; liquido?: number; id?: string }> = ({
  x,
  y,
  f,
  s = 1,
  rot = 0,
  vidrio = "#6FC4B5",
  liquido = 0.8,
  id = "bot",
}) => {
  const v = dosTonos(vidrio);
  const d = "M-44,0 Q-50,-60 -46,-150 Q-44,-190 -24,-220 L-16,-280 L-16,-300 L16,-300 L16,-280 L24,-220 Q44,-190 46,-150 Q50,-60 44,0 Z";
  const lv = -40 - 200 * lim(liquido, 0, 1);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={8} cy={2} rx={56} ry={10} fill={SOMBRA} />
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={v.base} opacity={0.9} />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={-60} y={lv} width={120} height={400} fill="#5A2E1E" opacity={0.85} />
        <rect x={-60} y={lv} width={120} height={8} fill="#C98A5A" opacity={0.8} />
        {Array.from({ length: 7 }, (_, k) => {
          const t = ((f * 1.5 + k * 23) % 160) / 160;
          const by = -10 - t * (-(lv) - 20);
          return <circle key={k} cx={-24 + random(`bb${k}`) * 48} cy={by} r={3 + random(`bs${k}`) * 3} fill={C.crema} opacity={0.6} />;
        })}
        <rect x={20} y={-300} width={30} height={300} fill={v.sombra} opacity={0.5} />
      </g>
      <path d="M-30,-40 Q-34,-120 -30,-170" stroke={C.blanco} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.55} />
      <rect x={-19} y={-316} width={38} height={20} rx={5} fill={C.gris} />
      <rect x={-19} y={-316} width={38} height={6} rx={3} fill={C.blanco} opacity={0.5} />
    </g>
  );
};

/**
 * Ducha: brazo de tubo desde arriba a la izquierda y regadera (x,y = centro de la regadera, ≈ 200×120). agua 0..1 =
 * chorro de gotas azules que cae `alto` px; frio 0..1 = vaho azul y copitos de escarcha (agua fría).
 */
export const Ducha: React.FC<{ x: number; y: number; f: number; s?: number; agua?: number; alto?: number; frio?: number }> = ({
  x,
  y,
  f,
  s = 1,
  agua = 1,
  alto = 520,
  frio = 0,
}) => {
  const metal = dosTonos(C.gris);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-200,-170 L-200,-90 Q-200,-60 -170,-60 L-40,-60" stroke={metal.sombra} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M-200,-170 L-200,-90 Q-200,-60 -170,-60 L-40,-60" stroke={metal.luz} strokeWidth={6} fill="none" strokeLinecap="round" transform="translate(-4,-5)" opacity={0.7} />
      <path d="M-40,-74 L40,-74 L100,10 L-100,10 Z" fill={metal.base} />
      <path d="M10,-74 L40,-74 L100,10 L40,10 Z" fill={metal.sombra} opacity={0.6} />
      <ellipse cx={0} cy={10} rx={100} ry={18} fill={metal.sombra} />
      {Array.from({ length: 9 }, (_, k) => (
        <circle key={k} cx={-72 + k * 18} cy={12} r={4} fill={C.negro} />
      ))}
      {agua > 0.01
        ? Array.from({ length: 26 }, (_, k) => {
            const t = ((f * 2.2 + random(`du${k}`) * 100) % 100) / 100;
            const gx = -80 + random(`dx${k}`) * 160;
            const gy = 30 + t * alto;
            const sx = gx * (1 + t * 0.6);
            return <path key={k} d={`M${sx},${gy} q-7,16 0,22 q7,-6 0,-22 Z`} fill={k % 3 ? "#7CC4F2" : C.cielo} opacity={agua * (1 - t * 0.5)} />;
          })
        : null}
      {frio > 0.01 ? (
        <g opacity={frio}>
          <ellipse cx={0} cy={alto * 0.55} rx={190} ry={alto * 0.45} fill={C.cielo} opacity={0.18} />
          {[0, 1, 2, 3].map((k) => {
            const t = ((f + k * 20) % 80) / 80;
            return (
              <g key={k} transform={`translate(${-150 + k * 100},${alto * 0.3 + t * 120}) rotate(${t * 90})`} opacity={1 - t}>
                {[0, 60, 120].map((r) => (
                  <rect key={r} x={-2.5} y={-16} width={5} height={32} rx={2.5} fill={C.blanco} transform={`rotate(${r})`} />
                ))}
              </g>
            );
          })}
        </g>
      ) : null}
    </g>
  );
};

/**
 * Máquina de pinball sin marca, vista de 3/4 (≈ 440×700; x,y = base al centro). Caja de atrás con marcador de 6 cifras
 * (`puntos`), arte abstracto de estrellas, mesa inclinada con bumpers que se encienden, flippers que golpean en
 * `golpes` (fotogramas) y bola que rebota. luces 0..1 = intensidad de las luces que parpadean.
 */
export const Pinball: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  puntos?: number;
  luces?: number;
  golpes?: number[];
  color?: string;
}> = ({ x, y, f, s = 1, puntos = 0, luces = 1, golpes = [], color = C.morado }) => {
  const c = dosTonos(color);
  const golpe = golpes.reduce((m, g) => (f >= g && f < g + 8 ? Math.max(m, 1 - (f - g) / 8) : m), 0);
  const parp = (k: number) => (Math.floor(f / 6 + k) % 3 === 0 ? 1 : 0.35);
  const marc = String(Math.max(0, Math.floor(puntos)));
  const cifras = ("000000" + marc).slice(-6);
  const bx = Math.sin(f / 5) * 70;
  const by = -260 + Math.abs(Math.sin(f / 7)) * 120;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={10} cy={4} rx={250} ry={20} fill={SOMBRA} />
      {/* patas */}
      {[-180, 180].map((px) => (
        <g key={px}>
          <rect x={px - 12} y={-170} width={24} height={170} rx={6} fill={C.gris2} />
          <rect x={px - 22} y={-12} width={44} height={14} rx={5} fill={C.negro} />
        </g>
      ))}
      {/* cuerpo y mesa */}
      <path d="M-220,-170 L220,-170 L200,-230 L-200,-230 Z" fill={c.sombra} />
      <path d="M-200,-230 L200,-230 L150,-420 L-150,-420 Z" fill={C.navy2} />
      <path d="M-188,-236 L188,-236 L142,-412 L-142,-412 Z" fill="#2E4FA8" />
      {/* bumpers */}
      {[
        [-60, -360],
        [60, -360],
        [0, -320],
      ].map(([px, py], k) => (
        <g key={k}>
          <ellipse cx={px} cy={py + 6} rx={30} ry={14} fill={C.negro} opacity={0.4} />
          <ellipse cx={px} cy={py} rx={30} ry={14} fill={k === 2 ? C.rojo : C.amarillo} opacity={0.5 + 0.5 * luces * parp(k)} />
          <ellipse cx={px} cy={py - 4} rx={16} ry={6} fill={C.blanco} opacity={0.6 * luces * parp(k)} />
        </g>
      ))}
      {/* bola */}
      <circle cx={bx} cy={by} r={12} fill={C.gris} />
      <circle cx={bx - 4} cy={by - 4} r={4} fill={C.blanco} />
      {/* flippers */}
      <g transform={`translate(-60,-250) rotate(${-10 - golpe * 30})`}>
        <rect x={0} y={-8} width={60} height={16} rx={8} fill={C.blanco} />
      </g>
      <g transform={`translate(60,-250) rotate(${190 + golpe * 30})`}>
        <rect x={0} y={-8} width={60} height={16} rx={8} fill={C.blanco} />
      </g>
      {/* cristal */}
      <path d="M-188,-236 L-80,-236 L-30,-412 L-142,-412 Z" fill={C.blanco} opacity={0.08} />
      {/* frente con monedero */}
      <path d="M-220,-170 L220,-170 L220,-110 L-220,-110 Z" fill={c.base} />
      <rect x={-40} y={-160} width={80} height={40} rx={6} fill={c.sombra} />
      <rect x={-24} y={-150} width={16} height={22} rx={3} fill={C.amarillo} opacity={0.5 + 0.5 * parp(1)} />
      <rect x={8} y={-150} width={16} height={22} rx={3} fill={C.amarillo} opacity={0.5 + 0.5 * parp(2)} />
      {/* caja de atrás */}
      <rect x={-170} y={-700} width={340} height={290} rx={18} fill={c.sombra} />
      <rect x={-170} y={-700} width={340} height={274} rx={18} fill={c.base} />
      <rect x={-160} y={-690} width={320} height={12} rx={6} fill={c.luz} opacity={0.6} />
      <rect x={-140} y={-670} width={280} height={140} rx={14} fill={C.navy} />
      {/* arte abstracto: estrellas y rayos */}
      {[
        [-90, -620, C.amarillo],
        [0, -640, C.teal],
        [90, -610, C.naranja],
        [-40, -570, C.rojo],
        [60, -565, C.lila],
      ].map(([px, py, col], k) => (
        <path
          key={k}
          d="M0,-22 L6,-6 L22,-6 L9,4 L14,20 L0,10 L-14,20 L-9,4 L-22,-6 L-6,-6 Z"
          fill={col as string}
          transform={`translate(${px},${py}) scale(${0.8 + 0.3 * parp(k) * luces})`}
        />
      ))}
      {/* marcador */}
      <rect x={-150} y={-512} width={300} height={70} rx={10} fill={C.negro} />
      <text x={0} y={-460} fontFamily={fontFamily} fontWeight={900} fontSize={54} fill={C.naranja} textAnchor="middle" letterSpacing={6}>
        {cifras}
      </text>
      <rect x={-150} y={-512} width={300} height={22} rx={10} fill={C.blanco} opacity={0.06} />
      {/* bombillas del borde */}
      {Array.from({ length: 10 }, (_, k) => (
        <circle key={k} cx={-150 + k * 33} cy={-418} r={7} fill={k % 2 ? C.amarillo : C.rojo} opacity={0.35 + 0.65 * luces * parp(k)} />
      ))}
    </g>
  );
};

/** Balón de baloncesto (r 60 a s=1; x,y = centro) con líneas, dos tonos y brillo; rot para que gire. */
export const Balon: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 60, rot = 0 }) => {
  const c = dosTonos("#E9783A");
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <circle r={r} fill={c.base} />
      <path d={`M${r * 0.15},${-r} A${r},${r} 0 0 1 ${r * 0.15},${r} A${r * 1.2},${r * 1.2} 0 0 0 ${r * 0.15},${-r} Z`} fill={c.sombra} opacity={0.5} />
      <g stroke={C.navy} strokeWidth={r * 0.07} fill="none">
        <path d={`M${-r},0 L${r},0`} />
        <path d={`M0,${-r} L0,${r}`} />
        <path d={`M${-r * 0.7},${-r * 0.7} Q${-r * 0.2},0 ${-r * 0.7},${r * 0.7}`} />
        <path d={`M${r * 0.7},${-r * 0.7} Q${r * 0.2},0 ${r * 0.7},${r * 0.7}`} />
      </g>
      <ellipse cx={-r * 0.38} cy={-r * 0.42} rx={r * 0.25} ry={r * 0.12} fill={C.blanco} opacity={0.45} transform={`rotate(-35 ${-r * 0.38} ${-r * 0.42})`} />
    </g>
  );
};

/**
 * Aro de baloncesto de entrada de casa: poste, tablero, aro y red que se mece (≈ 360×760; x,y = base del poste).
 * tiro 0..1 = un balón sale de (desdeX, desdeY) (relativo a la base), hace arco y entra; a 1 la red se agita.
 */
export const AroBasket: React.FC<{ x: number; y: number; f: number; s?: number; tiro?: number; desdeX?: number; desdeY?: number; flip?: boolean }> = ({
  x,
  y,
  f,
  s = 1,
  tiro = 0,
  desdeX = -520,
  desdeY = -300,
  flip,
}) => {
  const poste = dosTonos(C.gris2);
  const ax = 150;
  const ay = -560;
  const t = lim(tiro, 0, 1);
  const bxx = desdeX + (ax - desdeX) * t;
  const byy = desdeY + (ay - 40 - desdeY) * t - Math.sin(t * Math.PI) * 300 + (t > 0.92 ? (t - 0.92) * 900 : 0);
  const agita = t > 0.9 ? Math.sin(f * 1.4) * 8 * (1 - (t - 0.9) * 5) : Math.sin(f / 9) * 2;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={30} cy={4} rx={90} ry={12} fill={SOMBRA} />
      <rect x={-14} y={-720} width={28} height={720} rx={8} fill={poste.base} />
      <rect x={-14} y={-720} width={9} height={720} rx={4} fill={poste.luz} opacity={0.5} />
      <path d="M0,-660 L90,-660" stroke={poste.sombra} strokeWidth={14} />
      <rect x={80} y={-760} width={30} height={220} rx={6} fill={C.blanco} />
      <rect x={80} y={-760} width={30} height={220} rx={6} fill="none" stroke={C.gris2} strokeWidth={4} />
      <rect x={86} y={-680} width={18} height={70} rx={3} fill="none" stroke={C.rojo} strokeWidth={5} />
      {/* red */}
      <g transform={`translate(${ax},${ay})`}>
        {Array.from({ length: 6 }, (_, k) => {
          const x0 = -46 + k * 18.4;
          return <path key={k} d={`M${x0},0 Q${x0 * 0.7 + agita},40 ${x0 * 0.55 + agita * 1.4},80`} stroke={C.blanco} strokeWidth={4} fill="none" />;
        })}
        {[26, 54].map((yy) => (
          <path key={yy} d={`M${-46 + yy * 0.22},${yy} Q${agita},${yy + 8} ${46 - yy * 0.22},${yy}`} stroke={C.blanco} strokeWidth={3} fill="none" opacity={0.8} />
        ))}
        <ellipse cx={0} cy={0} rx={50} ry={12} fill="none" stroke={C.rojo} strokeWidth={8} />
      </g>
      {tiro > 0.001 && tiro < 0.999 ? <Balon x={bxx} y={byy} r={44} rot={t * 540} /> : null}
    </g>
  );
};

/**
 * Cámara de prensa de los 60 con fuelle y bombilla de flash en reflector (≈ 300×300; x,y = centro de la caja).
 * dispara = fotogramas de cada foto: destello con rayos de 8 fotogramas desde el reflector. flip = mira a la izquierda.
 */
export const CamaraFlash: React.FC<{ x: number; y: number; f: number; s?: number; dispara?: number[]; flip?: boolean; rot?: number }> = ({
  x,
  y,
  f,
  s = 1,
  dispara = [],
  flip,
  rot = 0,
}) => {
  const cuerpo = dosTonos("#3A3550");
  const fl = dispara.reduce((m, d) => (f >= d && f < d + 8 ? Math.max(m, 1 - (f - d) / 8) : m), 0);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${flip ? -s : s},${s})`}>
      <rect x={-90} y={-70} width={180} height={150} rx={14} fill={cuerpo.base} />
      <rect x={-90} y={-70} width={180} height={20} rx={10} fill={cuerpo.luz} opacity={0.5} />
      {/* fuelle */}
      <path d="M90,-50 L170,-34 L170,54 L90,70 Z" fill={C.negro} />
      {[110, 130, 150].map((px) => (
        <line key={px} x1={px} y1={-42 + (px - 90) * 0.2} x2={px} y2={62 - (px - 90) * 0.2} stroke={C.navy2} strokeWidth={5} />
      ))}
      <rect x={168} y={-40} width={22} height={100} rx={6} fill={C.gris2} />
      <circle cx={196} cy={10} r={30} fill={C.gris} />
      <circle cx={196} cy={10} r={20} fill={C.navy} />
      <circle cx={190} cy={4} r={6} fill={C.blanco} opacity={0.7} />
      {/* reflector y bombilla */}
      <rect x={-20} y={-120} width={14} height={56} fill={C.gris2} />
      <path d="M-90,-210 Q-13,-170 64,-210 L30,-120 L-56,-120 Z" fill={C.gris} />
      <path d="M-70,-200 Q-13,-172 44,-200 L22,-128 L-48,-128 Z" fill={C.hielo} />
      <circle cx={-13} cy={-150} r={18} fill={fl > 0 ? C.blanco : C.crema} />
      {fl > 0.01 ? (
        <g opacity={fl}>
          <circle cx={-13} cy={-160} r={150 * (0.6 + fl * 0.6)} fill={C.blanco} opacity={0.35} />
          {Array.from({ length: 10 }, (_, k) => (
            <rect key={k} x={-6} y={-260 * fl - 40} width={12} height={110 * fl} rx={6} fill={C.amarillo} transform={`translate(-13,-160) rotate(${k * 36})`} />
          ))}
          <circle cx={-13} cy={-160} r={46} fill={C.blanco} />
        </g>
      ) : null}
    </g>
  );
};

/** Micrófonos de rueda de prensa sobre la mesa (n de 1 a 5; ≈ 120·n de ancho; x,y = base al centro). */
export const Microfonos: React.FC<{ x: number; y: number; f: number; s?: number; n?: number }> = ({ x, y, f, s = 1, n = 3 }) => {
  const cols = [C.gris, C.rojo, C.teal2, C.gris2, C.amarillo];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: n }, (_, k) => {
        const px = (k - (n - 1) / 2) * 110;
        const alto = 200 + (k % 2) * 50;
        const inc = (k - (n - 1) / 2) * 8 + Math.sin(f / 30 + k) * 1.5;
        const m = dosTonos(cols[k % cols.length]);
        return (
          <g key={k} transform={`translate(${px},0) rotate(${inc})`}>
            <ellipse cx={0} cy={0} rx={44} ry={10} fill={C.negro} />
            <rect x={-6} y={-alto} width={12} height={alto} fill={C.gris2} />
            <rect x={-26} y={-alto - 88} width={52} height={96} rx={26} fill={m.base} />
            <rect x={6} y={-alto - 84} width={16} height={88} rx={8} fill={m.sombra} opacity={0.6} />
            {[0, 1, 2, 3].map((r) => (
              <line key={r} x1={-22} y1={-alto - 70 + r * 16} x2={22} y2={-alto - 70 + r * 16} stroke={m.sombra} strokeWidth={3} />
            ))}
            <rect x={-18} y={-alto - 80} width={8} height={40} rx={4} fill={C.blanco} opacity={0.35} />
          </g>
        );
      })}
    </g>
  );
};

/**
 * Periódico doblado (≈ 560×720; x,y = centro): cabecera inventada (`nombre`, size 50), fecha chica, titular de 1–3
 * líneas (size 64, ≤ 14 letras por línea), foto en gris (children en 0..220 × 0..170 si quieres dibujar algo) y columnas.
 */
export const Periodico: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  nombre?: string;
  fecha?: string;
  titular: string[];
  children?: React.ReactNode;
}> = ({ x, y, s = 1, rot = 0, nombre = "THE DAILY HERALD", fecha, titular, children }) => {
  const sizeN = Math.min(50, 500 / (nombre.length * 0.7));
  const sizeT = Math.min(64, ...titular.map((l) => 500 / Math.max(1, l.length * 0.7)));
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-270} y={-350} width={560} height={720} rx={6} fill={SOMBRA} />
      <rect x={-280} y={-360} width={560} height={720} rx={6} fill="#F3EEDF" />
      <rect x={-280} y={-360} width={20} height={720} fill="#E2DAC4" />
      <T x={0} y={-292} size={sizeN} fill={C.navy} ls={1}>
        {nombre}
      </T>
      <rect x={-250} y={-272} width={500} height={5} fill={C.navy} />
      {fecha ? (
        <T x={0} y={-234} size={30} fill={C.gris2}>
          {fecha}
        </T>
      ) : null}
      <rect x={-250} y={-222} width={500} height={3} fill={C.navy} />
      {titular.map((l, k) => (
        <T key={k} x={0} y={-150 + k * (sizeT + 10)} size={sizeT} fill={C.negro}>
          {l}
        </T>
      ))}
      <g transform={`translate(-250,${-120 + titular.length * (sizeT + 10)})`}>
        <rect width={220} height={170} fill="#B9B3A3" />
        {children ?? (
          <g fill="#8E8778">
            <circle cx={110} cy={70} r={34} />
            <rect x={60} y={108} width={100} height={62} rx={30} />
          </g>
        )}
        {Array.from({ length: 7 }, (_, k) => (
          <rect key={k} x={240} y={k * 24 + 4} width={k === 6 ? 160 : 260} height={10} rx={5} fill="#C9C2B0" />
        ))}
        {Array.from({ length: 5 }, (_, k) => (
          <rect key={k} x={0} y={190 + k * 24} width={k % 2 ? 440 : 500} height={10} rx={5} fill="#C9C2B0" />
        ))}
      </g>
    </g>
  );
};

/**
 * Radio de mesa de los 60 (≈ 420×260; x,y = base): parlante con rejilla, dial con aguja, perillas y luz.
 * senal 0..1 = ondas que salen del parlante; estatica 0..1 = la señal se corta (rayas de ruido y ondas rotas).
 */
export const RadioVieja: React.FC<{ x: number; y: number; f: number; s?: number; senal?: number; estatica?: number; color?: string }> = ({
  x,
  y,
  f,
  s = 1,
  senal = 0,
  estatica = 0,
  color = "#E2A23B",
}) => {
  const c = dosTonos(color);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={10} cy={4} rx={230} ry={16} fill={SOMBRA} />
      <path d="M-210,0 L-210,-200 Q-210,-260 -150,-260 L150,-260 Q210,-260 210,-200 L210,0 Z" fill={c.sombra} />
      <path d="M-210,-14 L-210,-200 Q-210,-260 -150,-260 L150,-260 Q210,-260 210,-200 L210,-14 Z" fill={c.base} />
      <path d="M-190,-230 Q-170,-248 -140,-248 L120,-248" stroke={c.luz} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} />
      {/* rejilla */}
      <rect x={-180} y={-220} width={210} height={190} rx={20} fill={C.crema} />
      {Array.from({ length: 8 }, (_, k) => (
        <rect key={k} x={-170} y={-206 + k * 22} width={190} height={10} rx={5} fill="#D9C9A6" />
      ))}
      {/* dial */}
      <rect x={50} y={-220} width={140} height={90} rx={14} fill={C.navy} />
      {Array.from({ length: 8 }, (_, k) => (
        <rect key={k} x={62 + k * 16} y={-200} width={4} height={k % 2 ? 14 : 24} fill={C.crema} />
      ))}
      <rect x={60 + (Math.sin(f / 40) * 0.5 + 0.5) * 110} y={-212} width={5} height={70} fill={C.rojo} />
      <circle cx={170} cy={-150} r={6} fill={senal > 0.2 && estatica < 0.5 ? C.amarillo : C.gris2} />
      {[80, 150].map((kx) => (
        <g key={kx}>
          <circle cx={kx} cy={-70} r={28} fill={c.sombra} />
          <circle cx={kx} cy={-70} r={22} fill={C.crema} />
          <rect x={kx - 3} y={-90} width={6} height={20} rx={3} fill={C.navy} transform={`rotate(${Math.sin(f / 25 + kx) * 30} ${kx} -70)`} />
        </g>
      ))}
      {senal > 0.01
        ? [0, 1, 2].map((k) => {
            const t = ((f + k * 12) % 36) / 36;
            const r = 140 + t * 160;
            const roto = estatica > 0.3 && random(`rs${k}${Math.floor(f / 3)}`) < estatica;
            return (
              <path
                key={k}
                d={`M${-75 + r * Math.cos(-0.6)},${-125 + r * Math.sin(-0.6)} A${r},${r} 0 0 1 ${-75 + r * Math.cos(0.6)},${-125 + r * Math.sin(0.6)}`}
                stroke={C.amarillo}
                strokeWidth={9}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={roto ? "18 26" : undefined}
                opacity={senal * (1 - t) * (roto ? 0.6 : 1)}
                transform="translate(40,0)"
              />
            );
          })
        : null}
      {estatica > 0.01 ? (
        <g opacity={estatica}>
          {Array.from({ length: 12 }, (_, k) => {
            const ry = random(`re${k}${Math.floor(f / 2)}`);
            return <rect key={k} x={-180 + random(`rx${k}${Math.floor(f / 2)}`) * 100} y={-220 + ry * 190} width={60 + random(`rw${k}`) * 120} height={5} fill={C.gris2} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

/** Teléfono de disco (≈ 300×200; x,y = base). suena = tiembla y saca rayitas; levantado 0..1 = el auricular sube. */
export const TelefonoDisco: React.FC<{ x: number; y: number; f: number; s?: number; suena?: boolean; levantado?: number; color?: string }> = ({
  x,
  y,
  f,
  s = 1,
  suena,
  levantado = 0,
  color = C.rojo,
}) => {
  const c = dosTonos(color);
  const vib = suena ? Math.sin(f * 2.4) * 4 : 0;
  const l = lim(levantado, 0, 1);
  return (
    <g transform={`translate(${x + vib},${y}) scale(${s})`}>
      <ellipse cx={8} cy={4} rx={160} ry={14} fill={SOMBRA} />
      <path d="M-150,0 L-110,-150 L110,-150 L150,0 Z" fill={c.sombra} />
      <path d="M-140,-8 L-104,-144 L104,-144 L140,-8 Z" fill={c.base} />
      <circle cx={0} cy={-80} r={62} fill={C.crema} />
      {Array.from({ length: 10 }, (_, k) => {
        const a = (-60 + k * 30) * (Math.PI / 180);
        return <circle key={k} cx={Math.cos(a) * 42} cy={-80 + Math.sin(a) * 42} r={10} fill={C.navy2} />;
      })}
      <circle cx={0} cy={-80} r={18} fill={c.luz} />
      <g transform={`translate(0,${-150 - l * 160}) rotate(${-l * 25})`}>
        <path d="M-150,10 Q-160,-40 -110,-40 L110,-40 Q160,-40 150,10 L110,10 Q100,-10 80,-10 L-80,-10 Q-100,-10 -110,10 Z" fill={c.base} />
        <path d="M-150,10 Q-160,-40 -110,-40 L-60,-40 Q-110,-30 -120,10 Z" fill={c.luz} opacity={0.5} />
      </g>
      {suena
        ? [-1, 1].map((d) => (
            <g key={d} opacity={0.5 + 0.5 * Math.sin(f)}>
              {[0, 1, 2].map((k) => (
                <line key={k} x1={d * 170} y1={-140 + k * 30} x2={d * 215} y2={-160 + k * 40} stroke={C.amarillo} strokeWidth={8} strokeLinecap="round" />
              ))}
            </g>
          ))
        : null}
    </g>
  );
};

/**
 * Balanza de dos platos (≈ 760×520; x,y = base del pie). inclina −1..1 (positivo = baja el plato derecho).
 * izq / der = lo que va sobre cada plato (origen en el centro del plato, encima). Los platos cuelgan siempre derechos.
 */
export const BalanzaPlatos: React.FC<{ x: number; y: number; f: number; s?: number; inclina?: number; izq?: React.ReactNode; der?: React.ReactNode }> = ({
  x,
  y,
  f,
  s = 1,
  inclina = 0,
  izq,
  der,
}) => {
  const oro = dosTonos(P.oro);
  const ang = lim(inclina, -1, 1) * 16 + Math.sin(f / 14) * 0.8;
  const ra = (ang * Math.PI) / 180;
  const L = 300;
  const ex = (d: number) => [Math.cos(ra) * L * d, -440 + Math.sin(ra) * L * d] as const;
  const plato = (d: number, cont?: React.ReactNode) => {
    const [px, py] = ex(d);
    return (
      <g transform={`translate(${px},${py})`}>
        <path d="M0,0 L-100,150 M0,0 L100,150" stroke={oro.sombra} strokeWidth={5} />
        <path d="M-130,150 Q0,210 130,150 Z" fill={oro.base} />
        <path d="M-130,150 Q0,170 130,150" stroke={oro.luz} strokeWidth={6} fill="none" />
        <g transform="translate(0,150)">{cont}</g>
      </g>
    );
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={10} cy={4} rx={200} ry={18} fill={SOMBRA} />
      <path d="M-140,0 Q0,-60 140,0 Z" fill={oro.sombra} />
      <rect x={-16} y={-440} width={32} height={410} rx={10} fill={oro.base} />
      <rect x={-16} y={-440} width={10} height={410} rx={5} fill={oro.luz} opacity={0.6} />
      <g transform={`translate(0,-440) rotate(${ang})`}>
        <rect x={-L - 10} y={-10} width={2 * L + 20} height={20} rx={10} fill={oro.base} />
        <rect x={-L - 10} y={-10} width={2 * L + 20} height={6} rx={3} fill={oro.luz} opacity={0.7} />
      </g>
      <path d="M-14,-440 L0,-470 L14,-440 Z" fill={C.rojo} transform={`rotate(${ang} 0 -440)`} />
      <circle cx={0} cy={-440} r={20} fill={oro.sombra} />
      {plato(-1, izq)}
      {plato(1, der)}
    </g>
  );
};

/** Frasco de pastillas de farmacia (≈ 150×220; x,y = base), con tapa blanca y pastillas visibles; sin etiqueta de marca. */
export const FrascoPastillas: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string }> = ({ x, y, s = 1, rot = 0, color = "#E8952F" }) => {
  const c = dosTonos(color);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={6} cy={4} rx={80} ry={10} fill={SOMBRA} />
      <rect x={-70} y={-180} width={140} height={180} rx={18} fill={c.base} opacity={0.92} />
      {[
        [-36, -40, C.blanco],
        [0, -30, C.teal],
        [34, -44, C.blanco],
        [-18, -72, C.rojo],
        [20, -80, C.blanco],
        [-40, -100, C.teal],
      ].map(([px, py, col], k) => (
        <rect key={k} x={(px as number) - 20} y={(py as number) - 10} width={40} height={20} rx={10} fill={col as string} transform={`rotate(${k * 37} ${px} ${py})`} opacity={0.9} />
      ))}
      <rect x={30} y={-176} width={30} height={170} rx={12} fill={c.sombra} opacity={0.5} />
      <rect x={-56} y={-150} width={14} height={120} rx={7} fill={C.blanco} opacity={0.35} />
      <rect x={-50} y={-130} width={100} height={60} rx={8} fill={C.blanco} opacity={0.9} />
      <rect x={-38} y={-116} width={76} height={8} rx={4} fill={C.gris} />
      <rect x={-38} y={-98} width={50} height={8} rx={4} fill={C.gris} />
      <rect x={-80} y={-226} width={160} height={52} rx={12} fill={C.blanco} />
      {Array.from({ length: 9 }, (_, k) => (
        <rect key={k} x={-72 + k * 17} y={-220} width={6} height={40} rx={3} fill={C.hielo} />
      ))}
    </g>
  );
};

/** Almohada blanca con volumen (≈ 300×130; x,y = centro). aplasta 0..1 = hundida (alguien acostado). */
export const Almohada: React.FC<{ x: number; y: number; s?: number; rot?: number; aplasta?: number; color?: string }> = ({
  x,
  y,
  s = 1,
  rot = 0,
  aplasta = 0,
  color = C.blanco,
}) => {
  const c = dosTonos(color === C.blanco ? "#EEF2FA" : color);
  const a = aplasta * 18;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={8} cy={60} rx={150} ry={14} fill={SOMBRA} />
      <path d={`M-150,-30 Q-160,-60 -120,-58 Q0,${-80 + a} 120,-58 Q160,-60 150,-30 Q160,40 120,54 Q0,70 -120,54 Q-160,40 -150,-30 Z`} fill={c.base} />
      <path d="M-120,54 Q0,70 120,54 Q160,40 150,-30 Q150,30 110,36 Q0,50 -110,36 Q-150,30 -150,-30 Q-160,40 -120,54 Z" fill={c.sombra} opacity={0.7} />
      <path d={`M-100,-46 Q0,${-64 + a} 100,-46`} stroke={C.blanco} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />
      {a > 2 ? <ellipse cx={0} cy={-10} rx={70} ry={18} fill={c.sombra} opacity={0.4} /> : null}
    </g>
  );
};

/** Cama de lado (≈ w×300; x,y = base al centro): cabecera de madera a la izquierda, colchón y cobija. Sin persona. */
export const Cama: React.FC<{ x: number; y: number; s?: number; w?: number; cobija?: string; almohada?: boolean; flip?: boolean }> = ({
  x,
  y,
  s = 1,
  w = 700,
  cobija = "#4A6FC2",
  almohada = true,
  flip,
}) => {
  const madera = dosTonos(P.madera);
  const cb = dosTonos(cobija);
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={4} rx={w / 2 + 40} ry={16} fill={SOMBRA} />
      <rect x={-w / 2 - 30} y={-330} width={50} height={330} rx={14} fill={madera.base} />
      <rect x={-w / 2 - 30} y={-330} width={16} height={330} rx={8} fill={madera.luz} opacity={0.5} />
      <rect x={w / 2 - 20} y={-170} width={40} height={170} rx={12} fill={madera.sombra} />
      <rect x={-w / 2} y={-150} width={w} height={60} rx={10} fill={madera.sombra} />
      <rect x={-w / 2} y={-200} width={w} height={60} rx={18} fill={C.crema} />
      {almohada ? <Almohada x={-w / 2 + 120} y={-232} s={0.7} /> : null}
      <path d={`M${-w / 2 + 220},-210 Q${-w / 2 + 240},-236 ${-w / 2 + 280},-236 L${w / 2 - 6},-236 Q${w / 2 + 10},-236 ${w / 2 + 10},-200 L${w / 2 + 10},-110 L${-w / 2 + 220},-110 Z`} fill={cb.base} />
      <path d={`M${-w / 2 + 220},-150 L${w / 2 + 10},-150 L${w / 2 + 10},-110 L${-w / 2 + 220},-110 Z`} fill={cb.sombra} />
      <rect x={-w / 2 + 230} y={-228} width={w - 260} height={10} rx={5} fill={cb.luz} opacity={0.6} />
    </g>
  );
};

/** Lápiz amarillo con goma y punta (≈ 300×36; x,y = punta). rot en grados (0 = apunta a la izquierda). */
export const Lapiz: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0,0 L50,-16 L50,16 Z" fill="#F2D2A4" />
    <path d="M0,0 L16,-5 L16,5 Z" fill={C.navy} />
    <rect x={50} y={-16} width={220} height={32} fill={C.amarillo} />
    <rect x={50} y={-16} width={220} height={10} fill="#FFE08A" />
    <rect x={50} y={6} width={220} height={10} fill="#E3A92A" />
    <rect x={270} y={-17} width={26} height={34} fill={C.gris} />
    <rect x={296} y={-16} width={30} height={32} rx={8} fill="#F28C9B" />
  </g>
);

/**
 * Archivador metálico de 3 cajones (≈ 360×620; x,y = base). abre 0..1 = el cajón de arriba sale hacia la cámara;
 * dentro = lo que asoma del cajón (origen en el centro del borde de arriba del cajón abierto; p. ej. una revista).
 */
export const Archivador: React.FC<{ x: number; y: number; s?: number; abre?: number; color?: string; dentro?: React.ReactNode; etiquetas?: string[] }> = ({
  x,
  y,
  s = 1,
  abre = 0,
  color = "#8D97A8",
  dentro,
  etiquetas,
}) => {
  const c = dosTonos(color);
  const a = lim(abre, 0, 1);
  const cajon = (k: number, sale: number) => {
    const cy = -600 + k * 196;
    return (
      <g key={k} transform={`translate(0,${sale * 40}) scale(${1 + sale * 0.12})`}>
        {sale > 0.01 ? <rect x={-150} y={cy - 30 * sale} width={300} height={40 * sale + 10} fill={c.sombra} /> : null}
        <rect x={-160} y={cy} width={320} height={180} rx={10} fill={c.base} />
        <rect x={-160} y={cy} width={320} height={12} rx={6} fill={c.luz} opacity={0.6} />
        <rect x={-60} y={cy + 40} width={120} height={44} rx={6} fill={C.crema} stroke={c.sombra} strokeWidth={4} />
        {etiquetas?.[k] ? (
          <text x={0} y={cy + 72} fontFamily={fontFamily} fontWeight={900} fontSize={24} fill={C.navy} textAnchor="middle">
            {etiquetas[k]}
          </text>
        ) : null}
        <rect x={-50} y={cy + 110} width={100} height={22} rx={11} fill={c.sombra} />
        {sale > 0.01 && dentro ? <g transform={`translate(0,${cy - 4})`}>{dentro}</g> : null}
      </g>
    );
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={10} cy={4} rx={200} ry={16} fill={SOMBRA} />
      <rect x={-180} y={-620} width={360} height={620} rx={14} fill={c.sombra} />
      {cajon(2, 0)}
      {cajon(1, 0)}
      {cajon(0, a)}
    </g>
  );
};

/**
 * Pantalla de computador moderna (monitor con pie). x,y = centro de la pantalla; sw×sh = área de la pantalla
 * (900×540 por defecto); children en coordenadas 0..sw × 0..sh. barra = barra de navegador arriba (pestaña y URL vacía).
 */
export const PantallaPC: React.FC<{ x: number; y: number; s?: number; sw?: number; sh?: number; barra?: boolean; fondo?: string; children?: React.ReactNode; id?: string }> = ({
  x,
  y,
  s = 1,
  sw = 900,
  sh = 540,
  barra = true,
  fondo = C.blanco,
  children,
  id = "pc",
}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-sw / 2 - 20} y={-sh / 2 - 20} width={sw + 40} height={sh + 40} rx={24} fill={SOMBRA} transform="translate(10,14)" />
    <path d={`M-60,${sh / 2 + 20} L-90,${sh / 2 + 140} L90,${sh / 2 + 140} L60,${sh / 2 + 20} Z`} fill={C.gris2} />
    <rect x={-160} y={sh / 2 + 130} width={320} height={22} rx={11} fill={C.gris} />
    <rect x={-sw / 2 - 24} y={-sh / 2 - 24} width={sw + 48} height={sh + 48} rx={24} fill={C.negro} />
    <defs>
      <clipPath id={`${id}-pant`}>
        <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} rx={8} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id}-pant)`}>
      <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} fill={fondo} />
      <g transform={`translate(${-sw / 2},${-sh / 2 + (barra ? 60 : 0)})`}>{children}</g>
      {barra ? (
        <g transform={`translate(${-sw / 2},${-sh / 2})`}>
          <rect width={sw} height={60} fill="#DDE2EC" />
          <rect x={16} y={12} width={180} height={48} rx={10} fill={C.blanco} />
          <rect x={220} y={16} width={sw - 240} height={32} rx={16} fill={C.blanco} />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={sw - 90 + k * 26} cy={30} r={8} fill={C.gris} />
          ))}
        </g>
      ) : null}
      <path d={`M${-sw / 2},${-sh / 2} L${-sw / 2 + sw * 0.35},${-sh / 2} L${-sw / 2 + sw * 0.1},${sh / 2} L${-sw / 2},${sh / 2} Z`} fill={C.blanco} opacity={0.06} />
    </g>
  </g>
);

/**
 * Libro grueso de tapa dura (≈ 420×540 cerrado; x,y = centro). titulo en la tapa (size ≤ 60, dorado), subtitulo chico.
 * abre 0..1 = la tapa gira hacia la izquierda y se ven las hojas (1 = abierto). color de la tapa.
 */
export const LibroGrueso: React.FC<{ x: number; y: number; s?: number; rot?: number; titulo?: string; subtitulo?: string; abre?: number; color?: string }> = ({
  x,
  y,
  s = 1,
  rot = 0,
  titulo = "RECORDS",
  subtitulo,
  abre = 0,
  color = "#1F5BA8",
}) => {
  const c = dosTonos(color);
  const a = lim(abre, 0, 1);
  const sizeT = Math.min(60, 320 / Math.max(1, titulo.length * 0.7));
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-200} y={-250} width={420} height={540} rx={16} fill={SOMBRA} />
      {/* hojas (canto) */}
      <rect x={-200} y={-262} width={400} height={530} rx={8} fill={C.crema} />
      {Array.from({ length: 8 }, (_, k) => (
        <line key={k} x1={-190} y1={262 - k * 4} x2={196} y2={262 - k * 4} stroke="#E2D6B8" strokeWidth={1.5} />
      ))}
      {a > 0.02 ? (
        <g>
          <rect x={-196} y={-256} width={392} height={512} rx={6} fill={C.blanco} />
          {Array.from({ length: 12 }, (_, k) => (
            <rect key={k} x={-160} y={-210 + k * 38} width={k % 3 === 2 ? 200 : 320} height={12} rx={6} fill={C.hielo} />
          ))}
        </g>
      ) : null}
      {/* tapa: gira sobre el lomo izquierdo */}
      <g transform={`translate(-200,0) scale(${1 - a * 2},1) translate(200,0)`}>
        <rect x={-210} y={-270} width={420} height={540} rx={14} fill={a > 0.5 ? c.sombra : c.base} />
        {a <= 0.5 ? (
          <g>
            <rect x={-210} y={-270} width={44} height={540} rx={12} fill={c.sombra} />
            <rect x={-150} y={-210} width={320} height={420} rx={10} fill="none" stroke={P.oro} strokeWidth={6} />
            <T x={10} y={-40} size={sizeT} fill={P.oro}>
              {titulo}
            </T>
            {subtitulo ? (
              <T x={10} y={30} size={38} fill={P.oro}>
                {subtitulo}
              </T>
            ) : null}
            <path d="M-40,120 L10,80 L60,120 L40,170 L-20,170 Z" fill={P.oro} opacity={0.85} />
            <rect x={-200} y={-262} width={22} height={524} rx={8} fill={c.luz} opacity={0.35} />
          </g>
        ) : null}
      </g>
    </g>
  );
};

/** Escarapela de premio con cintas (≈ 260×420; x,y = centro del círculo). texto ≤ 9 letras (size ≤ 46). */
export const Escarapela: React.FC<{ x: number; y: number; f: number; s?: number; texto?: string; color?: string; rot?: number }> = ({
  x,
  y,
  f,
  s = 1,
  texto = "1ST PLACE",
  color = "#2C63B8",
  rot = 0,
}) => {
  const c = dosTonos(color);
  const size = Math.min(46, 190 / Math.max(1, texto.length * 0.7));
  const palabras = texto.split(" ");
  return (
    <g transform={`translate(${x},${y}) rotate(${rot + Math.sin(f / 20) * 3}) scale(${s})`}>
      {[-1, 1].map((d) => (
        <path key={d} d={`M${d * 20},60 L${d * 80},300 L${d * 46},270 L${d * 20},310 L${d * -6},70 Z`} fill={d < 0 ? c.base : c.sombra} />
      ))}
      {Array.from({ length: 24 }, (_, k) => (
        <circle key={k} cx={Math.cos((k / 24) * Math.PI * 2) * 112} cy={Math.sin((k / 24) * Math.PI * 2) * 112} r={26} fill={k % 2 ? c.base : c.luz} />
      ))}
      <circle r={100} fill={c.sombra} />
      <circle r={86} fill={C.crema} />
      <circle r={86} fill="none" stroke={P.oro} strokeWidth={8} />
      {palabras.map((pw, k) => (
        <T key={k} x={0} y={(k - (palabras.length - 1) / 2) * (size + 4) + size * 0.36} size={size} fill={C.navy}>
          {pw}
        </T>
      ))}
    </g>
  );
};

/** Casco de fútbol americano de lado, sin logo (≈ 320×280; x,y = centro). Con rejilla, franja y brillo; mira a la derecha. */
export const CascoFutbol: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string; franja?: string; flip?: boolean }> = ({
  x,
  y,
  s = 1,
  rot = 0,
  color = "#C8372D",
  franja = C.blanco,
  flip,
}) => {
  const c = dosTonos(color);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${flip ? -s : s},${s})`}>
      <path d="M-140,40 Q-160,-120 0,-130 Q130,-128 140,-20 L120,40 Q60,30 40,80 L-100,90 Q-140,80 -140,40 Z" fill={c.base} />
      <path d="M-140,40 Q-150,-40 -110,-90 Q-120,0 -90,70 L-100,90 Q-140,80 -140,40 Z" fill={c.sombra} opacity={0.6} />
      <path d="M-40,-128 Q60,-130 110,-60" stroke={franja} strokeWidth={22} fill="none" />
      <path d="M-70,-110 Q-20,-118 20,-112" stroke={C.blanco} strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.45} />
      <circle cx={-10} cy={20} r={26} fill={c.sombra} />
      <circle cx={-10} cy={20} r={12} fill={C.negro} />
      {/* rejilla */}
      <g stroke={C.gris} strokeWidth={12} fill="none" strokeLinecap="round">
        <path d="M110,-10 Q190,0 190,60 Q186,100 130,110" />
        <path d="M120,40 L188,44" />
        <path d="M150,-4 L150,104" />
      </g>
    </g>
  );
};

/**
 * Cuadro enmarcado colgado (marco de madera o dorado), con lo que quieras dentro (children en 0..w × 0..h). x,y = centro.
 * gris 0..1 = lo de dentro pierde el color (foto vieja o triste). brillo 0..1 = el cuadro resplandece como portada.
 * id = único por cuadro (filtro y recorte).
 */
export const Cuadro: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  f: number;
  id: string;
  s?: number;
  rot?: number;
  marco?: string;
  fondo?: string;
  gris?: number;
  brillo?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, f, id, s = 1, rot = 0, marco = P.oro, fondo = C.cielo, gris = 0, brillo = 0, children }) => {
  const m = dosTonos(marco);
  const g = lim(gris, 0, 1);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {brillo > 0.01 ? (
        <g opacity={brillo}>
          {Array.from({ length: 12 }, (_, k) => (
            <rect key={k} x={-10} y={-(Math.max(w, h) / 2 + 160)} width={20} height={110} rx={10} fill={C.amarillo} transform={`rotate(${k * 30 + f * 0.6})`} />
          ))}
          <rect x={-w / 2 - 50} y={-h / 2 - 50} width={w + 100} height={h + 100} rx={30} fill={C.amarillo} opacity={0.25} />
        </g>
      ) : null}
      <defs>
        <filter id={`${id}-gris`}>
          <feColorMatrix type="saturate" values={String(1 - g)} />
        </filter>
        <clipPath id={`${id}-rec`}>
          <rect x={0} y={0} width={w} height={h} />
        </clipPath>
      </defs>
      <rect x={-w / 2 - 34} y={-h / 2 - 34} width={w + 68} height={h + 68} rx={10} fill={SOMBRA} transform="translate(10,14)" />
      <rect x={-w / 2 - 34} y={-h / 2 - 34} width={w + 68} height={h + 68} rx={10} fill={m.base} />
      <rect x={-w / 2 - 34} y={-h / 2 - 34} width={w + 68} height={12} rx={6} fill={m.luz} />
      <rect x={-w / 2 - 34} y={h / 2 + 22} width={w + 68} height={12} rx={6} fill={m.sombra} />
      <rect x={-w / 2 - 6} y={-h / 2 - 6} width={w + 12} height={h + 12} fill={m.sombra} />
      <g transform={`translate(${-w / 2},${-h / 2})`} clipPath={`url(#${id}-rec)`}>
        <g filter={g > 0.01 ? `url(#${id}-gris)` : undefined}>
          <rect width={w} height={h} fill={fondo} />
          {children}
        </g>
        {g > 0.01 ? <rect width={w} height={h} fill={C.navy} opacity={g * 0.18} /> : null}
        <path d={`M0,0 L${w * 0.4},0 L${w * 0.1},${h} L0,${h} Z`} fill={C.blanco} opacity={0.08} />
      </g>
    </g>
  );
};

/** Ancho de un texto en una pieza de este archivo (atajo de anchoT con margen). */
export const anchoRotulo = (texto: string, size: number) => anchoT(texto, size) + size;
