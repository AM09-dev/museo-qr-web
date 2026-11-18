export type Language = 'es' | 'en' | 'fr' | 'de';

/** RF-13: pieza individual de una sala (obra u objeto). */
export interface Exhibit {
  id: string;
  roomId: string;
  /** Orden dentro de la sala (ascendente). */
  position: number;
  name: Record<Language, string>;
  description: Record<Language, string>;
  imageUrl?: string;
}

export interface Room {
  id: string;
  number: number;
  name: Record<Language, string>;
  description: Record<Language, string>;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  /** RF-13: piezas de la sala, ordenadas por `position`. Opcional. */
  exhibits?: Exhibit[];
}

/** RF-14: configuración de taquilla (fila `id = 1` de `museum_settings`). */
export interface MuseumSettings {
  /** Precio de entrada vigente. */
  ticketPrice: number;
  /** Código de moneda ISO 4217 (por ejemplo `MXN`). */
  currency: string;
  /** Enlace de pago en línea (pasarela externa). Vacío si no hay. */
  paymentLink: string;
  /** CLABE interbancaria SPEI. Vacía si no hay. */
  bankClabe: string;
  /** Nombre del beneficiario de la transferencia. Vacío si no hay. */
  bankBeneficiary: string;
}
