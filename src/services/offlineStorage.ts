import type { MuseumSettings, Room } from '../types';

/**
 * RF-15: respaldo local (localStorage) de los datos de Supabase
 * para poder consultarlos sin conexión.
 *
 * - Claves versionadas (`:v1`) para poder migrarlas en el futuro.
 * - Lecturas validadas: JSON corrupto o con forma inválida → `null`.
 * - Escrituras protegidas: modo incógnito o cuota llena → se omite el respaldo.
 * - Solo se copian datos reales de Supabase, nunca el fallback estático.
 */

const CLAVE_SALAS = 'museoqr:rooms:v1';
const CLAVE_TAQUILLA = 'museoqr:settings:v1';

/** Envoltura persistida: `savedAt` conserva cuándo se guardó la copia. */
interface CopiaLocal<T> {
  savedAt: string;
  data: T;
}

/** Lee y valida una copia; cualquier problema → `null` (nunca lanza). */
function leerCopia<T>(clave: string, esValida: (dato: unknown) => dato is T): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const bruto = window.localStorage.getItem(clave);
    if (!bruto) return null;
    const parsed: unknown = JSON.parse(bruto);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { data } = parsed as Partial<CopiaLocal<T>>;
    return esValida(data) ? data : null;
  } catch {
    return null;
  }
}

/** Guarda una copia; si el almacenamiento falla, se omite sin romper nada. */
function escribirCopia<T>(clave: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const copia: CopiaLocal<T> = { savedAt: new Date().toISOString(), data };
    window.localStorage.setItem(clave, JSON.stringify(copia));
  } catch {
    // Modo incógnito o cuota llena: se descarta el respaldo
  }
}

/** Forma mínima de `Room` exigida para aceptar la copia de salas. */
function esSalas(dato: unknown): dato is Room[] {
  return (
    Array.isArray(dato) &&
    dato.length > 0 &&
    dato.every(
      (sala) =>
        typeof sala === 'object' &&
        sala !== null &&
        typeof (sala as Room).id === 'string' &&
        typeof (sala as Room).number === 'number'
    )
  );
}

/** Forma mínima de `MuseumSettings` exigida para aceptar la copia. */
function esTaquilla(dato: unknown): dato is MuseumSettings {
  if (typeof dato !== 'object' || dato === null) return false;
  const config = dato as Partial<MuseumSettings>;
  return typeof config.ticketPrice === 'number' && typeof config.currency === 'string';
}

/** RF-15: guarda una copia de las salas (con piezas) tras una lectura exitosa. */
export function guardarRespaldoSalas(rooms: Room[]): void {
  if (rooms.length > 0) escribirCopia(CLAVE_SALAS, rooms);
}

/** RF-15: última copia de las salas, o `null` si no existe o es inválida. */
export function leerRespaldoSalas(): Room[] | null {
  return leerCopia(CLAVE_SALAS, esSalas);
}

/** RF-15: guarda una copia de la configuración de taquilla. */
export function guardarRespaldoTaquilla(settings: MuseumSettings): void {
  escribirCopia(CLAVE_TAQUILLA, settings);
}

/** RF-15: última copia de la taquilla, o `null` si no existe o es inválida. */
export function leerRespaldoTaquilla(): MuseumSettings | null {
  return leerCopia(CLAVE_TAQUILLA, esTaquilla);
}
