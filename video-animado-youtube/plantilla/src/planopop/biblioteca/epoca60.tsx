// Biblioteca Plano Pop · años 60 (EE. UU.): sala con papel tapiz atómico, pasillo en perspectiva, restaurante de
// mostrador (diner), casa de un piso con palmera, auto de aletas, edificio blanco institucional (hospital, base, oficina)
// con insignia de ancla opcional y cabina de radio con locutor en silueta. Nuevas en V11; genéricas, sin marcas.
// Los escenarios (Sala60, Pasillo60, Diner60) se dibujan en 0..w × 0..h y llenan esa caja: ponlos primero dentro del
// RigCamara con w,h = el tamaño del escenario (o 1920×1080 en un Lienzo). luz 0..1 = penumbra → luz.
import React from "react";
import { random } from "remotion";
import { C, T } from "../kit";
import { PB as P, lim } from "./paleta";
import { dosTonos, mezclaColor } from "./volumen";

const SOMBRA = "rgba(18,12,46,0.3)";

/** Transform que encaja un dibujo de 1920×1080 en w×h (escala uniforme que cubre, centrado); lo usan Sala60, Pasillo60 y Diner60. */
export const cubreCaja = (w: number, h: number) => {
  const k = Math.max(w / 1920, h / 1080);
  return `translate(${(w - 1920 * k) / 2},${(h - 1080 * k) / 2}) scale(${k})`;
};

/** Ancla (insignia de marina), ≈ 100×120 a s=1, x,y = centro. */
export const Ancla: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = P.oro }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={0} cy={-48} r={12} strokeWidth={9} />
    <path d="M0,-36 L0,54" strokeWidth={12} />
    <path d="M-30,-18 L30,-18" strokeWidth={10} />
    <path d="M-48,18 Q-44,56 0,58 Q44,56 48,18" strokeWidth={11} />
    <path d="M-58,26 L-48,10 L-36,26 M36,26 L48,10 L58,26" strokeWidth={9} />
  </g>
);

const PalmeraSil: React.FC<{ x: number; y: number; s?: number; f: number; color?: string; tronco?: string }> = ({ x, y, s = 1, f, color = "#2F8C63", tronco = "#8A6240" }) => {
  const hojas = dosTonos(color);
  const sway = Math.sin(f / 30) * 3;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-14,0 Q-30,-200 10,-420 L30,-418 Q-6,-200 14,0 Z" fill={tronco} />
      {[-380, -320, -260, -200, -140, -80].map((yy) => (
        <path key={yy} d={`M${-12 + (yy + 420) * -0.02},${yy} q16,-10 30,0`} stroke={mezclaColor(tronco, C.negro, 0.3)} strokeWidth={4} fill="none" />
      ))}
      <g transform={`translate(20,-420) rotate(${sway})`}>
        {[-160, -120, -70, -20, 30, 80, 130, 170].map((a, k) => (
          <g key={k} transform={`rotate(${a})`}>
            <path d="M0,0 Q90,-40 200,30 Q100,-10 0,12 Z" fill={k % 2 ? hojas.base : hojas.sombra} />
          </g>
        ))}
        <circle cx={0} cy={6} r={14} fill="#6B4A2E" />
      </g>
    </g>
  );
};

/**
 * Sala de los 60 de lado: papel tapiz con estrellitas atómicas, friso de madera, ventana con persiana y palmera afuera,
 * rayo de sol en el piso, sofá de patas finas, lámpara de pie, cuadro abstracto, alfombra. Llena w×h (por defecto
 * 1920×1080). luz 0..1 (0 = penumbra con solo la lámpara); noche = ventana oscura con luna. tapiz = color del papel.
 * Piso en y ≈ 0,8·h. Huecos libres para personajes: x 600–1150 y la mesa a la derecha.
 */
export const Sala60: React.FC<{ f: number; w?: number; h?: number; luz?: number; noche?: boolean; tapiz?: string; sofa?: string }> = ({
  f,
  w = 1920,
  h = 1080,
  luz = 1,
  noche = false,
  tapiz = "#F0D49C",
  sofa = "#2FA99A",
}) => {
  const tp = dosTonos(tapiz);
  const madera = dosTonos(P.madera);
  const sf = dosTonos(sofa);
  const piso = 860;
  return (
    <g>
      <rect x={-200} y={-200} width={w + 400} height={h + 400} fill={tp.base} />
      <g transform={cubreCaja(w, h)}>
        <rect x={-400} y={-200} width={2720} height={piso + 200} fill={tp.base} />
        {/* estrellitas atómicas */}
        {Array.from({ length: 14 * 7 }, (_, k) => {
          const cx = -200 + (k % 14) * 170 + (Math.floor(k / 14) % 2) * 85;
          const cy = 40 + Math.floor(k / 14) * 100;
          if (cy > 600) return null;
          return (
            <g key={k} transform={`translate(${cx},${cy}) rotate(${(k * 23) % 45})`} stroke={tp.sombra} strokeWidth={4} strokeLinecap="round" opacity={0.55}>
              <path d="M-14,0 L14,0 M0,-14 L0,14 M-9,-9 L9,9 M-9,9 L9,-9" />
            </g>
          );
        })}
        {/* friso */}
        <rect x={-400} y={620} width={2720} height={240} fill={madera.base} />
        {Array.from({ length: 30 }, (_, k) => (
          <rect key={k} x={-400 + k * 96} y={620} width={6} height={240} fill={madera.sombra} />
        ))}
        <rect x={-400} y={612} width={2720} height={16} fill={madera.luz} />
        {/* piso */}
        <rect x={-400} y={piso} width={2720} height={500} fill="#9C6B43" />
        {Array.from({ length: 6 }, (_, k) => (
          <rect key={k} x={-400} y={piso + 30 + k * 44} width={2720} height={4} fill="#7E5230" opacity={0.6} />
        ))}
        <rect x={-400} y={piso - 18} width={2720} height={22} fill={madera.sombra} />
        {/* ventana */}
        <g transform="translate(1240,140)">
          <rect x={-16} y={-16} width={492} height={432} rx={8} fill={C.blanco} />
          <rect width={460} height={400} fill={noche ? C.navy2 : C.cielo} />
          {noche ? (
            <g>
              <circle cx={360} cy={90} r={40} fill={C.crema} />
              {Array.from({ length: 10 }, (_, k) => (
                <circle key={k} cx={random(`sv${k}`) * 440 + 10} cy={random(`sy${k}`) * 200 + 10} r={2.5} fill={C.blanco} opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 10 + k))} />
              ))}
            </g>
          ) : (
            <g>
              <rect y={300} width={460} height={100} fill="#9ED7A0" />
              <circle cx={380} cy={70} r={46} fill="#FFE8A0" />
            </g>
          )}
          <PalmeraSil x={130} y={400} s={0.75} f={f} color={noche ? "#1E3A4A" : "#2F8C63"} tronco={noche ? "#26203F" : "#8A6240"} />
          {/* persiana */}
          {Array.from({ length: 7 }, (_, k) => (
            <rect key={k} x={0} y={k * 22} width={460} height={14} fill="#F4EBD5" />
          ))}
          <rect x={0} y={150} width={460} height={10} fill={C.gris} />
          <rect x={222} y={0} width={16} height={400} fill={C.blanco} />
          <rect x={0} y={192} width={460} height={14} fill={C.blanco} />
        </g>
        {/* rayo de sol en el piso */}
        {!noche ? <path d="M1240,540 L1700,540 L1500,1080 L700,1080 Z" fill="#FFF3C4" opacity={0.18 * luz} /> : null}
        {/* cuadro abstracto */}
        <g transform="translate(330,210)">
          <rect x={-6} y={-6} width={312} height={212} fill={madera.sombra} />
          <rect width={300} height={200} fill={C.crema} />
          <circle cx={90} cy={100} r={56} fill={C.naranja} />
          <rect x={150} y={40} width={110} height={110} fill={C.teal2} transform="rotate(12 205 95)" />
          <path d="M20,180 L280,30" stroke={C.navy} strokeWidth={8} />
        </g>
        {/* sofá */}
        <g transform={`translate(480,${piso})`}>
          <ellipse cx={0} cy={6} rx={360} ry={22} fill={SOMBRA} />
          {[-300, 300].map((px) => (
            <path key={px} d={`M${px - 8},-60 L${px + (px < 0 ? -20 : 20)},0`} stroke={C.negro} strokeWidth={10} strokeLinecap="round" />
          ))}
          <rect x={-340} y={-300} width={680} height={170} rx={40} fill={sf.sombra} />
          <rect x={-330} y={-292} width={660} height={130} rx={36} fill={sf.base} />
          <rect x={-360} y={-170} width={720} height={110} rx={30} fill={sf.base} />
          <rect x={-360} y={-170} width={720} height={26} rx={13} fill={sf.luz} opacity={0.6} />
          <rect x={-360} y={-100} width={720} height={40} rx={20} fill={sf.sombra} />
          <rect x={-4} y={-292} width={8} height={130} fill={sf.sombra} />
          {[-390, 390].map((px) => (
            <rect key={px} x={px - 34} y={-220} width={68} height={160} rx={30} fill={sf.sombra} />
          ))}
        </g>
        {/* lámpara de pie atómica */}
        <g transform={`translate(980,${piso})`}>
          <ellipse cx={0} cy={4} rx={70} ry={12} fill={SOMBRA} />
          <path d="M-50,0 L0,-30 L50,0" stroke={C.negro} strokeWidth={8} fill="none" />
          <rect x={-5} y={-520} width={10} height={500} fill={C.negro} />
          <path d="M-120,-470 L120,-470 L320,0 L-320,0 Z" fill="#FFF0B0" opacity={0.1 + 0.12 * (1 - luz)} />
          <path d="M-70,-470 L70,-470 L40,-560 L-40,-560 Z" fill={C.amarillo} />
          <path d="M20,-470 L70,-470 L40,-560 L10,-560 Z" fill="#E3A92A" />
          <ellipse cx={0} cy={-470} rx={70} ry={10} fill="#FFF6D6" />
        </g>
        {/* alfombra */}
        <ellipse cx={900} cy={piso + 110} rx={620} ry={70} fill="#C2453A" opacity={0.85} />
        <ellipse cx={900} cy={piso + 110} rx={560} ry={52} fill="none" stroke={C.crema} strokeWidth={6} strokeDasharray="20 14" opacity={0.6} />
      </g>
      {luz < 0.99 ? <rect x={-200} y={-200} width={w + 400} height={h + 400} fill={C.negro} opacity={(1 - luz) * 0.55} /> : null}
    </g>
  );
};

/** Punto de fuga del Pasillo60 en su dibujo de 1920×1080 (para alinear cosas encima). */
export const PASILLO_VP = { x: 960, y: 470, fondo: { x0: 780, x1: 1140, y0: 320, y1: 620 } };

/**
 * Pasillo de casa de los 60 en perspectiva de un punto: papel a rayas en las paredes, puertas a los lados, alfombra
 * corrida, lámpara de techo y ventana al fondo. Llena w×h (por defecto 1920×1080). luz 0..1. paredes 0..1 = opacidad de
 * paredes, techo y puertas (para fundirlo con otra cosa, p. ej. un bosque que aparece donde estaba el pasillo).
 */
export const Pasillo60: React.FC<{ f: number; w?: number; h?: number; luz?: number; paredes?: number; tapiz?: string }> = ({
  f,
  w = 1920,
  h = 1080,
  luz = 1,
  paredes = 1,
  tapiz = "#E7C98E",
}) => {
  const { x0, x1, y0, y1 } = PASILLO_VP.fondo;
  const tp = dosTonos(tapiz);
  const puerta = dosTonos("#B07A48");
  const quadPuerta = (lado: -1 | 1, t0: number, t1: number) => {
    const xA = lado < 0 ? x0 * t0 : 1920 - (1920 - x1) * t0;
    const xB = lado < 0 ? x0 * t1 : 1920 - (1920 - x1) * t1;
    const top = (t: number) => 180 + (y0 + 40 - 180) * t;
    const bot = (t: number) => 1080 + (y1 - 1080) * t;
    return `M${xA},${top(t0)} L${xB},${top(t1)} L${xB},${bot(t1)} L${xA},${bot(t0)} Z`;
  };
  return (
    <g>
      <rect x={-200} y={-200} width={w + 400} height={h + 400} fill={tp.sombra} />
      <g transform={cubreCaja(w, h)}>
        <g opacity={paredes}>
          {/* techo */}
          <path d={`M-300,-200 L2220,-200 L${x1},${y0} L${x0},${y0} Z`} fill={C.crema} />
          {/* paredes con rayas */}
          <path d={`M-300,-200 L${x0},${y0} L${x0},${y1} L-300,1300 Z`} fill={tp.base} />
          <path d={`M2220,-200 L${x1},${y0} L${x1},${y1} L2220,1300 Z`} fill={tp.sombra} />
          {Array.from({ length: 12 }, (_, k) => {
            const t = k / 12;
            const xl = -300 + (x0 + 300) * Math.pow(t, 0.7);
            const xr = 2220 - (2220 - x1) * Math.pow(t, 0.7);
            const yt = (xx: number, izq: boolean) => (izq ? -200 + ((y0 + 200) * (xx + 300)) / (x0 + 300) : -200 + ((y0 + 200) * (2220 - xx)) / (2220 - x1));
            const yb = (xx: number, izq: boolean) => (izq ? 1300 - ((1300 - y1) * (xx + 300)) / (x0 + 300) : 1300 - ((1300 - y1) * (2220 - xx)) / (2220 - x1));
            return (
              <g key={k} stroke={tp.sombra} strokeWidth={10 * (1 - t) + 2} opacity={0.5}>
                <line x1={xl} y1={yt(xl, true)} x2={xl} y2={yb(xl, true)} />
                <line x1={xr} y1={yt(xr, false)} x2={xr} y2={yb(xr, false)} stroke={mezclaColor(tp.sombra, C.negro, 0.2)} />
              </g>
            );
          })}
          {/* zócalo */}
          <path d={`M-300,1240 L${x0},${y1 - 8} L${x0},${y1} L-300,1300 Z`} fill={P.madera2} />
          <path d={`M2220,1240 L${x1},${y1 - 8} L${x1},${y1} L2220,1300 Z`} fill={P.madera2} />
          {/* puertas */}
          {[
            [-1, 0.12, 0.38],
            [1, 0.3, 0.52],
            [-1, 0.6, 0.74],
          ].map(([lado, t0, t1], k) => (
            <g key={k}>
              <path d={quadPuerta(lado as -1 | 1, t0, t1)} fill={k % 2 ? puerta.sombra : puerta.base} />
              <path d={quadPuerta(lado as -1 | 1, t0 + 0.015, t1 - 0.015)} fill="none" stroke={puerta.luz} strokeWidth={6 * (1 - t0)} opacity={0.6} />
            </g>
          ))}
          {/* pared del fondo con ventana */}
          <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={tp.luz} />
          <rect x={x0 + 110} y={y0 + 50} width={140} height={150} fill={luz > 0.5 ? C.cielo : C.navy2} />
          <rect x={x0 + 176} y={y0 + 50} width={8} height={150} fill={C.blanco} />
          <rect x={x0 + 110} y={y0 + 120} width={140} height={8} fill={C.blanco} />
          <rect x={x0 + 104} y={y0 + 44} width={152} height={162} fill="none" stroke={C.blanco} strokeWidth={8} />
          {/* lámpara de techo */}
          <g transform="translate(960,150)">
            <rect x={-4} y={-150} width={8} height={70} fill={C.gris2} />
            <path d="M-80,-80 L80,-80 L50,-10 L-50,-10 Z" fill={C.amarillo} />
            <ellipse cx={0} cy={-10} rx={50} ry={10} fill="#FFF6D6" />
            <path d="M-50,-10 L50,-10 L260,700 L-260,700 Z" fill="#FFF3C4" opacity={0.1 * luz} />
          </g>
        </g>
        {/* piso y alfombra (no se funden con paredes: los cubre otro piso si hace falta) */}
        <path d={`M-300,1300 L2220,1300 L${x1},${y1} L${x0},${y1} Z`} fill="#9C6B43" opacity={Math.max(paredes, 0.001)} />
        <path d={`M560,1300 L1360,1300 L${960 + 70},${y1} L${960 - 70},${y1} Z`} fill="#B23A35" opacity={paredes} />
        <path d={`M620,1300 L1300,1300 L${960 + 56},${y1} L${960 - 56},${y1} Z`} fill="none" stroke={P.oro} strokeWidth={6} opacity={0.6 * paredes} />
      </g>
      {luz < 0.99 ? <rect x={-200} y={-200} width={w + 400} height={h + 400} fill={C.negro} opacity={(1 - luz) * 0.55} /> : null}
    </g>
  );
};

/**
 * Restaurante de mostrador (diner) de los 60: pared de azulejos, pizarra de menú con dibujos (sin textos), vitrina de
 * pasteles, tazas, mostrador con borde cromado, taburetes rojos y piso de cuadros. Llena w×h. Mostrador en y ≈ 700–860;
 * personajes sentados: pies en y ≈ 1000, x 400–1500.
 */
export const Diner60: React.FC<{ f: number; w?: number; h?: number; luz?: number }> = ({ f, w = 1920, h = 1080, luz = 1 }) => {
  const rojo = dosTonos("#D8443A");
  return (
    <g>
      <rect x={-200} y={-200} width={w + 400} height={h + 400} fill="#BFE6DE" />
      <g transform={cubreCaja(w, h)}>
        <rect x={-400} y={-200} width={2720} height={1000} fill="#BFE6DE" />
        {Array.from({ length: 40 * 6 }, (_, k) => {
          const cx = -400 + (k % 40) * 70;
          const cy = 380 + Math.floor(k / 40) * 70;
          return <rect key={k} x={cx + 3} y={cy + 3} width={64} height={64} fill={(k + Math.floor(k / 40)) % 2 ? "#D6F0EA" : "#A9DCD1"} />;
        })}
        <rect x={-400} y={360} width={2720} height={20} fill="#E8EEF5" />
        {/* pizarra con dibujos */}
        <g transform="translate(260,80)">
          <rect x={-10} y={-10} width={620} height={260} rx={10} fill={P.madera2} />
          <rect width={600} height={240} rx={6} fill="#24323A" />
          <g stroke={C.crema} strokeWidth={6} fill="none" strokeLinecap="round">
            <path d="M60,150 Q100,80 140,150 Z" />
            <path d="M200,110 L260,110 L250,170 L210,170 Z M260,125 Q285,135 255,155" />
            <circle cx={360} cy={140} r={36} />
            <path d="M450,170 L470,90 L490,170 M455,140 L485,140" />
          </g>
          {[60, 200, 360, 470].map((px) => (
            <rect key={px} x={px - 30} y={196} width={60} height={10} rx={5} fill={C.amarillo} opacity={0.7} />
          ))}
        </g>
        {/* vitrina de pasteles y tazas */}
        <g transform="translate(1260,180)">
          <rect width={420} height={170} rx={12} fill={C.blanco} opacity={0.5} stroke={C.gris} strokeWidth={6} />
          {[70, 210, 350].map((px, k) => (
            <g key={px}>
              <path d={`M${px - 50},130 L${px + 50},130 L${px + 50},100 L${px},70 L${px - 50},100 Z`} fill={k === 1 ? "#E9C46A" : "#F28C9B"} />
              <rect x={px - 50} y={124} width={100} height={8} fill={C.crema} />
            </g>
          ))}
        </g>
        {[1300, 1380, 1460, 1540, 1620].map((px) => (
          <g key={px}>
            <rect x={px - 24} y={390} width={48} height={40} rx={8} fill={C.blanco} />
            <path d={`M${px + 24},400 q18,8 0,22`} stroke={C.blanco} strokeWidth={7} fill="none" />
          </g>
        ))}
        {/* lámparas colgantes */}
        {[300, 960, 1620].map((px) => (
          <g key={px}>
            <rect x={px - 3} y={-200} width={6} height={260} fill={C.gris2} />
            <path d={`M${px - 70},120 Q${px},10 ${px + 70},120 Z`} fill={rojo.base} />
            <ellipse cx={px} cy={120} rx={70} ry={12} fill="#FFF3C4" />
            <path d={`M${px - 70},120 L${px + 70},120 L${px + 220},700 L${px - 220},700 Z`} fill="#FFF3C4" opacity={0.12 * luz} />
          </g>
        ))}
        {/* mostrador */}
        <rect x={-400} y={690} width={2720} height={40} rx={8} fill="#E8EEF5" />
        <rect x={-400} y={690} width={2720} height={10} fill={C.blanco} />
        <rect x={-400} y={730} width={2720} height={150} fill={rojo.base} />
        {Array.from({ length: 30 }, (_, k) => (
          <rect key={k} x={-400 + k * 96} y={730} width={10} height={150} fill={rojo.sombra} />
        ))}
        <rect x={-400} y={870} width={2720} height={14} fill={C.gris} />
        {/* piso de cuadros */}
        <rect x={-400} y={884} width={2720} height={400} fill={C.blanco} />
        {Array.from({ length: 34 * 4 }, (_, k) => {
          const fila = Math.floor(k / 34);
          const col = k % 34;
          if ((col + fila) % 2) return null;
          const tam = 60 + fila * 18;
          const y0 = 884 + [0, 60, 138, 234][fila];
          return <rect key={k} x={-400 + col * 84 - fila * 12} y={y0} width={84} height={tam} fill={C.navy} />;
        })}
        {/* taburetes */}
        {[260, 620, 980, 1340, 1700].map((px) => (
          <g key={px}>
            <ellipse cx={px} cy={1000} rx={60} ry={12} fill={SOMBRA} />
            <rect x={px - 8} y={810} width={16} height={190} fill={C.gris} />
            <rect x={px - 40} y={985} width={80} height={14} rx={7} fill={C.gris2} />
            <ellipse cx={px} cy={804} rx={72} ry={22} fill={rojo.sombra} />
            <ellipse cx={px} cy={794} rx={72} ry={20} fill={rojo.base} />
            <ellipse cx={px - 20} cy={788} rx={30} ry={6} fill={C.blanco} opacity={0.35} />
          </g>
        ))}
      </g>
      {luz < 0.99 ? <rect x={-200} y={-200} width={w + 400} height={h + 400} fill={C.negro} opacity={(1 - luz) * 0.55} /> : null}
    </g>
  );
};

/**
 * Casa de un piso del sur de California en los 60 (≈ 1300×560; x,y = base al centro): techo bajo a dos aguas, estuco,
 * ventanal, puerta con alero, garaje, chimenea, arbustos, entrada de concreto y palmera a la derecha.
 * luz 0..1 = ventanas encendidas (noche). palmera = mostrarla. color del estuco.
 */
export const CasaSuburbana: React.FC<{ x: number; y: number; f: number; s?: number; luz?: number; palmera?: boolean; color?: string; flip?: boolean }> = ({
  x,
  y,
  f,
  s = 1,
  luz = 0,
  palmera = true,
  color = "#F3E3C3",
  flip,
}) => {
  const m = dosTonos(color);
  const techo = dosTonos("#8C5A4A");
  const vent = luz > 0.3 ? "#FFE08A" : C.cielo;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={6} rx={720} ry={26} fill={SOMBRA} />
      {/* entrada de concreto */}
      <path d="M220,0 L560,0 L640,60 L180,60 Z" fill="#CFCAC0" />
      {/* chimenea */}
      <rect x={-420} y={-470} width={80} height={200} fill="#B4664F" />
      <rect x={-430} y={-484} width={100} height={22} fill="#8C4A3A" />
      {/* muros */}
      <rect x={-600} y={-300} width={1200} height={300} fill={m.base} />
      <rect x={300} y={-300} width={300} height={300} fill={m.sombra} />
      <rect x={-600} y={-40} width={1200} height={40} fill={m.sombra} opacity={0.6} />
      {/* techo */}
      <path d="M-660,-290 L-120,-430 L420,-290 Z" fill={techo.base} />
      <path d="M-120,-430 L420,-290 L380,-290 L-120,-412 Z" fill={techo.sombra} />
      <path d="M260,-300 L660,-300 L600,-360 L300,-360 Z" fill={techo.base} />
      <rect x={-680} y={-300} width={1360} height={24} rx={6} fill={techo.sombra} />
      {/* ventanal */}
      <rect x={-520} y={-230} width={380} height={160} fill={vent} />
      {luz > 0.01 ? <rect x={-520} y={-230} width={380} height={160} fill="#FFC93C" opacity={luz * 0.4} /> : null}
      {[-393, -267].map((px) => (
        <rect key={px} x={px - 4} y={-230} width={8} height={160} fill={C.blanco} />
      ))}
      <rect x={-530} y={-240} width={400} height={180} fill="none" stroke={C.blanco} strokeWidth={10} />
      <path d="M-500,-220 L-440,-220 L-500,-140 Z" fill={C.blanco} opacity={0.35} />
      {/* puerta */}
      <rect x={-60} y={-220} width={110} height={220} fill="#3E86E0" />
      <rect x={-50} y={-206} width={90} height={60} fill={vent} opacity={0.8} />
      <circle cx={30} cy={-100} r={7} fill={P.oro} />
      <path d="M-90,-232 L80,-232 L60,-262 L-70,-262 Z" fill={techo.sombra} />
      {/* garaje */}
      <rect x={330} y={-240} width={240} height={240} fill={C.blanco} />
      {Array.from({ length: 5 }, (_, k) => (
        <rect key={k} x={330} y={-240 + k * 48} width={240} height={6} fill={C.gris} />
      ))}
      {/* arbustos */}
      {[-560, -440, -320, -180, 120, 240].map((px, k) => (
        <g key={px}>
          <ellipse cx={px} cy={-24} rx={70} ry={50} fill={k % 2 ? P.pasto2 : P.pasto} />
          <ellipse cx={px - 18} cy={-44} rx={30} ry={16} fill="#6FD29E" opacity={0.6} />
        </g>
      ))}
      {palmera ? <PalmeraSil x={720} y={0} s={1.25} f={f} /> : null}
    </g>
  );
};

/**
 * Auto sedán de fines de los 50 / 60 con aletas traseras y cromados (≈ 680×210; x,y = suelo al centro), mira a la
 * derecha. rueda = grados de giro de las ruedas (p. ej. f * 12 mientras avanza); techo = color del techo; luces 0..1.
 */
export const Auto60: React.FC<{ x: number; y: number; f: number; s?: number; color?: string; techo?: string; rueda?: number; luces?: number; flip?: boolean; humo?: boolean }> = ({
  x,
  y,
  f,
  s = 1,
  color = "#3E86E0",
  techo = C.blanco,
  rueda = 0,
  luces = 0,
  flip,
  humo,
}) => {
  const c = dosTonos(color);
  const bote = Math.sin(f / 3) * 1.5;
  const Rueda = ({ cx }: { cx: number }) => (
    <g transform={`translate(${cx},-52)`}>
      <circle r={52} fill={C.negro} />
      <circle r={30} fill={C.gris} />
      <g transform={`rotate(${rueda})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <rect key={a} x={-3} y={-28} width={6} height={22} fill={C.gris2} transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r={10} fill={C.blanco} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={4} rx={360} ry={16} fill={SOMBRA} />
      {humo ? (
        <g>
          {[0, 1, 2].map((k) => {
            const t = ((f + k * 10) % 30) / 30;
            return <circle key={k} cx={-360 - t * 120} cy={-50 - t * 30} r={14 + t * 26} fill={C.gris} opacity={0.5 * (1 - t)} />;
          })}
        </g>
      ) : null}
      <g transform={`translate(0,${bote})`}>
        {/* carrocería con aletas */}
        <path d="M-340,-60 L-340,-130 L-300,-150 L-200,-140 L-120,-148 L300,-140 Q350,-130 350,-90 L350,-60 Z" fill={c.base} />
        <path d="M-340,-130 L-300,-176 L-260,-146 Z" fill={c.base} />
        <path d="M-340,-60 L350,-60 L350,-96 L-340,-100 Z" fill={c.sombra} />
        {/* techo y vidrios */}
        <path d="M-180,-146 L-120,-226 L120,-226 L190,-146 Z" fill={techo} />
        <path d="M-160,-150 L-110,-214 L-10,-214 L-10,-150 Z" fill={C.cielo} />
        <path d="M10,-150 L10,-214 L110,-214 L166,-150 Z" fill={C.cielo} />
        <path d="M-130,-200 L-110,-214 L-70,-214 L-110,-160 Z" fill={C.blanco} opacity={0.5} />
        {/* cromados */}
        <rect x={-350} y={-74} width={40} height={20} rx={8} fill={C.gris} />
        <rect x={330} y={-74} width={36} height={20} rx={8} fill={C.gris} />
        <path d="M-300,-118 L300,-112" stroke={C.blanco} strokeWidth={6} opacity={0.8} />
        <rect x={20} y={-120} width={40} height={8} rx={4} fill={C.gris} />
        <circle cx={340} cy={-112} r={14} fill={luces > 0.5 ? C.amarillo : C.crema} />
        {luces > 0.01 ? <path d="M350,-112 L620,-170 L620,-50 Z" fill={C.amarillo} opacity={0.25 * luces} /> : null}
        <rect x={-346} y={-128} width={14} height={26} rx={4} fill={C.rojo} />
      </g>
      <Rueda cx={-210} />
      <Rueda cx={220} />
    </g>
  );
};

/**
 * Edificio blanco institucional (hospital, base, laboratorio u oficina) de dos pisos (≈ 1200×520; x,y = base al centro):
 * fila de ventanas, entrada con columnas y escalones, asta con banderín. insignia = "ancla" (marina) o "cruz" (azul,
 * no roja), cartel = texto sobre la entrada (size 40, ≤ 20 letras). luz 0..1 = ventanas encendidas.
 */
export const EdificioBlanco: React.FC<{ x: number; y: number; f: number; s?: number; insignia?: "ancla" | "cruz"; cartel?: string; luz?: number; color?: string }> = ({
  x,
  y,
  f,
  s = 1,
  insignia,
  cartel,
  luz = 0,
  color = "#F4F1EA",
}) => {
  const m = dosTonos(color);
  const vent = luz > 0.3 ? "#FFE08A" : "#9CC9E2";
  const sizeC = cartel ? Math.min(40, 360 / Math.max(1, cartel.length * 0.7)) : 40;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={8} rx={680} ry={24} fill={SOMBRA} />
      <rect x={-600} y={-440} width={1200} height={440} fill={m.base} />
      <rect x={-600} y={-440} width={1200} height={26} fill={m.luz} />
      <rect x={300} y={-440} width={300} height={440} fill={m.sombra} opacity={0.5} />
      <rect x={-620} y={-460} width={1240} height={30} rx={6} fill={C.gris} />
      {[-1, 1].map((d) =>
        Array.from({ length: 4 }, (_, k) =>
          [0, 1].map((fila) => (
            <g key={`${d}${k}${fila}`}>
              <rect x={d < 0 ? -560 + k * 100 : 180 + k * 100} y={-380 + fila * 170} width={70} height={100} fill={vent} />
              <rect x={d < 0 ? -560 + k * 100 : 180 + k * 100} y={-380 + fila * 170} width={70} height={100} fill="none" stroke={m.sombra} strokeWidth={6} />
              <rect x={(d < 0 ? -560 + k * 100 : 180 + k * 100) + 32} y={-380 + fila * 170} width={6} height={100} fill={m.sombra} />
            </g>
          )),
        ),
      )}
      {/* entrada */}
      <rect x={-160} y={-330} width={320} height={330} fill={m.sombra} opacity={0.35} />
      <path d="M-180,-330 L180,-330 L0,-410 Z" fill={m.base} stroke={m.sombra} strokeWidth={6} />
      {[-120, -40, 40, 120].map((px) => (
        <g key={px}>
          <rect x={px - 16} y={-320} width={32} height={290} fill={C.blanco} />
          <rect x={px + 4} y={-320} width={12} height={290} fill={m.sombra} opacity={0.5} />
        </g>
      ))}
      <rect x={-60} y={-200} width={120} height={170} fill="#3A5A8A" />
      <rect x={-2} y={-200} width={4} height={170} fill={C.gris} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={-190 + k * 14} y={-30 + k * 10} width={380 - k * 28} height={12} fill={C.gris} />
      ))}
      {insignia ? (
        <g transform="translate(0,-366)">
          <circle r={36} fill={C.navy} />
          {insignia === "ancla" ? <Ancla x={0} y={4} s={0.5} /> : <path d="M-8,-24 L8,-24 L8,-8 L24,-8 L24,8 L8,8 L8,24 L-8,24 L-8,8 L-24,8 L-24,-8 L-8,-8 Z" fill="#3E86E0" />}
        </g>
      ) : null}
      {cartel ? (
        <g transform="translate(0,-236)">
          <rect x={-200} y={-34} width={400} height={56} rx={8} fill={C.navy} />
          <T x={0} y={sizeC * 0.36 - 6} size={sizeC} fill={C.crema}>
            {cartel}
          </T>
        </g>
      ) : null}
      {/* asta con banderín */}
      <rect x={-700} y={-640} width={10} height={640} fill={C.gris2} />
      <path d={`M-690,-630 Q-620,${-620 + Math.sin(f / 6) * 10} -560,-600 Q-620,${-590 + Math.sin(f / 6 + 1) * 10} -690,-570 Z`} fill="#2C63B8" />
    </g>
  );
};

/**
 * Cabina de radio (≈ 940×700; x,y = base al centro): pared de paneles, letrero ON AIR que se enciende, ventanal con el
 * locutor en silueta con audífonos frente al micrófono, consola con perillas y vinilo. cartel = texto pegado en el vidrio
 * (size 80, ≤ 8 letras; p. ej. una cifra); cartelP 0..1 = entra con escala. aire 0..1 = el ON AIR encendido y latiendo.
 */
export const CabinaRadio: React.FC<{ x: number; y: number; f: number; s?: number; cartel?: string; cartelP?: number; aire?: number; habla?: boolean }> = ({
  x,
  y,
  f,
  s = 1,
  cartel,
  cartelP = 1,
  aire = 1,
  habla = true,
}) => {
  const panel = dosTonos("#5B4A8A");
  const late = 0.6 + 0.4 * Math.sin(f / 4);
  const cabeza = habla ? Math.sin(f / 5) * 3 : 0;
  const cp = lim(cartelP, 0, 1.2);
  const sizeC = cartel ? Math.min(80, 420 / Math.max(1, cartel.length * 0.7)) : 80;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={500} ry={20} fill={SOMBRA} />
      <rect x={-470} y={-700} width={940} height={700} rx={16} fill={panel.base} />
      {Array.from({ length: 8 }, (_, k) => (
        <rect key={k} x={-470 + k * 118} y={-700} width={6} height={700} fill={panel.sombra} />
      ))}
      {/* ON AIR */}
      <g transform="translate(0,-640)">
        <rect x={-130} y={-40} width={260} height={74} rx={14} fill={C.negro} />
        <rect x={-120} y={-32} width={240} height={58} rx={10} fill={aire > 0.5 ? C.rojo : "#5A2A2A"} opacity={aire > 0.5 ? late : 1} />
        <T x={0} y={12} size={40} fill={aire > 0.5 ? C.blanco : "#A07070"} ls={3}>
          ON AIR
        </T>
      </g>
      {/* ventanal */}
      <rect x={-380} y={-560} width={760} height={380} rx={14} fill={C.negro} />
      <rect x={-364} y={-544} width={728} height={348} rx={8} fill="#F6D28A" />
      <rect x={-364} y={-544} width={728} height={348} rx={8} fill="#E88B3A" opacity={0.35} />
      {/* locutor en silueta */}
      <g transform={`translate(-80,-196) rotate(${cabeza})`}>
        <path d="M-150,0 Q-140,-120 0,-130 Q140,-120 150,0 Z" fill={C.navy} />
        <circle cx={0} cy={-200} r={74} fill={C.navy} />
        <path d="M-84,-200 Q-84,-300 0,-300 Q84,-300 84,-200" stroke={C.negro} strokeWidth={16} fill="none" />
        <rect x={-100} y={-232} width={34} height={64} rx={14} fill={C.negro} />
        <rect x={66} y={-232} width={34} height={64} rx={14} fill={C.negro} />
      </g>
      {/* micrófono de brazo */}
      <path d="M300,-560 L200,-380 L110,-330" stroke={C.gris2} strokeWidth={10} fill="none" strokeLinecap="round" />
      <rect x={50} y={-370} width={70} height={100} rx={34} fill={C.gris} transform="rotate(-30 85 -320)" />
      {/* reflejo del vidrio */}
      <path d="M-340,-544 L-200,-544 L-300,-196 L-364,-196 L-364,-480 Z" fill={C.blanco} opacity={0.16} />
      {cartel && cp > 0.01 ? (
        <g transform={`translate(170,-450) rotate(-6) scale(${cp})`}>
          <rect x={-200} y={-66} width={400} height={120} rx={10} fill={C.blanco} />
          <rect x={-190} y={-60} width={20} height={12} fill={C.amarillo} opacity={0.8} />
          <rect x={170} y={-60} width={20} height={12} fill={C.amarillo} opacity={0.8} />
          <T x={0} y={sizeC * 0.36 - 4} size={sizeC} fill={C.rojo}>
            {cartel}
          </T>
        </g>
      ) : null}
      {/* consola */}
      <path d="M-470,-180 L470,-180 L470,0 L-470,0 Z" fill="#2A2350" />
      <rect x={-470} y={-180} width={940} height={14} fill="#4A3F7A" />
      {Array.from({ length: 10 }, (_, k) => (
        <g key={k}>
          <circle cx={-400 + k * 56} cy={-120} r={14} fill={k % 3 ? C.gris : C.amarillo} />
          <rect x={-404 + k * 56} y={-80} width={8} height={50} rx={4} fill={C.gris2} />
          <rect x={-412 + k * 56} y={-70 + Math.sin(f / 8 + k) * 14} width={24} height={12} rx={4} fill={C.crema} />
        </g>
      ))}
      <ellipse cx={330} cy={-100} rx={110} ry={34} fill={C.negro} />
      <ellipse cx={330} cy={-100} rx={30} ry={10} fill={C.rojo} />
    </g>
  );
};
