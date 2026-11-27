// Composición de prueba de la biblioteca (segunda parte): 20 s, 8 escenas de 2,5 s con las piezas nuevas
// (cámara viva, transiciones, fondos en capas, textos con entrada, volumen, PersonaViva, multitud, mano,
// incendio, explosión, relámpago y olas). Solo para revisar fotogramas sueltos; no es un video.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  Barco,
  BrilloEsfera,
  C,
  CamaraViva,
  DefsVolumen,
  EtiquetaCaja,
  Explosion2,
  Expresion,
  FondoBurbujas,
  FondoDegradado,
  FondoEstrellas,
  FondoNubes,
  FondoRayos,
  FondoRejilla,
  Grano,
  Incendio,
  Iris,
  Lienzo,
  Lluvia,
  Lupa,
  ManoSostiene,
  Multitud,
  Olas,
  PersonaViva,
  Polvo,
  Relampago,
  SelloProhibido,
  SombraSuelo,
  Sol,
  TextoEntra,
  Tierra,
  Vineta,
  transformEnfoque,
} from "./biblioteca";

export const FPS_DEMO = 30;
export const DUR_DEMO = 600;
const ESC = 75;

const Estallido: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Lienzo>
      <FondoRayos f={f} colores={["#2A1F5E", C.naranja]} />
      <Explosion2 x={960} y={560} f={f} desde={6} r={240} />
      <TextoEntra x={960} y={940} texto="THE BIG BANG" f={f} desde={28} size={120} modo="rebote" contorno={C.navy} chispa />
    </Lienzo>
  );
};

const Lista: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Lienzo>
      <DefsVolumen />
      <FondoEstrellas f={f} />
      {["HYPER-EXPANSION", "MULTIVERSES", "FALSE VACUUMS"].map((t, k) => (
        <TextoEntra
          key={t}
          x={140}
          y={340 + k * 150}
          texto={t}
          f={f}
          desde={4 + k * 16}
          size={84}
          modo="letras"
          anchor="start"
          chispa
        />
      ))}
      <SelloProhibido x={1500} y={540} f={f} desde={52} r={210}>
        <Tierra x={0} y={0} r={150} f={f} />
        <BrilloEsfera cx={0} cy={0} r={150} />
      </SelloProhibido>
    </Lienzo>
  );
};

const Mano: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Lienzo>
      <FondoRejilla f={f} />
      <ManoSostiene x={860} y={620} f={f} desde={4} hasta={62} angulo={-22}>
        <Lupa x={70} y={-90} r={95} rot={40} />
      </ManoSostiene>
      <EtiquetaCaja x={1420} y={260} texto="SPACE-TIME" f={f} desde={20} icono="usuario" />
    </Lienzo>
  );
};

const Tormenta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Lienzo>
      <FondoNubes f={f} vel={1.5} />
      <Lluvia x={960} y={60} f={f} w={1800} alto={950} n={70} nubes={false} />
      <Relampago x={1150} y1={0} y2={760} f={f} desde={20} />
      <Relampago x={600} y1={0} y2={620} f={f} desde={48} semilla="ray2" deriva={-120} />
      <TextoEntra
        x={960}
        y={980}
        texto="STORM WARNING"
        f={f}
        desde={8}
        size={80}
        modo="deslizar"
        color={C.navy}
        caja={{ fondo: C.amarillo }}
        sombra={false}
      />
    </Lienzo>
  );
};

const CARAS: Expresion[] = ["normal", "feliz", "duda", "susto", "triste", "enojo"];
const Persona: React.FC = () => {
  const f = useCurrentFrame();
  const cara = CARAS[Math.min(5, Math.floor(f / 12))];
  return (
    <Lienzo>
      <FondoDegradado f={f} colores={[C.teal2, C.navy]} colores2={[C.morado, C.navy]} periodo={60} />
      <g transform={transformEnfoque(f, 700, 520, 40, 62, 1.7)}>
        <SombraSuelo x={700} y={1044} rx={170} ry={26} />
        <PersonaViva
          x={700}
          y={1040}
          s={1.6}
          f={f}
          expresion={cara}
          habla={[0, 70]}
          gesto={f < 36 ? "senala" : "explica"}
          gestoDesde={f < 36 ? 6 : 36}
          abrigo={C.rojo}
          peinado="corto"
          lentes
        />
      </g>
      <TextoEntra
        x={1150}
        y={300}
        texto={cara.toUpperCase()}
        f={f}
        desde={Math.floor(f / 12) * 12}
        size={96}
        modo="maquina"
        anchor="start"
        vel={1}
      />
    </Lienzo>
  );
};

const Gente: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Lienzo>
      <FondoBurbujas f={f} />
      <Multitud x={960} y={1030} f={f} n={14} filas={2} s={0.62} w={1700} reaccion={40} />
      <EtiquetaCaja x={960} y={160} texto="EVERYONE" f={f} desde={10} icono="check" size={64} />
    </Lienzo>
  );
};

const Fuego: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Lienzo>
      <FondoDegradado f={f} colores={[C.rojo2, C.negro]} id="fdeg-fuego" />
      <rect x={0} y={950} width={1920} height={130} fill={C.negro} />
      <Incendio x={960} y={985} f={f} w={900} alto={540} intensidad={Math.min(1, 0.4 + f / 20)} />
      <Polvo f={f} color={C.amarillo} />
      <TextoEntra
        x={120}
        y={170}
        texto="IT SPREAD FAST"
        f={f}
        desde={10}
        size={88}
        modo="maquina"
        anchor="start"
        contorno={C.negro}
      />
    </Lienzo>
  );
};

const Mar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Lienzo fondo={C.cielo}>
      <DefsVolumen pre="mar" />
      <Sol x={1550} y={230} r={110} f={f} />
      <Olas f={f} y={720} capas={1} />
      <Barco x={500 + f * 3} y={735 + Math.sin(f / 9) * 10} s={0.6} f={f} />
      <Olas f={f} y={800} capas={2} />
      <TextoEntra x={960} y={260} texto="THE END?" f={f} desde={16} size={130} modo="letras" contorno={C.navy} vel={3} />
      <Vineta pre="mar" o={0.5} />
      <Grano f={f} pre="mar" />
      <Iris f={f} desde={64} dura={9} modo="cierra" x={960} y={300} />
    </Lienzo>
  );
};

const ESCENAS: {
  comp: React.FC;
  variante: React.ComponentProps<typeof CamaraViva>["variante"];
  entrada: React.ComponentProps<typeof CamaraViva>["entrada"];
  sacudidaEn?: number;
}[] = [
  { comp: Estallido, variante: "push", entrada: "destello", sacudidaEn: 6 },
  { comp: Lista, variante: "deriva-izq", entrada: "barrido" },
  { comp: Mano, variante: "deriva-der", entrada: "iris" },
  { comp: Tormenta, variante: "sacudida", entrada: "ninguna", sacudidaEn: 20 },
  { comp: Persona, variante: "quieta", entrada: "barrido" },
  { comp: Gente, variante: "push", entrada: "destello" },
  { comp: Fuego, variante: "deriva-izq", entrada: "barrido" },
  { comp: Mar, variante: "deriva-der", entrada: "iris" },
];

export const BibliotecaDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.navy }}>
    {ESCENAS.map((e, k) => {
      const Comp = e.comp;
      return (
        <Sequence key={k} from={k * ESC} durationInFrames={ESC}>
          <CamaraViva dur={ESC} variante={e.variante} entrada={e.entrada} sacudidaEn={e.sacudidaEn}>
            <Comp />
          </CamaraViva>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
