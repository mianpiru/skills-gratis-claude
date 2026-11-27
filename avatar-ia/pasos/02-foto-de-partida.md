# Paso 02 · Foto de partida

**Objetivo:** una selfie real e imperfecta por avatar, que sirva de base para editar en ChatGPT. El avatar sale de **editar una foto real**, no de describir a una persona desde cero (eso da cara de IA).

## 1. Buscar en Pinterest
En Chrome (`referencias/navegador.md` §2), abre `https://www.pinterest.com/search/pins/?q=<búsqueda>`. Ejemplos según el brief:
- «selfie mujer mexicana natural luz de ventana»
- «selfie hombre 35 años natural sin filtro»
- «selfie mujer 40 años sin maquillaje»
- «selfie chica deportiva gimnasio espejo» (estética deportiva)
- «selfie mujer elegante luz natural» (estética elegante)

Saca las URL de las miniaturas con el JavaScript de `navegador.md` §2, cámbialas a originales y bájalas:
```bash
bash $SKILL/scripts/bajar-pinterest.sh estudio/referencias/personas "ab/cd/ef/hash1.jpg,12/34/56/hash2.jpg,..."
```
El script descarta lo que no es JPEG y los tamaños típicos de imágenes de IA, guarda `origen.txt` y arma `estudio/referencias/personas-hoja.jpg`.

## 2. Elegir (lo hace Claude, sin preguntar)
Mira la hoja y elige **una foto distinta por avatar**. La foto tiene que cumplir las 4 condiciones:
- [ ] **De frente** (o casi), con la cara completa y visible.
- [ ] **Luz natural** (ventana, calle de día). Nada de luz dorada, bruma ni grano de película.
- [ ] **La edad y el estilo** del brief, y que encaje con el país del público.
- [ ] **No parece IA:** piel con poros, alguna imperfección, fondo real. Descarta la piel de plástico, lo «demasiado perfecto», fondos irreales y la marca ✦ de Gemini en una esquina.

Descarta también: fotos con logos grandes en la ropa, con otra persona en cuadro, con la cara tapada, de famosos o de personas reconocibles, y de menores de edad.

## 3. Guardar y mostrar
- Copia la elegida a `estudio/modelos/modelo-<n>/1-referencia.jpg` y anota su URL en `estudio/modelos/modelo-<n>/README.md`.
- Muéstrale al usuario la hoja de candidatas con la elegida marcada (solo como información; no se pide aprobación aquí).

## Listo cuando
- Hay una `1-referencia.jpg` por avatar, cada una cumple las 4 condiciones y tiene su URL anotada.
- El usuario vio la hoja.

## Si no aparece nada bueno
Cambia la búsqueda (otra edad, «natural», «sin filtro», «luz de ventana», el país en otra forma: «latina», «mexicana», «española») y repite. Si Pinterest pide iniciar sesión, pídele al usuario que inicie sesión él mismo en esa pestaña.
