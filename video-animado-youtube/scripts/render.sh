#!/bin/bash
# Render de un video largo por capítulos, sin gastar tokens.
# Uso: bash render.sh <carpeta del video> [borrador|final] [carpeta del proyecto]
#   carpeta del video: videos-animados/01-tema (con video.json y capitulos.txt, que deja armar_video.py)
#   borrador: media resolución + una hoja de contacto por capítulo (para revisar)
#   final:    1080p + versión para subir (H.264 Main, AAC, voz a -14 LUFS) + copia liviana + hojas
# Deja todo en <carpeta del video>/salida/. Es un trabajo pesado: uno a la vez en todo el computador.
# El script espera si hay otro render, un Whisper o un ffmpeg corriendo. Hilos: CONCURRENCIA=2 por defecto.
set -euo pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"
CARPETA="$(cd "$1" && pwd)"
MODO="${2:-borrador}"
PROYECTO="$(cd "${3:-$CARPETA/../proyecto}" && pwd)"
HILOS="${CONCURRENCIA:-2}"
PY="${PYTHON:-python3}"
NOMBRE="$(basename "$CARPETA")"
NN="$("$PY" -c "import json,sys;print(str(json.load(open(sys.argv[1]))['numero']).zfill(2))" "$CARPETA/video.json")"
COMP="V$NN"
SALIDA="$CARPETA/salida"
mkdir -p "$SALIDA/hojas"
[ -f "$CARPETA/capitulos.txt" ] || { echo "Falta capitulos.txt: corre scripts/armar_video.py primero"; exit 1; }

ocupado() {
  ps -Ao %cpu,command | grep -E "remotion render|remotion still|tiempos_voz|whisper|headless|ffmpeg" \
    | grep -v -E "grep|render.sh" | awk '$1 > 3 {n++} END {exit n ? 0 : 1}'
}
while ocupado; do echo "Hay otro trabajo pesado corriendo; espero…"; sleep 20; done

cd "$PROYECTO"
if [ "$MODO" = "final" ]; then
  npx remotion render "$COMP" "$SALIDA/render.mp4" --crf=18 --concurrency="$HILOS" --log=error
  cd "$SALIDA"
  ffmpeg -v error -y -i render.mp4 -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 18 -preset medium \
    -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -ar 44100 -b:a 192k -movflags +faststart "$NOMBRE.mp4"
  ffmpeg -v error -y -i "$NOMBRE.mp4" -vf "scale=1280:-2" -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 29 \
    -preset medium -c:a aac -b:a 96k -movflags +faststart "$NOMBRE-celular.mp4"
  rm -f render.mp4
  VIDEO="$NOMBRE.mp4"
else
  npx remotion render "$COMP" "$SALIDA/borrador.mp4" --scale=0.5 --crf=26 --concurrency="$HILOS" --log=error
  cd "$SALIDA"
  VIDEO="borrador.mp4"
fi

# Una hoja de contacto por capítulo: un cuadro cada 1,5 s (6 por fila: cada fila son 9 s del capítulo)
"$PY" - "$CARPETA/capitulos.txt" "$PROYECTO/public" <<'EOF' > "$SALIDA/hojas/cortes.txt"
import json, math, sys
t = 0.0
for n, linea in enumerate(open(sys.argv[1]).read().split("\n"), 1):
    if not linea.strip():
        continue
    trabajo, cola = linea.split()
    fin = json.load(open(f"{sys.argv[2]}/{trabajo}/palabras.json"))[-1]["fin"]
    dur = math.ceil((fin + float(cola)) * 30) / 30
    print(f"{n:02d} {t:.3f} {dur:.3f}")
    t += dur
EOF
while read -r N INI DUR; do
  ffmpeg -nostdin -v error -y -ss "$INI" -t "$DUR" -i "$VIDEO" \
    -vf "fps=1/1.5,scale=384:-1,tile=6x8:padding=4:color=gray" -frames:v 1 "hojas/cap$N.jpg"
done < hojas/cortes.txt
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
echo "LISTO $MODO ${DUR%.*} s → $SALIDA/$VIDEO (hojas en $SALIDA/hojas/)"

bash "$AQUI/limpiar_remotion.sh" || true
