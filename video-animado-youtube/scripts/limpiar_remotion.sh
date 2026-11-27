#!/bin/bash
# Borra las copias temporales que Remotion deja en cada render o still (remotion-webpack-bundle-*: copian public/
# y pueden pesar más de 1 GB cada una; en el proyecto original llegaron a sumar 28 GB en media hora de pruebas).
# Solo borra las de más de 20 minutos y solo si no hay ningún Remotion corriendo.
T="$(getconf DARWIN_USER_TEMP_DIR 2>/dev/null || echo "${TMPDIR:-/tmp}")"
if pgrep -f "remotion (render|still|studio|benchmark)" >/dev/null 2>&1; then
  echo "Remotion corriendo: no borro nada"; exit 0
fi
N=$(find "$T" -maxdepth 1 -name "remotion-webpack-bundle-*" -mmin +20 2>/dev/null | wc -l | tr -d ' ')
find "$T" -maxdepth 1 -name "remotion-webpack-bundle-*" -mmin +20 -exec rm -rf {} + 2>/dev/null
echo "Copias temporales de Remotion borradas: $N"
