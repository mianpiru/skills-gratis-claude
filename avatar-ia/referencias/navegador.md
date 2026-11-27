# Manejar Pinterest y ChatGPT con Claude in Chrome

Se usa la extensión **Claude in Chrome** (herramientas `mcp__claude-in-chrome__*`), que trabaja en el Chrome del usuario con **sus** sesiones de ChatGPT y Pinterest. Claude nunca escribe contraseñas: si una página pide iniciar sesión, el usuario lo hace él mismo en esa pestaña.

Las interfaces cambian seguido. Lo de aquí es una guía: **antes de hacer clic por coordenadas, toma una captura**, y prefiere `find` (buscar un botón por su nombre) a las coordenadas. Los nombres pueden estar en español o en inglés según el idioma de la cuenta.

## 0. Activar Claude in Chrome (antes de pedir nada)
1. Si las herramientas del navegador están diferidas, cárgalas todas en una sola llamada de ToolSearch:
   `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__find,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__file_upload,mcp__claude-in-chrome__list_connected_browsers,mcp__claude-in-chrome__select_browser,mcp__claude-in-chrome__browser_batch`
2. Llama `tabs_context_mcp` (o `list_connected_browsers`). Si responde, está activo.
3. **Si no está conectado**, pídele al usuario que lo active y espera su «listo»:
   - que abra Google Chrome con la extensión **Claude** instalada y la sesión iniciada con su cuenta de Claude;
   - en **Claude Code** en la terminal: escribir `/chrome` (o arrancar con `claude --chrome`) y elegir activarlo;
   - en la **app de escritorio de Claude**: activar Claude in Chrome en los conectores o la configuración del chat.
4. **Si hay varios Chrome conectados**, pregúntale una vez cuál tiene la sesión de ChatGPT, y anótalo en `estudio/brief.md` → «Navegador». Antes de cada lote, `select_browser` con ese y `tabs_context_mcp` dentro del lote (la extensión a veces cambia de navegador sola).
5. **Trabaja en pestañas nuevas** (`tabs_create_mcp`); no toques las pestañas que el usuario tiene abiertas.

## 1. Comprobar la sesión
Abre `chatgpt.com`. Si pide iniciar sesión, pídele al usuario que inicie sesión en esa pestaña y espera.

## 2. Pinterest (fotos reales de partida)
1. Navega a `https://www.pinterest.com/search/pins/?q=<búsqueda>` (la búsqueda con `+` en lugar de espacios).
2. Saca las miniaturas con `javascript_tool`:
   ```js
   await new Promise(r=>setTimeout(r,2500)); [...document.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('pinimg.com/236x/')).slice(0,40).map(s=>s.split('/236x/')[1]).join(',')
   ```
3. Baja los originales y arma la hoja: `bash $SKILL/scripts/bajar-pinterest.sh estudio/referencias/<tema> "<lista que devolvió el paso 2>"`.
4. Mira la hoja y elige (`pasos/02-foto-de-partida.md`). Si se necesitan más, haz scroll y repite el paso 2.

## 3. ChatGPT (imágenes)
1. Pestaña nueva en `chatgpt.com` (un chat nuevo por avatar y por escena; el mismo chat para avatar → ropa → sesión).
2. **Subir imágenes:** `find` «Adjuntar» / «Attach» / «Añadir fotos y archivos» (es un input de archivo) → `file_upload` con las rutas locales. Varias imágenes se suben juntas y ChatGPT las numera en el orden de subida (imagen 1, 2, 3). Máximo ~10 MB por llamada.
3. **Escribir el prompt:** `find` el cuadro «Pregunta lo que quieras» / «Ask anything» → clic → escribir → Enter.
4. **Esperar:** las imágenes tardan ~60-120 s. Espera con `wait` de 10 s y revisa con una captura.
5. Si ofrece **dos opciones** («¿Qué imagen prefieres?»), elige la mejor (la que cumple las reglas) y sigue con esa.
6. **Guardar la imagen:**
   - **Mac:** pasa el mouse por la imagen, `find` «Copiar imagen» / «Copy image», clic, y luego `bash $SKILL/scripts/guardar.sh <ruta.png>`. Muestra el tamaño y el md5; si el md5 se repite con el de la imagen anterior, no se copió la nueva: repite.
   - **Windows o si no hay botón de copiar:** abre la imagen, `find` «Descargar» / «Download», y mueve el archivo de la carpeta de descargas a su ruta en `estudio/`.
   - No escribas en el portapapeles con JavaScript (se cuelga).
7. **Mira cada imagen guardada** con la herramienta de leer archivos antes de seguir (revisión con zoom).
8. Si una imagen se bloquea sin razón clara, reintenta en un chat nuevo. ChatGPT tiene un tope de imágenes por día según el plan: si se llega, dilo y propón seguir más tarde.

## 4. Varias piezas a la vez en ChatGPT (avatares o escenas)
Una **pestaña por pieza** (cada una un chat nuevo): sube y envía todos los prompts en un solo `browser_batch`, espera una vez (~90-120 s) y luego guarda de a una (el portapapeles es uno solo): `hover` sobre la imagen → «Copiar imagen» → `guardar.sh`. En un chat con varias imágenes, la última es la nueva.

## 5. Google Imágenes (lugares del país)
Busca «apartamento <ciudad>», «cocina apartamento <ciudad>», «calle <barrio> <ciudad>» y saca las URL originales:
```js
const h=document.documentElement.innerHTML; [...new Set([...h.matchAll(/https?:\/\/[^"'\\\s]+?\.(?:jpg|jpeg|png|webp)/gi)].map(x=>x[0]))].filter(u=>!u.includes('gstatic')&&!u.includes('google')).slice(0,16).join('\n')
```
Prefiere portales inmobiliarios y medios locales. Guarda la URL de cada referencia en el README de la carpeta.

## 6. Lo que nunca se hace en el navegador
- Escribir contraseñas, códigos o datos de pago; aceptar términos o permisos por el usuario.
- Comprar créditos, cambiar de plan o activar pruebas.
- Publicar o enviar mensajes sin permiso explícito para esa acción.
- Resolver captchas: si aparece uno, el usuario lo resuelve.
