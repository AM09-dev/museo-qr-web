import type { Language } from '../types';
import { textosUI } from '../i18n/textosUI';

interface Props {
  /** Idioma activo (RF-01); en Modo Kiosco el visitante puede cambiarlo */
  language: Language;
}

/** RF-12 / RF-09: pantalla «Sala no encontrada» para un `?sala=` inexistente. */
export function SalaNoEncontrada({ language }: Props) {
  const t = textosUI[language];

  return (
    <main className="view-enter" role="alert">
      <section className="detail-card">
        <h2 className="detail-title">{t.salaNoEncontradaTitulo}</h2>
        <p className="detail-text">{t.salaNoEncontradaTexto}</p>
      </section>
    </main>
  );
}
