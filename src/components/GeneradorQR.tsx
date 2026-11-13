import { QRCodeSVG } from 'qrcode.react';
import type { Language, Room } from '../types';
import { ArrowLeft, Printer } from 'lucide-react';
import { textosUI } from '../i18n/textosUI';

interface Props {
  /** Salas dinámicas (Supabase con fallback) — RF-05 / RF-08 */
  rooms: Room[];
  /** Idioma activo para títulos impresos y textos del panel (RF-01) */
  language?: Language;
  onBack: () => void;
}

export function GeneradorQR({ rooms, language = 'es', onBack }: Props) {
  const t = textosUI[language];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-panel">
      <div className="qr-panel__header">
        <button className="btn btn--ghost" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> {t.volverApp}
        </button>
        {rooms.length > 0 && (
          <button className="btn btn--primary" onClick={handlePrint}>
            <Printer size={16} aria-hidden="true" /> {t.imprimirQr}
          </button>
        )}
      </div>

      <h2 className="qr-panel__title">{t.qrTitulo}</h2>
      <p className="qr-panel__intro">{t.qrIntro}</p>

      {rooms.length === 0 ? (
        /* RF-05: estado informativo cuando no hay salas disponibles */
        <section className="qr-card" role="status">
          <h3 className="qr-card__name">{t.qrVacioTitulo}</h3>
          <p className="qr-card__message">{t.qrVacioTexto}</p>
        </section>
      ) : (
        <div className="qr-grid">
          {rooms.map((room) => {
            // RF-09: formato exacto que activa el Modo Exclusivo al escanear
            const roomUrl = `${window.location.origin}/?sala=${room.id}`;
            return (
              <div key={room.id} className="qr-card">
                <h3 className="qr-card__name">{room.name[language]}</h3>

                {/* RF-05: la tarjeta muestra solo título + QR gráfico (sin URL en texto plano) */}
                <div className="qr-card__frame">
                  <QRCodeSVG value={roomUrl} size={150} level="H" includeMargin={true} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
