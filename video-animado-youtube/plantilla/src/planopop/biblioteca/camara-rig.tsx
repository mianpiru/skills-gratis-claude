// Biblioteca Plano Pop · cámara que cuenta (lección del 2026-11-24, sobre el SR-71).
// «Estás usando una sola transición para todo… eso aburre» y «interpretaste movimiento de cámara como iniciar cada
// escena normal y hacerle zoom». En la referencia la cámara recorre UN escenario grande siguiendo la narración: va al
// avión, la piel se vuelve transparente y se ven los tanques, y luego se desplaza hasta las llantas sin cortar.
// «…y haces que todos los textos se salgan de la pantalla, se recorten»: los textos van en una capa que la cámara no
// mueve, dentro del margen seguro (90 px).
//
// Qué hay aquí:
//   1. Zona segura: MARGEN, zonaSegura(), acomodar(), cajaTexto(), TextoSeguro, EtiquetaSegura, GuiaSegura.
//   2. RigCamara (alias PlanoContinuo): escenario más grande que el cuadro + tomas por palabra; useCamara();
//      CapaParalaje (fondos y frentes a otra velocidad), CapaTexto (HUD fijo), RotuloObjeto (rótulo pegado a un
//      objeto que nunca se sale), encuadrar().
//   3. RayosX: el exterior se vuelve translúcido con un barrido brillante y contorno de plano técnico, y deja ver el
//      interior; puede volver. LupaAumento: lupa cuyo vidrio muestra lo de debajo aumentado. recorrido(): tomas que
//      van de un elemento a otro de una fila.
//   4. Transiciones (10 tipos, ninguna blanca) + transicionPara() que no repite, SecuenciaPlanos (escenas que se
//      solapan de verdad), MontajeNarrativo (= Montaje de estilos/base con transiciones rotativas) y CamaraNarrativa
//      (marco para el Montaje de siempre: quieta, sin zoom de entrada, con una transición distinta por escena).
// CamaraViva (movimiento.tsx) no cambia: la usan los videos ya hechos.
import React, { createContext, useContext, useId } from "react";
import { AbsoluteFill, Easing, Internals, interpolate, random, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { C, H, W, fijo } from "../kit";
import { anchoT, lim } from "./paleta";
import { EtiquetaCaja, TextoEntra } from "./textos";
import { sacudida } from "./movimiento";
import { Escena, FPS, Montaje } from "../../estilos/base";

const sinId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const useUid = (pre: string) => `${pre}${sinId(useId())}`;

// =====================================================================================================
// 1. ZONA SEGURA
// =====================================================================================================

/** Margen seguro de cada borde (px, en 1920×1080). Ningún texto ni rótulo se acerca más al borde. */
export const MARGEN = 90;
export type Caja = { x: number; y: number; w: number; h: number };

const avisados = new Set<string>();
/**
 * Verificación en desarrollo: true si la caja (x, y = esquina de arriba a la izquierda, en pantalla) queda dentro del
 * margen. Si no, avisa UNA vez por `quien` en la consola (sale en los logs del render y del Studio).
 */
export const zonaSegura = (x: number, y: number, w: number, h: number, quien = "texto", margen = MARGEN): boolean => {
  const ok = x >= margen - 0.5 && y >= margen - 0.5 && x + w <= W - margen + 0.5 && y + h <= H - margen + 0.5;
  if (!ok && !avisados.has(quien)) {
    avisados.add(quien);
    console.warn(
      `[zonaSegura] «${quien}» se sale del margen de ${margen}px: x=${Math.round(x)} y=${Math.round(y)} w=${Math.round(w)} h=${Math.round(h)}`,
    );
  }
  return ok;
};

/** Mueve el CENTRO (cx, cy) de una caja de w×h para que quede dentro del margen. Si no cabe, la centra. */
export const acomodar = (cx: number, cy: number, w: number, h: number, margen = MARGEN): [number, number] => [
  w > W - 2 * margen ? W / 2 : lim(cx, margen + w / 2, W - margen - w / 2),
  h > H - 2 * margen ? H / 2 : lim(cy, margen + h / 2, H - margen - h / 2),
];

/**
 * Caja aproximada de un texto de TextoEntra (mayúsculas, Montserrat 900) respecto a su (x, línea base y).
 * Devuelve el ancho, el alto y el desplazamiento de la esquina de arriba a la izquierda.
 */
export const cajaTexto = (
  texto: string,
  size: number,
  anchor: "start" | "middle" | "end" = "middle",
  caja?: { pad?: number },
  ls = 0,
) => {
  const ancho = anchoT(texto, size) + ls * Array.from(texto).length;
  const pad = caja ? (caja.pad ?? size * 0.35) : 6;
  const dx0 = anchor === "start" ? 0 : anchor === "middle" ? -ancho / 2 : -ancho;
  const arriba = caja ? size * 0.95 + pad * 0.5 : size * 0.82;
  const abajo = caja ? size * 0.3 + pad * 0.5 + 10 : size * 0.22;
  return { w: ancho + pad * 2 + 8, h: arriba + abajo, dx: dx0 - pad, dy: -arriba };
};

type PropsTextoEntra = React.ComponentProps<typeof TextoEntra>;
/**
 * TextoEntra que nunca se sale: si no cabe, reduce el tamaño; si se acerca al borde, se corre hacia adentro.
 * Mismas props que TextoEntra (+ margen, quien). Úsalo en la CapaTexto.
 */
export const TextoSeguro: React.FC<PropsTextoEntra & { margen?: number; quien?: string }> = ({ margen = MARGEN, quien, ...p }) => {
  const anchor = p.anchor ?? "middle";
  let size = p.size ?? 90;
  let b = cajaTexto(p.texto, size, anchor, p.caja, p.ls);
  const maxW = W - 2 * margen;
  if (b.w > maxW) {
    size = size * (maxW / b.w) * 0.98;
    b = cajaTexto(p.texto, size, anchor, p.caja, p.ls);
  }
  const [cx, cy] = acomodar(p.x + b.dx + b.w / 2, p.y + b.dy + b.h / 2, b.w, b.h, margen);
  const x = cx - b.w / 2 - b.dx;
  const y = cy - b.h / 2 - b.dy;
  zonaSegura(x + b.dx, y + b.dy, b.w, b.h, quien ?? p.texto, margen);
  return <TextoEntra {...p} x={x} y={y} size={size} />;
};

type PropsEtiqueta = React.ComponentProps<typeof EtiquetaCaja>;
const cajaEtiqueta = (texto: string, size: number, icono?: string) => {
  const ic = icono ? size * 1.1 : 0;
  return { w: anchoT(texto, size) + size * 0.9 + ic + 10, h: size * 1.6 + 12 };
};
/** EtiquetaCaja (x, y = centro) que se reacomoda para no salirse del margen. */
export const EtiquetaSegura: React.FC<PropsEtiqueta & { margen?: number }> = ({ margen = MARGEN, ...p }) => {
  const b = cajaEtiqueta(p.texto, p.size ?? 56, p.icono);
  const [x, y] = acomodar(p.x, p.y, b.w, b.h, margen);
  zonaSegura(x - b.w / 2, y - b.h / 2, b.w, b.h, p.texto, margen);
  return <EtiquetaCaja {...p} x={x} y={y} />;
};

/** Guía de revisión: rectángulo punteado del margen seguro (solo para stills de prueba, nunca en el final). */
export const GuiaSegura: React.FC<{ margen?: number; color?: string }> = ({ margen = MARGEN, color = "#FF3EA5" }) => (
  <rect
    x={margen}
    y={margen}
    width={W - 2 * margen}
    height={H - 2 * margen}
    fill="none"
    stroke={color}
    strokeWidth={4}
    strokeDasharray="18 14"
    opacity={0.8}
  />
);

// =====================================================================================================
// 2. RIG DE CÁMARA
// =====================================================================================================

/**
 * Curvas de movimiento:
 *   suave      acelera y frena (por defecto)            rapida  arranque y frenado cortos, centro muy rápido (paneo)
 *   lenta      seno, para derivas largas                sobrepaso  se pasa ~5 % y se asienta (llegada con peso)
 *   frena      sale rápido y frena (alejamiento de revelación)       corte  salto seco a la toma (corte dentro del plano)
 */
export type Curva = "suave" | "rapida" | "lenta" | "sobrepaso" | "frena" | "corte";
/**
 * Una toma: a partir del fotograma `en` (o de la palabra `p`, si el rig recibe `w`) la cámara viaja hasta mirar el
 * punto (x, y) del escenario con `zoom` (1 = tamaño real) y `rot` grados. `dura` = fotogramas del viaje (si falta, se
 * calcula por la distancia: 12–40). La primera toma es la posición inicial (su `en` no importa).
 */
export type Toma = { en?: number; p?: number; x: number; y: number; zoom?: number; rot?: number; dura?: number; curva?: Curva };
export type Pose = { x: number; y: number; zoom: number; rot: number };
type TomaR = Toma & { en: number };

const inOutCubic = Easing.inOut(Easing.cubic);
const CURVAS: Record<Curva, (t: number) => number> = {
  suave: inOutCubic,
  rapida: Easing.inOut(Easing.poly(5)),
  lenta: Easing.inOut(Easing.sin),
  frena: Easing.out(Easing.cubic),
  sobrepaso: (t) => inOutCubic(t) + 0.08 * Math.sin(Math.PI * lim((t - 0.5) / 0.5, 0, 1)),
  corte: (t) => (t > 0 ? 1 : 0),
};

const pose0 = (t: Toma): Pose => ({ x: t.x, y: t.y, zoom: t.zoom ?? 1, rot: t.rot ?? 0 });
const mezclaPose = (a: Pose, b: Pose, e: number): Pose => ({
  x: a.x + (b.x - a.x) * e,
  y: a.y + (b.y - a.y) * e,
  zoom: Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * e),
  rot: a.rot + (b.rot - a.rot) * e,
});
const duraAuto = (a: Pose, b: Pose) => {
  const d = Math.hypot(b.x - a.x, b.y - a.y) * Math.sqrt(a.zoom * b.zoom);
  const dz = Math.abs(Math.log(b.zoom / a.zoom));
  return Math.round(lim(10 + d / 55 + dz * 16, 12, 40));
};

/** Ordena las tomas y pasa `p` (palabra) a fotograma con `w`. */
export const resolverTomas = (tomas: Toma[], w?: (i: number) => number): TomaR[] =>
  tomas
    .map((t) => ({ ...t, en: t.en ?? (t.p !== undefined && w ? w(t.p) : 0) }))
    .sort((a, b) => a.en - b.en);

/** Pose de la cámara en el fotograma f (sin respiración, límites ni sacudida). Encadena los viajes: si una toma
 *  llega antes de que termine el viaje anterior, arranca desde donde iba la cámara. */
export const camaraEn = (f: number, tomas: TomaR[]): Pose => {
  if (!tomas.length) return { x: W / 2, y: H / 2, zoom: 1, rot: 0 };
  let S = pose0(tomas[0]);
  let T = S;
  let en = -Infinity;
  let d = 1;
  let curva = CURVAS.suave;
  const valor = (g: number) => (g < en ? S : mezclaPose(S, T, curva(lim((g - en) / d, 0, 1))));
  for (let k = 1; k < tomas.length; k++) {
    const t = tomas[k];
    if (f < t.en) break;
    const S2 = valor(t.en);
    S = S2;
    T = pose0(t);
    en = t.en;
    d = t.curva === "corte" ? 1 : (t.dura ?? duraAuto(S, T));
    curva = CURVAS[t.curva ?? "suave"];
  }
  return valor(f);
};

/**
 * Patrón «recorrido» (lección del 2026-11-24): varios elementos en fila (tarjetas, piezas, ciudades). Arranca en plano
 * general, se acerca al primero en su palabra y luego se DESLIZA de uno a otro en la palabra de cada uno, sin
 * reiniciar la escena. `volver` = fotograma en que regresa al plano general (opcional).
 *   const tomas = recorrido(TARJETAS.map((t, k) => ({ x: t.x, y: t.y, en: w(4 + k * 3) })), { zoom: 2, general: { x: 960, y: 540, zoom: 1 } });
 */
export const recorrido = (
  elementos: { x: number; y: number; en?: number; p?: number; zoom?: number; rot?: number }[],
  opciones: {
    zoom?: number;
    general: { x: number; y: number; zoom?: number; en?: number };
    curva?: Curva;
    dura?: number;
    volver?: number;
  },
): Toma[] => {
  const { zoom = 1.8, general, curva = "suave", dura, volver } = opciones;
  const tomas: Toma[] = [{ en: general.en ?? 0, x: general.x, y: general.y, zoom: general.zoom ?? 1 }];
  elementos.forEach((e, k) =>
    tomas.push({ en: e.en, p: e.p, x: e.x, y: e.y, zoom: e.zoom ?? zoom, rot: e.rot, curva: k === 0 ? "sobrepaso" : curva, dura }),
  );
  if (volver !== undefined) tomas.push({ en: volver, x: general.x, y: general.y, zoom: general.zoom ?? 1, curva: "frena" });
  return tomas;
};

/** Toma que encuadra una caja del escenario con aire (`aire` 1,15 = 15 % de margen). */
export const encuadrar = (caja: Caja, aire = 1.15): { x: number; y: number; zoom: number } => ({
  x: caja.x + caja.w / 2,
  y: caja.y + caja.h / 2,
  zoom: Math.min(W / (caja.w * aire), H / (caja.h * aire)),
});

const limitarPose = (p: Pose, esc?: { w: number; h: number }): Pose => {
  if (!esc) return p;
  const r = (Math.abs(p.rot) * Math.PI) / 180;
  const hw = (W * Math.cos(r) + H * Math.sin(r)) / (2 * p.zoom);
  const hh = (W * Math.sin(r) + H * Math.cos(r)) / (2 * p.zoom);
  return {
    ...p,
    x: 2 * hw >= esc.w ? esc.w / 2 : lim(p.x, hw, esc.w - hw),
    y: 2 * hh >= esc.h ? esc.h / 2 : lim(p.y, hh, esc.h - hh),
  };
};

export type Camara = {
  /** pose actual (después de límites y respiración) */
  pose: Pose;
  /** sacudida de pantalla [dx, dy] */
  sacudida: [number, number];
  /** punto del escenario → pantalla */
  aPantalla: (x: number, y: number) => [number, number];
  /** punto de pantalla → escenario */
  aEscenario: (x: number, y: number) => [number, number];
  /** px de pantalla por fotograma (para desenfoque o estelas propias) */
  velocidad: number;
  /** punto del escenario de referencia para el paralaje (la primera toma) */
  origen: [number, number];
  /** escala extra que necesita una CapaParalaje de factor p para no dejar bordes vacíos */
  cubre: (p: number) => number;
  /** true dentro de un RigCamara */
  activa: boolean;
};

const identidad: Camara = {
  pose: { x: W / 2, y: H / 2, zoom: 1, rot: 0 },
  sacudida: [0, 0],
  aPantalla: (x, y) => [x, y],
  aEscenario: (x, y) => [x, y],
  velocidad: 0,
  origen: [W / 2, H / 2],
  cubre: () => 1,
  activa: false,
};
const CamaraContexto = createContext<Camara>(identidad);
/** Cámara actual (dentro de un RigCamara). Fuera de un rig devuelve la identidad (zoom 1, sin movimiento). */
export const useCamara = () => useContext(CamaraContexto);
/**
 * Puente con fondos-ricos.tsx (EspacioProfundo, CieloRico… reciben `camara={x, y, zoom}` = cuánto se movió la cámara):
 * dentro de un rig, pon el fondo en <CapaParalaje p={0}> y pásale `camara={useCamaraFondo()}`; el fondo hace su propio
 * paralaje por capas.
 */
export const useCamaraFondo = (): { x: number; y: number; zoom: number } => {
  const { pose, origen } = useCamara();
  return { x: pose.x - origen[0], y: pose.y - origen[1], zoom: pose.zoom };
};

const transformCamara = (p: Pose) => `translate(${W / 2},${H / 2}) rotate(${p.rot}) scale(${p.zoom}) translate(${-p.x},${-p.y})`;

/**
 * Capa con paralaje: su contenido va en coordenadas de PANTALLA (0..1920, 0..1080; sirven FondoNubes, FondoEstrellas…)
 * y se mueve con la cámara a otra velocidad. p = 0 fija, 0,2–0,5 fondo lejano, >1 frente (pasa más rápido, por
 * delante del escenario). Va como hija DIRECTA de <RigCamara>. Con `cubrir` (por defecto en fondos) se agranda lo justo
 * para que nunca se vean sus bordes en ninguna toma.
 */
export const CapaParalaje: React.FC<{ p: number; cubrir?: boolean; children: React.ReactNode }> = ({ p, cubrir, children }) => {
  const cam = useCamara();
  const { pose, origen } = cam;
  const zp = Math.pow(pose.zoom, p);
  const extra = (cubrir ?? p < 1) ? cam.cubre(p) : 1;
  const dx = (pose.x - origen[0]) * p;
  const dy = (pose.y - origen[1]) * p;
  const [sx, sy] = cam.sacudida;
  return (
    <g
      transform={`translate(${W / 2 + sx * p},${H / 2 + sy * p}) rotate(${pose.rot * p}) scale(${zp * extra}) translate(${-W / 2 - dx},${-H / 2 - dy})`}
    >
      {children}
    </g>
  );
};

/**
 * Capa de textos de pantalla: la cámara NO la mueve. Va como hija directa de <RigCamara> (o en cualquier Lienzo).
 * Dentro, usa TextoSeguro, EtiquetaSegura y RotuloObjeto. `guias` dibuja el margen seguro (solo para revisar).
 */
export const CapaTexto: React.FC<{ children?: React.ReactNode; guias?: boolean }> = ({ children, guias }) => (
  <g>
    {children}
    {guias ? <GuiaSegura /> : null}
  </g>
);

/**
 * RigCamara (alias PlanoContinuo): un escenario más grande que el cuadro y una cámara que lo recorre de toma en toma
 * (paneos, acercamientos a un punto, alejamientos de revelación, travelling). Reemplaza al <Lienzo> de la escena.
 *   tomas       lista de Toma (la primera es la posición inicial)
 *   w           el w de la escena, si las tomas usan `p` (palabra) en vez de `en`
 *   escenario   tamaño del escenario {w, h}: la cámara nunca muestra fuera de él (con `limitar`, por defecto)
 *   fondo       color de fondo del svg
 *   respira     0..1: deriva mínima cuando la cámara está quieta (0,5 por defecto; 0 = quieta del todo)
 *   desenfoque  desenfoque de movimiento en los viajes rápidos (por defecto sí)
 *   sacudidas   fotogramas con sacudida de pantalla; fuerza = px
 *   hud         textos de pantalla (lo mismo que poner <CapaTexto> como hija)
 *   guias       dibuja el margen seguro (para revisar stills)
 * Hijas directas: <CapaParalaje> (fondo o frente), <CapaTexto> (HUD fijo) y todo lo demás = el escenario.
 */
export const RigCamara: React.FC<{
  tomas: Toma[];
  w?: (i: number) => number;
  escenario?: { w: number; h: number };
  limitar?: boolean;
  fondo?: string;
  respira?: number;
  desenfoque?: boolean;
  sacudidas?: number[];
  fuerza?: number;
  hud?: React.ReactNode;
  guias?: boolean;
  children?: React.ReactNode;
}> = ({
  tomas,
  w,
  escenario,
  limitar = true,
  fondo,
  respira = 0.5,
  desenfoque = true,
  sacudidas = [],
  fuerza = 18,
  hud,
  guias,
  children,
}) => {
  const f = useCurrentFrame();
  const uid = useUid("rig");
  const tr = resolverTomas(tomas, w);
  const esc = limitar ? escenario : undefined;
  const calc = (g: number): Pose => {
    const p = camaraEn(g, tr);
    const r = respira / Math.max(0.5, p.zoom);
    const q = {
      ...p,
      x: p.x + Math.sin(g / 47) * 5 * r,
      y: p.y + Math.cos(g / 61) * 4 * r,
      zoom: p.zoom * (1 + 0.006 * respira * Math.sin(g / 53)),
    };
    return limitarPose(q, esc);
  };
  const pose = calc(f);
  const prev = calc(f - 1);
  let sx = 0;
  let sy = 0;
  for (const s of sacudidas) {
    const [a, b] = sacudida(f, s, fuerza);
    sx += a;
    sy += b;
  }
  const vx = (pose.x - prev.x) * pose.zoom;
  const vy = (pose.y - prev.y) * pose.zoom;
  const vz = Math.abs(Math.log(pose.zoom / prev.zoom)) * 900;
  const velocidad = Math.hypot(vx, vy) + vz;
  const extraZ = lim((vz - 10) * 0.04, 0, 3);
  const bx = desenfoque ? lim((Math.abs(vx) - 20) * 0.06, 0, 8) + extraZ : 0;
  const by = desenfoque ? lim((Math.abs(vy) - 20) * 0.06, 0, 8) + extraZ : 0;
  const borroso = bx > 0.3 || by > 0.3;

  const rad = (pose.rot * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const origen: [number, number] = tr.length ? [tr[0].x, tr[0].y] : [W / 2, H / 2];
  const cubre = (p: number) => {
    let req = 1;
    for (const t of tr) {
      const zp = Math.pow(t.zoom ?? 1, p);
      const dx = Math.abs(t.x - origen[0]) * p;
      const dy = Math.abs(t.y - origen[1]) * p;
      const ex = W / 2 - dx > 1 ? W / 2 / (zp * (W / 2 - dx)) : 3;
      const ey = H / 2 - dy > 1 ? H / 2 / (zp * (H / 2 - dy)) : 3;
      req = Math.max(req, ex, ey);
    }
    return Math.min(3, req * 1.04 + (pose.rot ? 0.06 : 0));
  };
  const cam: Camara = {
    pose,
    sacudida: [sx, sy],
    aPantalla: (x, y) => {
      const dx = (x - pose.x) * pose.zoom;
      const dy = (y - pose.y) * pose.zoom;
      return [W / 2 + sx + dx * cos - dy * sin, H / 2 + sy + dx * sin + dy * cos];
    },
    aEscenario: (x, y) => {
      const dx = x - W / 2 - sx;
      const dy = y - H / 2 - sy;
      return [pose.x + (dx * cos + dy * sin) / pose.zoom, pose.y + (-dx * sin + dy * cos) / pose.zoom];
    },
    velocidad,
    origen,
    cubre,
    activa: true,
  };

  const fondos: React.ReactNode[] = [];
  const frentes: React.ReactNode[] = [];
  const textos: React.ReactNode[] = [];
  const mundo: React.ReactNode[] = [];
  React.Children.toArray(children).forEach((ch) => {
    if (React.isValidElement(ch) && ch.type === CapaTexto) textos.push(ch);
    else if (React.isValidElement(ch) && ch.type === CapaParalaje)
      ((ch.props as { p: number }).p > 1 ? frentes : fondos).push(ch);
    else mundo.push(ch);
  });

  return (
    <CamaraContexto.Provider value={cam}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", backgroundColor: fondo }}>
        {borroso ? (
          <defs>
            <filter id={`${uid}-mov`} filterUnits="userSpaceOnUse" x={-60} y={-60} width={W + 120} height={H + 120}>
              <feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} />
            </filter>
          </defs>
        ) : null}
        <g filter={borroso ? `url(#${uid}-mov)` : undefined}>
          {fondos}
          <g transform={`translate(${sx},${sy})`}>
            <g transform={transformCamara(pose)}>{mundo}</g>
          </g>
          {frentes}
        </g>
        {textos}
        {hud}
        {guias ? <GuiaSegura /> : null}
      </svg>
    </CamaraContexto.Provider>
  );
};
/** Otro nombre del mismo rig (como aparece en el encargo). */
export const PlanoContinuo = RigCamara;

/**
 * Rótulo pegado a un objeto del escenario (x, y en coordenadas del ESCENARIO): va en la <CapaTexto>, se ubica
 * proyectando el objeto a pantalla y se reacomoda para no salirse nunca del margen. Una línea con punto une el rótulo
 * con el objeto (el punto se queda dentro del cuadro aunque el objeto salga).
 *   lado = dónde va el rótulo respecto al objeto (arriba por defecto); dist = px de pantalla.
 */
export const RotuloObjeto: React.FC<{
  x: number;
  y: number;
  texto: string;
  f: number;
  desde?: number;
  sale?: number;
  size?: number;
  lado?: "arriba" | "abajo" | "izq" | "der";
  dist?: number;
  fondo?: string;
  tinta?: string;
  icono?: "usuario" | "check" | "x";
  linea?: string;
  margen?: number;
}> = ({ x, y, texto, f, desde = 0, sale, size = 48, lado = "arriba", dist = 150, fondo, tinta, icono, linea = C.amarillo, margen = MARGEN }) => {
  const cam = useCamara();
  if (f < desde) return null;
  const [px, py] = cam.aPantalla(x, y);
  const b = cajaEtiqueta(texto, size, icono);
  let cx = px;
  let cy = py;
  if (lado === "arriba") cy = py - dist - b.h / 2;
  if (lado === "abajo") cy = py + dist + b.h / 2;
  if (lado === "izq") cx = px - dist - b.w / 2;
  if (lado === "der") cx = px + dist + b.w / 2;
  [cx, cy] = acomodar(cx, cy, b.w, b.h, margen);
  zonaSegura(cx - b.w / 2, cy - b.h / 2, b.w, b.h, `rótulo ${texto}`, margen);
  const qx = lim(px, 40, W - 40);
  const qy = lim(py, 40, H - 40);
  const crece = interpolate(f, [desde, desde + 8], [0, 1], { ...fijo, easing: Easing.out(Easing.cubic) });
  const fuera = sale === undefined ? 1 : 1 - interpolate(f, [sale, sale + 8], [0, 1], fijo);
  const late = 1 + 0.15 * Math.sin((f - desde) / 5);
  return (
    <g opacity={fuera}>
      <line
        x1={cx}
        y1={cy}
        x2={cx + (qx - cx) * crece}
        y2={cy + (qy - cy) * crece}
        stroke={C.negro}
        strokeWidth={12}
        strokeLinecap="round"
        opacity={0.35}
      />
      <line x1={cx} y1={cy} x2={cx + (qx - cx) * crece} y2={cy + (qy - cy) * crece} stroke={linea} strokeWidth={6} strokeLinecap="round" />
      {crece > 0.95 ? (
        <g>
          <circle cx={qx} cy={qy} r={22 * late} fill={linea} opacity={0.3} />
          <circle cx={qx} cy={qy} r={11} fill={linea} stroke={C.negro} strokeWidth={4} />
        </g>
      ) : null}
      <EtiquetaCaja x={cx} y={cy} texto={texto} f={f} desde={desde} size={size} fondo={fondo} tinta={tinta} icono={icono} sale={sale} />
    </g>
  );
};

// =====================================================================================================
// 3. RAYOS X
// =====================================================================================================

/**
 * Rayos X: en `desde` un barrido brillante cruza `caja` (coordenadas locales, donde está el objeto) y, por donde pasa,
 * el exterior se vuelve translúcido azul de plano técnico, con contorno y aristas brillantes, y deja ver el interior.
 * En `vuelve` el barrido regresa y el exterior se cierra. Fuera de `caja` el exterior sigue sólido (p. ej. el tren de
 * aterrizaje). `id` único por escena.
 *   exterior / interior  nodos SVG en las mismas coordenadas (el interior se recorta a la silueta del exterior)
 *   dir                  hacia dónde avanza el barrido ("der" por defecto)
 *   fantasma             opacidad del exterior revelado (0,16); color = contorno y barrido; tinte = azul del plano
 *   recorteCamara        (por defecto sí) el filtro del contorno solo se calcula en lo que ve la cámara del RigCamara.
 *                        Si RayosX va dentro de un <g> con transform propio, pon false (calcula toda la caja).
 */
/** Matriz de feColorMatrix que pinta todo de `color` (#RRGGBB) y deja el alfa. */
const matrizColor = (color: string) => {
  const h = color.replace("#", "");
  const c = (k: number) => (parseInt(h.slice(k, k + 2), 16) / 255).toFixed(4);
  return `0 0 0 0 ${c(0)}  0 0 0 0 ${c(2)}  0 0 0 0 ${c(4)}  0 0 0 1 0`;
};

export const RayosX: React.FC<{
  f: number;
  id: string;
  desde: number;
  hasta?: number;
  vuelve?: number;
  caja: Caja;
  exterior: React.ReactNode;
  interior: React.ReactNode;
  dir?: "der" | "izq" | "abajo" | "arriba";
  fantasma?: number;
  color?: string;
  tinte?: string;
  recortar?: boolean;
  rejilla?: number;
  grosor?: number;
  recorteCamara?: boolean;
}> = ({
  f,
  id,
  desde,
  hasta,
  vuelve,
  caja,
  exterior,
  interior,
  dir = "der",
  fantasma = 0.16,
  color = C.teal,
  tinte = "#1D5FB8",
  recortar = true,
  rejilla = 36,
  grosor = 3,
  recorteCamara = true,
}) => {
  const cam = useCamara();
  const h1 = hasta ?? desde + 20;
  const dura = Math.max(1, h1 - desde);
  const ent = interpolate(f, [desde, h1], [0, 1], { ...fijo, easing: Easing.inOut(Easing.cubic) });
  const sal = vuelve === undefined ? 0 : interpolate(f, [vuelve, vuelve + dura], [0, 1], { ...fijo, easing: Easing.inOut(Easing.cubic) });
  const e = ent * (1 - sal);
  if (e <= 0.001) return <g>{exterior}</g>;

  const horiz = dir === "der" || dir === "izq";
  const L = horiz ? caja.w : caja.h;
  const banda = Math.max(40, L * 0.06);
  // región revelada (crece en la dirección del barrido)
  const largo = (L + banda) * e;
  const rev: Caja =
    dir === "der"
      ? { x: caja.x - banda, y: caja.y, w: largo, h: caja.h }
      : dir === "izq"
        ? { x: caja.x + caja.w + banda - largo, y: caja.y, w: largo, h: caja.h }
        : dir === "abajo"
          ? { x: caja.x, y: caja.y - banda, w: caja.w, h: largo }
          : { x: caja.x, y: caja.y + caja.h + banda - largo, w: caja.w, h: largo };
  // borde del barrido (donde va la banda brillante)
  const frente = dir === "der" ? rev.x + rev.w : dir === "izq" ? rev.x : dir === "abajo" ? rev.y + rev.h : rev.y;
  const animando = e < 0.999;
  const G = 1e5;
  const fuera = `M${-G},${-G} H${G} V${G} H${-G} Z M${rev.x},${rev.y} V${rev.y + rev.h} H${rev.x + rev.w} V${rev.y} Z`;
  const m = { x: caja.x - caja.w * 0.2, y: caja.y - caja.h * 0.2, w: caja.w * 1.4, h: caja.h * 1.4 };
  const lineas: React.ReactNode[] = [];
  for (let gx = caja.x + rejilla / 2; gx < caja.x + caja.w; gx += rejilla)
    lineas.push(<line key={`v${gx}`} x1={gx} y1={caja.y} x2={gx} y2={caja.y + caja.h} />);
  for (let gy = caja.y + rejilla / 2; gy < caja.y + caja.h; gy += rejilla)
    lineas.push(<line key={`h${gy}`} x1={caja.x} y1={gy} x2={caja.x + caja.w} y2={gy} />);
  const pulso = 0.85 + 0.15 * Math.sin(f / 4);
  // escala de pantalla (px por unidad local) y región del filtro: la caja con aire para el brillo, recortada a lo
  // que ve la cámara (fuera de un RigCamara, toda la caja)
  const zoomPx = cam.activa ? cam.pose.zoom : 1;
  const sigmaPx = 0.82 / Math.max(0.05, zoomPx);
  const aire = grosor * 9;
  // solo la parte ya revelada (el contorno va dentro del clipPath de `rev`), con aire para el brillo
  let rf: Caja = { x: Math.max(caja.x, rev.x) - aire, y: Math.max(caja.y, rev.y) - aire, w: 0, h: 0 };
  rf.w = Math.min(caja.x + caja.w, rev.x + rev.w) + aire - rf.x;
  rf.h = Math.min(caja.y + caja.h, rev.y + rev.h) + aire - rf.y;
  if (cam.activa && recorteCamara) {
    const esq = [cam.aEscenario(0, 0), cam.aEscenario(W, 0), cam.aEscenario(0, H), cam.aEscenario(W, H)];
    const pad = aire + 40 / zoomPx;
    const vx0 = Math.min(...esq.map((p) => p[0])) - pad;
    const vy0 = Math.min(...esq.map((p) => p[1])) - pad;
    const vx1 = Math.max(...esq.map((p) => p[0])) + pad;
    const vy1 = Math.max(...esq.map((p) => p[1])) + pad;
    const x0 = Math.max(rf.x, vx0);
    const y0 = Math.max(rf.y, vy0);
    const x1 = Math.min(rf.x + rf.w, vx1);
    const y1 = Math.min(rf.y + rf.h, vy1);
    rf = { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
  }

  return (
    <g>
      <defs>
        <clipPath id={`${id}-rev`}>
          <rect x={rev.x} y={rev.y} width={rev.w} height={rev.h} />
        </clipPath>
        <clipPath id={`${id}-sol`}>
          <path d={fuera} clipRule="evenodd" fillRule="evenodd" />
        </clipPath>
        <filter id={`${id}-blanco`}>
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
        </filter>
        <mask id={`${id}-sil`} maskUnits="userSpaceOnUse" x={m.x} y={m.y} width={m.w} height={m.h}>
          <g filter={`url(#${id}-blanco)`}>{exterior}</g>
        </mask>
        {/* Contorno + aristas. Antes: feMorphology (erosión) + feConvolveMatrix (Laplaciano 3×3), 10–16 s por cuadro
            con zoom 2 en Chrome sin GPU. Ahora lo mismo con desenfoques (rápidos): erosión ≈ desenfoque + umbral y
            Laplaciano ≈ 9·(lum − desenfoque(lum)) a ~1 px de pantalla; la región se limita a la caja y a lo visible. */}
        <filter id={`${id}-borde`} filterUnits="userSpaceOnUse" x={rf.x} y={rf.y} width={rf.w} height={rf.h}>
          <feComponentTransfer in="SourceAlpha" result="bin">
            <feFuncA type="linear" slope={20} />
          </feComponentTransfer>
          <feGaussianBlur in="bin" stdDeviation={grosor * 0.5} result="ab" />
          <feComponentTransfer in="ab" result="nucleo">
            <feFuncA type="linear" slope={40} intercept={-38.6} />
          </feComponentTransfer>
          <feComposite in="SourceAlpha" in2="nucleo" operator="in" result="er" />
          <feComposite in="SourceAlpha" in2="er" operator="out" result="sil" />
          <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="lum" />
          <feGaussianBlur in="lum" stdDeviation={sigmaPx} result="lumb" />
          <feComposite in="lum" in2="lumb" operator="arithmetic" k1={0} k2={54} k3={-54} k4={0} result="ari2" />
          <feMerge result="todo">
            <feMergeNode in="sil" />
            <feMergeNode in="ari2" />
          </feMerge>
          <feColorMatrix in="todo" type="matrix" values={matrizColor(color)} colorInterpolationFilters="sRGB" result="lin" />
          <feGaussianBlur in="lin" stdDeviation={grosor * 2.5} result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="lin" />
          </feMerge>
        </filter>
        <linearGradient
          id={`${id}-banda`}
          gradientUnits="userSpaceOnUse"
          x1={horiz ? frente - banda * (dir === "der" ? 1 : -1) : 0}
          y1={horiz ? 0 : frente - banda * (dir === "abajo" ? 1 : -1)}
          x2={horiz ? frente : 0}
          y2={horiz ? 0 : frente}
        >
          <stop offset="0" stopColor={color} stopOpacity={0} />
          <stop offset="0.75" stopColor={color} stopOpacity={0.55} />
          <stop offset="1" stopColor={C.crema} stopOpacity={0.95} />
        </linearGradient>
      </defs>
      {/* lo que el barrido aún no toca: sólido */}
      <g clipPath={`url(#${id}-sol)`}>{exterior}</g>
      {/* lo revelado: fantasma + tinte de plano + rejilla + interior + contorno */}
      <g clipPath={`url(#${id}-rev)`}>
        <g opacity={fantasma}>{exterior}</g>
        <g mask={`url(#${id}-sil)`}>
          <rect x={m.x} y={m.y} width={m.w} height={m.h} fill={tinte} opacity={0.5} />
          <g stroke={color} strokeWidth={2} opacity={0.22}>
            {lineas}
          </g>
        </g>
        <g mask={recortar ? `url(#${id}-sil)` : undefined}>{interior}</g>
        <g filter={`url(#${id}-borde)`} opacity={pulso}>
          {exterior}
        </g>
      </g>
      {/* banda brillante del barrido, solo sobre la silueta */}
      {animando ? (
        <g mask={`url(#${id}-sil)`}>
          <rect
            x={horiz ? (dir === "der" ? frente - banda : frente) : m.x}
            y={horiz ? m.y : dir === "abajo" ? frente - banda : frente}
            width={horiz ? banda : m.w}
            height={horiz ? m.h : banda}
            fill={`url(#${id}-banda)`}
          />
          {horiz ? (
            <line x1={frente} y1={m.y} x2={frente} y2={m.y + m.h} stroke={C.crema} strokeWidth={5} />
          ) : (
            <line x1={m.x} y1={frente} x2={m.x + m.w} y2={frente} stroke={C.crema} strokeWidth={5} />
          )}
        </g>
      ) : null}
    </g>
  );
};

/**
 * Lupa de verdad (la `Lupa` de objetos.tsx es solo el dibujo): el vidrio muestra lo que hay debajo AUMENTADO. Envuelve
 * el contenido: lo dibuja normal y otra vez dentro de un círculo escalado `zoom` (2–2,5×) alrededor del centro del
 * vidrio, con tinte, reflejo, aro con volumen y mango. x, y = centro del vidrio (mismas coordenadas que los hijos);
 * anímalos para pasearla sobre el objeto. `id` único por escena; `aparece` 0..1 la hace crecer. rot = ángulo del mango.
 *   <LupaAumento id="l1" x={interpolate(f, [w(3), w(6)], [700, 1300], fijo)} y={560} r={170} zoom={2.2}>
 *     <SR71 x={960} y={560} f={f} s={1.3} />
 *   </LupaAumento>
 */
export const LupaAumento: React.FC<{
  id: string;
  x: number;
  y: number;
  r?: number;
  zoom?: number;
  rot?: number;
  aparece?: number;
  fondoVidrio?: string;
  aro?: string;
  children: React.ReactNode;
}> = ({ id, x, y, r = 160, zoom = 2.2, rot = 40, aparece = 1, fondoVidrio, aro = C.navy2, children }) => {
  const s = lim(aparece, 0, 1.3);
  const R = r * s;
  if (R < 1) return <g>{children}</g>;
  const a = (rot * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const m0 = R * 1.08;
  const m1 = R * 2.05;
  return (
    <g>
      {children}
      <defs>
        <clipPath id={`${id}-vidrio`}>
          <circle cx={x} cy={y} r={R} />
        </clipPath>
        <radialGradient id={`${id}-tinte`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.65" stopColor={C.teal} stopOpacity={0} />
          <stop offset="1" stopColor={C.teal} stopOpacity={0.35} />
        </radialGradient>
        <linearGradient id={`${id}-aro`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.lila} />
          <stop offset="0.5" stopColor={aro} />
          <stop offset="1" stopColor={C.negro} />
        </linearGradient>
      </defs>
      {/* mango con volumen */}
      <g strokeLinecap="round">
        <line x1={x + ux * m0} y1={y + uy * m0 + 10} x2={x + ux * m1} y2={y + uy * m1 + 10} stroke="rgba(18,12,46,0.35)" strokeWidth={R * 0.3} />
        <line x1={x + ux * m0} y1={y + uy * m0} x2={x + ux * m1} y2={y + uy * m1} stroke={C.rojo2} strokeWidth={R * 0.28} />
        <line x1={x + ux * m0} y1={y + uy * m0} x2={x + ux * m1} y2={y + uy * m1} stroke={C.rojo} strokeWidth={R * 0.16} />
        <line
          x1={x + ux * (m0 + R * 0.12)}
          y1={y + uy * (m0 + R * 0.12) - R * 0.05}
          x2={x + ux * (m1 - R * 0.12)}
          y2={y + uy * (m1 - R * 0.12) - R * 0.05}
          stroke={C.crema}
          strokeWidth={R * 0.04}
          opacity={0.6}
        />
        <line x1={x + ux * R} y1={y + uy * R} x2={x + ux * m0 * 1.04} y2={y + uy * m0 * 1.04} stroke={C.gris2} strokeWidth={R * 0.2} />
      </g>
      {/* sombra del aro sobre lo de debajo */}
      <circle cx={x + 10} cy={y + 14} r={R + R * 0.09} fill="none" stroke="rgba(18,12,46,0.35)" strokeWidth={R * 0.12} />
      {/* contenido aumentado */}
      <g clipPath={`url(#${id}-vidrio)`}>
        {fondoVidrio ? <circle cx={x} cy={y} r={R} fill={fondoVidrio} /> : null}
        <g transform={`translate(${x},${y}) scale(${zoom}) translate(${-x},${-y})`}>{children}</g>
        <circle cx={x} cy={y} r={R} fill={`url(#${id}-tinte)`} />
        {/* reflejos del vidrio */}
        <path
          d={`M${x - R * 0.62},${y - R * 0.2} A${R * 0.66},${R * 0.66} 0 0 1 ${x - R * 0.12},${y - R * 0.64}`}
          fill="none"
          stroke={C.blanco}
          strokeWidth={R * 0.09}
          strokeLinecap="round"
          opacity={0.55}
        />
        <circle cx={x - R * 0.5} cy={y + R * 0.05} r={R * 0.05} fill={C.blanco} opacity={0.5} />
        <path d={`M${x + R * 0.3},${y + R * 0.75} L${x + R * 0.75},${y + R * 0.3}`} stroke={C.blanco} strokeWidth={R * 0.05} strokeLinecap="round" opacity={0.25} />
      </g>
      {/* aro con volumen */}
      <circle cx={x} cy={y} r={R + R * 0.05} fill="none" stroke={`url(#${id}-aro)`} strokeWidth={R * 0.13} />
      <circle cx={x} cy={y} r={R + R * 0.1} fill="none" stroke={C.negro} strokeWidth={R * 0.025} opacity={0.6} />
      <path
        d={`M${x - R * 0.92},${y - R * 0.35} A${R * 1.03},${R * 1.03} 0 0 1 ${x - R * 0.35},${y - R * 0.95}`}
        fill="none"
        stroke={C.crema}
        strokeWidth={R * 0.035}
        strokeLinecap="round"
        opacity={0.8}
      />
    </g>
  );
};

// =====================================================================================================
// 4. TRANSICIONES
// =====================================================================================================

export type TipoTransicion =
  | "latigo"
  | "empuje"
  | "zoomObjeto"
  | "iris"
  | "humo"
  | "disolucion"
  | "tarjeta"
  | "golpe"
  | "diagonal"
  | "abanico";
export type FormaIris = "circulo" | "estrella" | "rombo" | "hexagono" | [number, number][];
/**
 * Opciones de una transición. dura = fotogramas; dir 1 = la escena nueva entra por la derecha (−1 por la izquierda);
 * x, y = punto (zoomObjeto, iris, abanico); radio = tamaño del objeto por el que se atraviesa (zoomObjeto);
 * forma = del iris (o una silueta: puntos alrededor de 0,0 con radio ~1); color/color2 = del humo, aros y líneas
 * (pon el color de la escena; nunca blanco).
 */
export type OpcionesTransicion = {
  tipo: TipoTransicion;
  dura?: number;
  dir?: 1 | -1;
  x?: number;
  y?: number;
  radio?: number;
  forma?: FormaIris;
  color?: string;
  color2?: string;
};
export type TransicionSpec = TipoTransicion | OpcionesTransicion;

/** Catálogo: duración por defecto, cuánto se solapan las dos escenas y qué hace cada una. */
export const Transiciones: Record<TipoTransicion, { dura: number; solape: (d: number) => number; que: string }> = {
  latigo: { dura: 10, solape: (d) => d, que: "Paneo rápido con desenfoque: la vieja sale de lado y la nueva entra, borrosas y ladeadas." },
  empuje: { dura: 14, solape: (d) => d, que: "Empuje lateral: la escena nueva empuja a la vieja fuera del cuadro." },
  zoomObjeto: { dura: 16, solape: (d) => d, que: "Zoom a través de un objeto: la cámara entra por el punto (x, y) y la nueva escena aparece por ese hueco." },
  iris: { dura: 14, solape: (d) => d, que: "Iris con forma (círculo, estrella, rombo, hexágono o silueta) que crece desde un punto, con aro de color." },
  humo: { dura: 20, solape: (d) => Math.ceil(d / 2) + 1, que: "Cortina de humo o tinta del color de la escena: tapa, cambia y se disipa." },
  disolucion: { dura: 14, solape: (d) => d, que: "Disolución cruzada con un leve acercamiento." },
  tarjeta: { dura: 16, solape: (d) => Math.ceil(d / 2), que: "Giro de tarjeta: la escena vieja gira 90° y la nueva termina el giro." },
  golpe: { dura: 10, solape: () => 0, que: "Corte en golpe: corte seco con sacudida, rebote de escala y líneas de velocidad oscuras." },
  diagonal: { dura: 14, solape: (d) => d, que: "Deslizamiento en diagonal: la nueva entra desde la esquina con sombra; la vieja retrocede y se oscurece." },
  abanico: { dura: 14, solape: (d) => d, que: "Abanico: la nueva escena se descubre como una aguja de reloj, con borde de color." },
};
/** Orden de rotación por defecto (todas). */
export const ROTACION: TipoTransicion[] = [
  "latigo",
  "iris",
  "empuje",
  "humo",
  "zoomObjeto",
  "tarjeta",
  "diagonal",
  "disolucion",
  "abanico",
  "golpe",
];

const cacheRot = new Map<string, TipoTransicion[]>();
/**
 * Transición para la escena número `indice` (determinista): nunca repite ninguna de las `ventana` anteriores
 * (1 = solo la anterior). `lista` = de cuáles elegir (ROTACION por defecto).
 */
export const transicionPara = (
  indice: number,
  semilla: string | number = "",
  lista: TipoTransicion[] = ROTACION,
  ventana = 1,
): TipoTransicion => {
  const k = Math.max(0, Math.floor(indice));
  const clave = `${semilla}|${lista.join(",")}|${ventana}`;
  const hist = cacheRot.get(clave) ?? [];
  const v = Math.min(ventana, lista.length - 1);
  while (hist.length <= k) {
    const n = hist.length;
    const prohibidas = v > 0 ? hist.slice(-v) : [];
    const libres = lista.filter((t) => !prohibidas.includes(t));
    const pool = libres.length ? libres : lista;
    hist.push(pool[Math.floor(random(`tr-${semilla}-${n}`) * pool.length) % pool.length]);
  }
  cacheRot.set(clave, hist);
  return hist[k];
};

type TransR = Required<Pick<OpcionesTransicion, "tipo" | "dura" | "dir">> & OpcionesTransicion;
const resolver = (s: TransicionSpec): TransR => {
  const o = typeof s === "string" ? { tipo: s } : s;
  return { ...o, dura: o.dura ?? Transiciones[o.tipo].dura, dir: o.dir ?? 1 };
};
export const solapeDe = (s: TransicionSpec) => {
  const r = resolver(s);
  return Transiciones[r.tipo].solape(r.dura);
};

const puntosForma = (forma: FormaIris): [number, number][] => {
  if (Array.isArray(forma)) return forma;
  const n = forma === "estrella" ? 10 : forma === "rombo" ? 4 : forma === "hexagono" ? 6 : 48;
  return Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2;
    const r = forma === "estrella" ? (k % 2 ? 0.48 : 1) : 1;
    return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
  });
};
// distancia mínima del centro a los lados del polígono (para saber cuánto crecer hasta tapar todo)
const radioInterior = (pts: [number, number][]) => {
  let m = Infinity;
  for (let k = 0; k < pts.length; k++) {
    const [ax, ay] = pts[k];
    const [bx, by] = pts[(k + 1) % pts.length];
    const dx = bx - ax;
    const dy = by - ay;
    const t = lim(-(ax * dx + ay * dy) / (dx * dx + dy * dy || 1), 0, 1);
    m = Math.min(m, Math.hypot(ax + dx * t, ay + dy * t));
  }
  return Math.max(0.05, m);
};

type Efecto = { style?: React.CSSProperties; capa?: React.ReactNode; defs?: React.ReactNode };

const Overlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
    {children}
  </svg>
);

/** Estilo de una escena que entra o sale en la transición `o`, con progreso t (0..1). */
const efecto = (o: TransR, t: number, rol: "entra" | "sale", g: number, uid: string): Efecto => {
  const d = o.dir;
  const px = o.x ?? W / 2;
  const py = o.y ?? H / 2;
  const campana = Math.sin(Math.PI * t);
  switch (o.tipo) {
    case "latigo": {
      const e = Easing.inOut(Easing.poly(4))(t);
      const b = 46 * campana;
      const defs = (
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={`${uid}-lat`} x="-20%" y="0%" width="140%" height="100%">
            <feGaussianBlur stdDeviation={`${b.toFixed(1)} 0`} />
          </filter>
        </svg>
      );
      const x = rol === "entra" ? d * W * (1 - e) : -d * W * e;
      return {
        defs,
        style: { transform: `translateX(${x}px) skewX(${-d * 7 * campana}deg)`, filter: b > 0.5 ? `url(#${uid}-lat)` : undefined },
      };
    }
    case "empuje": {
      const e = inOutCubic(t);
      const x = rol === "entra" ? d * W * (1 - e) : -d * W * e;
      return {
        style: {
          transform: `translateX(${x}px) scale(${1 - 0.05 * campana})`,
          boxShadow: rol === "entra" ? `${-d * 40}px 0 70px rgba(18,12,46,0.55)` : undefined,
        },
      };
    }
    case "zoomObjeto": {
      const ei = Easing.in(Easing.cubic)(t);
      const rMax = Math.hypot(Math.max(px, W - px), Math.max(py, H - py)) + 30;
      const r0 = o.radio ?? 80;
      if (rol === "sale") {
        const s = Math.exp(Math.log(rMax / r0) * ei);
        return {
          style: {
            transformOrigin: `${px}px ${py}px`,
            transform: `scale(${s})`,
            filter: `blur(${(6 * campana).toFixed(1)}px)`,
            opacity: 1 - interpolate(t, [0.7, 1], [0, 1], fijo),
          },
        };
      }
      const r = r0 * Math.exp(Math.log(rMax / r0) * ei);
      const s = 1.5 - 0.5 * Easing.out(Easing.cubic)(t);
      return {
        style: { clipPath: t < 1 ? `circle(${r.toFixed(1)}px at ${px}px ${py}px)` : undefined, transformOrigin: `${px}px ${py}px`, transform: `scale(${s})` },
        capa:
          t < 1 ? (
            <Overlay>
              <circle cx={px} cy={py} r={r + 8} fill="none" stroke={o.color ?? C.amarillo} strokeWidth={18} opacity={0.9 * (1 - t)} />
              <circle cx={px} cy={py} r={r + 26} fill="none" stroke={o.color2 ?? C.negro} strokeWidth={10} opacity={0.4 * (1 - t)} />
            </Overlay>
          ) : null,
      };
    }
    case "iris": {
      if (rol === "sale") {
        const e = inOutCubic(t);
        return { style: { transform: `scale(${1 - 0.06 * e})`, filter: `brightness(${1 - 0.35 * e})` } };
      }
      const pts = puntosForma(o.forma ?? "circulo");
      const rMax = (Math.hypot(Math.max(px, W - px), Math.max(py, H - py)) + 40) / radioInterior(pts);
      const e = inOutCubic(t);
      const R = Math.max(1, rMax * e);
      const giro = ((o.forma === "estrella" ? 40 : o.forma === "circulo" || !o.forma ? 0 : 20) * (1 - e) * Math.PI) / 180;
      const pp = pts.map(([a, b]) => {
        const xa = a * Math.cos(giro) - b * Math.sin(giro);
        const ya = a * Math.sin(giro) + b * Math.cos(giro);
        return [px + xa * R, py + ya * R] as [number, number];
      });
      const poly = pp.map(([a, b]) => `${a.toFixed(1)}px ${b.toFixed(1)}px`).join(",");
      const dPath = pp.map(([a, b], k) => `${k ? "L" : "M"}${a.toFixed(1)},${b.toFixed(1)}`).join(" ") + " Z";
      return {
        style: { clipPath: t < 1 ? `polygon(${poly})` : undefined },
        capa:
          t < 1 ? (
            <Overlay>
              <path d={dPath} fill="none" stroke={o.color2 ?? C.negro} strokeWidth={30} strokeLinejoin="round" opacity={0.35} />
              <path d={dPath} fill="none" stroke={o.color ?? C.amarillo} strokeWidth={14} strokeLinejoin="round" />
            </Overlay>
          ) : null,
      };
    }
    case "humo": {
      if (rol === "sale") return { style: { transform: `scale(${1 + 0.04 * t})` } };
      const col = o.color ?? C.navy2;
      const col2 = o.color2 ?? C.morado;
      const tapa = lim(1.6 - Math.abs(t - 0.5) * 9, 0, 1);
      const bordes: React.ReactNode[] = [];
      const bolas: React.ReactNode[] = [];
      const luces: React.ReactNode[] = [];
      const cols = 6;
      const filas = 4;
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < filas; j++) {
          const k = i * filas + j;
          const fr = d === 1 ? i / (cols - 1) : 1 - i / (cols - 1);
          // cada columna llega un poco después (cortina que avanza) y se va en el mismo orden
          const u = lim((t - fr * 0.18) / 0.82, 0, 1);
          const c = Math.sin(Math.PI * u);
          const jx = (random(`humo-x${k}`) - 0.5) * 120;
          const jy = (random(`humo-y${k}`) - 0.5) * 120;
          const bx = (i + 0.5) * (W / cols) + jx + d * (u - 0.5) * 260;
          const by = (j + 0.5) * (H / filas) + jy - (u - 0.5) * 80;
          const r = 340 * c * (0.85 + 0.3 * random(`humo-r${k}`));
          if (r < 2) continue;
          // primero todos los bordes, luego los centros: el borde claro queda solo en el contorno de la nube
          bordes.push(<circle key={k} cx={bx} cy={by} r={r * 1.1} fill={col2} />);
          bolas.push(<circle key={k} cx={bx} cy={by} r={r} fill={col} />);
          luces.push(<circle key={k} cx={bx - r * 0.3} cy={by - r * 0.35} r={r * 0.45} fill={col2} opacity={0.22} />);
        }
      return {
        style: { opacity: t >= 0.5 ? 1 : 0 },
        capa:
          t < 1 ? (
            <Overlay>
              <defs>
                <filter id={`${uid}-humo`} x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves={2} seed={4} result="ruido" />
                  <feDisplacementMap in="SourceGraphic" in2="ruido" scale={90} xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <g filter={`url(#${uid}-humo)`}>
                {bordes}
                {bolas}
                {luces}
              </g>
              {tapa > 0 ? <rect x={0} y={0} width={W} height={H} fill={col} opacity={tapa} /> : null}
            </Overlay>
          ) : null,
      };
    }
    case "disolucion": {
      const e = inOutCubic(t);
      return rol === "entra"
        ? { style: { opacity: e, transform: `scale(${1.04 - 0.04 * e})` } }
        : { style: { transform: `scale(${1 + 0.03 * e})` } };
    }
    case "tarjeta": {
      if (rol === "sale") {
        const u = Easing.in(Easing.cubic)(lim(t / 0.5, 0, 1));
        const a = d * 90 * u;
        return { style: { transform: `perspective(2400px) rotateY(${-a}deg)`, filter: `brightness(${1 - 0.5 * u})` } };
      }
      if (t < 0.5) return { style: { opacity: 0 } };
      const u = Easing.out(Easing.back(1.3))(lim((t - 0.5) / 0.5, 0, 1));
      const a = d * 90 * (1 - u);
      return { style: { transform: `perspective(2400px) rotateY(${a}deg)`, filter: `brightness(${0.5 + 0.5 * Math.min(1, u)})` } };
    }
    case "golpe": {
      if (rol === "sale") return {};
      const [sx, sy] = sacudida(g, 0, 26, 12);
      const s = 1 + 0.12 * (1 - Easing.out(Easing.cubic)(t));
      const op = lim(1 - t * 1.8, 0, 1);
      const col = o.color ?? C.negro;
      return {
        style: { transform: `translate(${sx}px,${sy}px) scale(${s})` },
        capa:
          op > 0 ? (
            <Overlay>
              <g opacity={op * 0.75}>
                {Array.from({ length: 20 }, (_, k) => {
                  const a = (k / 20) * Math.PI * 2 + random(`golpe${k}`) * 0.2;
                  const r1 = 560 + random(`golpe-r${k}`) * 160 + t * 200;
                  const ancho = 0.018 + random(`golpe-a${k}`) * 0.02;
                  const r2 = 1400;
                  return (
                    <path
                      key={k}
                      d={`M${px + Math.cos(a) * r1},${py + Math.sin(a) * r1} L${px + Math.cos(a - ancho) * r2},${py + Math.sin(a - ancho) * r2} L${px + Math.cos(a + ancho) * r2},${py + Math.sin(a + ancho) * r2} Z`}
                      fill={col}
                    />
                  );
                })}
              </g>
            </Overlay>
          ) : null,
      };
    }
    case "diagonal": {
      const e = inOutCubic(t);
      if (rol === "sale")
        return {
          style: { transform: `translate(${-d * W * 0.2 * e}px,${-H * 0.2 * e}px) scale(${1 - 0.08 * e})`, filter: `brightness(${1 - 0.4 * e})` },
        };
      return {
        style: {
          transform: `translate(${d * W * 1.05 * (1 - e)}px,${H * 1.05 * (1 - e)}px) rotate(${d * 5 * (1 - e)}deg)`,
          boxShadow: "-40px -40px 80px rgba(18,12,46,0.6)",
        },
      };
    }
    case "abanico": {
      if (rol === "sale") return { style: { transform: `scale(${1 - 0.03 * t})` } };
      const e = inOutCubic(t);
      const a0 = -Math.PI / 2;
      const a1 = a0 + d * Math.PI * 2 * e;
      const R = 2400;
      const pts: string[] = [`${px}px ${py}px`];
      const n = Math.max(2, Math.ceil(36 * e));
      for (let k = 0; k <= n; k++) {
        const a = a0 + ((a1 - a0) * k) / n;
        pts.push(`${(px + Math.cos(a) * R).toFixed(1)}px ${(py + Math.sin(a) * R).toFixed(1)}px`);
      }
      return {
        style: { clipPath: t < 1 ? `polygon(${pts.join(",")})` : undefined },
        capa:
          t < 1 ? (
            <Overlay>
              <line x1={px} y1={py} x2={px + Math.cos(a1) * R} y2={py + Math.sin(a1) * R} stroke={o.color2 ?? C.negro} strokeWidth={34} opacity={0.35} />
              <line x1={px} y1={py} x2={px + Math.cos(a1) * R} y2={py + Math.sin(a1) * R} stroke={o.color ?? C.amarillo} strokeWidth={16} />
              <circle cx={px} cy={py} r={26} fill={o.color ?? C.amarillo} stroke={o.color2 ?? C.negro} strokeWidth={6} />
            </Overlay>
          ) : null,
      };
    }
  }
  return {};
};

/**
 * Envoltorio de una escena con su transición de entrada y (si hay escena siguiente) la de salida, que es la de la
 * siguiente. `sale.desde` = fotograma local en que arranca la salida.
 */
export const Plano: React.FC<{
  entra?: TransicionSpec | null;
  sale?: { spec: TransicionSpec; desde: number } | null;
  children: React.ReactNode;
}> = ({ entra, sale, children }) => {
  const f = useCurrentFrame();
  const uid = useUid("pl");
  const rin = entra ? resolver(entra) : null;
  const rout = sale ? resolver(sale.spec) : null;
  const eIn = rin && f < rin.dura ? efecto(rin, lim(f / rin.dura, 0, 1), "entra", f, `${uid}e`) : null;
  const eOut = rout && sale && f >= sale.desde ? efecto(rout, lim((f - sale.desde) / rout.dura, 0, 1), "sale", f - sale.desde, `${uid}s`) : null;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {eIn?.defs}
      {eOut?.defs}
      <AbsoluteFill style={eIn?.style}>
        <AbsoluteFill style={eOut?.style}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {eIn?.capa}
    </AbsoluteFill>
  );
};

export type PlanoSecuencia = {
  id: string;
  /** fotograma (absoluto dentro de la secuencia) en que arranca su transición de entrada */
  inicio: number;
  /** transición de entrada: tipo, opciones, "auto" (rotación sin repetir) o "ninguna". La primera escena no lleva, salvo que se pida. */
  transicion?: TransicionSpec | "auto" | "ninguna";
  /** la escena; dur = fotogramas hasta que arranca la siguiente */
  nodo: (dur: number) => React.ReactNode;
};

/**
 * Escenas en fila con transiciones de verdad: durante la transición se ven las dos (la vieja sale y la nueva entra).
 * `total` = fotogramas de toda la secuencia. Sin `transicion`, cada escena (menos la primera) lleva
 * transicionPara(k, semilla, lista): nunca la misma dos veces seguidas.
 */
export const SecuenciaPlanos: React.FC<{
  planos: PlanoSecuencia[];
  total: number;
  semilla?: string | number;
  lista?: TipoTransicion[];
}> = ({ planos, total, semilla = "", lista }) => {
  const specs: (TransicionSpec | null)[] = planos.map((p, k) => {
    const t = p.transicion ?? (k === 0 ? "ninguna" : "auto");
    if (t === "ninguna") return null;
    if (t === "auto") return transicionPara(k, semilla, lista);
    return t;
  });
  return (
    <AbsoluteFill>
      {planos.map((p, k) => {
        const ini = p.inicio;
        const sig = k < planos.length - 1 ? planos[k + 1].inicio : total;
        const dur = Math.max(1, sig - ini);
        const sigSpec = k < planos.length - 1 ? specs[k + 1] : null;
        const sol = sigSpec ? solapeDe(sigSpec) : 0;
        const largo = Math.max(1, Math.min(total - ini, dur + sol));
        return (
          <Sequence key={p.id} from={ini} durationInFrames={largo}>
            <Plano entra={specs[k]} sale={sigSpec ? { spec: sigSpec, desde: dur } : null}>
              {p.nodo(dur)}
            </Plano>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Escena del Montaje con transición de entrada opcional (si falta, rota sola sin repetir). */
export type EscenaNarrativa = Escena & { transicion?: TransicionSpec | "auto" | "ninguna" };

/**
 * El Montaje de estilos/base (voz, música y efectos, igual) con escenas que se solapan y transiciones variadas.
 * Mismas props que <Montaje>; las escenas pueden llevar `transicion`. Cada transición queda centrada en la palabra
 * en que arranca la escena (el golpe cae justo en ella). `lista` limita las transiciones de la rotación y `semilla`
 * cambia el orden (pon el nombre del capítulo). La cámara queda quieta: el movimiento lo hace cada escena con
 * RigCamara. `marco` (opcional) envuelve cada escena por dentro de la transición.
 */
export const MontajeNarrativo: React.FC<
  Omit<React.ComponentProps<typeof Montaje>, "escenas"> & {
    escenas: EscenaNarrativa[];
    lista?: TipoTransicion[];
    semilla?: string | number;
  }
> = (props) => {
  const { escenas, lista, semilla = "", palabras, adelanto = 4, marco: Marco, ...resto } = props;
  const { durationInFrames } = useVideoConfig();
  const pal = palabras ?? [];
  if (!pal.length) return null;
  const fr = (i: number) => Math.round(pal[Math.max(0, Math.min(i, pal.length - 1))].inicio * FPS);
  const specs = escenas.map((e, k) => {
    const t = e.transicion ?? (k === 0 ? "ninguna" : "auto");
    if (t === "ninguna") return "ninguna" as const;
    if (t === "auto") return transicionPara(k, semilla, lista);
    return t;
  });
  const inicios: number[] = [];
  escenas.forEach((e, k) => {
    if (k === 0) return inicios.push(0);
    const s = specs[k];
    const r = s === "ninguna" ? null : resolver(s);
    const mitad = !r || r.tipo === "golpe" ? 0 : Math.floor(r.dura / 2);
    inicios.push(Math.max(inicios[k - 1] + 1, fr(e.desde) - adelanto - mitad));
  });
  const planos: PlanoSecuencia[] = escenas.map((e, k) => ({
    id: e.id,
    inicio: inicios[k],
    transicion: specs[k],
    nodo: (dur) => {
      const Comp = e.comp;
      const dentro = <Comp w={(i) => fr(i) - inicios[k]} dur={dur} />;
      return Marco ? <Marco dur={dur}>{dentro}</Marco> : dentro;
    },
  }));
  return (
    <AbsoluteFill>
      <Montaje {...resto} palabras={palabras} adelanto={adelanto} escenas={[]} />
      <SecuenciaPlanos planos={planos} total={durationInFrames} semilla={semilla} lista={lista} />
    </AbsoluteFill>
  );
};

/**
 * Marco para el <Montaje> de siempre (marco={CamaraNarrativa}): a diferencia de CamaraViva, NO hace push-in ni zoom de
 * entrada; la escena queda quieta (el movimiento lo pone la escena con RigCamara) y entra con una transición que rota
 * sola. Como el Montaje no solapa escenas, aquí la transición solo anima la entrada (la escena vieja no se ve debajo);
 * para transiciones completas usa <MontajeNarrativo>. "auto" evita repetir entre escenas vecinas (elige por el
 * fotograma de inicio). sacudidaEn = fotograma local de un golpe.
 */
export const CamaraNarrativa: React.FC<{
  dur: number;
  children: React.ReactNode;
  transicion?: TransicionSpec | "auto" | "ninguna";
  lista?: TipoTransicion[];
  semilla?: string | number;
  sacudidaEn?: number;
  fuerza?: number;
}> = ({ children, transicion = "auto", lista, semilla = "", sacudidaEn, fuerza = 18 }) => {
  const f = useCurrentFrame();
  const ctx = useContext(Internals.SequenceContext);
  const abs = ctx ? ctx.cumulatedFrom + ctx.relativeFrom : 0;
  const spec =
    transicion === "ninguna" || (transicion === "auto" && abs < 2)
      ? null
      : transicion === "auto"
        ? transicionPara(Math.round(abs / 40), semilla, lista, 4)
        : transicion;
  const [sx, sy] = sacudida(f, sacudidaEn, fuerza);
  return (
    <Plano entra={spec}>
      <AbsoluteFill style={{ transform: sx || sy ? `translate(${sx}px,${sy}px)` : undefined }}>{children}</AbsoluteFill>
    </Plano>
  );
};

/** Fábrica: CamaraNarrativa con opciones fijas, para `marco` (p. ej. solo ciertas transiciones). */
export const camaraNarrativa =
  (opciones: Omit<React.ComponentProps<typeof CamaraNarrativa>, "dur" | "children">): React.FC<{ dur: number; children: React.ReactNode }> =>
  ({ dur, children }) => (
    <CamaraNarrativa dur={dur} {...opciones}>
      {children}
    </CamaraNarrativa>
  );
