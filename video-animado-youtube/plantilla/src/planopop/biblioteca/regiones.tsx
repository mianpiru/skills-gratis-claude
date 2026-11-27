// Biblioteca Plano Pop · mapa regional genérico: cualquier zona del mundo a partir de polígonos (lon, lat) simples.
// Lo usan los mapas de V10 (URSS, Vietnam, Corea, Báltico, Asia, Kuwait) y sirve para cualquier otro video:
// le pasas la caja (lon/lat), las tierras, líneas (fronteras, rutas) y puntos. Proyección equirrectangular con la
// corrección del coseno de la latitud media, escala uniforme y centrada en el rectángulo.
import React from "react";
import { C, T } from "../kit";
import { PB } from "./paleta";
import { dosTonos } from "./volumen";

export type LonLat = [number, number];
export type Region = { lon0: number; lon1: number; lat0: number; lat1: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type TierraMapa = {
  pts: LonLat[];
  fill?: string;
  /** rótulo dentro de la tierra (size 44 por defecto), en `en` (lon, lat) */
  nombre?: string;
  en?: LonLat;
  size?: number;
  o?: number;
  /** true = es agua (lago, mar interior): se pinta del color del mar, sin sombra */
  agua?: boolean;
};
export type LineaMapa = { pts: LonLat[]; color?: string; ancho?: number; guion?: string; p?: number; o?: number };
export type PuntoRegion = {
  lon: number;
  lat: number;
  nombre?: string;
  o?: number;
  color?: string;
  r?: number;
  dx?: number;
  dy?: number;
  anchor?: "start" | "middle" | "end";
  late?: boolean;
};
export type CamRegion = { lon: number; lat: number; z: number };

/** Proyección de una región a un rectángulo de pantalla: (lon, lat) → {x, y}. */
export const proyRegion = (reg: Region, rect: Rect = { x: 0, y: 0, w: 1920, h: 1080 }) => {
  const cosM = Math.cos((((reg.lat0 + reg.lat1) / 2) * Math.PI) / 180);
  const k = Math.min(rect.w / ((reg.lon1 - reg.lon0) * cosM), rect.h / (reg.lat1 - reg.lat0));
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const lonC = (reg.lon0 + reg.lon1) / 2;
  const latC = (reg.lat0 + reg.lat1) / 2;
  return (lon: number, lat: number) => ({ x: cx + (lon - lonC) * cosM * k, y: cy - (lat - latC) * k });
};

/** Lo mismo con la cámara (zoom z sobre lon, lat, llevado al centro del rectángulo): para poner cosas fijas encima. */
export const proyRegionCam = (reg: Region, rect: Rect = { x: 0, y: 0, w: 1920, h: 1080 }, cam?: CamRegion) => {
  const pr = proyRegion(reg, rect);
  if (!cam) return pr;
  const c = pr(cam.lon, cam.lat);
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  return (lon: number, lat: number) => {
    const p = pr(lon, lat);
    return { x: cx + (p.x - c.x) * cam.z, y: cy + (p.y - c.y) * cam.z };
  };
};

const pathDe = (pts: LonLat[], pr: (lon: number, lat: number) => { x: number; y: number }, cerrar = true) =>
  pts
    .map(([lo, la], k) => {
      const p = pr(lo, la);
      return `${k ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ") + (cerrar ? " Z" : "");

/**
 * Mapa regional genérico. region = caja lon/lat; rect = dónde va en pantalla (por defecto pantalla completa).
 * fondo = color de fondo (mar, o tierra si dibujas los mares como `agua`); mar = color de lo `agua` (por
 * defecto = fondo); tierras se pintan en orden con sombra plana y dos tonos;
 * lineas = fronteras o rutas (guion "14 12" = punteada; p 0..1 la dibuja); puntos con pop (o) y latido.
 * cam {lon, lat, z} acerca la cámara (textos y puntos mantienen su tamaño). id = clipPath único por escena.
 * children se dibujan en coordenadas del mapa sin cámara (usa proyRegion) y siguen al zoom.
 */
export const MapaRegion: React.FC<{
  f: number;
  region: Region;
  id: string;
  rect?: Rect;
  fondo?: string;
  mar?: string;
  tierra?: string;
  tierras: TierraMapa[];
  lineas?: LineaMapa[];
  puntos?: PuntoRegion[];
  cam?: CamRegion;
  redondeo?: number;
  oscuro?: number;
  children?: React.ReactNode;
}> = ({
  f,
  region,
  id,
  rect = { x: 0, y: 0, w: 1920, h: 1080 },
  fondo = PB.agua2,
  mar,
  tierra = C.teal2,
  tierras,
  lineas = [],
  puntos = [],
  cam,
  redondeo = 0,
  oscuro = 0,
  children,
}) => {
  const pr = proyRegion(region, rect);
  const z = cam?.z ?? 1;
  const c = cam ? pr(cam.lon, cam.lat) : { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const tr = `translate(${cx},${cy}) scale(${z}) translate(${-c.x},${-c.y})`;
  const ola = Math.sin(f / 40) * 6;
  return (
    <g>
      <defs>
        <clipPath id={`reg-${id}`}>
          <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={redondeo} />
        </clipPath>
      </defs>
      <g clipPath={`url(#reg-${id})`}>
        <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill={fondo} />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <path
            key={k}
            d={`M${rect.x - 40},${rect.y + 90 + k * (rect.h / 6) + ola} q60,-14 120,0 t120,0 t120,0`}
            stroke={C.blanco}
            strokeWidth={4}
            fill="none"
            opacity={0.07}
            transform={`translate(${((f * 0.6 + k * 230) % (rect.w + 200)) - 100},0)`}
          />
        ))}
        <g transform={tr}>
          {tierras.map((t, k) =>
            t.agua ? null : <path key={`s${k}`} d={pathDe(t.pts, pr)} fill="rgba(18,12,46,0.35)" transform={`translate(${6 / z},${9 / z})`} />,
          )}
          {tierras.map((t, k) => {
            const col = t.agua ? mar ?? fondo : t.fill ?? tierra;
            return (
              <g key={k} opacity={t.o ?? 1}>
                <path d={pathDe(t.pts, pr)} fill={col} stroke={t.agua ? "none" : dosTonos(col).sombra} strokeWidth={3 / z} strokeLinejoin="round" />
              </g>
            );
          })}
          {lineas.map((l, k) => {
            const d = pathDe(l.pts, pr, false);
            const p = l.p ?? 1;
            if (p <= 0.001) return null;
            return (
              <path
                key={k}
                d={d}
                stroke={l.color ?? C.blanco}
                strokeWidth={(l.ancho ?? 6) / z}
                strokeDasharray={l.guion ? l.guion.split(" ").map((v) => Number(v) / z).join(" ") : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={l.o ?? 1}
                pathLength={l.guion ? undefined : 1}
                {...(l.guion ? {} : { strokeDashoffset: 1 - p, strokeDasharray: "1 1" })}
              />
            );
          })}
          {children}
          {tierras.map((t, k) =>
            t.nombre && t.en ? (
              <g key={`n${k}`} opacity={t.o ?? 1}>
                <T x={pr(t.en[0], t.en[1]).x} y={pr(t.en[0], t.en[1]).y} size={(t.size ?? 44) / z} fill={C.blanco} borde={C.navy} ls={4 / z}>
                  {t.nombre}
                </T>
              </g>
            ) : null,
          )}
          {puntos.map((p, k) => {
            const o = p.o ?? 1;
            if (o <= 0.01) return null;
            const q = pr(p.lon, p.lat);
            const r = ((p.r ?? 14) + (p.late === false ? 0 : Math.sin(f / 6 + k) * 2)) / z;
            return (
              <g key={`p${k}`}>
                {p.late === false ? null : (
                  <circle cx={q.x} cy={q.y} r={r * (1.6 + ((f + k * 7) % 30) / 15)} fill="none" stroke={p.color ?? C.amarillo} strokeWidth={4 / z} opacity={0.6 * (1 - ((f + k * 7) % 30) / 30) * o} />
                )}
                <circle cx={q.x} cy={q.y} r={r * o} fill={p.color ?? C.amarillo} stroke={C.navy} strokeWidth={4 / z} />
                {p.nombre ? (
                  <T x={q.x + (p.dx ?? 0) / z} y={q.y + (p.dy ?? -30) / z} size={40 / z} anchor={p.anchor ?? "middle"} borde={C.navy} opacity={o}>
                    {p.nombre}
                  </T>
                ) : null}
              </g>
            );
          })}
        </g>
        {oscuro > 0.01 ? <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill={C.negro} opacity={0.55 * oscuro} /> : null}
      </g>
    </g>
  );
};
