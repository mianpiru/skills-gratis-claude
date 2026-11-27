// Biblioteca Plano Pop · PersonaViva: el personaje del estilo (Persona del kit) con más vida y más volumen.
// Mismas proporciones y misma silueta que Persona (cabeza grande, abrigo, sin bordes), para que se reconozca;
// suma cejas, 6 expresiones, boca que habla, parpadeo, respiración, gestos de brazo y sombreado de dos tonos.
// x,y = pies (centro). A s=1 mide ≈ 420 px de alto.
import React from "react";
import { random, spring } from "remotion";
import { C, FPS_INF } from "../kit";
import { dosTonos } from "./volumen";

export type Expresion = "normal" | "feliz" | "triste" | "susto" | "enojo" | "duda";
export type Gesto = "ninguno" | "senala" | "saluda" | "piensa" | "celebra" | "explica";
export type Peinado = "gorro" | "corto" | "largo" | "calvo";

export type PersonaVivaProps = {
  x: number;
  y: number;
  f: number;
  s?: number;
  flip?: boolean;
  abrigo?: string;
  piel?: string;
  pelo?: string;
  peinado?: Peinado;
  expresion?: Expresion;
  /** true = la boca se mueve como hablando (o un rango [desde, hasta] de fotogramas) */
  habla?: boolean | [number, number];
  gesto?: Gesto;
  /** fotograma en que empieza el gesto (llega con resorte); gestoHasta = vuelve a reposo */
  gestoDesde?: number;
  gestoHasta?: number;
  lentes?: boolean;
  barba?: boolean;
  /** desfase para que dos personas no parpadeen ni respiren a la vez */
  fase?: number;
  sombra?: boolean;
};

const POSES: Record<Gesto, (f: number) => [number, number, number]> = {
  // [brazo derecho, brazo izquierdo, largo del derecho]  (grados SVG; −14 / 14 = reposo)
  ninguno: () => [-14, 14, 1],
  senala: () => [-100, 14, 1],
  saluda: (f) => [-160 + Math.sin(f / 3) * 16, 14, 1],
  piensa: () => [150, 14, 0.62],
  celebra: (f) => [-160 + Math.sin(f / 4) * 8, 160 - Math.sin(f / 4 + 1) * 8, 1],
  explica: (f) => [-55 + Math.sin(f / 6) * 14, 55 - Math.sin(f / 6 + 1.2) * 14, 1],
};

const resorte = (f: number, en: number) =>
  f < en ? 0 : spring({ frame: f - en, fps: FPS_INF, config: { damping: 11, stiffness: 160, mass: 0.7 } });

export const PersonaViva: React.FC<PersonaVivaProps> = ({
  x,
  y,
  f,
  s = 1,
  flip,
  abrigo = C.teal2,
  piel = C.piel,
  pelo = "#6B3F2E",
  peinado = "gorro",
  expresion = "normal",
  habla = false,
  gesto = "ninguno",
  gestoDesde = 0,
  gestoHasta,
  lentes,
  barba,
  fase = 0,
  sombra = true,
}) => {
  const ab = dosTonos(abrigo);
  const pi = dosTonos(piel, 0.7);
  const pe = dosTonos(pelo);
  const ff = f + fase * 17;
  // parpadeo: cada ~3 s, 4 fotogramas; respiración 2–3 px
  const parpadeo = ff % 92 < 4 ? 0.12 : 1;
  const sube = Math.sin(ff / 11) * 3;
  const cabeza = Math.sin(ff / 23) * 2.5;
  // gesto: mezcla de reposo a pose con resorte
  const k = resorte(f, gestoDesde) * (gestoHasta === undefined ? 1 : 1 - resorte(f, gestoHasta));
  const [pd, pz, ld] = POSES[gesto](ff);
  const rotD = -14 + (pd + 14) * k;
  const rotI = 14 + (pz - 14) * k;
  const largoD = 1 + (ld - 1) * k;
  // boca
  const hablando = Array.isArray(habla) ? f >= habla[0] && f < habla[1] : habla;
  const abre = hablando ? (random(`boca${Math.floor(ff / 3)}`) > 0.25 ? 0.35 + 0.65 * Math.abs(Math.sin(ff * 0.9)) : 0.1) : 0;
  const ojosGrandes = expresion === "susto";
  const Brazo = ({ bx, rot, largo = 1 }: { bx: number; rot: number; largo?: number }) => (
    <g transform={`translate(${bx},-228) rotate(${rot})`}>
      <rect x={-21} y={-8} width={42} height={128 * largo} rx={21} fill={ab.sombra} />
      <rect x={-21} y={-8} width={16} height={128 * largo} rx={8} fill={ab.base} opacity={0.6} />
      <circle cx={0} cy={124 * largo} r={24} fill={pi.base} />
      <circle cx={6} cy={128 * largo} r={14} fill={pi.sombra} opacity={0.5} />
    </g>
  );
  const cejas = () => {
    // [inclinación izq, inclinación der, alto] (grados; positivo = baja hacia el centro)
    const c: Record<Expresion, [number, number, number]> = {
      normal: [0, 0, 0],
      feliz: [-6, 6, -4],
      triste: [-18, 18, -2],
      susto: [-10, 10, -12],
      enojo: [22, -22, 4],
      duda: [0, -14, -2],
    };
    const [a, b, h] = c[expresion];
    const dyD = expresion === "duda" ? -10 : 0;
    return (
      <g fill={pe.sombra}>
        <rect x={-40} y={-349 + h} width={32} height={9} rx={4.5} transform={`rotate(${a} -24 ${-345 + h})`} />
        <rect x={8} y={-349 + h + dyD} width={32} height={9} rx={4.5} transform={`rotate(${b} 24 ${-345 + h + dyD})`} />
      </g>
    );
  };
  const ojos = () =>
    expresion === "feliz" && abre < 0.2 ? (
      <g fill="none" stroke={C.navy} strokeWidth={6} strokeLinecap="round">
        <path d="M-34,-310 Q-24,-322 -14,-310" />
        <path d="M14,-310 Q24,-322 34,-310" />
      </g>
    ) : (
      <g transform={`translate(0,-314) scale(1,${ojosGrandes ? 1 : parpadeo})`}>
        {[-24, 24].map((ex) => (
          <g key={ex}>
            {ojosGrandes ? <circle cx={ex} cy={0} r={15} fill={C.blanco} /> : null}
            <circle cx={ex} cy={0} r={ojosGrandes ? 9 : 8} fill={C.navy} />
            <circle cx={ex - 3} cy={-3} r={2.6} fill={C.blanco} />
          </g>
        ))}
      </g>
    );
  const boca = () => {
    if (abre > 0.05) {
      const ry = 4 + abre * 13;
      return (
        <g>
          <ellipse cx={0} cy={-284} rx={expresion === "feliz" ? 17 : 13} ry={ry} fill="#7A2B2B" />
          <ellipse cx={0} cy={-284 + ry * 0.45} rx={8} ry={ry * 0.4} fill="#E06A6A" />
        </g>
      );
    }
    switch (expresion) {
      case "feliz":
        return <path d="M-20,-292 Q0,-262 20,-292 Z" fill="#7A2B2B" />;
      case "triste":
        return <path d="M-15,-278 Q0,-292 15,-278" stroke={C.navy} strokeWidth={6} fill="none" strokeLinecap="round" />;
      case "susto":
        return <ellipse cx={0} cy={-280} rx={13} ry={18} fill="#7A2B2B" />;
      case "enojo":
        return <path d="M-16,-282 L16,-282" stroke={C.navy} strokeWidth={7} fill="none" strokeLinecap="round" />;
      case "duda":
        return <path d="M-12,-282 L15,-288" stroke={C.navy} strokeWidth={6} fill="none" strokeLinecap="round" />;
      default:
        return <path d="M-16,-288 Q0,-274 16,-288" stroke={C.navy} strokeWidth={6} fill="none" strokeLinecap="round" />;
    }
  };
  const detrasPelo =
    peinado === "largo" ? <path d="M-78,-340 Q-90,-250 -60,-236 L60,-236 Q90,-250 78,-340 Z" fill={pe.sombra} /> : null;
  const peloArriba = () => {
    if (peinado === "gorro")
      return (
        <g>
          <path d="M-74,-352 Q-74,-424 0,-424 Q74,-424 74,-352 Z" fill={pe.base} />
          <path d="M10,-423 Q74,-420 74,-352 L40,-352 Q44,-400 10,-423 Z" fill={pe.sombra} opacity={0.6} />
          <rect x={-86} y={-356} width={30} height={84} rx={15} fill={pe.sombra} />
          <rect x={56} y={-356} width={30} height={84} rx={15} fill={pe.sombra} />
          <rect x={-80} y={-372} width={160} height={24} rx={12} fill={pe.luz} />
        </g>
      );
    if (peinado === "corto" || peinado === "largo")
      return (
        <g>
          <path
            d="M-72,-334 Q-76,-412 0,-414 Q76,-412 72,-334 Q64,-372 18,-372 Q-10,-360 -30,-372 Q-62,-372 -72,-334 Z"
            fill={pe.base}
          />
          <path d="M20,-412 Q74,-404 72,-334 Q66,-366 40,-372 Z" fill={pe.sombra} opacity={0.7} />
        </g>
      );
    return (
      <g fill={pe.base}>
        <path d="M-72,-326 Q-76,-350 -62,-362 L-56,-322 Z" />
        <path d="M72,-326 Q76,-350 62,-362 L56,-322 Z" />
      </g>
    );
  };
  const piensa = gesto === "piensa" && k > 0.3;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {sombra ? <ellipse cx={0} cy={4} rx={100} ry={16} fill="rgba(27,20,67,0.18)" /> : null}
      <rect x={-50} y={-100} width={40} height={94} rx={12} fill={C.navy2} />
      <rect x={10} y={-100} width={40} height={94} rx={12} fill={C.navy} />
      <rect x={-62} y={-24} width={58} height={26} rx={11} fill={C.navy} />
      <rect x={6} y={-24} width={58} height={26} rx={11} fill={C.negro} />
      <g transform={`translate(0,${sube})`}>
        <Brazo bx={-64} rot={rotI} />
        <path d="M-80,-86 Q-92,-244 -42,-266 L42,-266 Q92,-244 80,-86 Q0,-68 -80,-86 Z" fill={ab.base} />
        <path d="M18,-266 L42,-266 Q92,-244 80,-86 Q50,-76 22,-74 Q44,-170 18,-266 Z" fill={ab.sombra} opacity={0.75} />
        <path d="M-58,-250 Q-74,-200 -70,-140" stroke={ab.luz} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} />
        <rect x={-5} y={-252} width={10} height={170} fill={ab.sombra} />
        <path d="M-80,-86 Q0,-68 80,-86 L80,-104 Q0,-88 -80,-104 Z" fill={ab.sombra} />
        {piensa ? null : <Brazo bx={64} rot={rotD} largo={largoD} />}
        <g transform={`rotate(${cabeza} 0 -262)`}>
          {detrasPelo}
          <ellipse cx={0} cy={-262} rx={66} ry={26} fill={C.crema} />
          <circle cx={0} cy={-330} r={70} fill={pi.base} />
          <path d="M28,-394 A70,70 0 0 1 22,-263 A80,80 0 0 0 28,-394 Z" fill={pi.sombra} opacity={0.45} />
          <ellipse cx={-30} cy={-372} rx={16} ry={9} fill={C.blanco} opacity={0.25} transform="rotate(-30 -30 -372)" />
          {barba ? (
            <path d="M-62,-312 Q-56,-250 0,-250 Q56,-250 62,-312 Q32,-284 0,-286 Q-32,-284 -62,-312 Z" fill={pe.base} />
          ) : null}
          {peloArriba()}
          <circle cx={-42} cy={-296} r={11} fill={C.piel2} opacity={expresion === "enojo" ? 0.95 : 0.7} />
          <circle cx={42} cy={-296} r={11} fill={C.piel2} opacity={expresion === "enojo" ? 0.95 : 0.7} />
          {ojos()}
          {cejas()}
          {lentes ? (
            <g fill="none" stroke={C.navy} strokeWidth={6}>
              <circle cx={-24} cy={-314} r={20} />
              <circle cx={24} cy={-314} r={20} />
              <path d="M-4,-314 L4,-314" />
            </g>
          ) : null}
          {boca()}
          {expresion === "susto" ? <path d="M60,-372 Q70,-352 62,-340 Q54,-352 60,-372 Z" fill={C.cielo} /> : null}
        </g>
        {piensa ? <Brazo bx={64} rot={rotD} largo={largoD} /> : null}
      </g>
    </g>
  );
};
