// Composición de prueba de efectos-ricos.tsx (humo, explosión, fuego, estela, postquemador, polvo, escombros,
// chispas y ondas de calor). Solo para revisar fotogramas sueltos; no es un video.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  C,
  Chispas,
  Escombros,
  Estela,
  ExplosionRica,
  Fuego,
  Humo,
  Jet,
  Lienzo,
  OndasCalor,
  PolvoImpacto,
  Postquemador,
} from "./biblioteca";

export const FPS_EFR = 30;

const Cielo: React.FC<{ arriba: string; abajo: string; suelo?: number; tierra?: string; id: string }> = ({
  arriba,
  abajo,
  suelo = 900,
  tierra = "#3B2F5C",
  id,
}) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={arriba} />
        <stop offset="100%" stopColor={abajo} />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill={`url(#${id})`} />
    <path d={`M0,${suelo - 60} Q300,${suelo - 130} 640,${suelo - 70} T1300,${suelo - 90} T1920,${suelo - 60} V1080 H0 Z`} fill="#2C2350" opacity={0.7} />
    <rect y={suelo} width={1920} height={1080 - suelo} fill={tierra} />
    <rect y={suelo} width={1920} height={10} fill="#000" opacity={0.18} />
  </g>
);

const Humos: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Lienzo>
      <Cielo id="c0" arriba="#5B6FB8" abajo="#E7A78C" />
      {/* chimenea */}
      <rect x={290} y={560} width={80} height={340} fill="#7A4B52" />
      <rect x={330} y={560} width={40} height={340} fill="#5E3943" />
      <rect x={278} y={548} width={104} height={26} fill="#5E3943" />
      <Humo x={330} y={548} f={f + 200} variante="chimenea" semilla="d1" />
      {/* incendio */}
      <Fuego x={960} y={900} f={f} w={380} alto={400} semilla="d2" />
      {/* volcán */}
      <path d="M1300,900 L1500,640 L1620,640 L1820,900 Z" fill="#5E4A4A" />
      <path d="M1560,640 L1620,640 L1820,900 L1600,900 Z" fill="#4A3A40" />
      <Humo x={1560} y={645} f={f + 300} s={0.6} variante="volcan" viento={0.8} semilla="d3" />
    </Lienzo>
  );
};

const Tierra: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Lienzo>
      <Cielo id="c1" arriba="#2A2366" abajo="#7B5FB0" />
      <ExplosionRica x={960} y={920} f={f} desde={6} tam="grande" tipo="tierra" />
    </Lienzo>
  );
};

const Aire: React.FC = () => {
  const f = useCurrentFrame();
  const tr = (u: number) => {
    const x0 = 1750, y0 = 1000, cx = 1500, cy = 320, x1 = 900, y1 = 360;
    const v = u * (0.6 + 0.4 * u);
    return { x: (1 - v) * (1 - v) * x0 + 2 * v * (1 - v) * cx + v * v * x1, y: (1 - v) * (1 - v) * y0 + 2 * v * (1 - v) * cy + v * v * y1 };
  };
  return (
    <Lienzo>
      <Cielo id="c2" arriba="#3D3A8C" abajo="#C98AA8" suelo={1000} />
      <Estela f={f} trayectoria={tr} desde={0} dura={48} semilla="d4" />
      <ExplosionRica x={900} y={360} f={f} desde={48} tam="mediana" tipo="aire" semilla="d5" />
      <ExplosionRica x={1450} y={220} f={f} desde={70} tam="chica" tipo="aire" semilla="d6" />
    </Lienzo>
  );
};

const Avion: React.FC = () => {
  const f = useCurrentFrame();
  const jx = 300 + f * 9;
  const jy = 420;
  return (
    <Lienzo>
      <Cielo id="c3" arriba="#1F2A6B" abajo="#6C7FC8" suelo={880} tierra="#4A4560" />
      <OndasCalor x={960} y={880} f={f} w={1700} h={200} fuerza={7}>
        <path d="M0,880 Q500,800 960,850 T1920,830 V880 H0 Z" fill="#3C3866" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <rect key={k} x={120 + k * 300} y={850} width={150} height={12} fill="#FFFFFF" opacity={0.5} />
        ))}
      </OndasCalor>
      <rect y={880} width={1920} height={200} fill="#4A4560" />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <rect key={k} x={((k * 300 - f * 30) % 2100 + 2100) % 2100 - 150} y={960} width={170} height={16} fill="#E8E4D8" />
      ))}
      <Estela f={f + 60} puntos={[[300 - 60 * 9 - 222, jy + 4], [300 + 150 * 9 - 222, jy + 4]]} desde={0} dura={210} n={70} ancho0={20} ancho1={100} viento={-0.5} sube={0.35} cabeza={false} semilla="d7" />
      <Postquemador x={jx - 222} y={jy + 4} f={f} largo={300} alto={46} />
      <Jet x={jx} y={jy} f={f} />
      <Chispas x={380} y={960} f={f} continuo n={30} dir={-160} abre={50} vel={16} gravedad={0.5} vida={24} semilla="d8" />
    </Lienzo>
  );
};

const Impacto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Lienzo>
      <Cielo id="c4" arriba="#6A4FA8" abajo="#F0B78E" />
      <PolvoImpacto x={600} y={900} f={f} desde={4} semilla="d9" />
      <Escombros x={600} y={890} f={f} desde={4} suelo={10} semilla="d10" />
      <Chispas x={1150} y={600} f={f} desde={8} semilla="d11" />
      <Fuego x={1500} y={900} f={f} w={520} alto={500} n={6} semilla="d12" />
    </Lienzo>
  );
};

const ESCENAS: [React.FC, number][] = [
  [Humos, 150],
  [Tierra, 210],
  [Aire, 180],
  [Avion, 150],
  [Impacto, 150],
];
export const DUR_EFR = ESCENAS.reduce((a, [, d]) => a + d, 0);

export const EfectosRicosDemo: React.FC = () => {
  let desde = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
      {ESCENAS.map(([Comp, d], k) => {
        const s = (
          <Sequence key={k} from={desde} durationInFrames={d}>
            <Comp />
          </Sequence>
        );
        desde += d;
        return s;
      })}
    </AbsoluteFill>
  );
};
