# Paso 7 · Borrador y revisión con hojas de contacto

**Objetivo:** ver el video entero antes del render final, encontrar las fallas con el segundo exacto y corregirlas. Máximo **dos rondas** de corrección.

Claude no ve videos: ve imágenes. Por eso la revisión es con **hojas de contacto** (una cuadrícula de cuadros del video) y stills sueltos. No se dice que algo «se ve bien» sin haberlo mirado.

## 1. Borrador (trabajo pesado, en segundo plano)
```bash
bash $SKILL/scripts/render.sh videos-animados/NN-tema borrador
```
Deja `NN-tema/salida/borrador.mp4` (media resolución) y una hoja por capítulo en `salida/hojas/capMM.jpg`: un cuadro cada 1,5 s, 6 por fila (cada fila son 9 s del capítulo; el cuadro k de la hoja es el segundo 1,5 × k del capítulo). Si el computador es lento o tiene poca memoria, el render de 9 minutos puede tardar bastante; no lances otro trabajo pesado mientras tanto.

## 2. Mirar las 10 hojas
Mira cada hoja con Read (o encárgaselo a un subagente que solo mire las hojas, sin sacar cuadros extra) y anota **solo fallas concretas, con el capítulo y el segundo aproximado**:
- texto cortado, fuera del cuadro o pegado al borde;
- cosas encimadas o tapadas;
- cuadros vacíos o con un icono chico en el centro; un fondo que deja ver un marco;
- una imagen quieta más de 3 s (3 cuadros seguidos iguales);
- texto ilegible o muy chico; texto al revés o espejado;
- cifras que no coinciden con `datos.md`; contadores que retroceden entre capítulos;
- personas con pelo en picos, ojos sin detalle o accesorios de lado; cabezas cortadas por la cámara;
- capítulos que no se parecen entre sí (otra paleta, otra letra);
- en el capítulo 1: que el primer cuadro muestre lo de la miniatura y que el plano cambie cada 3-4 s.

Mira tú mismo 2 o 3 hojas para comprobar el reporte si lo hizo un subagente. Para ver un momento de cerca: `npx remotion still VNNCapMM out/x.png --frame=<segundo × 30> --scale=0.5`.

Muéstrale al usuario las hojas de los capítulos 1 y 2 (lo que más pesa en la retención) con una línea de lo que vas a corregir.

## 3. Corregir
- Las correcciones van **capítulo por capítulo, con la lista de fallas y su segundo**. Si usas subagentes: **uno nuevo**, en esfuerzo medio, con solo el nombre de su `CapMM.tsx`, su sección de la escaleta y la lista. Puede llevar varios capítulos chicos a la vez. **Nunca retomes al que hizo el capítulo**: arrastra todo lo que ya leyó y cada paso lo vuelve a gastar.
- Se corrige solo lo que falla, con ediciones puntuales; lo que estaba bien no se toca.
- Para comprobar, **no repitas el borrador entero**: renderiza solo esos capítulos, de a uno, y saca su hoja:
  ```bash
  cd videos-animados/proyecto
  npx remotion render VNNCapMM out/capMM.mp4 --scale=0.5 --crf=26 --concurrency=2 --log=error
  bash $SKILL/scripts/hoja.sh out/capMM.mp4
  ```
- Máximo dos rondas. Lo que quede, anótalo en `registro.md` y díselo al usuario.
- Al terminar: `bash $SKILL/scripts/limpiar_remotion.sh` y borra `out/*.mp4` de las pruebas.

## Listo cuando
- Las hojas no muestran fallas de la lista (o las que quedan están anotadas y el usuario las conoce).
