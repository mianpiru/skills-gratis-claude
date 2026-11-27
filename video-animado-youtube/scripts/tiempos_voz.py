#!/usr/bin/env python3
"""Tiempos por palabra con Whisper, y revisión de que la voz dice el guion (y nada más).

Uso:
  python3 tiempos_voz.py <voz.wav> <texto.txt> <carpeta_salida> [--idioma en] [--pausa-max 0.45] [--modelo small]
  python3 tiempos_voz.py <video.mp4> <texto.txt> <carpeta_salida> --sin-audio      # revisar un video ya hecho

1. Transcribe con Whisper palabra por palabra.
2. Alinea cada palabra del guion con la que Whisper oyó (los subtítulos llevan la ortografía del guion).
3. Con --pausa-max > 0, acorta los silencios entre palabras a ese valor y escribe voz.wav recortada.
   Con --sin-audio no escribe audio (los tiempos quedan en el tiempo del archivo original).
Escribe palabras.json: [{"i", "palabra", "inicio", "fin"}] y muestra lo que Whisper oyó y las palabras del guion
que no encontró (para comparar palabra por palabra).

Avisos en voz alta (v1.1.0):
- FRASE SALTADA: 3 o más palabras seguidas del guion con menos de 0,06 s cada una. Es la señal de que no se
  dijeron, aunque el diff no lo marque (Whisper a veces «estira» lo que oyó sobre ellas).
- SE OYE DE MÁS: palabras que se oyen y no están en el guion (por ejemplo, frases que Gemini agrega al final).
- FRASE REPETIDA: un tramo de 4 o más palabras que se oye más veces de las que está en el guion.
- ÚLTIMA PALABRA: cuánto falta entre el fin de la última palabra y el final del archivo (si es muy poco, puede
  quedar cortada).
- LEYÓ LAS INSTRUCCIONES: 3 o más palabras oídas ANTES de la primera palabra del guion. Es lo típico de Gemini
  cuando lee sus notas de estilo. Con --pausa-max > 0 ese tramo ya se corta solo de voz.wav; aun así, escucha el
  arranque.
Escribe también oidas.json (lo que oyó Whisper, con tiempos) y la primera línea de la salida es lo que oyó.

Necesita: pip install openai-whisper, y ffmpeg.
"""
import argparse
import difflib
import json
import os
import re
import subprocess
import sys
import unicodedata

NUMEROS = {"cero": "0", "uno": "1", "una": "1", "dos": "2", "tres": "3", "cuatro": "4", "cinco": "5", "seis": "6",
           "siete": "7", "ocho": "8", "nueve": "9", "diez": "10", "veinte": "20", "cien": "100",
           "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7",
           "eight": "8", "nine": "9", "ten": "10", "twenty": "20", "hundred": "100"}


def norm(p):
    p = unicodedata.normalize("NFD", p.lower())
    p = "".join(c for c in p if unicodedata.category(c) != "Mn")
    p = re.sub(r"[^a-z0-9ñ]", "", p)
    return NUMEROS.get(p, p)  # Whisper escribe "8" donde el guion dice "ocho"


MIN_PAL = 0.06      # una palabra dicha dura más que esto
MIN_SEGUIDAS = 3    # tantas palabras seguidas por debajo de MIN_PAL = frase que no se dijo
N_REPE = 4          # largo mínimo (en palabras) de un tramo repetido


def alinear(guion, oidas):
    """Devuelve (tiempos por palabra del guion, diferencias, tramos oídos de más [(texto, inicio, fin)])."""
    a = [norm(p) for p in guion]
    b = [norm(w["word"]) for w in oidas]
    tiempos = [None] * len(guion)
    faltan, de_mas = [], []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == "equal":
            for k in range(i2 - i1):
                tiempos[i1 + k] = (oidas[j1 + k]["start"], oidas[j1 + k]["end"])
        elif op == "replace" and j2 > j1:
            # reparte el tramo oído entre las palabras del guion de ese tramo
            t0, t1 = oidas[j1]["start"], oidas[j2 - 1]["end"]
            n = i2 - i1
            for k in range(n):
                tiempos[i1 + k] = (t0 + (t1 - t0) * k / n, t0 + (t1 - t0) * (k + 1) / n)
            faltan.append("«%s» (oyó «%s»)" % (" ".join(guion[i1:i2]), " ".join(w["word"].strip() for w in oidas[j1:j2])))
        elif op == "delete":
            faltan.append("«%s» (no se oye)" % " ".join(guion[i1:i2]))
        elif op == "insert":
            de_mas.append((" ".join(w["word"].strip() for w in oidas[j1:j2]), oidas[j1]["start"], oidas[j2 - 1]["end"]))
    # palabras sin pareja: se pegan al final de la anterior
    for k, t in enumerate(tiempos):
        if t is None:
            previo = tiempos[k - 1][1] if k else 0.0
            tiempos[k] = (previo, previo + 0.05)
    return tiempos, faltan, de_mas


def frases_saltadas(guion, tiempos):
    """Tramos de MIN_SEGUIDAS o más palabras seguidas que duran menos de MIN_PAL cada una: no se dijeron."""
    tramos, ini = [], None
    for k, (t0, t1) in enumerate(list(tiempos) + [(0.0, 1.0)]):  # centinela para cerrar el último tramo
        corta = k < len(tiempos) and (t1 - t0) < MIN_PAL
        if corta and ini is None:
            ini = k
        elif not corta and ini is not None:
            if k - ini >= MIN_SEGUIDAS:
                tramos.append((ini, k))
            ini = None
    return tramos


def repetidas(guion, oidas, n=N_REPE):
    """Tramos de n palabras que se oyen más veces de las que aparecen en el guion (frase repetida)."""
    a = [norm(p) for p in guion]
    b = [norm(w["word"]) for w in oidas]

    def contar(xs):
        c = {}
        for k in range(len(xs) - n + 1):
            g = tuple(xs[k:k + n])
            c.setdefault(g, []).append(k)
        return c
    ca, cb = contar(a), contar(b)
    out, visto = [], -1
    for g, pos in sorted(cb.items(), key=lambda x: x[1][0]):
        if g not in ca or len(pos) <= len(ca[g]):  # solo tramos que están en el guion y se oyen más veces
            continue
        k = pos[-1]
        if k > visto:
            out.append((" ".join(w["word"].strip() for w in oidas[k:k + n]), [round(oidas[p]["start"], 2) for p in pos]))
        visto = max(visto, k + n - 1)  # un solo aviso por tramo repetido, no uno por cada n-grama
    return out


def recortar(voz, salida, tiempos, pausa_max):
    quitar = []
    if tiempos[0][0] > 0.05:
        quitar.append((0.0, tiempos[0][0] - 0.05))
    for (_, fin), (ini, _) in zip(tiempos, tiempos[1:]):
        if ini - fin > pausa_max:
            quitar.append((fin + pausa_max / 2, ini - pausa_max / 2))
    fin_audio = tiempos[-1][1] + 0.4
    conservar, t = [], 0.0
    for q0, q1 in quitar:
        if q0 > t:
            conservar.append((t, q0))
        t = q1
    conservar.append((t, fin_audio))
    expr = "+".join("between(t,%.3f,%.3f)" % (a, b) for a, b in conservar)
    # El final se apaga en 0,15 s: si quedó algún ruido después de la última palabra, no suena
    dur = sum(b - a for a, b in conservar)
    # La entrada se abre en 10 ms: si el recorte cae en plena onda, no suena un golpe al empezar el capítulo
    filtro = "aselect='%s',asetpts=N/SR/TB,afade=t=in:st=0:d=0.01,afade=t=out:st=%.3f:d=0.15" % (expr, max(0.0, dur - 0.15))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", voz, "-vn", "-af", filtro, salida], check=True)

    def mover(x):
        return x - sum(min(q1, x) - q0 for q0, q1 in quitar if x > q0)

    return [(mover(a), mover(b)) for a, b in tiempos]


def main():
    ap = argparse.ArgumentParser(description="Tiempos por palabra con Whisper")
    ap.add_argument("voz", help="audio o video con la voz")
    ap.add_argument("texto", help=".txt con lo que debería decir (el guion)")
    ap.add_argument("salida", help="carpeta donde escribir palabras.json (y voz.wav si se recorta)")
    ap.add_argument("--pausa-max", type=float, default=0.35, help="silencio máximo entre palabras (0 = no tocar)")
    ap.add_argument("--modelo", default="small", help="modelo de Whisper: base, small, medium")
    ap.add_argument("--idioma", default="es", help="idioma del guion para Whisper: es, en, pt, fr…")
    ap.add_argument("--sin-audio", action="store_true", help="no escribir audio; tiempos del archivo original")
    a = ap.parse_args()
    try:
        import whisper
    except ImportError:
        sys.exit("Falta Whisper: pip3 install openai-whisper (ver referencias/requisitos.md)")
    os.makedirs(a.salida, exist_ok=True)
    with open(a.texto, encoding="utf-8") as f:
        guion = re.findall(r"\S+", f.read().strip())
    if not guion:
        sys.exit("El texto está vacío: %s" % a.texto)
    # Sin initial_prompt y sin arrastrar el texto anterior: si no, Whisper se salta o inventa tramos
    r = whisper.load_model(a.modelo).transcribe(a.voz, language=a.idioma, word_timestamps=True,
                                               condition_on_previous_text=False)
    oidas = [w for s in r["segments"] for w in s.get("words", [])]
    if not oidas:
        sys.exit("Whisper no oyó ninguna palabra en %s" % a.voz)
    tiempos, faltan, de_mas = alinear(guion, oidas)
    saltadas = frases_saltadas(guion, tiempos)
    repes = repetidas(guion, oidas)
    fin_ultima = tiempos[-1][1]  # en el tiempo del archivo original, antes de recortar pausas
    primera_palabra = tiempos[0][0]
    try:
        dur_archivo = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
                                            "csv=p=0", a.voz], capture_output=True, text=True).stdout.strip())
    except ValueError:
        dur_archivo = None
    if a.sin_audio:
        pass
    elif a.pausa_max > 0:
        tiempos = recortar(a.voz, os.path.join(a.salida, "voz.wav"), tiempos, a.pausa_max)
    else:
        destino = os.path.join(a.salida, "voz.wav")
        if os.path.abspath(a.voz) != os.path.abspath(destino):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.voz, "-vn", destino], check=True)
    pal = [{"i": i, "palabra": p, "inicio": round(t[0], 3), "fin": round(t[1], 3)}
           for i, (p, t) in enumerate(zip(guion, tiempos))]
    with open(os.path.join(a.salida, "palabras.json"), "w", encoding="utf-8") as f:
        json.dump(pal, f, ensure_ascii=False, indent=1)
    with open(os.path.join(a.salida, "oidas.json"), "w", encoding="utf-8") as f:
        json.dump([{"word": w["word"], "start": w["start"], "end": w["end"]} for w in oidas], f, ensure_ascii=False)
    oido = " ".join(w["word"].strip() for w in oidas)
    print("Whisper oyó:", oido)
    dur = max(0.01, pal[-1]["fin"] - pal[0]["inicio"])
    print("%d palabras, de %.2f a %.2f s, %.2f palabras/s" % (len(pal), pal[0]["inicio"], pal[-1]["fin"], len(pal) / dur))
    if de_mas and de_mas[0][2] <= primera_palabra + 0.05 and len(de_mas[0][0].split()) >= 3:
        print("AVISO LEYÓ LAS INSTRUCCIONES: antes del guion se oye «%s» (de %.2f a %.2f s del archivo original). "
              "Con --pausa-max > 0 ese tramo ya quedó fuera de voz.wav; escucha el arranque. Si el guion también "
              "salió repetido, pide otra toma (máximo 2 por capítulo)." % (de_mas[0][0][:200], de_mas[0][1], de_mas[0][2]))
    if faltan:
        print("NO COINCIDE con el guion (revisa si es un homófono o si de verdad falta):")
        for x in faltan:
            print("  -", x)
    elif not (saltadas or de_mas or repes):
        print("Coincide palabra por palabra con el guion.")
    for i0, i1 in saltadas:
        t0, t1 = tiempos[i0][0], tiempos[i1 - 1][1]
        print("AVISO FRASE SALTADA: %d palabras seguidas en %.2f s (de %.2f a %.2f s del archivo original), menos de "
              "%.2f s cada una. Casi seguro NO se dijeron: «%s». Escúchalo. Arreglo: pasos/04-voz.md §4."
              % (i1 - i0, t1 - t0, t0, t1, MIN_PAL, " ".join(guion[i0:i1])))
    for txt, t0, t1 in de_mas:
        print("AVISO SE OYE DE MÁS (no está en el guion): «%s», de %.2f a %.2f s del archivo original." % (txt, t0, t1))
    for txt, ts in repes:
        print("AVISO FRASE REPETIDA: «%s…» se oye %d veces (en %s s del archivo original). Quita la repetición."
              % (txt, len(ts), ", ".join("%.2f" % t for t in ts)))
    if dur_archivo:
        cola = dur_archivo - fin_ultima
        print("Última palabra («%s») termina en %.2f s del archivo original, que dura %.2f s (quedan %.2f s)."
              % (guion[-1], fin_ultima, dur_archivo, cola))
        if cola < 0.1:
            print("AVISO ÚLTIMA PALABRA: termina a menos de 0,1 s del final; puede quedar cortada. Escúchala.")
    if de_mas and de_mas[-1][1] >= fin_ultima - 0.05:
        corte = fin_ultima + min(0.1, max(0.0, (de_mas[-1][1] - fin_ultima) / 2))
        print("Sobra audio después de la última palabra del guion: corta en el silencio tras «%s», cerca de %.2f s "
              "del archivo original (ffmpeg -i <audio> -to %.2f <salida>.wav). Escucha el corte: si se cuela el "
              "comienzo de la frase que sobra, adelántalo (ffmpeg -i <audio> -af silencedetect=noise=-35dB:d=0.1 "
              "-f null - muestra los silencios)." % (guion[-1], corte, corte))


if __name__ == "__main__":
    main()
