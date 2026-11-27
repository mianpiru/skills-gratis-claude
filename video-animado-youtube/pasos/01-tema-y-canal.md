# Paso 1 · Tema, canal y carpeta de trabajo

**Objetivo:** saber para qué canal es el video, en qué idioma, de qué tema y con qué referencia, y dejar lista la carpeta `videos-animados/NN-tema/`.

## 1. El canal (una sola vez)
Si no existe `videos-animados/canal.md`, créalo con las respuestas del usuario:

```markdown
# Mi canal
- Nombre: (o «sin nombre aún»)
- Idioma del video: en | es | pt | …   (el guion, la voz, los textos en pantalla y la miniatura van en este idioma)
- Público: país o países, y qué le interesa
- Tema del canal: …
- Referencia: el canal que ya funciona y cuyo formato copiamos (por defecto, The Infographics Show)
- Voz aprobada: Gemini <voz> con este estilo: «…» (o «la mía», o «<servicio> con licencia»)
- Unidades: las del público (pies y millas para EE. UU.; metros para el resto)

## Reglas de mi canal
(se agregan aquí las correcciones del usuario, con la fecha)
```

**El formato se copia de un canal que ya funciona, no se inventa.** Si el usuario tiene su propio referente, pídele el enlace del canal y mira con WebSearch/WebFetch sus videos más vistos (títulos, duración, de qué tratan) antes de proponer temas. No descargues ni reproduzcas videos sin su permiso. Lo que se copia: el tipo de tema, la forma del título, el gancho, la duración, el ritmo y el estilo de miniatura. Lo que nunca se copia: sus textos, sus dibujos, su marca ni su voz.

## 2. El tema
Si el usuario no trae tema, propón **5** (o 10 si pidió «ideas de temas»), cada uno con:
- **Título** de 60 caracteres o menos, con un patrón que funciona en la referencia (ver abajo).
- **Gancho** en una frase: qué está en juego y qué se paga al final.
- **Referencia:** un video real de la referencia con un tema o patrón parecido, con su enlace y sus vistas (míralas hoy; si no puedes, escribe `[sin verificar]`).
- **Motivo visual** que se repetiría en todo el video (una regla de profundidad, un mapa con reloj, un contador).
- **Premisa verificada:** el dato central con una fuente. Si la premisa no se sostiene, el tema no va.

Patrones de título que más rinden en la referencia (medido en su canal; es una pista, no una garantía):
- **Con reloj:** «… Hour by Hour», «… Day by Day», «… Minute by Minute».
- **«What … Does to Your Body»** y **«What Happens If…»**.
- **El mito o la leyenda desmontada:** «What Really…», «… EXPLAINED».
- **«How [algo extremo] + nombre propio»** y **«What If…»** (escenario hipotético).

**Apto para anunciantes:** sin sexo, gore, crimen gráfico, drogas, política del momento, ni consejos médicos o financieros. Aunque en la referencia la muerte y el crimen dan muchas vistas, el canal original los dejó fuera. Sin personas reales vivas como personaje y sin marcas.

Muestra los temas y que elija con AskUserQuestion (hasta 4 opciones; «Otro» para pedir más).

## 3. La carpeta del video
- Número: el siguiente libre en `videos-animados/` (01, 02…). Carpeta `videos-animados/NN-slug/` (slug corto en minúsculas y con guiones).
- `video.json`:
  ```json
  {"numero": "01", "idioma": "en", "voz": "Charon", "estilo": "Narrator of a popular YouTube explainer channel. Confident, clear, fast-paced, building suspense, punchy emphasis on the numbers.", "modelo": null}
  ```
  El `estilo` va **corto** (máximo 40 palabras), en inglés aunque el video sea en otro idioma (así lo pide la guía de Google), diciendo además el acento si importa («Latin American Spanish, neutral accent»). Si el canal ya tiene voz aprobada, se copia de `canal.md`.
- Una fila nueva en `videos-animados/registro.md` (créalo si no existe: fecha, carpeta, título, estado, notas).

## Listo cuando
- `canal.md` existe, el tema está elegido por el usuario y `NN-tema/video.json` está escrito.
