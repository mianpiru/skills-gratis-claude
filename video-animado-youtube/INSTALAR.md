# Instalar «Video animado para YouTube»

## La forma fácil: suelta la carpeta y pega este mensaje
1. Descarga la carpeta `video-animado-youtube` completa y descomprímela si viene en .zip.
2. Abre **Claude Code** (o la app de escritorio de Claude con Claude Code) en cualquier carpeta.
3. Arrastra la carpeta `video-animado-youtube` a la ventana de Claude (o escribe su ruta) y pega este mensaje:

```
Instala la skill que te acabo de pasar (la carpeta video-animado-youtube):
1. Cópiala entera a ~/.claude/skills/video-animado-youtube/ (en Windows, C:\Users\<mi usuario>\.claude\skills\video-animado-youtube\). Si ya existe una versión, dime cuál tengo y cuál es la nueva antes de reemplazarla.
2. Lee su referencias/requisitos.md y revisa qué tengo instalado: node -v, ffmpeg -version, python3 -c "import whisper", y si tengo la clave de Gemini guardada (sin mostrarme la clave).
3. Dime en una lista corta qué tengo y qué me falta, con lo que cuesta cada cosa según ese archivo.
4. No instales nada ni pagues nada todavía: pídeme permiso antes de cada instalación.
5. Al terminar, dime que reinicie la app (o abra una sesión nueva) y que escriba /video-animado-youtube.
```

Claude copia la skill, revisa lo que tienes y te pide permiso antes de instalar cualquier cosa. La clave de Gemini **nunca** se pega en el chat: Claude te dice cómo guardarla en un archivo (`referencias/requisitos.md` §4).

## A mano (si prefieres)
1. Copia la carpeta en tu carpeta de skills:
   - **Mac:** `mkdir -p ~/.claude/skills && cp -R video-animado-youtube ~/.claude/skills/` (la carpeta `.claude` está oculta: en el Finder, `Cmd + Shift + .` la muestra).
   - **Windows:** `C:\Users\<tu usuario>\.claude\skills\`.
2. Instala lo que falte según `referencias/requisitos.md` (Node, ffmpeg, Whisper y la clave de Gemini).
3. **Reinicia la app de Claude** (o abre una sesión nueva de Claude Code).
4. Comprueba: escribe `/video-animado-youtube` y debería empezar con «¿Qué quieres?».

## Primera vez: preparar tu canal
Abre Claude en la carpeta de tu canal (una carpeta vacía sirve) y escribe **«/video-animado-youtube, prepara mi canal»**. La skill copia el proyecto de Remotion, te pide permiso para instalarlo (`npm install`) y para bajar la música y los efectos de Mixkit, y renderiza una imagen de prueba para comprobar que todo funciona en tu computador.

## Actualizar
Reemplaza la carpeta de la skill por la nueva y reinicia la app. Tus videos no se tocan: viven en `videos-animados/` de tu carpeta, nunca dentro de la skill. Si quieres que algo valga siempre para tu canal («la voz más lenta», «nada de calaveras»), díselo a Claude: lo anota en `videos-animados/canal.md`. No edites los archivos de la skill: se pierden al actualizar.
