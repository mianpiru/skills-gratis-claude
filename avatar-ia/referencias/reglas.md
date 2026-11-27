# Reglas de realismo, calidad y cumplimiento

Mandan sobre todo lo demás de la skill. Salen de producir creativos reales con este método (2026-10 y 2026-11). Son las mismas en toda la biblioteca y conservan su número; aquí están solo las que usa esta skill, por eso faltan números. Las reglas de la marca de cada usuario van en `estudio/brief.md` → «Reglas de mi marca», no aquí.

## Avatar
1. **El avatar sale de editar una foto real**, no de describir a una persona desde cero: una selfie real e imperfecta de Pinterest, editada en ChatGPT con cambios concretos. Describirla desde cero da cara de IA.
2. **Cambios concretos, nunca frases que ChatGPT bloquea.** No se escribe «reemplaza a la mujer» (para crear el avatar), «mujer ficticia», «que sea otra persona» ni «ajusta la nariz y los labios para que sea otra persona». Se piden cambios uno por uno: corte de pelo, color de ojos, cejas, lunar, forma de la cara, nariz, labios.
3. **Nunca debe reconocerse a la persona real.** La primera edición ya cambia la forma de la cara, la nariz y los labios, más uno o dos rasgos grandes (barba o bigote, gafas de otra montura, otro fondo si el de la foto es reconocible). Con solo pelo, ojos y cejas, la persona se sigue reconociendo.
4. **Puerta 1:** Claude compara la original y el avatar; si se parecen, pide «Haz mucho más marcados los cambios del rostro: la forma de la cara, la nariz y los labios» en el mismo chat, hasta 3 veces. Luego muestra la original difuminada junto al avatar y el usuario aprueba. Sin aprobación no se sigue.
5. **Tatuajes:** los de la foto de partida se quitan o se cambian por otros distintos (identifican a la persona). También los de los personajes secundarios que vienen de fotos reales.
6. **Ojos naturales para el país del público.** En Latinoamérica, tonos café (café oscuro, café claro, miel, avellana, ámbar); verdes, grises o azules solo si la persona es rubia. En otros países, natural según la foto de partida.
7. **Ropa:** un outfit real de Pinterest de la edad y la estética del personaje, sin logos ni letras. Si el usuario vende ropa, se usa su prenda.
8. **Nada de logos ni marcas de terceros** en ropa, lugares, productos ni fondos.
9. **Sesión de estudio de 6 ángulos** en el mismo chat del avatar: fija la cara para todo lo demás. Todas las escenas parten de ella.
10. Nada de menores de edad, famosos ni personas reconocibles como foto de partida.

## Revisión
33. **Errores típicos que se buscan con zoom:** manos o dedos de más, etiqueta del producto deformada, la cara de la persona original que vuelve a salir, otra persona o animal que aparece, dos productos, texto inventado, logos.
34. **Cada foto fija también** (estáticos, escenas, sesión) se revisa con zoom antes de entregarla.

## Cumplimiento
38. **Un avatar no da testimonios.** Es presentador o personaje: muestra, explica y demuestra, pero no dice que el producto le funcionó ni cuenta una experiencia de uso como si fuera una persona real.
39. **Los claims salen de la lista que da el usuario.** Sin lista, no hay afirmaciones de resultados. Nada de curas, garantías, promesas de ingresos ni escasez falsa.
40. Sin personajes de médico ni de autoridad de salud hechos con IA.
41. **Etiqueta de contenido con IA activada** al publicar en Meta, Instagram o TikTok.
42. Se respetan las leyes de publicidad y de datos personales del país del público (en Colombia, por ejemplo, la Ley 1480 de protección al consumidor y la Ley 1581 de datos personales).

## Forma de trabajar
43. **De corrido entre puertas:** no se pregunta «¿sigo?» tras cada pieza; se para solo en las puertas o ante una decisión que solo el usuario puede tomar.
44. **Mostrar cada imagen clave apenas está lista:** foto de partida, avatar, sesión de estudio, escenas, storyboard.
45. **Nunca borrar ni pisar algo entregado:** las versiones nuevas van a `-v2/`.
46. **Producir para el presupuesto:** antes de un lote, se cuentan las imágenes (o los créditos) y las piezas que el usuario va a usar de verdad.
47. **Nunca publicar, subir, enviar ni gastar** sin permiso explícito del usuario.
48. **El navegador lo usa una tarea a la vez.** Lo que no usa el navegador y es solo texto se puede repartir en paralelo. Los trabajos pesados, no (regla 50).
49. **Las correcciones del usuario** sobre su marca se guardan en `estudio/brief.md` → «Reglas de mi marca» y se aplican desde ese momento.
50. **Un trabajo pesado a la vez.** Renders, Whisper y ffmpeg largos nunca corren en paralelo (ni en agentes distintos): pueden dejar sin memoria el computador. Al terminar se cierra lo que quede abierto y se borran los borradores que ya no sirven.
