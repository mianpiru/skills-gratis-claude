#!/usr/bin/env python3
"""Arma lo mecánico de un video nuevo, sin gastar tokens:
  - <carpeta del video>/capitulos.txt (lo leen render.sh, capitulos_yt.py y revisar_audio.py)
  - <proyecto>/src/planopop/vNN/video.tsx (capítulos, colas y música por tramos)
  - lo anota en <proyecto>/src/planopop/videos.tsx (Root.tsx registra solo «VNN» y «VNNCapMM»)

Uso: python3 armar_video.py <carpeta del video> [--proyecto <carpeta>] [--tension 5,8]
  carpeta del video: videos-animados/01-tema (con video.json → "numero": "01")
  --tension: capítulos (por número) que llevan la pista de tensión; el resto lleva la curiosa.
Se corre cuando ya existen todos los <proyecto>/src/planopop/vNN/CapMM.tsx y las voces. Se puede repetir.
"""
import argparse, glob, json, os, re, sys

# Pistas de public/musica (las baja bajar_audio.sh) y los segundos de intro lenta que se saltan en cada tramo.
PISTAS = {"curiosa": ("curiosa", [16]), "tension": ("tension", [31, 62])}

ap = argparse.ArgumentParser()
ap.add_argument("carpeta")
ap.add_argument("--proyecto", default=None)
ap.add_argument("--tension", default="")
a = ap.parse_args()

carpeta = os.path.abspath(a.carpeta.rstrip("/"))
proyecto = os.path.abspath(a.proyecto or os.path.join(carpeta, "..", "proyecto"))
nombre = os.path.basename(carpeta)
nn = str(json.load(open(os.path.join(carpeta, "video.json"), encoding="utf-8"))["numero"]).zfill(2)
if not re.fullmatch(r"\d\d", nn):
    sys.exit('"numero" en video.json tiene que ser de dos cifras, por ejemplo "01"')
vid = f"V{nn}"
src = os.path.join(proyecto, "src", "planopop", f"v{nn}")

caps = sorted(os.path.basename(os.path.dirname(os.path.dirname(p)))
              for p in glob.glob(os.path.join(carpeta, "cap[0-9][0-9]", "voz", "texto.txt")))
if len(caps) < 3:
    sys.exit(f"Solo hay {len(caps)} capítulos con voz/texto.txt en {carpeta}")
faltan = [c for c in caps if not os.path.exists(os.path.join(src, f"C{c[1:]}.tsx"))]
if faltan:
    sys.exit(f"Faltan los archivos de animación de: {', '.join(faltan)} en {src}")
sin_voz = [c for c in caps if not os.path.exists(os.path.join(proyecto, "public", f"v{nn}-{c}", "palabras.json"))]
if sin_voz:
    sys.exit(f"Faltan las voces de: {', '.join(sin_voz)} (corre scripts/voces.sh {a.carpeta})")
for archivo, _ in PISTAS.values():
    if not os.path.exists(os.path.join(proyecto, "public", "musica", f"{archivo}.mp3")):
        print(f"AVISO: falta public/musica/{archivo}.mp3 (scripts/bajar_audio.sh). El render fallará sin ella.")

# Colas: aire entre capítulos; un poco más antes del cierre, y el cierre aguanta 5 s para las pantallas finales
colas = {c: 0.6 for c in caps}
colas[caps[-2]] = 1.6
colas[caps[-1]] = 5.0
with open(os.path.join(carpeta, "capitulos.txt"), "w") as f:
    for c in caps:
        f.write(f"v{nn}-{c} {colas[c]}\n")

# Música: tramos seguidos del mismo tono
tensos = {int(x) for x in a.tension.split(",") if x.strip()}
tonos = ["tension" if int(c[3:]) in tensos else "curiosa" for c in caps]
tramos, k, usados = [], 0, {"curiosa": 0, "tension": 0}
while k < len(caps):
    j = k
    while j < len(caps) and tonos[j] == tonos[k]:
        j += 1
    archivo, saltos = PISTAS[tonos[k]]
    salto = saltos[usados[tonos[k]] % len(saltos)]
    usados[tonos[k]] += 1
    tramos.append(f'    {{ archivo: "{archivo}", desde: {k}, hasta: {j}, salto: {salto} }},')
    k = j

imports = "\n".join(f'import {{ C{c[1:]} }} from "./C{c[1:]}";' for c in caps)
lineas = "\n".join(f'    {{ trabajo: "v{nn}-{c}", comp: C{c[1:]}, cola: {colas[c]} }},' for c in caps)
with open(os.path.join(src, "video.tsx"), "w") as f:
    f.write(f"""// {nombre}: capítulos, colas y música. Lo genera scripts/armar_video.py de la skill (no editar a mano:
// las colas tienen que coincidir con {nombre}/capitulos.txt).
import {{ VideoPop }} from "../Completo";
{imports}

export const VIDEO: VideoPop = {{
  id: "{vid}",
  capitulos: [
{lineas}
  ],
  musica: [
{chr(10).join(tramos)}
  ],
}};
""")

reg = os.path.join(proyecto, "src", "planopop", "videos.tsx")
s = open(reg).read()
imp = f'import {{ VIDEO as {vid} }} from "./v{nn}/video";'
if not re.search(r"^" + re.escape(imp), s, re.M):  # una línea comentada no cuenta
    s = s.replace("\n\nexport const VIDEOS", f"\n{imp}\n\nexport const VIDEOS", 1)
    s = s.replace("export const VIDEOS: VideoPop[] = [\n", f"export const VIDEOS: VideoPop[] = [\n  {vid},\n", 1)
    open(reg, "w").write(s)
print(f"Listo: composición {vid} con {len(caps)} capítulos ({', '.join(tonos)}). Revisa tipos: cd {proyecto} && npx tsc --noEmit")
