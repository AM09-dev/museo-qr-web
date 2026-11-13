import { ArrowLeft, Volume2 } from 'lucide-react';
import type { Language, Room } from '../types';
import { textosUI } from '../i18n/textosUI';

interface Props {
  room: Room;
  /** Idioma activo para título, descripción y audioguía (RF-01 / RF-02) */
  language: Language;
  /** RF-09: en Modo Kiosco no existe navegación al menú general */
  isKioskMode: boolean;
  onBack: () => void;
}

/** RF-12: vista de detalle multimedia de una sala (imagen, descripción y audioguía). */
export function DetalleSala({ room, language, isKioskMode, onBack }: Props) {
  const t = textosUI[language];

  return (
    <main className="view-enter" key={room.id}>
      {/* RF-09: en modo exclusivo no existe navegación al menú general */}
      {!isKioskMode && (
        <button className="btn btn--ghost" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> {t.volverMenu}
        </button>
      )}

      <article className="detail-card">
        {/* Imagen de cabecera de la sala (RF-02) */}
        {room.imageUrl && (
          <figure className="detail-figure">
            <img
              className="detail-image"
              src={room.imageUrl}
              alt={room.name[language]}
              loading="lazy"
            />
          </figure>
        )}

        <h2 className="detail-title">{room.name[language]}</h2>
        <p className="detail-text">{room.description[language]}</p>

        {/* Sección Audioguía */}
        {room.audioUrl && (
          <section className="media-card">
            <div className="media-card__header">
              <Volume2 size={18} aria-hidden="true" />
              <span>
                {t.audioguia} ({language.toUpperCase()})
              </span>
            </div>
            <audio controls src={room.audioUrl} />
          </section>
        )}

        {/* Recorrido 360° diferido al backlog (SPEC §5) — datos videoUrl conservados */}
      </article>
    </main>
  );
}
