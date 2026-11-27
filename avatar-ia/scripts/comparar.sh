#!/bin/bash
# Puerta 1: pone la foto original DIFUMINADA junto al avatar, para que el usuario apruebe sin ver nítida a la
# persona real.
# Uso: comparar.sh original.jpg avatar.png salida.jpg [difuminado]
#   difuminado = sigma de gblur (30 por defecto; más alto = más borroso).
set -e
if [ $# -lt 3 ]; then echo "Uso: comparar.sh original.jpg avatar.png salida.jpg [sigma]"; exit 1; fi
S="${4:-30}"
ffmpeg -loglevel error -y -i "$1" -i "$2" -filter_complex \
  "[0:v]scale=-2:1280,gblur=sigma=${S},setsar=1,pad=iw+20:ih:0:0:color=white[a];[1:v]scale=-2:1280,setsar=1[b];[a][b]hstack=inputs=2" \
  -frames:v 1 "$3"
echo "$3  (izquierda: original difuminada · derecha: avatar)"
