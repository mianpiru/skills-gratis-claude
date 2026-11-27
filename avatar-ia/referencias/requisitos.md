# Qué necesitas para usar avatar-ia

Los precios y los planes tienen la fecha en que se revisaron en la página oficial. Cambian seguido: **antes de pagar algo, míralo en su página ese día.**

## 1. Lo que pide esta skill
| Qué | Para qué | Nota |
|---|---|---|
| **Claude con plan de pago** (Pro o superior) | Es quien hace todo el trabajo | Pro incluye Claude Code y Claude in Chrome: 20 USD/mes, o 17 USD/mes pagando el año (claude.com/pricing, revisado el 2026-11-26, sin impuestos) |
| **Claude Code** (terminal) **o la pestaña Code de la app de escritorio de Claude** | Corre la skill y los scripts, y maneja el navegador | La skill está probada en Mac |
| **Google Chrome + la extensión Claude in Chrome** | Claude busca en Pinterest y maneja ChatGPT | Instálala desde la Chrome Web Store, inicia sesión con tu cuenta de Claude y actívala (`/chrome` en Claude Code, o en los conectores de la app) |
| **ChatGPT Plus** (o un plan con generación de imágenes) | Edita la foto de partida y hace la sesión | 20 USD/mes (learn.chatgpt.com/docs/pricing, revisado el 2026-11-13). Inicia sesión en chatgpt.com en ese Chrome. Cada plan tiene un tope de imágenes |
| **ffmpeg** | Arma la hoja de fotos y la comparación difuminada de la puerta 1 | §2 |

## 2. ffmpeg (se instala una vez)
**No tienes que abrir la Terminal:** pídele a Claude «revisa si tengo ffmpeg y, si no, instálalo». Claude te muestra el comando y te pide permiso antes de correrlo.

Lo que hace Claude en Mac:
```bash
ffmpeg -version || brew install ffmpeg
```
Si no tienes Homebrew, Claude te muestra el comando oficial de brew.sh y te pide permiso antes. En Windows: `winget install ffmpeg` `[sin probar en Windows]`.

## 3. Antes de la primera sesión (lista rápida)
- [ ] Chrome abierto, con la extensión Claude activa.
- [ ] Sesión iniciada en chatgpt.com en ese Chrome.
- [ ] `ffmpeg -version` responde.
- [ ] La skill instalada en `~/.claude/skills/avatar-ia` (ver `INSTALAR.md`).
