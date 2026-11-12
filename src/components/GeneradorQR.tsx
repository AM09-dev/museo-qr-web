import { QRCodeSVG } from 'qrcode.react';
import type { Language, Room } from '../types';
import { ArrowLeft, Printer } from 'lucide-react';

interface Props {
  /** Salas dinámicas (Supabase con fallback) — RF-05 / RF-08 */
  rooms: Room[];
  /** Idioma activo para los títulos impresos */
  language?: Language;
  onBack: () => void;
}

export function QRGenerator({ rooms, language = 'es', onBack }: Props) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-panel">
      <div className="qr-panel__header">
        <button className="btn btn--ghost" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> Volver a la App
        </button>
        {rooms.length > 0 && (
          <button className="btn btn--primary" onClick={handlePrint}>
            <Printer size={16} aria-hidden="true" /> Imprimir QR
          </button>
        )}
      </div>

      <h2 className="qr-panel__title">Códigos QR de las Salas</h2>
      <p className="qr-panel__intro">
        Imprime o escanea estos códigos para probar el acceso directo a cada sala.
      </p>

      {rooms.length === 0 ? (
        /* RF-05: estado informativo cuando no hay salas disponibles */
        <section className="qr-card" role="status">
          <h3 className="qr-card__name">No hay salas disponibles</h3>
          <p className="qr-card__message">
            No se pudieron cargar salas para generar códigos QR. Comprueba la conexión
            e inténtalo de nuevo más tarde.
          </p>
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
