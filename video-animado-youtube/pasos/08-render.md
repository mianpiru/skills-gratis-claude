# Paso 8 · Render final, revisión de audio y capítulos

**Objetivo:** el video para subir (1080p, voz a -14 LUFS), una copia liviana para verlo en el celular, el audio sin golpes y los capítulos con sus tiempos reales en la descripción.

## 1. Render final (trabajo pesado, en segundo plano)
Antes: que no haya otro trabajo pesado corriendo y que haya espacio en disco (`df -h /`; el video y los temporales pueden ocupar varios GB).
```bash
bash $SKILL/scripts/render.sh videos-animados/NN-tema final
```
Deja `salida/NN-tema.mp4` (el que se sube: H.264 Main, AAC 44,1 kHz, `loudnorm` a -14 LUFS), `salida/NN-tema-celular.mp4` (1280 px, liviano) y las hojas. Con más memoria libre se puede acelerar: `CONCURRENCIA=4 bash …`.

Comprueba la duración que imprime (lo normal: 8:30 a 9:30). Si queda fuera, dilo; no rehagas el video por eso.

## 2. Audio sin golpes
```bash
python3 $SKILL/scripts/revisar_audio.py videos-animados/NN-tema
```
Tiene que decir **«Audio limpio en los límites de capítulo»**. Un golpe seco al cambiar de capítulo «suena e incomoda». Si marca uno:
- `la voz arranca de golpe`: la voz trae la cabecera WAV pegada o una consonante fuerte justo al inicio. Vuelve a sacar los tiempos de ese capítulo con `tiempos_voz.py` (abre la voz en 10 ms) y copia de nuevo a `public/`.
- `golpe al pasar de… al siguiente`: suele ser un efecto de sonido que se corta en seco o empieza justo en el límite. Muévelo o acórtalo en `SONIDOS` de ese capítulo.
Después, render final otra vez.

## 3. Capítulos con los tiempos reales
```bash
python3 $SKILL/scripts/capitulos_yt.py videos-animados/NN-tema --etiqueta "CHAPTERS"   # «CAPÍTULOS» si el video es en español
```
Cambia la línea `{CAPITULOS}` de la descripción de `publicacion.json` por la lista con tiempos («0:00 Título»…). YouTube solo muestra capítulos si el primero es 0:00, hay al menos tres y cada uno dura 10 s o más (ayuda de YouTube, revisada el 2026-11-26).

## 4. Revisión final de la voz (opcional, recomendado)
Whisper sobre el video terminado: que diga el guion y que no se corte la última palabra.
```bash
cat videos-animados/NN-tema/cap*/voz/texto.txt > videos-animados/NN-tema/salida/guion-completo.txt
python3 $SKILL/scripts/tiempos_voz.py videos-animados/NN-tema/salida/NN-tema.mp4 videos-animados/NN-tema/salida/guion-completo.txt videos-animados/NN-tema/salida/revision-voz --sin-audio --idioma <idioma>
```

Al terminar: `bash $SKILL/scripts/limpiar_remotion.sh` y borra `salida/borrador.mp4`.

## Listo cuando
- Existen `NN-tema.mp4` y `NN-tema-celular.mp4`, `revisar_audio.py` dice «Audio limpio» y la descripción tiene los capítulos.
