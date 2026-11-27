# Paso 01 · Brief

**Objetivo:** saber qué avatar quiere el usuario con el mínimo de preguntas y dejarlo escrito en `estudio/brief.md`.

## 1. Antes de preguntar
1. ¿Existe `estudio/` en la carpeta actual? Si sí, lee `brief.md`, `README.md` y lo que haya en `modelos/`. Si hay un avatar aprobado que encaja con el pedido, dilo en una línea y pregunta si quiere otro distinto o usar ese.
2. Si no existe, créalo con sus carpetas (estructura en `SKILL.md`).
3. **Si `estudio/brief.md` ya existe** (lo pudo crear otra skill de la biblioteca), no lo reescribas: agrega lo que falte y conserva «Reglas de mi marca».
4. Comprueba que Claude in Chrome está conectado (`referencias/navegador.md` §0). Si no, pídele al usuario que lo active **ahora**, antes de las preguntas, para no frenar después.

## 2. Deducir de la primera frase
Lo que ya está dicho no se pregunta. Ejemplos:

| Frase del usuario | Se deduce |
|---|---|
| «hazme una modelo de 30 años para mi marca de ropa deportiva» | mujer; 25-35; estética deportiva; vende = ropa |
| «crea un avatar de hombre mexicano» | hombre; país = México |
| «dos avatares, mujer y hombre, elegantes, para España» | 2 avatares; estética elegante; país = España |
| «/avatar-ia» | nada: se pregunta todo |

## 3. Las preguntas (AskUserQuestion)
Máximo 4 preguntas por llamada; opciones cortas; la herramienta añade «Otro» sola.

**Llamada A** (las que falten): ¿Mujer u hombre? · ¿Qué edad? (18-25 · 25-35 · 35-45 · 45+) · ¿Qué estética? (Natural · Elegante · Deportiva · Urbana) · ¿Cuántos avatares? (1 · 2 · 3).

**Llamada B** (las que falten):
- **¿Para qué país es tu público?** Ofrece 3-4 países que encajen con lo que ya sabes del usuario (su idioma, lo que dijo); «Otro» para escribirlo. Si es «Latinoamérica en general» o varios países, usa lugares neutros y tonos de ojos café.
- **¿Qué vendes?** Un producto · Una marca o servicio · Ropa · Aún no tengo.

**Si vende ropa** (en texto, una sola vez): la **foto real de la prenda** (ruta del archivo o que la suelte en el chat). Va a `estudio/producto/` y el avatar la usa en la sesión (paso 04).

## 4. Qué define el país
El país del público fija tres cosas:
- **Fotos de partida:** se buscan personas de ese país («selfie mujer mexicana natural», «selfie hombre español 35 años»). El tono de piel lo da la foto real de partida; no se pide cambiar la piel.
- **Ojos:** en Latinoamérica, tonos café (café oscuro, café claro, miel, avellana, ámbar). Verdes, grises o azules solo si la persona es rubia. En España y otros países, natural según la foto de partida.
- **Lugares:** si el fondo de la foto es reconocible, se cambia por uno de ese país. Las escenas que hagan después otras skills también se verán de ese país.

## 5. Plantilla de `estudio/brief.md`
Es la misma para toda la biblioteca. Llena lo que pide este resultado y deja el resto vacío: lo completan las otras skills si el usuario las usa.
```markdown
# Brief
- **Resultado pedido:** (avatar | imágenes | UGC hablado | anuncio sin voz | video con voz en off | landing | reel | propuesta | agente)
- **Persona en pantalla:** (mujer/hombre), (edad), estética (…), (n) avatares
- **País del público:** (…) → ojos (…), lugares (…)
- **Qué vende:** (producto / marca / servicio / ropa / demo con marca inventada)
- **Marca:** (nombre) · paleta: (2-3 colores)
- **Foto real del producto:** estudio/producto/(…)
- **CTA:** «(…)»
- **Formato:** (no es real | la receta | reacción | directo)
- **Primer segundo:** (qué cara y qué emoción) + caja de texto «(…)» + voz desde el segundo 0
- **Claims permitidos (lista cerrada):** 1) … 2) …
- **Lo que NO se dice:** promesas de resultados que no estén arriba; testimonios del avatar como si fuera cliente real
- **Piezas a entregar:** (…)
- **Navegador:** (perfil de Chrome con la sesión de ChatGPT, si hay varios)

## Reglas de mi marca
(Se añaden aquí las correcciones del usuario, con fecha: «(fecha): nada de flequillo»)
```

## Listo cuando
- `estudio/brief.md` tiene persona, edad, estética, país y cantidad (y la prenda, si vende ropa).
- Claude in Chrome responde.
- Se hicieron como máximo 2 llamadas de preguntas y ninguna repitió algo que el usuario ya había dicho.
