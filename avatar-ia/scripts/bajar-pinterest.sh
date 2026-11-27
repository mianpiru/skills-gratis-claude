#!/bin/bash
# Descarga fotos de Pinterest en tamaño original y arma una hoja para elegir.
# Uso: bajar-pinterest.sh <carpeta> "ab/cd/ef/hash1.jpg,12/34/56/hash2.jpg,..."
#   Cada valor es la ruta que va después de /originals/ (sale de cambiar 236x/ por originals/ en la miniatura).
# Descarta lo que no es JPEG y los tamaños típicos de imágenes hechas con IA. Escribe origen.txt (número y ruta)
# y <carpeta>-hoja.jpg junto a la carpeta.
set -e
if [ $# -lt 2 ]; then echo "Uso: bajar-pinterest.sh <carpeta> \"h1,h2,...\""; exit 1; fi
AQUI="$(cd "$(dirname "$0")" && pwd)"
D="$1"; mkdir -p "$D"; cd "$D"; i=$(ls *.jpg 2>/dev/null | wc -l | tr -d ' ')
for h in $(echo "$2" | tr ',' ' '); do
  i=$((i+1))
  curl -s -L -o "$i.jpg" "https://i.pinimg.com/originals/$h" || { echo "no bajó $h"; continue; }
  echo "$i https://i.pinimg.com/originals/$h" >> origen.txt
  if ! file -b "$i.jpg" | grep -q JPEG; then echo "descartada $i (no es JPEG)"; rm -f "$i.jpg"; continue; fi
  wh=$(ffprobe -v error -show_entries stream=width,height -of csv=p=0:s=x "$i.jpg" | head -1)
  case "$wh" in
    941x1672|1024x1536|1536x2752|784x1168|768x1344|864x1184|1024x1024|896x1152)
      echo "descartada $i ($wh: tamaño típico de IA)"; rm -f "$i.jpg";;
  esac
done
FOTOS=$(ls *.jpg 2>/dev/null | sort -V)
if [ -z "$FOTOS" ]; then echo "No quedó ninguna foto."; exit 1; fi
echo "Quedaron: $(echo $FOTOS | tr '\n' ' ')"
bash "$AQUI/hoja.sh" "../$(basename "$PWD")-hoja.jpg" $FOTOS
