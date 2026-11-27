#!/bin/bash
# Hoja de contacto: junta imágenes o fotogramas en una sola imagen (celdas de 240x420, 8 por fila).
# Uso: hoja.sh salida.jpg img1 img2 ...
# Sirve para revisar de un vistazo las fotos de partida, las escenas o los fotogramas de una toma.
set -e
if [ $# -lt 2 ]; then echo "Uso: hoja.sh salida.jpg img1 [img2 ...]"; exit 1; fi
out=$1; shift; n=0; F=""; L=""; I=()
for f in "$@"; do
  I+=(-i "$f")
  F="${F}[${n}:v]scale=240:420:force_original_aspect_ratio=decrease,pad=240:420:(ow-iw)/2:(oh-ih)/2:color=white[v${n}];"
  L="${L}[v${n}]"; n=$((n+1))
done
if [ $n -eq 1 ]; then ffmpeg -loglevel error -y "${I[@]}" -filter_complex "${F%;}" -map "[v0]" "$out"; echo "$out"; exit 0; fi
lay=$(python3 -c "print('|'.join(f'{(i%8)*240}_{(i//8)*420}' for i in range($n)))")
ffmpeg -loglevel error -y "${I[@]}" -filter_complex "${F}${L}xstack=inputs=${n}:layout=${lay}:fill=white" "$out"
echo "$out"
