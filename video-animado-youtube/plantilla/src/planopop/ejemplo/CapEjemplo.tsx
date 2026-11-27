// MODELO DE CAPÍTULO (no está registrado en Root.tsx; se copia a planopop/vNN/CapMM.tsx y se cambia).
// Probado con un guion de 12 palabras: «The deepest hole on Earth is only nine inches wide. Nobody expected …».
// Patrón: MontajeNarrativo (escenas que se solapan con transiciones variadas) y, en cada escena, RigCamara con una
// toma por cada cosa que nombra la voz. w(i) = fotograma local en que se dice la palabra i (scripts/indices.py).
// Los textos de pantalla van en CapaTexto (la cámara no los mueve ni los recorta).
import React from "react";
import { useCurrentFrame } from "remotion";
import { EstiloProps, Sonido } from "../../estilos/base";
import {
  C,
  CapaParalaje,
  CapaTexto,
  EscenaNarrativa,
  EscenaProps,
  EspacioProfundo,
  PersonaViva,
  RigCamara,
  TextoSeguro,
  MontajeNarrativo,
  Tierra,
  pop,
  useCamaraFondo,
} from "../biblioteca";

// Los fondos que siguen a la cámara van en un componente propio: useCamaraFondo() tiene que llamarse DENTRO del
// RigCamara (lee la cámara del rig); llamado en el cuerpo de la escena devolvería una cámara quieta.
const FondoEspacio: React.FC<{ f: number; tono?: "azul" | "violeta" | "rojo" | "verde" }> = ({ f, tono }) => (
  <EspacioProfundo f={f} tono={tono} camara={useCamaraFondo()} />
);

// 1 · planeta (palabra 0): la cámara arranca abierta y se acerca a la Tierra en la palabra 3
const Planeta: React.FC<EscenaProps> = ({ w }) => {
  const f = useCurrentFrame();
  return (
    <RigCamara w={w} escenario={{ w: 3200, h: 1800 }} tomas={[{ en: 0, x: 1600, y: 900, zoom: 0.62 }, { p: 3, x: 1600, y: 900, zoom: 1.3, curva: "frena" }]}>
      <CapaParalaje p={0}>
        <FondoEspacio f={f} />
      </CapaParalaje>
      <Tierra x={1600} y={900} r={260} f={f} />
      <CapaTexto>
        <TextoSeguro texto="NINE INCHES WIDE" x={960} y={180} size={110} f={f} desde={w(6)} />
      </CapaTexto>
    </RigCamara>
  );
};

// 2 · perforador (palabra 8): primer plano de la persona que reacciona
const Perforador: React.FC<EscenaProps> = ({ w }) => {
  const f = useCurrentFrame();
  return (
    <RigCamara w={w} tomas={[{ en: 0, x: 960, y: 540, zoom: 1 }, { p: 9, x: 960, y: 600, zoom: 1.5 }]}>
      <CapaParalaje p={0}>
        <FondoEspacio f={f} tono="violeta" />
      </CapaParalaje>
      <g opacity={pop(f, w(8))}>
        <PersonaViva x={960} y={760} f={f} s={1.6} expresion="susto" habla={[w(8), w(10)]} />
      </g>
    </RigCamara>
  );
};

const ESCENAS: EscenaNarrativa[] = [
  { id: "planeta", desde: 0, comp: Planeta },
  { id: "perforador", desde: 8, comp: Perforador },
];
const SONIDOS: Sonido[] = [];

export const CapEjemplo: React.FC<EstiloProps> = (p) => (
  <MontajeNarrativo {...p} escenas={ESCENAS} sonidos={SONIDOS} fondo={C.navy} semilla="ejemplo" />
);
