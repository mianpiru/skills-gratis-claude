# Reglas: lo que se aprendió produciendo un canal real

Mandan sobre todo lo demás de la skill. Salen de producir un canal de explicativos animados en inglés con este mismo sistema (del 2026-11-15 al 2026-11-26: pruebas de estilo y 7 videos largos de unos 9 minutos, 6 ya publicados y 1 programado). Cada regla dice **el error que pasó** y **la regla que quedó**. Las reglas del canal de cada usuario van en `videos-animados/canal.md` → «Reglas de mi canal», no aquí.

## Tema y datos
1. **El formato se copia de un canal que ya funciona.** Error: inventar el formato. Regla: tema, título, gancho, duración, ritmo y miniatura salen de la referencia; lo que se cambia es el tema y la ejecución propia.
2. **Cada tema se apoya en un video real de la referencia** con buenas vistas y en una premisa verificada con fuente. Si la premisa no se sostiene, el tema se descarta.
3. **Una cifra estimada se dice como estimación, y el título no promete lo que no se puede probar.** Error: un título que decía «todos los misiles» cuando solo existía una estimación de entre 800 y 4.000. Regla: lo dudoso no va en pantalla, «an estimated…», y se cambia el título si hace falta.
4. **Buscar datos gasta mucho uso de Claude** (~190 mil tokens en un video). Regla: tope de páginas, o un asistente de investigación profunda que el usuario ya pague, y no se vuelve a comprobar todo dos veces.

## Guion
5. **Los primeros 30 segundos cumplen el título.** Error: dos videos abrían lejos del título (uno con una erupción de hace 640.000 años, otro que no nombraba los «11 días» hasta el segundo 15) y la gente se iba antes de los 25 segundos, según YouTube Studio. Regla: primera frase de 15 palabras o menos con las palabras del título; promesa, apuesta y bucle antes de la palabra 90; la primera imagen es la de la miniatura.
6. **El gancho se revisa primero.** Si es flojo, el guion vuelve aunque lo demás esté bien.
7. **Historia antes que datos.** Error: un guion contado como lista de datos («datos, datos, datos… puede ser aburrido»). Regla: un protagonista humano por capítulo, en escena; máximo 3 cifras por capítulo, cada una atada a una consecuencia.
8. **No se narra lo obvio.** Cada frase da contexto, lo que está en juego, un giro o un chiste; la imagen muestra lo que la voz no puede.
9. **Todo video cierra con una pregunta concreta para los comentarios, like y suscripción**, y 5 s de aire para las pantallas finales.
10. **El pago es real.** El bucle que se abre en el gancho se paga con un dato de `datos.md`, nunca inventado.

## Voz
11. **Gemini lee en voz alta sus instrucciones.** Pasó en español con un estilo largo (leyó las instrucciones y repitió el guion) y varias veces en inglés (un capítulo lo hizo en 3 tomas seguidas). Regla: estilo corto (máximo 40 palabras), formato de «notas del director», y siempre se revisa con Whisper la primera línea de lo que oyó antes de seguir.
12. **No quemar cupo en las voces.** Regla: si leyó sus notas antes del guion, se recorta ese tramo (lo hace `tiempos_voz.py`) en vez de pedir otra toma; máximo 2 tomas por capítulo; después se corrige el texto a mano.
13. **Gemini a veces se salta una frase.** Regla: el aviso `FRASE SALTADA` de `tiempos_voz.py`; esa sí pide otra toma.
14. **No se cambia el texto de una voz que ya salió bien**: cambiarlo obliga a pagarla otra vez. Los nombres difíciles se escriben como se pronuncian desde la primera versión del guion; frases cortas, sin nombres raros pegados.
15. **La voz cambia un poco de un pedido a otro** (tono mediano de 117 a 132 Hz entre capítulos con ajustes idénticos). Regla: un pedido por capítulo; para un tramo suelto, 2-3 tomas y se usa la de tono más parecido al capítulo vecino.
16. **Golpe seco al cambiar de capítulo.** Error: Gemini empezó a mandar el audio con su propia cabecera WAV pegada, que sonaba como un golpe; otra vez fue una «S» justo en el límite; otra, un efecto cortado en seco. Regla: el script quita la cabecera y abre la voz en 10 ms, los efectos se apagan en sus últimos 6 fotogramas, y `revisar_audio.py` tiene que decir «Audio limpio» antes de entregar.
17. **Una voz natural, nunca de robot.** Las voces gratuitas tipo lector de pantalla se rechazaron incluso como provisionales. Si se cambia la voz del canal, primero una muestra de ~15 s.

## Animación
18. **Nada básico.** Error: un video donde «todo se ve muy básico»: el mismo «escena normal → acercamiento» en cada escena, la misma transición siempre, fondos de un color, humo y explosiones planas. Regla: cámara que recorre la escena siguiendo la narración (rayos X, recorrido, lupa que aumenta), transiciones variadas, fondos con capas, efectos con volumen (`pasos/06-animacion.md` §4).
19. **Ningún texto se sale ni se recorta.** Error: el zoom de la cámara cortaba los textos. Regla: los textos van en una capa fija que la cámara no mueve, con 90 px de margen.
20. **Recorrer, no reiniciar.** Error: 4 tarjetas en fila, cada una con su escena y su zoom. Regla: plano general y la cámara se desliza de una a otra en la palabra de cada una.
21. **Ningún fondo deja un marco** en el plano más abierto.
22. **El objeto protagonista, completo y detallado**, no una silueta; si hace falta, a partir de una imagen de referencia recreada en vectores.
23. **Personajes distintos y bien hechos.** Error: el pelo en picos, un ojo en primer plano sin detalle y un casco de lado en una cara de frente. Regla: pelo con volumen, ojos con iris, pupila, brillo y párpados, accesorios orientados según la cara; cada persona con su aspecto. Se revisa en un still.
24. **Sonidos variados.** Error: el mismo «pop» 83 veces y el mismo «whoosh» 46 en un solo video. Regla: un mismo archivo máximo 3 veces por capítulo, y el sonido corresponde a lo que pasa.
25. **Algo nuevo cada 0,5–1,5 s** dentro de la escena y una escena nueva cada 3–6 s. Error: 4,5–6 s seguidos sin cambio visible.
26. **Continuidad entre capítulos.** Error: un contador que retrocedía de un capítulo a otro, por una regla mal dada (día = horas/24 hacia abajo, cuando la narración contaba desde el día 1). Regla: lo que une los capítulos vive en `piezas.tsx`, con una sola lógica.
27. **Errores típicos que se buscan en las hojas:** cuadros vacíos con un icono chico, textos pegados al borde, texto espejado, cosas encimadas, cifras que no coinciden con `datos.md`, cabezas cortadas por la cámara.
28. **Todo determinista** (`random("semilla")`), sin `Math.random()`.

## Música
29. **Claude no oye: la música no se elige por el título.** Error: una pista elegida por su nombre que no iba con el video («lenta y triste»). Regla: el usuario escucha las candidatas, o un modelo que sí oye audio las compara con la referencia. Camas rítmicas que cambian con el tono de cada tramo.
30. **Música siempre bajita y a volumen constante**, sin bajarla cuando habla la voz.
31. **Solo audio con licencia comercial** (la plantilla usa Mixkit), con la licencia anotada. Nunca canciones comerciales.

## Miniatura y publicación
32. **La miniatura copia el formato de la referencia.** Error: portadas con la mascota del canal, varias líneas de texto, una ficha con cifra y flechas, que no atraían clics. Regla: un renglón blanco arriba de 1 a 4 palabras sin cifras, un protagonista distinto en cada video con la cara grande y en pánico, una sola amenaza, fondo de otro color cada vez (`referencias/estilo.md`).
33. **La skill nunca sube ni publica.** El usuario sube desde YouTube Studio.
34. **Ritmo de publicación:** en un canal nuevo, un largo cada día hizo que los últimos casi no se mostraran; YouTube Studio recomendó espaciar (se pasó a uno cada 3 días). Es la experiencia de un canal, no una regla general.
35. **Shorts sacados del largo:** se probaron 4 por video para llevar gente al largo y se pararon a los 6 días porque, para el dueño del canal, no estaban funcionando y sumaban trabajo. Los enlaces en la descripción de un Short no se pueden pulsar; el enlace que funciona es «Video relacionado» en Studio (ayuda de YouTube, revisada el 2026-11-20). Esta skill no hace Shorts.

## Computador y consumo
36. **Un trabajo pesado a la vez.** Error: 7 procesos de voces, Whisper y renders al mismo tiempo dejaron sin memoria un Mac de 18 GB y hubo que reiniciarlo a la fuerza. Regla: renders, Whisper, ffmpeg largos y stills en fila; `--concurrency=2` por defecto; los scripts esperan si ven otro corriendo.
37. **Las copias temporales de Remotion llenan el disco** (~1,2 GB por render o still con muchos archivos en `public/`; 28 GB en media hora de pruebas). Regla: `limpiar_remotion.sh` al final de cada render, y avisar si quedan menos de 40 GB libres.
38. **El límite de uso de Claude se agota con agentes que leen todo.** Error: 11 animadores que leían ~100 mil tokens cada uno antes de escribir, y correcciones que retomaban a los mismos agentes, agotaron el límite de 5 horas a mitad del video. Regla: lectura mínima, índice corto de la biblioteca, 5 agentes de 2 capítulos con el mismo encargo palabra por palabra, correcciones con un agente nuevo y solo su archivo; lo mecánico en scripts, sin modelo.
39. **Nunca se borra ni se pisa algo entregado** sin confirmación; las limpiezas solo de lo ya publicado.
40. **Datos de plataformas con fecha.** Precios, cupos, modelos de voz y reglas de YouTube cambian: se miran en la página oficial antes de afirmarlos o de pagar.
