#!/usr/bin/env python3
"""Arma <proyecto>/src/planopop/biblioteca/INDICE.md: una línea por pieza (nombre, archivo, qué es en pocas palabras).
Los animadores leen este índice (unos 4 mil tokens) en vez de CATALOGO.md entero (unos 25 mil), y abren el
catálogo o el código solo de las piezas que van a usar. Se corre después de agregar piezas al catálogo: python3 indice_biblioteca.py <carpeta del proyecto>"""
import re, pathlib, sys
base = pathlib.Path(sys.argv[1]).resolve() / "src/planopop/biblioteca"
cat = (base / "CATALOGO.md").read_text().splitlines()
out = ["# Índice corto de la biblioteca (generado; no editar a mano)", "",
       "Importa todo desde `../biblioteca`. Para las props y un ejemplo de una pieza: `grep -n \"| NombrePieza |\" CATALOGO.md`",
       "o lee su archivo. Las reglas de movimiento están en las primeras 30 líneas de CATALOGO.md: léelas una vez.", ""]
seccion = None
for l in cat:
    m = re.match(r"^## (.+)", l)
    if m:
        t = m.group(1)
        seccion = None if t.startswith("Reglas") else t
        if seccion: out += ["", f"## {seccion}"]
        continue
    if seccion and l.startswith("| ") and not l.startswith("| Pieza") and not set(l) <= set("|- "):
        cols = [c.strip() for c in l.strip("|").split("|")]
        if len(cols) >= 2:
            que = re.sub(r"\s+", " ", cols[1])
            if len(que) > 70: que = que[:67].rsplit(" ", 1)[0] + "…"
            out.append(f"- {cols[0]}: {que}")
(base / "INDICE.md").write_text("\n".join(out) + "\n")
print(f"INDICE.md: {len(out)} líneas, {(base/'INDICE.md').stat().st_size//1024} KB")
