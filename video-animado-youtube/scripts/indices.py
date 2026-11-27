#!/usr/bin/env python3
"""Numera las palabras de un guion igual que lo hace tiempos_voz.py (se parte por espacios).
Las escenas y los sonidos de cada capítulo se anclan a estos índices.

Uso: python3 indices.py <carpeta del video>/capMM/voz/texto.txt
"""
import re, sys

texto = open(sys.argv[1], encoding="utf-8").read().strip()
palabras = re.findall(r"\S+", texto)
print(f"{len(palabras)} palabras (a ~2,9 palabras/s: {len(palabras) / 2.9:.0f} s)")
print(" ".join(f"{i}:{p}" for i, p in enumerate(palabras)))

# Cada párrafo del guion es una escena: aquí está la palabra en la que arranca cada uno
i = 0
for n, parrafo in enumerate(re.split(r"\n\s*\n", texto), 1):
    k = len(re.findall(r"\S+", parrafo))
    print(f"escena {n}: palabras {i}–{i + k - 1}")
    i += k
