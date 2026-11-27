#!/bin/bash
# Miniatura de un video: arte 16:9 SIN texto (de un generador de imágenes, o un cuadro del video) + el texto exacto
# por código, con el still «MiniaturaTop» de la plantilla.
# Uso: bash miniatura.sh <carpeta del video> <arte.png|jpg> ['{"zoom":1.1,"dy":40}'] [carpeta del proyecto]
#   El texto sale de publicacion.json → miniatura.texto (un renglón blanco arriba, de 1 a 4 palabras, sin cifras).
#   El tercer argumento ajusta: zoom, dx, dy (acomodan el arte para que el texto no tape la cara), ancho, tamMax, y, color.
#   Deja salida/miniatura.jpg (3840×2160, lo que recomienda la ayuda de YouTube revisada el 2026-11-26) y salida/miniatura-chica.jpg (320 px: así se ve en el celular).
set -euo pipefail
CARPETA="$(cd "$1" && pwd)"
ARTE="$2"
AJUSTE="${3:-}"; [ -n "$AJUSTE" ] || AJUSTE="{}"
PROYECTO="$(cd "${4:-$CARPETA/../proyecto}" && pwd)"
PY="${PYTHON:-python3}"
NOMBRE="$(basename "$CARPETA")"
EXT="${ARTE##*.}"
mkdir -p "$PROYECTO/public/miniaturas" "$CARPETA/salida"
cp "$ARTE" "$PROYECTO/public/miniaturas/$NOMBRE.$EXT"
PROPS="$("$PY" - "$CARPETA/publicacion.json" "miniaturas/$NOMBRE.$EXT" "$AJUSTE" <<'EOF'
import json, sys
m = json.load(open(sys.argv[1], encoding="utf-8"))["miniatura"]
p = {"arte": sys.argv[2], "texto": m["texto"]}
p.update(json.loads(sys.argv[3]))
print(json.dumps(p))
EOF
)"
cd "$PROYECTO"
npx remotion still MiniaturaTop "$CARPETA/salida/miniatura.png" --props="$PROPS" --scale=3 --log=error
cd "$CARPETA/salida"
ffmpeg -v error -y -i miniatura.png -q:v 3 miniatura.jpg
ffmpeg -v error -y -i miniatura.png -vf "scale=320:180" -q:v 3 miniatura-chica.jpg
rm -f miniatura.png
echo "miniatura.jpg: $(( $(wc -c < miniatura.jpg) / 1024 )) KB · mira miniatura-chica.jpg"
