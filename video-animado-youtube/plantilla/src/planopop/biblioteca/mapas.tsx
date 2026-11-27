// Biblioteca Plano Pop · mapas: EE. UU. con estados y cámara, mapa del mundo y arco entre dos puntos. El pin es `Pin` de ../kit
// Piezas COPIADAS de los videos viejos (los originales siguen en su sitio y no se tocan) con props genéricas.
// Todas van dentro de <Lienzo> (1920×1080). f = fotograma local de la escena; s = escala (1 = tamaño base).
// Catálogo con ejemplos: ./CATALOGO.md
import React from "react";
import { C, T } from "../kit";
import { PB as P, anchoT, lim } from "./paleta";
import { Copos, NubeMancha } from "./fenomenos";

// del canal original
type LL = [number, number];

// del canal original
export type Cam = {
  lon: number;
  lat: number;
  z: number;
  cx?: number;
  cy?: number;
};

// del canal original
export const ptUS = (lon: number, lat: number) => ({
  x: 80 + (lon + 124.8) * 23.31,
  y: 170 + (49.4 - lat) * 30,
});

// del canal original
export const MAPA_CENTRO = { lon: -95.85, lat: 37.0 };

// del canal original
export const proyecta = (cam?: Cam) => {
  if (!cam) return ptUS;
  const c = ptUS(cam.lon, cam.lat);
  const cx = cam.cx ?? 755;
  const cy = cam.cy ?? 542;
  return (lon: number, lat: number) => {
    const p = ptUS(lon, lat);
    return { x: cx + (p.x - c.x) * cam.z, y: cy + (p.y - c.y) * cam.z };
  };
};

// del canal original
const transformCam = (cam?: Cam) => {
  if (!cam) return undefined;
  const c = ptUS(cam.lon, cam.lat);
  return `translate(${cam.cx ?? 755},${cam.cy ?? 542}) scale(${cam.z}) translate(${-c.x},${-c.y})`;
};

// del canal original
const puntosTxt = (a: LL[]) =>
  a
    .map(([lo, la]) => {
      const p = ptUS(lo, la);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

// del canal original
const CONTORNO: LL[] = [
  [-122.75, 49],
  [-95.15, 49],
  [-95.15, 49.38],
  [-94.8, 49.3],
  [-94.6, 48.72],
  [-93.1, 48.62],
  [-91.5, 48.08],
  [-89.6, 48],
  [-88.4, 48.3],
  [-84.8, 46.9],
  [-84.1, 46.5],
  [-83.5, 45.95],
  [-82.45, 45.3],
  [-82.45, 43],
  [-83.1, 42.3],
  [-82.9, 41.95],
  [-81, 42.25],
  [-79.05, 42.85],
  [-79.2, 43.45],
  [-76.8, 43.62],
  [-76.2, 44.2],
  [-74.75, 45],
  [-71.5, 45.01],
  [-70.7, 45.4],
  [-70.05, 46.7],
  [-69.25, 47.45],
  [-68.25, 47.35],
  [-67.8, 47.07],
  [-67.8, 45.7],
  [-67, 44.85],
  [-68.8, 44.4],
  [-70.2, 43.7],
  [-70.7, 42.9],
  [-70.6, 42.6],
  [-71, 42.3],
  [-70.3, 41.75],
  [-69.95, 41.7],
  [-70.4, 41.55],
  [-71.4, 41.45],
  [-72.9, 41.25],
  [-73.7, 40.9],
  [-74, 40.6],
  [-74, 40.2],
  [-74.1, 39.75],
  [-74.9, 38.95],
  [-75.1, 38.4],
  [-75.3, 38],
  [-75.9, 37.15],
  [-76, 36.9],
  [-75.75, 36],
  [-75.5, 35.25],
  [-76.6, 34.7],
  [-77.9, 33.85],
  [-79.2, 33.2],
  [-80.8, 32.1],
  [-81.4, 30.9],
  [-81.3, 29.9],
  [-80.55, 28.4],
  [-80.05, 26.8],
  [-80.2, 25.7],
  [-80.6, 25.15],
  [-81.1, 25.2],
  [-81.8, 26.1],
  [-82.65, 27.5],
  [-82.8, 28.9],
  [-83.7, 29.9],
  [-84.4, 30],
  [-85, 29.65],
  [-86.5, 30.4],
  [-88, 30.3],
  [-89.4, 30.25],
  [-89.6, 29.4],
  [-89.2, 29.05],
  [-90.4, 29.1],
  [-92, 29.6],
  [-93.8, 29.7],
  [-94.8, 29.3],
  [-96.4, 28.4],
  [-97.25, 27.6],
  [-97.4, 26],
  [-99.1, 26.45],
  [-99.5, 27.5],
  [-100.3, 28.3],
  [-101.4, 29.8],
  [-102.4, 29.8],
  [-103.1, 29],
  [-104.5, 29.6],
  [-106.5, 31.8],
  [-108.2, 31.8],
  [-108.2, 31.33],
  [-111.1, 31.33],
  [-114.8, 32.5],
  [-114.7, 32.72],
  [-117.1, 32.53],
  [-117.3, 33.1],
  [-118.4, 33.75],
  [-118.5, 34.03],
  [-119.2, 34.15],
  [-120.6, 34.55],
  [-120.65, 35.2],
  [-121.9, 36.3],
  [-121.85, 36.9],
  [-122.5, 37.55],
  [-123, 38],
  [-123.7, 38.9],
  [-123.8, 39.8],
  [-124.4, 40.4],
  [-124.2, 41.8],
  [-124.5, 42.8],
  [-124.05, 44.6],
  [-123.95, 46.2],
  [-124.1, 47],
  [-124.7, 48.35],
  [-123.4, 48.15],
  [-122.75, 48.3],
];

// del canal original
const LAGOS: LL[][] = [
  [
    [-92.1, 46.75],
    [-90.4, 46.6],
    [-87.5, 46.5],
    [-84.9, 46.5],
    [-84.6, 46.95],
    [-85, 47.9],
    [-86.5, 48.7],
    [-88.3, 48.95],
    [-89.5, 48.05],
  ],
  [
    [-87.5, 41.65],
    [-86.8, 41.8],
    [-86.25, 42.6],
    [-86.5, 43.6],
    [-86.1, 44.9],
    [-85, 45.8],
    [-86, 45.95],
    [-87.6, 45.1],
    [-87.9, 44],
    [-87.8, 42.5],
  ],
  [
    [-84.7, 45.85],
    [-83.4, 45.1],
    [-83.3, 44.3],
    [-83.9, 43.9],
    [-82.5, 43],
    [-81.7, 43.4],
    [-81.7, 44.3],
    [-80.6, 45],
    [-81.4, 45.3],
    [-82.3, 46],
    [-84, 46.25],
  ],
  [
    [-83.45, 41.7],
    [-82.7, 41.45],
    [-81.7, 41.5],
    [-80.5, 42],
    [-79, 42.8],
    [-80.2, 42.8],
    [-81.6, 42.6],
    [-83, 42.05],
  ],
  [
    [-79.8, 43.3],
    [-78, 43.3],
    [-76.3, 43.5],
    [-76.2, 44.1],
    [-77.5, 44],
    [-79.4, 43.75],
  ],
];

// del canal original
const FRONTERAS: LL[][] = [
  [
    [-124, 46.25],
    [-123, 46.2],
    [-121, 45.65],
    [-119, 45.92],
    [-116.9, 46],
  ],
  [
    [-117.04, 46],
    [-117.04, 49.2],
  ],
  [
    [-116.9, 46],
    [-116.5, 45.5],
    [-116.9, 44.3],
    [-117, 42],
  ],
  [
    [-124.5, 42],
    [-111.05, 42],
  ],
  [
    [-120, 42],
    [-120, 39],
    [-114.6, 35],
    [-114.7, 32.7],
  ],
  [
    [-114.05, 42],
    [-114.05, 36.2],
    [-114.6, 36.1],
    [-114.6, 35],
  ],
  [
    [-116.05, 49.2],
    [-116.05, 47.9],
    [-115, 47.2],
    [-114.4, 45.6],
    [-113, 44.45],
    [-111.05, 44.5],
  ],
  [
    [-111.05, 44.5],
    [-111.05, 41],
  ],
  [
    [-111.05, 45],
    [-104.05, 45],
  ],
  [
    [-104.05, 41],
    [-104.05, 49.2],
  ],
  [
    [-111.05, 41],
    [-102.05, 41],
  ],
  [
    [-109.05, 41],
    [-109.05, 31.2],
  ],
  [
    [-114.05, 37],
    [-102.05, 37],
  ],
  [
    [-102.05, 41],
    [-102.05, 37],
  ],
  [
    [-103.05, 37],
    [-103.05, 32],
    [-106.6, 32],
  ],
  [
    [-103, 36.5],
    [-100, 36.5],
    [-100, 34.55],
    [-97, 33.8],
    [-94.5, 33.6],
  ],
  [
    [-94.05, 33],
    [-93.7, 31.5],
    [-93.8, 29.6],
  ],
  [
    [-104.05, 45.94],
    [-96.6, 45.94],
  ],
  [
    [-104.05, 43],
    [-98.5, 43],
    [-96.5, 42.5],
  ],
  [
    [-102.05, 40],
    [-95.3, 40],
  ],
  [
    [-102.05, 37],
    [-94.6, 37],
  ],
  [
    [-94.6, 37],
    [-94.6, 39.1],
    [-95.3, 40],
    [-95.8, 40.6],
    [-96.5, 42.5],
    [-96.5, 43.5],
    [-96.6, 45.94],
    [-97.2, 49.2],
  ],
  [
    [-94.5, 36.5],
    [-94.45, 33.6],
  ],
  [
    [-94.6, 36.5],
    [-90.1, 36.5],
  ],
  [
    [-94.05, 33],
    [-91.1, 33],
  ],
  [
    [-92.2, 46.7],
    [-92.9, 45.6],
    [-92.8, 44.7],
    [-91.2, 43.5],
    [-91.1, 42.5],
    [-90.6, 41.5],
    [-91.4, 40.4],
    [-90.2, 38.8],
    [-89.5, 37],
    [-90.1, 36],
    [-90.6, 34.5],
    [-91.15, 33],
    [-91.6, 31],
    [-89.7, 31],
    [-89.6, 30.2],
  ],
  [
    [-96.5, 43.5],
    [-91.2, 43.5],
  ],
  [
    [-95.8, 40.6],
    [-91.4, 40.6],
  ],
  [
    [-90.4, 46.6],
    [-88, 45.8],
    [-87.6, 45.1],
  ],
  [
    [-90.6, 42.5],
    [-87.8, 42.5],
  ],
  [
    [-87.5, 41.7],
    [-87.5, 39.5],
    [-87.6, 38.2],
    [-88, 37.8],
  ],
  [
    [-89.1, 37],
    [-88.1, 37.5],
    [-87.5, 37.9],
    [-85.8, 38.3],
    [-84.8, 39.1],
    [-82.6, 38.4],
    [-81.7, 39.2],
    [-80.7, 39.7],
    [-80.52, 40.6],
  ],
  [
    [-84.8, 39.1],
    [-84.8, 41.75],
  ],
  [
    [-87.5, 41.75],
    [-83.45, 41.72],
  ],
  [
    [-80.52, 39.72],
    [-80.52, 42],
  ],
  [
    [-89.5, 36.6],
    [-81.7, 36.6],
  ],
  [
    [-90.1, 35],
    [-83.1, 35],
  ],
  [
    [-88.2, 35],
    [-88.4, 30.4],
  ],
  [
    [-85.6, 35],
    [-85, 32.3],
    [-85, 31],
  ],
  [
    [-87.6, 31],
    [-85, 31],
    [-84.9, 30.7],
    [-82, 30.6],
    [-81.5, 30.7],
  ],
  [
    [-83.1, 35],
    [-81, 32.1],
  ],
  [
    [-83.1, 35],
    [-80.9, 35.1],
    [-78.5, 33.85],
  ],
  [
    [-84.3, 35],
    [-81.7, 36.6],
  ],
  [
    [-81.7, 36.55],
    [-75.9, 36.55],
  ],
  [
    [-81.7, 36.6],
    [-82.6, 37.2],
    [-82.6, 38.4],
  ],
  [
    [-81.7, 37.2],
    [-80.3, 37.5],
    [-79, 38.5],
    [-77.8, 39.3],
    [-77.1, 38.9],
    [-76.3, 38],
    [-75.9, 37.9],
  ],
  [
    [-80.52, 39.72],
    [-75.8, 39.72],
    [-75.6, 38.45],
    [-75.1, 38.45],
  ],
  [
    [-79.5, 39.72],
    [-79.5, 39.2],
    [-77.8, 39.3],
  ],
  [
    [-80.52, 42],
    [-75.4, 42],
    [-74.7, 41.35],
    [-74, 41],
  ],
  [
    [-74.7, 41.35],
    [-75.1, 40],
    [-75.5, 39.6],
  ],
  [
    [-73.3, 45.01],
    [-73.3, 42.05],
  ],
  [
    [-72.5, 42.72],
    [-71.5, 45.01],
  ],
  [
    [-73.5, 42.05],
    [-71.8, 42.02],
  ],
  [
    [-73.3, 42.72],
    [-70.9, 42.85],
  ],
  [
    [-70.7, 43.1],
    [-71.08, 45.3],
  ],
  [
    [-71.8, 42.02],
    [-71.8, 41.3],
  ],
  [
    [-73.5, 42.05],
    [-73.7, 41.1],
  ],
];

// del canal original
export type Ciudad = {
  id: string;
  lon: number;
  lat: number;
  nombre: string;
  dx: number;
  dy: number;
  anchor: "start" | "middle" | "end";
  punto?: boolean;
};

// del canal original (CIUDADES)
export const CIUDADES_EEUU: Ciudad[] = [
  {
    id: "seattle",
    lon: -122.33,
    lat: 47.6,
    nombre: "SEATTLE",
    dx: 20,
    dy: 12,
    anchor: "start",
  },
  {
    id: "portland",
    lon: -122.68,
    lat: 45.52,
    nombre: "PORTLAND",
    dx: 21,
    dy: 14,
    anchor: "start",
  },
  {
    id: "billings",
    lon: -108.5,
    lat: 45.78,
    nombre: "BILLINGS",
    dx: 20,
    dy: -9,
    anchor: "start",
  },
  {
    id: "casper",
    lon: -106.3,
    lat: 42.87,
    nombre: "CASPER",
    dx: 20,
    dy: 14,
    anchor: "start",
  },
  {
    id: "minneapolis",
    lon: -93.27,
    lat: 44.98,
    nombre: "MINNEAPOLIS",
    dx: 20,
    dy: 13,
    anchor: "start",
  },
  {
    id: "desmoines",
    lon: -93.6,
    lat: 41.59,
    nombre: "DES MOINES",
    dx: 20,
    dy: 13,
    anchor: "start",
  },
  {
    id: "newyork",
    lon: -74.0,
    lat: 40.7,
    nombre: "NEW YORK",
    dx: 0,
    dy: -22,
    anchor: "middle",
  },
  {
    id: "washington",
    lon: -77.04,
    lat: 38.9,
    nombre: "WASHINGTON",
    dx: -20,
    dy: 15,
    anchor: "end",
  },
  {
    id: "california",
    lon: -118.37,
    lat: 36.4,
    nombre: "CALIFORNIA",
    dx: 0,
    dy: 13,
    anchor: "middle",
    punto: false,
  },
];

// del canal original
export type PuntoUS = {
  lon: number;
  lat: number;
  nombre?: string;
  o?: number;
  color?: string;
  dx?: number;
  dy?: number;
  anchor?: "start" | "middle" | "end";
};

// del canal original
export const ArcoMapa: React.FC<{
  a: { x: number; y: number };
  b: { x: number; y: number };
  p: number;
  altura?: number;
  color?: string;
  texto?: string;
}> = ({ a, b, p, altura, color = C.amarillo, texto }) => {
  if (p <= 0.001) return null;
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  const h = altura ?? d * 0.3;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - h;
  const t = lim(p, 0, 1);
  // punto y tangente en t de la curva cuadrática
  const qx = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
  const qy = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y;
  const tx = 2 * (1 - t) * (mx - a.x) + 2 * t * (b.x - mx);
  const ty = 2 * (1 - t) * (my - a.y) + 2 * t * (b.y - my);
  const ang = (Math.atan2(ty, tx) * 180) / Math.PI;
  const cx = 0.25 * a.x + 0.5 * mx + 0.25 * b.x;
  const cy = 0.25 * a.y + 0.5 * my + 0.25 * b.y;
  const w = texto ? anchoT(texto, 44) + 40 : 0;
  return (
    <g>
      <path
        d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`}
        fill="none"
        stroke={C.navy}
        strokeWidth={16}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={`${t} 2`}
        opacity={0.5}
      />
      <path
        d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={`${t} 2`}
      />
      <g transform={`translate(${qx},${qy}) rotate(${ang})`}>
        <path d="M14,0 L-16,-16 L-16,16 Z" fill={color} />
      </g>
      {texto && t > 0.5 ? (
        <g transform={`translate(${cx},${cy - 50}) scale(${lim((t - 0.5) * 4, 0, 1)}) translate(${-w / 2},-32)`}>
          <rect x={6} y={8} width={w} height={64} rx={16} fill="rgba(18,12,46,0.35)" />
          <rect width={w} height={64} rx={16} fill={color} />
          <T x={w / 2} y={48} size={44} fill={C.navy}>
            {texto}
          </T>
        </g>
      ) : null}
    </g>
  );
};

// del canal original
const CONTINENTES: LL[][] = [
  [
    [-168, 66],
    [-140, 70],
    [-95, 72],
    [-80, 63],
    [-62, 58],
    [-55, 50],
    [-66, 44],
    [-76, 35],
    [-81, 25],
    [-90, 29],
    [-97, 26],
    [-97, 18],
    [-88, 15],
    [-83, 9],
    [-79, 8],
    [-87, 13],
    [-105, 20],
    [-112, 30],
    [-118, 34],
    [-124, 40],
    [-124, 48],
    [-135, 58],
    [-152, 60],
    [-165, 62],
  ],
  [
    [-50, 80],
    [-25, 80],
    [-20, 70],
    [-42, 60],
    [-55, 68],
  ],
  [
    [-80, 10],
    [-62, 10],
    [-50, 0],
    [-35, -6],
    [-40, -22],
    [-48, -28],
    [-58, -38],
    [-65, -42],
    [-68, -55],
    [-74, -50],
    [-72, -30],
    [-70, -18],
    [-80, -5],
  ],
  [
    [-10, 36],
    [-9, 43],
    [-2, 44],
    [-4, 48],
    [5, 52],
    [8, 57],
    [5, 62],
    [15, 69],
    [28, 71],
    [40, 67],
    [60, 69],
    [80, 73],
    [100, 77],
    [120, 73],
    [140, 72],
    [160, 70],
    [180, 68],
    [180, 64],
    [165, 60],
    [158, 52],
    [142, 58],
    [135, 44],
    [128, 38],
    [122, 30],
    [120, 22],
    [108, 20],
    [106, 10],
    [100, 13],
    [98, 8],
    [93, 17],
    [90, 22],
    [80, 13],
    [77, 8],
    [72, 20],
    [66, 25],
    [57, 25],
    [52, 30],
    [48, 30],
    [55, 23],
    [58, 20],
    [52, 16],
    [44, 12],
    [43, 17],
    [35, 28],
    [34, 32],
    [36, 36],
    [28, 37],
    [26, 40],
    [22, 38],
    [20, 40],
    [14, 44],
    [12, 38],
    [8, 44],
    [3, 43],
    [-5, 36],
  ],
  [
    [-17, 15],
    [-17, 21],
    [-10, 30],
    [-6, 36],
    [10, 37],
    [20, 32],
    [32, 31],
    [34, 28],
    [43, 12],
    [51, 12],
    [41, -2],
    [40, -15],
    [35, -24],
    [27, -34],
    [18, -34],
    [12, -18],
    [13, -6],
    [8, 4],
    [-8, 5],
    [-15, 10],
  ],
  [
    [114, -22],
    [122, -18],
    [130, -12],
    [137, -12],
    [142, -11],
    [146, -19],
    [153, -26],
    [150, -37],
    [141, -38],
    [131, -31],
    [115, -34],
  ],
  [
    [-8, 54],
    [-2, 58],
    [1, 52],
    [-5, 50],
  ],
  [
    [130, 31],
    [140, 35],
    [142, 41],
    [136, 36],
  ],
  [
    [-180, -66],
    [-120, -68],
    [-60, -64],
    [0, -67],
    [60, -66],
    [120, -66],
    [180, -67],
    [180, -72],
    [-180, -72],
  ],
];

// del canal original
const KM = 1600 / 360;

// del canal original
export const ptMapa = (lon: number, lat: number) => ({
  x: 160 + (lon + 180) * KM,
  y: 200 + (80 - lat) * KM,
});

// del canal original
export type PuntoMapa = {
  lon: number;
  lat: number;
  o?: number;
  color?: string;
  nombre?: string;
  dx?: number;
  dy?: number;
  anchor?: "start" | "middle" | "end";
};

// del canal original
export const MapaMundo: React.FC<{
  f: number;
  x?: number;
  y?: number;
  s?: number;
  puntos?: PuntoMapa[];
  calidas?: number;
  mar?: string;
  tierra?: string;
}> = ({ f, x = 0, y = 0, s = 1, puntos = [], calidas = 0, mar = P.agua2, tierra = C.teal2 }) => {
  const top = ptMapa(0, 35).y;
  const bot = ptMapa(0, -35).y;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={160} y={200} width={1600} height={675} rx={30} fill={mar} />
      {calidas > 0.01 ? <rect x={160} y={top} width={1600} height={bot - top} fill={C.naranja} opacity={0.28 * calidas} /> : null}
      {CONTINENTES.map((c, k) => (
        <polygon
          key={k}
          points={c
            .map(([lo, la]) => {
              const p = ptMapa(lo, la);
              return `${p.x.toFixed(0)},${p.y.toFixed(0)}`;
            })
            .join(" ")}
          fill={k === CONTINENTES.length - 1 ? C.nieve : tierra}
          opacity={k === CONTINENTES.length - 1 ? 0.55 : 1}
          strokeLinejoin="round"
        />
      ))}
      {puntos.map((p, k) => {
        const o = p.o ?? 1;
        if (o <= 0.01) return null;
        const q = ptMapa(p.lon, p.lat);
        return (
          <g key={k}>
            <circle cx={q.x} cy={q.y} r={(16 + Math.sin(f / 6 + k) * 2) * o} fill={p.color ?? C.amarillo} />
            <circle cx={q.x} cy={q.y} r={6 * o} fill={C.navy} />
            {p.nombre ? (
              <T x={q.x + (p.dx ?? 0)} y={q.y + (p.dy ?? 0)} size={36} anchor={p.anchor ?? "middle"} borde={C.navy} opacity={o}>
                {p.nombre}
              </T>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/**
 * Mapa plano de EE. UU. contiguo (estados crema con bordes finos, Grandes Lagos, sombra plana), versión genérica
 * del motivo de V09 sin las capas propias de Yellowstone. Ocupa x 80–1430, y 170–900 a s=1.
 *   cam      {lon, lat, z, cx?, cy?}: acerca la cámara a (lon, lat) con zoom z y la pone en (cx, cy) (755, 542).
 *   foco     {lon, lat}: punto rojo que late (el lugar del que habla el video); focoNombre = rótulo debajo.
 *   ciudades lista de Ciudad (CIUDADES_EEUU trae 9 listas) con punto y nombre.
 *   puntos   {lon, lat, nombre?, o?, color?, dx?, dy?, anchor?}[]: puntos con pop (o 0..1).
 *   manchas  {lon, lat, r, color?, o?}[]: círculos en coordenadas del mapa (siguen al zoom).
 *   nube 0..1 (nube que se abre desde el foco) · viento 0..1 (flechas O→E) · copos 0..1 · oscuro 0..1.
 *   children se dibujan en coordenadas del mapa (usa ptUS) y siguen al zoom. id = clipPath único por escena.
 */
export const MapaEEUU: React.FC<{
  f: number;
  x?: number;
  y?: number;
  s?: number;
  cam?: Cam;
  foco?: { lon: number; lat: number };
  focoNombre?: string;
  ciudades?: Ciudad[];
  puntos?: PuntoUS[];
  manchas?: {
    lon: number;
    lat: number;
    r: number;
    color?: string;
    o?: number;
  }[];
  nube?: number;
  viento?: number;
  copos?: number;
  oscuro?: number;
  tierra?: string;
  id?: string;
  children?: React.ReactNode;
}> = ({
  f,
  x = 0,
  y = 0,
  s = 1,
  cam,
  foco,
  focoNombre,
  ciudades = [],
  puntos = [],
  manchas = [],
  nube = 0,
  viento = 0,
  copos = 0,
  oscuro = 0,
  tierra = P.tierra,
  id = "us-tierra",
  children,
}) => {
  const pr = proyecta(cam);
  const contorno = puntosTxt(CONTORNO);
  const late = Math.sin(f / 7) * 0.5 + 0.5;
  const fP = foco ? pr(foco.lon, foco.lat) : null;
  const f0 = foco ? ptUS(foco.lon, foco.lat) : null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <clipPath id={id}>
          <polygon points={contorno} />
        </clipPath>
      </defs>
      <g transform={transformCam(cam)}>
        <polygon points={contorno} fill="rgba(18,12,46,0.35)" transform="translate(8,10)" />
        <polygon points={contorno} fill={tierra} />
        <g clipPath={`url(#${id})`}>
          {LAGOS.map((l, k) => (
            <polygon key={k} points={puntosTxt(l)} fill={P.lago} />
          ))}
          {FRONTERAS.map((b, k) => (
            <polyline
              key={k}
              points={puntosTxt(b)}
              fill="none"
              stroke={P.borde}
              strokeWidth={2.2}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          ))}
        </g>
        {manchas.map((m, k) => {
          const p = ptUS(m.lon, m.lat);
          return <circle key={k} cx={p.x} cy={p.y} r={m.r} fill={m.color ?? C.negro} opacity={(m.o ?? 1) * 0.8} />;
        })}
        {nube > 0.001 && f0 ? <NubeMancha cx={f0.x} cy={f0.y} r={430 * nube} f={f} /> : null}
        {children}
      </g>
      {oscuro > 0.001 ? <rect x={-400} y={-400} width={2720} height={1880} fill={C.negro} opacity={0.55 * oscuro} /> : null}
      {viento > 0.001
        ? [0, 1, 2, 3].map((k) => {
            const vx = 160 + ((((f * 1.4 + k * 330) % 1200) + 1200) % 1200);
            const vy = 300 + k * 140;
            return (
              <g key={k} opacity={viento * 0.9} transform={`translate(${vx},${vy})`}>
                <rect x={-90} y={-7} width={120} height={14} rx={7} fill={C.teal} />
                <path d="M26,-22 L62,0 L26,22 Z" fill={C.teal} />
              </g>
            );
          })
        : null}
      {fP ? (
        <g transform={`translate(${fP.x},${fP.y})`}>
          <circle r={22 + late * 10} fill="none" stroke={C.rojo} strokeWidth={5} opacity={0.6 - late * 0.4} />
          <circle r={17} fill={C.blanco} />
          <circle r={12} fill={C.rojo} />
        </g>
      ) : null}
      {fP && focoNombre ? (
        <T x={fP.x - 16} y={fP.y + 64} size={38} anchor="end" borde={C.navy}>
          {focoNombre}
        </T>
      ) : null}
      {ciudades.map((c) => {
        const p = pr(c.lon, c.lat);
        return (
          <g key={c.id}>
            {c.punto === false ? null : (
              <g>
                <circle cx={p.x} cy={p.y} r={12} fill={C.blanco} />
                <circle cx={p.x} cy={p.y} r={8} fill={C.navy} />
              </g>
            )}
            <T x={p.x + c.dx} y={p.y + c.dy} size={38} anchor={c.anchor} borde={C.navy}>
              {c.nombre}
            </T>
          </g>
        );
      })}
      {puntos.map((q, k) => {
        const o = q.o ?? 1;
        if (o <= 0.001) return null;
        const p = pr(q.lon, q.lat);
        return (
          <g key={`p${k}`} opacity={lim(o, 0, 1)}>
            <circle cx={p.x} cy={p.y} r={14 * o} fill={C.blanco} />
            <circle cx={p.x} cy={p.y} r={9 * o} fill={q.color ?? C.morado} />
            {q.nombre ? (
              <T x={p.x + (q.dx ?? 20)} y={p.y + (q.dy ?? 13)} size={38} anchor={q.anchor ?? "start"} borde={C.navy}>
                {q.nombre}
              </T>
            ) : null}
          </g>
        );
      })}
      <Copos f={f} o={copos} />
    </g>
  );
};
