// Lista de los videos largos hechos con el molde `Completo.tsx` (uno por carpeta `planopop/vNN/`).
// `scripts/armar_video.py` de la skill agrega aquí una línea de import y una entrada por video nuevo.
// Root.tsx registra solo: la composición completa («V01») y cada capítulo suelto («V01Cap01»…).
import { crearCompleto, VideoPop } from "./Completo";

export const VIDEOS: VideoPop[] = [
];

export const COMPLETOS = VIDEOS.map((v) => ({ v, ...crearCompleto(v) }));
