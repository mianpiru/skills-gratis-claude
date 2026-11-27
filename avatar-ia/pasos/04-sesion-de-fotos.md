# Paso 04 · Ropa y sesión de fotos de estudio

**Objetivo:** vestir al avatar con un outfit real de su edad y estilo, y hacerle una sesión de estudio de 6 ángulos que fija su cara para todo lo que sigue (escenas, storyboard, video).

Se hace en el **mismo chat** del paso 03.

## 1. Outfit
- **Si el usuario vende ropa:** la prenda es la suya (foto real en `estudio/producto/`).
- **Si no:** busca en Pinterest un outfit real de la **edad y la estética** del brief, sin logos ni letras, con luz natural. Ejemplos: «outfit casual mujer 30 años», «outfit elegante mujer 40 años», «outfit deportivo hombre 25 años», «outfit urbano hombre 30 años». Bájalo con `bajar-pinterest.sh` a `estudio/referencias/outfits` y elige uno. Guárdalo como `modelo-<n>/3-outfit.jpg` con su URL en el README.

Sube el outfit al mismo chat y envía:
```
Imagen 1: la mujer de la última imagen. Imagen 2: un outfit de referencia. Cámbiale solo la ropa a la mujer por un outfit como el de la imagen 2 (mismas prendas, colores y estilo), sin logos ni letras. No cambies nada de su cara, su pelo, sus ojos, sus cejas, (el lunar) ni la pose. Misma luz, mismo fondo y la textura real de la piel. Que siga pareciendo una selfie real de iPhone. Formato vertical 9:16.
```
(Para hombre: «el hombre de la última imagen», «cámbiale solo la ropa al hombre».) Guarda como `modelo-<n>/4-avatar-ropa.png`.

## 2. Sesión de estudio (6 ángulos)
En el mismo chat:
```
Crea una sesión de fotos de esta misma mujer de la última imagen, sin cambiar nada de su cara, su pelo, sus ojos, sus cejas ni (el lunar). Que salga solo ella, de pie, sobre un fondo blanco liso de estudio, con el mismo outfit de la última imagen, sin logos. Una sola imagen tipo hoja de contacto con 6 fotos desde varios ángulos y zoom: 1) de frente cuerpo entero, 2) de frente plano medio, 3) primer plano del rostro de frente, 4) tres cuartos hacia la izquierda plano medio, 5) tres cuartos hacia la derecha plano medio, 6) de perfil primer plano. Luz natural suave, piel real con poros, sin retoque, como fotos reales de cámara.
```
Guarda como `modelo-<n>/5-sesion.png` y **muéstrasela al usuario** apenas esté.

## 3. Personaje secundario (solo si el guion lo pide)
Mascota, pareja o hijo: foto real de Pinterest y su propia sesión en un chat aparte:
```
Crea una sesión de fotos de este mismo perro (raza), sin cambiar nada: mismo color, mismas manchas y su distribución, mismas orejas, misma cara, mismo tamaño y el mismo collar. Que salga solo él, sobre un fondo blanco liso de estudio. Una sola imagen tipo hoja de contacto con 6 fotos desde varios ángulos y zoom: 1) de lado cuerpo entero de pie, 2) de frente sentado, 3) primer plano de la cara de frente, 4) acostado, 5) tres cuartos mirando hacia arriba, 6) de espaldas caminando. Luz natural suave, pelo real, como fotos reales de cámara, sin look de IA.
```
Si el personaje secundario es una persona, pasa por los pasos 02 y 03 completos (también debe ser irreconocible) y quítale los tatuajes.

## Revisión con zoom
- [ ] Las 6 fotos son la misma persona del avatar aprobado (misma cara, pelo, lunar).
- [ ] Ninguna recupera rasgos de la persona original.
- [ ] Sin logos ni letras en la ropa.
- [ ] Manos con cinco dedos; ninguna mano de más.
Si una foto falla, en el mismo chat: «La foto (n) cambió (la cara / el pelo). Rehaz la hoja con la misma cara de la última imagen, sin cambiar nada más.»

## Listo cuando
- `5-sesion.png` existe, pasó la revisión y el usuario la vio.
- Si el resultado pedido era **«un avatar listo»**, se pasa a `13-publicar.md` (entrega). Si no, se sigue con la ruta del resultado.
