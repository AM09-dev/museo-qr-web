import { createClient } from '@supabase/supabase-js';

/** RF-08: cliente Supabase inicializado con variables de entorno de Vite. */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** true solo si existen credenciales reales (ignora plantillas de ejemplo). */
export const isSupabaseConfigured: boolean =
  Boolean(supabaseUrl && supabaseAnonKey) &&
  !supabaseUrl.includes('your-project');

/**
 * Cliente de Supabase o `null` si no hay credenciales.
 * El consumidor debe degradar a datos estáticos cuando sea `null`.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
