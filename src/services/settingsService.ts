import type { MuseumSettings } from '../types';
import { supabase } from '../lib/supabase';
import { requireSession, type AdminResult } from './adminService';

/**
 * RF-14: servicio de taquilla — lectura pública y escritura autenticada
 * de la tabla `museum_settings` (una sola fila, `id = 1`).
 */

/** Fila tal como llega desde PostgREST (snake_case). */
interface MuseumSettingsRow {
  id: number;
  ticket_price: number | null;
  currency?: string | null;
  payment_link?: string | null;
  bank_clabe?: string | null;
  bank_beneficiary?: string | null;
}

/** Resultado de la lectura pública: `null` = sin datos disponibles. */
export interface SettingsReadResult {
  settings: MuseumSettings | null;
  error?: string;
}

/** Valores por defecto usados como respaldo en el formulario del panel. */
export const DEFAULT_MUSEUM_SETTINGS: MuseumSettings = {
  ticketPrice: 0,
  currency: 'MXN',
  paymentLink: '',
  bankClabe: '',
  bankBeneficiary: '',
};

/** Mapea la fila snake_case → `MuseumSettings` (camelCase). */
function mapRow(row: MuseumSettingsRow): MuseumSettings {
  return {
    ticketPrice: typeof row.ticket_price === 'number' ? row.ticket_price : 0,
    currency: (row.currency ?? 'MXN').trim().toUpperCase() || 'MXN',
    paymentLink: row.payment_link?.trim() ?? '',
    bankClabe: row.bank_clabe?.trim() ?? '',
    bankBeneficiary: row.bank_beneficiary?.trim() ?? '',
  };
}

/**
 * RF-14: lectura pública de la configuración de taquilla (`id = 1`).
 *
 * Devuelve `null` (sin lanzar) si Supabase no está configurado, si falla la
 * consulta o si la fila no existe todavía, para que la vista pública informe
 * del estado en lugar de inventar un precio.
 */
export async function getMuseumSettings(): Promise<SettingsReadResult> {
  if (!supabase) {
    return { settings: null, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase
      .from('museum_settings')
      .select('id, ticket_price, currency, payment_link, bank_clabe, bank_beneficiary')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return {
        settings: null,
        error: 'La taquilla aún no tiene datos configurados (falta la fila id = 1).',
      };
    }

    return { settings: mapRow(data as MuseumSettingsRow) };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Error desconocido al leer la configuración.';
    return { settings: null, error: message };
  }
}

/** RF-14: valida los datos antes de guardarlos en la tabla. */
function validateSettings(data: MuseumSettings): string | null {
  if (!Number.isFinite(data.ticketPrice) || data.ticketPrice < 0) {
    return 'El precio de entrada debe ser un número mayor o igual a cero.';
  }

  const currency = data.currency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) {
    return 'La moneda debe ser un código ISO 4217 de 3 letras (por ejemplo MXN).';
  }

  const link = data.paymentLink.trim();
  if (link && !/^https?:\/\/.+/i.test(link)) {
    return 'El enlace de pago debe empezar por http:// o https://.';
  }

  return null;
}

/** RF-14: actualiza la configuración de taquilla validando la sesión activa. */
export async function updateMuseumSettings(data: MuseumSettings): Promise<AdminResult> {
  const sessionError = await requireSession();
  if (sessionError) return { ok: false, error: sessionError };

  const validationError = validateSettings(data);
  if (validationError) return { ok: false, error: validationError };

  const payload = {
    ticket_price: data.ticketPrice,
    currency: data.currency.trim().toUpperCase(),
    payment_link: data.paymentLink.trim() || null,
    bank_clabe: data.bankClabe.replace(/\s+/g, '') || null,
    bank_beneficiary: data.bankBeneficiary.trim() || null,
  };

  try {
    const { data: updated, error } = await supabase!
      .from('museum_settings')
      .update(payload)
      .eq('id', 1)
      .select('id');

    if (error) throw error;
    if (!updated || updated.length === 0) {
      return {
        ok: false,
        error:
          'No existe la fila de configuración (id = 1). Ejecuta supabase/museum_settings.sql.',
      };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido al guardar la taquilla.';
    return { ok: false, error: message };
  }
}
