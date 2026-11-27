// Registro de composiciones. No hace falta tocarlo para un video nuevo: los videos salen de planopop/videos.tsx.
import React from "react";
import { Composition, Still } from "remotion";
import { calcularEstilo, EstiloProps, FPS as FPS_EST } from "./estilos/base";
import { CompletoProps, FPS_POP } from "./planopop/Completo";
import { COMPLETOS } from "./planopop/videos";
import { MiniaturaTop, MiniaturaTopProps } from "./planopop/Miniatura";
import { BibliotecaDemo, DUR_DEMO, FPS_DEMO } from "./planopop/BibliotecaDemo";
import { DUR_FONDOS, FondosRicosDemo, FPS_FONDOS } from "./planopop/FondosRicosDemo";
import { DUR_EFR, EfectosRicosDemo, FPS_EFR } from "./planopop/EfectosRicosDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Cada video largo (VNN) y cada uno de sus capítulos suelto (VNNCapMM), para revisar de a uno */}
      {COMPLETOS.map(({ v, Componente, calcular }) => (
        <React.Fragment key={v.id}>
          <Composition id={v.id} component={Componente} calculateMetadata={calcular} defaultProps={{} satisfies CompletoProps} durationInFrames={FPS_POP * 540} fps={FPS_POP} width={1920} height={1080} />
          {v.capitulos.map((c) => (
            <Composition key={c.trabajo} id={`${v.id}Cap${c.trabajo.slice(-2)}`} component={c.comp} calculateMetadata={calcularEstilo} defaultProps={{ trabajo: c.trabajo } satisfies EstiloProps} durationInFrames={FPS_EST * 60} fps={FPS_EST} width={1920} height={1080} />
          ))}
        </React.Fragment>
      ))}
      {/* Muestras de la biblioteca (no necesitan voz ni sonidos): sirven para comprobar que la instalación funciona */}
      <Composition id="BibliotecaDemo" component={BibliotecaDemo} durationInFrames={DUR_DEMO} fps={FPS_DEMO} width={1920} height={1080} />
      <Composition id="FondosRicosDemo" component={FondosRicosDemo} durationInFrames={DUR_FONDOS} fps={FPS_FONDOS} width={1920} height={1080} />
      <Composition id="EfectosRicosDemo" component={EfectosRicosDemo} durationInFrames={DUR_EFR} fps={FPS_EFR} width={1920} height={1080} />
      {/* Miniatura de YouTube: arte sin texto en public/miniaturas/ + el texto exacto por código */}
      <Still id="MiniaturaTop" component={MiniaturaTop} defaultProps={{ arte: "miniaturas/arte.png", texto: "NO WAY BACK" } satisfies MiniaturaTopProps} width={1280} height={720} />
    </>
  );
};
