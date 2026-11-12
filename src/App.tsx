import { useState, useEffect } from 'react';
import type { Language } from './types';
import { roomsData } from './data/museumData';
import { QRGenerator } from './components/QRGenerator';
import { Globe, QrCode, Volume2, ArrowLeft, QrCode as QrIcon } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(() => {
    // RF-04: detección de escaneo QR por parámetro de URL, una sola vez al montar
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get('sala');
    return roomFromUrl && roomsData.some(r => r.id === roomFromUrl) ? roomFromUrl : null;
  });
  const [showQRPanel, setShowQRPanel] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(
    () => typeof window !== 'undefined' && window.scrollY > 4
  );

  // Sombra en la barra superior al hacer scroll (RF-06)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBackToMenu = () => {
    setSelectedRoomId(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  const selectedRoom = roomsData.find(r => r.id === selectedRoomId);

  // Si activó la vista del generador de QR
  if (showQRPanel) {
    return <QRGenerator onBack={() => setShowQRPanel(false)} />;
  }

  return (
    <div className="app">
      {/* Header con Selector de Idioma y Botón de Panel QR */}
      <header className={`app-header${isScrolled ? ' is-scrolled' : ''}`}>
        <h1 className="app-title">Museo Interactivo</h1>

        <div className="header-actions">
          <button
            className="btn btn--primary"
            onClick={() => setShowQRPanel(true)}
            title="Ver Códigos QR"
            aria-label="Ver Códigos QR"
          >
            <QrIcon size={16} aria-hidden="true" />
            <span>Ver QR</span>
          </button>

          <div className="lang-group">
            <Globe size={18} aria-hidden="true" />
            <select
              className="lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              aria-label="Seleccionar idioma"
            >
              <option value="es">🇲🇽 ES</option>
              <option value="en">🇺🇸 EN</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="de">🇩🇪 DE</option>
            </select>
          </div>
        </div>
      </header>

      {/* Detalle de la Sala Escaneada o Listado Principal */}
      {selectedRoom ? (
        <main className="view-enter" key={selectedRoom.id}>
          <button className="btn btn--ghost" onClick={handleBackToMenu}>
            <ArrowLeft size={16} aria-hidden="true" /> Volver al menú de salas
          </button>

          <article className="detail-card">
            {/* Imagen de cabecera de la sala (RF-02) */}
            {selectedRoom.imageUrl && (
              <figure className="detail-figure">
                <img
                  className="detail-image"
                  src={selectedRoom.imageUrl}
                  alt={selectedRoom.name[lang]}
                  loading="lazy"
                />
              </figure>
            )}

            <h2 className="detail-title">{selectedRoom.name[lang]}</h2>
            <p className="detail-text">{selectedRoom.description[lang]}</p>

            {/* Sección Audioguía */}
            {selectedRoom.audioUrl && (
              <section className="media-card">
                <div className="media-card__header">
                  <Volume2 size={18} aria-hidden="true" />
                  <span>Audioguía ({lang.toUpperCase()})</span>
                </div>
                <audio controls src={selectedRoom.audioUrl} />
              </section>
            )}

            {/* Recorrido 360° diferido al backlog (SPEC §5) — datos videoUrl conservados */}
          </article>
        </main>
      ) : (
        <main className="view-enter">
          <p className="section-label">Simulador de escaneo de QR por sala:</p>
          <div className="room-list">
            {roomsData.map((room, index) => (
              <button
                key={room.id}
                className="room-card"
                style={{ '--i': index } as React.CSSProperties}
                onClick={() => setSelectedRoomId(room.id)}
              >
                <span className="room-card__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="room-card__name">{room.name[lang]}</span>
                <QrCode className="room-card__icon" size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
