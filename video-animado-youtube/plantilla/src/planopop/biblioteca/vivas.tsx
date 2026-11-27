// Biblioteca Plano Pop · piezas vivas al nivel de la referencia: incendio, explosión con onda y escombros,
// multitud, mano que entra con un objeto, relámpago y olas. Todas se mueven solas (nunca quedan quietas).
import React from "react";
import { Easing, interpolate, interpolateColors, random, spring } from "remotion";
import { C, FPS_INF, H, W, fijo } from "../kit";
import { PB } from "./paleta";
import { PersonaViva, Expresion, Peinado } from "./personaViva";
import { aclarar, dosTonos, oscurecer } from "./volumen";

const llama = (cx: number, b: number, h: number, sway: number) =>
  `M${cx - b / 2},0 C${cx - b / 2},${-h * 0.42} ${cx + sway - b * 0.12},${-h * 0.62} ${cx + sway},${-h} C${cx + sway + b * 0.12},${-h * 0.62} ${cx + b / 2},${-h * 0.42} ${cx + b / 2},0 Z`;

/**
 * Incendio: fuego libre y grande. Llamas en capas de 3 tonos (rojo, naranja, amarillo) con núcleo claro que
 * ondulan, lenguas que se sueltan y suben, brasas y humo de dos tonos que se dispersa hacia arriba.
 * x,y = centro de la base; w = ancho; alto = alto de las llamas (por defecto 480 px, casi media pantalla);
 * intensidad 0..1 (anímala para que prenda). sobre = "casa" | "bosque": silueta quemada que arde detrás.
 */
export const Incendio: React.FC<{
  x: number;
  y: number;
  f: number;
  w?: number;
  alto?: number;
  intensidad?: number;
  humo?: boolean;
  brasas?: number;
  semilla?: string;
  sobre?: "casa" | "bosque";
}> = ({ x, y, f, w = 800, alto = 480, intensidad = 1, humo = true, brasas = 34, semilla = "inc", sobre }) => {
  if (intensidad <= 0.001) return null;
  const H0 = alto * Math.min(1, intensidad);
  // capas de atrás hacia adelante: [color, nº de llamas, alto relativo, ancho relativo, velocidad]
  const capas: [string, number, number, number, number][] = [
    [C.rojo, 6, 1, 0.3, 1],
    [C.naranja, 6, 0.8, 0.26, 1.2],
    [C.amarillo, 5, 0.56, 0.22, 1.45],
    [C.crema, 3, 0.3, 0.18, 1.7],
  ];
  const quemado = "#2A1E2E";
  return (
    <g transform={`translate(${x},${y})`}>
      {/* resplandor */}
      <ellipse
        cx={0}
        cy={-H0 * 0.35}
        rx={w * 0.85}
        ry={H0 * 0.75}
        fill={C.naranja}
        opacity={(0.16 + 0.05 * Math.sin(f / 3)) * intensidad}
      />
      <ellipse
        cx={0}
        cy={6}
        rx={w * 0.7}
        ry={w * 0.08}
        fill={C.amarillo}
        opacity={(0.3 + 0.1 * Math.sin(f / 2.5)) * intensidad}
      />
      {/* humo que sube y se abre */}
      {humo
        ? Array.from({ length: 12 }, (_, k) => {
            const vida = 90;
            const t = ((f + k * (vida / 12) + random(`${semilla}hs${k}`) * 12) % vida) / vida;
            const hx = (random(`${semilla}hx${k}`) - 0.5) * w * 0.5 * (1 + t * 1.6) + Math.sin(f / 22 + k) * 24;
            const hy = -H0 * 0.8 - t * H0 * 1.6;
            const r = (60 + t * 170) * (0.6 + 0.4 * intensidad);
            const o = Math.min(1, t * 5) * (1 - t) * 0.8;
            return (
              <g key={`h${k}`} opacity={o}>
                <circle cx={hx + r * 0.12} cy={hy + r * 0.14} r={r} fill="#4A4E5E" />
                <circle cx={hx} cy={hy} r={r * 0.9} fill="#6E7384" />
                <circle cx={hx - r * 0.3} cy={hy - r * 0.3} r={r * 0.4} fill="#8B90A0" />
              </g>
            );
          })
        : null}
      {/* lo que arde */}
      {sobre === "casa" ? (
        <g fill={quemado}>
          <rect x={-w * 0.32} y={-H0 * 0.42} width={w * 0.64} height={H0 * 0.42} />
          <path d={`M${-w * 0.38},${-H0 * 0.42} L0,${-H0 * 0.72} L${w * 0.38},${-H0 * 0.42} Z`} />
          <rect
            x={-w * 0.2}
            y={-H0 * 0.3}
            width={w * 0.1}
            height={H0 * 0.12}
            fill={C.amarillo}
            opacity={0.6 + 0.4 * Math.sin(f / 2)}
          />
          <rect
            x={w * 0.1}
            y={-H0 * 0.3}
            width={w * 0.1}
            height={H0 * 0.12}
            fill={C.amarillo}
            opacity={0.6 + 0.4 * Math.sin(f / 2 + 1)}
          />
        </g>
      ) : sobre === "bosque" ? (
        <g fill={quemado}>
          {Array.from({ length: 7 }, (_, k) => {
            const tx = (k / 6 - 0.5) * w * 0.9;
            const th = H0 * (0.45 + random(`${semilla}t${k}`) * 0.3);
            return <path key={k} d={`M${tx - th * 0.22},0 L${tx},${-th} L${tx + th * 0.22},0 Z`} />;
          })}
        </g>
      ) : null}
      {/* llamas */}
      {capas.map(([color, n, hRel, bRel, v], ci) =>
        Array.from({ length: n }, (_, k) => {
          const cx = ((k + 0.5) / n - 0.5) * w * (0.9 - ci * 0.12);
          const centro = 1 - Math.min(1, Math.abs(cx) / (w * 0.55));
          const ond = 0.82 + 0.18 * Math.sin((f * v) / 2.4 + k * 1.9 + ci) + 0.08 * Math.sin((f * v) / 1.2 + k * 3.1);
          const h = H0 * hRel * (0.5 + 0.5 * centro) * ond;
          const sway = Math.sin((f * v) / 4 + k * 2.2 + ci) * w * 0.04;
          return <path key={`${ci}-${k}`} d={llama(cx, w * bRel, h, sway)} fill={color} />;
        }),
      )}
      {/* lenguas sueltas que suben y se apagan */}
      {Array.from({ length: 8 }, (_, k) => {
        const vida = 22 + random(`${semilla}lv${k}`) * 14;
        const t = ((f + random(`${semilla}ls${k}`) * vida) % vida) / vida;
        const lx = (random(`${semilla}lx${k}`) - 0.5) * w * 0.6 + Math.sin(f / 5 + k) * 10;
        const ly = -H0 * (0.55 + t * 0.6);
        const e = (1 - t) * (0.6 + random(`${semilla}le${k}`) * 0.5);
        return (
          <g key={`l${k}`} transform={`translate(${lx},${ly}) scale(${e})`}>
            <path d={llama(0, w * 0.08, H0 * 0.22, Math.sin(f / 3 + k) * 8)} fill={k % 2 ? C.naranja : C.amarillo} />
          </g>
        );
      })}
      {/* brasas */}
      {Array.from({ length: brasas }, (_, k) => {
        const vida = 40 + random(`${semilla}bv${k}`) * 30;
        const t = ((f + random(`${semilla}bs${k}`) * vida) % vida) / vida;
        const bx = (random(`${semilla}bx${k}`) - 0.5) * w * 0.9 + Math.sin(f / 6 + k) * 22 * t;
        const by = -H0 * 0.4 - t * H0 * 1.4;
        return (
          <circle
            key={`b${k}`}
            cx={bx}
            cy={by}
            r={(6 - t * 3.5) * (0.7 + random(`${semilla}br${k}`))}
            fill={k % 3 ? C.amarillo : C.naranja}
            opacity={(1 - t) * Math.min(1, intensidad)}
          />
        );
      })}
    </g>
  );
};

/**
 * Explosión completa desde el fotograma `desde`: destello blanco, onda expansiva, bola de fuego de manchas en
 * 4 colores con núcleo que se vacía, escombros con gravedad y humo que queda. Se anima «a doses» (cada 2
 * fotogramas), como dibujo a mano. Dura ~80 fotogramas. r = radio de la bola de fuego.
 */
export const Explosion2: React.FC<{
  x: number;
  y: number;
  f: number;
  desde?: number;
  r?: number;
  escombros?: number;
  semilla?: string;
  suelo?: boolean;
}> = ({ x, y, f, desde = 0, r = 260, escombros = 16, semilla = "ex2", suelo = false }) => {
  const t0 = f - desde;
  if (t0 < 0 || t0 > 110) return null;
  const t = Math.floor(t0 / 2) * 2;
  const flash = interpolate(t, [0, 6], [1, 0], fijo);
  const onda = interpolate(t, [0, 26], [0, 1], { ...fijo, easing: Easing.out(Easing.cubic) });
  const crece = spring({ frame: t, fps: FPS_INF, config: { damping: 9, stiffness: 140, mass: 0.8 } });
  const enfria = interpolate(t, [22, 60], [0, 1], fijo);
  const sube = interpolate(t, [18, 100], [0, r * 1.3], fijo);
  const fuego = interpolate(t, [60, 100], [1, 0], fijo);
  const colores = [C.rojo, C.naranja, C.amarillo];
  const humo = "#6E7282";
  return (
    <g transform={`translate(${x},${y})`}>
      {/* onda expansiva */}
      {onda < 1 ? (
        <g opacity={1 - onda}>
          <ellipse
            rx={r * (0.4 + onda * 3.4)}
            ry={r * (0.4 + onda * 3.4) * (suelo ? 0.3 : 1)}
            fill="none"
            stroke={C.crema}
            strokeWidth={46 * (1 - onda) + 4}
          />
          <ellipse
            rx={r * (0.3 + onda * 2.6)}
            ry={r * (0.3 + onda * 2.6) * (suelo ? 0.3 : 1)}
            fill="none"
            stroke={C.blanco}
            strokeWidth={14 * (1 - onda)}
          />
        </g>
      ) : null}
      {/* humo que queda */}
      {Array.from({ length: 8 }, (_, k) => {
        const a = (k / 8) * Math.PI * 2 + 0.3;
        const p = interpolate(t, [16, 100], [0, 1], fijo);
        if (p <= 0) return null;
        const hx = Math.cos(a) * r * (0.5 + p * 0.7);
        const hy = Math.sin(a) * r * 0.5 * (0.5 + p * 0.5) - sube - p * r * 0.4;
        const rr = r * (0.35 + p * 0.35);
        return (
          <g key={`s${k}`} opacity={(1 - p) * 0.9}>
            <circle cx={hx} cy={hy} r={rr} fill={oscurecer(humo, 0.2)} />
            <circle cx={hx - rr * 0.2} cy={hy - rr * 0.22} r={rr * 0.8} fill={humo} />
          </g>
        );
      })}
      {/* bola de fuego: manchas en capas */}
      {fuego > 0
        ? colores.map((c, ci) =>
            Array.from({ length: 7 - ci }, (_, k) => {
              const a = (k / (7 - ci)) * Math.PI * 2 + ci * 0.6 + random(`${semilla}a${ci}${k}`) * 0.4;
              const dist = r * (0.55 - ci * 0.17) * crece;
              const rr =
                r * (0.5 - ci * 0.1) * crece * (0.85 + random(`${semilla}r${ci}${k}`) * 0.3) * (1 + 0.05 * Math.sin(t + k));
              const col = interpolateColors(enfria, [0, 1], [c, ci === 0 ? humo : aclarar(humo, 0.2 * ci)]);
              return (
                <circle
                  key={`${ci}-${k}`}
                  cx={Math.cos(a) * dist}
                  cy={Math.sin(a) * dist * 0.85 - sube * (0.6 + ci * 0.2)}
                  r={rr}
                  fill={col}
                  opacity={fuego}
                />
              );
            }),
          )
        : null}
      {/* núcleo blanco que se vacía */}
      {t < 30 ? (
        <g>
          <circle cy={-sube * 0.8} r={r * 0.42 * crece * (1 - t / 30)} fill={C.crema} />
          <circle cy={-sube * 0.8} r={r * 0.25 * crece * (1 - t / 30)} fill={C.blanco} />
        </g>
      ) : null}
      {/* escombros */}
      {Array.from({ length: escombros }, (_, k) => {
        const a =
          -Math.PI * (0.05 + random(`${semilla}ea${k}`) * 0.9) - (suelo ? 0 : random(`${semilla}eb${k}`) > 0.5 ? Math.PI : 0);
        const v = 9 + random(`${semilla}ev${k}`) * 12;
        const ex = Math.cos(a) * v * t;
        const ey = Math.sin(a) * v * t + 0.35 * t * t;
        const tam = 10 + random(`${semilla}et${k}`) * 18;
        const o = interpolate(t, [0, 3, 50, 70], [0, 1, 1, 0], fijo);
        return (
          <g key={`e${k}`} transform={`translate(${ex},${ey}) rotate(${t * (8 + k)})`} opacity={o}>
            <path
              d={`M${-tam},${-tam * 0.4} L${tam * 0.3},${-tam} L${tam},${tam * 0.2} L${-tam * 0.2},${tam * 0.8} Z`}
              fill={C.navy2}
            />
            <path d={`M${tam * 0.3},${-tam} L${tam},${tam * 0.2} L${tam * 0.2},${tam * 0.1} Z`} fill={C.gris2} />
          </g>
        );
      })}
      {/* destello inicial */}
      {flash > 0 ? <circle r={r * (1 + (1 - flash) * 1.4)} fill={C.blanco} opacity={flash} /> : null}
    </g>
  );
};

const ABRIGOS = [C.teal2, C.rojo, C.morado, C.naranja, "#3E86E0", "#3FAF7E", C.amarillo, C.gris2, "#C04BD8"];
const PELOS = ["#6B3F2E", "#2B1E1A", "#C98A3A", "#8A5A44", "#3A2A4A", "#B8B8C0"];
const PIELES = [C.piel, "#E9A27F", "#C98A6A", "#8E5B43", "#F4C7A8"];
const PEINADOS: Peinado[] = ["corto", "largo", "gorro", "calvo", "corto"];

/**
 * Multitud de N personas variadas (PersonaViva: ropa, piel, pelo y peinado distintos) en filas: las de atrás más
 * chicas y un poco más oscuras. Parpadean, respiran y algunas hablan. x,y = pies de la fila delantera (centro);
 * w = ancho. expresion = la misma para todas (o variada si no se da). reaccion = fotograma en que todas celebran.
 */
export const Multitud: React.FC<{
  x: number;
  y: number;
  f: number;
  n?: number;
  w?: number;
  filas?: number;
  s?: number;
  expresion?: Expresion;
  reaccion?: number;
  semilla?: string;
}> = ({ x, y, f, n = 12, w = 1500, filas = 3, s = 0.55, expresion, reaccion, semilla = "mu" }) => {
  const porFila = Math.ceil(n / filas);
  const gente = Array.from({ length: n }, (_, k) => {
    const fila = Math.floor(k / porFila);
    const col = k % porFila;
    const prof = filas - 1 - fila; // 0 = delante
    const esc = s * (1 - prof * 0.16);
    const px = x - w / 2 + ((col + 0.5 + (prof % 2) * 0.5) / porFila) * w + (random(`${semilla}j${k}`) - 0.5) * 40;
    const py = y - prof * 120 * s;
    return { k, prof, esc, px, py };
  }).sort((a, b) => b.prof - a.prof);
  const exprs: Expresion[] = ["normal", "feliz", "duda", "normal", "susto", "feliz"];
  return (
    <g>
      {gente.map(({ k, prof, esc, px, py }) => {
        const r = (sem: string) => random(`${semilla}${sem}${k}`);
        const abrigo = oscurecer(ABRIGOS[Math.floor(r("a") * ABRIGOS.length)], prof * 0.12);
        const salta = reaccion !== undefined && f >= reaccion ? Math.abs(Math.sin((f - reaccion) / 4 + k)) * 18 * esc : 0;
        return (
          <PersonaViva
            key={k}
            x={px}
            y={py - salta}
            f={f}
            s={esc}
            flip={r("f") > 0.5}
            abrigo={abrigo}
            piel={PIELES[Math.floor(r("p") * PIELES.length)]}
            pelo={PELOS[Math.floor(r("h") * PELOS.length)]}
            peinado={PEINADOS[Math.floor(r("q") * PEINADOS.length)]}
            expresion={
              reaccion !== undefined && f >= reaccion ? "feliz" : (expresion ?? exprs[Math.floor(r("e") * exprs.length)])
            }
            habla={r("b") > 0.65}
            gesto={reaccion !== undefined ? "celebra" : "ninguno"}
            gestoDesde={(reaccion ?? 0) + Math.floor(r("g") * 6)}
            lentes={r("l") > 0.75}
            barba={r("ba") > 0.85}
            fase={k * 3.7}
          />
        );
      })}
    </g>
  );
};

/**
 * La mano de traje que entra con un objeto (libro, carpeta, sobre, lupa…), como el recurso que la referencia usa
 * para presentar cada «problema». Entra deslizándose desde `desde`, flota y sale en `hasta`.
 * (x, y) = dónde queda la mano. angulo = hacia dónde apunta el brazo (0 = entra desde la izquierda; −90 = desde
 * abajo; 180 = desde la derecha). children = el objeto, con origen en la mano y SIN rotar (p. ej. una <Lupa>).
 */
export const ManoSostiene: React.FC<{
  x: number;
  y: number;
  f: number;
  desde?: number;
  hasta?: number;
  angulo?: number;
  s?: number;
  manga?: string;
  puno?: string;
  piel?: string;
  children?: React.ReactNode;
}> = ({ x, y, f, desde = 0, hasta, angulo = -25, s = 1, manga = "#4A5470", puno = C.blanco, piel = C.piel, children }) => {
  const entra = interpolate(f, [desde, desde + 12], [1, 0], { ...fijo, easing: Easing.out(Easing.back(1.3)) });
  const sale =
    hasta === undefined ? 0 : interpolate(f, [hasta, hasta + 10], [0, 1], { ...fijo, easing: Easing.in(Easing.cubic) });
  const fuera = Math.max(entra, sale);
  if (f < desde || fuera >= 0.999) return null;
  const rad = (angulo * Math.PI) / 180;
  const dist = 1300 * fuera;
  const fl = Math.sin((f - desde) / 12) * 6;
  const hx = x - Math.cos(rad) * dist;
  const hy = y - Math.sin(rad) * dist + fl;
  const m = dosTonos(manga);
  const p = dosTonos(piel, 0.7);
  const giro = angulo + Math.sin((f - desde) / 16) * 2;
  return (
    <g transform={`translate(${hx},${hy}) scale(${s})`}>
      <g transform={`rotate(${giro})`}>
        <rect x={-1700} y={-62} width={1640} height={124} fill={m.base} />
        <rect x={-1700} y={14} width={1640} height={48} fill={m.sombra} />
        <rect x={-1700} y={-62} width={1640} height={14} fill={m.luz} opacity={0.6} />
        <rect x={-78} y={-58} width={36} height={116} rx={8} fill={puno} />
        <ellipse cx={4} cy={4} rx={66} ry={56} fill={p.sombra} />
        <ellipse cx={0} cy={0} rx={64} ry={54} fill={p.base} />
      </g>
      {children ? <g>{children}</g> : null}
      <g transform={`rotate(${giro})`}>
        {[-34, -8, 18, 42].map((fy, k) => (
          <g key={k}>
            <rect x={28} y={fy - 13} width={58 - Math.abs(k - 1.5) * 6} height={26} rx={13} fill={p.base} />
            <rect x={34} y={fy + 3} width={46 - Math.abs(k - 1.5) * 6} height={8} rx={4} fill={p.sombra} opacity={0.6} />
          </g>
        ))}
        <rect x={-12} y={-66} width={74} height={28} rx={14} fill={p.luz} transform="rotate(-24 -12 -52)" />
      </g>
    </g>
  );
};

/**
 * Relámpago en zigzag con ramas, trazo grueso (14 px por defecto) con resplandor difuso y destello del cielo:
 * golpea, se apaga, vuelve a golpear (~18 fotogramas) y el cielo queda iluminado un momento más.
 * x = punto de arriba; baja de y1 a y2. flash = destello del cielo (degradado desde arriba + toda la pantalla).
 */
export const Relampago: React.FC<{
  x: number;
  y1: number;
  y2: number;
  f: number;
  desde?: number;
  color?: string;
  ancho?: number;
  semilla?: string;
  flash?: boolean;
  deriva?: number;
}> = ({ x, y1, y2, f, desde = 0, color = "#FFF6B8", ancho = 14, semilla = "ray", flash = true, deriva = 160 }) => {
  const t = f - desde;
  const patron = [1, 1, 0.85, 0.3, 0, 0, 1, 0.95, 0.7, 0.35, 0.15, 0, 0, 0.75, 0.5, 0.25, 0.1, 0];
  const cielo = [1, 0.9, 0.8, 0.55, 0.35, 0.3, 0.95, 0.9, 0.75, 0.6, 0.45, 0.32, 0.25, 0.6, 0.45, 0.3, 0.2, 0.12, 0.06];
  if (t < 0 || t >= cielo.length) return null;
  const o = t < patron.length ? patron[t] : 0;
  const oc = cielo[t];
  const n = 11;
  const pts: [number, number][] = [[x, y1]];
  let px = x;
  for (let k = 1; k <= n; k++) {
    px += (random(`${semilla}${k}`) - 0.5) * 130 + deriva / n;
    pts.push([px, y1 + ((y2 - y1) * k) / n]);
  }
  const rama = (desdeK: number, lado: number, sem: string) => {
    const [bx, by] = pts[desdeK];
    const r: [number, number][] = [[bx, by]];
    let rx = bx;
    let ry = by;
    for (let k = 0; k < 4; k++) {
      rx += lado * (34 + random(`${sem}x${k}`) * 56);
      ry += 44 + random(`${sem}y${k}`) * 44;
      r.push([rx, ry]);
    }
    return r;
  };
  const ramas = [rama(3, 1, `${semilla}r1`), rama(6, -1, `${semilla}r2`), rama(8, 1, `${semilla}r3`)];
  const txt = (p: [number, number][]) => p.map(([a, b]) => `${a.toFixed(0)},${b.toFixed(0)}`).join(" ");
  const id = `ray-${semilla}`;
  return (
    <g>
      <defs>
        <filter id={`${id}-glow`} x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation={ancho * 1.4} />
        </filter>
        <linearGradient id={`${id}-cielo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.85} />
          <stop offset="60%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {flash ? (
        <g opacity={oc}>
          <rect width={W} height={H} fill={`url(#${id}-cielo)`} opacity={0.55} />
          <rect width={W} height={H} fill={C.blanco} opacity={0.18 * o} />
        </g>
      ) : null}
      {o > 0 ? (
        <g opacity={o}>
          {[pts, ...ramas].map((p, k) => {
            const g = k ? ancho * 0.6 : ancho;
            return (
              <g key={k}>
                <polyline
                  points={txt(p)}
                  fill="none"
                  stroke={color}
                  strokeWidth={g * 3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={`url(#${id}-glow)`}
                />
                <polyline
                  points={txt(p)}
                  fill="none"
                  stroke={color}
                  strokeWidth={g * 2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={0.35}
                />
                <polyline
                  points={txt(p)}
                  fill="none"
                  stroke={color}
                  strokeWidth={g}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <polyline
                  points={txt(p)}
                  fill="none"
                  stroke={C.blanco}
                  strokeWidth={g * 0.45}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
          <circle
            cx={pts[pts.length - 1][0]}
            cy={pts[pts.length - 1][1]}
            r={ancho * 4}
            fill={color}
            opacity={0.5}
            filter={`url(#${id}-glow)`}
          />
        </g>
      ) : null}
    </g>
  );
};

/**
 * Olas en capas (de atrás hacia adelante, cada una más rápida y más clara) con cresta de espuma y brillos.
 * y = nivel del agua; altura = amplitud; agua = color de la capa del fondo. Llena hasta abajo del cuadro.
 */
export const Olas: React.FC<{
  f: number;
  y?: number;
  altura?: number;
  agua?: string;
  vel?: number;
  capas?: number;
  espuma?: boolean;
}> = ({ f, y = 700, altura = 34, agua = PB.agua2, vel = 1, capas = 3, espuma = true }) => (
  <g>
    {Array.from({ length: capas }, (_, i) => {
      const yi = y + i * 70;
      const A = altura * (1 + i * 0.35);
      const lam = 460 - i * 70;
      const v = (1 + i * 0.7) * vel;
      const col = aclarar(agua, i * 0.13);
      const pts: string[] = [];
      for (let px = -40; px <= W + 40; px += 24) {
        const yy =
          yi +
          A * Math.sin((px / lam) * Math.PI * 2 + f * 0.06 * v + i) +
          A * 0.3 * Math.sin((px / (lam * 0.43)) * Math.PI * 2 - f * 0.09 * v);
        pts.push(`${px},${yy.toFixed(1)}`);
      }
      const linea = pts.join(" L");
      return (
        <g key={i}>
          <path d={`M${linea} L${W + 40},${H + 10} L-40,${H + 10} Z`} fill={col} />
          <path
            d={`M${linea} L${W + 40},${H + 10} L-40,${H + 10} Z`}
            fill={oscurecer(col, 0.25)}
            transform="translate(0,26)"
            opacity={0.35}
          />
          {espuma ? (
            <path
              d={`M${linea}`}
              fill="none"
              stroke={C.blanco}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray="40 26"
              strokeDashoffset={-f * 2 * v}
              opacity={0.75}
            />
          ) : null}
          {Array.from({ length: 6 }, (_, k) => {
            const bx = ((random(`ol${i}${k}`) * W + f * 1.5 * v) % W) - 0;
            const vis = Math.sin(f / 5 + k * 2 + i) > 0.6;
            return vis ? (
              <path
                key={k}
                d={`M${bx - 14},${yi + 40 + k * 8} L${bx + 14},${yi + 40 + k * 8}`}
                stroke={C.blanco}
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.5}
              />
            ) : null;
          })}
        </g>
      );
    })}
  </g>
);
