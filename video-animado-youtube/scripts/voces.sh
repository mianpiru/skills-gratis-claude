#!/bin/bash
# Voz y tiempos por palabra de cada capítulo de un video, en fila y sin gastar tokens de Claude.
# Uso: bash voces.sh <carpeta del video> [carpeta del proyecto de Remotion]
#   carpeta del video: videos-animados/01-tema (tiene video.json y capMM/voz/texto.txt)
#   proyecto: por defecto <carpeta del video>/../proyecto
# video.json: {"numero": "01", "idioma": "en", "voz": "Charon", "estilo": "corto, máximo 40 palabras", "modelo": null}
#
# Por cada capítulo: pide la voz a Gemini, saca los tiempos con Whisper (capMM/voz/whisper.txt) y copia voz.wav y
# palabras.json a <proyecto>/public/vNN-capMM/. Un capítulo con palabras.json más nuevo que su texto se salta
# (no se vuelve a pagar una voz que ya salió bien).
# Si a la toma le falta o le sobra guion (frase saltada o repetida), pide UNA toma más (máximo 2 por capítulo) y
# después sigue: el capítulo queda marcado para revisarlo a mano.
# Es trabajo pesado (Whisper): espera si hay un render, otro Whisper o un ffmpeg largo corriendo.
set -euo pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"
VIDEO="$(cd "$1" && pwd)"
PROYECTO="$(cd "${2:-$VIDEO/../proyecto}" && pwd)"
PY="${PYTHON:-python3}"
leer() { "$PY" -c "import json,sys;v=json.load(open(sys.argv[1])).get(sys.argv[2]);print('' if v is None else v)" "$VIDEO/video.json" "$1"; }
NN="$(leer numero)"; IDIOMA="$(leer idioma)"; VOZ="$(leer voz)"; ESTILO="$(leer estilo)"; MODELO="$(leer modelo)"
[ -n "$NN" ] || { echo "Falta \"numero\" en video.json"; exit 1; }
EXTRA=(); [ -n "$MODELO" ] && EXTRA=(--modelo "$MODELO")
ocupado() {
  ps -Ao %cpu,command | grep -E "remotion render|remotion still|tiempos_voz|whisper|ffmpeg|headless" \
    | grep -v -E "grep|voces.sh" | awk '$1 > 3 {n++} END {exit n ? 0 : 1}'
}
REVISAR=()
for CAP in "$VIDEO"/cap[0-9][0-9]/; do
  N="$(basename "$CAP")"; V="$CAP/voz"
  [ -f "$V/texto.txt" ] || continue
  if [ -f "$V/palabras.json" ] && [ "$V/palabras.json" -nt "$V/texto.txt" ]; then
    echo "== $N ya estaba"
  else
    for intento in 1 2; do
      "$PY" "$AQUI/voz_gemini.py" "$V/texto.txt" "$V/voz-gemini.wav" --voz "$VOZ" --estilo "$ESTILO" ${EXTRA[@]+"${EXTRA[@]}"} | tail -1
      while ocupado; do sleep 15; done
      "$PY" "$AQUI/tiempos_voz.py" "$V/voz-gemini.wav" "$V/texto.txt" "$V" --idioma "$IDIOMA" --pausa-max 0.45 2>&1 \
        | grep -v -i "warn" > "$V/whisper.txt" || true
      if ! grep -q "AVISO" "$V/whisper.txt"; then break; fi
      # Solo se paga otra toma si falta o sobra guion (frase saltada o repetida). Si solo leyó las instrucciones
      # al inicio, ese tramo ya quedó fuera de voz.wav y no se gasta otra voz.
      if [ "$intento" = 1 ] && grep -q "AVISO FRASE SALTADA\|AVISO FRASE REPETIDA" "$V/whisper.txt"; then
        echo "   $N: la toma salió con fallas en el guion; pido otra (la última)"
        continue
      fi
      break
    done
    grep -q "AVISO\|NO COINCIDE" "$V/whisper.txt" && REVISAR+=("$N")
    echo "== $N: $(head -1 "$V/whisper.txt" | cut -c1-160)"
  fi
  [ -f "$V/palabras.json" ] || { echo "   $N: sin palabras.json (mira $V/whisper.txt)"; continue; }
  mkdir -p "$PROYECTO/public/v$NN-$N"
  cp "$V/voz.wav" "$V/palabras.json" "$PROYECTO/public/v$NN-$N/"
done
if [ ${#REVISAR[@]} -gt 0 ]; then
  echo "REVISAR a mano (avisos en voz/whisper.txt): ${REVISAR[*]}"
else
  echo "Voces listas, sin avisos."
fi
