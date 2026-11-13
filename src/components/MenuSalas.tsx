import { QrCode } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Language, Room } from '../types';
import { textosUI } from '../i18n/textosUI';

interface Props {
  rooms: Room[];
  /** Idioma activo para los títulos del listado (RF-01) */
  language: Language;
  onSelect: (roomId: string) => void;
}

/** RF-12: vista pública del menú de salas (simulador de escaneo QR). */
export function MenuSalas({ rooms, language, onSelect }: Props) {
  const t = textosUI[language];

  return (
    <main className="view-enter">
      <p className="section-label">{t.etiquetaMenu}</p>
      <div className="room-list">
        {rooms.map((room, index) => (
          <button
            key={room.id}
            className="room-card"
            style={{ '--i': index } as CSSProperties}
            onClick={() => onSelect(room.id)}
          >
            <span className="room-card__index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="room-card__name">{room.name[language]}</span>
            <QrCode className="room-card__icon" size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
    </main>
  );
}
