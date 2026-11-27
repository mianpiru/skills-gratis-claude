#!/usr/bin/env python3
"""Pone los capítulos con sus tiempos reales en la descripción de un explicativo, después del render.
Uso: python3 capitulos_yt.py <carpeta del video> [--etiqueta "CHAPTERS"]
Lee salida/hojas/cortes.txt (lo deja render.sh: «NN inicio duración» por capítulo) y publicacion.json
(«capitulos»: títulos en orden; el cierre no lleva título y queda dentro del último). Cambia la línea {CAPITULOS}
de la descripción por la lista. Guarda la plantilla en «descripcion_plantilla» para poder repetirlo.
YouTube solo muestra capítulos si el primero es 0:00, hay al menos tres y cada uno dura 10 s o más.
"""
import json, os, sys

carpeta = sys.argv[1].rstrip("/")
etiqueta = sys.argv[sys.argv.index("--etiqueta") + 1] if "--etiqueta" in sys.argv else "CHAPTERS"
ruta = os.path.join(carpeta, "publicacion.json")
pub = json.load(open(ruta, encoding="utf-8"))
plantilla = pub.get("descripcion_plantilla") or pub["descripcion"]
if "{CAPITULOS}" not in plantilla:
    sys.exit("La descripción no tiene la línea {CAPITULOS}")
inicios = [float(l.split()[1]) for l in open(os.path.join(carpeta, "salida", "hojas", "cortes.txt")) if l.strip()]
titulos = pub["capitulos"]
if len(titulos) > len(inicios) or len(titulos) < 3:
    sys.exit(f"Hay {len(titulos)} títulos y {len(inicios)} capítulos renderizados")
lineas = [etiqueta]
for t, ini in zip(titulos, inicios):
    s = int(ini)  # hacia abajo: el capítulo ya empezó cuando YouTube salta ahí
    lineas.append(f"{s // 60}:{s % 60:02d} {t}")
if not lineas[1].startswith("0:00"):
    sys.exit("El primer capítulo no empieza en 0:00")
pub["descripcion_plantilla"] = plantilla
pub["descripcion"] = plantilla.replace("{CAPITULOS}", "\n".join(lineas))
if len(pub["descripcion"]) > 4900:
    sys.exit(f"La descripción quedó de {len(pub['descripcion'])} caracteres; el tope es 5.000")
json.dump(pub, open(ruta, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("\n".join(lineas))
