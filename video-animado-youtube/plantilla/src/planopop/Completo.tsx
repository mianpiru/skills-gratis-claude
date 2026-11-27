// Molde de un explicativo largo por capítulos en Plano Pop (genérico):
// une los capítulos en fila y pone la música por tramos, bajita y a volumen constante.
// Cada video nuevo vive en `planopop/vNN/` (CapNN.tsx + video.tsx) y se anota en `planopop/videos.tsx`.
import React from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, Series, interpolate, staticFile } from "remotion";
import { EstiloProps, Palabra, fijo } from "../estilos/base";

export const FPS_POP = 30;

/** `trabajo` = carpeta de public/ con voz.wav y palabras.json (inf-NN-capMM); `cola` = segundos de aire al final */
export type CapituloPop = { trabajo: string; comp: React.FC<EstiloProps>; cola: number };
/** Pista de public/musica (sin .mp3) para los capítulos [desde, hasta) (índices, hasta sin incluir).
 *  `salto` = segundos que se saltan del inicio de la pista (su intro lenta). */
export type TramoMusica = { archivo: string; desde: number; hasta: number; salto?: number };
/** `id` es el nombre de la composición (por ejemplo "V07"); cada capítulo suelto queda como "V07Cap03". */
export type VideoPop = { id: string; capitulos: CapituloPop[]; musica: TramoMusica[] };

export type CompletoProps = {
  /** volumen de la música (pistas normalizadas a unos -16 LUFS; la voz ronda -17) */
  volumen?: number;
  datos?: { palabras: Palabra[]; cuadros: number }[];
};

const CRUCE = 20; // fotogramas de entrada y salida de cada pista

export const crearCompleto = (v: VideoPop) => {
  const calcular: CalculateMetadataFunction<CompletoProps> = async ({ props }) => {
    const datos = await Promise.all(
      v.capitulos.map(async (c) => {
        const palabras: Palabra[] = await fetch(staticFile(`${c.trabajo}/palabras.json`)).then((r) => r.json());
        return { palabras, cuadros: Math.ceil((palabras[palabras.length - 1].fin + c.cola) * FPS_POP) };
      }),
    );
    return { durationInFrames: datos.reduce((s, d) => s + d.cuadros, 0), props: { ...props, datos } };
  };

  const Componente: React.FC<CompletoProps> = ({ datos, volumen = 0.11 }) => {
    if (!datos) return null;
    const inicio = (k: number) => datos.slice(0, k).reduce((t, d) => t + d.cuadros, 0);
    return (
      <AbsoluteFill style={{ backgroundColor: "#1B1443" }}>
        <Series>
          {v.capitulos.map((c, k) => {
            const Comp = c.comp;
            return (
              <Series.Sequence key={c.trabajo} durationInFrames={datos[k].cuadros}>
                <Comp trabajo={c.trabajo} palabras={datos[k].palabras} />
              </Series.Sequence>
            );
          })}
        </Series>
        {v.musica.map((m, k) => {
          const desde = inicio(m.desde);
          const dur = inicio(m.hasta) - desde;
          const ultimo = k === v.musica.length - 1;
          return (
            <Sequence key={k} from={desde} durationInFrames={dur}>
              <Audio
                src={staticFile(`musica/${m.archivo}.mp3`)}
                loop
                trimBefore={(m.salto ?? 0) * FPS_POP}
                volume={(f) =>
                  volumen *
                  interpolate(f, [0, CRUCE], [k === 0 ? 1 : 0, 1], fijo) *
                  interpolate(f, [dur - (ultimo ? 60 : CRUCE), dur - (ultimo ? 5 : 0)], [1, 0], fijo)
                }
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    );
  };

  return { calcular, Componente };
};
