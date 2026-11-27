/**
 * Configuración de Remotion para la línea de comandos (npx remotion render / still / studio).
 * Todas las opciones: https://remotion.dev/docs/config
 */
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
// 2 hilos de render: cuida la memoria en computadores de 16-18 GB. Súbelo con --concurrency=N si te sobra RAM.
Config.setConcurrency(2);
