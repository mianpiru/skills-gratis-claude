# Estilo: Plano Pop, el ritmo de la referencia y la miniatura

## 1. La referencia
**The Infographics Show** (YouTube): explicativos animados en vector plano 2D, narrados en off, sin cara, de 7 a 18 minutos. Lo que se midió de su canal (hojas de contacto de sus videos y listas de títulos con vistas, noviembre de 2026):
- **Entra sin saludo.** La primera frase ya es un dato fuerte, una escena en presente o una pregunta. Cuatro formas de abrir: escena con el espectador adentro, el final primero y luego «así empezó», un dato que da contexto, una pregunta cotidiana.
- **Bloques de 1 a 2 minutos**, cada uno con un subtema y un cambio de decorado. Los «minuto a minuto» usan la hora como columna vertebral.
- **Cierre fijo:** pregunta para comentar, otro video recomendado y «like, comparte y suscríbete».
- **Narración rapidísima:** unas 205 palabras por minuto en sus videos. El canal original, con la voz de Gemini, rondó 175-190.
- **Cambio de composición cada 3–5 s**; dentro de cada composición algo nuevo cada 0,5–1,5 s; nunca una imagen quieta más de 2–3 s; la cámara casi nunca está quieta (acercamientos lentos, paneos, revelaciones).
- **Texto en pantalla solo para el dato clave** (cifra, hora, lugar, nombre), con entrada animada (letra a letra, en arco, con rebote) y sombra.
- **Fondos vivos** en 3 capas (estrellas, nubes, rejillas que ondulan) y un color de fondo por sección: cambiar el color es cambiar de tema.
- **Volumen:** objetos en dos tonos, brillos, sombras proyectadas, degradados en esferas.
- **Personajes** con cara, pelo, lentes, ropa con textura, que parpadean, hablan y señalan; manos que entran con un objeto (libro, carpeta, lupa) reutilizadas muchas veces.
- **Elementos reutilizados** en muchos videos (galaxias, explosión de manchas con núcleo blanco, humo, check y X, pin): se diseñan una vez y se usan siempre. Por eso existe la biblioteca.

Si el usuario elige otra referencia, se mide lo mismo de ella (títulos con vistas, apertura, ritmo de cortes, texto, miniaturas) y se anota en `canal.md`.

## 2. Plano Pop (el estilo de la plantilla)
- **Lienzo** 1920×1080, 30 fps. Todo es SVG dibujado con código: sin fotos, sin imágenes externas, sin emojis, sin logos.
- **Paleta** (`C` en `kit.tsx`): azul noche `#1B1443` de fondo, morado `#5B3FA8`, lila `#9C84E6`, turquesa `#7FE0D0`, rojo naranja `#E5482F`, naranja `#F2823A`, amarillo `#FFC93C`, crema `#FFF4DC`. Colores saturados, sin degradados fotográficos.
- **Letra:** Montserrat Black (900) en mayúsculas, con sombra dura; se carga de Google Fonts al renderizar (hace falta internet).
- **Personajes:** cabeza grande, formas simples, `PersonaViva` (parpadea, respira, habla, hace gestos). Cada persona con su aspecto propio.
- **Volumen en todo:** cada objeto en dos tonos (luz y sombra), sombra en el suelo, brillo en esferas.
- **Movimiento:** cada cifra, lugar o concepto entra en la palabra exacta del narrador; la cámara recorre un escenario grande; transiciones variadas; un efecto de sonido por aparición importante.
- **Motivo visual que se repite** en todo el video (una regla de profundidad, un mapa con reloj, un contador): da continuidad y hace sentir el avance.
- **Música:** dos camas rítmicas (curiosa y tensión) por tramos según el tono del capítulo, bajitas (volumen 0,11 en `Completo.tsx`) y constantes.

## 3. Miniatura (ficha de la referencia)
Se midieron 95 portadas de la referencia el 2026-11-25 (las 40 más vistas y las 25 menos vistas de sus últimos 300 videos largos, y las 30 más vistas de su historia). En ese canal el tema pesa mucho en las vistas, así que la comparación es una pista, no una prueba.

**La idea:** una escena de drama que se entiende en menos de un segundo, en este orden:
1. **Una cara:** una persona de la historia, grande, con pánico, llanto o shock.
2. **La amenaza:** un solo objeto que dice de qué va el video, en acción.
3. **Un veredicto:** de 1 a 4 palabras arriba que dicen qué tan grave es, sin decir qué pasó.

| Medida | Las 40 más vistas recientes |
|---|---|
| Palabras del texto | 2,5 de media (de 1 a 4) |
| Renglones | 1 |
| Alto de la letra | 16 % del alto del cuadro (12–21 %) |
| Ancho del texto | 84 % del ancho (59–96 %) |
| Posición | centrado, en el 20 % de arriba |
| Con cifras | 8 % (1 de cada 12) |
| Color del texto | blanco con sombra oscura (38 de 40) |
| Con cara grande y expresiva | 70 % (contadas a ojo) |

**Reglas que no se tocan:**
1. Un solo texto: un renglón blanco, arriba y centrado, de 1 a 4 palabras, sin cifras.
2. El texto es un veredicto que no repite el título y que el video cumple. Tipos que se repiten: alguien ocultó algo (`THEY HID IT`), ya empezó o se acabó (`IT'S OVER`), qué tan grave (`NO ESCAPE`), reacción (`YOU HAVE NO IDEA`). Escribe frases propias con la misma función.
3. Un protagonista de la historia con la cara grande y emoción fuerte, distinto en cada video. Nunca una mascota.
4. Una sola amenaza u objeto del tema, en acción.
5. Vector plano y limpio, con un color de fondo distinto al de las portadas anteriores; lo cálido (fuego, amarillo, rojo) solo en el foco.
6. Nada más: sin ficha de cifra, sin flechas, sin segundo texto, sin logo.
7. Se revisa en chico (320 px): se lee el texto y se entiende la cara.

**Qué la rompe:** una cifra en el texto (responde en vez de preguntar), el mismo personaje en todas, varios bloques de texto, una escena sin cara o con la cara chiquita, una cara tranquila o sonriente.

## 4. Títulos que rinden en la referencia
- 4 a 10 palabras, 60 caracteres o menos, sin puntos suspensivos ni «you won't believe». El tema entero cabe en el título.
- Con reloj («Hour by Hour», «Day by Day»), «What … Does to Your Body», «What Happens If…», «What Really…», «… EXPLAINED», «How [algo extremo] + nombre propio», «What If…».
- El título nombra el tema; la miniatura dice qué tan grave es. Juntos dejan una pregunta que solo responde el video.
