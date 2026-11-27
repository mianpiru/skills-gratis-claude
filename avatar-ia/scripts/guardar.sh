#!/bin/bash
# Guarda como PNG la imagen que hay en el portapapeles (después de «Copiar imagen» en ChatGPT).
# Uso: guardar.sh ruta/salida.png
# Muestra el tamaño y el md5. Si el md5 se repite con la imagen anterior, no se copió la nueva: vuelve a copiarla.
# Funciona en Mac (osascript) y en Windows con Git Bash (PowerShell). La parte de Windows está [sin probar].
set -e
if [ -z "$1" ]; then echo "Uso: guardar.sh ruta/salida.png"; exit 1; fi
O="$1"; mkdir -p "$(dirname "$O")"; sleep 2
case "$(uname -s)" in
  Darwin)
    osascript -e "set f to open for access POSIX file \"$O\" with write permission" -e 'set eof f to 0' \
      -e 'write (the clipboard as «class PNGf») to f' -e 'close access f' ;;
  MINGW*|MSYS*|CYGWIN*)
    W=$(cygpath -w "$(cd "$(dirname "$O")" && pwd)")\\$(basename "$O")
    powershell.exe -NoProfile -STA -Command "Add-Type -AssemblyName System.Windows.Forms,System.Drawing; \$i=[System.Windows.Forms.Clipboard]::GetImage(); if (\$i -eq \$null) { Write-Error 'No hay una imagen en el portapapeles'; exit 2 }; \$i.Save('$W', [System.Drawing.Imaging.ImageFormat]::Png)" ;;
  *) echo "Sistema no soportado: descarga la imagen con el botón de ChatGPT."; exit 1 ;;
esac
ffprobe -v error -show_entries stream=width,height -of csv=p=0:s=x "$O" | tr '\n' ' '
if command -v md5 >/dev/null; then md5 -q "$O"; else md5sum "$O" | cut -d' ' -f1; fi
