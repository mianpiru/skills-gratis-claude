# Paso 3 · Guion por capítulos, escaleta y publicación

**Objetivo:** el guion en 10 capítulos (`cap01/voz/texto.txt` … `cap10/voz/texto.txt`), la `escaleta.md` para la animación y `publicacion.md` + `publicacion.json`. Todo en el idioma del video. Termina en la **puerta 2**.

Lee antes: `datos.md` (solo confianza alta o media), `canal.md` (reglas del canal) y `referencias/reglas.md` §Guion.

## 1. El gancho manda (se escribe primero y se revisa primero)
Si el gancho es flojo, lo demás no importa. Reglas de los primeros 30 segundos (salieron de la recomendación de YouTube Studio en el canal original: en los dos videos que abrían lejos del título, la gente se iba antes de los 25 segundos):
- **La primera frase confirma el clic:** 15 palabras o menos, lleva las palabras clave del título y dice su promesa en presente. «Tomorrow morning, Yellowstone erupts. Here's what happens, day by day.» El contexto, la fecha o los antecedentes van después, nunca antes.
- **Antes de la palabra 90 (unos 30 s)** ya se oyó: la promesa del título, qué está en juego y el bucle que se paga al final.
- **Ritmo ágil en todo el capítulo 1:** frases de 12 palabras o menos. Nada de saludo, «hola», «en este video» ni índice de lo que viene (una sola frase de «lo que viene», no tres).
- **La primera imagen es la de la miniatura:** en la escaleta, la primera escena del capítulo 1 muestra al protagonista y la amenaza de la miniatura, ya en movimiento.

## 2. Dos estructuras (elige una por video y no las mezcles)
**`historia`** (cuenta una historia en orden):
1. La primera frase es el hecho más fuerte o una escena en presente, con el espectador adentro.
2. Bucle abierto desde el gancho: una promesa que solo se paga cerca del final. El pago es real y está en los datos.
3. Se cuenta en orden: por qué empezó, cómo lo hicieron, el primer logro, lo que salió mal, lo que encontraron, el límite. Cada capítulo cierra con una frase que empuja al siguiente.
4. El capítulo 9 paga el bucle y separa los hechos de los mitos.

**`ted`** (adaptada de la charla TED de Jenny Hoyos sobre contar historias en menos de un minuto, estirada a nueve):
1. Empieza con una pregunta impactante, con las palabras del título. El dato o la fecha van en la segunda frase.
2. Avance constante hacia la respuesta: cada capítulo deja al espectador un paso más cerca y se lo hace sentir (la profundidad que sube, el reloj que corre).
3. Conflicto antes de la respuesta: cada capítulo del medio trae un obstáculo real de `datos.md`.
4. Una segunda incógnita (la «trama B»): se abre en los capítulos 2 o 3 y se cierra en el 7 u 8.
5. Antes de responder, la respuesta se vuelve incierta («¿Se equivocó el libro? ¿O el taladro?»).
6. La respuesta, rápida: una o dos frases, sin rodeos, y el video se acaba pronto después.

Si el usuario quiere probar cuál le funciona mejor, alterna: un video de cada una, y que compare en YouTube Studio después de una o dos semanas. Anota la estructura en `publicacion.json` y en `registro.md`.

## 3. Historia antes que datos (en las dos)
Un guion contado como lista de datos aburre (fue la queja más fuerte en el canal original).
- Cada capítulo tiene un **protagonista humano** (piloto, ingeniera, perforador) que quiere algo y algo se lo impide, contado en escena («Sullivan looks down and sees six contrails rising»), no en resumen.
- **Máximo 3 cifras por capítulo**, y cada cifra atada a una consecuencia («hot enough to bake bread on the wing»).
- **No narres lo obvio:** la imagen va a mostrar escala, mapas y mecanismos; la voz da contexto, lo que está en juego, el giro o el chiste.
- Si un capítulo se puede leer como una ficha técnica, se reescribe.

## 4. Largo y forma
| Capítulo | Qué es | Palabras (inglés) |
|---|---|---|
| cap01 | El gancho | 140–160 |
| cap02 a cap08 | Un subtema por capítulo, con cambio claro de decorado. Cada uno termina empujando al siguiente | 175–195 cada uno |
| cap09 | Vuelve inciertas las respuestas, paga la pregunta en 1-2 frases y separa hechos de mitos | 175–195 |
| cap10 | El cierre: una pregunta concreta del tema para los comentarios y la invitación a dar like y suscribirse | 25–35 |

- Total en inglés: **1.650 a 1.800 palabras ≈ 8:30 a 9:30** (medido con la voz Charon de Gemini: ~2,9 palabras por segundo). **En otro idioma** el ritmo cambia `[sin medir en español ni en portugués]`: genera primero la voz del capítulo 1, mira las palabras por segundo que imprime `tiempos_voz.py` y ajusta el largo de los demás (palabras = segundos que quieres × palabras por segundo).
- Texto plano en párrafos: **un párrafo = una idea = una o dos escenas**. Sin títulos, acotaciones ni emojis.
- **Cifras escritas como se leen** («forty thousand two hundred thirty feet», «cuarenta mil pies»): la voz las lee mejor y Whisper las alinea.
- **Nombres difíciles escritos como se pronuncian desde la primera versión** («Case Oh», «SR-seventy-one»): cambiar el texto de una voz que ya salió bien obliga a pagarla otra vez.
- Frases cortas y voz activa. Sin guiones largos ni nombres raros pegados.
- Cada afirmación sale de `datos.md`. Si falta un dato, no lo inventes: `[FALTA: …]` y dilo.
- Cuenta las palabras de cada capítulo: `python3 $SKILL/scripts/indices.py NN-tema/capMM/voz/texto.txt`.

## 5. Escaleta y publicación
**`escaleta.md`** (para la animación):
- **El motivo visual que se repite** en todo el video, descrito con precisión (en el video del pozo más profundo: el corte del suelo con un contador de profundidad; en el del avión espía: un altímetro con las trayectorias de los misiles que se quedan cortas).
- **Las piezas propias** que hacen falta (objetos, lugares, máquinas, personajes por rol) y el **objeto protagonista** con su detalle.
- **Por capítulo** (`### cap01`, `### cap02`…): título corto, de qué va, qué se ve en cada párrafo (escala, comparación, mecanismo, mapa, cronología) y el tono de la música: `curiosa` o `tension`.
- Una línea al inicio: `Tono por capítulo: tension en …; para armar_video.py: --tension 1,5,6`.
- Reglas de honestidad para la animación (por ejemplo: «ningún contador muestra una cifra exacta que es estimación»).

**`publicacion.md`**: arriba, en una línea cada una: la estructura, la pregunta o promesa del video, la primera frase y dónde se paga (capítulo y frase). Luego: 3 primeras frases posibles con la elegida y el porqué; la línea **«Primeros 30 s»** (las primeras 90 palabras del capítulo 1, con las palabras del título que aparecen en la primera frase entre asteriscos); el título elegido (60 caracteres o menos) con el porqué y 5 alternativas; 3 opciones de miniatura con la elegida (`pasos/09-miniatura.md`); la descripción; las etiquetas.

**`publicacion.json`**:
```json
{"estructura": "historia", "titulo": "...", "descripcion": "...\n\n{CAPITULOS}\n\nMain sources:\n- ...",
 "etiquetas": ["..."], "miniatura": {"texto": "NO WAY BACK", "protagonista": "quién es y qué cara tiene",
 "amenaza": "el objeto del tema y qué le está pasando", "dibujo": "la escena completa en una frase"},
 "capitulos": ["Título del capítulo 1", "..."]}
```
- En la descripción, la línea `{CAPITULOS}` sola: los tiempos reales se ponen después del render (`capitulos_yt.py`). Cierra con las fuentes principales de `datos.md` (en inglés, «Main sources:»; en español, «Fuentes principales:»).
- 9 títulos de capítulo (el cierre va dentro del último). Etiquetas: 12 a 15, menos de 400 caracteres en total.
- El título nombra el tema y el texto de la miniatura dice qué tan grave es: juntos dejan una pregunta que solo responde el video. El video tiene que pagar los dos de verdad.

## 6. Revisión y puerta 2
Revisa tú, en este orden, y devuelve al guion lo que falle (una sola ronda):
1. **El gancho:** primera frase de ≤15 palabras con las palabras del título; promesa, apuesta y bucle antes de la palabra 90; sin saludo.
2. La estructura se sigue de principio a fin y el capítulo 9 paga de verdad.
3. No narra lo obvio; cada capítulo tiene protagonista y máximo 3 cifras.
4. Cada dato está en `datos.md` con confianza alta o media; ningún `[FALTA]`.
5. Largo total y por capítulo; el cierre pide comentario, like y suscripción.
6. Título de 60 caracteres o menos que el video paga; apto para anunciantes.

**Puerta 2.** Muestra título, miniatura propuesta, las 3 primeras frases, el guion completo y las palabras por capítulo. Si la voz es nueva para el canal, genera antes una **muestra de ~15 s** con el primer párrafo (`pasos/04-voz.md` §2) para que la oiga. Pregunta con AskUserQuestion: **«¿Apruebas el guion y la voz?»** (Aprobar y generar las voces · Cambiar el gancho · Cambiar otra cosa). Sin aprobación no se generan las voces.

## Listo cuando
- 10 `texto.txt`, `escaleta.md`, `publicacion.md` y `publicacion.json` escritos, revisados y aprobados en la puerta 2.
