# Biblioteca Plano Pop: catálogo

## Reglas de movimiento (todo capítulo nuevo, por defecto)

1. **Cámara que cuenta (desde el 2026-11-24, manda sobre lo anterior):** `<MontajeNarrativo>` y, dentro de cada escena, `<RigCamara>` con una toma por cada cosa que nombra la voz (rayos X, recorrido, paneo hasta el detalle). Nada de «escena normal → push-in» en cada escena. Los textos de pantalla van en `<CapaTexto>` con `TextoSeguro`/`RotuloObjeto`, nunca se salen del margen de 90 px. Ver la sección de `camara-rig.tsx`. (`marco={CamaraViva}` queda solo para los videos ya hechos.)
   **Ojo:** `camara={useCamaraFondo()}` solo funciona si se llama DENTRO del `<RigCamara>`: envuelve el fondo en un componente propio, como `FondoEspacio` en `planopop/ejemplo/CapEjemplo.tsx` (el modelo de capítulo, probado).
2. En cada golpe (choque, explosión, cifra fuerte), `sacudidaEn` y una `Explosion2`, un `EstallidoRayos` o un `DestelloCorte`.
3. Al cambiar de tema, cambian el fondo y su color, con una transición del catálogo `Transiciones` (látigo, empuje, zoom a través de un objeto, iris con forma, humo, disolución, tarjeta, golpe, diagonal, abanico), nunca la misma dos veces seguidas. No hay cortes secos ni pantallas blancas.
4. El fondo siempre se mueve y tiene capas: primero los de `fondos-ricos.tsx` (`EspacioProfundo`, `CieloAlto`, `CieloNocturno`, `Paisaje`, `Interior`, `Oceano`); `FondoRayos`, `FondoRejilla`, `FondoBurbujas` o `FondoDegradado` solo para títulos y datos. El color plano quieto queda prohibido.
5. Algo nuevo cada 0,5–1,5 s dentro de la escena: etiqueta, flecha, chispa, objeto o gesto. Mínimo 4 eventos por cada 6 s, anclados a la palabra.
6. Los textos entran con `TextoEntra` (`letras`, `rebote`, `deslizar` o `maquina`), con sombra dura y contorno. Los rótulos van con `EtiquetaCaja`.
7. Hay volumen en todo: `<DefsVolumen />`, `dosTonos(color)` para luz y sombra, `SombraSuelo` bajo personas y objetos, `BrilloEsfera` en esferas y `Vineta` en escenas oscuras.
8. El personaje es `PersonaViva`: habla (`habla`) mientras narra su parte, cambia de expresión con el guion y hace un gesto por escena. Hay primeros planos con `Enfoque` (hasta 2,5×).
9. Las piezas de apoyo (flechas, anillos, pins) laten o flotan con `Math.sin(f / 6)`. Lo que aparece usa `pop` o `rebote` y lo que sale se va con escala; nada aparece ni desaparece en seco.
10. Primero se reutiliza: busca la pieza aquí antes de dibujar. Si haces una nueva y sirve para otro video, va a esta carpeta con su fila en el catálogo.

Piezas reutilizables para los explicativos animados (Remotion + SVG). Como en el canal de referencia: un fuego, una
explosión o un personaje se dibujan una vez y se usan en muchos videos.

- **Importar:** desde un capítulo `planopop/vNN/CapMM.tsx` → `import { Llamas, Trabajador, MapaEEUU } from "../biblioteca";`
  `index.ts` también re-exporta lo básico de `../kit` (C, T, Chip, Pin, Equis, Persona, Lienzo, Marco, pop, suave, sale,
  en, fijo, miles, Torre, Pino, Nieve, Estrellas, Termometro, Globo, CorteBase, PanelProfundidad), así que basta un import.
- **Salen de videos reales del canal original** (las columnas «De» o «Origen» dicen de cuál: kola, v07…v12). Una pieza nueva
  o una mejor que sirva para otros videos va aquí, no en un `piezas.tsx`.
- **Convenciones:** todo va dentro de `<Lienzo>` (1920×1080). `f` = fotograma local de la escena. `s` = escala (1 = tamaño
  base). Los 0..1 (`o`, `p`, `luz`, `fuego`…) se animan con `pop`/`suave`/`sale` anclados a la palabra: `pop(f, w(7))`.
  Para medir textos: `anchoT(texto, size)` ≈ largo × size × 0,7. Colores: `C` (kit) y `PB` (`paleta.ts`).
- **Ids de clipPath:** `Mundo`, `TierraClima`, `TeleVieja` y `MapaEEUU` llevan `id`; si sale dos veces en la misma
  escena, dale un id distinto a cada uno.
- **El personaje es uno solo:** `Persona` (kit). `Trabajador` es la misma Persona con casco y chaleco, no otro personaje.

## Personajes (`personajes.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| Persona | El personaje del estilo: cabeza grande, abrigo, gorro, parpadea y respira (está en el kit) | x y f abrigo abrigo2 s? flip? cara? ("normal"·"susto"·"duda") lentes? barba? brazo? fase? | kit (Kola) | `<Persona x={1500} y={1000} s={1.2} f={f} abrigo={C.teal2} abrigo2="#1F7F74" lentes />` |
| Trabajador | La Persona con casco de obra, chaleco con franja reflectiva y portátil (la vulcanóloga o científica de campo) | x y f s? flip? cara? brazo? abrigo? abrigo2? casco? colorCasco? franja? lentes? barba? portatil? (0..1) | v09 (Vulcanologo) | `<Trabajador x={1500} y={1000} f={f} portatil={pop(f, w(4))} />` |
| Buzo | Buzo nadando en horizontal, 200 px de largo a s=1, centrado | x y f s? | v08 | `<Buzo x={600} y={500} s={1.5} f={f} />` |
| Mano | Mano abierta vertical (≈ 220×330), x,y = centro | x y s? flip? | v08 | `<Mano x={700} y={560} s={1.2} />` |
| Bigote | Bigote postizo (≈ 120×40). Sobre una Persona de escala k en (px, py): x=px, y=py−298k, s=k | x y s? rot? | v08 | `<Bigote x={1500} y={1000 - 298} />` |

## Animales (`animales.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| Tiburon | Tiburón plano con especies, caras y boca que se abre; 1060 px de punta a punta a s=1, mira a la derecha | x y f especie? ("megalodon"·"blanco"·"mako"·"chubutensis") s? flip? rot? cara? boca? nado? esbelto? punteado? alpha? cria? calor? | v08 | `<Tiburon x={960} y={560} f={f} especie="blanco" cara="feroz" boca={suave(f, w(3), w(5))} />` |
| Megalodon / TiburonBlanco / Mako | Atajos de Tiburon con la especie fija (mismas props) | igual que Tiburon | v08 | `<Megalodon x={960} y={560} s={sDeLargo(900)} f={f} />` |
| Ballena | Ballena (≈ 640×230); barbada = barbas y pliegues | x y f s? flip? barbada? cara? | v08 | `<Ballena x={900} y={600} f={f} barbada />` |
| Foca | Foca (≈ 280×120) | x y f s? flip? | v08 | `<Foca x={500} y={700} f={f} flip />` |
| Tortuga | Tortuga marina (≈ 260×150) | x y f s? flip? | v08 | `<Tortuga x={1300} y={420} f={f} />` |
| Pez | Pez chico (≈ 130×60) | x y f s? flip? color? | v08 | `<Pez x={400} y={300} f={f} color={C.amarillo} />` |
| Vaca | Vaca plana (≈ 460×300, x,y = patas); capa = ceniza o nieve en el lomo | x y f s? capa? flip? | v09 | `<Vaca x={1200} y={900} f={f} capa={suave(f, w(2), w(8))} />` |

Utilidades: `sDeLargo(px)` (escala para que el tiburón mida px), `LARGO_TIB`, `COLA_TIB`, tipos `Especie`, `CaraAnimal`, `TiburonProps`.

## Fenómenos (`fenomenos.tsx`)

Para humo, explosiones y fuego en videos nuevos usa los de **Efectos con volumen** (`efectos-ricos.tsx`), más abajo.

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| Llamas | Fuego: n llamas que tiemblan (rojo por fuera, amarillo por dentro); x,y = base | x y f s? color? centro? n? | Kola cap06 | `<Llamas x={960} y={900} f={f} s={pop(f, w(5))} n={5} />` |
| Explosion | Explosión plana de 3 estrellas de puntas que late | x y f r? s? colores? | v07 cap09 | `<Explosion x={960} y={540} r={260} f={f} s={pop(f, w(2))} />` |
| EstallidoRayos | Sol de rayos que gira con núcleo naranja (impacto, «¡bum!», idea) | x y s f color? | v07 cap08 | `<EstallidoRayos x={960} y={540} s={pop(f, w(3))} f={f} />` |
| ColumnaHumo | Columna de humo/ceniza que sube con paraguas arriba, bombas que caen y anillos de choque en cada golpe | x y f alto golpes? (fotogramas) | v09 cap01 | `<ColumnaHumo x={960} y={900} f={f} alto={600 * sale(f, 0, 40)} golpes={[w(2)]} />` |
| Vapor | Tres bocanadas de vapor o humo que suben desde (x, y) | f x y | Kola cap08 | `<Vapor f={f} x={330} y={170} />` |
| Gota | Gota de agua con brillo y sombra | x y r s? color? op? | Kola cap06 | `<Gota x={700} y={500} r={60} s={pop(f, w(4))} />` |
| Burbujas | Burbujas que suben desde (x, y) | x y f n? alto? | v08 | `<Burbujas x={600} y={800} f={f} n={10} />` |
| Ondas | Arcos que se alejan (señal de radio, sonido, wifi); dir y abre en grados | x y f color dir? abre? r0? r1? n? vel? grosor? op? | Kola cap09 | `<Ondas x={500} y={400} f={f} color={C.amarillo} dir={0} />` |
| Pulso | Dos anillos que laten desde `desde` (resalta un punto) | f desde x y color? | v09 cap01 | `<Pulso f={f} desde={w(6)} x={800} y={420} />` |
| PulsoLuz | Chispa amarilla con estela (luz o señal viajando); vuelta = estela a la derecha | x y f s? vuelta? | v07 | `<PulsoLuz x={interpolate(f, [w(2), w(9)], [220, 1640], fijo)} y={620} f={f} />` |
| OndaPortadora | Onda senoidal que avanza de x2 a x1; datos = cuadritos encima | x1 x2 y f amp? frente? datos? color? | v07 | `<OndaPortadora x1={220} x2={1640} y={620} f={f} frente={suave(f, w(2), w(9))} />` |
| Destello | Brillito de 4 puntas (algo nuevo, valioso, limpio) | x y s color? | Kola cap07 | `<Destello x={1100} y={380} s={pop(f, w(3))} color={C.amarillo} />` |
| Escarcha | Copo de escarcha de 6 brazos (frío) | x y s? o? | v07 cap08 | `<Escarcha x={500} y={300} s={1.5} o={suave(f, w(1), w(3))} />` |
| Grietas | Grietas finas para poner encima de algo que se rompe | x y s? n? (1–4) | v07 | `<Grietas x={900} y={500} n={3} />` |
| Copos | Copos que caen por toda la pantalla (ceniza por defecto; cambia colores para nieve o polvo) | f o? n? colores? vel? semilla? | v09 (MapaEEUU) | `<Copos f={f} o={suave(f, w(4), w(6))} />` |
| NubeMancha | Nube vista desde arriba, tres capas que respiran (sobre un mapa) | cx cy r f o? colores? semilla? | v09 (MapaEEUU) | `<NubeMancha cx={700} cy={400} r={300 * sale(f, w(2), w(8))} f={f} />` |
| Lluvia | Nubarrón con lluvia, de lado; x,y = centro de las nubes | x y f w? alto? o? n? nube? gota? nubes? | v09 (TechoCeniza) | `<Lluvia x={960} y={200} f={f} w={900} alto={500} />` |

## Efectos con volumen (`efectos-ricos.tsx`) — usa estos en los videos nuevos

Lección del 2026-11-24, sobre el video del SR-71: «el humo, las explosiones, todo se ve muy, muy básico». Estos efectos reemplazan a
`Llamas`, `Explosion`, `Explosion2`, `ColumnaHumo`, `Vapor` e `Incendio` (que siguen ahí para los videos viejos).
El humo y la bola de fuego son muchas bocanadas pintadas «en pasadas»: contorno oscuro suave de todas, sombra de
todas y luego base, luz y brillo de cada una, corridas hacia la luz (arriba a la izquierda). Así se funden en una
sola nube de 3 tonos. Lo que se disipa se encoge y se desvanece con máscara, sin costuras. Todo es determinista
(`semilla`); dale una distinta a cada copia en la misma escena. Prueba: composición `EfectosRicosDemo`
(`planopop/EfectosRicosDemo.tsx`, 5 escenas: humos, hongo, misil y explosiones en el aire, jet, impacto).

| Pieza | Qué es | Props principales | Ejemplo |
|---|---|---|---|
| Humo | Columna o nube de bocanadas que nacen, crecen, se enfrían de color (claro → oscuro), se deforman con turbulencia, derivan con el viento y se disipan. Variantes: `chimenea` (fina, blanca), `incendio` (ancha, oscura), `volcan` (columna de ceniza con paraguas arriba), `residual` (lo que queda tras una explosión: emite `dura` fotogramas y se queda subiendo) y `vapor` | x y f desde? s? variante? alto? ancho? viento? (px/fotograma) vida? n? dura? colores? ([joven, viejo]) intensidad? contorno? semilla? | `<Humo x={330} y={548} f={f} variante="chimenea" />` · `<Humo x={1560} y={645} f={f + 300} s={0.6} variante="volcan" />` (sumar fotogramas a `f` hace que arranque ya formado) |
| ExplosionRica | Secuencia completa desde `desde`: destello de núcleo amarillo-blanco con rayos (nunca pantalla blanca), resplandor, bola de fuego que se expande y se enfría (blanco → amarillo → naranja → rojo → humo oscuro, el centro se enfría último), onda expansiva con borde que refracta, escombros en arco con estela (algunos arden), chispas y humo que se queda subiendo. `tipo="aire"`: detonación sin suelo (misil). `tipo="tierra"`: hongo con tallo y sombrero que rueda, anillo en el suelo y falda de polvo (x,y = punto en el suelo). Dura ≈ 60 + `queda` fotogramas | x y f desde? tam? ("chica" 110 · "mediana" 200 · "grande" 320 px) r? tipo? queda? (150) escombros? chispas? viento? semilla? | `<ExplosionRica x={960} y={920} f={f} desde={w(4)} tam="grande" tipo="tierra" />` · `<ExplosionRica x={900} y={360} f={f} desde={w(6)} tam="mediana" />` |
| Fuego | Fuego de cuerpo y lenguas en 5 tonos (borde rojo oscuro, rojo, naranja, amarillo y núcleo claro); una onda recorre las lenguas y cada una parpadea y se riza a su ritmo; llamitas que se sueltan, brasas con brillo, luz en el suelo y humo oscuro encima | x y f w? (360) alto? (420) n? (5 lenguas) s? intensidad? inclina? (viento −1..1) humo? brasas? semilla? | `<Fuego x={1500} y={900} f={f} w={520} alto={500} n={6} intensidad={suave(f, w(2), w(3))} />` |
| Estela | Estela de humo de misil, avión o cohete a lo largo de una trayectoria: fina y caliente junto a la cabeza (núcleo continuo y brillo del motor), se ensancha, se enfría a gris, deriva y se disipa. La cabeza va de u=0 a 1 entre `desde` y `desde + dura` | f trayectoria? ((u) => {x, y}) o puntos? ([[x, y], …]) desde? dura? n? ancho0? ancho1? vida? viento? sube? colores? cabeza? semilla? | `<Estela f={f} puntos={[[1750, 1000], [1500, 400], [900, 360]]} desde={w(2)} dura={48} />` (para un jet que avanza: puntos de su recorrido y `cabeza={false}`) |
| Postquemador | Llama de tobera con volumen: cono exterior que ondula, llama interior, núcleo blanco y diamantes de choque que parpadean, con resplandor. Sale hacia la izquierda desde (x, y) | x y f s? rot? largo? (280) alto? (48) p? (potencia 0..1) diamantes? (5) color? ("fuego" · "azul") | `<Postquemador x={jx - 222} y={jy + 4} f={f} />` (con `<Jet postquemador={0} />` encima) |
| PolvoImpacto | Falda de polvo que sale a los lados por el suelo, con columnita al centro y piedritas que saltan | x y f desde? ancho? alto? n? color? vida? piedras? s? semilla? | `<PolvoImpacto x={600} y={900} f={f} desde={w(3)} />` |
| Escombros | Trozos de dos tonos con contorno que salen en arco, frenan, caen con gravedad, giran y dejan estela de humo (algunos arden); con `suelo` se quedan en el piso | x y f desde? n? vel? dir? (−90 = arriba) abre? (grados; 360 = todas) gravedad? freno? tam? suelo? color? estela? arden? vida? s? semilla? | `<Escombros x={600} y={890} f={f} desde={w(3)} suelo={10} />` |
| Chispas | Rayitas brillantes con frenado y gravedad: estallido único o `continuo` (soldadura, esmeril, roce) | x y f desde? n? vel? dir? abre? gravedad? vida? largo? grosor? continuo? colores? s? semilla? | `<Chispas x={380} y={960} f={f} continuo dir={-160} abre={50} />` |
| OndasCalor | Ondas de calor sobre una superficie caliente: líneas onduladas que suben y, si le pasas `children`, distorsión real de lo que va dentro (el ruido sube con el tiempo) | x y (la superficie) f w? h? n? color? o? fuerza? (px) lineas? semilla? recorteCamara? (dentro de un RigCamara solo distorsiona lo visible; false si va en un `<g>` con transform) children? | `<OndasCalor x={960} y={880} f={f} w={1700} h={200}><Pista … /></OndasCalor>` |
| NubeBocanadas | El motor de todo lo anterior: dibuja tus propias bocanadas con volumen (nubes, vapor, polvo a mano) | b (Bocanada[]: x y r color o? luz? def? rot? borde?) contorno? grosor? brillo? | `<NubeBocanadas b={[{ x: 0, y: 0, r: 80, color: "#DDD" }, …]} />` |

Utilidades: `bocanadasHumo(f, ajustes)` (las bocanadas de un humo, para mezclarlas con otras), `colorCalor(calor, humo?)`
(rampa de fuego 1 = blanco → 0 = humo), `trayectoriaDePuntos(puntos)` y los tipos `Bocanada`, `VarianteHumo`, `TamExplosion`.
Coste: una ExplosionRica grande en tierra son ~350 elementos SVG (en el aire, ~150); no pongas más de dos grandes a la vez en una escena.

## Espacio (`espacio.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| Tierra | Planeta azul con continentes teal; luna = la Luna al lado | x y f r? luna? | v07 | `<Tierra x={300} y={540} r={120} f={f} luna />` |
| Mundo | Globo teal que gira con tierras y casquete de nieve | cx cy r f id | Kola cap04 | `<Mundo cx={960} cy={540} r={260} f={f} id="mundo1" />` |
| TierraClima | Planeta que se enfría (frio), solo el norte (norte) o con bruma | x y f r? frio? norte? bruma? id? | v09 | `<TierraClima x={960} y={540} f={f} frio={suave(f, w(2), w(8))} />` |
| PlanetaFrio | Planeta con casquetes que crecen y flechas de corrientes | x y r f hielo? corrientes? | v08 | `<PlanetaFrio x={960} y={540} r={300} f={f} hielo={0.8} />` |
| Sol | Sol con halo; brillo bajo = sol lejano | x y f r? brillo? | v07 | `<Sol x={300} y={300} r={140} f={f} />` |
| Planeta | Planetas del sistema solar por tipo | x y r tipo ("jupiter"·"saturno"·"urano"·"neptuno"·"marte"·"io"·"titan"·"pluton"·"luna") f | v07 | `<Planeta x={1200} y={500} r={180} tipo="saturno" f={f} />` |
| Estrella | Estrella lejana que titila | x y f r? | v07 | `<Estrella x={1600} y={300} r={50} f={f} />` |
| Galaxia | Galaxia espiral que gira despacio | x y s f | v07 cap06 | `<Galaxia x={1400} y={300} s={pop(f, w(5))} f={f} />` |
| Heliosfera | Burbuja del Sol con viento solar y borde punteado; fuera = rayos que entran | cx cy r f viento? fuera? | v07 | `<Heliosfera cx={960} cy={540} r={420} f={f} />` |
| Asteroide | Asteroide grande con estela | x y f r? | v09 | `<Asteroide x={1400} y={300} r={150} f={f} />` |
| Sonda | Sonda espacial (Voyager genérica), ≈ 640×430; senal = anillos en la antena; gemela = acento teal | x y f s? rot? flip? gemela? senal? | v07 (Voyager) | `<Sonda x={1300} y={540} s={1.2} f={f} senal={0.8} />` |
| Cohete | Cohete con dos laterales en su plataforma (≈ 980 px de alto, x,y = base) | x y f s? fuego? sube? | v07 | `<Cohete x={960} y={1000} s={0.8} f={f} fuego={pop(f, w(2))} sube={interpolate(f, [w(3), w(9)], [0, 900], fijo)} />` |
| CoheteSimple | Cohete de cómic con llama, de un color | x y f s? color? | Kola cap02 | `<CoheteSimple x={700} y={800} f={f} color={C.teal2} />` |

## Objetos (`objetos.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| Avion | Avión comercial genérico de lado (≈ 300×110) | x y s? flip? | v09 | `<Avion x={interpolate(f, [0, 90], [-200, 2100])} y={250} />` |
| AvionLado | Avión de pasajeros más grande, con cola roja | x y s? | Kola cap03 | `<AvionLado x={960} y={400} s={1.4} />` |
| Barco | Barco de perforación que se mece (y = flotación) | x y f s? | Kola cap02 | `<Barco x={960} y={700} f={f} />` |
| Velero | Velero del siglo XIX; draga = baja un cable | x y f s? draga? | v08 | `<Velero x={960} y={640} f={f} />` |
| Bus | Bus escolar de lado (400×130); silueta = solo contorno | x y s? silueta? | v08 | `<Bus x={500} y={700} s={1.5} />` |
| Celular | Celular con titular de noticia (340×640) | x y f titular (líneas) s? rot? cinta? | v09 | `<Celular x={1400} y={540} f={f} titular={["ANY DAY", "NOW"]} />` |
| CelularFoto | Celular con una foto que carga (220×420) | x y s? foto? (0..1) | v07 | `<CelularFoto x={1500} y={540} foto={suave(f, w(3), w(8))} />` |
| Tele | Tele plana con cinta roja; children en la pantalla (0..800 × 0..450) | x y f s? texto? children | v08 | `<Tele x={960} y={480} f={f} texto="NEWS"><T x={400} y={260} size={90} fill={C.navy}>1975</T></Tele>` |
| TeleVieja | Tele de tubo con antenas; on 0..1 la enciende (estática → imagen) | x y f on id s? children | Kola cap09 | `<TeleVieja x={440} y={200} s={0.8} f={f} on={suave(f, w(2), w(3))} id="tv1" />` |
| Computadora | Caja de computador con luces y etiqueta; roto = apagada con grieta | x y f etiqueta s? activa? roto? | v07 | `<Computadora x={960} y={540} f={f} etiqueta="SERVER" />` |
| SalaControl | Tres escritorios con pantallas (≈ 1300×520) | x y f s? pantalla? ("espera"·"ruido"·"datos"·"onda") | v07 | `<SalaControl x={960} y={900} f={f} pantalla="datos" />` |
| Antena | Antena parabólica gigante; senal = ondas; edificio = escala de 20 pisos al lado | x y f s? senal? edificio? | v07 (Antena70) | `<Antena x={960} y={950} f={f} senal={1} />` |
| Bombilla | Bombilla encendida con rayos (idea) | x y f s? | v07 cap05 | `<Bombilla x={960} y={400} f={f} s={pop(f, w(6))} />` |
| PanelSolar | Panel solar en su poste | x y s? | v07 cap03 | `<PanelSolar x={1400} y={500} />` |
| Pila | Pila de botón (≈ 120 px) | x y s? | v07 (PilaReloj) | `<Pila x={960} y={540} s={2} />` |
| Interruptor | Interruptor OFF/ON con rótulo a la izquierda | x y on (0..1) texto? | v09 | `<Interruptor x={1200} y={540} on={suave(f, w(3), w(3) + 8)} texto="POWER" />` |
| Calendario | Hoja de calendario con mes, día y año; tachado = raya roja | x y mes dia s? anio? tachado? | v07 | `<Calendario x={400} y={500} mes="SEP" dia="5" anio="1977" />` |
| RelojDigital | Reloj digital HH:MM en panel (500×240) | x y horas s? titulo? color? | v07 (Reloj) | `<RelojDigital x={1380} y={80} horas={interpolate(f, [0, 90], [0, 24])} titulo="HOURS" />` |
| RelojAguja | Reloj de pared con agujas (horas mueve las dos) | x y r horas | Kola cap03 | `<RelojAguja x={300} y={300} r={140} horas={f / 30} />` |
| Bascula | Báscula de plato; children = texto de su pantalla | x y s? children | v07 | `<Bascula x={960} y={700}><T x={0} y={20} size={60} fill={C.navy}>2 TONS</T></Bascula>` |
| BasculaPeso | Báscula de piso con lectura y aguja (carga 0..1) | x y lectura s? sub? carga? | v09 | `<BasculaPeso x={960} y={900} lectura="120–200 LB" carga={suave(f, w(2), w(5))} />` |
| Sismografo | Tambor con aguja que dibuja la onda; amp = sacudida | x y f amp? w? s? | v09 | `<Sismografo x={600} y={300} f={f} amp={0.8} />` |
| Vatimetro | Medidor de aguja con la cifra en W | x y vatios s? max? | v07 | `<Vatimetro x={960} y={600} vatios={470} />` |
| Combustible | Indicador E–F de combustible (bajo = rojo) | x y nivel s? | v08 | `<Combustible x={960} y={700} nivel={1 - suave(f, w(2), w(9))} />` |
| TermoMini | Termómetro chico con rótulo al lado | x y nivel s? color? texto? | v08 | `<TermoMini x={300} y={800} nivel={0.7} texto="WARM" />` |
| Brujula | Brújula; fuerza ensancha la aguja | x y angulo s? fuerza? | v07 | `<Brujula x={960} y={540} angulo={Math.sin(f / 10) * 30} />` |
| Lupa | Lupa (x,y = centro del vidrio) | x y r? s? rot? | v08 | `<Lupa x={1100} y={450} r={150} />` |
| Calibrador | Calibrador (pie de rey); abre separa las mordazas | x y s? abre? rot? | v08 | `<Calibrador x={960} y={540} abre={suave(f, w(1), w(4))} />` |
| Frasco | Frasquito de laboratorio con polvo (x,y = base) | x y s? lleno? | v08 | `<Frasco x={800} y={800} lleno={0.4} />` |
| Espectrometro | Máquina de laboratorio con pantalla de picos | x y f s? activo? | v08 | `<Espectrometro x={960} y={900} f={f} />` |
| Microscopio | Microscopio de laboratorio con luz que parpadea; x,y = centro de la base | x y f s? | Kola cap07 | `<Microscopio x={900} y={760} f={f} s={1.4} />` |
| Engranaje | Rueda dentada que gira (vel en grados por fotograma) | x y r f vel? color? | v07 | `<Engranaje x={960} y={540} r={160} f={f} vel={2} />` |
| Propulsor | Tobera con calentador: calor 0 = azul, 1 = naranja; fuego = chorro | x y f s? calor? fuego? | v07 | `<Propulsor x={960} y={400} f={f} fuego={pop(f, w(3))} />` |
| LlaveInglesa | Llave de cambio de aceite (≈ 420 de largo) | x y s? rot? | v09 | `<LlaveInglesa x={960} y={540} rot={-20} />` |
| Llave | Llave de boca (herramienta) gris | x y s? rot? hueco? (color del fondo) | v07 cap03 | `<Llave x={700} y={500} s={1.4} hueco={C.navy} />` |
| Tijeras | Tijeras que apuntan abajo; c 0 = abiertas, 1 = cerradas | x y s c | Kola cap02 | `<Tijeras x={960} y={300} s={1} c={suave(f, w(4), w(5))} />` |
| Casa | Casa de techo plano; capa = ceniza o nieve en el techo, lluvia, cruje = techo combado | x y f s? capa? lluvia? cruje? | v09 (TechoCeniza) | `<Casa x={960} y={900} f={f} capa={suave(f, w(2), w(9))} />` |
| Libro | Libro de tapa roja con sello encima (sello 0..1) | x y s? sello? texto? | v09 (LibroVencido) | `<Libro x={960} y={540} sello={pop(f, w(5))} texto="BANNED" />` |
| Pergamino | Pergamino (x,y = esquina; children en coords 0..w) | x y w h s? children | v08 | `<Pergamino x={600} y={200} w={700} h={600}><T x={350} y={120} size={60} fill={C.navy}>1875</T></Pergamino>` |
| Papelera | Bote de basura (boca en y−300) | x y s? | v09 | `<Papelera x={1500} y={950} />` |
| Plato | Plato grande; lleno = montaña de comida | x y f s? lleno? | v08 | `<Plato x={960} y={700} f={f} lleno={suave(f, w(2), w(6))} />` |
| Vitrina | Vitrina de museo con etiqueta; children con origen en el centro | x y s? etiqueta? children | v08 | `<Vitrina x={960} y={1000} etiqueta="FOSSIL"><Lupa x={0} y={0} /></Vitrina>` |
| Foco | Cono de luz de escenario hasta el piso en (x, y) | x y w? luz? | v08 | `<Foco x={960} y={950} luz={suave(f, 0, 10)} />` |
| Moneda | Moneda que gira hasta verse de canto (canto 0..1) | x y s? canto? | v09 (MonedaCanto) | `<Moneda x={960} y={540} canto={suave(f, w(2), w(4))} />` |
| Billete | Billete verde con «$» | x y w? rot? | Kola cap02 | `<Billete x={800} y={500} w={200} rot={-8} />` |
| Lingote | Lingote de oro | x y | Kola cap07 | `<Lingote x={960} y={600} />` |
| Corona | Corona dorada con joyas (récord, «el rey de…») | x y s? rot? | Kola cap04 | `<Corona x={960} y={300} s={pop(f, w(8))} rot={-8} />` |
| Capitolio | Edificio de gobierno con cúpula (genérico) | x y s? | Kola cap02 | `<Capitolio x={960} y={950} s={0.9} />` |
| BanderaUSA | Bandera de EE. UU. simplificada | x y w | Kola cap02 | `<BanderaUSA x={200} y={100} w={240} />` |
| BanderaURSS | Bandera roja con estrella (URSS simplificada) | x y w | Kola cap02 | `<BanderaURSS x={1500} y={100} w={240} />` |

Utilidad: `hhmm(horas)` → "HH:MM".

## Rótulos, marcas y CTA (`rotulos.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| Sello | Sello de goma (ancho según el texto); tacha 0..1 lo raya | x y s texto rot? color? tacha? | v09 | `<Sello x={960} y={540} s={pop(f, w(5))} texto="CANCELED" />` |
| SelloGrande | Sello rojo grande que cae de golpe (p 0..1); children = texto | x y p w rot? children | Kola cap06 | `<SelloGrande x={960} y={540} p={pop(f, w(16))} w={900}><T x={0} y={30} size={90}>NOT FOUND</T></SelloGrande>` |
| Tachon | Raya roja que tacha de (x1,y1) a (x2,y2) | x1 y1 x2 y2 p grueso? color? | v09 | `<Tachon x1={600} y1={600} x2={1300} y2={450} p={sale(f, w(7), w(7) + 8)} />` |
| Visto | Visto bueno en círculo | x y s? color? | v07 cap09 | `<Visto x={1200} y={400} s={pop(f, w(3))} />` |
| Aviso | Triángulo amarillo de advertencia «!» | x y s? | v07 cap08 | `<Aviso x={1500} y={300} s={pop(f, w(2))} />` |
| Signo | «?» amarillo grande que flota | x y f s? | v09 | `<Signo x={1500} y={500} f={f} s={pop(f, w(9))} />` |
| Pregunta | «?» rojo con borde blanco que entra con escala | x y s size? | v07 cap06 | `<Pregunta x={960} y={600} s={pop(f, w(4))} />` |
| EstrellaForma | Estrella de 5 puntas rellena | x y s fill | Kola cap04 | `<EstrellaForma x={300} y={200} s={pop(f, w(1))} fill={C.amarillo} />` |
| Bocadillo | Globo de diálogo blanco (x,y = esquina; children en 0..w); cola "izq"·"der"·"abajo" | x y w h children s? cola? | v07 | `<Bocadillo x={1100} y={200} w={600} h={220} cola="izq"><T x={300} y={135} size={70} fill={C.navy}>HELLO?</T></Bocadillo>` |
| Tarjeta | Tarjeta blanca grande con sombra plana (x,y = esquina) | x y w h s children rot? | v07 cap09 | `<Tarjeta x={560} y={240} w={800} h={500} s={pop(f, w(2))}>…</Tarjeta>` |
| FichaSospechoso | Tarjeta de sospechoso (420×540, x,y = centro) con número, tela que tapa y sello | x y titulo s? numero? tapada? sello? children | v08 | `<FichaSospechoso x={500} y={540} titulo="THE COLD" numero={1} sello="NOT ENOUGH" />` |
| Etiqueta | Ficha amarilla con texto («REAL EVENT · 1980») | x y texto o? anchor? fondo? tinta? | v09 (EtiquetaReal) | `<Etiqueta x={80} y={936} texto="REAL EVENT · 1980" o={pop(f, w(3))} />` |
| TarjetaEstado | Tarjeta de estado con filas de pastillas de color (alertas, niveles, semáforos) | x y titulo filas ({etiqueta, valor, color, tinta?}[]) s? sello? | v09 (TarjetaAlerta, genérica) | `<TarjetaEstado x={640} y={300} titulo="VOLCANO STATUS" filas={[{ etiqueta: "ALERT", valor: "WATCH", color: C.naranja }]} />` |
| Botones | Fila de botones que aparecen uno tras otro; el activo en amarillo | x y f textos activa? aparece? ancho? alto? hueco? size? | v09 (BotonesDuracion, genérica) | `<Botones x={960} y={800} f={f} textos={["3 DAYS", "1 WEEK", "1 MONTH"]} activa={1} />` |
| Flecha | Flecha gruesa recta (apunta arriba con rot 0) | x y s rot? color? largo? ancho? | Kola cap03 | `<Flecha x={960} y={500} s={pop(f, w(3))} rot={180} />` |
| FlechaLinea | Flecha punteada de un punto a otro | x1 y1 x2 y2 color? ancho? op? | v07 cap04 | `<FlechaLinea x1={400} y1={600} x2={1200} y2={400} color={C.amarillo} />` |
| FlechaGiro | Arco punteado con flecha que corre (giro, rotación, ciclo) | x y rx ry s f color? | Kola cap03 | `<FlechaGiro x={960} y={700} rx={200} ry={60} s={1} f={f} />` |
| Frase | Frase en un solo `<text>`: cada palabra (tspan) aparece en su palabra del narrador; sin textos encimados | x y size f w partes ([texto, índice, color?][]) fill? borde? | Kola cap10 | `<Frase x={960} y={540} size={90} f={f} w={w} partes={[["COMMENT", 12], ["BELOW", 13, C.amarillo]]} />` |
| Pulgar | Pulgar arriba blanco (like) para el CTA; dibujado en el origen, ponlo dentro de un `<g transform>` | (sin props) | Kola cap10 | `<g transform={en(700, 540, pop(f, w(3)))}><g transform="translate(700,540)"><Pulgar /></g></g>` |
| Campana | Campana de notificaciones; on = amarilla; rot la hace sonar | rot on | Kola cap10 | `<g transform="translate(1300,560)"><Campana rot={Math.sin(f / 2) * 18} on={f > w(9)} /></g>` |

Tipo: `Parte` = `[texto, índiceDePalabra, color?]` para Frase. El CTA completo (pregunta + like + suscripción) se explica en `pasos/06-animacion.md` de la skill (capítulo de cierre).

## Gráficos (`graficos.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| Barras | Gráfico de barras que crecen; pico = barra amarilla; etiquetas debajo | x y w h f barras (0..1) progreso? pico? etiquetas? color? | v08 (Histograma) | `<Barras x={300} y={300} w={1300} h={500} f={f} barras={[0.2, 0.5, 1, 0.6]} progreso={suave(f, w(2), w(6))} pico={2} />` |
| Grafica | Línea sobre ejes que se dibuja; serie 0..1 | x y w h f serie color progreso? | v07 | `<Grafica x={300} y={250} w={1300} h={550} f={f} serie={[0.1, 0.3, 0.2, 0.8]} color={C.rojo} progreso={suave(f, w(1), w(7))} />` |
| Dispersion | Nube de puntos (px, py 0..1) con tachas, banda y línea vertical | x y w h f puntos banda? vertical? | v08 | `<Dispersion x={300} y={250} w={1300} h={550} f={f} puntos={[{ px: 0.3, py: 0.6 }]} />` |
| Barra | Barra de progreso plana (descarga, memoria, batería) | x y w progreso color? h? | v07 | `<Barra x={560} y={800} w={800} progreso={suave(f, w(2), w(9))} />` |
| Mosaico | Cuadrícula de 60 cuadros (10×6) que se llenan; punto = el punto azul resaltado | x y f s? llenos? punto? | v07 | `<Mosaico x={510} y={270} f={f} llenos={interpolate(f, [w(1), w(6)], [0, 60], fijo)} />` |
| Medidor | Termómetro de porcentaje (110×420, x,y = base) con raya objetivo y cifra arriba | x y f nivel max? linea? lineaTexto? texto? s? color? | v09 (MedidorFundido) | `<Medidor x={400} y={900} f={f} nivel={9} linea={40} lineaTexto="40 % NEEDED" texto="9 %" />` |
| CotaH | Cota horizontal amarilla que se extiende (medir un largo) | x1 x2 y o | v08 cap03 | `<CotaH x1={300} x2={1500} y={850} o={sale(f, w(2), w(4))} />` |
| CotaV | Cota vertical amarilla (medir una altura) | x y1 y2 o | v08 cap03 | `<CotaV x={200} y1={200} y2={900} o={sale(f, w(2), w(4))} />` |
| LineaTiempo | Línea de tiempo con marcas, pin con cifra, tramo vivo y franjas (hacia adelante o hacia atrás) | f desde hasta marcas x? y? w? s? titulo? formato? marcador? textoMarcador? vivo? franjas? pregunta? | v08 (RelojGeo, genérica) | `<LineaTiempo f={f} desde={1950} hasta={2030} marcas={[1950, 1970, 1990, 2010, 2030]} marcador={interpolate(f, [w(2), w(6)], [1950, 1992], fijo)} formato={(v) => String(Math.round(v))} />` |
| Contador | Panel contador (título, cifra con comas, unidad), el de profundidad de Kola con texto propio | x y valor titulo unidad? s? resaltado? w? texto? | kit (PanelProfundidad, genérico) | `<Contador x={1330} y={100} titulo="DEATHS" valor={interpolate(f, [w(1), w(5)], [0, 12000], fijo)} unidad="PEOPLE" />` |

## Mapas (`mapas.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| MapaEEUU | EE. UU. contiguo con estados, Grandes Lagos y cámara con zoom; foco que late, ciudades, puntos, manchas, nube, viento, copos y oscuro | f x? y? s? cam? foco? focoNombre? ciudades? puntos? manchas? nube? viento? copos? oscuro? tierra? id? children | v09 (genérico, sin la diana de ceniza) | `<MapaEEUU f={f} foco={{ lon: -110.6, lat: 44.55 }} focoNombre="YELLOWSTONE" ciudades={CIUDADES_EEUU} cam={{ lon: -110.6, lat: 44.55, z: interpolate(f, [0, 40], [1, 3], fijo) }} />` |
| ArcoMapa | Arco con flecha entre dos puntos de pantalla, con ficha de texto en el medio | a b p altura? color? texto? | v09 | `<ArcoMapa a={proyecta()(-110.6, 44.55)} b={proyecta()(-74, 40.7)} p={suave(f, w(3), w(8))} texto="~2,000 MI" />` |
| MapaMundo | Mapa del mundo plano (1600×675 desde x=160, y=200) con puntos que laten y franja tropical | f x? y? s? puntos? calidas? mar? tierra? | v08 | `<MapaMundo f={f} puntos={[{ lon: 139, lat: 36, nombre: "JAPAN", dy: -40 }]} />` |

Utilidades: `ptUS(lon, lat)` y `proyecta(cam?)` (EE. UU. a pantalla), `MAPA_CENTRO`, `CIUDADES_EEUU` (9 ciudades con rótulo ya acomodado), `ptMapa(lon, lat)` (mundo), tipos `Cam`, `Ciudad`, `PuntoUS`, `PuntoMapa`.
El pin del kit (`Pin`) marca un lugar en cualquier mapa.

## Fondos, paisajes y transiciones (`escenarios.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| FondoRayas | Rayas diagonales que corren despacio (fondo de títulos y datos) | f color? | Kola cap02 | `<Lienzo fondo={C.morado}><FondoRayas f={f} />…</Lienzo>` |
| Rejilla | Rejilla tenue de pantalla completa (fondo técnico) | color? o? | Kola cap08 | `<Rejilla />` |
| Suelo | Franja de piso con borde | y? color? borde? | v07 cap08 | `<Suelo y={880} />` |
| FondoTundra | Paisaje helado: sol, montañas con nieve y suelo blanco | (sin props) | Kola cap04 | `<Lienzo fondo={C.cielo}><FondoTundra /></Lienzo>` |
| FondoMar | Fondo submarino de pantalla completa; profundo oscurece, luz = rayos | f profundo? luz? | v08 | `<FondoMar f={f} profundo={0.4} />` |
| Costa | Costa poco profunda con pasto marino y peces (productiva 0..1) | f productiva? | v08 | `<Costa f={f} productiva={1 - suave(f, w(3), w(9))} />` |
| CampoMaiz | Hilera de maíz; ceniza 0..1 la entierra | x y w f ceniza? | v09 | `<CampoMaiz x={0} y={1000} w={1920} f={f} />` |
| Volcan | Volcán de cono con nieve; erupcion = columna de humo y boca encendida | x y f s? erupcion? | v09 (VolcanCono) | `<Volcan x={960} y={980} f={f} erupcion={sale(f, w(4), w(9))} />` |
| Motas | Textura de roca o tierra: motas claras y oscuras deterministas | semilla n x y w h esc? | Kola cap06 | `<Motas semilla="r1" n={60} x={0} y={600} w={1920} h={480} />` |
| Cristales | Textura de roca cristalina (granito) | x y w h n semilla | Kola cap02 | `<Cristales x={0} y={600} w={1920} h={480} n={90} semilla="g" />` |
| Flash | Destello blanco de pantalla completa para un golpe o un corte | f desde dura? fuerza? color? | v08 cap08 | `<Flash f={f} desde={w(7)} />` |
| Marco (kit) | Entrada de cada escena: zoom de 1,1 a 1 en 9 fotogramas y acercamiento lento | dur children | kit | `<Marco dur={dur}><Lienzo>…</Lienzo></Marco>` |

## Movimiento y transiciones (`movimiento.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| CamaraViva | Envoltorio de escena: push-in o deriva continua de 1 a `zoom` (1,12×), sacudida en un fotograma y entrada con transición. Sin `variante` ni `entrada` las elige sola por escena (determinista, a partir de `dur`) | dur children variante? ("push"·"deriva-izq"·"deriva-der"·"sacudida"·"quieta") entrada? ("auto"·"ninguna"·"barrido"·"iris"·"destello") zoom? sacudidaEn? fuerza? semilla? | nueva (referencia Big Bang) | `<Montaje {...p} escenas={ESCENAS} sonidos={SONIDOS} fondo={C.navy} marco={CamaraViva} />` |
| camaraViva() | Fábrica: CamaraViva con opciones fijas, para usarla como `marco` | las de CamaraViva menos dur/children | nueva | `marco={camaraViva({ entrada: "ninguna", zoom: 1.08 })}` |
| Enfoque | Acercamiento a un punto (lo lleva al centro), de 1 a `zoom` (máximo 2,5×); envoltorio HTML | x y desde hasta zoom? vuelve? children | nueva | `<Enfoque x={700} y={420} desde={w(5)} hasta={w(7)} zoom={2.2}><Lienzo>…</Lienzo></Enfoque>` |
| transformEnfoque() | Lo mismo para un `<g>` dentro del SVG | (f, x, y, desde, hasta, zoom?, vuelve?, modo?) | nueva | `<g transform={transformEnfoque(f, 700, 520, w(5), w(7), 1.8)}>…</g>` |
| Barrido | Franja inclinada con borde gris que cruza la pantalla; tapa todo a la mitad (corta ahí) | f desde dura? (8) color? borde? dir? | nueva | `<Barrido f={f} desde={dur - 4} />` |
| Iris | Círculo que se abre desde un punto (o se cierra sobre él), con aro blanco | f desde dura? x? y? modo? ("abre"·"cierra") color? aro? | nueva | `<Iris f={f} desde={dur - 9} modo="cierra" x={960} y={400} />` |
| DestelloCorte | Flash blanco que nace en un punto con rayos y se desvanece (el brillito de 4 puntas sigue siendo `Destello`) | f desde dura? x? y? color? | nueva | `<DestelloCorte f={f} desde={w(3)} x={960} y={540} />` |
| Transicion | Las tres juntas: `Transicion.Barrido`, `Transicion.Iris` y `Transicion.Destello` | — | nueva | `<Transicion.Destello f={f} desde={0} />` |
| sacudida() / rebote() | Ayudantes: `sacudida(f, en, fuerza?)` → [dx, dy] que se apaga, y `rebote(f, en)` → 0..1 con sobrepaso fuerte | — | nueva | `const [dx, dy] = sacudida(f, w(4));` |

## Cámara que cuenta, textos seguros y transiciones variadas (`camara-rig.tsx`)

Lección del 2026-11-24, sobre el video del SR-71: «estás usando una sola transición para todo… eso aburre»; «interpretaste movimiento de cámara como iniciar cada escena normal y hacerle zoom»; «haces que todos los textos se salgan de la pantalla». En la referencia la cámara recorre **un escenario grande** siguiendo la narración: va al avión, la piel se vuelve transparente y se ven los tanques, y en la misma escena se desliza hasta las llantas. Los textos van en una capa que la cámara no mueve.

**Patrón de capítulo nuevo:** `<MontajeNarrativo>` en vez de `<Montaje>` (mismas props; transiciones distintas que rotan solas y se solapan de verdad) y, dentro de cada escena, `<RigCamara>` en vez de `<Lienzo>`, con una toma por cada cosa que nombra la voz. Menos escenas, más largas, recorridas con la cámara.

| Pieza | Qué es | Props principales | Ejemplo |
|---|---|---|---|
| RigCamara / PlanoContinuo | Reemplaza al `<Lienzo>`: escenario más grande que el cuadro y una cámara que viaja de toma en toma con aceleración y frenado (paneo, acercamiento a un punto, alejamiento de revelación, travelling). Desenfoque de movimiento solo en los viajes rápidos; deriva mínima en reposo (`respira`). Con `escenario` nunca muestra fuera de él. Hijas directas: `<CapaParalaje>`, `<CapaTexto>`; lo demás es el escenario | tomas w? escenario? limitar? fondo? respira? (0,5) desenfoque? sacudidas? fuerza? hud? guias? | `<RigCamara w={w} escenario={{ w: 3600, h: 2000 }} tomas={[{ en: 0, x: 1800, y: 1000, zoom: 0.55 }, { p: 4, x: 1332, y: 1125, zoom: 1.5 }]}>…</RigCamara>` |
| Toma | `{ en (fotograma) \| p (palabra, con w), x, y (punto del escenario que queda al centro), zoom?, rot?, dura?, curva? }`. Curvas: `suave` (por defecto), `rapida` (paneo), `lenta`, `sobrepaso` (se pasa ~5 % y se asienta), `frena` (revelación), `corte` (salto seco dentro del plano). Sin `dura`, se calcula por la distancia (12–40 fotogramas) | — | `{ p: 12, x: 2450, y: 1310, zoom: 2, curva: "sobrepaso" }` |
| recorrido() | Patrón para varios elementos en fila (tarjetas, piezas, ciudades): plano general → se acerca al primero en su palabra → se desliza de uno a otro en la palabra de cada uno, sin reiniciar la escena; `volver` regresa al general | (elementos [{x, y, en\|p, zoom?}], {zoom?, general: {x, y, zoom?, en?}, curva?, dura?, volver?}) → Toma[] | `tomas={recorrido(TARJ.map((t, k) => ({ x: t.x, y: t.y, en: w(5 + k * 3) })), { zoom: 2, general: { x: 960, y: 540 } })}` |
| encuadrar() | Toma que encuadra una caja del escenario con aire | (caja {x, y, w, h}, aire? 1,15) | `{ en: w(7), ...encuadrar({ x: 600, y: 900, w: 800, h: 300 }) }` |
| useCamara() | Cámara actual: `pose`, `aPantalla(x, y)`, `aEscenario(x, y)`, `velocidad`, `sacudida`. Fuera de un rig = identidad | — | `const [sx, sy] = useCamara().aPantalla(1400, 900);` |
| useCamaraFondo() | Puente con `fondos-ricos.tsx`: `{x, y, zoom}` que esos fondos reciben en `camara` (hacen su propio paralaje por capas). Va en un componente dentro de `<CapaParalaje p={0}>` | — | `const Fondo = ({ f }) => <Interior f={f} camara={useCamaraFondo()} variante="hangar" />;` |
| CapaParalaje | Capa en coordenadas de PANTALLA que se mueve con la cámara a otra velocidad: p 0 fija, 0,2–0,5 fondo lejano, >1 frente. Se agranda sola lo justo para no mostrar bordes | p cubrir? children | `<CapaParalaje p={0.3}><FondoNubes f={f} /></CapaParalaje>` |
| CapaTexto | Capa de textos que la cámara NO mueve (HUD). Todo texto de pantalla va aquí; `guias` dibuja el margen seguro | children guias? | `<CapaTexto><TextoSeguro … /></CapaTexto>` |
| TextoSeguro | `TextoEntra` que nunca se sale: si no cabe reduce el tamaño, si toca el margen (90 px) se corre hacia adentro | las de TextoEntra + margen? quien? | `<TextoSeguro x={960} y={200} texto="6 FUEL TANKS" f={f} desde={w(9)} size={80} modo="rebote" />` |
| EtiquetaSegura | `EtiquetaCaja` reacomodada dentro del margen | las de EtiquetaCaja + margen? | `<EtiquetaSegura x={1800} y={120} texto="MACH 3" f={f} desde={w(4)} />` |
| RotuloObjeto | Rótulo pegado a un objeto del ESCENARIO, en la CapaTexto: proyecta el objeto a pantalla, pone la etiqueta al `lado` pedido, la reacomoda para no salirse y la une con línea y punto | x y texto f desde? sale? size? lado? ("arriba"·"abajo"·"izq"·"der") dist? fondo? tinta? icono? linea? | `<RotuloObjeto x={2450} y={1348} texto="NOSE GEAR" f={f} desde={w(14)} lado="abajo" />` |
| zonaSegura() / acomodar() / cajaTexto() / MARGEN | Verificación: `zonaSegura(x, y, w, h, quien)` avisa en consola (una vez) si la caja se sale del margen; `acomodar(cx, cy, w, h)` devuelve el centro corregido; `cajaTexto(texto, size, anchor, caja?)` mide un TextoEntra | — | `zonaSegura(x0, y0, 600, 120, "cifra");` |
| GuiaSegura | Rectángulo punteado del margen de 90 px (solo para revisar stills) | margen? color? | `<GuiaSegura />` |
| RayosX | En `desde` un barrido brillante cruza `caja`; por donde pasa, el exterior queda translúcido azul de plano técnico (rejilla, contorno y aristas que brillan) y se ve el interior, recortado a la silueta. En `vuelve` se cierra. Fuera de `caja` el exterior sigue sólido | f id desde hasta? vuelve? caja exterior interior dir? fantasma? color? tinte? recortar? rejilla? grosor? recorteCamara? (el contorno solo se calcula en lo visible; false si va en un `<g>` con transform) | `<RayosX f={f} id="rx1" desde={w(6)} hasta={w(8)} vuelve={w(15)} caja={{ x: 580, y: 810, w: 2420, h: 430 }} exterior={<SR71 … />} interior={<Tanques f={f} />} />` |
| LupaAumento | Lupa de verdad: el vidrio muestra lo de debajo aumentado (2–2,5×), con tinte, reflejo, aro con volumen y mango. Envuelve el contenido; anima x, y para pasearla (`Lupa` de objetos.tsx es solo el dibujo) | id x y r? zoom? rot? aparece? fondoVidrio? aro? children | `<LupaAumento id="l1" x={lx} y={1120} r={80} aparece={pop(f, w(9))}><SR71 … /></LupaAumento>` |
| MontajeNarrativo | `<Montaje>` de estilos/base (voz, música y efectos iguales) con escenas que se solapan: la vieja sale y la nueva entra a la vez. Cada escena puede llevar `transicion`; si no, rota sola sin repetir. La transición queda centrada en la palabra de la escena. Cámara quieta: el movimiento va en cada escena | las de Montaje + escenas (EscenaNarrativa) lista? semilla? | `<MontajeNarrativo {...p} escenas={ESCENAS} sonidos={SONIDOS} fondo={C.navy} semilla="v11c03" />` |
| CamaraNarrativa / camaraNarrativa() | Marco para el `<Montaje>` de siempre: sin push-in ni zoom de entrada, con una transición de entrada que rota sola (la escena vieja no se ve debajo; para eso, MontajeNarrativo). `CamaraViva` sigue igual para los videos ya hechos | dur children transicion? lista? semilla? sacudidaEn? | `marco={CamaraNarrativa}` · `marco={camaraNarrativa({ lista: ["iris", "humo", "latigo"] })}` |
| Transiciones / ROTACION / transicionPara() | Catálogo de 10 (ninguna blanca): `latigo` (paneo rápido con desenfoque), `empuje` (la nueva empuja a la vieja), `zoomObjeto` (entra por un punto: x, y, radio), `iris` (forma: circulo·estrella·rombo·hexagono o silueta [[x,y]…]), `humo` (cortina de humo o tinta del color de la escena), `disolucion`, `tarjeta` (giro 3D), `golpe` (corte con sacudida y líneas de velocidad oscuras), `diagonal`, `abanico` (aguja de reloj). `transicionPara(k, semilla, lista?, ventana?)` elige sin repetir la anterior | OpcionesTransicion: tipo dura? dir? x? y? radio? forma? color? color2? | `{ id: "tanques", desde: 41, comp: Tanques, transicion: { tipo: "zoomObjeto", x: 1320, y: 520, radio: 70 } }` |
| SecuenciaPlanos / Plano | Lo de abajo de MontajeNarrativo, por fotogramas (para demos o teasers sin voz) | planos [{id, inicio, transicion?, nodo(dur)}] total semilla? lista? | ver el código de `SecuenciaPlanos` en `camara-rig.tsx` |

**Reglas:**
- Una escena larga por idea, recorrida con la cámara. Cada toma cae en la palabra que la pide (`p: 12` o `en: w(12)`).
- Prohibido el patrón «escena normal → zoom» en cada escena. Si nada se mueve en una toma larga, la deriva `respira` basta.
- Ningún texto dentro del escenario que la cámara agranda: textos de pantalla en `<CapaTexto>` con `TextoSeguro` y rótulos de objetos con `RotuloObjeto`. Revisa los stills con `guias`.
- Nunca la misma transición dos veces seguidas, y muchas veces la mejor transición es no cortar: otra toma en el mismo plano.

**Ejemplo de capítulo corto: avión → rayos X a los tanques → recorrido por los tanques → paneo a las llantas.**

```tsx
import { useCurrentFrame } from "remotion";
import { EstiloProps, Sonido } from "../../estilos/base";
import { C, CapaParalaje, CapaTexto, EscenaNarrativa, EscenaProps, Interior, MontajeNarrativo, RayosX, RigCamara, RotuloObjeto,
  TextoSeguro, recorrido, useCamaraFondo } from "../biblioteca";
import { SR71 } from "./piezas";

const AX = 1800, AY = 1150, S = 2.6;                       // avión en el escenario de 3600×2000
const tanque = (k: number) => ({ x: AX + (-391 + k * 84) * S, y: AY - 7 * S });
const RUEDA = { x: AX + 250 * S, y: AY + 76 * S };
const Fondo: React.FC<{ f: number }> = ({ f }) => <Interior f={f} camara={useCamaraFondo()} variante="hangar" />;

// «The Blackbird (0) … carried six fuel tanks (6) … the first (10) … the third (13) … the last (16)
//   … and it rolled on tiny wheels (21)»
const Hangar: React.FC<EscenaProps> = ({ w }) => {
  const f = useCurrentFrame();
  const tomas = [
    { en: 0, x: 1800, y: 1000, zoom: 0.55 },                                   // plano general
    { p: 2, x: AX, y: AY, zoom: 0.85, curva: "sobrepaso" as const },           // el avión
    ...recorrido([0, 2, 5].map((k, i) => ({ ...tanque(k), p: [10, 13, 16][i] })),
      { zoom: 2.5, general: { x: 1330, y: 1125, zoom: 1.45, en: w(6) } }),     // tanques y recorrido
    { p: 21, x: RUEDA.x, y: RUEDA.y - 40, zoom: 2, curva: "sobrepaso" as const }, // la cámara baja a la rueda
  ];
  return (
    <RigCamara w={w} tomas={tomas} escenario={{ w: 3600, h: 2000 }}>
      <CapaParalaje p={0}><Fondo f={f} /></CapaParalaje>
      <RayosX f={f} id="c3rx" desde={w(7)} hasta={w(9)} vuelve={w(19)}
        caja={{ x: AX - 470 * S, y: AY - 130 * S, w: 930 * S, h: 164 * S }}
        exterior={<SR71 x={AX} y={AY} f={f} s={S} tren suelo />} interior={<Tanques f={f} />} />
      <CapaTexto>
        <TextoSeguro x={960} y={200} texto="6 FUEL TANKS" f={f} desde={w(8)} size={80} modo="rebote" sale={w(19)} />
        <RotuloObjeto {...RUEDA} texto="TINY WHEELS" f={f} desde={w(22)} lado="abajo" />
      </CapaTexto>
    </RigCamara>
  );
};

const ESCENAS: EscenaNarrativa[] = [
  { id: "hangar", desde: 0, comp: Hangar },
  { id: "mapa", desde: 30, comp: Mapa, transicion: { tipo: "iris", forma: "estrella" } }, // o sin transicion: rota sola
];
export const Cap03: React.FC<EstiloProps> = (p) => (
  <MontajeNarrativo {...p} escenas={ESCENAS} sonidos={SONIDOS} fondo={C.navy} semilla="v11c03" />
);
```

Prueba: composición `CamaraRigDemo` (`planopop/CamaraRigDemo.tsx`, 15 s). Fotogramas: 0 general, 64 barrido de rayos X, 100–140 recorrido por los tanques con rótulos, 178 lupa sobre los tanques, 240 rueda de nariz con el rótulo reacomodado, 285 látigo, 321 iris estrella, 352 humo, 389 tarjeta, 425 zoom a través de la cabina. Otras transiciones: `--props='{"guias":false,"lista":["golpe","diagonal","abanico","empuje","disolucion"]}'`.

## Fondos animados (`fondos.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| FondoRayos | Rayos radiales que giran y laten, con anillos que salen del centro (estallido o título) | f colores? ([fondo, rayo]) cx? cy? n? vel? anillos? | nueva (Big Bang mov-000) | `<FondoRayos f={f} colores={["#2A1F5E", C.naranja]} />` |
| FondoEstrellas | Estrellas en 3 capas con paralaje que titilan, más galaxias de colores que derivan | f fondo? color? vel? n? galaxias? semilla? | nueva | `<FondoEstrellas f={f} vel={1.5} />` |
| FondoRejilla | Rejilla en perspectiva (piso y techo) que avanza hacia la cámara y ondula | f fondo? color? vel? ondula? techo? horizonte? | nueva (mov-410) | `<FondoRejilla f={f} ondula={0.8} />` |
| FondoNubes | Nubes planas tipo píldora en 3 capas a distinta velocidad | f fondo? color? vel? n? semilla? | nueva (mov-790) | `<FondoNubes f={f} />` |
| FondoBurbujas | Tela cósmica: manchas grandes que flotan y burbujas translúcidas que suben | f fondo? color? vel? n? semilla? | nueva (mov-410) | `<FondoBurbujas f={f} fondo="#3B1675" />` |
| FondoDegradado | Degradado radial que respira (centro, radio y, con `colores2`, color) | f colores? colores2? vel? periodo? id? | nueva | `<FondoDegradado f={f} colores={[C.teal2, C.navy]} colores2={[C.morado, C.navy]} />` |

## Fondos ricos (`fondos-ricos.tsx`) · usar ESTOS en los videos nuevos

Desde el 2026-11-24 (lección del video del SR-71: «los fondos se ven súper básicos»). Reemplazan a `FondoEstrellas`,
`FondoNubes`, `FondoTundra`, `FondoMar`, `Galaxia` y compañía. Cada uno es un escenario completo de 3 a 5 capas con
paralaje, luz y sombra de dos o tres tonos y bruma entre planos; llenan el cuadro y van primero dentro del `<Lienzo>`.
Prueba visual: composición `FondosRicosDemo` (16 escenas de 60 fotogramas; el centro de la escena k es el fotograma 60k+30).

- **Props comunes:** `f`, `camara?` (`{x, y, zoom}`: px que la cámara se movió a la derecha/abajo y su zoom; cada capa
  se mueve según su profundidad, así el paralaje sigue al `RigCamara`/`Enfoque` si le pasas los mismos valores), `vel?`
  (deriva; 0 = quieto salvo titilar y oleaje), `semilla?` (otra disposición) e `id?` (prefijo de degradados y filtros:
  dos fondos del mismo tipo en una escena necesitan ids distintos).
- **Rendimiento:** `EspacioProfundo` usa 3 filtros de ruido (nebulosas en contornos); es el más pesado. `nebulosa={0}`
  lo aligera. Los demás son formas planas.

| Pieza | Qué es | Props principales | Ejemplo |
|---|---|---|---|
| EspacioProfundo | Fondo con degradado, polvo de estrellas, nebulosas de manchas superpuestas con bordes en contornos y polvo oscuro, 0–3 galaxias espirales que giran, estrellas que titilan, estrellas brillantes con destello y planeta opcional (con atmósfera y anillo) | f camara? vel? tono? ("violeta"·"azul"·"rojo"·"verde") colores? ({fondo:[3], nebulosa:[]}) nebulosa? (0..1) galaxias? (0–3) planeta? (true o {x,y,r,color,color2,atmosfera,anillo}) brillantes? semilla? id? | `<EspacioProfundo f={f} tono="azul" galaxias={3} planeta={{ anillo: true }} camara={cam} />` |
| CieloAlto | Cielo por franjas concéntricas a la Tierra, sol con halo, nubes con volumen en 3 profundidades que pasan a distinta velocidad, mar de nubes bajo el horizonte (día/atardecer) o Tierra curva con manchas de tierra (estratosfera), bruma en el horizonte y líneas de velocidad | f camara? vel? momento? ("dia"·"atardecer"·"estratosfera") curvatura? (por defecto solo en estratosfera) horizonte? (760) dir? (1: las nubes van a la izquierda) nubes? (0..2) rafagas? (0..1) sol? semilla? id? | `<CieloAlto f={f} momento="estratosfera" rafagas={0.6} vel={1.5} />` |
| CieloNocturno | Cielo de noche con luna llena (cráteres, halo y rayos suaves), estrellas en 2 capas, nubes oscuras en 3 profundidades con borde iluminado del lado de la luna y colinas con lucecitas | f camara? vel? luna? ({x,y,r}) nubes? suelo? dir? semilla? id? | `<CieloNocturno f={f} luna={{ x: 1400, y: 240 }} />` |
| Paisaje | 3 planos con paralaje y luz: lejano (montañas nevadas, mesetas, cerros de selva o edificios lejanos con niebla), medio (colinas con pinos, dunas, selva con palmas o edificios con ventanas) y cercano (pasto, rocas y pinos; cactus y rocas; helechos y flores; acera, setos y farolas). Cielo con sol o luna y nubes | f camara? vel? (travelling lateral) variante? ("montana"·"desierto"·"selva"·"ciudad") momento? ("dia"·"atardecer"·"noche") horizonte? (600) dir? semilla? id? | `<Paisaje f={f} variante="ciudad" momento="noche" vel={0.5} />` |
| Interior | Sala en perspectiva de un punto: techo, paredes y piso con degradado, columnas y vigas, lámparas con haces de luz y charcos en el piso, reflejo de la pared del fondo y polvo que brilla en la luz. La cámara mueve el punto de fuga (efecto 3D); con la cámara alejada (zoom < 1) la sala se prolonga y siempre llena el cuadro | f camara? variante? ("hangar"·"laboratorio"·"sala") luces? (2–4 por fila) polvo? (0..1) semilla? id? | `<Interior f={f} variante="hangar" camara={{ x: 120, zoom: 1.1 }} />` |
| Oceano | Mar hasta el horizonte: cielo con sol o luna, nubes, filas de olas en perspectiva (degradado de cresta a valle, cresta iluminada, espuma) y columna de reflejo que destella bajo el astro | f camara? vel? momento? ("dia"·"atardecer"·"noche") horizonte? (520) oleaje? (0..2) filas? (10) nubes? semilla? id? | `<Oceano f={f} momento="atardecer" oleaje={1.3} />` |
| NubeVolumen | La nube de 3 tonos (sombra abajo, base, luz hacia la fuente) que usan los fondos; también sirve de copa de árbol o arbusto con tonos verdes. ≈ 300×200 a s=1, x,y = centro de la base | x y s? ancho? (estira) semilla? tonos? ({luz, base, sombra}) luzX? (-1..1) aplana? (vista desde arriba) contraluz? (solo borde iluminado) borde? o? | `<NubeVolumen x={600} y={400} s={1.2} ancho={1.6} luzX={0.8} />` |
| GalaxiaEspiral | Galaxia con brazos de polvo difuminados, estrellas sobre los brazos, disco y núcleo brillante; gira lento | x y f r? rot? incl? (0..1 inclinación) colores? ([brazo, núcleo]) vel? brazos? semilla? id? | `<GalaxiaEspiral x={1400} y={300} r={240} f={f} colores={["#E07BD0", "#FFD7A8"]} />` |
| EstrellaDestello | Estrella brillante con destello de 4 puntas, otro chico en diagonal y halo; titila | x y f r? color? fase? | `<EstrellaDestello x={300} y={200} r={20} f={f} />` |
| PlanetaRico | Planeta con bandas que giran, lado nocturno suave, atmósfera brillante en el borde, borde iluminado y anillo opcional (luz arriba a la izquierda) | x? y? r? color? color2? atmosfera? anillo? f id? | `<PlanetaRico x={1500} y={700} r={220} color="#3E86E0" color2="#8FD0F0" atmosfera="#9FE0FF" f={f} />` |

Tipos: `CamaraFondo`, `TonosNube`, `PlanetaOpc`, `TonoEspacio`, `MomentoCielo`, `VariantePaisaje`, `VarianteInterior`.

Con la cámara: si la escena usa un rig que mueve todo el cuadro, pásale al fondo la misma posición para que las capas
lejanas se queden atrás:
```tsx
const cam = { x: interpolate(f, [w(2), w(6)], [0, 400], fijo), y: 0, zoom: 1 + suave(f, w(6), w(8)) * 0.2 };
<Lienzo><Paisaje f={f} variante="desierto" camara={cam} />…</Lienzo>
```

## Textos con entrada (`textos.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| TextoEntra | Texto con entrada: `letras` (cada letra sube con rebote), `rebote` (escala con sobrepaso), `deslizar` o `maquina` (con cursor). Va en un solo `<text>` con `<tspan>` por letra, con caja opcional, sombra dura, contorno, chispa al final y salida | x y texto f desde? size? modo? color? anchor? vel? dir? caja? ({fondo, pad?, radio?}) sombra? contorno? chispa? ls? weight? sale? | nueva (Big Bang, listas) | `<TextoEntra x={960} y={200} texto="INFLATION" f={f} desde={w(3)} size={110} modo="letras" contorno={C.navy} chispa />` |
| EtiquetaCaja | Caja blanca con texto oscuro que entra con escala, letra a letra, y chispa al final; icono opcional. Se llama así porque `Etiqueta` ya existía | x y texto f desde? size? fondo? tinta? icono? ("usuario"·"check"·"x") chispa? sale? | nueva | `<EtiquetaCaja x={1400} y={260} texto="ALAN GUTH" f={f} desde={w(6)} icono="usuario" />` |
| SelloProhibido | Círculo rojo tachado que cae con rebote (2,2× → 1); `children` = lo prohibido, debajo | x y f desde? r? color? rot? children | nueva | `<SelloProhibido x={1400} y={540} f={f} desde={w(9)}><Tierra x={0} y={0} r={140} f={f} /></SelloProhibido>` |
| Chispa | Chispa de 6 rayitas que salta y se apaga en 10 fotogramas | x y f desde s? color? | nueva | `<Chispa x={1200} y={300} f={f} desde={w(4)} />` |

## Volumen (`volumen.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| DefsVolumen | `<defs>` reutilizables: `url(#vol-sombra)` (sombra suave), `#vol-sombra-dura`, `#vol-brillo` (resplandor), `#vol-grano`, `#vol-vineta` y `#vol-esfera`. Va una vez por Lienzo | pre? sombra? | nueva | `<DefsVolumen />` … `<g filter="url(#vol-sombra)">…</g>` |
| dosTonos() | Luz, base, sombra y brillo de un color (hex) | (color, fuerza?) | nueva | `const t = dosTonos(C.rojo); <path fill={t.sombra} />` |
| aclarar() / oscurecer() / mezclaColor() | Ayudantes de color (la sombra tira a navy, nunca a negro) | (color, t) | nueva | `fill={oscurecer(C.teal, 0.3)}` |
| SombraSuelo | Sombra elíptica bajo un personaje u objeto; `alto` la achica si salta | x y rx? ry? o? alto? color? | nueva | `<SombraSuelo x={700} y={1040} rx={170} />` |
| BrilloEsfera | Degradado y reflejo encima de un círculo para que se vea redondo | cx cy r pre? | nueva | `<BrilloEsfera cx={960} cy={540} r={200} />` |
| Vineta | Bordes oscuros (escenas oscuras) | o? pre? | nueva | `<Vineta o={0.6} />` |
| Grano | Grano leve que cambia cada 2 fotogramas | f o? pre? | nueva | `<Grano f={f} />` |
| Polvo | Motas que flotan delante de todo (profundidad) | f n? color? o? semilla? | nueva | `<Polvo f={f} color={C.amarillo} />` |

## Personaje vivo y piezas vivas (`personaViva.tsx`, `vivas.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| PersonaViva | El personaje del estilo con parpadeo, respiración, cabeza que se mece, cejas y 6 expresiones. La boca se mueve al hablar, hace 6 gestos de brazo con resorte y lleva dos tonos. Tiene la misma silueta que Persona | x y f s? flip? abrigo? piel? pelo? peinado? ("gorro"·"corto"·"largo"·"calvo") expresion? ("normal"·"feliz"·"triste"·"susto"·"enojo"·"duda") habla? (true o [desde, hasta]) gesto? ("ninguno"·"senala"·"saluda"·"piensa"·"celebra"·"explica") gestoDesde? gestoHasta? lentes? barba? fase? | kit (Persona) mejorada | `<PersonaViva x={700} y={1000} s={1.4} f={f} expresion="susto" habla={[w(2), w(9)]} gesto="senala" gestoDesde={w(4)} />` |
| Multitud | N personas variadas en filas con profundidad; parpadean, respiran y algunas hablan; con `reaccion` celebran y saltan | x y f n? w? filas? s? expresion? reaccion? semilla? | nueva | `<Multitud x={960} y={1030} f={f} n={14} filas={2} reaccion={w(8)} />` |
| ManoSostiene | Mano de traje que entra deslizándose con un objeto, flota y sale | x y f desde? hasta? angulo? s? manga? puno? piel? children (el objeto, sin rotar) | nueva (Big Bang, ≥ 6 usos) | `<ManoSostiene x={860} y={620} f={f} desde={w(2)} hasta={w(9)}><Libro x={60} y={-160} s={0.5} /></ManoSostiene>` |
| Incendio | Fuego libre y grande (por defecto 800×480 px): llamas en capas de 3 tonos con núcleo claro que ondulan, lenguas sueltas, brasas, humo de dos tonos que se abre hacia arriba y resplandor. Con `sobre` arde encima de una silueta quemada | x y f w? alto? intensidad? humo? brasas? semilla? sobre? ("casa"·"bosque") | nueva | `<Incendio x={960} y={980} f={f} intensidad={suave(f, w(2), w(4))} sobre="bosque" />` |
| Explosion2 | Explosión completa: destello, onda expansiva, bola de fuego de manchas en 4 colores con núcleo que se vacía, escombros con gravedad y humo; animada «a doses», unos 80 fotogramas | x y f desde? r? escombros? semilla? suelo? | nueva (Big Bang) | `<Explosion2 x={960} y={560} f={f} desde={w(4)} r={260} />` |
| Relampago | Rayo en zigzag con 3 ramas, trazo de 14 px con resplandor difuso y destello del cielo; golpea dos o tres veces en ~18 fotogramas (dale un `semilla` distinto a cada uno: es el id de sus filtros) | x y1 y2 f desde? color? ancho? semilla? flash? deriva? | nueva | `<Relampago x={1150} y1={0} y2={760} f={f} desde={w(6)} />` |
| Olas | Olas en capas con paralaje, cresta de espuma que corre y brillos | f y? altura? agua? vel? capas? espuma? | nueva | `<Olas f={f} y={720} capas={3} />` |

## Aviación (`aviacion.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| Jet | Caza a reacción genérico de perfil, morro a la derecha (≈ 440×150; x,y = centro), dos tonos, sin insignias | x y f s? flip? rot? color? color2? postquemador? apagado? (humo gris) tiembla? | nueva (V10) | `<Jet x={960} y={400} f={f} postquemador={1} />` |
| LlamaTobera | Llama de postquemador con diamantes de choque que sale hacia la izquierda desde (0,0) | f p largo? alto? diamantes? | nueva (V10) | `<g transform="translate(-230,0)"><LlamaTobera f={f} p={1} /></g>` |
| Misil | Misil tierra-aire genérico (≈ 190 de largo), punta a la derecha con rot 0 | x y f s? rot? llama? color? | nueva (V10) | `<Misil x={800} y={500} f={f} rot={-40} />` |
| TrayectoriaMisil | Misil que sale de (x0,y0), pasa por el ápice (ax,ay), se apaga en `quema` y cae; deja la línea gris punteada y estela de humo | x0 y0 ax ay x1? y1? p f s? quema? rastro? colorRastro? | nueva (V10) | `<TrayectoriaMisil x0={1400} y0={730} ax={700} ay={400} p={sale(f, w(3), w(3) + 45)} f={f} />` |
| apiceDebajo() | Ápice determinista por debajo (margen) y detrás de un objetivo, para que la curva se quede corta | (xObj, yObj, semilla, margen?, techo?) | nueva (V10) | `const { ax, ay } = apiceDebajo(1000, 180, 3);` |
| Altimetro | Regla vertical de altitud (marcas cada `paso`, rótulos «10K» size 38), rayas de color y puntero que late | x yBase yTop f max? paso? valor? rayas? color? o? | nueva (V10) | `<Altimetro x={280} yBase={700} yTop={150} f={f} valor={85000} rayas={[{ valor: 70000 }]} />` |
| yAltitud() | y de pantalla de una altitud sobre esa regla | (alt, yBase, yTop, max) | nueva (V10) | `yAltitud(70000, 700, 150, 90000)` |
| Machmetro | Velocímetro de aguja en Mach (240°, zona roja) con «MACH 3.2» y «~2,100 MPH» debajo | x y f mach r? max? roja? mph? (true · texto · false) o? | nueva (V10) | `<Machmetro x={190} y={812} f={f} mach={3.2} r={96} />` |
| Radar | Pantalla de radar con barrido que gira, ecos que se encienden y pastilla de texto debajo | x y f r? blips? ({a, d}[]) texto? textoP? color? vel? | nueva (V10) | `<Radar x={960} y={480} f={f} texto="NOT DETECTED" textoP={pop(f, w(4))} />` |
| Piloto | La PersonaViva (mismo personaje) con traje presurizado, casco de visera y manguera | las de PersonaViva + traje? visera? | nueva (V10) | `<Piloto x={700} y={1000} f={f} s={1.4} habla={[w(1), w(6)]} />` |
| Agente | La PersonaViva de traje oscuro, gafas negras y corbata (rol genérico) | las de PersonaViva | nueva (V10) | `<Agente x={1300} y={1000} f={f} s={1.3} gesto="senala" gestoDesde={w(3)} />` |
| Paracaidas | Paracaídas rojo y blanco que se mece con el Piloto colgado; abre 0..1 lo infla | x y f s? abre? children? | nueva (V10) | `<Paracaidas x={1400} y={interpolate(f, [0, 90], [100, 400])} f={f} />` |
| Satelite | Satélite espía genérico (≈ 560×220) que flota y gira apenas | x y f s? rot? | nueva (V10) | `<Satelite x={1400} y={300} f={f} s={0.8} />` |
| Dron | Dron de vigilancia genérico de perfil con hélice que gira | x y f s? flip? color? | nueva (V10) | `<Dron x={600} y={300} f={f} />` |
| SR71Detallado | SR-71 recreado a partir de una imagen de referencia, de `perfil` o en `planta` (morro a la derecha; largo ≈ 1000 a s=1, piso del perfil en y + 100·s). Chine, cabinas en tándem con vidrio, cascos y reflejo, góndolas con cono móvil, derivas inclinadas, toberas con anillos, paneles, remaches, rejillas y líneas rojas de pasarela; piel negro-azulada en 3 tonos con brillos. Partes animables: `tren` 0..1 (se pliega), `juntas` 0..1 (huecos abiertos en tierra, cerrados con calor), `gotea` 0..1 (gotas que cuelgan, caen y salpican; `ordenGoteo`), `charco`, `calor` (piel al rojo con bordes que brillan), `helada` (escarcha), `postquemador` (Postquemador de efectos-ricos), `cono`, `vibra` y `resalta` ("tren"·"tanques"·"motores"·"cabina"·"juntas"·"postquemador"·"calor"). Sin insignias ni texto | x y f s? vista? flip? rot? tren? juntas? gotea? ordenGoteo? charco? suelo? sombra? calor? helada? postquemador? cono? vibra? resalta? detalle? | nueva (muestra SR-71) | `<SR71Detallado x={1800} y={1150} f={f} s={2.6} tren={1} juntas={1} gotea={0.6} sombra />` |
| TanquesSR71 | Los 6 tanques integrales por dentro (interior de `RayosX`), en las mismas x, y, s que el avión: JP-7 que se mece, cuadernas, J58 en fantasma, `sellador` 0..1 (cordón naranja que recorre los tanques 1→6 con la punta brillante; `curvaSellador="suave"` para ir con una toma suave), `fuga`, `resalta` (índices) | x y f s? vista? flip? nivel? resalta? sellador? curvaSellador? fuga? estructura? motor? | nueva | `<RayosX … exterior={<SR71Detallado … />} interior={<TanquesSR71 x={1800} y={1150} f={f} s={2.6} sellador={p} />} />` |
| CharcoSR71 | Mancha de combustible con la silueta del avión en el concreto (vista de arriba), con brillo húmedo y `contorno` 0..1 que repasa el borde | x y f s? p? contorno? rot? | nueva | `<CharcoSR71 x={1150} y={690} f={f} s={1.25} contorno={fase} />` |
| puntoSR71() / aEscenaSR71() / cicloGota() | Puntos locales de las partes (tanque k, junta k, cabina, trenNariz, trenPrincipal, cono, entrada, motor, tobera, cola, nariz) y su paso al escenario, para apuntar tomas y rótulos; `cicloGota(f, k)` = la gota de la junta k (para sincronizar cubetas) | (vista, parte, k?) · (x, y, s, punto, flip?) · (f, k, suelo?) | nueva | `{ p: 50, ...xy(aEscenaSR71(AX, AY, S, puntoSR71("perfil", "tanque", 0))) }` |
| MotorJ58Corte | Corte del J58 (morro a la derecha, ≈ 1120×270 a s=1): paredes cortadas con rayado, cono móvil (`cono` 0..1 hacia atrás), onda de choque (`choque`), entrada, 6 conductos de derivación, compresor de 9 etapas que gira, cámaras de combustión, turbina, portallamas, postquemador encendido dentro y fuera (`potencia`), tobera con puertas; flechas de aire animadas (`flujo`, `reparto` marca la derivación) y `resalta` ("cono"·"entrada"·"bypass"·"motor"·"postquemador"·"tobera"). Puntos en `J58_PUNTOS` | x y f s? cono? choque? flujo? reparto? potencia? gira? resalta? | nueva | `<MotorJ58Corte x={1560} y={800} f={f} s={1.5} flujo={1} cono={0.6} resalta="motor" />` |

Prueba: composición `MuestraNueva` (`planopop/MuestraNueva.tsx`): tramo real del cap. 4 de V10 con todo lo nuevo (hangar con rayos X, recorrido por los tanques, lupa sobre una junta, cubetas; silueta en el concreto; estratosfera con calor; corte del J58). `--props='{"lamina":1}'` y `'{"lamina":2}'` muestran el avión y el motor quietos.

## Documentos y utilería de datos (`documentos.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| TarjetaVolteo | Tarjeta que se da vuelta como carta (p 0..1) con frente y dorso | x y w h p frente dorso s? fondo? fondoDorso? rot? | nueva (V10) | `<TarjetaVolteo x={960} y={540} w={600} h={400} p={suave(f, w(5), w(6))} frente={…} dorso={…} />` |
| Factura | Recibo largo que se desenrolla (líneas size 40, monto a la derecha, total) con sello debajo de las líneas | x y lineas desenrolla w? titulo? total? sello? selloP? s? | nueva (V10) | `<Factura x={960} y={80} desenrolla={sale(f, w(2), w(6))} lineas={[{ texto: "FUEL", monto: "$$$" }]} sello="BUDGET" selloP={pop(f, w(8))} />` |
| TarjetaTrofeo | Tarjeta de récord (560×600) con copa, cifra (≤ 9 caracteres) y fecha | x y f cifra sub? s? rot? | nueva (V10) | `<TarjetaTrofeo x={700} y={540} f={f} cifra="2,193 MPH" sub="1976" s={pop(f, w(3))} />` |
| Copa | Copa de trofeo dorada con brillo que pasa | x y f s? | nueva (V10) | `<Copa x={960} y={700} f={f} />` |
| Cronometro | Cronómetro de mano con aguja que corre y lectura en pastilla | x y f texto r? corre? s? | nueva (V10) | `<Cronometro x={1500} y={400} f={f} texto="1:04:20" />` |
| TermometroEscala | Termómetro grande con escala (marcas separadas ≥ 48 px), lectura en pastilla y temblor | x y f valor min? max? marcas? unidad? alto? lectura? color? tiembla? s? | nueva (V10) | `<TermometroEscala x={500} y={950} f={f} valor={600} marcas={[-60, 300, 600]} lectura="600 °F" />` |
| RelojArena | Reloj de arena: arena 0..1 cae; gira 0..1 lo voltea | x y f arena? gira? s? | nueva (V10) | `<RelojArena x={1500} y={500} f={f} arena={suave(f, 0, 90)} />` |
| BolsaDinero | Bolsa verde con «$» y ficha de texto debajo | x y f texto? s? | nueva (V10) | `<BolsaDinero x={1300} y={900} f={f} texto="$100 MILLION" />` |
| Medalla | Medalla con cinta y estrella que se mece | x y f s? color? cinta? | nueva (V10) | `<Medalla x={800} y={500} f={f} s={pop(f, w(4))} />` |

## Mapas regionales (`regiones.tsx`)

| Pieza | Qué es | Props principales | Sale de | Ejemplo |
|---|---|---|---|---|
| MapaRegion | Mapa de cualquier zona con polígonos (lon, lat): tierras con sombra y dos tonos, aguas, líneas que se dibujan (fronteras, rutas), puntos que laten y cámara con zoom (textos y puntos no cambian de tamaño) | f region id tierras rect? fondo? mar? tierra? lineas? puntos? cam? redondeo? oscuro? children | nueva (V10) | `<MapaRegion f={f} id="m1" region={{ lon0: 100, lon1: 112, lat0: 15, lat1: 24 }} tierras={[{ pts: VIETNAM, fill: C.rojo2 }]} />` |
| proyRegion() / proyRegionCam() | (lon, lat) → pantalla para esa región (y con cámara), para poner cosas encima | (region, rect?, cam?) | nueva (V10) | `const pr = proyRegion(REG); <Pin {...pr(105.8, 21)} />` |

Tipos: `LonLat`, `Region`, `Rect`, `TierraMapa` (pts, fill, nombre, en, size, o, agua), `LineaMapa` (pts, color, ancho, guion, p, o), `PuntoRegion`, `CamRegion`. Los contornos ya dibujados (URSS, Vietnam, Corea, Báltico, Asia del este, Kuwait) no vienen en esta plantilla: se dibujan con `TierraMapa` a partir de coordenadas reales cuando un video los necesita.

Prueba de todo lo nuevo: composición `BibliotecaDemo` (`planopop/BibliotecaDemo.tsx`, 20 s, 8 escenas de 2,5 s).

## Tiempo: contadores y calendarios (`tiempo.tsx`) · nuevas en V11

| Pieza | Qué es | Props principales | Ejemplo |
|---|---|---|---|
| ContadorRodillo | Contador mecánico de rodillos (odómetro, marcador de feria): el de las unidades gira continuo con decimales y los de la izquierda ruedan al pasar de 9 a 0; caja de dos tonos, tornillos, placa con título (size 38), sombreado de cilindro y vidrio. x,y = esquina; mide w × 174 | x y valor id f? digitos? (3) titulo? w? (330) s? sacude? (0..1 tirón) resalta? (0..1 rodillos amarillos) color? | `<ContadorRodillo x={100} y={100} id="c1" f={f} valor={interpolate(f, [w(2), w(8)], [0, 264], fijo)} titulo="HOURS AWAKE" />` |
| CalendarioMesa | Calendario de mesa con anillos y atril: la hoja de arriba se arranca, se dobla y vuela (parte decimal de `pagina`); taco que adelgaza. Hojas {arriba (franja, ≤ 7 letras), etiqueta? (size 38), grande (≤ 3 caracteres, size 110), abajo?, color?}. x,y = centro de la hoja (240×250) | x y f hojas pagina s? tiembla? vuelo? (1 · −1) w? | `<CalendarioMesa x={1500} y={300} f={f} hojas={HOJAS} pagina={3 + suave(f, w(5), w(5) + 12)} />` |

Utilidades: `anchoContador(digitos)`, `cabe(texto, size, ancho)`, tipo `HojaCalendario`.

## Mente y sueño (`mente.tsx`) · nuevas en V11

| Pieza | Qué es | Props principales | Ejemplo |
|---|---|---|---|
| Cerebro | Cerebro caricatura de dos tonos (≈ 300×200, x,y = centro) con pliegues, surco, cerebelo, tallo y brillo; late. `cansancio` lo apaga de color y lo encorva; `apagon` lo pone negro (microsueño); `cara` opcional | x y f s? color? cansancio? brillo? apagon? cara? ("ninguna"·"normal"·"cansado"·"dormido"·"feliz") | `<Cerebro x={960} y={400} f={f} s={1.4} cansancio={suave(f, w(2), w(9))} />` |
| BateriaSegmentos | Batería por partes: segmentos que se vacían de verde a amarillo a rojo, con icono y nombre (vertical, filas ≥ 66 px para texto de 38) o solo icono (horizontal); parpadeo de los rojos, apagón negro con estática, barrido de recarga, segmento resaltado. x,y = esquina | x y f niveles (0..1 c/u) w h orientacion? etiquetas? iconos? (Sintoma[]) parpadeo? apagon? carga? resalta? s? | `<BateriaSegmentos x={700} y={200} f={f} w={420} h={500} niveles={[1, 0.4, 0.1]} etiquetas={["EYES", "MOOD", "FOCUS"]} iconos={["ojo", "animo", "foco"]} />` |
| BarraNivel | Barra vertical de nivel con rótulo girado dentro (size ≥ 38) e icono opcional debajo; brilla cuando está llena | x y f w h nivel color? etiqueta? icono? s? | `<BarraNivel x={1200} y={200} f={f} w={70} h={500} nivel={1} etiqueta="BODY" />` |
| IconoSintoma | Icono blanco de una capacidad: `ojo`, `equilibrio`, `animo`, `memoria`, `habla`, `foco`, `vigilante` (ojo con rayitas), `cuerpo`, `rayo` | x y tipo r? color? | `<IconoSintoma x={300} y={300} tipo="memoria" r={30} />` |
| TiraEEG | Papel milimetrado que corre con la pluma: ondas rápidas y apretadas (despierto) que entre `lentoDesde` y `lentoHasta` pasan a lentas y anchas (sueño, microsueño), con rótulo amarillo sobre el tramo lento; `amplitud` 0 = línea plana | x y f w h lentoDesde? lentoHasta? amplitud? vel? etiqueta? color? s? semilla? | `<TiraEEG x={200} y={600} f={f} w={1500} h={260} lentoDesde={w(6)} lentoHasta={w(6) + 40} etiqueta="MICROSLEEP" />` |
| CablesEEG | Electrodos de colores y cables sobre la cabeza de una PersonaViva (mismas x, y, s, f, flip, fase; ponlo después de ella); `p` los va poniendo | x y f s? flip? fase? p? hacia? | `<CablesEEG x={960} y={1000} f={f} s={1.3} p={sale(f, w(3), w(6))} />` |
| Zzz | «Z z z» que suben meciéndose y se desvanecen | x y f s? n? color? o? | `<Zzz x={800} y={400} f={f} />` |
| OjoVigilante | Ojo grande que mira a los lados, parpadea y vibra con rayitas (paranoia, vigilancia); amable | x y f s? mira? ([−1..1, −1..1]) abre? iris? id? | `<OjoVigilante x={1400} y={400} f={f} s={0.8} id="ojo1" />` |
| Osciloscopio | Aparato con pantalla verde: traza que ondula (voz con entonación) o se aplana (`plano` 1) | x y f s? plano? etiqueta? | `<Osciloscopio x={960} y={540} f={f} plano={suave(f, w(3), w(5))} />` |
| Rata | Rata de laboratorio amable de lado (≈ 260×130): camina, duerme (ojos cerrados), electrodos chiquitos con cable que sube; sin heridas | x y f s? flip? camina? dormida? cables? color? | `<Rata x={700} y={800} f={f} camina={1} cables />` |

Utilidades: `colorNivel(n)` (verde → amarillo → rojo), `VERDE_NIVEL`, tipo `Sintoma`.

## Objetos cotidianos (`cotidiano.tsx`) · nuevos en V11, sin marcas

x,y = base al centro salvo que se diga. Todos en dos tonos con sombra.

| Pieza | Qué es | Props principales | Ejemplo |
|---|---|---|---|
| Tocadiscos | Tocadiscos de maleta de los 60 con disco que gira, brazo y notas que salen (≈ 440×230) | x y f s? notas? color? gira? | `<Tocadiscos x={960} y={800} f={f} notas={1} />` |
| BotellaSoda | Botella de vidrio sin etiqueta con refresco y burbujas (≈ 100×320) | x y f s? rot? vidrio? liquido? id? | `<BotellaSoda x={500} y={800} f={f} id="b1" />` |
| Ducha | Brazo de tubo y regadera con chorro de gotas; `frio` = vaho azul y escarcha (x,y = regadera) | x y f s? agua? alto? frio? | `<Ducha x={1300} y={200} f={f} frio={1} />` |
| Pinball | Máquina de pinball sin marca, de 3/4 (≈ 440×700): marcador de 6 cifras, arte de estrellas, bumpers que se encienden, flippers que golpean en `golpes`, bola | x y f s? puntos? luces? golpes? color? | `<Pinball x={1400} y={1000} f={f} puntos={interpolate(f, [0, 90], [0, 98000])} golpes={[w(3)]} />` |
| AroBasket / Balon | Aro de entrada de casa con red que se mece y tiro que entra (`tiro` 0..1); balón con líneas y brillo (x,y = centro) | AroBasket: x y f s? tiro? desdeX? desdeY? flip? · Balon: x y r? rot? | `<AroBasket x={1500} y={1000} f={f} tiro={sale(f, w(4), w(4) + 24)} />` |
| CamaraFlash | Cámara de prensa de los 60 con fuelle y reflector; destello con rayos en cada fotograma de `dispara` (x,y = centro de la caja) | x y f s? dispara? flip? rot? | `<CamaraFlash x={400} y={500} f={f} dispara={[w(2), w(5)]} />` |
| Microfonos | Micrófonos de rueda de prensa (1–5) sobre la mesa | x y f s? n? | `<Microfonos x={960} y={900} f={f} n={4} />` |
| Periodico | Periódico con cabecera inventada, titular de 1–3 líneas, foto y columnas (x,y = centro, ≈ 560×720) | x y titular s? rot? nombre? fecha? children? | `<Periodico x={960} y={540} titular={["TEEN STAYS", "AWAKE"]} />` |
| RadioVieja | Radio de mesa con rejilla, dial y perillas; `senal` = ondas, `estatica` = la señal se corta | x y f s? senal? estatica? color? | `<RadioVieja x={960} y={800} f={f} senal={1} estatica={suave(f, w(3), w(5))} />` |
| TelefonoDisco | Teléfono de disco; `suena` tiembla con rayitas, `levantado` sube el auricular | x y f s? suena? levantado? color? | `<TelefonoDisco x={600} y={800} f={f} suena />` |
| BalanzaPlatos | Balanza de dos platos; `inclina` −1..1; `izq`/`der` = lo que va en cada plato (origen en el plato) | x y f s? inclina? izq? der? | `<BalanzaPlatos x={960} y={1000} f={f} inclina={0} izq={<T …>11 DAYS</T>} />` |
| FrascoPastillas | Frasco de farmacia con pastillas, sin marca | x y s? rot? color? | `<FrascoPastillas x={500} y={700} />` |
| Almohada / Cama | Almohada con volumen (`aplasta`); cama de lado con cabecera, colchón y cobija | Almohada: x y s? rot? aplasta? color? · Cama: x y s? w? cobija? almohada? flip? | `<Cama x={960} y={950} w={800} />` |
| Lapiz | Lápiz amarillo (x,y = punta; rot 0 = punta a la izquierda) | x y s? rot? | `<Lapiz x={800} y={500} rot={-50} />` |
| Archivador | Archivador de 3 cajones; `abre` saca el de arriba y muestra `dentro` | x y s? abre? color? dentro? etiquetas? | `<Archivador x={1400} y={1000} abre={suave(f, w(2), w(4))} dentro={<Libro … />} />` |
| PantallaPC | Monitor moderno con barra de navegador; children en 0..sw × 0..sh (x,y = centro de la pantalla) | x y s? sw? sh? barra? fondo? id? children | `<PantallaPC x={960} y={480} id="pc1">…</PantallaPC>` |
| LibroGrueso | Libro de tapa dura con título dorado; `abre` gira la tapa y muestra hojas (x,y = centro) | x y s? rot? titulo? subtitulo? abre? color? | `<LibroGrueso x={960} y={540} titulo="RECORDS" abre={1 - suave(f, w(3), w(5))} />` |
| Escarapela | Escarapela de premio con cintas (texto ≤ 9 letras; x,y = centro) | x y f s? texto? color? rot? | `<Escarapela x={1300} y={400} f={f} texto="1ST PLACE" />` |
| CascoFutbol | Casco de fútbol americano de lado, sin logo (x,y = centro) | x y s? rot? color? franja? flip? | `<CascoFutbol x={960} y={500} s={1.2} />` |
| Cuadro | Cuadro enmarcado con lo que quieras dentro (0..w × 0..h); `gris` lo destiñe, `brillo` lo hace portada (x,y = centro) | x y w h f id s? rot? marco? fondo? gris? brillo? children | `<Cuadro x={600} y={500} w={420} h={520} f={f} id="q1" gris={1}>…</Cuadro>` |

Utilidad: `anchoRotulo(texto, size)`.

## Años 60 (`epoca60.tsx`) · nuevas en V11

Los escenarios llenan 0..w × 0..h (dibujados en 1920×1080 y encajados con `cubreCaja(w, h)`): ponlos primero dentro del `RigCamara` con el tamaño del escenario. `luz` 0..1 = penumbra → luz.

| Pieza | Qué es | Props principales | Ejemplo |
|---|---|---|---|
| Sala60 | Sala de los 60: papel tapiz con estrellitas atómicas, friso de madera, ventana con persiana y palmera (día o noche), rayo de sol, sofá, lámpara de pie, cuadro abstracto y alfombra. Piso en y ≈ 0,8·h | f w? h? luz? noche? tapiz? sofa? | `<Sala60 f={f} w={3000} h={1700} luz={0.3} noche />` |
| Pasillo60 | Pasillo en perspectiva de un punto con rayas, puertas, alfombra corrida, lámpara y ventana al fondo; `paredes` 0..1 para fundirlo con otra cosa. `PASILLO_VP` = punto de fuga y pared del fondo | f w? h? luz? paredes? tapiz? | `<Pasillo60 f={f} />` |
| Diner60 | Restaurante de mostrador: azulejos, pizarra con dibujos, vitrina de pasteles, tazas, lámparas, mostrador rojo con cromo, taburetes y piso de cuadros | f w? h? luz? | `<Diner60 f={f} />` |
| CasaSuburbana | Casa de un piso del sur de California con techo bajo, ventanal, puerta, garaje, chimenea, arbustos, entrada y palmera (≈ 1300×560; x,y = base) | x y f s? luz? palmera? color? flip? | `<CasaSuburbana x={900} y={950} f={f} luz={1} />` |
| Auto60 | Sedán con aletas y cromados, ruedas que giran (`rueda` en grados), faros, humo (≈ 680×210; mira a la derecha) | x y f s? color? techo? rueda? luces? flip? humo? | `<Auto60 x={interpolate(f, [0, 90], [-400, 2300])} y={900} f={f} rueda={f * 14} />` |
| EdificioBlanco | Edificio institucional de dos pisos con columnas, escalones, asta y banderín; `insignia` "ancla" (marina) o "cruz" (azul), `cartel` sobre la entrada (≈ 1200×520) | x y f s? insignia? cartel? luz? color? | `<EdificioBlanco x={960} y={950} f={f} insignia="ancla" />` |
| CabinaRadio | Cabina de radio: ON AIR que late, locutor en silueta con audífonos, micrófono de brazo, consola y `cartel` pegado en el vidrio (≈ 940×700) | x y f s? cartel? cartelP? aire? habla? | `<CabinaRadio x={960} y={1000} f={f} cartel="260 HRS" cartelP={pop(f, w(4))} />` |
| Ancla | Insignia de ancla (≈ 100×120; x,y = centro) para gorras, edificios y hojas | x y s? color? | `<Ancla x={960} y={300} s={0.5} />` |

Utilidades: `cubreCaja(w, h)` (el transform que encaja 1920×1080 en w×h), `PASILLO_VP`.

Las piezas del video del insomnio (marcador con contador de horas, calendario y batería del cerebro; el muchacho, sus amigos, el investigador de la Marina y el científico; la hoja de restar siete, la moneda, el disco de las ratas…) están en `v11/piezas.tsx`: cópialas aquí si otro video las necesita.

## Mar y barcos (`mar.tsx`) · nuevas en V12

Todos los barcos van de perfil, proa a la derecha, x,y = línea de flotación al centro; se mecen solos (`mece` 0..2), se
escoran (`inclina`), se hunden en plano lejano (`hunde` 0..1) y se recortan solos en la línea del agua, así que se ponen
ENCIMA de `Oceano` o `MarTormenta` con y ≈ horizonte + 120…300. `bajoAgua` 0..1 deja ver la obra viva (cortes),
`avanza` 0..1 = espuma de proa y estela, `luces` 0..1 = de noche, `humo` = chimenea, `recorta={false}` para naufragios.
Sin nombres, banderas ni marcas.

| Pieza | Qué es | Props principales | Ejemplo |
|---|---|---|---|
| Carbonero | Carbonero de 1910 (tipo USS Cyclops, ≈ 1210 × 480): casco gris, puente a proa, seis grúas en forma de marco, chimenea a popa. `carga` lo hunde hasta la borda; `corte` muestra bodegas con mineral y motor; `motorRoto` = grieta roja en un cilindro | flotación + luces? humo? carga? corte? motorRoto? | `<Carbonero x={960} y={700} f={f} s={0.9} carga={1} humo avanza={0.6} />` |
| CargueroVapor | Carguero chico de vapor de los 20 (tipo Cotopaxi, ≈ 810 × 420), tres islas, chimenea crema. `naufragio` 0..1 = en el fondo con corales, algas, peces, palos rotos y medio enterrado | flotación + luces? humo? naufragio? | `<CargueroVapor x={960} y={820} f={f} naufragio={1} recorta={false} mece={0} />` |
| Tanquero | Tanquero de los 40 (tipo T2, ≈ 1310 × 380): puente al medio, máquinas a popa, pasarela y tuberías. `PUNTOS_TANQUERO.vigia` = dónde va el vigía | flotación + luces? humo? | `<Tanquero x={960} y={760} f={f} s={1.2} luces={1} />` |
| Lancha | Lancha de paseo con cabina (≈ 450 × 200); `variante="guardacostas"` = franja roja, luces que alternan y reflector (`foco`) | flotación + luces? variante? tripulantes? (0–2 siluetas) foco? | `<Lancha x={900} y={700} f={f} s={1.4} luces={1} tripulantes={2} />` |
| VeleroAlto | Goleta de dos palos inclinados (clíper de Baltimore, ≈ 820 × 760): cangrejas, gavia, foques, gallardete | flotación + viento? (0..1,5 hincha las velas) tripulacion? luces? | `<VeleroAlto x={900} y={720} f={f} s={0.8} viento={1.2} inclina={-14} />` |
| Crucero | Crucero moderno genérico (≈ 1410 × 420): seis cubiertas con ventanas, botes naranjas, chimenea con franja | flotación + luces? franja? | `<Crucero x={1000} y={760} f={f} s={0.9} avanza={0.8} />` |
| MarTormenta | Fondo: nubarrones en 3 capas que corren, lluvia, relámpagos en `rayos` y filas de olas picadas con cresta iluminada y espuma | f camara? intensidad? (0 calma … 1 tormenta) noche? lluvia? rayos? horizonte? (520) filas? | `<MarTormenta f={f} intensidad={suave(f, w(2), w(6))} rayos={[w(5)]} />` |
| FondoMarino | Fondo del fondo del mar: abismo, rayos de luz, rocas con paralaje, piso y nieve marina; `oscuro` lo apaga | f camara? oscuro? suelo? (820) | `<FondoMarino f={f} oscuro={0.7} />` |
| Sumergible | Sumergible amarillo (≈ 380 × 190) con ventana, brazo, focos y cono de luz (`luz`) | x y f s? flip? rot? luz? | `<Sumergible x={500} y={520} f={f} luz={1} />` |
| ArrecifeCorte | Agua poco profunda en corte: superficie, agua turquesa, arena y corales que casi tocan la superficie | x y (superficie) w? prof? f | `<ArrecifeCorte x={960} y={620} w={2000} prof={300} f={f} />` |
| Salvavidas | Salvavidas de anillo que flota | x y f r? rot? | `<Salvavidas x={1300} y={640} f={f} />` |
| Huracan | Huracán visto desde arriba (para mapas), gira antihorario | x y f r? o? giro? | `<Huracan x={900} y={400} f={f} r={110} />` |
| CorrienteRio | Corriente que corre como río por `puntos` de pantalla: franja translúcida, rayas que fluyen y flechas | puntos f p? ancho? color? vel? flechas? | `<CorrienteRio puntos={[[300, 900], [500, 500], [900, 120]]} f={f} p={suave(f, w(2), w(5))} />` |
| BrujulaDoble | Brújula náutica de latón: aguja `verdadero` (roja) y `magnetico` (teal), pastillas TRUE / MAGNETIC, y `out` = gira loca con letrero OUT | x y f r? verdadero? magnetico? etiquetas? out? textoOut? rumbo? | `<BrujulaDoble x={960} y={560} f={f} magnetico={-14} etiquetas={pop(f, w(4))} />` |
| Anemometro | Tacitas que giran y esfera de 0 a 100 MPH con zonas y aguja que tiembla; pastilla de lectura | x y f valor r? max? texto? textoP? | `<Anemometro x={1500} y={620} f={f} valor={rafagaViento(f, w(5))} texto="60–90 MPH" />` |

Utilidades: `rafagaViento(f, en, de?, a?, dura?)`, `PUNTOS_CARBONERO`, `PUNTOS_TANQUERO`, tipo `BarcoProps`.

## Aviones de los 40 (`aviacion40.tsx`) · nuevas en V12

De perfil, morro a la derecha, esquema de la Marina de 1945 (`MARINA45`), sin insignias; hélices de canto que giran.

| Pieza | Qué es | Props principales | Ejemplo |
|---|---|---|---|
| TorpederoTBM | Torpedero de un motor (TBM Avenger, ≈ 1050 × 330): capó radial, cabina larga de vidrio con tripulantes, torreta de bola, deriva alta. `hundido` = en el fondo del mar; `resaltaNumero` = halo en el número de cola | x y f s? flip? rot? helice? numero? tripulacion? luces? hundido? vibra? resaltaNumero? | `<TorpederoTBM x={960} y={500} f={f} s={0.9} numero="28" />` |
| FormacionTBM | n torpederos (5) en escalón con profundidad; `o` = opacidad de cada uno (se apagan) | x y f s? n? o? separa? baja? flip? numeros? luces? | `<FormacionTBM x={1100} y={460} f={f} s={0.5} />` |
| HidroavionPBM | Hidroavión de casco de bote (PBM Mariner, ≈ 1120 × 420): ala de gaviota con dos motores, flotador, cola doble; `faro`, `espuma` (carrera de despegue) | x y f s? flip? rot? helices? numero? luces? faro? espuma? vibra? | `<HidroavionPBM x={960} y={520} f={f} s={0.8} luces faro={0.6} />` |
| Avioneta | Avioneta de ala alta (≈ 470 × 190) con piloto en la ventana | x y f s? flip? rot? color? piloto? lentes? | `<Avioneta x={900} y={400} f={f} piloto={1} lentes />` |
| HeliceCanto | Hélice de canto (disco borroso + palas); `dobladas` para naufragios | x y f largo? n? gira? vel? angulo? dobladas? color? | `<HeliceCanto x={500} y={0} f={f} />` |

## Archivo e investigación (`archivo.tsx`) · nuevas en V12

| Pieza | Qué es | Props principales | Ejemplo |
|---|---|---|---|
| MaquinaEscribir | Máquina de escribir de frente que teclea `lineas` letra por letra (`p` 0..1): el carro se corre, las teclas saltan y una barra golpea. Letra monoespaciada (`FUENTE_MAQUINA`, ≈ 0,6 × size por letra; ≤ 18 letras por renglón a 40) | x y f lineas? p? s? color? size? hoja? | `<MaquinaEscribir x={960} y={960} f={f} lineas={["UNCERTAIN AS TO", "IN WHAT POSITION"]} p={sale(f, w(3), w(9))} />` |
| LectorMicrofilm | Lector de microfilm de los 70 con un periódico que corre (`avance`), titular y recuadro amarillo (`resalta`) | x y f avance? titular? resalta? s? | `<LectorMicrofilm x={700} y={980} f={f} avance={suave(f, w(2), w(6))} titular="SHIP LOST" />` |
| PilaCartas | Sobres que salen volando (`salen`) y vuelven con sello oficial a otra pila (`vuelven`) | x y f salen? vuelven? n? dx? s? | `<PilaCartas x={700} y={800} f={f} salen={sale(f, w(3), w(8))} />` |
| FilaDomino | Fichas de dominó de pie con rótulo debajo (líneas de ≤ 13 letras a 40) que caen en cadena (`p` = cuántas cayeron) | x y f rotulos p? ancho? (350) iconos? s? aparece? | `<FilaDomino x={180} y={760} f={f} p={interpolate(f, [w(4), w(14)], [0, 5], fijo)} rotulos={[["COMPASSES", "OUT"], ["FUEL"]]} />` |
| SalaBiblioteca | Fondo: biblioteca universitaria de los 70 (estanterías, fluorescentes, alfombra naranja, fichero, mostrador) con paralaje | f camara? mostrador? fichero? | `<SalaBiblioteca f={f} camara={useCamaraFondo()} />` |
| Taza | Taza de café con vapor | x y f s? color? vapor? | `<Taza x={900} y={1000} f={f} />` |


## Sonidos (`public/sfx/`)

La plantilla no trae los sonidos (la licencia de Mixkit no deja repartirlos en una plantilla). Los baja cada usuario con `scripts/bajar_audio.sh` de la skill: WAV 44,1 kHz a −16 LUFS, con nombres `familia-N.wav`. La lista con el id de Mixkit de cada uno está en `scripts/sonidos.tsv` de la skill. Solo existen los que bajó el script: antes de usar uno, `ls public/sfx/`.

Familias y variantes (usa el número para alternar):
- **Interfaz:** `pop` 1–4, `burbuja` 1–3, `clic` 1–4, `interruptor` 1–3, `notificacion` 1–4, `exito` 1–3, `ding` 1–3, `fallo` 1–3, `glitch` 1–4, `camara-fotos` 1–3, `encendido` 1–2.
- **Movimiento:** `whoosh` 1–4 (aire), `swoosh` 1–4 (transición de escena), `riser` 1–4 (tensión que sube), `caida` 1–3.
- **Golpes:** `madera` 1–4, `golpe-metal` 1–4, `impacto-cine` 1–4, `golpe` 1–3, `romper` 1–2, `vidrio` 1–3, `brindis` 1–3, `crujido` 1–3, `metal-cae` 1–3.
- **Explosiones:** `explosion-lejana` 1–4, `explosion-cercana` 1–4, `explosion-aire` 1–3 (fuegos artificiales), `explosion-grande` 1–4.
- **Aviación y militar:** `misil` 1–4 (lanzado), `jet-pasa` 1–4 (avión pasando), `motor-jet` 1–3, `helice` 1–3 (helicóptero), `sirena` 1–3, `alarma` 1–3, `radar` 1–3 (ping y escáner).
- **Oficina y datos:** `teclado` 1–3, `maquina-escribir` 1–3, `papel` 1–3, `firma` 1–3, `dinero` 1–3, `reloj` 1–3, `cuenta-regresiva` 1–3, `campana` 1–3, `timbre` 1–2, `puerta` 1–3, `ascensor` 1–2.
- **Gente:** `aplausos` 1–3, `multitud` 1–3, `abucheo` 1, `gasp` 1–3 (jadeo de sorpresa), `pasos` 1–3, `paso-gigante` 1–2, `latido` 1–3.
- **Naturaleza:** `viento` 1–3, `trueno` 1–3, `tormenta` 1–3, `olas` 1–3, `chapuzon` 1–3, `fuego` 1–3, `encendedor` 1–3.
- **Electricidad:** `chispa` 1–3, `electricidad` 1–3.

Reglas:
- **Un mismo archivo, máximo 3 veces por capítulo.** Si hace falta más, se alterna con otro número de la familia (`pop-1`, `pop-2`, …) o con otra familia.
- **El sonido corresponde a lo que pasa en pantalla** (un `pop` cuando algo aparece, una explosión cuando algo explota). Nada de sonido de adorno sin nada que lo justifique.
- Las pasadas y ambientes (`jet-pasa`, `viento`, `fuego`, `multitud`…) duran hasta 6 s; el resto, hasta 3 s. Se eligieron por título y duración, sin oírlos: la primera vez que se usen en un render, comprueba en la hoja que casan con la imagen.
- No se pueden redistribuir sueltos (licencia de Mixkit): solo dentro de los videos.
