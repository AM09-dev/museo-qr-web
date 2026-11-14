import { useState, useEffect } from 'react';
import type { Language, Room } from './types';
import { fetchRooms } from './services/roomsService';
import { GeneradorQR } from './components/GeneradorQR';
import { CabeceraApp } from './components/CabeceraApp';
import { MenuSalas } from './components/MenuSalas';
import { DetalleSala } from './components/DetalleSala';
import { SalaNoEncontrada } from './components/SalaNoEncontrada';
import { VistaCarga } from './components/VistaCarga';
import { TicketPaymentView } from './components/TicketPaymentView';
import { AccesoAdmin } from './components/admin/AccesoAdmin';
import { PanelAdmin } from './components/admin/PanelAdmin';
import { supabase } from './lib/supabase';
import { isAdminRoute, getRoomParam, isTicketRoute } from './lib/routing';
import { textosUI } from './i18n/textosUI';

/** RF-10: estados del panel de administración. */
type AdminState = 'idle' | 'checking' | 'login' | 'dashboard';

/**
 * RF-12: orquestador de la aplicación.
 * Responsabilidades: inicialización, estado global (salas, idioma, sala
 * seleccionada, panel QR, scroll), verificación de Supabase Auth (RF-10)
 * y enrutamiento condicional. El renderizado de cada vista vive en
 * `src/components/`.
 */
export default function App() {
  // — Estado global —
  const [lang, setLang] = useState<Language>('es');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState<boolean>(true);
  // RF-04 / RF-09: parámetro de URL; su presencia activa el Modo Exclusivo por QR
  const [urlRoomParam] = useState<string | null>(() => getRoomParam());
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(urlRoomParam);
  const [showQRPanel, setShowQRPanel] = useState<boolean>(false);
  // RF-14: vista de taquilla (?view=pago o ?view=taquilla, o botón de cabecera)
  const [showTicketView, setShowTicketView] = useState<boolean>(() => isTicketRoute());
  const [isScrolled, setIsScrolled] = useState<boolean>(
    () => typeof window !== 'undefined' && window.scrollY > 4
  );
  // RF-10: ruta de administración protegida por Supabase Auth
  const [adminView] = useState<boolean>(() => isAdminRoute());
  // RF-10: sin cliente Supabase no hay sesión que verificar → directo al login,
  // que informa del requisito de configuración en lugar de quedarse cargando.
  const [adminState, setAdminState] = useState<AdminState>(() => {
    if (!adminView) return 'idle';
    return supabase ? 'checking' : 'login';
  });

  // RF-10: verifica sesión activa antes de decidir login vs. dashboard
  useEffect(() => {
    if (!adminView || !supabase) return;

    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        setAdminState(data.session ? 'dashboard' : 'login');
      })
      .catch((error: unknown) => {
        // Error de red/Auth: se muestra el login en vez de bloquear la vista
        console.warn('[App] No se pudo verificar la sesión de administrador.', error);
        if (!cancelled) setAdminState('login');
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

  // RF-01: sincroniza idioma y título del documento con el idioma activo.
  // El panel de administración queda en español (fuera de alcance de RF-01).
  useEffect(() => {
    const docLang = adminView ? 'es' : lang;
    document.documentElement.lang = docLang;
    document.title = textosUI[docLang].tituloApp;
  }, [lang, adminView]);

  // Sombra en la barra superior al hacer scroll (RF-06)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // — Acciones —
  const handleBackToMenu = () => {
    setSelectedRoomId(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // — Derivados de enrutamiento —
  // RF-09: modo exclusivo = la URL abrió con ?sala= (válido o no)
  const isKioskMode = urlRoomParam !== null;
  // RF-09: ?sala= con id inexistente tras cargar los datos
  const salaNoEncontrada = !isLoadingRooms && isKioskMode && !selectedRoom;

  // RF-10: panel de administración protegido (prioridad sobre el resto de vistas)
  if (adminView) {
    if (adminState === 'checking') {
      return (
        <div className="app">
          <VistaCarga label="Verificando sesión…" />
        </div>
      );
    }
    if (adminState === 'login') {
      return <AccesoAdmin onAuthenticated={() => setAdminState('dashboard')} />;
    }
    return <PanelAdmin onSignOut={() => setAdminState('login')} />;
  }

  // RF-14: vista de taquilla (informativa; bloqueada en modo exclusivo, RF-09)
  if (showTicketView && !isKioskMode) {
    return (
      <TicketPaymentView
        language={lang}
        onBack={() => {
          setShowTicketView(false);
          handleBackToMenu();
        }}
      />
    );
  }

  // RF-05: vista del generador de QR (bloqueada en modo exclusivo, RF-09)
  if (showQRPanel && !isKioskMode) {
    return <GeneradorQR rooms={rooms} language={lang} onBack={() => setShowQRPanel(false)} />;
  }

  // — Vista principal: cabecera + enrutamiento de vistas públicas —
  return (
    <div className="app">
      <CabeceraApp
        lang={lang}
        onLangChange={setLang}
        isScrolled={isScrolled}
        showQrButton={!isKioskMode}
        onShowQr={() => setShowQRPanel(true)}
        showTicketButton={!isKioskMode}
        onShowTicket={() => setShowTicketView(true)}
      />

      {isLoadingRooms ? (
        <VistaCarga label={textosUI[lang].cargandoSalas} />
      ) : salaNoEncontrada ? (
        <SalaNoEncontrada language={lang} />
      ) : selectedRoom ? (
        <DetalleSala
          room={selectedRoom}
          language={lang}
          isKioskMode={isKioskMode}
          onBack={handleBackToMenu}
        />
      ) : (
        <MenuSalas rooms={rooms} language={lang} onSelect={setSelectedRoomId} />
      )}
    </div>
  );
}
