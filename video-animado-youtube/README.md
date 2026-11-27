# Video animado para YouTube · v1.0.0 (2026-11-26)

Una skill de Claude que hace contigo videos explicativos animados para YouTube, al estilo de The Infographics Show: horizontales, de unos 9 minutos, en 10 capítulos, dibujados con código (Remotion), con voz IA, música, miniatura, título y descripción con capítulos y fuentes. Le dices el tema; ella hace los pasos. Tú apruebas en los momentos que importan.

Es el mismo sistema con el que se produce un canal real de explicativos animados en inglés desde el 20 de noviembre de 2026, empaquetado para cualquier tema, canal e idioma.

## Qué hace, paso a paso
1. **Tema y canal:** te propone temas respaldados por videos que ya funcionan en la referencia, o usa el tuyo.
2. **Datos con fuentes:** cada dato con su enlace y su nivel de confianza. Lo dudoso no se dice como hecho.
3. **Guion por capítulos** con gancho en los primeros 30 segundos, historia con protagonistas y un final que paga lo prometido.
4. **Voz:** Gemini TTS, tu voz o la que ya pagues. Revisa cada capítulo con Whisper (Gemini a veces lee sus instrucciones en voz alta; la skill lo detecta y lo recorta).
5. **Animación** con una biblioteca de unas 300 piezas: personas que hablan y parpadean, fondos con capas, fuego, humo y explosiones con volumen, una cámara que recorre la escena, rayos X, lupa, mapas, gráficos.
6. **Revisión** con hojas de contacto, capítulo por capítulo.
7. **Render** en 1080p con el audio normalizado y revisado.
8. **Miniatura** con el formato que más clics da en la referencia.
9. **Texto de publicación** listo para copiar y pegar.

## Dónde se detiene a preguntarte
- **Antes de gastar o instalar** algo (paquetes, sonidos, pago de Gemini, imágenes).
- **Antes de la voz:** apruebas el guion y oyes una muestra de la voz.
- **Antes de publicar:** te muestra el video, la miniatura y el texto. **La skill nunca sube nada a YouTube**: lo subes tú desde YouTube Studio.

## Qué necesitas
Claude con plan de pago (Claude Code o la app de escritorio), Node.js, ffmpeg, Whisper y una voz (una clave gratis de Gemini sirve para empezar). Todo explicado, con precios en USD y su fecha, en [`referencias/requisitos.md`](referencias/requisitos.md). Para instalar: [`INSTALAR.md`](INSTALAR.md).

## Usar
Abre Claude en la carpeta de tu canal y escribe:
- `/video-animado-youtube`
- «hazme un video animado sobre por qué se hunden los barcos en el Triángulo de las Bermudas»
- «dame 10 ideas de temas para mi canal de ciencia»
- «sigue con mi video de los volcanes»

Todo queda en la carpeta `videos-animados/` de tu proyecto: el proyecto de animación, una carpeta por video y un registro de lo que se hizo.

## Lo que queda fuera de la skill
- **La música y los efectos de sonido:** su licencia (Mixkit) no deja repartirlos dentro de una plantilla. La skill los baja de la fuente en tu computador, con tu permiso.
- **El arte de las portadas del canal original** y sus videos ya hechos: son de ese canal. La skill trae el código, no sus videos.
- **La subida a YouTube y las tareas programadas:** el canal original sube y produce solo, de noche. Aquí no: tú decides cuándo y subes tú.
- **Los Shorts sacados del video largo:** se probaron y se dejaron (`referencias/reglas.md` 35).

## Lo que está sin probar
- **La skill empaquetada NO se ha probado de punta a punta en un computador limpio.** El sistema original sí produce los videos del canal desde el 20 de noviembre de 2026, pero con sus propias rutas y herramientas.
- Lo que sí se comprobó al empaquetarla (2026-11-26, en un Mac): la plantilla compila, renderiza las muestras y un capítulo de ejemplo; y con voces de prueba corren de punta a punta `armar_video.py`, `render.sh` (render final y hojas), `revisar_audio.py`, `capitulos_yt.py` y `miniatura.sh`. `tiempos_voz.py` se probó con una voz de prueba que «leía sus instrucciones» y las recortó bien.
- **Sin probar:** `npm install` en un computador limpio, `bajar_audio.sh` (descargar de Mixkit), `voces.sh` con Gemini de verdad, los pasos de guion y animación hechos por la skill (y no por el sistema original), un video completo de 10 capítulos con la skill, Windows, y otros idiomas distintos del inglés (el ritmo de la voz en español o portugués está sin medir).
- Si algo falla, cuéntalo en la comunidad para la siguiente versión.
