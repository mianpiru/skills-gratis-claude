// Base común de los estilos de explicativos animados 16:9 (1920×1080, 30 fps).
// Cada estilo vive en su propio archivo de esta carpeta y solo aporta: paleta, personaje,
// escenas y sonidos. Aquí está lo que comparten: lectura de tiempos, utilidades y el montaje.
// La usan el kit y la biblioteca de Plano Pop (../planopop).
import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useVideoConfig,
} from "remotion";

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export type Palabra = { i: number; palabra: string; inicio: number; fin: number };
export type EstiloProps = { trabajo: string; palabras?: Palabra[] };

// Lee public/<trabajo>/palabras.json: el tiempo de cada palabra del guion, en segundos
export const calcularEstilo: CalculateMetadataFunction<EstiloProps> = async ({ props }) => {
  const palabras: Palabra[] = await fetch(staticFile(`${props.trabajo}/palabras.json`)).then((r) => r.json());
  const fin = palabras[palabras.length - 1].fin;
  return { durationInFrames: Math.ceil((fin + 1.3) * FPS), props: { ...props, palabras } };
};

// Formato vertical 9:16 (1080×1920). Deja 2,6 s después de la última palabra para el gesto final.
export const WV = 1080;
export const HV = 1920;
export const calcularVertical: CalculateMetadataFunction<EstiloProps> = async ({ props }) => {
  const palabras: Palabra[] = await fetch(staticFile(`${props.trabajo}/palabras.json`)).then((r) => r.json());
  const fin = palabras[palabras.length - 1].fin;
  return { durationInFrames: Math.ceil((fin + 2.6) * FPS), props: { ...props, palabras } };
};

// ---------- utilidades de animación ----------
export const fijo = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** 0→1 con rebote, desde el fotograma `en`. Antes vale 0. */
export const pop = (f: number, en: number) =>
  f < en ? 0 : spring({ frame: f - en, fps: FPS, config: { damping: 10, stiffness: 170, mass: 0.7 } });
/** 0→1 suave (entra y sale despacio) entre los fotogramas a y b. */
export const suave = (f: number, a: number, b: number) =>
  interpolate(f, [a, Math.max(a + 1, b)], [0, 1], { ...fijo, easing: Easing.inOut(Easing.cubic) });
/** 0→1 que frena al final, entre a y b. */
export const sale = (f: number, a: number, b: number) =>
  interpolate(f, [a, Math.max(a + 1, b)], [0, 1], { ...fijo, easing: Easing.out(Easing.cubic) });
/** transform de SVG: escala `s` y gira `rot` grados alrededor del punto (cx, cy). */
export const en = (cx: number, cy: number, s: number, rot = 0) =>
  `translate(${cx},${cy}) rotate(${rot}) scale(${s}) translate(${-cx},${-cy})`;
export const miles = (n: number) => Math.round(n).toLocaleString("en-US");

/** Lienzo SVG de 1920×1080 que llena el cuadro. */
export const Lienzo: React.FC<{ children: React.ReactNode; fondo?: string }> = ({ children, fondo }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", backgroundColor: fondo }}>
    {children}
  </svg>
);

/** Lienzo SVG vertical de 1080×1920 que llena el cuadro. */
export const LienzoV: React.FC<{ children: React.ReactNode; fondo?: string }> = ({ children, fondo }) => (
  <svg viewBox={`0 0 ${WV} ${HV}`} width={WV} height={HV} style={{ position: "absolute", backgroundColor: fondo }}>
    {children}
  </svg>
);

/** Cada escena recibe `w(i)`: el fotograma LOCAL (dentro de la escena) en que se dice la palabra i. */
export type EscenaProps = { w: (i: number) => number; dur: number };
/** `desde`: índice de la palabra en la que arranca la escena. */
export type Escena = { id: string; desde: number; comp: React.FC<EscenaProps> };
/** [palabra, archivo de public/sfx sin .wav, volumen, desfase en fotogramas, largo máximo en fotogramas] */
export type Sonido = [number, string, number, number?, number?];

export const Montaje: React.FC<
  EstiloProps & {
    escenas: Escena[];
    sonidos: Sonido[];
    fondo: string;
    /** fotogramas que la escena se adelanta a su palabra (por defecto 4) */
    adelanto?: number;
    /** música de fondo de public/musica/<archivo>.mp3: bajita y a volumen constante.
     *  `hastaPalabra`: si se da, la música se apaga justo antes de esa palabra (silencio dramático final). */
    musica?: { archivo: string; volumen: number; hastaPalabra?: number };
    /** envoltorio opcional de cada escena (por ejemplo, un zoom de entrada o una textura encima) */
    marco?: React.FC<{ dur: number; children: React.ReactNode }>;
  }
> = ({ trabajo, palabras, escenas, sonidos, fondo, adelanto = 4, marco: Marco, musica }) => {
  const { durationInFrames } = useVideoConfig();
  const pal = palabras ?? [];
  if (!pal.length) return null;
  const fr = (i: number) => Math.round(pal[Math.max(0, Math.min(i, pal.length - 1))].inicio * FPS);
  const finMusica = musica?.hastaPalabra !== undefined ? Math.max(20, fr(musica.hastaPalabra) - 6) : durationInFrames;
  const inicios = escenas.map((e, k) => (k === 0 ? 0 : Math.max(0, fr(e.desde) - adelanto)));
  return (
    <AbsoluteFill style={{ backgroundColor: fondo }}>
      {escenas.map((e, k) => {
        const ini = inicios[k];
        const dur = Math.max(1, (k < escenas.length - 1 ? inicios[k + 1] : durationInFrames) - ini);
        const Comp = e.comp;
        const dentro = <Comp w={(i) => fr(i) - ini} dur={dur} />;
        return (
          <Sequence key={e.id} from={ini} durationInFrames={dur}>
            {Marco ? <Marco dur={dur}>{dentro}</Marco> : <AbsoluteFill style={{ overflow: "hidden" }}>{dentro}</AbsoluteFill>}
          </Sequence>
        );
      })}
      <Audio src={staticFile(`${trabajo}/voz.wav`)} />
      {musica ? (
        <Sequence from={0} durationInFrames={finMusica}>
          <Audio
            src={staticFile(`musica/${musica.archivo}.mp3`)}
            loop
            volume={(f) => musica.volumen * interpolate(f, [finMusica - 15, finMusica], [1, 0], fijo)}
          />
        </Sequence>
      ) : null}
      {sonidos.map(([i, archivo, vol, desfase = 0, largo = 30], k) => {
        // Un efecto más largo que su ventana (o que el capítulo) se cortaba en seco y sonaba como un golpe:
        // ahora se apaga en sus últimos 6 fotogramas, y nunca pasa del final del capítulo.
        const desde = Math.max(0, fr(i) + desfase);
        const dura = Math.max(1, Math.min(largo, durationInFrames - desde));
        return (
          <Sequence key={k} from={desde} durationInFrames={dura}>
            <Audio
              src={staticFile(`sfx/${archivo}.wav`)}
              volume={(f) => vol * interpolate(f, [dura - 6, dura - 1], [1, 0], fijo)}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
