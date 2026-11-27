// Biblioteca Plano Pop · archivo e investigación (nuevas en V12): máquina de escribir que teclea de verdad, lector
// de microfilm con un periódico viejo que corre, pila de cartas que salen y vuelven con sellos, fila de fichas de
// dominó con rótulos (cadena de causas) y la sala de una biblioteca universitaria de los 70 (fondo con paralaje).
// Sirven para cualquier historia de escritores, periodistas, investigadores o archivos.
import React, { useId } from "react";
import { random } from "remotion";
import { C, H, T, W } from "../kit";
import { CamaraFondo } from "./fondos-ricos";
import { anchoT, lim, PB } from "./paleta";
import { dosTonos, oscurecer } from "./volumen";

const idL = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const fx = (n: number) => n.toFixed(1);
/** Letra de máquina de escribir (monoespaciada). Ancho de cada letra ≈ 0,6 × size. */
export const FUENTE_MAQUINA = "'Courier New', Courier, monospace";

/**
 * Máquina de escribir de oficina vista de frente (≈ 760 × 360 el cuerpo a s=1; con la hoja sube hasta y−560).
 * lineas = texto de la hoja (máx. ~18 letras por renglón a size 40); p 0..1 = cuánto va escrito (letra por letra:
 * el carro se corre, las teclas saltan y una barra golpea en cada letra). color = cuerpo. x,y = centro de la base.
 * Ej.: <MaquinaEscribir x={960} y={960} f={f} lineas={["UNCERTAIN AS TO", "IN WHAT POSITION", "LAY THE PENINSULA", "OF FLORIDA"]} p={sale(f, w(10), w(22))} />
 */
export const MaquinaEscribir: React.FC<{
  x: number;
  y: number;
  f: number;
  lineas?: string[];
  p?: number;
  s?: number;
  color?: string;
  size?: number;
  hoja?: boolean;
}> = ({ x, y, f, lineas = [], p = 0, s = 1, color = "#3E4A5C", size = 40, hoja = true }) => {
  const cu = dosTonos(color);
  const total = lineas.reduce((a, l) => a + l.length, 0);
  const n = Math.floor(lim(p, 0, 1) * total);
  const tecleando = p > 0.001 && p < 0.999;
  // renglón actual y letras escritas en él
  let resto = n;
  let renglon = 0;
  for (let i = 0; i < lineas.length; i++) {
    if (resto <= lineas[i].length) {
      renglon = i;
      break;
    }
    resto -= lineas[i].length;
    renglon = i + 1;
  }
  const cw = size * 0.6;
  const lh = size * 1.25;
  const anchoHoja = Math.max(520, Math.max(...lineas.map((l) => l.length), 10) * cw + 80);
  const altoHoja = 120 + Math.max(lineas.length, 3) * lh;
  const xIni = -anchoHoja / 2 + 40;
  const carro = tecleando ? -(resto * cw) + (lineas[renglon]?.length ?? 0) * cw * 0.5 : 0;
  const golpe = tecleando && f % 3 === 0;
  const subeHoja = Math.min(renglon, lineas.length - 1) * lh;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={400} ry={30} fill="rgba(18,12,46,0.25)" />
      {/* carro con hoja */}
      <g transform={`translate(${fx(carro * 0.5)},0)`}>
        {hoja ? (
          <g transform={`translate(0,${-subeHoja * 0.3})`}>
            <rect x={-anchoHoja / 2 + 8} y={-250 - altoHoja + 8} width={anchoHoja} height={altoHoja} fill="rgba(18,12,46,0.2)" />
            <rect x={-anchoHoja / 2} y={-250 - altoHoja} width={anchoHoja} height={altoHoja} fill={C.blanco} />
            <rect x={-anchoHoja / 2} y={-250 - altoHoja} width={anchoHoja} height={altoHoja} fill="none" stroke="#D8D2C2" strokeWidth={3} />
            {(() => {
              let cuenta = n;
              return lineas.map((l, i) => {
                const vis = Math.max(0, Math.min(l.length, cuenta));
                cuenta -= l.length;
                if (vis <= 0) return null;
                return (
                  <text
                    key={i}
                    x={xIni}
                    y={-250 - altoHoja + 80 + i * lh}
                    fontFamily={FUENTE_MAQUINA}
                    fontWeight={700}
                    fontSize={size}
                    fill={C.navy}
                  >
                    {l.slice(0, vis)}
                  </text>
                );
              });
            })()}
          </g>
        ) : null}
        <rect x={-360} y={-270} width={720} height={44} rx={22} fill={C.negro} />
        <rect x={-356} y={-266} width={712} height={12} rx={6} fill={C.gris2} opacity={0.5} />
        <circle cx={-380} cy={-248} r={26} fill={cu.sombra} />
        <circle cx={380} cy={-248} r={26} fill={cu.sombra} />
        <path d="M-380,-248 L-440,-300" stroke={C.gris} strokeWidth={10} strokeLinecap="round" />
      </g>
      {/* cuerpo */}
      <path d="M-330,-230 L330,-230 L380,-40 L-380,-40 Z" fill={cu.base} />
      <path d="M150,-230 L330,-230 L380,-40 L200,-40 Z" fill={cu.sombra} opacity={0.6} />
      <path d="M-320,-222 L300,-222" stroke={cu.luz} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
      {/* cesta de barras */}
      <path d="M-160,-230 Q0,-180 160,-230" fill={C.negro} />
      {Array.from({ length: 15 }, (_, k) => {
        const a = -60 + k * (120 / 14);
        return <path key={k} d={`M0,-160 L${fx(Math.sin((a * Math.PI) / 180) * 140)},${fx(-160 - Math.cos((a * Math.PI) / 180) * 50)}`} stroke={C.gris} strokeWidth={3} opacity={0.7} />;
      })}
      {golpe ? <path d="M0,-160 L0,-252" stroke={C.gris} strokeWidth={6} strokeLinecap="round" /> : null}
      {/* teclado */}
      <path d="M-380,-40 L380,-40 L400,90 L-400,90 Z" fill={cu.sombra} />
      {[0, 1, 2, 3].map((fila) => {
        const nT = 11 - (fila === 3 ? 4 : 0);
        return Array.from({ length: nT }, (_, k) => {
          const kx = (k - (nT - 1) / 2) * (56 + fila * 2);
          const ky = -10 + fila * 26;
          const salta = tecleando && random(`mq${Math.floor(f / 2)}${fila}${k}`) > 0.9 ? 5 : 0;
          return (
            <g key={`${fila}-${k}`}>
              <ellipse cx={kx} cy={ky + 6} rx={20} ry={9} fill={C.negro} />
              <ellipse cx={kx} cy={ky + salta} rx={20} ry={9} fill={C.crema} stroke={C.negro} strokeWidth={4} />
            </g>
          );
        });
      })}
      <rect x={-200} y={92} width={400} height={18} rx={9} fill={C.crema} stroke={C.negro} strokeWidth={4} />
      <rect x={-420} y={100} width={840} height={24} rx={8} fill={oscurecer(color, 0.45)} />
    </g>
  );
};

/**
 * Lector de microfilm de los 70 (≈ 640 × 760 a s=1; x,y = centro de la base): gabinete crema, pantalla grande con
 * una página de periódico viejo (titulares, columnas y foto) que corre hacia arriba según `avance` (0..1, borroso
 * mientras se mueve), carretes al frente. titular = texto grande de la página (≤ 10 letras a size 46);
 * resalta 0..1 = recuadro amarillo sobre una columna.
 * Ej.: <LectorMicrofilm x={700} y={980} f={f} avance={suave(f, w(2), w(6))} titular="SHIP LOST" resalta={pop(f, w(7))} />
 */
export const LectorMicrofilm: React.FC<{ x: number; y: number; f: number; avance?: number; titular?: string; resalta?: number; s?: number }> = ({
  x,
  y,
  f,
  avance = 0,
  titular,
  resalta = 0,
  s = 1,
}) => {
  const uid = "mf" + idL(useId());
  const gab = dosTonos("#E4D7B8", 0.6);
  const corre = avance * 1400;
  const paginas = [0, 1, 2];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <clipPath id={`${uid}-p`}>
          <rect x={-250} y={-720} width={500} height={420} rx={10} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={6} rx={360} ry={26} fill="rgba(18,12,46,0.25)" />
      <path d="M-300,-760 L300,-760 L320,-260 L-320,-260 Z" fill={gab.base} />
      <path d="M180,-760 L300,-760 L320,-260 L200,-260 Z" fill={gab.sombra} opacity={0.6} />
      <rect x={-262} y={-732} width={524} height={444} rx={14} fill="#2A2733" />
      <g clipPath={`url(#${uid}-p)`}>
        <rect x={-250} y={-720} width={500} height={420} fill="#EEE6CF" />
        <g transform={`translate(0,${fx(-(corre % 1400))})`} opacity={0.92}>
          {paginas.map((k) => (
            <g key={k} transform={`translate(0,${k * 700})`}>
              <rect x={-230} y={-700} width={460} height={8} fill="#5A5446" />
              <T x={0} y={-640} size={46} fill="#2E2A22">
                {k === 0 && titular ? titular : ["DAILY NEWS", "EXTRA", "MORNING"][k]}
              </T>
              <rect x={-230} y={-620} width={460} height={4} fill="#5A5446" />
              {[0, 1, 2].map((c) => (
                <g key={c}>
                  {Array.from({ length: 16 }, (_, i) => (
                    <rect key={i} x={-226 + c * 156} y={-600 + i * 22} width={140 - (i % 5 === 4 ? 50 : 0)} height={9} rx={3} fill="#8E8670" />
                  ))}
                </g>
              ))}
              <rect x={-70} y={-560} width={140} height={110} fill="#B8AE92" />
              <path d="M-70,-450 L-20,-510 L20,-470 L70,-520 L70,-450 Z" fill="#8E8670" />
            </g>
          ))}
        </g>
        {resalta > 0.01 ? (
          <rect x={-232} y={-600} width={150} height={200} rx={8} fill={C.amarillo} opacity={0.3 * resalta} stroke={C.amarillo} strokeWidth={6} />
        ) : null}
        <rect x={-250} y={-720} width={500} height={60} fill={C.blanco} opacity={0.1} />
      </g>
      {/* mesa y carretes */}
      <path d="M-340,-260 L340,-260 L360,-180 L-360,-180 Z" fill={gab.sombra} />
      {[-150, 150].map((cx, k) => (
        <g key={cx} transform={`translate(${cx},-220) rotate(${(avance * 1400 + f * (k ? 1 : -1) * (avance > 0 && avance < 1 ? 3 : 0)) % 360})`}>
          <circle r={46} fill={C.gris2} stroke={C.navy} strokeWidth={4} />
          {[0, 120, 240].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 24} cy={Math.sin((a * Math.PI) / 180) * 24} r={10} fill={C.navy} />
          ))}
          <circle r={8} fill={C.gris} />
        </g>
      ))}
      <path d="M-104,-220 L104,-220" stroke="#4A3A28" strokeWidth={8} />
      <rect x={-300} y={-180} width={600} height={180} rx={10} fill={gab.base} />
      <rect x={-300} y={-180} width={600} height={20} rx={8} fill={gab.luz} />
      <circle cx={220} cy={-90} r={26} fill={C.gris2} stroke={C.navy} strokeWidth={4} />
    </g>
  );
};

/**
 * Pila de cartas (sobres) que salen y vuelven: salen 0..1 = n sobres vuelan desde la pila hacia arriba a la
 * derecha; vuelven 0..1 = regresan y caen en otra pila con sello oficial (círculo rojo o azul). x,y = centro de la
 * pila de salida; la de vuelta queda en x+dx. Cada sobre ≈ 200 × 120 a s=1.
 * Ej.: <PilaCartas x={700} y={800} f={f} salen={sale(f, w(3), w(8))} vuelven={sale(f, w(9), w(14))} />
 */
export const PilaCartas: React.FC<{ x: number; y: number; f: number; salen?: number; vuelven?: number; n?: number; dx?: number; s?: number }> = ({
  x,
  y,
  f,
  salen = 0,
  vuelven = 0,
  n = 8,
  dx = 560,
  s = 1,
}) => {
  const Sobre = ({ sello, rot }: { sello?: string; rot: number }) => (
    <g transform={`rotate(${rot})`}>
      <rect x={-96} y={-56} width={200} height={120} rx={8} fill="rgba(18,12,46,0.25)" />
      <rect x={-100} y={-62} width={200} height={120} rx={8} fill={C.crema} stroke="#C9B994" strokeWidth={3} />
      <path d="M-100,-62 L0,4 L100,-62" stroke="#C9B994" strokeWidth={4} fill="none" />
      <rect x={58} y={-52} width={30} height={36} rx={3} fill={C.rojo} opacity={0.8} />
      <rect x={-70} y={14} width={90} height={7} rx={3} fill="#8E8670" />
      <rect x={-70} y={28} width={60} height={7} rx={3} fill="#8E8670" />
      {sello ? (
        <g>
          <circle cx={40} cy={18} r={30} fill="none" stroke={sello} strokeWidth={6} />
          <circle cx={40} cy={18} r={18} fill="none" stroke={sello} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: n }, (_, k) => {
        const t = lim(salen * (n + 2) - k, 0, 1);
        const v = lim(vuelven * (n + 2) - k, 0, 1);
        if (v > 0) {
          const px = dx + (1 - v) * 300;
          const py = -k * 10 - (1 - v) * 500 + Math.sin(v * Math.PI) * -60;
          return (
            <g key={k} transform={`translate(${px},${py})`}>
              <Sobre rot={(random(`pc${k}`) - 0.5) * 16 * (1 - v) + (k % 2 ? 3 : -3)} sello={k % 2 ? C.rojo : PB.azul} />
            </g>
          );
        }
        if (t >= 1) return null;
        const px = t * 500 + Math.sin(f / 10 + k) * 6 * t;
        const py = -k * 10 - t * 640 - Math.sin(t * Math.PI) * 80;
        return (
          <g key={k} transform={`translate(${px},${py}) scale(${1 - 0.4 * t})`} opacity={1 - t * 0.6}>
            <Sobre rot={(k % 2 ? 4 : -4) + t * 30} />
          </g>
        );
      })}
    </g>
  );
};

/**
 * Fila de fichas de dominó de pie, cada una con su rótulo debajo (líneas de ≤ 13 letras a size 40), que caen una
 * tras otra hacia la derecha: p = cuántas cayeron (decimal = la que va cayendo). iconos = contenido opcional en la
 * cara de cada ficha (origen al centro de la cara, ≈ 120 × 220); si no, puntos. ancho = separación entre fichas.
 * Ej.: <FilaDomino x={180} y={760} f={f} p={interpolate(f, [w(4), w(14)], [0, 5], fijo)}
 *        rotulos={[["SURE HE WAS", "OVER THE KEYS"], ["COMPASSES", "OUT"], ["ROUGH SEA"], ["SUNSET"], ["FUEL"]]} />
 */
export const FilaDomino: React.FC<{
  x: number;
  y: number;
  f: number;
  rotulos: string[][];
  p?: number;
  ancho?: number;
  iconos?: (React.ReactNode | null)[];
  s?: number;
  aparece?: number[];
}> = ({ x, y, f, rotulos, p = 0, ancho = 350, iconos = [], s = 1, aparece = [] }) => {
  const ficha = dosTonos("#FBF6EA", 0.5);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {rotulos.map((r, k) => {
        const ap = aparece[k] ?? 1;
        if (ap <= 0.01) return null;
        const caida = lim(p - k, 0, 1);
        const ang = caida * caida * (k === rotulos.length - 1 ? 86 : 58);
        const cx = k * ancho;
        return (
          <g key={k} transform={`translate(${cx},0) scale(${ap})`}>
            <ellipse cx={20 + caida * 80} cy={6} rx={90 + caida * 60} ry={16} fill="rgba(18,12,46,0.22)" />
            <g transform={`rotate(${ang} 70 0)`}>
              <rect x={-66} y={-300} width={136} height={300} rx={18} fill={ficha.sombra} />
              <rect x={-70} y={-304} width={130} height={300} rx={18} fill={ficha.base} stroke={C.navy} strokeWidth={5} />
              <path d="M-60,-154 L50,-154" stroke={C.navy} strokeWidth={5} />
              {iconos[k] ? (
                <g transform="translate(-5,-228)">{iconos[k]}</g>
              ) : (
                [
                  [-30, -260],
                  [20, -200],
                  [-30, -110],
                  [20, -50],
                ].map(([px, py], i) => <circle key={i} cx={px} cy={py} r={13} fill={C.navy} />)
              )}
              <path d="M-56,-290 L-56,-30" stroke={C.blanco} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
            </g>
            {r.map((l, i) => {
              const wl = Math.max(...r.map((q) => anchoT(q, 40) * 0.92));
              return (
                <g key={i}>
                  {i === 0 ? <rect x={-wl / 2 - 20} y={36} width={wl + 40} height={r.length * 52 + 20} rx={16} fill={caida > 0.5 ? C.rojo : C.navy2} stroke={C.blanco} strokeWidth={4} /> : null}
                  <T x={0} y={84 + i * 52} size={40}>
                    {l}
                  </T>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

/**
 * Sala de una biblioteca universitaria de los 70 (fondo de 1920 × 1080 con paralaje): pared del fondo con
 * estanterías llenas de lomos de colores, paredes laterales en perspectiva, lámparas fluorescentes, alfombra
 * naranja con dibujo, fichero de cajoncitos a la izquierda y mostrador de madera al frente (mostrador false lo
 * quita). camara = la del RigCamara (useCamaraFondo) para que las capas se separen.
 * Ej.: <SalaBiblioteca f={f} camara={useCamaraFondo()} />
 */
export const SalaBiblioteca: React.FC<{ f: number; camara?: CamaraFondo; mostrador?: boolean; fichero?: boolean }> = ({
  f,
  camara,
  mostrador = true,
  fichero = true,
}) => {
  const cx = camara?.x ?? 0;
  const lomos = ["#C8553D", "#2F6DB5", "#E9B44C", "#3FAF7E", "#8E5BB0", "#D9822B", "#5E7FA6", "#A8703E"];
  const Estante = ({ x0, y0, w, filas, k0 }: { x0: number; y0: number; w: number; filas: number; k0: number }) => (
    <g>
      <rect x={x0 - 16} y={y0 - 20} width={w + 32} height={filas * 120 + 40} fill="#7E5230" />
      <rect x={x0} y={y0} width={w} height={filas * 120} fill="#4E3424" />
      {Array.from({ length: filas }, (_, r) => {
        const yy = y0 + r * 120 + 100;
        return (
          <g key={r}>
            {[0, 1, 2].map((c) => (
              <path
                key={c}
                d={`M${x0 + 6 + c * 9},${yy - 40} L${x0 + w - 6},${yy - 40}`}
                stroke={lomos[(k0 + r * 3 + c) % lomos.length]}
                strokeWidth={70 + c * 6}
                strokeDasharray={`${14 + c * 5 + (r % 3) * 2} ${30 - c * 6 + (k0 % 4) * 2}`}
                strokeDashoffset={(k0 * 37 + r * 13 + c * 11) % 50}
                transform={`translate(0,${c * 4})`}
              />
            ))}
            <rect x={x0} y={yy} width={w} height={18} fill="#A8703E" />
            <rect x={x0} y={yy} width={w} height={5} fill="#C99360" />
          </g>
        );
      })}
    </g>
  );
  return (
    <g>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#E8D3A6" />
      {/* techo con fluorescentes */}
      <path d={`M-200,-200 L${W + 200},-200 L${W + 200},120 L-200,120 Z`} fill="#D9C79F" />
      <g transform={`translate(${-cx * 0.2},0)`}>
        {[200, 700, 1200, 1700].map((lx, k) => (
          <g key={lx}>
            <rect x={lx - 140} y={40} width={280} height={34} rx={6} fill="#FFFBEA" />
            <rect x={lx - 140} y={40} width={280} height={34} rx={6} fill="none" stroke="#BDA982" strokeWidth={4} />
            <path d={`M${lx - 200},74 L${lx + 200},74 L${lx + 320},560 L${lx - 320},560 Z`} fill="#FFF8DC" opacity={0.12 + 0.03 * Math.sin(f / 20 + k)} />
          </g>
        ))}
      </g>
      {/* pared del fondo con estanterías */}
      <g transform={`translate(${-cx * 0.35},0)`}>
        <Estante x0={-120} y0={160} w={620} filas={4} k0={1} />
        <Estante x0={600} y0={160} w={720} filas={4} k0={4} />
        <Estante x0={1420} y0={160} w={620} filas={4} k0={7} />
      </g>
      {/* alfombra 70s */}
      <g transform={`translate(${-cx * 0.7},0)`}>
        <rect x={-400} y={700} width={W + 800} height={500} fill="#C4652F" />
        {Array.from({ length: 9 }, (_, k) => (
          <circle key={k} cx={-200 + k * 300} cy={860} r={80} fill="none" stroke="#E08A3C" strokeWidth={14} opacity={0.7} />
        ))}
        <rect x={-400} y={700} width={W + 800} height={14} fill="#8E4420" />
        {fichero ? (
          <g transform="translate(150,700)">
            <rect x={-10} y={-330} width={300} height={340} rx={8} fill="#7E5230" />
            {Array.from({ length: 6 }, (_, r) =>
              Array.from({ length: 4 }, (_, c) => (
                <g key={`${r}${c}`}>
                  <rect x={8 + c * 68} y={-312 + r * 52} width={60} height={42} rx={4} fill="#A8703E" />
                  <rect x={28 + c * 68} y={-296 + r * 52} width={20} height={8} rx={3} fill={PB.oro} />
                </g>
              )),
            )}
            <rect x={-20} y={0} width={320} height={16} rx={4} fill="#4E3424" />
          </g>
        ) : null}
      </g>
      {/* mostrador al frente */}
      {mostrador ? (
        <g transform={`translate(${-cx * 1.0},0)`}>
          <rect x={360} y={760} width={1300} height={60} rx={10} fill="#C99360" />
          <rect x={360} y={760} width={1300} height={14} rx={6} fill="#E2B07E" />
          <rect x={380} y={820} width={1260} height={300} fill="#8A5E3A" />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <rect key={k} x={410 + k * 205} y={850} width={170} height={210} rx={8} fill="#7E5230" stroke="#6B4529" strokeWidth={4} />
          ))}
          <rect x={1300} y={690} width={140} height={76} rx={8} fill="#5A6070" />
          <rect x={1310} y={700} width={120} height={20} rx={4} fill="#7C849C" />
          {[0, 1, 2].map((k) => (
            <rect key={k} x={560 + k * 26} y={700 - k * 2} width={22} height={62} rx={3} fill={lomos[(k + 2) % lomos.length]} transform={`rotate(${k * 4 - 4} ${560 + k * 26} 760)`} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Taza de café con vapor (≈ 120 × 130 a s=1, x,y = base). */
export const Taza: React.FC<{ x: number; y: number; f: number; s?: number; color?: string; vapor?: boolean }> = ({ x, y, f, s = 1, color = C.rojo, vapor = true }) => {
  const t = dosTonos(color);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={66} ry={12} fill="rgba(18,12,46,0.25)" />
      <path d="M44,-90 Q90,-86 86,-56 Q82,-30 44,-34" stroke={t.sombra} strokeWidth={14} fill="none" />
      <path d="M-50,-110 L50,-110 L42,-6 Q0,6 -42,-6 Z" fill={t.base} />
      <path d="M10,-110 L50,-110 L42,-6 Q24,0 14,0 Z" fill={t.sombra} opacity={0.6} />
      <ellipse cx={0} cy={-110} rx={50} ry={12} fill="#4A2E1E" stroke={t.luz} strokeWidth={5} />
      <path d="M-36,-96 L-30,-20" stroke={t.luz} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
      {vapor
        ? [0, 1, 2].map((k) => {
            const ph = ((f + k * 20) % 60) / 60;
            return (
              <path
                key={k}
                d={`M${-20 + k * 20},-130 q${12 * Math.sin(f / 10 + k)},-30 0,-60 q${-12 * Math.sin(f / 10 + k)},-30 0,-60`}
                stroke={C.blanco}
                strokeWidth={7}
                fill="none"
                strokeLinecap="round"
                opacity={0.45 * (1 - ph)}
                transform={`translate(0,${-ph * 30})`}
              />
            );
          })
        : null}
    </g>
  );
};

/** Ayuda: color de lomo de libro determinista para piezas que dibujan estanterías. */
export const colorLomo = (k: number) => ["#C8553D", "#2F6DB5", "#E9B44C", "#3FAF7E", "#8E5BB0", "#D9822B"][((k % 6) + 6) % 6];
