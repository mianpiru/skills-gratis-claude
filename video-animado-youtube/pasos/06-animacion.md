# Paso 6 · Piezas y capítulos animados

**Objetivo:** `proyecto/src/planopop/vNN/piezas.tsx` (el motivo visual y las piezas propias del video) y los 10 capítulos `Cap01.tsx` … `Cap10.tsx`, que se vean como si fueran **el mismo video**: misma paleta, misma letra, mismos personajes, mismo ritmo y la misma forma de mover las cosas. Después, el armado mecánico con `armar_video.py`.

**No se renderiza en este paso** (los renders van en fila en el paso 7). Lo único que se permite son stills sueltos, de a uno.

## 1. Lectura mínima (vale para ti y para cada subagente)
Cada archivo que se lee se vuelve a cargar en cada paso que se da. En el canal original, 11 animadores que leían unos 100 mil tokens cada uno agotaron el límite de uso de Claude a mitad del video. Se lee **solo** esto, una vez:
1. `proyecto/src/planopop/biblioteca/INDICE.md` (una línea por pieza). Para las props y el ejemplo de una pieza: `grep -n "| NombrePieza |" proyecto/src/planopop/biblioteca/CATALOGO.md`. Las reglas de movimiento: `sed -n 1,32p …/CATALOGO.md`. No se abre el código de una pieza salvo que el ejemplo no alcance.
2. `proyecto/src/planopop/ejemplo/CapEjemplo.tsx`: el modelo de capítulo (probado).
3. `proyecto/src/planopop/vNN/piezas.tsx`: **solo la lista de arriba** (`sed -n 1,150p`).
4. Tu capítulo: `NN-tema/capMM/voz/texto.txt`, los índices de palabra (`python3 $SKILL/scripts/indices.py NN-tema/capMM/voz/texto.txt`), tu sección de la escaleta (`grep -n "### capMM" -A40 NN-tema/escaleta.md`) y de `datos.md` solo lo que va en pantalla (`grep`).

## 2. Primero `piezas.tsx` (uno solo, antes de los capítulos)
Con `escaleta.md`, escribe `proyecto/src/planopop/vNN/piezas.tsx`: el **motivo visual que se repite** y las piezas propias que no estén en la biblioteca (objetos, lugares, máquinas). Componentes con props simples (posición, escala, `f`, estado de 0 a 1), dibujados con la paleta `C` y con volumen (`dosTonos`, `SombraSuelo`). **Arriba del archivo, un comentario con la lista de piezas, sus props y un ejemplo de uso de cada una**: los capítulos solo van a leer eso. Sin escenas.
- **Primero la biblioteca:** lo que ya existe se usa de ahí.
- **El objeto protagonista, completo y detallado** (paneles, remaches, cabina con reflejo, luces, partes que se animan), no una silueta. Si hace falta, el usuario puede pedir una imagen de referencia en un generador de imágenes y se recrea en vectores con este estilo.
- Lo que una todos los capítulos (un contador, un calendario, una regla) va aquí, con la misma lógica para todos: así no retrocede entre capítulos.
- Lo nuevo que sirva para otros videos se copia a la biblioteca con su fila en `CATALOGO.md`, y se regenera el índice: `python3 $SKILL/scripts/indice_biblioteca.py videos-animados/proyecto`.

## 3. Los capítulos
**Si hay subagentes:** 5 agentes, **2 capítulos seguidos cada uno** (01–02, 03–04, 05–06, 07–08, 09–10), lanzados en un mismo mensaje (solo escriben texto). **El mismo encargo para los 5, palabra por palabra, y lo que cambia al final** (así comparten la caché de Claude):
> Trabajas en <ruta de videos-animados>. Eres animador de un video explicativo en el estilo Plano Pop. Sigue `<$SKILL>/pasos/06-animacion.md` §1 (lectura mínima), §3 y §4; no renderices; responde en 3 líneas. Video: `NN-tema/`, código en `proyecto/src/planopop/vNN/`. Tus capítulos: capAA y capBB.

**Si no hay subagentes:** hazlos tú, de a uno, con la misma lectura mínima.

Cada capítulo es un solo archivo `proyecto/src/planopop/vNN/CapMM.tsx`, que exporta `CapMM` (por ejemplo `export const Cap03`). Forma (la del modelo `CapEjemplo.tsx`):
```tsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { EstiloProps, Sonido } from "../../estilos/base";
import { C, CapaParalaje, CapaTexto, EscenaNarrativa, EscenaProps, MontajeNarrativo, RigCamara, TextoSeguro, pop, useCamaraFondo /* … */ } from "../biblioteca";
import { /* piezas del video */ } from "./piezas";

const Algo: React.FC<EscenaProps> = ({ w, dur }) => {
  const f = useCurrentFrame();          // fotograma local de la escena; w(i) = fotograma en que se dice la palabra i
  return <RigCamara w={w} tomas={[{ en: 0, x: 960, y: 540, zoom: 1 }, { p: 5, x: 700, y: 600, zoom: 1.6 }]}>…</RigCamara>;
};
const ESCENAS: EscenaNarrativa[] = [{ id: "algo", desde: 0, comp: Algo } /* , … */];
const SONIDOS: Sonido[] = [[0, "whoosh-2", 0.4] /* [palabra, archivo de public/sfx sin .wav, volumen, desfase?, largo?] */];
export const CapMM: React.FC<EstiloProps> = (p) => (
  <MontajeNarrativo {...p} escenas={ESCENAS} sonidos={SONIDOS} fondo={C.navy} semilla="vNNcMM" />
);
```
- Escribe el capítulo **de una vez** (un solo archivo) y corrige con ediciones puntuales. Revisa tipos una vez al final: `cd videos-animados/proyecto && npx tsc --noEmit 2>&1 | grep vNN/CapMM`.
- El arreglo de sonidos se llama `SONIDOS` y solo usa archivos que existan (`ls proyecto/public/sfx/`). Volumen 0,25–0,6. **Sin música** (la pone el video completo) y sin `<Audio>` propio.
- No se registra nada en `Root.tsx` ni en `videos.tsx`, ni se tocan archivos de otros capítulos.
- Antes de entregar, 3 o 4 stills de tu capítulo, **de a uno** (solo si no hay subagentes trabajando a la vez en stills; si los hay, déjalo para el paso 7): `npx remotion still VNNCapMM out/capMM-a.png --frame=<n> --scale=0.5`. Para eso el capítulo tiene que estar armado (§5).

## 4. Reglas de la animación (calidad mínima)
Salen de las correcciones al canal original (ver `referencias/reglas.md` §Animación). Mandan sobre todo lo demás.
- **Una escena nueva cada 3 a 6 segundos**, cada una anclada con `desde` a la palabra donde cambia la idea. Dentro, **algo nuevo cada 0,5–1,5 s** (etiqueta, flecha, objeto, gesto), mínimo 4 eventos por cada 6 s, cada uno en su palabra con `pop(f, w(i))`. Las piezas de apoyo laten sin parar. La última escena aguanta hasta el final sin quedar congelada.
- **Cámara que cuenta, no zoom de plantilla.** Prohibido «escena normal → acercamiento» repetido. La cámara se mueve **dentro** de la escena siguiendo la narración: va al avión, la piel se vuelve transparente (`RayosX`) y se ven los tanques; luego se desliza a las llantas sin cortar. Varios elementos en fila se recorren con la cámara (`recorrido()`), sin reiniciar la escena por cada uno. La lupa aumenta de verdad (`LupaAumento`, no una lupa dibujada encima).
- **Ningún texto se sale ni se recorta.** Los textos van en `<CapaTexto>` (la cámara no la mueve) con `TextoSeguro`, `EtiquetaSegura` o `RotuloObjeto`, a 90 px o más de cada borde.
- **Pantalla llena y legible** (1920×1080): el motivo principal ocupa al menos la mitad del cuadro; nada de un icono chico en un cuadro vacío. Cifras de 120–220 px, etiquetas de 44–70 px, nunca menos de 38 px.
- **Texto en pantalla: poco**, en el idioma del video: cifras, años, lugares y 2 a 4 palabras clave en mayúsculas. No se transcribe la narración (no hay subtítulos). **No se narra lo obvio en imagen:** la imagen muestra lo que la voz no puede (escala, comparación, mecanismo, mapa, cronología).
- **Fondos trabajados, nunca planos:** los de `fondos-ricos.tsx` (espacio, cielos, paisajes, interiores, océano), en capas que se mueven a distinta velocidad. **Ningún fondo deja ver un marco** en el plano más abierto.
- **Efectos con volumen** (`efectos-ricos.tsx`: humo, explosiones, fuego, estelas, polvo), nunca un círculo que crece.
- **Transiciones variadas**, nunca la misma dos veces seguidas (`MontajeNarrativo` las rota sola). Muchas veces la mejor transición es no cortar: seguir con la cámara. Nada de destellos blancos de pantalla completa ni estroboscópicos.
- **Personas:** `PersonaViva` (parpadea, respira, habla, gestos), cada una con su aspecto (pelo, lentes, barba, edad, ropa de su época y oficio), primeros planos de hasta 2× cuando reaccionan. **Pelo con volumen y mechones, ojos en primer plano con iris, pupila, brillo y párpados; cascos, gorras y lentes orientados según la cara.** Personas reales: se recrean con nuestras formas por su papel, nunca una foto pegada.
- **Sonidos variados:** un mismo archivo máximo 3 veces por capítulo, y el sonido corresponde a lo que pasa (motor, explosión, metal, papel, multitud), no un «pop» para todo.
- **Reutiliza en el mismo video** el elemento fuerte (fuego, explosión, mano que entra con un objeto, sello) y **vuelve al motivo visual** cada vez que el capítulo hable de lo que mide.
- **Sin logos, marcas, banderas con escudos ni imágenes externas.** Sin emojis.
- **Todo determinista:** `random("semilla")` de Remotion, nunca `Math.random()`. No más de ~300 elementos SVG animados por escena.
- **Capítulo 1:** el primer cuadro ya muestra al protagonista y la amenaza de la miniatura, en movimiento desde el cuadro 0; en los primeros 30 s el plano cambia cada 3 o 4 s como máximo.
- **Capítulo 10 (cierre):** la pregunta para los comentarios en pantalla (en `CapaTexto`), y un gesto de like y suscripción animado, sobre el motivo visual del video; deja 5 s de aire al final para las pantallas finales de YouTube.

## 5. Armado (script, sin modelo)
```bash
python3 $SKILL/scripts/armar_video.py videos-animados/NN-tema --tension <capítulos con tono «tension» en la escaleta, por ejemplo 1,5,6>
cd videos-animados/proyecto && npx tsc --noEmit
```
Deja `NN-tema/capitulos.txt`, `proyecto/src/planopop/vNN/video.tsx` y la composición `VNN` (más `VNNCapMM` por capítulo). Si hay errores de tipos, se corrigen en el capítulo que los tiene.

## Listo cuando
- Están `piezas.tsx` y los 10 capítulos, `armar_video.py` terminó y `tsc` no da errores.
