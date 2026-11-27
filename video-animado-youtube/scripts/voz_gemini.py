#!/usr/bin/env python3
"""Voz de un capítulo con Gemini TTS (Google AI Studio). El estilo se pide con palabras.

Uso:
  python3 voz_gemini.py <texto.txt> <salida.wav> [--voz Charon] [--estilo "..."] [--modelo ...]

La clave se lee de la variable GEMINI_API_KEY o del archivo ~/.config/video-animado-youtube/gemini.key
(archivo privado, chmod 600). Cómo crearla: referencias/requisitos.md. Nunca se pega en el chat.

Voces de hombre útiles para narrar: Charon (informativa), Fenrir (con energía), Orus (firme), Algenib (grave),
Iapetus (clara). De mujer: Kore (firme), Aoede (ligera), Leda (juvenil), Zephyr (brillante).
Sale WAV 24 kHz mono. Los tiempos por palabra se sacan después con tiempos_voz.py (Whisper).

OJO: Gemini a veces lee en voz alta sus instrucciones (el estilo) o repite el guion. Por eso el estilo va corto
y en el formato de «notas del director», y SIEMPRE se revisa con Whisper lo que dijo antes de seguir.
"""
import argparse, base64, json, os, sys, urllib.error, urllib.request, wave

# Se prueban en orden hasta que uno responda. Los nombres cambian con el tiempo: si ninguno sirve, mira los
# modelos TTS vigentes en la página de precios de Google AI Studio y pásalo con --modelo.
MODELOS = ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts", "gemini-3.1-flash-tts-preview",
           "gemini-2.5-flash-preview-tts"]
ESTILO = ("Narrator of a popular YouTube explainer channel. Confident, clear, fast-paced, building suspense, "
          "punchy emphasis on the numbers.")


def clave():
    k = os.environ.get("GEMINI_API_KEY")
    if not k:
        p = os.path.expanduser("~/.config/video-animado-youtube/gemini.key")
        if os.path.exists(p):
            k = open(p).read().strip()
    if not k:
        sys.exit("Falta la clave: GEMINI_API_KEY o ~/.config/video-animado-youtube/gemini.key (referencias/requisitos.md)")
    return k


def pedir(modelo, texto, voz, k, estilo):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent"
    # Formato «notas del director» + TRANSCRIPT: así el modelo lee solo la transcripción.
    # Con el estilo suelto delante, los modelos nuevos lo leían en voz alta. Encabezados en inglés, como en la guía
    # de Google: en español, con textos cortos, a veces leía las notas.
    prompt = (
        "Speak ONLY the text under TRANSCRIPT. Never read the director's notes aloud.\n\n"
        f"### DIRECTOR'S NOTES\n{estilo}\n\n### TRANSCRIPT\n{texto}"
    )
    cuerpo = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voz}}},
        },
    }
    req = urllib.request.Request(url, data=json.dumps(cuerpo).encode(), headers={
        "Content-Type": "application/json", "x-goog-api-key": k})
    with urllib.request.urlopen(req, timeout=240) as r:
        d = json.load(r)
    datos = base64.b64decode(d["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
    # A veces Gemini manda el audio ya con su cabecera WAV ("RIFF…data"). Si se deja, esos 44 bytes suenan como
    # un golpe seco al inicio de la voz (se oye al final del capítulo anterior): se quita.
    if datos[:4] == b"RIFF":
        i = datos.find(b"data", 12, 200)
        if i != -1:
            datos = datos[i + 8:]
    return datos[: len(datos) // 2 * 2]


def quitar_ruido_final(pcm, sr=24000):
    """Gemini a veces cierra con una ráfaga de ruido a todo volumen (~0,15 s) después de un silencio.
    Se corta en ese silencio y se apaga el final suavemente. La entrada se abre en 10 ms."""
    try:
        import numpy as np
    except ImportError:
        return pcm
    x = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768
    v = int(sr * 0.01)
    n = len(x) // v
    rms = np.array([np.sqrt((x[k * v:(k + 1) * v] ** 2).mean()) for k in range(n)])
    corte = len(x)
    for k in range(n - 1, max(0, n - 80), -1):
        if all(rms[j] < 0.01 for j in range(k - 7, k + 1)):
            cola = x[(k + 1) * v:]
            if 0 < len(cola) < sr * 0.4 and np.abs(np.diff(cola)).mean() > 0.06:
                corte = (k - 7) * v + int(sr * 0.08)
            break
    x = x[:corte]
    a = min(len(x), int(sr * 0.01))
    x[:a] *= np.linspace(0, 1, a)
    d = min(len(x), int(sr * 0.03))
    x[len(x) - d:] *= np.linspace(1, 0, d)
    return (np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("texto")
    ap.add_argument("salida")
    ap.add_argument("--voz", default="Charon")
    ap.add_argument("--estilo", default=ESTILO)
    ap.add_argument("--modelo", default=None)
    a = ap.parse_args()
    if len(a.estilo.split()) > 40:
        print("AVISO: el estilo tiene más de 40 palabras. Con estilos largos Gemini tiende a leerlos en voz alta.")
    k = clave()
    texto = open(a.texto, encoding="utf-8").read().strip()
    ultimo = None
    for m in ([a.modelo] if a.modelo else MODELOS):
        try:
            pcm = pedir(m, texto, a.voz, k, a.estilo)
            break
        except urllib.error.HTTPError as e:
            ultimo = f"{m}: {e.code} {e.read().decode()[:300]}"
            if e.code == 429:
                sys.exit(f"Gemini respondió 429 (sin cupo por ahora). Espera o revisa tu plan. {ultimo}")
    else:
        sys.exit(f"Gemini no devolvió audio. Último error: {ultimo}")
    with wave.open(a.salida, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(24000)
        w.writeframes(quitar_ruido_final(pcm))
    print(f"listo ({m}, voz {a.voz}): {a.salida}")


if __name__ == "__main__":
    main()
