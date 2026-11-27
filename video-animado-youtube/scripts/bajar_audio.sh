#!/bin/bash
# Baja de Mixkit la música (2 pistas) y los efectos de sonido (sonidos.tsv) que usa la plantilla, y los deja listos
# en <proyecto>/public/musica/ y <proyecto>/public/sfx/.
# Uso: bash bajar_audio.sh <carpeta del proyecto> --acepto-licencia [--solo-musica]
#
# Por qué no vienen dentro de la skill: la licencia de Mixkit permite usarlos gratis en videos de YouTube (también
# monetizados) sin atribución, pero no permite repartirlos sueltos ni dentro de una plantilla. Por eso cada usuario
# los baja de la fuente. Antes de correrlo, lee tú la licencia: https://mixkit.co/license/ (Sound Effects Free
# License y Stock Music Free License). --acepto-licencia dice que la leíste.
#
# Qué hace con cada archivo: baja el MP3 de vista previa que Mixkit publica, recorta el silencio del inicio, lo
# deja de máximo 3 s (6 s los ambientes), le da entrada y salida suaves y lo normaliza a -16 LUFS en WAV.
# Son ~200 efectos (~100 MB) y 2 pistas (~15 MB). Si un id ya no existe en Mixkit, lo salta y lo dice al final.
set -uo pipefail
PROYECTO="$(cd "${1:?Falta la carpeta del proyecto}" && pwd)"
shift
ACEPTO=0; SOLO_MUSICA=0
for x in "$@"; do
  case "$x" in --acepto-licencia) ACEPTO=1 ;; --solo-musica) SOLO_MUSICA=1 ;; esac
done
[ "$ACEPTO" = 1 ] || { echo "Lee la licencia (https://mixkit.co/license/) y vuelve a correrlo con --acepto-licencia"; exit 1; }
AQUI="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$PROYECTO/public/musica" "$PROYECTO/public/sfx"
FALLAN=()

# Música: dos camas rítmicas, bajitas y constantes (el molde salta su intro lenta). Elegidas en el canal original
# porque se parecían a la música de la referencia; cámbialas por otras con licencia si quieres (mismo nombre).
#   curiosa.mp3 = Mixkit «Masking the Masters» (id 552) · tension.mp3 = Mixkit «Focus on Yourself» (id 568)
for par in "curiosa 552" "tension 568"; do
  set -- $par
  DEST="$PROYECTO/public/musica/$1.mp3"
  [ -s "$DEST" ] && { echo "ya estaba: musica/$1.mp3"; continue; }
  if curl -fsSL -A "Mozilla/5.0" -o "$TMP/m.mp3" "https://assets.mixkit.co/music/$2/$2.mp3"; then
    ffmpeg -v error -y -i "$TMP/m.mp3" -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -b:a 192k "$DEST" \
      && echo "musica/$1.mp3 (Mixkit $2)" || FALLAN+=("musica $1 ($2)")
  else
    FALLAN+=("musica $1 ($2)")
  fi
done

if [ "$SOLO_MUSICA" = 0 ]; then
  tail -n +2 "$AQUI/sonidos.tsv" | while IFS=$'\t' read -r ARCH ID DESC SEG; do
    DEST="$PROYECTO/public/sfx/$ARCH.wav"
    [ -s "$DEST" ] && continue
    MAX=3; awk "BEGIN{exit !($SEG > 3)}" && MAX=6
    if curl -fsSL -A "Mozilla/5.0" -o "$TMP/s.mp3" "https://assets.mixkit.co/active_storage/sfx/$ID/$ID-preview.mp3"; then
      ffmpeg -v error -y -i "$TMP/s.mp3" -af "silenceremove=start_periods=1:start_threshold=-50dB,atrim=0:$MAX,afade=t=in:d=0.01,areverse,afade=t=in:d=0.03,areverse,loudnorm=I=-16:TP=-2" \
        -ar 44100 -ac 2 -c:a pcm_s16le "$DEST" && echo "sfx/$ARCH.wav" || echo "FALLÓ sfx $ARCH ($ID)" >> "$TMP/fallan.txt"
    else
      echo "FALLÓ sfx $ARCH ($ID)" >> "$TMP/fallan.txt"
    fi
    sleep 0.3   # sin prisa: no saturar el sitio
  done
fi
[ -f "$TMP/fallan.txt" ] && cat "$TMP/fallan.txt"
[ ${#FALLAN[@]} -gt 0 ] && printf 'FALLÓ %s\n' "${FALLAN[@]}"
echo "Efectos en public/sfx: $(ls "$PROYECTO/public/sfx" | grep -c '\.wav$') · pistas en public/musica: $(ls "$PROYECTO/public/musica" | grep -c '\.mp3$')"
