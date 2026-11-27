# Paso 4 · Voz y tiempos por palabra

**Objetivo:** por cada capítulo, `voz.wav` (limpia, sin pausas largas) y `palabras.json` (cuándo se dice cada palabra), copiados a `proyecto/public/vNN-capMM/`. La animación se ancla a esos tiempos: cada cosa aparece en la palabra que la nombra.

Necesita el proyecto de Remotion (paso 5) para copiar las voces. Solo después de la **puerta 2**.

## 1. Las opciones de voz
- **Gemini TTS** (lo que usa el canal original; clave en `referencias/requisitos.md` §4). Una voz por capítulo, todas con la misma voz y el mismo estilo.
  - Hombre: Charon (informativa; la del canal original en inglés), Fenrir (con energía), Orus (firme), Algenib (grave), Iapetus (clara). Mujer: Kore (firme), Aoede (ligera), Leda (juvenil), Zephyr (brillante).
- **Su propia voz:** que grabe cada `texto.txt` en un cuarto callado, a ritmo de conversación, y deje el archivo en `capMM/voz/voz-gemini.wav` (el nombre es solo para que el script lo encuentre).
- **Otra voz con licencia comercial** que ya pague (por ejemplo un servicio de clonación de su propia voz): la genera él y deja el archivo igual que arriba.

## 2. Muestra de 15 segundos (antes de la puerta 2, si la voz es nueva)
```bash
awk 'BEGIN{RS=""} NR==1' NN-tema/cap01/voz/texto.txt > NN-tema/muestra.txt   # el primer párrafo
python3 $SKILL/scripts/voz_gemini.py NN-tema/muestra.txt NN-tema/muestra.wav --voz Charon --estilo "<estilo de video.json>"
```
Si el usuario no eligió voz, haz 2 o 3 muestras **con el mismo párrafo** y que escuche. La voz aprobada y su estilo van a `canal.md`.

## 3. Todas las voces (script, sin gastar tokens)
```bash
bash $SKILL/scripts/voces.sh videos-animados/NN-tema
```
Pide una voz por capítulo a Gemini, saca los tiempos con Whisper (`capMM/voz/whisper.txt`), recorta las pausas de más de 0,45 s y copia `voz.wav` y `palabras.json` a `proyecto/public/vNN-capMM/`. Es trabajo pesado (Whisper): va en segundo plano y nada más pesado corre a la vez. Si un capítulo ya tiene `palabras.json` más nuevo que su texto, lo salta: **una voz que salió bien no se vuelve a pagar**.

Con voz propia o de otro servicio, corre solo los tiempos por capítulo:
```bash
python3 $SKILL/scripts/tiempos_voz.py NN-tema/capMM/voz/voz-gemini.wav NN-tema/capMM/voz/texto.txt NN-tema/capMM/voz --idioma <idioma> --pausa-max 0.45
mkdir -p videos-animados/proyecto/public/vNN-capMM && cp NN-tema/capMM/voz/{voz.wav,palabras.json} videos-animados/proyecto/public/vNN-capMM/
```

## 4. Revisión (siempre, antes de animar)
**Aviso: Gemini a veces lee en voz alta sus instrucciones** (el estilo, «director's notes») **o repite el guion.** Pasó varias veces en el canal original, en inglés y en español, sobre todo con estilos largos. Por eso: el estilo va corto, el script usa el formato de «notas del director» y **cada capítulo se revisa con Whisper** antes de seguir.

Lee la primera línea de cada `capMM/voz/whisper.txt` («Whisper oyó: …») y los avisos:
| Aviso | Qué pasó | Qué hacer |
|---|---|---|
| `LEYÓ LAS INSTRUCCIONES` | Gemini dijo sus notas antes del guion | Ese tramo ya quedó fuera de `voz.wav`. Escucha el arranque; no pidas otra toma |
| `FRASE SALTADA` | 3+ palabras seguidas casi sin duración: no se dijeron | `voces.sh` ya pidió una segunda toma. Si sigue, simplifica esa frase (más corta, sin nombres raros), borra `palabras.json` del capítulo y vuelve a correr |
| `FRASE REPETIDA` | un tramo se oye más veces de las que está en el guion | Igual que arriba |
| `SE OYE DE MÁS` | palabras que no están en el guion (al final, casi siempre) | Corta el audio donde dice el aviso, con el comando que imprime, y vuelve a sacar los tiempos |
| `NO COINCIDE` | Whisper oyó otra palabra | Casi siempre es un homófono o una cifra («9» por «nine»): escucha antes de rehacer |
| `ÚLTIMA PALABRA` | la última palabra quedó pegada al final | Escúchala; si se corta, otra toma de ese capítulo |

**Máximo 2 tomas por capítulo.** Si la segunda también falla, para y corrige el texto a mano: cada toma gasta cupo y la voz cambia un poco de una toma a otra.

## 5. Lo que hay que saber de la voz de Gemini
- **Cambia un poco de un pedido a otro** aunque los ajustes sean idénticos (en el canal original, el tono mediano varió de 117 a 132 Hz entre capítulos). Por eso: un pedido por capítulo, y si hay que rehacer un tramo corto, se graban 2 o 3 tomas y se usa la de tono más parecido al capítulo vecino.
- **No aceleres la voz con filtros** salvo que el usuario lo pida; si el video queda largo, se acorta el texto.
- Si responde `429`, no hay cupo por ahora: espera o revisa el plan (puerta 1 antes de activar pago).
- El script quita la cabecera WAV que a veces viene pegada al audio y la ráfaga de ruido del final: sin eso sonaba un golpe seco al cambiar de capítulo.

## Listo cuando
- Los 10 capítulos tienen `voz.wav` y `palabras.json` en `proyecto/public/vNN-capMM/`, y ningún `whisper.txt` tiene avisos sin resolver.
