# Paso 03 · Avatar (con la puerta 1)

**Objetivo:** convertir la foto de partida en una persona que **no se reconozca**, con cambios concretos de cara y pelo, ojos naturales para el país y sin tatuajes que identifiquen. Termina con la aprobación del usuario.

Todo en **un solo chat** de ChatGPT por avatar (modo normal de chat, no de agente), para que no pierda la cara entre pasos. Cómo subir, enviar y guardar: `referencias/navegador.md` §3.

## 1. Primera edición (ya con cambios de estructura)
Sube `1-referencia.jpg` y envía este prompt, cambiando lo que va entre paréntesis según el brief:
```
Edita esta foto con estos cambios:
1) Cambia el corte de cabello a (melena por encima de los hombros, en capas, con ondas naturales).
2) Cambia el color de ojos a (café miel claro), natural.
3) Cejas (un poco más pobladas y definidas).
4) Agrega (un lunar pequeño en la mejilla izquierda).
5) Haz la cara (más ovalada), la nariz (más fina y recta) y los labios (más delgados).
6) (Agrega gafas de montura delgada / agrega una barba corta / quita el bigote.)
7) (Quita el tatuaje del antebrazo.)
Conserva todo lo demás igual: encuadre, luz, fondo, ropa y la textura real de la piel, sin retoque ni suavizado. Que siga pareciendo una selfie real de iPhone. Formato vertical 9:16.
```
Cómo elegir cada línea:
- **Pelo:** cambia algo visible del original: largo, corte, color o reflejos, liso u ondulado, flequillo sí o no.
- **Ojos:** según el país (`pasos/01-brief.md` §4). En Latinoamérica, café oscuro, café claro, miel, avellana o ámbar; claros solo si la persona es rubia.
- **Detalle único:** un lunar, pecas, aretes pequeños, gafas de otra montura.
- **Estructura (línea 5):** siempre va. Con solo pelo, ojos y cejas, la persona real se sigue reconociendo.
- **Rasgo grande (línea 6):** en hombres, poner o quitar barba o bigote y gafas; en todos, si el fondo de la foto es reconocible (su casa, un lugar famoso), cambiarlo por otro del país.
- **Tatuajes (línea 7):** si la foto tiene, se quitan o se cambian por otros distintos («cambia el tatuaje del brazo por uno pequeño de líneas finas de una flor»). Un tatuaje identifica tanto como una cara.

**No escribas** «reemplaza a la mujer», «crea una mujer ficticia», «que sea otra persona» ni «ajusta la nariz y los labios para que sea otra persona»: ChatGPT los bloquea. Pide cambios concretos, uno por uno.

Guarda el resultado como `estudio/modelos/modelo-<n>/2-avatar.png` (`navegador.md` §3: «Copiar imagen» + `guardar.sh`).

Si un cambio no se nota, en el mismo chat:
```
Sobre esta última imagen: haz (el color de ojos) claramente (avellana), que se note. Lo demás igual.
```

## 2. Comparar (Claude mira las dos imágenes)
Abre las dos imágenes con la herramienta de leer archivos y compáralas rasgo por rasgo:

| Rasgo | ¿Cambió de forma visible? |
|---|---|
| Forma de la cara (ancho, mandíbula, mentón, pómulos) | |
| Nariz (ancho, puente, punta) | |
| Labios (grosor, forma) | |
| Cejas y ojos (forma, color) | |
| Pelo (corte, largo, color, línea del nacimiento) | |
| Marcas únicas (lunares, cicatrices, tatuajes, piercings) | |
| Accesorios y fondo | |

Si alguien que conoce a la persona real podría reconocerla, **se parece**. En ese caso, en el mismo chat:
```
Haz mucho más marcados los cambios del rostro: la forma de la cara, la nariz y los labios.
```
Guarda cada intento (`2-avatar-v2.png`, `2-avatar-v3.png`) y vuelve a comparar. **Máximo 3 veces.** Si a la tercera se sigue pareciendo, vuelve al paso 02 con otra foto de partida (la siguiente mejor de la hoja).

Si ChatGPT bloquea: reintenta el mismo prompt en un chat nuevo con la última imagen buena; si sigue, pide primero solo los cambios de la cara y después los demás.

## 3. Revisión con zoom
- [ ] La piel tiene textura (poros), no parece de plástico.
- [ ] Los ojos se ven naturales: color creíble, los dos miran al mismo lado.
- [ ] No quedan tatuajes de la foto original.
- [ ] Ni logos ni letras en la ropa (si hay, pídele quitarlos).
- [ ] Si salen manos, tienen cinco dedos.

## 4. Puerta 1
1. Arma la comparación con la original difuminada:
   ```bash
   bash $SKILL/scripts/comparar.sh estudio/modelos/modelo-<n>/1-referencia.jpg estudio/modelos/modelo-<n>/2-avatar.png estudio/modelos/modelo-<n>/2-comparacion.jpg
   ```
2. Muéstrasela al usuario con un pie de una línea con lo que cambió («cara más ovalada, nariz más fina, melena con ondas, ojos miel, sin el tatuaje del brazo»).
3. Pregunta con AskUserQuestion: **«¿Apruebas este avatar? Es distinto a la persona original»**
   - **Sí, lo apruebo** → anota en `modelo-<n>/README.md` la línea «Aprobado en la puerta 1 el (fecha)» y sigue al paso 04. Esa línea es la que buscan las demás skills de la biblioteca para reutilizar el avatar.
   - **Cámbialo más** → pregunta qué (o aplica otra ronda de «mucho más marcados») y vuelve a mostrar.
   - **Usa otra foto de partida** → vuelve al paso 02.

Con varios avatares, haz las ediciones en paralelo (una pestaña por avatar) y muestra las comparaciones juntas en una sola pregunta.

## Listo cuando
- El usuario aprobó el avatar explícitamente.
- En `modelo-<n>/` están `1-referencia.jpg`, `2-avatar.png` (la versión aprobada), `2-comparacion.jpg` y el `README.md` con la URL de la foto, los prompts usados y la fecha de aprobación.
