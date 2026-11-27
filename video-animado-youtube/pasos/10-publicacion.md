# Paso 10 · Texto de publicación y entrega (puerta 3)

**Objetivo:** dejar todo listo para subir y entregárselo al usuario. **La skill nunca sube nada a YouTube ni publica en ninguna red.**

## 1. Revisa el paquete
| Qué | Dónde | Revisión |
|---|---|---|
| Video | `salida/NN-tema.mp4` | duración, «Audio limpio» |
| Miniatura | `salida/miniatura.jpg` | pasó la revisión en chico |
| Título | `publicacion.json` → `titulo` | 60 caracteres o menos, el video lo paga, no repite el texto de la miniatura |
| Descripción | `publicacion.json` → `descripcion` | sin `{CAPITULOS}` suelto (ya con tiempos), con las fuentes, menos de 5.000 caracteres |
| Etiquetas | `publicacion.json` → `etiquetas` | 12 a 15, menos de 400 caracteres en total |

Escribe `salida/publicacion.txt` con título, descripción y etiquetas listos para copiar y pegar.

## 2. Muéstraselo (puerta 3)
Muestra la copia liviana (`salida/NN-tema-celular.mp4`), la miniatura y el texto. Pregunta con AskUserQuestion: **«¿Está listo para que lo subas?»** (Sí, está listo · Cambiar algo). Si pide un cambio de animación o de guion, corrige solo ese capítulo (voz nueva solo si cambió su texto), renderiza de nuevo y vuelve a mostrar.

## 3. Cómo se sube (lo hace el usuario)
Dale estos pasos; si pide ayuda, guíalo, pero el clic de subir y publicar es suyo:
1. YouTube Studio → **Crear → Subir videos** → `NN-tema.mp4`.
2. Pega título y descripción de `publicacion.txt`; sube `miniatura.jpg` (la miniatura propia pide la cuenta verificada, según la ayuda de YouTube revisada el 2026-11-26).
3. **Contenido alterado o sintético:** YouTube pide declararlo cuando el contenido parece real (por ejemplo, una persona real diciendo algo que no dijo). Según su ayuda (revisada el 2026-11-26), una animación claramente irreal hecha con IA no necesita declararse; la ayuda no habla de forma directa de la voz en off sintética: si dudas, revisa la página de YouTube ese día.
4. Pon las etiquetas, el público («no es para niños», salvo que lo sea) y las pantallas finales sobre los últimos 5 segundos.
5. Programa o publica.
6. **Ritmo:** en el canal original, con un canal nuevo y un video largo cada día, los últimos casi no se mostraron; YouTube Studio recomendó espaciar y se pasó a uno cada 3 días. Es la experiencia de un solo canal, no una regla de YouTube.
7. El video necesita aporte propio (guion, voz, animación) para no parecer contenido reutilizado: este sistema lo da, pero las reglas de monetización las decide YouTube.

## 4. Registro y limpieza
- Fila en `videos-animados/registro.md`: fecha, carpeta, título, estructura, duración, cuánto tardó cada paso, qué falló y qué quedó pendiente.
- Corrige `canal.md` → «Reglas de mi canal» con lo que el usuario haya pedido en este video.
- **Cuando el video ya esté publicado** (pregúntale), ofrécele liberar espacio: borrar `salida/*.mp4` salvo el final, `capMM/voz/voz-gemini.wav` y `proyecto/public/vNN-capMM/`. Lo que se borra no vuelve: para rehacer el video habría que generar las voces de nuevo (y la voz cambia un poco). Pide confirmación antes de borrar.
- `bash $SKILL/scripts/limpiar_remotion.sh`, y cierra Remotion Studio si quedó abierto.

## Listo cuando
- El usuario tiene el video, la miniatura y `publicacion.txt`, y dijo que está listo. Nada se subió por la skill.
