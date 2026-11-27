// Biblioteca Plano Pop · efectos ricos: humo, explosión, fuego, estela, postquemador, polvo, escombros, chispas y
// ondas de calor con volumen, al nivel de la referencia (The Infographics Show). Reemplazan a Llamas, Explosion,
// Explosion2, ColumnaHumo, Vapor e Incendio en los videos nuevos (lección del 2026-11-24: «el humo, las explosiones,
// todo se ve muy, muy básico»).
//
// Cómo se dibuja el volumen: el humo y la bola de fuego son muchas bocanadas que se pintan «en pasadas» (primero el
// contorno de todas, luego la sombra de todas, luego el color base corrido hacia la luz y al final el brillo). Así
// las bocanadas se funden en una sola nube con un contorno oscuro suave, sombra del lado contrario a la luz y luces
// del lado de la luz. Lo que se disipa se desvanece con una máscara (sin costuras entre bocanadas).
//
// Todo es determinista (random() de Remotion con `semilla`) y va dentro de <Lienzo> (1920×1080).
// f = fotograma local; desde = fotograma en que arranca; s = escala. Catálogo con ejemplos: ./CATALOGO.md
import React, { useId } from "react";
import { random } from "remotion";
import { C } from "../kit";
import { lim } from "./paleta";
import { useCamara } from "./camara-rig";
import { aclarar, mezclaColor, oscurecer } from "./volumen";

// ---------- utilidades ----------
const useIdLimpio = (pre: string) => pre + useId().replace(/[^a-zA-Z0-9]/g, "");
const LUZ: [number, number] = [-0.56, -0.83]; // luz arriba a la izquierda
const norm = (x: number, y: number): [number, number] => {
  const d = Math.hypot(x, y) || 1;
  return [x / d, y / d];
};
const suaveT = (t: number) => {
  const u = lim(t, 0, 1);
  return u * u * (3 - 2 * u);
};
/** Rampa de color por puntos [pos, color]: pos de 0 a 1 en orden. */
const rampa = (t: number, puntos: [number, string][]) => {
  const u = lim(t, 0, 1);
  for (let i = 1; i < puntos.length; i++) {
    const [p1, c1] = puntos[i];
    const [p0, c0] = puntos[i - 1];
    if (u <= p1) return mezclaColor(c0, c1, (u - p0) / Math.max(1e-6, p1 - p0));
  }
  return puntos[puntos.length - 1][1];
};
/** Calor (1 = blanco, 0 = humo oscuro) → color de fuego. */
export const colorCalor = (calor: number, humo = "#55505F") =>
  rampa(calor, [
    [0, humo],
    [0.14, "#6E3A3A"],
    [0.3, C.rojo2],
    [0.45, C.rojo],
    [0.62, C.naranja],
    [0.8, C.amarillo],
    [0.93, C.crema],
    [1, "#FFFFFF"],
  ]);

// ---------- bocanadas con volumen ----------
export type Bocanada = {
  x: number;
  y: number;
  r: number;
  color: string;
  /** 0..1: se aplica con máscara (sin costuras). */
  o?: number;
  /** Dirección hacia la luz (vector unitario). Por defecto arriba a la izquierda. */
  luz?: [number, number];
  /** Deformación −0,3..0,3 (elipse) y su giro en grados. */
  def?: number;
  rot?: number;
  /** Color del contorno (por defecto, el color oscurecido). */
  borde?: string;
};

/**
 * Nube hecha de bocanadas con volumen de 3 tonos (sombra, base, luz y brillo) y contorno oscuro suave. Es el
 * motor de Humo, ExplosionRica, Estela y PolvoImpacto; sirve para cualquier nube a mano (pásale tus bocanadas).
 * contorno 0..1 = fuerza del borde oscuro; grosor = px del borde (a s=1).
 */
export const NubeBocanadas: React.FC<{
  b: Bocanada[];
  contorno?: number;
  grosor?: number;
  brillo?: boolean;
}> = ({ b, contorno = 0.75, grosor = 4, brillo = true }) => {
  const id = useIdLimpio("nb");
  const vis = b.filter((p) => p.r > 0.5 && (p.o ?? 1) > 0.01);
  if (!vis.length) return null;
  const conMascara = vis.some((p) => (p.o ?? 1) < 0.995);
  const forma = (
    p: Bocanada,
    k: string,
    dx: number,
    dy: number,
    esc: number,
    extra: number,
    fill: string,
    op?: number,
  ) => {
    const d = p.def ?? 0;
    const rx = p.r * esc * (1 + d) + extra;
    const ry = p.r * esc * (1 - d) + extra;
    const cx = p.x + dx;
    const cy = p.y + dy;
    return Math.abs(d) < 0.01 ? (
      <circle key={k} cx={cx} cy={cy} r={rx} fill={fill} opacity={op} />
    ) : (
      <ellipse
        key={k}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={fill}
        opacity={op}
        transform={`rotate(${p.rot ?? 0} ${cx} ${cy})`}
      />
    );
  };
  const g = (p: Bocanada) => grosor * (0.6 + Math.min(1, p.r / 90) * 0.6);
  const capas = (
    <g>
      {contorno > 0 ? (
        <g opacity={contorno}>
          {vis.map((p, i) =>
            forma(p, `c${i}`, 0, 0, 1, g(p), p.borde ?? oscurecer(p.color, 0.62)),
          )}
        </g>
      ) : null}
      {vis.map((p, i) =>
        forma(p, `s${i}`, 0, 0, 1, 0, oscurecer(p.color, 0.3)),
      )}
      {vis.map((p, i) => {
        // base, luz y brillo de cada bocanada juntos: la siguiente tapa las luces de la anterior, así solo
        // quedan luces en el borde de cada bulto (no puntos por todo el interior)
        const [lx, ly] = p.luz ?? LUZ;
        return (
          <g key={`p${i}`}>
            {forma(p, "b", lx * p.r * 0.13, ly * p.r * 0.13, 0.87, 0, p.color)}
            {forma(p, "l", lx * p.r * 0.3, ly * p.r * 0.3, 0.62, 0, aclarar(p.color, 0.15), 0.95)}
            {brillo && p.r >= 30
              ? forma(p, "h", lx * p.r * 0.6, ly * p.r * 0.6, 0.12, 0, aclarar(p.color, 0.4), 0.45)
              : null}
          </g>
        );
      })}
    </g>
  );
  if (!conMascara) return capas;
  return (
    <g>
      <defs>
        <mask
          id={id}
          maskUnits="userSpaceOnUse"
          x={-6000}
          y={-6000}
          width={12000}
          height={12000}
        >
          {vis.map((p, i) =>
            forma(p, `m${i}`, 0, 0, 1, g(p) + 1, "#FFFFFF", p.o ?? 1),
          )}
        </mask>
      </defs>
      <g mask={`url(#${id})`}>{capas}</g>
    </g>
  );
};

// ---------- humo ----------
export type VarianteHumo =
  | "chimenea"
  | "incendio"
  | "volcan"
  | "residual"
  | "vapor";
type AjusteHumo = {
  n: number;
  vida: number;
  alto: number;
  ancho: number;
  r0: number;
  r1: number;
  viento: number;
  joven: string;
  viejo: string;
  paraguas: number;
  turb: number;
  dura?: number;
  curva: number;
  encoge?: number;
};
const HUMOS: Record<VarianteHumo, AjusteHumo> = {
  chimenea: {
    n: 22,
    vida: 120,
    alto: 560,
    ancho: 26,
    r0: 20,
    r1: 88,
    viento: 1.3,
    joven: "#F4F1EA",
    viejo: "#8D91A2",
    paraguas: 0,
    turb: 22,
    curva: 1.4,
  },
  incendio: {
    n: 28,
    vida: 130,
    alto: 640,
    ancho: 240,
    r0: 60,
    r1: 160,
    viento: 1.1,
    joven: "#7C7480",
    viejo: "#3E3A4A",
    paraguas: 0,
    turb: 34,
    curva: 1.3,
  },
  volcan: {
    n: 48,
    vida: 170,
    alto: 820,
    ancho: 150,
    r0: 80,
    r1: 190,
    viento: 0.5,
    joven: "#8D807A",
    viejo: "#4A4452",
    paraguas: 1,
    turb: 30,
    curva: 1.05,
    encoge: 0.5,
  },
  residual: {
    n: 18,
    vida: 190,
    alto: 300,
    ancho: 260,
    r0: 60,
    r1: 140,
    viento: 0.5,
    joven: "#9E9AA6",
    viejo: "#666979",
    paraguas: 0,
    turb: 28,
    dura: 40,
    curva: 1.8,
  },
  vapor: {
    n: 12,
    vida: 70,
    alto: 220,
    ancho: 30,
    r0: 14,
    r1: 52,
    viento: 0.6,
    joven: "#FFFFFF",
    viejo: "#D8E2EE",
    paraguas: 0,
    turb: 14,
    curva: 1.6,
  },
};

/** Bocanadas de humo en el fotograma f (coordenadas locales, base en 0,0). La usan Humo y Fuego. */
export const bocanadasHumo = (
  f: number,
  a: AjusteHumo & {
    semilla: string;
    desde: number;
    intensidad: number;
    colores?: [string, string];
  },
): Bocanada[] => {
  const T = f - a.desde;
  if (T < 0) return [];
  const [joven, viejo] = a.colores ?? [a.joven, a.viejo];
  const per = a.vida / a.n;
  const out: (Bocanada & { edad: number })[] = [];
  for (let k = 0; k < a.n; k++) {
    const off = k * per;
    if (T < off) continue;
    let c = Math.floor((T - off) / a.vida);
    if (a.dura !== undefined) {
      if (a.dura < off) continue;
      c = Math.min(c, Math.floor((a.dura - off) / a.vida));
    }
    const nace = off + c * a.vida;
    const edad = T - nace;
    if (edad >= a.vida) continue;
    const u = edad / a.vida;
    const sem = `${a.semilla}h${k}-${c}`;
    const rnd = (s: string) => random(sem + s);
    const jx = (rnd("x") - 0.5) * a.ancho;
    const sube =
      a.alto * (1 - Math.pow(1 - u, a.curva)) * (0.85 + rnd("a") * 0.3);
    let x =
      jx * (1 + u * 1.4) +
      a.viento * edad * (0.25 + u) +
      Math.sin(edad / (13 + rnd("w") * 9) + rnd("p") * 6) * a.turb * (0.3 + u);
    let y =
      -sube +
      Math.cos(edad / (17 + rnd("v") * 8) + rnd("q") * 6) * a.turb * 0.45 * u;
    if (a.paraguas > 0 && u > 0.55) {
      const v = (u - 0.55) / 0.45;
      const lado = rnd("d") < 0.5 ? -1 : 1;
      x +=
        lado * suaveT(v) * a.alto * 0.55 * (0.3 + rnd("e") * 0.7) * a.paraguas;
      y += v * a.alto * 0.12;
    }
    const nacer = Math.min(1, u / 0.07);
    const r =
      (a.r0 + (a.r1 - a.r0) * Math.pow(u, 0.6)) *
      (0.75 + 0.5 * rnd("r")) *
      (0.35 + 0.65 * nacer) *
      (0.45 + 0.55 * a.intensidad) *
      // se disipa encogiéndose (no como un disco fantasma)
      (1 - (a.encoge ?? 0.82) * Math.pow(suaveT((u - 0.5) / 0.5), 1.3));
    const o =
      (u > 0.86 ? 1 - suaveT((u - 0.86) / 0.14) : 1) *
      Math.min(1, a.intensidad * 1.5);
    out.push({
      x,
      y,
      r,
      color: mezclaColor(joven, viejo, Math.min(1, Math.pow(u, 0.7) * 1.15)),
      o,
      def: 0.14 * Math.sin(edad / 11 + rnd("f") * 6),
      rot: rnd("g") * 180 + edad * 0.6,
      edad,
    });
  }
  return out.sort((p, q) => q.edad - p.edad);
};

/**
 * Humo con volumen: columna o nube de muchas bocanadas que nacen, crecen, se enfrían de color (claro → oscuro),
 * se deforman con turbulencia, derivan con el viento y se disipan. x,y = de dónde sale.
 * variante: "chimenea" (fina, blanca), "incendio" (ancha y oscura), "volcan" (columna de ceniza que se abre en
 * paraguas arriba), "residual" (lo que queda tras una explosión: sale `dura` fotogramas y se queda subiendo
 * despacio) o "vapor". Cualquier ajuste se puede cambiar: alto, ancho, viento (px/fotograma, + = derecha), vida,
 * n, dura (fotogramas que emite; sin ella emite siempre), colores [joven, viejo]. intensidad 0..1 (anímala).
 */
export const Humo: React.FC<{
  x: number;
  y: number;
  f: number;
  desde?: number;
  s?: number;
  variante?: VarianteHumo;
  alto?: number;
  ancho?: number;
  viento?: number;
  vida?: number;
  n?: number;
  dura?: number;
  colores?: [string, string];
  intensidad?: number;
  contorno?: number;
  semilla?: string;
}> = ({
  x,
  y,
  f,
  desde = 0,
  s = 1,
  variante = "chimenea",
  intensidad = 1,
  contorno = 0.7,
  semilla = "humo",
  ...ajustes
}) => {
  const base = HUMOS[variante];
  const a: AjusteHumo = {
    ...base,
    alto: ajustes.alto ?? base.alto,
    ancho: ajustes.ancho ?? base.ancho,
    viento: ajustes.viento ?? base.viento,
    vida: ajustes.vida ?? base.vida,
    n: ajustes.n ?? base.n,
    dura: ajustes.dura ?? base.dura,
  };
  if (intensidad <= 0.001) return null;
  const b = bocanadasHumo(f, {
    ...a,
    semilla,
    desde,
    intensidad,
    colores: ajustes.colores,
  });
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <NubeBocanadas b={b} contorno={contorno} grosor={4} />
    </g>
  );
};

// ---------- fuego ----------
const lengua = (cx: number, b: number, h: number, sw: number) =>
  // lengua de fuego orgánica: base redonda, panza abajo, hombro y punta que se curva
  `M${cx - b},0 C${cx - b * 1.25},${-h * 0.25} ${cx - b * 0.85 + sw * 0.2},${-h * 0.5} ${cx - b * 0.35 + sw * 0.55},${-h * 0.72} ` +
  `C${cx - b * 0.1 + sw * 0.8},${-h * 0.84} ${cx + sw * 1.1},${-h * 0.9} ${cx + sw},${-h} ` +
  `C${cx + sw * 0.6 + b * 0.25},${-h * 0.8} ${cx + b * 0.55 + sw * 0.35},${-h * 0.62} ${cx + b * 0.75 + sw * 0.15},${-h * 0.42} ` +
  `C${cx + b * 1.05},${-h * 0.25} ${cx + b * 1.15},${-h * 0.1} ${cx + b},0 Q${cx},${b * 0.55} ${cx - b},0 Z`;

/**
 * Fuego con volumen: varias lenguas que se mueven cada una a su ritmo, en 5 tonos (borde rojo oscuro, rojo,
 * naranja, amarillo y núcleo claro), llamitas que se sueltan arriba, brasas que suben, resplandor en el suelo y
 * humo oscuro encima. x,y = centro de la base. w = ancho, alto = alto de las llamas. n = lenguas.
 * intensidad 0..1 (anímala para que prenda o se apague). inclina = viento (−1..1). humo = false lo quita.
 */
export const Fuego: React.FC<{
  x: number;
  y: number;
  f: number;
  w?: number;
  alto?: number;
  n?: number;
  s?: number;
  intensidad?: number;
  inclina?: number;
  humo?: boolean;
  brasas?: number;
  semilla?: string;
}> = ({
  x,
  y,
  f,
  w = 360,
  alto = 420,
  n = 5,
  s = 1,
  intensidad = 1,
  inclina = 0,
  humo = true,
  brasas = 16,
  semilla = "fuego",
}) => {
  const id = useIdLimpio("fg");
  if (intensidad <= 0.001) return null;
  const I = Math.min(1, intensidad);
  const rnd = (s2: string) => random(semilla + s2);
  // una onda recorre todo el fuego: las lenguas vecinas se mecen juntas, cada una con su propio parpadeo
  const meneo = (cx: number, h: number) =>
    (Math.sin(f * 0.19 + (cx / w) * 3.2) * 0.07 + Math.sin(f * 0.43 + (cx / w) * 7.1) * 0.03) * w +
    inclina * h * 0.35;
  const hacerCapa = (sem: string, nL: number, Wk: number, Hk: number) =>
    Array.from({ length: nL }, (_, j) => {
      const u = (j + 0.5) / nL;
      const cx = (u - 0.5) * Wk * w * 0.86 + (rnd(`${sem}x${j}`) - 0.5) * (Wk * w) / nL * 0.4;
      const centro = Math.max(0, 1 - Math.pow(Math.abs(cx) / (Wk * w * 0.5), 1.8));
      const v = 0.8 + rnd(`${sem}v${j}`) * 0.8;
      const fl = 0.8 + 0.13 * Math.sin(f * 0.37 * v + j * 2.1) + 0.08 * Math.sin(f * 0.93 * v + j * 4.3);
      const h = Hk * alto * (0.4 + 0.6 * centro) * (0.6 + 0.4 * rnd(`${sem}h${j}`)) * fl * I;
      const b = ((Wk * w) / nL) * 0.95 * (0.8 + 0.4 * rnd(`${sem}b${j}`)) * (0.6 + 0.4 * I);
      const rizo = Math.sin(f * 0.31 * v + j * 1.7 + rnd(`${sem}p${j}`) * 6) * b * 0.9;
      return { cx, h, b, sw: meneo(cx, h) + rizo };
    });
  const rojas = hacerCapa("r", n, 1, 1);
  type CapaFuego = { color: string; rx: number; ry: number; dy: number; lenguas: { cx: number; h: number; b: number; sw: number }[] };
  const capa = (color: string, Wk: number, Hk: number, nL: number, cuerpo: number, dy: number, sem: string): CapaFuego => ({
    color,
    rx: Wk * w * 0.5,
    ry: Hk * alto * cuerpo * I * (0.95 + 0.05 * Math.sin(f * 0.5 + Wk * 9)),
    dy,
    lenguas: hacerCapa(sem, nL, Wk, Hk),
  });
  const capas: CapaFuego[] = [
    // borde rojo oscuro = las mismas lenguas rojas, un poco más grandes
    {
      color: C.rojo2,
      rx: w * 0.5 + 5,
      ry: alto * 0.3 * I + 5,
      dy: 0,
      lenguas: rojas.map((l) => ({ ...l, b: l.b + 5, h: l.h + 6 })),
    },
    { color: C.rojo, rx: w * 0.5, ry: alto * 0.3 * I, dy: 0, lenguas: rojas },
    capa(C.naranja, 0.8, 0.82, Math.max(2, Math.round(n * 0.7)), 0.34, 0, "n"),
    capa(C.amarillo, 0.6, 0.62, Math.max(2, Math.round(n * 0.45)), 0.4, 2, "a"),
    capa(C.crema, 0.3, 0.34, Math.max(2, Math.round(n * 0.3)), 0.3, 4, "c"),
  ];
  const lenguas = rojas.map((l, k) => ({ ...l, k }));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}s`}>
          <stop offset="0%" stopColor={C.amarillo} stopOpacity={0.75} />
          <stop offset="50%" stopColor={C.naranja} stopOpacity={0.3} />
          <stop offset="100%" stopColor={C.naranja} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}r`} cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor={C.amarillo} stopOpacity={0.7} />
          <stop offset="45%" stopColor={C.naranja} stopOpacity={0.32} />
          <stop offset="100%" stopColor={C.naranja} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* resplandor */}
      <ellipse
        cx={0}
        cy={-alto * 0.38 * I}
        rx={w * 1.25}
        ry={alto * 0.95 * I + 40}
        fill={`url(#${id}r)`}
        opacity={(0.85 + 0.15 * Math.sin(f / 3)) * I}
      />
      {/* humo oscuro encima */}
      {humo ? (
        <g transform={`translate(${inclina * alto * 0.3},${-alto * 0.62 * I})`}>
          <NubeBocanadas
            b={bocanadasHumo(f, {
              ...HUMOS.incendio,
              ancho: w * 0.55,
              r0: w * 0.2,
              r1: w * 0.42,
              alto: alto * 1.5,
              viento: 0.8 + inclina * 2,
              semilla: semilla + "h",
              desde: -200,
              intensidad: I,
            })}
            contorno={0.7}
          />
        </g>
      ) : null}
      {/* luz en el suelo */}
      <ellipse
        cx={0}
        cy={4}
        rx={w * 0.95}
        ry={w * 0.12 + 8}
        fill={`url(#${id}s)`}
        opacity={(0.85 + 0.15 * Math.sin(f / 2.3)) * I}
      />
      {/* cuerpo y lenguas, en pasadas de color (de afuera hacia adentro) */}
      {capas.map((c, ci) => (
        <g key={ci} transform={`translate(0,${c.dy})`} fill={c.color}>
          <path
            d={`M${-c.rx},0 C${-c.rx},${-c.ry * 1.25} ${c.rx},${-c.ry * 1.25} ${c.rx},0 Q0,${c.ry * 0.12} ${-c.rx},0 Z`}
          />
          {c.lenguas.map((l, j) => (
            <path key={j} d={lengua(l.cx, l.b, l.h, l.sw)} />
          ))}
        </g>
      ))}
      {/* llamitas que se sueltan y suben */}
      {Array.from({ length: 6 }, (_, k) => {
        const vida = 16 + rnd(`lv${k}`) * 10;
        const fase = f + rnd(`lf${k}`) * vida;
        const t = (fase % vida) / vida;
        const ciclo = Math.floor(fase / vida);
        const l = lenguas[Math.floor(random(`${semilla}lq${k}-${ciclo}`) * n)];
        const lx = l.cx + l.sw * 0.9 + Math.sin(f / 4 + k) * 6;
        const ly = -l.h * (0.88 + t * 0.55);
        const e = (1 - t) * (0.55 + rnd(`le${k}`) * 0.45);
        const hb = alto * 0.16 * e;
        return (
          <g key={`l${k}`} transform={`translate(${lx},${ly})`}>
            <path
              d={lengua(0, hb * 0.32, hb, Math.sin(f / 3 + k) * hb * 0.3)}
              fill={C.naranja}
            />
            <path
              d={lengua(0, hb * 0.18, hb * 0.6, Math.sin(f / 3 + k) * hb * 0.2)}
              fill={C.amarillo}
              transform="translate(0,2)"
            />
          </g>
        );
      })}
      {/* brasas */}
      {Array.from({ length: brasas }, (_, k) => {
        const vida = 34 + rnd(`bv${k}`) * 30;
        const t = ((f + rnd(`bs${k}`) * vida) % vida) / vida;
        const bx =
          (rnd(`bx${k}`) - 0.5) * w * 0.8 +
          Math.sin(f / 5 + k * 1.3) * 26 * t +
          inclina * t * alto * 0.4;
        const by = -alto * 0.35 * I - t * alto * 1.15;
        const r = (5 - t * 3) * (0.7 + rnd(`br${k}`) * 0.6);
        return (
          <g key={`b${k}`} opacity={(1 - t) * I}>
            <circle
              cx={bx}
              cy={by}
              r={r * 2.4}
              fill={C.naranja}
              opacity={0.35}
            />
            <circle cx={bx} cy={by} r={r} fill={k % 3 ? C.amarillo : C.crema} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- chispas ----------
/**
 * Chispas en estela (rayitas brillantes con frenado y gravedad). Estallido único desde `desde` o, con
 * `continuo`, chorro sin fin (soldadura, esmeril, cohete). dir/abre en grados (−90 = hacia arriba; abre 360 =
 * en todas direcciones). vel en px/fotograma, gravedad en px/fotograma².
 */
export const Chispas: React.FC<{
  x: number;
  y: number;
  f: number;
  desde?: number;
  n?: number;
  vel?: number;
  dir?: number;
  abre?: number;
  gravedad?: number;
  vida?: number;
  largo?: number;
  grosor?: number;
  continuo?: boolean;
  colores?: string[];
  s?: number;
  semilla?: string;
}> = ({
  x,
  y,
  f,
  desde = 0,
  n = 26,
  vel = 18,
  dir = -90,
  abre = 360,
  gravedad = 0.35,
  vida = 30,
  largo = 1,
  grosor = 4,
  continuo = false,
  colores = [C.blanco, C.amarillo, C.amarillo, C.naranja],
  s = 1,
  semilla = "chis",
}) => {
  const T = f - desde;
  if (T < 0 || (!continuo && T > vida * 1.6)) return null;
  const pos = (ang: number, v: number, tau: number) => {
    const d = v * 9 * (1 - Math.exp(-tau / 9));
    return [
      Math.cos(ang) * d,
      Math.sin(ang) * d + 0.5 * gravedad * tau * tau,
    ] as const;
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} strokeLinecap="round">
      {Array.from({ length: n }, (_, k) => {
        let c = 0;
        let tau = T;
        if (continuo) {
          const off = (k / n) * vida;
          if (T < off) return null;
          c = Math.floor((T - off) / vida);
          tau = T - off - c * vida;
        }
        const rnd = (q: string) => random(`${semilla}${k}-${c}${q}`);
        const vk = vida * (0.6 + rnd("l") * 0.6);
        if (tau > vk) return null;
        const a = tau / vk;
        const ang = ((dir + (rnd("a") - 0.5) * abre) * Math.PI) / 180;
        const v = vel * (0.45 + rnd("v") * 0.75);
        const [x1, y1] = pos(ang, v, tau);
        const [x0, y0] = pos(ang, v, Math.max(0, tau - 2.6 * largo));
        const col = colores[Math.floor(rnd("c") * colores.length)];
        const parp = 0.75 + 0.25 * Math.sin(f * 1.7 + k);
        return (
          <g key={k} opacity={(1 - a * a) * parp}>
            <line
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke={C.naranja}
              strokeWidth={grosor * 2.4 * (1 - a * 0.6)}
              opacity={0.3}
            />
            <line
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke={col}
              strokeWidth={grosor * (1 - a * 0.65)}
            />
          </g>
        );
      })}
    </g>
  );
};

// ---------- escombros ----------
/**
 * Escombros que salen en arco con gravedad, giran y dejan estela de humo (algunos arden). Con `suelo` (y local,
 * px bajo el origen; 0 = el mismo y) caen y se quedan. dir/abre en grados (−90 = arriba; abre 360 = todas).
 */
export const Escombros: React.FC<{
  x: number;
  y: number;
  f: number;
  desde?: number;
  n?: number;
  vel?: number;
  dir?: number;
  abre?: number;
  gravedad?: number;
  tam?: number;
  suelo?: number;
  color?: string;
  estela?: boolean;
  arden?: number;
  vida?: number;
  freno?: number;
  s?: number;
  semilla?: string;
}> = ({
  x,
  y,
  f,
  desde = 0,
  n = 12,
  vel = 14,
  dir = -90,
  abre = 150,
  gravedad = 0.5,
  tam = 16,
  suelo,
  color = "#3A3350",
  estela = true,
  arden = 0.35,
  vida = 75,
  freno = 40,
  s = 1,
  semilla = "esc",
}) => {
  const T = f - desde;
  if (T < 0 || T > vida) return null;
  const fin = 1 - suaveT((T - vida * 0.7) / (vida * 0.3));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: n }, (_, k) => {
        const rnd = (q: string) => random(`${semilla}${k}${q}`);
        const ang = ((dir + (rnd("a") - 0.5) * abre) * Math.PI) / 180;
        const v = vel * (0.5 + rnd("v") * 0.7);
        const vx = Math.cos(ang) * v;
        const vy = Math.sin(ang) * v;
        const g = gravedad * (0.8 + rnd("g") * 0.4);
        // con freno (resistencia del aire): la velocidad cae y la gravedad sigue
        const libre = (tau: number) => {
          const te = freno * (1 - Math.exp(-tau / freno));
          return [vx * te, vy * te + 0.5 * g * tau * tau] as const;
        };
        // fotograma en que toca el suelo
        let tSuelo = Infinity;
        if (suelo !== undefined) {
          for (let q = 1; q <= vida * 2; q++) {
            if (libre(q / 2)[1] >= suelo && q / 2 > 2) {
              tSuelo = q / 2;
              break;
            }
          }
        }
        const p = (tau: number) => libre(Math.min(tau, tSuelo));
        const [px, py] = p(T);
        const tm = tam * (0.6 + rnd("t") * 0.9);
        const arde = rnd("f") < arden;
        const volando = T < tSuelo;
        const pts = Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2 + rnd(`p${i}`) * 0.8;
          const rr = tm * (0.65 + rnd(`q${i}`) * 0.5);
          return [Math.cos(a) * rr, Math.sin(a) * rr];
        });
        const poli = pts
          .map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`)
          .join(" ");
        const cara = [pts[0], pts[1], pts[2], [0, 0]]
          .map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`)
          .join(" ");
        const rastro = Array.from({ length: 7 }, (_, i) =>
          p(Math.max(0, T - i * 2)),
        );
        const dRastro = rastro
          .map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)},${b.toFixed(1)}`)
          .join(" ");
        const giro =
          T * (rnd("w") - 0.5) * 30 * (volando ? 1 : 0) +
          (volando ? 0 : tSuelo * (rnd("w") - 0.5) * 30);
        return (
          <g key={k} opacity={fin}>
            {estela && volando ? (
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path
                  d={dRastro}
                  stroke="#5E5B6E"
                  strokeWidth={tm * 1.3}
                  opacity={0.32}
                />
                <path
                  d={dRastro}
                  stroke="#A9A8B6"
                  strokeWidth={tm * 0.6}
                  opacity={0.5}
                />
                {arde ? (
                  <path
                    d={rastro
                      .slice(0, 4)
                      .map(
                        ([a, b], i) =>
                          `${i ? "L" : "M"}${a.toFixed(1)},${b.toFixed(1)}`,
                      )
                      .join(" ")}
                    stroke={C.naranja}
                    strokeWidth={tm * 0.7}
                    opacity={0.85}
                  />
                ) : null}
              </g>
            ) : null}
            <g
              transform={`translate(${px.toFixed(1)},${py.toFixed(1)}) rotate(${giro.toFixed(1)})`}
            >
              {arde && volando ? (
                <circle
                  r={tm * 1.5}
                  fill={C.naranja}
                  opacity={0.35 + 0.15 * Math.sin(f + k)}
                />
              ) : null}
              <polygon
                points={poli}
                fill={color}
                stroke={oscurecer(color, 0.5)}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
              <polygon points={cara} fill={aclarar(color, 0.28)} />
              {arde && volando ? (
                <circle r={tm * 0.4} fill={C.amarillo} />
              ) : null}
            </g>
          </g>
        );
      })}
    </g>
  );
};

// ---------- polvo de impacto ----------
/**
 * Polvo de impacto: una falda de bocanadas de tierra que sale a los lados por el suelo y sube un poco, con una
 * columnita al centro y piedritas que saltan. x,y = punto de impacto en el suelo. ancho/alto en px.
 */
export const PolvoImpacto: React.FC<{
  x: number;
  y: number;
  f: number;
  desde?: number;
  ancho?: number;
  alto?: number;
  n?: number;
  color?: string;
  vida?: number;
  piedras?: number;
  s?: number;
  semilla?: string;
}> = ({
  x,
  y,
  f,
  desde = 0,
  ancho = 520,
  alto = 170,
  n = 20,
  color = "#C9A47E",
  vida = 120,
  piedras = 10,
  s = 1,
  semilla = "polvo",
}) => {
  const T = f - desde;
  if (T < 0 || T > vida) return null;
  const e = 1 - Math.exp(-T / 10);
  const b: Bocanada[] = Array.from({ length: n }, (_, k) => {
    const rnd = (q: string) => random(`${semilla}${k}${q}`);
    const lado = k % 2 ? 1 : -1;
    const fr = k < 3 ? 0.05 + rnd("c") * 0.1 : ((k - 3) / Math.max(1, n - 3)) * 0.85 + 0.15 + (rnd("x") - 0.5) * 0.1;
    const px = lado * ancho * 0.5 * fr * e + Math.sin(T / 14 + k) * 8;
    const alza =
      k < 3
        ? alto * (0.55 + rnd("y") * 0.4)
        : alto * (0.12 + 0.35 * rnd("y")) * (1 - fr * 0.6);
    const py = -alza * (1 - Math.exp(-T / 16)) - T * 0.12;
    const r =
      alto *
      (0.3 + 0.2 * rnd("r")) *
      (0.3 + 0.7 * e) *
      (1 + (T / vida) * 0.8) *
      (1 - fr * 0.45);
    const u = T / vida;
    return {
      x: px,
      y: py,
      r,
      color: mezclaColor(color, mezclaColor(color, "#7E7488", 0.45), u),
      o: 1 - suaveT((u - 0.45) / 0.55),
      def: 0.18,
      rot: lado * 10,
    };
  });
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <NubeBocanadas b={b.reverse()} contorno={0.45} grosor={3} />
      {Array.from({ length: piedras }, (_, k) => {
        const rnd = (q: string) => random(`${semilla}p${k}${q}`);
        const ang = (-90 + (rnd("a") - 0.5) * 140) * (Math.PI / 180);
        const v = 6 + rnd("v") * 9;
        const g = 0.6;
        const tSuelo = (-2 * Math.sin(ang) * v) / g;
        const tt = Math.min(T, tSuelo);
        const px = Math.cos(ang) * v * tt;
        const py = Math.sin(ang) * v * tt + 0.5 * g * tt * tt;
        const r = 4 + rnd("r") * 6;
        return (
          <circle
            key={k}
            cx={px}
            cy={py}
            r={r}
            fill={oscurecer(color, 0.45)}
            opacity={1 - suaveT((T - 50) / 30)}
          />
        );
      })}
    </g>
  );
};

// ---------- explosión ----------
export type TamExplosion = "chica" | "mediana" | "grande";
const RADIO: Record<TamExplosion, number> = {
  chica: 110,
  mediana: 200,
  grande: 320,
};

/**
 * Explosión completa con volumen, desde `desde`: destello de núcleo (amarillo-blanco, nunca pantalla blanca), bola
 * de fuego de bocanadas que se expande, se enfría de blanco a amarillo, naranja, rojo y humo oscuro; onda
 * expansiva (anillo con borde que refracta), escombros en arco con estela, chispas y humo que se queda subiendo.
 * tam: "chica" | "mediana" | "grande" (o r en px). tipo: "aire" (detonación sin suelo, p. ej. un misil) o
 * "tierra" (hongo con tallo, anillo en el suelo y falda de polvo; x,y = punto en el suelo).
 * queda = fotogramas que el humo sigue en pantalla (por defecto 150). Dura en total unos 60 + queda fotogramas.
 */
export const ExplosionRica: React.FC<{
  x: number;
  y: number;
  f: number;
  desde?: number;
  tam?: TamExplosion;
  r?: number;
  tipo?: "aire" | "tierra";
  queda?: number;
  escombros?: boolean;
  chispas?: boolean;
  viento?: number;
  semilla?: string;
}> = ({
  x,
  y,
  f,
  desde = 0,
  tam = "mediana",
  r,
  tipo = "aire",
  queda = 150,
  escombros = true,
  chispas = true,
  viento = 0.25,
  semilla = "exr",
}) => {
  const id = useIdLimpio("ex");
  const R = r ?? RADIO[tam];
  const t = f - desde;
  if (t < 0 || t > 60 + queda) return null;
  const k = R / 200;
  const tierra = tipo === "tierra";
  const e = 1 - Math.exp(-t / 5.5);
  const tt = Math.min(1, t / 140);
  const enfria = 26 + R * 0.075;
  // subida del centro de la bola (hongo en tierra)
  const capY = tierra
    ? -R * 2.1 * (1 - Math.exp(-t / 42)) - R * 0.35 * e
    : -t * R * 0.0032 - R * 0.25 * (1 - Math.exp(-t / 40));
  const finHumo = (u: number) =>
    1 - suaveT((t - (60 + queda * (0.35 + 0.35 * u))) / (queda * 0.3));

  // ---- bola de fuego / sombrero ----
  const N = tam === "chica" ? 14 : tam === "mediana" ? 20 : 24;
  const bolaD: { b: Bocanada; dd: number }[] = [];
  for (let i = 0; i < N; i++) {
    const rnd = (q: string) => random(`${semilla}b${i}${q}`);
    const dd = 0.12 + 0.62 * rnd("d");
    const rr = (0.3 + 0.22 * rnd("r")) * R;
    let px: number;
    let py: number;
    if (!tierra) {
      const a = rnd("a") * Math.PI * 2;
      px =
        Math.cos(a) * dd * R * e * (1 + 0.35 * tt) +
        Math.sin(t / 19 + i) * R * 0.05 * tt +
        viento * t * k;
      py = Math.sin(a) * dd * R * e * 0.88 * (1 + 0.25 * tt) + capY;
    } else {
      // primero media cúpula sobre el suelo; luego anillo que rueda (sombrero del hongo)
      const a0 = Math.PI + rnd("a") * Math.PI;
      const hx = Math.cos(a0) * dd * R * e * 1.1;
      const hy = Math.sin(a0) * dd * R * e * 0.9;
      const lado = rnd("l") < 0.5 ? -1 : 1;
      const phi = rnd("p") * Math.PI * 2 - t * 0.035;
      const Rc = R * (0.45 + 0.25 * tt);
      const rt = R * (0.32 + 0.12 * tt) * (0.7 + dd * 0.5);
      const cx = lado * (Rc + rt * Math.cos(phi)) * (i < 4 ? 0.25 : 1);
      const cy = capY - rt * Math.sin(phi) * 0.75;
      const m = suaveT((t - 6) / 34);
      px = hx * (1 - m) + cx * m + viento * t * k;
      py = hy * (1 - m) + cy * m;
    }
    const retraso = (1 - dd) * 30 + rnd("c") * 8 - 4;
    const calor = Math.pow(lim(1 - (t - retraso) / enfria, 0, 1), 1.1);
    const humo = mezclaColor("#4F4A5C", "#878A9A", suaveT((t - 40) / 140));
    const hacia = norm(-(px - viento * t * k), -(py - capY));
    const luz = norm(
      LUZ[0] * (1 - calor) + hacia[0] * calor * 1.4,
      LUZ[1] * (1 - calor) + hacia[1] * calor * 1.4,
    );
    bolaD.push({
      dd,
      b: {
        x: px,
        y: py,
        r: rr * (0.18 + 0.82 * e) * (1 + 0.45 * tt),
        // el blanco puro solo en los primeros fotogramas; luego, amarillo claro como máximo
        color:
          calor > 0
            ? colorCalor(calor * (1 - 0.16 * lim(t / 10, 0, 1)), humo)
            : humo,
        borde: colorCalor(calor * 0.45, oscurecer(humo, 0.55)),
        o: finHumo(rnd("o")),
        luz,
        def: 0.1 * Math.sin(t / 13 + i),
        rot: i * 37,
      },
    });
  }
  // los de afuera atrás y los de adentro (más calientes) al frente
  const bola = bolaD.sort((p, q) => q.dd - p.dd).map((p) => p.b);
  // ---- tallo del hongo ----
  const tallo: Bocanada[] = [];
  if (tierra && t > 4) {
    const M = 9;
    for (let j = 0; j < M; j++) {
      const rnd = (q: string) => random(`${semilla}t${j}${q}`);
      const u = j / (M - 1);
      const alcanza = lim((-capY * 0.8) / (R * 2), 0, 1);
      if (u > alcanza + 0.05) continue;
      const calor =
        lim(1 - (t - 2 - u * 10) / (enfria * 0.7), 0, 1) * 0.62 * (1 - u * 0.35);
      const polvo = mezclaColor("#6A5A60", "#8A8696", suaveT((t - 30) / 120));
      const lado = j % 2 ? 1 : -1;
      tallo.push({
        x:
          lado * R * (0.06 + 0.06 * rnd("x")) * (1 - u * 0.5) +
          Math.sin(t / 15 + j * 1.3) * R * 0.05 * u +
          viento * t * k * u,
        y: capY * 0.8 * u - R * 0.08,
        r:
          R *
          (0.36 - 0.17 * Math.sqrt(u)) *
          (0.8 + 0.35 * rnd("r")) *
          (1 + 0.3 * tt) *
          (0.9 + 0.1 * Math.sin(t / 9 + j)),
        color: calor > 0 ? colorCalor(calor * 0.85, polvo) : polvo,
        o: finHumo(0.3 + u * 0.4),
        def: -0.22 + 0.05 * Math.sin(t / 12 + j),
        rot: 0,
      });
    }
    // de arriba hacia abajo: la base queda al frente
    tallo.reverse();
  }

  // ---- destello y onda ----
  const fl = 1 - suaveT(t / 11);
  const onda = suaveT(t / 24);
  const ro = R * (0.5 + 2.7 * (1 - Math.pow(1 - onda, 2)));
  const ry = tierra ? 0.26 : 1;
  const resplandor = 1 - suaveT((t - 4) / 50);
  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <clipPath id={`${id}c`}>
          <rect x={-8000} y={-8000} width={16000} height={8000 + R * 0.04} />
        </clipPath>
        <radialGradient id={`${id}g`}>
          <stop offset="0%" stopColor={C.amarillo} stopOpacity={0.75} />
          <stop offset="40%" stopColor={C.naranja} stopOpacity={0.35} />
          <stop offset="100%" stopColor={C.naranja} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}n`}>
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
          <stop offset="30%" stopColor={C.crema} stopOpacity={0.95} />
          <stop offset="60%" stopColor={C.amarillo} stopOpacity={0.55} />
          <stop offset="100%" stopColor={C.amarillo} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* resplandor que tiñe alrededor */}
      {resplandor > 0 ? (
        <ellipse
          cx={0}
          cy={capY * 0.6}
          rx={R * 2.6 * (0.5 + 0.5 * e)}
          ry={R * 2.6 * (0.5 + 0.5 * e) * (tierra ? 0.75 : 1)}
          fill={`url(#${id}g)`}
          opacity={resplandor}
        />
      ) : null}
      {/* onda expansiva: anillo con borde que refracta */}
      {onda < 1 ? (
        <g opacity={1 - onda} fill="none">
          <ellipse
            rx={ro * 1.05}
            ry={ro * 1.05 * ry}
            stroke={C.negro}
            strokeWidth={R * 0.05 * (1 - onda) + 2}
            opacity={0.18}
          />
          <ellipse
            rx={ro * 0.9}
            ry={ro * 0.9 * ry}
            stroke="#FFFFFF"
            strokeWidth={R * 0.34 * (1 - onda) + 4}
            opacity={0.16}
          />
          <ellipse
            rx={ro}
            ry={ro * ry}
            stroke={C.crema}
            strokeWidth={R * 0.13 * (1 - onda) + 3}
            opacity={0.9}
          />
          <ellipse
            rx={ro * 0.97}
            ry={ro * 0.97 * ry}
            stroke="#FFFFFF"
            strokeWidth={R * 0.035 * (1 - onda) + 1.5}
          />
        </g>
      ) : null}
      {/* escombros (salen de detrás de la bola) */}
      {escombros ? (
        <Escombros
          x={0}
          y={tierra ? -R * 0.1 : 0}
          f={t}
          n={tam === "chica" ? 7 : tam === "mediana" ? 11 : 15}
          vel={15 * Math.sqrt(k)}
          gravedad={tierra ? 0.55 * Math.sqrt(k) : 0.25 * Math.sqrt(k)}
          abre={tierra ? 140 : 360}
          tam={11 * Math.sqrt(k)}
          suelo={tierra ? R * 0.1 : undefined}
          vida={tierra ? 80 : 60}
          freno={tierra ? 60 : 16}
          semilla={semilla + "e"}
        />
      ) : null}
      <g clipPath={tierra ? `url(#${id}c)` : undefined}>
        <NubeBocanadas
          b={[...tallo, ...bola]}
          contorno={0.75}
          grosor={4 + k * 2}
        />
      </g>
      {/* polvo del suelo */}
      {tierra ? (
        <PolvoImpacto
          x={0}
          y={0}
          f={t}
          ancho={R * 3.6}
          alto={R * 0.6}
          n={24}
          vida={60 + queda}
          semilla={semilla + "p"}
          piedras={0}
        />
      ) : null}
      {/* tallo y bola */}
      {chispas ? (
        <Chispas
          x={0}
          y={tierra ? -R * 0.2 : 0}
          f={t}
          n={tam === "chica" ? 16 : 28}
          vel={20 * Math.sqrt(k)}
          abre={tierra ? 170 : 360}
          gravedad={0.3 * Math.sqrt(k)}
          vida={26}
          grosor={4 * Math.sqrt(k)}
          semilla={semilla + "c"}
        />
      ) : null}
      {/* destello del núcleo: amarillo-blanco con rayos, nunca pantalla completa */}
      {fl > 0 ? (
        <g opacity={fl}>
          <circle
            cx={0}
            cy={tierra ? -R * 0.25 : 0}
            r={R * (0.6 + 1.0 * e)}
            fill={`url(#${id}n)`}
          />
          <g
            transform={`translate(0,${tierra ? -R * 0.25 : 0}) rotate(${12 + t * 1.5})`}
            fill="#FFFFFF"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((q) => {
              const L = R * (q % 2 ? 0.9 : 1.7) * (0.5 + 0.5 * e);
              const a = q * 45;
              return (
                <path
                  key={q}
                  d={`M0,${-R * 0.06} L${L},0 L0,${R * 0.06} Z`}
                  transform={`rotate(${a})`}
                  opacity={q % 2 ? 0.7 : 0.95}
                />
              );
            })}
          </g>
        </g>
      ) : null}
    </g>
  );
};

// ---------- estela ----------
type Pt = { x: number; y: number };
/** Convierte una lista de puntos en una trayectoria u (0..1) → punto, repartida por largo. */
export const trayectoriaDePuntos = (
  puntos: [number, number][],
): ((u: number) => Pt) => {
  const L = [0];
  for (let i = 1; i < puntos.length; i++)
    L.push(
      L[i - 1] +
        Math.hypot(
          puntos[i][0] - puntos[i - 1][0],
          puntos[i][1] - puntos[i - 1][1],
        ),
    );
  const tot = L[L.length - 1] || 1;
  return (u: number) => {
    const d = lim(u, 0, 1) * tot;
    let i = 1;
    while (i < L.length - 1 && L[i] < d) i++;
    const a = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
    return {
      x: puntos[i - 1][0] + (puntos[i][0] - puntos[i - 1][0]) * a,
      y: puntos[i - 1][1] + (puntos[i][1] - puntos[i - 1][1]) * a,
    };
  };
};

/**
 * Estela de humo de misil, avión o cohete a lo largo de una trayectoria: delgada y caliente junto a la cabeza,
 * se ensancha, se enfría a gris, deriva con el viento y se disipa con el tiempo. La cabeza recorre la trayectoria
 * de `desde` a `desde + dura` (ponle aceleración dentro de tu función si la quieres). Da `trayectoria`
 * (u 0..1 → {x, y}) o `puntos` ([[x, y], …]). ancho0/ancho1 = grosor junto a la cabeza y al final; vida = cuánto
 * dura cada tramo; viento/sube en px por fotograma. cabeza = brillo del motor en la punta.
 */
export const Estela: React.FC<{
  f: number;
  trayectoria?: (u: number) => Pt;
  puntos?: [number, number][];
  desde?: number;
  dura?: number;
  n?: number;
  ancho0?: number;
  ancho1?: number;
  vida?: number;
  viento?: number;
  sube?: number;
  colores?: [string, string, string];
  cabeza?: boolean;
  contorno?: number;
  semilla?: string;
}> = ({
  f,
  trayectoria,
  puntos,
  desde = 0,
  dura = 60,
  n = 56,
  ancho0 = 16,
  ancho1 = 110,
  vida = 150,
  viento = 0.35,
  sube = 0.25,
  colores = [C.crema, "#F6F5F2", "#8F94A6"],
  cabeza = true,
  contorno = 0.55,
  semilla = "est",
}) => {
  const tr = trayectoria ?? (puntos ? trayectoriaDePuntos(puntos) : null);
  if (!tr) return null;
  const T = f - desde;
  if (T < 0) return null;
  const uC = lim(T / dura, 0, 1);
  const b: Bocanada[] = [];
  for (let i = n; i >= 0; i--) {
    const u = i / n;
    if (u > uC) continue;
    const edad = T - u * dura;
    const a = edad / vida;
    if (a >= 1) continue;
    const rnd = (q: string) => random(`${semilla}${i}${q}`);
    const p = tr(u);
    const turb = Math.pow(a, 0.7) * ancho1 * 0.22;
    const r =
      (ancho0 / 2 +
        (ancho1 / 2 - ancho0 / 2) * Math.pow(Math.min(1, a * 1.6), 0.55)) *
      (0.8 + 0.4 * rnd("r"));
    const color =
      a < 0.04
        ? mezclaColor(colores[0], colores[1], a / 0.04)
        : mezclaColor(
            colores[1],
            colores[2],
            Math.pow((a - 0.04) / 0.96, 0.75),
          );
    b.push({
      x:
        p.x +
        viento * edad +
        Math.sin(edad / (11 + rnd("w") * 8) + rnd("p") * 6) * turb,
      y:
        p.y -
        sube * edad +
        Math.cos(edad / (14 + rnd("v") * 8) + rnd("q") * 6) * turb * 0.6,
      r,
      color,
      o: 1 - suaveT((a - 0.45) / 0.55),
      def: 0.12 * Math.sin(edad / 10 + i),
      rot: i * 41,
    });
  }
  // núcleo continuo junto a la cabeza (las bocanadas allí todavía son finas)
  const N2 = 12;
  const u0 = Math.max(0, uC - 0.12);
  const nucleo =
    uC > 0
      ? Array.from({ length: N2 + 1 }, (_, j) => tr(u0 + ((uC - u0) * j) / N2))
      : [];
  const dN = nucleo
    .map((p, j) => `${j ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const pc = tr(uC);
  const vuela = T < dura;
  return (
    <g>
      <NubeBocanadas b={b} contorno={contorno} grosor={3} />
      {vuela && nucleo.length ? (
        <g fill="none" strokeLinecap="round">
          <path
            d={dN}
            stroke={oscurecer(colores[1], 0.35)}
            strokeWidth={ancho0 * 1.15 + 4}
            opacity={0.35}
          />
          <path d={dN} stroke={colores[1]} strokeWidth={ancho0 * 1.15} />
          <path d={dN} stroke={C.crema} strokeWidth={ancho0 * 0.45} />
        </g>
      ) : null}
      {cabeza && vuela ? (
        <g>
          <circle
            cx={pc.x}
            cy={pc.y}
            r={ancho0 * 1.8 * (0.9 + 0.1 * Math.sin(f * 1.9))}
            fill={C.naranja}
            opacity={0.35}
          />
          <circle cx={pc.x} cy={pc.y} r={ancho0 * 0.95} fill={C.amarillo} />
          <circle cx={pc.x} cy={pc.y} r={ancho0 * 0.5} fill="#FFFFFF" />
        </g>
      ) : null}
    </g>
  );
};

// ---------- postquemador ----------
/**
 * Postquemador (o motor de cohete) con volumen: cono exterior que ondula, llama interior, núcleo blanco en la
 * tobera y diamantes de choque que parpadean, con resplandor. Sale hacia la izquierda desde (x, y) (gíralo con
 * rot, en grados). largo/alto en px a s=1; p 0..1 = potencia (anímala al encender). color "fuego" o "azul".
 */
export const Postquemador: React.FC<{
  x: number;
  y: number;
  f: number;
  s?: number;
  rot?: number;
  largo?: number;
  alto?: number;
  p?: number;
  diamantes?: number;
  color?: "fuego" | "azul";
}> = ({
  x,
  y,
  f,
  s = 1,
  rot = 0,
  largo = 280,
  alto = 48,
  p = 1,
  diamantes = 5,
  color = "fuego",
}) => {
  const id = useIdLimpio("pq");
  if (p <= 0.01) return null;
  const tiembla = 1 + Math.sin(f * 1.7) * 0.06 + Math.sin(f * 0.83) * 0.05;
  const L = largo * p * tiembla;
  const h = (alto / 2) * (0.7 + 0.3 * p);
  const pal =
    color === "azul"
      ? ["#E8F6FF", "#7CC4FF", "#3E5BD8", "#B9E3FF"]
      : [C.amarillo, C.naranja, C.rojo, C.crema];
  const borde = (esc: number, largoK: number, fase: number) => {
    const M = 12;
    const ar: string[] = [];
    const ab: string[] = [];
    for (let i = 0; i <= M; i++) {
      const u = i / M;
      const xx = -L * largoK * u;
      const env =
        (u < 0.12 ? 1 + u * 1.2 : 1.14 * Math.pow(1 - (u - 0.12) / 0.88, 0.9)) *
        h *
        esc;
      const ond = 1 + 0.1 * Math.sin(f * 1.3 + i * 1.7 + fase) * u;
      ar.push(`${xx.toFixed(1)},${(-env * ond).toFixed(1)}`);
      ab.push(`${xx.toFixed(1)},${(env * (2 - ond)).toFixed(1)}`);
    }
    return `M${ar.join(" L")} L${ab.reverse().join(" L")} Z`;
  };
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}r`}>
          <stop offset="0%" stopColor={pal[0]} stopOpacity={0.55} />
          <stop offset="100%" stopColor={pal[1]} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}a`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={pal[2]} stopOpacity={0} />
          <stop offset="45%" stopColor={pal[2]} stopOpacity={0.75} />
          <stop offset="100%" stopColor={pal[1]} stopOpacity={0.95} />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={pal[1]} stopOpacity={0} />
          <stop offset="50%" stopColor={pal[0]} stopOpacity={0.95} />
          <stop offset="100%" stopColor={pal[3]} stopOpacity={1} />
        </linearGradient>
      </defs>
      <ellipse
        cx={-L * 0.4}
        cy={0}
        rx={L * 0.85}
        ry={h * 3.4}
        fill={`url(#${id}r)`}
        opacity={0.9 * p}
      />
      <path d={borde(1.18, 1, 0)} fill={`url(#${id}a)`} />
      <path d={borde(0.72, 0.78, 2)} fill={`url(#${id}b)`} />
      <ellipse
        cx={-L * 0.07}
        cy={0}
        rx={L * 0.12}
        ry={h * 0.62}
        fill="#FFFFFF"
        opacity={0.95}
      />
      {Array.from({ length: diamantes }, (_, j) => {
        const xj =
          -(L * 0.16 + j * L * 0.15) * (1 + 0.015 * Math.sin(f * 2.1 + j));
        const sz = h * 0.7 * (1 - j * 0.14);
        const op =
          (0.95 - j * 0.16) * (0.8 + 0.2 * Math.sin(f * 2.3 + j * 1.1)) * p;
        if (sz <= 1 || op <= 0.02) return null;
        const rombo = (k: number) =>
          `M${xj + sz * 0.95 * k},0 L${xj},${-sz * 0.5 * k} L${xj - sz * 0.95 * k},0 L${xj},${sz * 0.5 * k} Z`;
        return (
          <g key={j} opacity={op}>
            <path d={rombo(1.35)} fill={pal[0]} opacity={0.6} />
            <path d={rombo(1)} fill="#FFFFFF" />
          </g>
        );
      })}
    </g>
  );
};

// ---------- ondas de calor ----------
/**
 * Ondas de calor sobre una superficie caliente (pista, desierto, motor, lava): líneas onduladas que suben y se
 * apagan y, si le pasas `children`, también ondula lo que hay detrás dentro del rectángulo (distorsión real).
 * x = centro, y = la superficie; w × h = zona que tiembla por encima. fuerza = px de distorsión.
 * Dentro de un RigCamara la distorsión solo se calcula en lo que se ve (recorteCamara = false si va dentro de un <g>
 * con transform propio) y no se calcula cuando es menor de 0,3 px en pantalla (no se nota).
 */
export const OndasCalor: React.FC<{
  x: number;
  y: number;
  f: number;
  w?: number;
  h?: number;
  n?: number;
  color?: string;
  o?: number;
  fuerza?: number;
  lineas?: boolean;
  semilla?: string;
  recorteCamara?: boolean;
  children?: React.ReactNode;
}> = ({
  x,
  y,
  f,
  w = 600,
  h = 220,
  n = 8,
  color = C.blanco,
  o = 0.4,
  fuerza = 9,
  lineas = true,
  semilla = "cal",
  recorteCamara = true,
  children,
}) => {
  const id = useIdLimpio("oc");
  const cam = useCamara();
  const sube = (f * 2.2) % 4000;
  const x0 = x - w / 2;
  const y0 = y - h;
  const zoomPx = cam.activa && recorteCamara ? cam.pose.zoom : 1;
  // zona del filtro: la del efecto, recortada a lo que ve la cámara
  let rx0 = x0;
  let ry0 = y0;
  let rx1 = x0 + w;
  let ry1 = y0 + h + 10;
  if (cam.activa && recorteCamara) {
    const esq = [cam.aEscenario(0, 0), cam.aEscenario(1920, 0), cam.aEscenario(0, 1080), cam.aEscenario(1920, 1080)];
    const pad = fuerza * 2 + 20 / zoomPx;
    rx0 = Math.max(rx0, Math.min(...esq.map((p) => p[0])) - pad);
    ry0 = Math.max(ry0, Math.min(...esq.map((p) => p[1])) - pad);
    rx1 = Math.min(rx1, Math.max(...esq.map((p) => p[0])) + pad);
    ry1 = Math.min(ry1, Math.max(...esq.map((p) => p[1])) + pad);
  }
  const distorsiona = !!children && fuerza * zoomPx >= 0.3 && rx1 > rx0 && ry1 > ry0;
  return (
    <g>
      {children && !distorsiona ? children : null}
      {distorsiona ? (
        <g>
          {children}
          <defs>
            <filter
              id={`${id}f`}
              filterUnits="userSpaceOnUse"
              x={rx0}
              y={ry0 + sube}
              width={rx1 - rx0}
              height={ry1 - ry0}
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.006 0.045"
                numOctaves={2}
                seed={Math.floor(random(semilla) * 100)}
                result="r"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="r"
                scale={fuerza * 2}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <linearGradient id={`${id}g`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0} />
              <stop offset="55%" stopColor="#FFFFFF" stopOpacity={1} />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity={1} />
            </linearGradient>
            <mask
              id={`${id}m`}
              maskUnits="userSpaceOnUse"
              x={x0}
              y={y0}
              width={w}
              height={h + 10}
            >
              <rect
                x={x0}
                y={y0}
                width={w}
                height={h + 10}
                fill={`url(#${id}g)`}
              />
            </mask>
          </defs>
          <g mask={`url(#${id}m)`}>
            <g transform={`translate(0,${-sube})`}>
              <g filter={`url(#${id}f)`}>
                <g transform={`translate(0,${sube})`}>{children}</g>
              </g>
            </g>
          </g>
        </g>
      ) : null}
      {lineas
        ? Array.from({ length: n }, (_, k) => {
            const rnd = (q: string) => random(`${semilla}${k}${q}`);
            const per = 50 + rnd("p") * 30;
            const t = ((f + rnd("o") * per) % per) / per;
            const lx =
              x0 + ((k + 0.5) / n) * w + (rnd("x") - 0.5) * (w / n) * 0.6;
            const largo = h * (0.35 + rnd("l") * 0.25);
            const yb = y - 10 - t * h * 0.55;
            const pts = Array.from({ length: 9 }, (_, i) => {
              const yy = yb - (largo * i) / 8;
              return `${(lx + Math.sin(yy / 20 + f * 0.22 + k) * 9).toFixed(1)},${yy.toFixed(1)}`;
            });
            return (
              <path
                key={k}
                d={`M${pts.join(" L")}`}
                fill="none"
                stroke={color}
                strokeWidth={4}
                strokeLinecap="round"
                opacity={Math.sin(Math.PI * t) * o}
              />
            );
          })
        : null}
    </g>
  );
};
