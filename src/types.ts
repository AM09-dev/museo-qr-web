export type Language = 'es' | 'en' | 'fr' | 'de';

export interface Room {
  id: string;
  number: number;
  name: Record<Language, string>;
  description: Record<Language, string>;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}