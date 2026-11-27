# Paso 5 · El proyecto de Remotion (una sola vez por canal)

**Objetivo:** `videos-animados/proyecto/` instalado, con la música y los efectos bajados, y una prueba que demuestre que renderiza en este computador.

Si `videos-animados/proyecto/node_modules` ya existe, salta al §4 solo si algo falló antes.

## 1. Copiar la plantilla
```bash
mkdir -p videos-animados
cp -R $SKILL/plantilla videos-animados/proyecto
```
Qué trae (`plantilla/LEEME.md` lo explica):
- `src/estilos/base.tsx`: el `Montaje` de un capítulo (escenas ancladas a palabras, voz y efectos de sonido).
- `src/planopop/kit.tsx`: paleta `C`, texto `T`, `Persona`, `Lienzo`, `pop`, `suave`, `sale`… (la base del estilo).
- `src/planopop/biblioteca/`: unas 300 piezas reutilizables (personas que hablan y parpadean, fondos con capas, fuego, humo y explosiones con volumen, cámara que recorre la escena, rayos X, lupa, transiciones, mapas, gráficos, aviones, barcos, espacio…). `INDICE.md` (una línea por pieza) y `CATALOGO.md` (props y ejemplo de cada una).
- `src/planopop/Completo.tsx`: el molde que une los 10 capítulos y pone la música por tramos.
- `src/planopop/Miniatura.tsx`: el still `MiniaturaTop`.
- `src/planopop/videos.tsx`: la lista de videos (la llena `armar_video.py`).
- Tres composiciones de prueba que no necesitan voz: `BibliotecaDemo`, `FondosRicosDemo`, `EfectosRicosDemo`.

## 2. Instalar (puerta 1)
Pide permiso antes. Necesita Node.js (versión en `referencias/requisitos.md`) y descarga unos cientos de MB de paquetes:
```bash
cd videos-animados/proyecto && npm install
```
La primera vez que se renderiza, Remotion puede descargar su propio navegador sin ventana (Chrome Headless Shell): también avísalo.

## 3. Bajar la música y los efectos (puerta 1)
La skill no trae audio: la licencia de Mixkit permite usarlo en tus videos de YouTube, incluso monetizados y sin atribución, pero no repartirlo dentro de una plantilla. Cada usuario lo baja de la fuente. Pídele que lea la licencia (https://mixkit.co/license/) y, con su permiso:
```bash
bash $SKILL/scripts/bajar_audio.sh videos-animados/proyecto --acepto-licencia
```
Baja 2 pistas (`public/musica/curiosa.mp3` y `tension.mp3`) y unos 200 efectos (`public/sfx/familia-N.wav`, ~100 MB), y los normaliza. Si un id ya no existe en Mixkit, lo dice al final: no pasa nada, los capítulos solo usan los que existen (`ls public/sfx/`).

**La música se puede cambiar** por otra con licencia comercial (mismo nombre de archivo). Lo que funcionó: camas rítmicas parecidas a las de la referencia, que cambian con el tono de cada tramo (`curiosa` / `tension`), siempre bajitas y a volumen constante, sin bajarlas cuando habla la voz. Claude no oye: no elijas música por el título. Si hay que elegir, que el usuario escuche 2 o 3 candidatas, o usa un modelo que sí oye audio para describir la referencia y puntuar las candidatas.

## 4. Prueba de que funciona
```bash
cd videos-animados/proyecto
npx tsc --noEmit                                     # sin errores
npx remotion still BibliotecaDemo out/prueba.png --frame=130 --scale=0.5
```
Mira `out/prueba.png`: debe verse un fondo de estrellas con tres textos en mayúsculas y un planeta tachado. Si sale, el proyecto funciona en este computador. Para verlo en movimiento: `npm run dev` abre Remotion Studio en el navegador (ciérralo antes de renderizar).

## Listo cuando
- `npm install` terminó, `public/sfx/` y `public/musica/` tienen sus archivos, `tsc` no da errores y la prueba se ve.
