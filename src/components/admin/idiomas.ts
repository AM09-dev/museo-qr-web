import type { Language } from '../../types';

/** RF-10: idiomas editables en el panel, con su etiqueta legible. */
export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

/** Cuántos idiomas tienen texto configurado (indicador «N/4 idiomas»). */
export function contarIdiomas(textos: Record<Language, string>): number {
  return LANGUAGES.filter(({ code }) => textos[code]?.trim().length > 0).length;
}
