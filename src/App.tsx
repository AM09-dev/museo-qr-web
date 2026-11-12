import { useState, useEffect } from 'react';
import type { Language, Room } from './types';
import { fetchRooms } from './services/roomsService';
import { QRGenerator } from './components/QRGenerator';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { supabase } from './lib/supabase';
import { Globe, QrCode, Volume2, ArrowLeft, QrCode as QrIcon } from 'lucide-react';

/** RF-10: estados del panel de administración. */
type AdminState = 'idle' | 'checking' | 'login' | 'dashboard';

/** Detecta el acceso al panel: ruta /admin o parámetro ?view=admin. */
function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.location.pathname.replace(/\/+$/, '') === '/admin' ||
    new URLSearchParams(window.location.search).get('view') === 'admin'
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState<boolean>(true);
  // RF-04 / RF-09: parámetro de URL; su presencia activa el Modo Exclusivo por QR
  const [urlRoomParam] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('sala')
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(urlRoomParam);
  const [showQRPanel, setShowQRPanel] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(
    () => typeof window !== 'undefined' && window.scrollY > 4
  );
  // RF-10: ruta de administración protegida por Supabase Auth
  const [adminView] = useState<boolean>(isAdminRoute);
  const [adminState, setAdminState] = useState<AdminState>(adminView ? 'checking' : 'idle');

  // RF-10: verifica sesión activa antes de decidir login vs. dashboard
  useEffect(() => {
    if (!adminView) return;

    let cancelled = false;

    supabase?.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setAdminState(data.session ? 'dashboard' : 'login');
    });

    return () => {
      cancelled = true;
    };
  }, [adminView]);

  // RF-08: carga asíncrona de salas desde Supabase (con fallback local)
  useEffect(() => {
    let cancelled = false;

    fetchRooms().then((result) => {
      if (cancelled) return;
      setRooms(result);
      setIsLoadingRooms(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

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

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  // RF-09: modo exclusivo = la URL abrió con ?sala= (válido o no)
  const isKioskMode = urlRoomParam !== null;
  // RF-09: ?sala= con id inexistente tras cargar los datos
  const isRoomNotFound = !isLoadingRooms && isKioskMode && !selectedRoom;

  // RF-10: panel de administración protegido (tiene prioridad sobre el resto de vistas)
  if (adminView) {
    if (adminState === 'checking') {
      return (
        <div className="app">
          <main className="view-enter" role="status" aria-live="polite">
            <p className="section-label">Verificando sesión…</p>
            <div className="loader" aria-hidden="true" />
          </main>
        </div>
      );
    }
    if (adminState === 'login') {
      return <AdminLogin onAuthenticated={() => setAdminState('dashboard')} />;
    }
    return <AdminDashboard onSignOut={() => setAdminState('login')} />;
  }

  // Si activó la vista del generador de QR (bloqueado en modo exclusivo, RF-09)
  if (showQRPanel && !isKioskMode) {
    return <QRGenerator rooms={rooms} language={lang} onBack={() => setShowQRPanel(false)} />;
  }

  return (
    <div className="app">
      {/* Header con Selector de Idioma y Botón de Panel QR */}
      <header className={`app-header${isScrolled ? ' is-scrolled' : ''}`}>
        <h1 className="app-title">Museo Interactivo</h1>

        <div className="header-actions">
          {/* RF-09: sin acceso al generador QR en modo exclusivo por escaneo */}
          {!isKioskMode && (
            <button
              className="btn btn--primary"
              onClick={() => setShowQRPanel(true)}
              title="Ver Códigos QR"
              aria-label="Ver Códigos QR"
            >
              <QrIcon size={16} aria-hidden="true" />
              <span>Ver QR</span>
            </button>
          )}

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

      {/* Estado de carga minimalista (RF-08) */}
      {isLoadingRooms ? (
        <main className="view-enter" role="status" aria-live="polite">
          <p className="section-label">Cargando salas…</p>
          <div className="loader" aria-hidden="true" />
        </main>
      ) : isRoomNotFound ? (
        /* RF-09: sala inexistente — sin menú ni generador QR */
        <main className="view-enter" role="alert">
          <section className="detail-card">
            <h2 className="detail-title">Sala no encontrada</h2>
            <p className="detail-text">
              El código QR escaneado apunta a una sala que no existe o no está disponible.
              Consulta al personal del museo o vuelve a escanear otro código.
            </p>
          </section>
        </main>
      ) : selectedRoom ? (
        <main className="view-enter" key={selectedRoom.id}>
          {/* RF-09: en modo exclusivo no existe navegación al menú general */}
          {!isKioskMode && (
            <button className="btn btn--ghost" onClick={handleBackToMenu}>
              <ArrowLeft size={16} aria-hidden="true" /> Volver al menú de salas
            </button>
          )}

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
            {rooms.map((room, index) => (
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
