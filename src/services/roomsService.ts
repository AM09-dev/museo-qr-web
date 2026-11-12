import type { Language, Room } from '../types';
import { roomsData } from '../data/museumData';
import { supabase } from '../lib/supabase';

/**
 * RF-08: servicio de salas con consulta dinámica a la tabla `rooms`
 * y fallback a los datos estáticos de `museumData.ts`.
 */

/** Fila tal como llega desde PostgREST (snake_case). */
interface RoomRow {
  id: string;
  number: number;
  name: Record<Language, string>;
  description: Record<Language, string>;
  image_url?: string | null;
  audio_url?: string | null;
  video_url?: string | null;
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
  };
}

/**
 * Devuelve todas las salas ordenadas por `number` ascendente.
 * Si Supabase no está configurado o falla (red/consulta), devuelve
 * los datos locales de respaldo.
 */
export async function fetchRooms(): Promise<Room[]> {
  if (!supabase) {
    return roomsData;
  }

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('id, number, name, description, image_url, audio_url, video_url')
      .order('number', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return roomsData;

    return data.map(mapRoomRow);
  } catch (error) {
    console.warn('[roomsService] Supabase no disponible; se usan datos locales de respaldo.', error);
    return roomsData;
  }
}
