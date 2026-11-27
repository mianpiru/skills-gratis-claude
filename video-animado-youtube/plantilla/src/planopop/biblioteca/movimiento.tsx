// Biblioteca Plano Pop · movimiento: cámara viva, enfoque y transiciones.
// Regla de la referencia: ningún plano se queda quieto más de ~1 s. Todo capítulo nuevo usa
// `marco={CamaraViva}` en <Montaje>; los golpes llevan `sacudidaEn` y los cambios de tema una transición.
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame } from "remotion";
import { C, FPS_INF, H, W, fijo } from "../kit";

export type VarianteCamara = "push" | "deriva-izq" | "deriva-der" | "sacudida" | "quieta";
export type EntradaCamara = "auto" | "ninguna" | "barrido" | "iris" | "destello";

const VARIANTES: VarianteCamara[] = ["push", "deriva-izq", "push", "deriva-der"];
const ENTRADAS: Exclude<EntradaCamara, "auto">[] = ["ninguna", "barrido", "ninguna", "iris", "destello", "ninguna"];

/** Elige algo de una lista de forma determinista a partir de un número (p. ej. la duración de la escena). */
export const elegir = <X,>(lista: X[], semilla: string | number) =>
  lista[Math.floor(random(`cam-${semilla}`) * lista.length) % lista.length];

/** Sacudida que se apaga en `dura` fotogramas desde `en`: devuelve el corrimiento [dx, dy] en px. */
export const sacudida = (f: number, en: number | undefined, fuerza = 18, dura = 12): [number, number] => {
  if (en === undefined || f < en || f >= en + dura) return [0, 0];
  const t = f - en;
  const a = fuerza * (1 - t / dura);
  return [Math.sin(t * 2.7) * a, Math.cos(t * 3.3) * a * 0.7];
};

/**
 * Envoltorio de escena con cámara viva: push-in o deriva continua de 1,0 a `zoom` (1,12) en toda la escena,
 * más una entrada (barrido, iris o destello) en los primeros 8 fotogramas.
 * Sirve tal cual como `marco` de <Montaje>: sin `variante` ni `entrada`, las elige solas y de forma determinista
 * a partir de la duración de la escena (cada escena cambia de dirección). `sacudidaEn` = fotograma local del golpe.
 */
export const CamaraViva: React.FC<{
  dur: number;
  children: React.ReactNode;
  variante?: VarianteCamara;
  entrada?: EntradaCamara;
  zoom?: number;
  sacudidaEn?: number;
  fuerza?: number;
  semilla?: string | number;
  colorEntrada?: string;
}> = ({ dur, children, variante, entrada = "auto", zoom = 1.12, sacudidaEn, fuerza = 18, semilla, colorEntrada = C.blanco }) => {
  const f = useCurrentFrame();
  const sem = semilla ?? dur;
  const v = variante ?? elegir(VARIANTES, sem);
  const ent = entrada === "auto" ? elegir(ENTRADAS, `e${sem}`) : entrada;
  const t = interpolate(f, [0, Math.max(1, dur)], [0, 1], { ...fijo, easing: Easing.inOut(Easing.sin) });
  const golpe = v === "sacudida" ? (sacudidaEn ?? 0) : sacudidaEn;
  const [sx, sy] = sacudida(f, golpe, fuerza);
  const escala = v === "quieta" ? 1 : 1 + (zoom - 1) * t;
  const lado = v === "deriva-izq" ? -1 : v === "deriva-der" ? 1 : 0;
  const dx = lado * W * 0.035 * t;
  const dy = v === "push" ? -H * 0.01 * t : 0;
  // golpe de entrada: 1,06 → 1 en 9 fotogramas (como Marco del kit)
  const entra = interpolate(f, [0, 9], [1.06, 1], { ...fijo, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${dx + sx}px,${dy + sy}px) scale(${escala * entra})` }}>
        {children}
      </AbsoluteFill>
      {ent !== "ninguna" ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute" }}>
            {ent === "barrido" ? <Barrido f={f} desde={-4} dura={8} color={colorEntrada} /> : null}
            {ent === "iris" ? <Iris f={f} desde={0} dura={8} modo="abre" color={C.negro} /> : null}
            {ent === "destello" ? <DestelloCorte f={f} desde={0} dura={8} /> : null}
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/** Fábrica: CamaraViva con opciones fijas para pasarla como `marco` (p. ej. sin entradas). */
export const camaraViva =
  (
    opciones: Omit<React.ComponentProps<typeof CamaraViva>, "dur" | "children">,
  ): React.FC<{ dur: number; children: React.ReactNode }> =>
  ({ dur, children }) => (
    <CamaraViva dur={dur} {...opciones}>
      {children}
    </CamaraViva>
  );

/**
 * Acercamiento a un punto (x, y) de 1 a `zoom` (máx. 2,5) entre los fotogramas `desde` y `hasta`, llevando el
 * punto hacia el centro. Envoltorio HTML (va fuera del <Lienzo>); dentro de un SVG usa `transformEnfoque`.
 * `vuelve` = fotograma en que regresa a 1 (opcional).
 */
export const Enfoque: React.FC<{
  x: number;
  y: number;
  desde: number;
  hasta: number;
  zoom?: number;
  vuelve?: number;
  children: React.ReactNode;
}> = ({ x, y, desde, hasta, zoom = 2, vuelve, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ transform: transformEnfoque(f, x, y, desde, hasta, zoom, vuelve, "css") }}>{children}</AbsoluteFill>
  );
};

/** El transform del Enfoque: modo "svg" para un <g>, "css" para un div. */
export const transformEnfoque = (
  f: number,
  x: number,
  y: number,
  desde: number,
  hasta: number,
  zoom = 2,
  vuelve?: number,
  modo: "svg" | "css" = "svg",
) => {
  const z = Math.min(2.5, Math.max(1, zoom));
  let t = interpolate(f, [desde, Math.max(desde + 1, hasta)], [0, 1], { ...fijo, easing: Easing.inOut(Easing.cubic) });
  if (vuelve !== undefined)
    t *= 1 - interpolate(f, [vuelve, vuelve + (hasta - desde)], [0, 1], { ...fijo, easing: Easing.inOut(Easing.cubic) });
  const s = 1 + (z - 1) * t;
  // el punto (x, y) termina en el centro del cuadro
  const tx = (W / 2 - x) * t;
  const ty = (H / 2 - y) * t;
  return modo === "svg"
    ? `translate(${tx + x},${ty + y}) scale(${s}) translate(${-x},${-y})`
    : `translate(${tx + x - W / 2}px,${ty + y - H / 2}px) scale(${s}) translate(${W / 2 - x}px,${H / 2 - y}px)`;
};

// ---------------- transiciones (van dentro de un <Lienzo>/svg, encima de todo) ----------------

/**
 * Barrido: una franja inclinada con borde gris cruza la pantalla en `dura` fotogramas (6–10). A la mitad tapa todo:
 * pon el corte de escena en desde + dura/2. dir 1 = de izquierda a derecha, −1 al revés.
 */
export const Barrido: React.FC<{ f: number; desde: number; dura?: number; color?: string; borde?: string; dir?: 1 | -1 }> = ({
  f,
  desde,
  dura = 8,
  color = C.blanco,
  borde = C.gris,
  dir = 1,
}) => {
  const t = (f - desde) / dura;
  if (t <= 0 || t >= 1) return null;
  const e = Easing.inOut(Easing.cubic)(t);
  const ancho = W * 1.6;
  const x0 = interpolate(e, [0, 1], [-ancho - 300, W + 300]);
  const inc = 300;
  const p = (x: number, w: number) => `M${x + inc},0 L${x + w + inc},0 L${x + w},${H} L${x},${H} Z`;
  return (
    <g transform={dir === -1 ? `translate(${W},0) scale(-1,1)` : undefined}>
      <path d={p(x0 - 60, ancho + 120)} fill={borde} />
      <path d={p(x0, ancho)} fill={color} />
    </g>
  );
};

/**
 * Iris: círculo que se abre desde (x, y) mostrando la escena (modo "abre") o se cierra sobre el punto ("cierra").
 * dura 6–10 fotogramas. El resto de la pantalla queda en `color`.
 */
export const Iris: React.FC<{
  f: number;
  desde: number;
  dura?: number;
  x?: number;
  y?: number;
  modo?: "abre" | "cierra";
  color?: string;
  aro?: string;
}> = ({ f, desde, dura = 8, x = W / 2, y = H / 2, modo = "abre", color = C.negro, aro = C.blanco }) => {
  const t = (f - desde) / dura;
  if ((modo === "abre" && t >= 1) || (modo === "cierra" && t <= 0)) return null;
  const k = Math.max(0, Math.min(1, t));
  const e = Easing.inOut(Easing.cubic)(modo === "abre" ? k : 1 - k);
  const rMax = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 40;
  const r = Math.max(0.1, rMax * e);
  return (
    <g>
      <path
        d={`M-10,-10 H${W + 10} V${H + 10} H-10 Z M${x - r},${y} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0 Z`}
        fill={color}
        fillRule="evenodd"
      />
      <circle cx={x} cy={y} r={r} fill="none" stroke={aro} strokeWidth={14} opacity={0.9} />
    </g>
  );
};

/**
 * Destello de corte: flash blanco que nace en (x, y) con rayos, llena la pantalla y se desvanece (6–10 fotogramas).
 * Es la transición; el brillito de 4 puntas sigue siendo `Destello` (fenomenos.tsx).
 */
export const DestelloCorte: React.FC<{ f: number; desde: number; dura?: number; x?: number; y?: number; color?: string }> = ({
  f,
  desde,
  dura = 8,
  x = W / 2,
  y = H / 2,
  color = C.blanco,
}) => {
  const t = (f - desde) / dura;
  if (t < 0 || t >= 1) return null;
  const crece = Math.min(1, t * 2.2);
  const apaga = t < 0.45 ? 1 : 1 - (t - 0.45) / 0.55;
  return (
    <g opacity={apaga}>
      {Array.from({ length: 14 }, (_, k) => {
        const a = (k / 14) * Math.PI * 2 + 0.2;
        const l = 1400 * crece;
        return (
          <path
            key={k}
            d={`M${x},${y} L${x + Math.cos(a - 0.06) * l},${y + Math.sin(a - 0.06) * l} L${x + Math.cos(a + 0.06) * l},${y + Math.sin(a + 0.06) * l} Z`}
            fill={color}
            opacity={0.8}
          />
        );
      })}
      <circle cx={x} cy={y} r={1300 * crece * crece} fill={color} opacity={0.92} />
    </g>
  );
};

/** Las tres transiciones juntas, por si se prefiere `Transicion.Iris`. */
export const Transicion = { Barrido, Iris, Destello: DestelloCorte };

/** Rebote 0→1 con sobrepaso fuerte (para cosas que caen o golpean). */
export const rebote = (f: number, en: number, damping = 8) =>
  f < en ? 0 : spring({ frame: f - en, fps: FPS_INF, config: { damping, stiffness: 180, mass: 0.8 } });
