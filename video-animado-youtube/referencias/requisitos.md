# Qué necesitas para usar «Video animado para YouTube»

Los precios y los planes llevan la fecha en que se revisaron en la página oficial. Cambian seguido: **antes de pagar algo, míralo en su página ese día.** Lo marcado `[verificar]` no se pudo confirmar en la fuente oficial al escribir esto.

## 1. Imprescindible
| Qué | Para qué | Precio y nota |
|---|---|---|
| **Claude con plan de pago** (Pro o superior) | Escribe el guion, anima los capítulos con código, revisa las hojas y corre los scripts | Pro: 20 USD/mes, o 17 USD/mes pagando el año (200 USD); incluye Claude Code. Max: desde 100 USD/mes (claude.com/pricing, 2026-11-26, sin impuestos). Un video de 9 minutos usa mucho del límite: con Pro, la skill trabaja con lectura mínima para que alcance (`reglas.md` 38) |
| **Claude Code** (terminal) o **la app de escritorio de Claude** | Corre la skill y los scripts en tu computador | Probado en Mac |
| **Node.js** | Remotion (el proyecto de animación) | La plantilla pide Node 20.19+, 22.13+ o 24+ (campo `engines` de su `package.json`, el de Remotion 4.0.539) |
| **ffmpeg** | Cortar, unir, normalizar el audio y hacer las hojas de contacto | Gratis |
| **Python 3 + Whisper** (`openai-whisper`) y **numpy** | Tiempos por palabra y revisión de la voz | Gratis. La primera vez baja el modelo `small` (~460 MB) |
| **Una voz** | La narración | Gemini TTS (§4), tu propia voz grabada, u otra voz con licencia comercial que ya pagues |

## 2. Opcional
| Qué | Para qué | Nota |
|---|---|---|
| **Google Chrome + la extensión Claude in Chrome** | Que Claude pida el arte de la miniatura o un informe de investigación en tu navegador | Sin ella, tú pegas el pedido y guardas el resultado |
| **Un generador de imágenes** (ChatGPT, Gemini u otro) | El arte de la miniatura | Precio de cada plan `[verificar]` en su página. Revisa que permita uso comercial. Sin él, la miniatura sale de un cuadro del propio video |
| **Un asistente de investigación profunda** | Los datos del video sin gastar uso de Claude | Opcional; Claude también puede buscar con un tope de páginas |

## 3. Instalar ffmpeg, Whisper y Node (una vez)
En Mac, en la Terminal:
```bash
# Homebrew, si no lo tienes (instrucciones oficiales en brew.sh)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install ffmpeg node
pip3 install -U openai-whisper numpy
```
Comprueba: `ffmpeg -version`, `node -v` y `python3 -c "import whisper; print('ok')"`.
Si tienes varios Python y Whisper quedó en uno que no es el `python3` de la terminal, corre los scripts con ese (`PYTHON=/ruta/a/python3 bash voces.sh …`).

En Windows: `winget install ffmpeg`, Node desde nodejs.org y Python desde python.org; luego `pip install -U openai-whisper numpy`. `[sin probar en Windows]`: los scripts `.sh` necesitan Git Bash o WSL.

**Renders, Whisper y ffmpeg largos usan mucha memoria: uno a la vez.** Con 16 GB de RAM o menos, deja `--concurrency=2` (lo que trae la plantilla).

## 4. Clave de Gemini (voz)
Precios de Google AI Studio (aistudio.google.com/docs/pricing, revisado el 2026-11-26), por cada millón de tokens:
| Modelo de voz | Nivel gratis | Pago: texto que entra | Pago: audio que sale |
|---|---|---|---|
| `gemini-3.8-flash-tts` | Sí, gratis con cupo | 0,50 USD hasta el 31-dic-2026; 1,00 USD desde el 1-ene-2027 | 9,00 USD hasta el 31-dic-2026; 18,00 USD desde el 1-ene-2027 |
| `gemini-3.8-flash-lite-tts` | Sí, gratis con cupo | 0,50 USD; 1,00 USD desde 2027 | 6,00 USD; 12,00 USD desde 2027 |
| `gemini-3.1-flash-tts-preview` | Sí, gratis con cupo | 1,00 USD | 20,00 USD |

El nivel gratis tiene un tope de pedidos que Google no fija para siempre: un video son 10 pedidos (uno por capítulo) más los reintentos. Si responde `429`, se acabó el cupo por ahora. Cuánto audio entra en un millón de tokens: `[verificar]` en la misma página antes de calcular un costo. Activar el pago es **puerta 1**.

1. Entra a **aistudio.google.com** con tu cuenta de Google → **Get API key / Obtener clave de API** → crear clave. Cópiala.
2. Guárdala en tu computador (**nunca la pegues en el chat de Claude**):
   ```bash
   mkdir -p ~/.config/video-animado-youtube
   pbpaste > ~/.config/video-animado-youtube/gemini.key   # con la clave copiada (Mac)
   chmod 600 ~/.config/video-animado-youtube/gemini.key
   ```
   O como variable: `export GEMINI_API_KEY="tu-clave"` en tu `~/.zshrc`.
3. Si alguna vez se filtra, bórrala en AI Studio y crea otra.

## 5. Licencia de Remotion
Según remotion.dev/docs/license/pricing (revisado el 2026-11-26): **gratis para personas y empresas de hasta 3 personas.** Si son 4 o más, necesitan la licencia de empresa: «Remotion for Creators», 25 USD por puesto al mes (crear videos a mano), o «Remotion for Automators», 0,01 USD por render con un mínimo de 100 USD al mes (renders automáticos). Si haces videos para clientes desde una agencia, revisa en cuál caes.

## 6. Música y efectos (Mixkit)
La plantilla no trae audio: la licencia de Mixkit permite usar sus efectos y su música en videos de YouTube sin atribución, pero no repartirlos sueltos ni dentro de una plantilla. Lee tú la licencia en **mixkit.co/license** (Sound Effects Free License y Stock Music Free License) antes de correr `scripts/bajar_audio.sh`. `[verificar]`: al escribir esto no se pudo leer el texto completo de la licencia en la página; los términos de arriba son los que se revisaron el 2026-11-24 para el canal original.

## 7. Espacio en disco
- `node_modules` del proyecto: unos cientos de MB. Efectos y música: ~115 MB.
- Cada video: unos 100–300 MB de voces y salidas, más las copias temporales de Remotion (se borran con `limpiar_remotion.sh`).
- Ten al menos 20 GB libres antes de un render final.

## 8. Antes de la primera sesión (lista rápida)
- [ ] `node -v`, `ffmpeg -version` y `python3 -c "import whisper"` responden.
- [ ] Clave de Gemini guardada (si vas a usar Gemini).
- [ ] La skill copiada en `~/.claude/skills/video-animado-youtube` y la app reiniciada (ver `INSTALAR.md`).
- [ ] Una carpeta para tu canal, abierta en Claude.
