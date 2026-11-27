// Composición de prueba de los fondos ricos (planopop/biblioteca/fondos-ricos.tsx): 16 escenas de 2 s, cada una
// con un fondo y una cámara que se mueve (paneo + zoom) para ver el paralaje. Solo para revisar fotogramas.
// Escena k = fotogramas [60k, 60k+59]; el fotograma 60k+30 es el centro de cada una.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CamaraFondo, CieloAlto, CieloNocturno, EspacioProfundo, Interior, Lienzo, Oceano, Paisaje } from "./biblioteca";

export const FPS_FONDOS = 30;
const ESC = 60;

type Escena = (f: number, cam: CamaraFondo) => React.ReactNode;
const ESCENAS: Escena[] = [
  (f, cam) => <EspacioProfundo f={f} camara={cam} tono="violeta" planeta={{ anillo: true }} />,
  (f, cam) => <EspacioProfundo f={f} camara={cam} tono="azul" galaxias={3} semilla="az" />,
  (f, cam) => <EspacioProfundo f={f} camara={cam} tono="rojo" galaxias={1} planeta={{ x: 380, y: 860, r: 320, color: "#3E86E0", color2: "#8FD0F0", atmosfera: "#9FE0FF" }} semilla="rj" />,
  (f, cam) => <CieloAlto f={f} camara={cam} momento="estratosfera" rafagas={0.6} />,
  (f, cam) => <CieloAlto f={f} camara={cam} momento="dia" />,
  (f, cam) => <CieloAlto f={f} camara={cam} momento="atardecer" rafagas={0.4} />,
  (f, cam) => <CieloNocturno f={f} camara={cam} />,
  (f, cam) => <Paisaje f={f} camara={cam} variante="montana" />,
  (f, cam) => <Paisaje f={f} camara={cam} variante="desierto" momento="atardecer" />,
  (f, cam) => <Paisaje f={f} camara={cam} variante="selva" />,
  (f, cam) => <Paisaje f={f} camara={cam} variante="ciudad" momento="noche" />,
  (f, cam) => <Interior f={f} camara={cam} variante="hangar" />,
  (f, cam) => <Interior f={f} camara={cam} variante="laboratorio" />,
  (f, cam) => <Interior f={f} camara={cam} variante="sala" luces={2} />,
  (f, cam) => <Oceano f={f} camara={cam} momento="dia" />,
  (f, cam) => <Oceano f={f} camara={cam} momento="atardecer" oleaje={1.3} />,
];
export const DUR_FONDOS = ESCENAS.length * ESC;

export const FondosRicosDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const k = Math.min(ESCENAS.length - 1, Math.floor(frame / ESC));
  const f = (frame % ESC) + 40;
  const t = (frame % ESC) / ESC;
  const cam: CamaraFondo = { x: (t - 0.5) * 300, y: Math.sin(t * Math.PI) * -40, zoom: 1 + t * 0.15 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Lienzo>{ESCENAS[k](f, cam)}</Lienzo>
    </AbsoluteFill>
  );
};
