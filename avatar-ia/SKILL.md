---
name: avatar-ia
description: Crea un avatar con IA que no se reconoce, a partir de una foto real editada en ChatGPT, y su sesión de fotos de estudio de 6 ángulos. Busca la foto de partida en Pinterest, cambia la cara con cambios concretos, compara con la original difuminada y pide aprobación antes de seguir. El avatar queda en estudio/modelos/ para que lo usen las demás skills de la biblioteca (imágenes, videos, landing). Úsala cuando el usuario diga "crea un avatar", "hazme una modelo", "una persona que no existe", "un avatar para mi marca", "una persona creada con IA", "sesión de fotos del avatar", "/avatar-ia", o cuando otra skill pida un avatar y no haya uno aprobado.
---

# Avatar IA · v1.0.0 (2026-11-26)

**Un resultado: un avatar listo.** Una persona creada con IA a partir de una foto real editada, que no se parece a la original, con su sesión de fotos de estudio de 6 ángulos. Pregunta lo mínimo, trabaja de corrido y solo se detiene en la puerta 1.

Antes de empezar, lee completas `referencias/reglas.md` (mandan sobre todo lo de aquí) y `referencias/navegador.md`. Si es la primera vez del usuario o falta una herramienta, revisa `referencias/requisitos.md`.

**Dónde vive el trabajo:** en `estudio/` dentro de la carpeta del proyecto en la que trabaja el usuario (la carpeta actual). **Nunca** escribas dentro de la carpeta de la skill. Si `estudio/` ya existe, léelo primero: puede haber avatares aprobados, un brief o reglas de la marca. Las demás skills de la biblioteca usan la misma carpeta: lo que hagas aquí lo reutilizan ellas.

```
estudio/
  brief.md            respuestas del usuario y «Reglas de mi marca» (crece con sus correcciones)
  README.md           qué se entregó, archivos, imágenes gastadas y qué se descartó
  referencias/        fotos reales de partida y outfits (Pinterest) y sus URL
  modelos/modelo-<n>/ 1-referencia.jpg, 2-avatar.png, 2-comparacion.jpg, 3-outfit.jpg, 4-avatar-ropa.png,
                      5-sesion.png, README.md (fuentes, prompts y fecha de aprobación)
  producto/           la prenda real, si el usuario vende ropa
```

`$SKILL` = la carpeta de esta skill (normalmente `~/.claude/skills/avatar-ia`).

## 1. Preguntas cortas (solo lo que no puedas deducir)
Si la primera frase ya lo dice («crea un avatar de hombre mexicano de 30 años»), no lo preguntes. Lo demás, con **AskUserQuestion** (hasta 4 preguntas por llamada, opciones de un clic). Detalle y plantilla del brief en `pasos/01-brief.md`.

| Pregunta | Opciones |
|---|---|
| ¿Mujer u hombre? | Mujer · Hombre |
| ¿Qué edad? | 18-25 · 25-35 · 35-45 · 45+ |
| ¿Qué estética? | Natural · Elegante · Deportiva · Urbana |
| ¿Cuántos avatares? | 1 · 2 · 3 |
| ¿Para qué país es tu público? | Las que encajen con lo que dijo; «Otro» para escribirlo (define ojos, piel y lugares) |
| ¿Qué vendes? | Un producto · Una marca o servicio · Ropa · Aún no tengo |

Si vende ropa, pídele la foto real de la prenda: el avatar la usa en la sesión. Si AskUserQuestion no está disponible, haz las mismas preguntas en texto, numeradas, en un solo mensaje.

## 2. Ruta de pasos
Cada paso está en `pasos/` con su objetivo, los prompts exactos y cuándo está listo. Los números son los de toda la biblioteca: por eso faltan algunos.

**01 brief → 02 foto de partida → 03 avatar (puerta 1) → 04 ropa y sesión de estudio → 13 entrega**

Si en `estudio/modelos/` ya hay un avatar aprobado que encaja con lo que pide, dilo en una línea y pregunta si quiere otro distinto o usar ese.

## 3. La única parada: puerta 1 · Avatar distinto a la persona original
Entre el brief y la puerta, **trabaja de corrido**: no preguntes «¿sigo?». Pero **muéstrale cada pieza clave apenas esté lista** (la hoja de fotos de partida con la elegida, el avatar, la sesión), con un pie de una línea. Para mostrarla, usa la herramienta de enviar archivos al usuario si la tienes; si no, da la ruta completa y ábrela con `open <ruta>` en Mac.

1. Mira las dos imágenes (la original y el avatar) y compáralas rasgo por rasgo (`pasos/03-avatar.md` §2).
2. Si se parecen, en el **mismo chat** de ChatGPT pide: «Haz mucho más marcados los cambios del rostro: la forma de la cara, la nariz y los labios.» Hasta **3 veces**. Si a la tercera se sigue pareciendo, vuelve a 02 con otra foto.
3. Arma la comparación con la original **difuminada**: `bash $SKILL/scripts/comparar.sh <original> <avatar> estudio/modelos/modelo-<n>/2-comparacion.jpg`. Muéstrala.
4. Pregunta con AskUserQuestion: **«¿Apruebas este avatar? Es distinto a la persona original»** (Sí, lo apruebo · Cámbialo más · Usa otra foto de partida). **Sin aprobación no sigues.**

**Puerta 3 · Antes de cualquier gasto o publicación.** Pide permiso explícito antes de pagar o activar una herramienta, publicar, crear cuentas o gastar más imágenes de las que el plan de ChatGPT permite en el día. Nunca publiques ni subas nada por tu cuenta.

## 4. Durante el trabajo
- **Navegador:** Pinterest y ChatGPT se manejan con Claude in Chrome. Comprueba que está conectado **antes** de las preguntas (`referencias/navegador.md` §0). Solo una tarea usa el navegador a la vez.
- **Varios avatares:** una pestaña y un chat nuevo por avatar, enviados juntos (`navegador.md` §4); las comparaciones se muestran juntas en una sola pregunta.
- **Revisión con zoom** de cada imagen: manos o dedos de más, la cara de la persona original que vuelve, tatuajes de la foto, logos o letras en la ropa.
- **Si el usuario corrige algo** de su gusto o de su marca («sin flequillo», «más natural»), aplícalo y anótalo en `estudio/brief.md` → «Reglas de mi marca», con la fecha.
- **Si ChatGPT bloquea** un pedido: no uses las frases prohibidas (`reglas.md` 2); reintenta en un chat nuevo o pide los cambios por partes.
- **Si la interfaz de ChatGPT o Pinterest cambió:** toma una captura, ubica el botón con `find` y sigue; dile al usuario en una línea qué cambió.
- **Datos de plataformas** (precios, topes, planes) tienen fecha. Si el usuario va a pagar algo, que lo confirme en la página oficial ese día.

## 5. Entrega
`pasos/13-publicar.md`: `estudio/README.md` al día, la sesión mostrada y la nota de que el avatar es un presentador, no un cliente. Después ofrece en una línea lo que sigue con las otras skills de la biblioteca (imágenes para anuncios, un video UGC, un anuncio de cine o un video con voz en off).

## Lo que está sin probar
El método se usó en los casos del curso, pero esta skill, con el navegador de punta a punta, **no se ha probado con todos los casos**. El guardado de imágenes en Windows (`guardar.sh`) está `[sin probar]`. Si algo falla, cuéntalo en la comunidad para la siguiente versión.

## Archivos de la skill
- `pasos/01-brief.md`, `02-foto-de-partida.md`, `03-avatar.md`, `04-sesion-de-fotos.md`, `13-publicar.md`.
- `referencias/reglas.md` (las reglas que aplican, con su número), `referencias/navegador.md`, `referencias/requisitos.md`.
- `scripts/`: `bajar-pinterest.sh` (fotos de partida y hoja), `hoja.sh` (hoja de contacto), `comparar.sh` (puerta 1), `guardar.sh` (portapapeles → PNG).
- `INSTALAR.md`: cómo instalarla y actualizarla sin abrir la Terminal.
