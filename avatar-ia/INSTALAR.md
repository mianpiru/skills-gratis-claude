# Instalar avatar-ia (sin abrir la Terminal)

Sueltas la carpeta, pegas un mensaje y Claude hace el resto. Te pide permiso antes de copiar o instalar cualquier cosa.

## Lo que necesitas antes
- Claude con plan de pago y **Claude Code** o la **pestaña Code de la app de escritorio de Claude**. Esta skill maneja tu navegador, corre scripts y guarda archivos en tu computador: no sirve en el chat normal de claude.ai ni en Cowork.
- El resto (Chrome con Claude in Chrome, ChatGPT Plus, ffmpeg) lo revisa Claude en el paso 3 del mensaje.

## Pasos
1. Descarga `avatar-ia-v1.0.0.zip` y descomprímelo con doble clic. Queda una carpeta `avatar-ia`, normalmente en **Descargas**.
2. Abre Claude Code o la pestaña Code de la app.
3. Si quieres, **arrastra la carpeta `avatar-ia` al chat** (así Claude sabe dónde está). Si no, déjala en Descargas: Claude la busca ahí.
4. **Pega este mensaje** y envíalo:

```
Instala la skill «avatar-ia» que acabo de descargar.
1. Busca la carpeta: si la arrastré a este chat, usa esa ruta; si no, búscala en mi carpeta de Descargas (una carpeta avatar-ia con un SKILL.md que diga «name: avatar-ia»). Si encuentras más de una, pregúntame cuál.
2. Cópiala completa a mi carpeta de skills: en Mac, ~/.claude/skills/avatar-ia/; en Windows, %USERPROFILE%\.claude\skills\avatar-ia\. Crea la carpeta skills si no existe. Si ya hay una avatar-ia instalada, muéstrame la versión instalada y la nueva (el título de SKILL.md) y pregúntame antes de reemplazarla. Reemplaza solo esa carpeta: no toques otras skills ni mi carpeta estudio/.
3. Lee referencias/requisitos.md de la skill y revisa, sin instalar nada, qué tengo ya: si Claude in Chrome está conectado, si hay sesión de ChatGPT en ese Chrome y si ffmpeg responde. Dime en una tabla qué está listo, qué falta y para qué sirve.
4. Si falta algo que se instala en el computador (ffmpeg), muéstrame el comando y pídeme permiso antes de correrlo. Lo que sea una cuenta o un pago (ChatGPT Plus) lo hago yo: solo dime dónde. Nunca me pidas que pegue una clave o una contraseña en el chat.
5. Al final, comprueba que ~/.claude/skills/avatar-ia/SKILL.md existe y dime cómo empezar.
```

5. Acepta los permisos que te pida Claude (copiar la carpeta y, si hace falta, instalar ffmpeg).
6. Escribe `/avatar-ia` o pide «crea un avatar de mujer de 30 años para mi marca». Claude Code detecta las skills nuevas sin reiniciar; si no aparece, escribe `/reload-skills` o abre una sesión nueva (code.claude.com/docs/en/skills, revisado el 2026-11-26).

**Windows:** la carpeta de skills es `%USERPROFILE%\.claude\skills\` (code.claude.com/docs/en/claude-directory, revisado el 2026-11-26). Los scripts de esta skill están probados en Mac; en Windows están `[sin probar]`.

## Usar
Abre Claude en la carpeta de tu proyecto (la de tu marca o tu cliente). Todo lo que crea queda en **`estudio/`** de esa carpeta, nunca dentro de la skill. El avatar aprobado queda en `estudio/modelos/` y lo usan las demás skills de la biblioteca.

## Actualizar
Cuando salga una versión nueva, haz lo mismo: descarga, descomprime y pega el mensaje. Claude te muestra las dos versiones y te pregunta antes de reemplazar. Tus trabajos no se tocan porque viven en `estudio/`. Por eso **no edites los archivos de la skill**: se pierden al actualizar. Lo que quieras que valga siempre para tu marca, díselo a Claude y queda en `estudio/brief.md` → «Reglas de mi marca».

## Versiones
- **v1.0.0 · 2026-11-26:** primera versión por separado. Es el resultado «Un avatar listo» de `estudio-ia` v2.0.0 (pasos 01-04 y 13), con el mismo método y la misma puerta 1. Nuevo: al aprobar, el README del modelo anota la fecha, para que las otras skills lo reconozcan.
