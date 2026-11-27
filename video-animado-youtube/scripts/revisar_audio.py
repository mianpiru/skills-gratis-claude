#!/usr/bin/env python3
"""Busca golpes secos ("crash") en el audio de un explicativo ya renderizado: saltos bruscos de la onda en los
límites de los capítulos y al inicio de cada voz. Se corre después del render final y antes de subir.

Uso: python3 revisar_audio.py <carpeta del video> [carpeta del proyecto]
Sale con código 1 si encuentra golpes. Los límites salen de capitulos.txt (trabajo y cola) y de palabras.json.
"""
import json, math, os, subprocess, sys, tempfile, wave
import numpy as np

FPS = 30


def main():
    carpeta = os.path.abspath(sys.argv[1])
    proyecto = os.path.abspath(sys.argv[2]) if len(sys.argv) > 2 else os.path.join(carpeta, "..", "proyecto")
    publico = os.path.join(proyecto, "public")
    slug = os.path.basename(carpeta)
    video = os.path.join(carpeta, "salida", f"{slug}.mp4")
    caps = [l.split() for l in open(os.path.join(carpeta, "capitulos.txt")) if l.strip()]
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "a.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-vn", "-ac", "1", "-ar", "48000", wav], check=True)
        w = wave.open(wav)
        sr = w.getframerate()
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float)
    malos, t = [], 0.0
    # Cada voz.wav empieza limpia (sin cabecera colada)
    for trabajo, _ in caps:
        v = wave.open(os.path.join(publico, trabajo, "voz.wav"))
        x = np.frombuffer(v.readframes(240), dtype=np.int16)
        if x[:4].tobytes()[:2] in (b"RI", b"QI") or np.abs(x[:24]).max() > 6000:
            malos.append(f"{trabajo}: la voz arranca de golpe (¿cabecera WAV colada?)")
    for k, (trabajo, cola) in enumerate(caps):
        p = json.load(open(os.path.join(publico, trabajo, "palabras.json")))
        t += math.ceil((p[-1]["fin"] + float(cola)) * FPS) / FPS
        if k == len(caps) - 1:
            break
        i = int(t * sr)
        seg = a[max(0, i - int(sr * 0.05)): i + int(sr * 0.05)]
        salto = np.abs(np.diff(seg)).max()
        fondo = np.sqrt((a[max(0, i - int(sr * 0.2)): i - int(sr * 0.06)] ** 2).mean())
        estado = "GOLPE" if salto > 8000 and salto > 12 * max(fondo, 1) else "bien"
        print(f"{trabajo} → siguiente  {int(t // 60)}:{t % 60:05.2f}  salto {salto:6.0f}  fondo {fondo:5.0f}  {estado}")
        if estado == "GOLPE":
            malos.append(f"golpe al pasar de {trabajo} al siguiente ({int(t // 60)}:{t % 60:05.2f})")
    if malos:
        print("\n".join(["", "PROBLEMAS:"] + malos))
        sys.exit(1)
    print("\nAudio limpio en los límites de capítulo.")


if __name__ == "__main__":
    main()
