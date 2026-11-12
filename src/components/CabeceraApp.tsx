import { Globe, QrCode } from 'lucide-react';
import type { Language } from '../types';

interface Props {
  /** Idioma activo (RF-01) */
  lang: Language;
  onLangChange: (lang: Language) => void;
  /** Sombra en la barra superior al hacer scroll (RF-06) */
  isScrolled: boolean;
  /** RF-09: en Modo Kiosco el acceso al generador QR permanece oculto */
  showQrButton: boolean;
  onShowQr: () => void;
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'es', label: '🇲🇽 ES' },
  { value: 'en', label: '🇺🇸 EN' },
  { value: 'fr', label: '🇫🇷 FR' },
  { value: 'de', label: '🇩🇪 DE' },
];

/** RF-12: cabecera de la vista pública — título, acceso al panel QR y selector de idioma. */
export function CabeceraApp({ lang, onLangChange, isScrolled, showQrButton, onShowQr }: Props) {
  return (
    <header className={`app-header${isScrolled ? ' is-scrolled' : ''}`}>
      <h1 className="app-title">Museo Interactivo</h1>

      <div className="header-actions">
        {/* RF-09: sin acceso al generador QR en modo exclusivo por escaneo */}
        {showQrButton && (
          <button
            className="btn btn--primary"
            onClick={onShowQr}
            title="Ver Códigos QR"
            aria-label="Ver Códigos QR"
          >
            <QrCode size={16} aria-hidden="true" />
            <span>Ver QR</span>
          </button>
        )}

        <div className="lang-group">
          <Globe size={18} aria-hidden="true" />
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => onLangChange(e.target.value as Language)}
            aria-label="Seleccionar idioma"
          >
            {LANGUAGES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
