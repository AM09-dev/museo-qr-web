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
