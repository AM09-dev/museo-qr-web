import type { Language } from '../types';
import { supabase } from '../lib/supabase';

/**
 * RF-10: operaciones de escritura sobre la tabla `rooms`.
 * Todas las mutaciones validan la sesión activa antes de ejecutarse.
 */

/** Resultado uniforme de las operaciones de escritura. */
export interface AdminResult {
  ok: boolean;
  error?: string;
}

/** Campos editables del panel (camelCase en la UI, snake_case en la BD). */
export interface RoomPatch {
  name?: Record<Language, string>;
  description?: Record<Language, string>;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

/** Comprueba que haya cliente y sesión de administrador activa. */
async function requireSession(): Promise<string | null> {
  if (!supabase) {
    return 'Supabase no está configurado (faltan credenciales en .env).';
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return `No se pudo verificar la sesión: ${error.message}`;
  }
  if (!data.session) {
    return 'Sesión no válida. Inicia sesión como administrador.';
  }

  return null;
}

/** Traduce el patch camelCase a las columnas snake_case de la BD. */
function toRowPayload(patch: RoomPatch): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (patch.name) payload.name = patch.name;
  if (patch.description) payload.description = patch.description;
  if (patch.imageUrl !== undefined) payload.image_url = patch.imageUrl || null;
  if (patch.audioUrl !== undefined) payload.audio_url = patch.audioUrl || null;
  if (patch.videoUrl !== undefined) payload.video_url = patch.videoUrl || null;
  return payload;
}

/** RF-10: actualiza una sala existente validando la sesión activa. */
export async function updateRoom(id: string, patch: RoomPatch): Promise<AdminResult> {
  const sessionError = await requireSession();
  if (sessionError) return { ok: false, error: sessionError };

  const payload = toRowPayload(patch);
  if (Object.keys(payload).length === 0) {
    return { ok: false, error: 'No hay cambios para guardar.' };
  }

  try {
    const { error } = await supabase!.from('rooms').update(payload).eq('id', id);
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido al guardar.';
    return { ok: false, error: message };
  }
}

/** RF-10 (opcional): crea una sala validando la sesión activa. */
export async function createRoom(room: {
  id: string;
  number: number;
  name: Record<Language, string>;
  description: Record<Language, string>;
  imageUrl?: string;
  audioUrl?: string;
}): Promise<AdminResult> {
  const sessionError = await requireSession();
  if (sessionError) return { ok: false, error: sessionError };

  try {
    const { error } = await supabase!.from('rooms').insert({
      id: room.id,
      number: room.number,
      name: room.name,
      description: room.description,
      image_url: room.imageUrl ?? null,
      audio_url: room.audioUrl ?? null,
      video_url: null,
    });
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido al crear la sala.';
    return { ok: false, error: message };
  }
}

/** RF-10 (opcional): elimina una sala validando la sesión activa. */
export async function deleteRoom(id: string): Promise<AdminResult> {
  const sessionError = await requireSession();
  if (sessionError) return { ok: false, error: sessionError };

  try {
    const { error } = await supabase!.from('rooms').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido al eliminar.';
    return { ok: false, error: message };
  }
}

/** RF-11: carpetas permitidas dentro del bucket `museum-media`. */
export type MediaFolder = 'images' | 'audios';

/** RF-11: formatos de archivo permitidos por carpeta. */
const ALLOWED_MEDIA_TYPES: Record<MediaFolder, string[]> = {
  images: ['jpg', 'jpeg', 'png', 'webp'],
  audios: ['mp3', 'wav', 'm4a'],
};

/** RF-11: etiqueta legible de cada carpeta para los mensajes de error. */
const FOLDER_LABEL: Record<MediaFolder, string> = {
  images: 'imagen',
  audios: 'audioguía',
};

/** RF-11: extensión en minúsculas del archivo (vacía si no la tiene). */
function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

/**
 * RF-11: sube un archivo multimedia al bucket `museum-media` de Supabase
 * Storage y devuelve su URL pública.
 *
 * Valida la sesión activa y el formato permitido:
 * - `images/`: jpg, jpeg, png, webp.
 * - `audios/`: mp3, wav, m4a.
 */
export async function uploadMuseumMedia(
  file: File,
  folder: MediaFolder
): Promise<string> {
  const sessionError = await requireSession();
  if (sessionError) throw new Error(sessionError);

  const allowed = ALLOWED_MEDIA_TYPES[folder];
  const extension = getFileExtension(file.name);
  if (!extension || !allowed.includes(extension)) {
    const formats = allowed.join(', ').toUpperCase();
    throw new Error(
      `Formato no permitido para ${FOLDER_LABEL[folder]}. Usa: ${formats}.`
    );
  }

  // Nombre único por archivo para evitar colisiones y sobrescrituras.
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
  const path = `${folder}/${uniqueName}`;

  try {
    const { error } = await supabase!.storage.from('museum-media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;

    const { data } = supabase!.storage.from('museum-media').getPublicUrl(path);
    if (!data?.publicUrl) {
      throw new Error('No se pudo obtener la URL pública del archivo.');
    }

    return data.publicUrl;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido al subir el archivo.';
    throw new Error(message);
  }
}

/** RF-10: cierra la sesión del administrador. */
export async function signOut(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
}
