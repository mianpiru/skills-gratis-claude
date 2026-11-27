# Paso 9 · Miniatura

**Objetivo:** `salida/miniatura.jpg` (3840×2160) con el formato que más clics da en la referencia, y `salida/miniatura-chica.jpg` (320 px) para comprobar que se entiende en el celular.

La ficha completa está en `referencias/estilo.md` §Miniatura. En el canal original, las primeras portadas (mascota del canal, texto de varias líneas a un lado, una ficha con cifra y flechas) no atraían clics; se cambiaron por este formato copiado de la referencia.

## 1. Revisa `miniatura` en `publicacion.json`
- `texto`: **un solo renglón de 1 a 4 palabras** (lo normal, 2 o 3), en mayúsculas, **sin cifras**. Es un veredicto o una reacción (`THEY HID IT`, `NO WAY BACK`, `WORSE THAN DEATH`), no el tema ni un dato. No repite palabras del título, y el video tiene que cumplirlo. En el idioma del video.
- `protagonista`: una persona de la historia por su papel (la piloto, el perforador, el ingeniero de la sala de control), **distinta en cada video**, con emoción fuerte (pánico, shock o llanto). Nunca una mascota ni la cara de una persona real.
- `amenaza`: **un solo objeto** del tema, en acción (se quema, se agrieta, explota, se hunde).
Si no cumple, corrígelo antes de pedir el arte.

## 2. El arte (sin texto)
**Opción A · Un generador de imágenes** que el usuario ya use (ChatGPT, Gemini u otro con licencia para uso comercial; **puerta 1** si consume un cupo pagado). Si tiene Claude in Chrome con sesión iniciada, Claude puede pedirlo ahí; si no, el usuario pega el pedido y guarda la imagen. Pedido (en el idioma del usuario; ejemplo en español):
> Ilustración 16:9 para miniatura de YouTube. VECTOR PLANO Y LIMPIO, como un video explicativo animado: formas simples con bordes nítidos, colores planos con degradados suaves, brillo de neón en los bordes, SIN trazos de tinta, SIN tramas ni sombreado de cómic. Colores vivos y luminosos. SIN NINGÚN TEXTO, letras ni números. Protagonista: <protagonista>, <edad y rasgos: mayor, joven, mujer, con barba, con gafas>, con la cara muy grande (la cabeza ocupa casi la mitad del alto del cuadro), ojos redondos muy abiertos, boca abierta, gotas de sudor, <pánico / shock / llanto>. A su lado o detrás, una sola amenaza: <amenaza>. Fondo: <un color dominante distinto al de las portadas anteriores>, que llena todo el cuadro hasta arriba. El protagonista y la amenaza van de la mitad del cuadro hacia abajo; en la cuarta parte de arriba solo hay fondo, un poco más oscuro, para poner texto después. Nada de marcas, logos, banderas ni personas reales.
- **El color de fondo cambia de un video a otro** (azul cielo, verde azulado, azul profundo, morado, rojo, amarillo): si todas salen iguales, parecen el mismo video.
- **Di la edad y los rasgos** del protagonista: los generadores tienden a repetir la misma cara joven.
- Si sale con trazos de cómic, oscura o con la cara chica, pídela otra vez; no la arregles con filtros.
- Mira las condiciones del generador sobre uso comercial de las imágenes `[verificar en su página]`.

**Opción B · Un cuadro del propio video** (gratis, sin generador): un momento fuerte con una persona en primer plano y la amenaza.
```bash
cd videos-animados/proyecto && npx remotion still VNN out/arte.png --frame=<n>
```

## 3. Armar la miniatura (texto exacto por código)
```bash
bash $SKILL/scripts/miniatura.sh videos-animados/NN-tema <ruta del arte>
```
Si el texto tapa la cara, acomoda el arte con el tercer argumento: `'{"zoom":1.1,"dy":50}'` (también `dx`, `ancho`, `tamMax`, `y`, `color`).

## 4. Mirarla en chico
Mira `salida/miniatura-chica.jpg` con Read: **se lee el texto, se entiende la cara y se ve una sola amenaza**. Si la cara salió chica, tranquila o tapada, pide el arte otra vez. Nada de ficha de cifra, flechas ni un segundo texto. Muéstrasela al usuario.

## Listo cuando
- `miniatura.jpg` y `miniatura-chica.jpg` existen y pasan la revisión en chico.
