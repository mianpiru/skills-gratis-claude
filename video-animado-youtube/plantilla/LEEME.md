# Proyecto de Remotion para explicativos animados (Plano Pop)

La skill `video-animado-youtube` copia esta carpeta a `videos-animados/proyecto/` la primera vez. No se edita dentro de la skill.

```
src/
  index.ts · Root.tsx            registro de composiciones (no hace falta tocarlo)
  estilos/base.tsx               Montaje de un capítulo: escenas ancladas a palabras, voz y efectos
  planopop/kit.tsx               paleta C, texto T, Persona, Lienzo, pop/suave/sale (base del estilo)
  planopop/biblioteca/           ~300 piezas reutilizables · INDICE.md (una línea por pieza) · CATALOGO.md (props y ejemplo)
  planopop/Completo.tsx          molde del video completo: une los capítulos y pone la música por tramos
  planopop/videos.tsx            lista de videos (la llena scripts/armar_video.py)
  planopop/Miniatura.tsx         still MiniaturaTop (arte sin texto + un renglón blanco arriba)
  planopop/ejemplo/CapEjemplo.tsx  modelo de capítulo (cámara que recorre, textos en capa fija)
  planopop/*Demo.tsx             BibliotecaDemo, FondosRicosDemo, EfectosRicosDemo: muestras sin voz para probar la instalación
public/
  sfx/ · musica/                 vacías: las llena scripts/bajar_audio.sh (licencia de Mixkit, cada usuario las baja)
  miniaturas/                    los artes de las miniaturas
  vNN-capMM/                     voz.wav y palabras.json de cada capítulo (las copia scripts/voces.sh)
```

Comandos:
```bash
npm install                                   # una vez
npm run dev                                   # Remotion Studio, para ver los videos en el navegador
npx tsc --noEmit                              # revisar tipos
npx remotion still BibliotecaDemo out/prueba.png --frame=130 --scale=0.5   # prueba de que renderiza
```
Versiones: Remotion 4.0.539, React 19.2.3, TypeScript 5.9.3 (las mismas del canal original). `remotion.config.ts` deja 2 hilos de render para no ahogar computadores de 16-18 GB.
