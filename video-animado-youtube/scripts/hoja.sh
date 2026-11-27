#!/bin/bash
# Hoja de contacto de un render: arranque (primeros 3 s a 4 fps) y video completo (1 fotograma por segundo).
# Uso: bash hoja.sh video.mp4   → crea video-arranque.jpg y video-hoja.jpg al lado del video
set -e
V="$1"
[ -f "$V" ] || { echo "No existe: $V"; exit 1; }
B="${V%.*}"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
FILAS=$(python3 -c "import math;print(math.ceil(float('$DUR')/10))")
ffmpeg -v error -y -t 3 -i "$V" -vf "fps=4,scale=180:-1,tile=6x2:padding=4:color=gray" -frames:v 1 "$B-arranque.jpg"
ffmpeg -v error -y -i "$V" -vf "fps=1,scale=108:-1,tile=10x$FILAS:padding=3:color=gray" -frames:v 1 "$B-hoja.jpg"
echo "$B-arranque.jpg"
echo "$B-hoja.jpg"
