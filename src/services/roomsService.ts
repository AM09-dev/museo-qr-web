import type { Exhibit, Language, Room } from '../types';
import { roomsData } from '../data/museumData';
import { supabase } from '../lib/supabase';

/**
 * RF-08: servicio de salas con consulta dinámica a la tabla `rooms`
 * y fallback a los datos estáticos de `museumData.ts`.
 * RF-13: incluye las piezas de cada sala (tabla `exhibits`).
 */

const ROOM_COLUMNS = 'id, number, name, description, image_url, audio_url, video_url';
/** RF-13: columnas de `exhibits` (compartidas con `adminService.ts`). */
export const EXHIBIT_COLUMNS = 'id, room_id, position, name, description, image_url';

/** RF-13: fila de `exhibits` tal como llega desde PostgREST (snake_case). */
export interface ExhibitRow {
  id: string;
  room_id: string;
  position: number;
  name: Record<Language, string>;
  description: Record<Language, string>;
  image_url?: string | null;
}

/** Fila tal como llega desde PostgREST (snake_case). */
interface RoomRow {
  id: string;
  number: number;
  name: Record<Language, string>;
  description: Record<Language, string>;
  image_url?: string | null;
  audio_url?: string | null;
  video_url?: string | null;
  exhibits?: ExhibitRow[] | null;
}

/** RF-13: mapea una fila de `exhibits` (snake_case) → `Exhibit` (camelCase). */
export function mapExhibitRow(row: ExhibitRow): Exhibit {
  return {
    id: row.id,
    roomId: row.room_id,
    position: row.position,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url ?? undefined,
  };
}

/** Mapea snake_case (BD) → camelCase (interfaz `Room`). */
function mapRoomRow(row: RoomRow): Room {
  return {
    id: row.id,
    number: row.number,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url ?? undefined,
    audioUrl: row.audio_url ?? undefined,
    videoUrl: row.video_url ?? undefined,
    exhibits: (row.exhibits ?? [])
      .map(mapExhibitRow)
      .sort((a, b) => a.position - b.position),
  };
}

/**
 * Devuelve todas las salas ordenadas por `number` ascendente, con sus
 * piezas ordenadas por `position` (RF-13).
 *
 * - Si la consulta con piezas falla (p. ej. la tabla `exhibits` aún no existe),
 *   reintenta solo con salas para no sustituir datos reales por los de ejemplo.
 * - Si Supabase no está configurado o también falla la consulta de salas,
 *   devuelve los datos locales de respaldo (RF-08).
 */
export async function fetchRooms(): Promise<Room[]> {
  if (!supabase) {
    return roomsData;
  }

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select(`${ROOM_COLUMNS}, exhibits(${EXHIBIT_COLUMNS})`)
      .order('number', { ascending: true })
      .order('position', { referencedTable: 'exhibits', ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return roomsData;

    return (data as RoomRow[]).map(mapRoomRow);
  } catch (error) {
    console.warn('[roomsService] No se pudieron cargar las piezas; se reintenta solo con salas.', error);
  }

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select(ROOM_COLUMNS)
      .order('number', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return roomsData;

    return (data as RoomRow[]).map(mapRoomRow);
  } catch (error) {
    console.warn('[roomsService] Supabase no disponible; se usan datos locales de respaldo.', error);
    return roomsData;
  }
}
