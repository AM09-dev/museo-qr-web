import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Check, Copy, CreditCard, Landmark } from 'lucide-react';
import type { Language, MuseumSettings } from '../types';
import { getMuseumSettings } from '../services/settingsService';
import { textosUI } from '../i18n/textosUI';
import { VistaCarga } from './VistaCarga';

interface Props {
  language: Language;
  /** Vuelve al menú de salas (limpia el parámetro ?view= de la URL). */
  onBack: () => void;
}

/** Formatea el precio como `$150.00 MXN` con la moneda configurada (RF-14). */
function formatPrecio(ticketPrice: number, currency: string): string {
  const code = currency.trim().toUpperCase() || 'MXN';
  try {
    const simbolo = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: code,
    }).format(ticketPrice);
    // Añade el código ISO: `$80.00` → `$80.00 MXN`
    return simbolo.includes(code) ? simbolo : `${simbolo} ${code}`;
  } catch {
    return `$${ticketPrice.toFixed(2)} ${code}`;
  }
}

/** Agrupa la CLABE cada 4 dígitos solo para mostrarla (se copia sin espacios). */
function clabeFormateada(clabe: string): string {
  return clabe.replace(/(.{4})/g, '$1 ').trim();
}

/** Copia al portapapeles: Clipboard API con respaldo `execCommand`. */
async function copiarTexto(texto: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // Se intenta con el método clásico a continuación
  }

  try {
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'absolute';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/**
 * RF-14: vista pública de taquilla — precio vigente, QR de pago y
 * datos de transferencia SPEI. Informativa: no bloquea el acceso a las salas.
 */
export function TicketPaymentView({ language, onBack }: Props) {
  const t = textosUI[language];

  const [settings, setSettings] = useState<MuseumSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<'clabe' | 'monto' | null>(null);

  // Lectura pública en tiempo real desde Supabase (RF-14)
  useEffect(() => {
    let cancelled = false;

    getMuseumSettings().then((result) => {
      if (cancelled) return;
      if (!result.settings && result.error) {
        // Detalle técnico solo en consola: el visitante ve el texto de TextosUI
        console.warn('[TicketPaymentView] No se pudo cargar la taquilla.', result.error);
      }
      setSettings(result.settings);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const tieneLink = Boolean(settings?.paymentLink);
  // Sin enlace de pago, el QR apunta a esta misma vista para imprimirla en la entrada
  const pagoUrl = settings?.paymentLink || `${window.location.origin}/?view=pago`;
  const tieneSpei = Boolean(settings?.bankClabe && settings.bankBeneficiary);

  const handleCopy = async (campo: 'clabe' | 'monto', texto: string) => {
    const ok = await copiarTexto(texto);
    if (ok) setCopied(campo);
  };

  return (
    <div className="app app--wide">
      <div className="taquilla-panel">
        <div className="taquilla-panel__header">
          <button className="btn btn--ghost" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" /> {t.volverMenu}
          </button>
        </div>

        <h2 className="taquilla-title">{t.taquillaTitulo}</h2>
        <p className="taquilla-intro">{t.taquillaIntro}</p>

        {isLoading ? (
          <VistaCarga label={t.cargandoTaquilla} />
        ) : (
          <div className="taquilla-grid">
            {/* Precio vigente (tiempo real) + indicación de ingreso */}
            <section className="taquilla-card">
              <span className="section-label">{t.precioEntrada}</span>
              {settings ? (
                <p className="taquilla-precio">
                  {formatPrecio(settings.ticketPrice, settings.currency)}
                </p>
              ) : (
                <p className="taquilla-vacio" role="status">
                  {t.taquillaSinDatos}
                </p>
              )}
              <p className="taquilla-aviso">{t.avisoPago}.</p>
            </section>

            {/* QR dinámico de pago */}
            <section className="taquilla-card taquilla-card--qr">
              <span className="section-label">{t.qrPagoTitulo}</span>
              <div className="qr-card__frame">
                <QRCodeSVG value={pagoUrl} size={160} level="H" includeMargin={true} />
              </div>
              {tieneLink && (
                <a
                  className="btn btn--primary taquilla-pagar"
                  href={settings!.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CreditCard size={16} aria-hidden="true" />
                  {t.pagarEnLinea}
                </a>
              )}
              <p className="taquilla-nota">{tieneLink ? t.qrPagoNota : t.qrTaquillaNota}</p>
            </section>

            {/* Transferencia SPEI */}
            {settings && tieneSpei && (
              <section className="taquilla-card">
                <span className="section-label">
                  <Landmark size={14} aria-hidden="true" />
                  {t.transferenciaTitulo}
                </span>

                <dl className="taquilla-datos">
                  <div className="taquilla-dato">
                    <dt>{t.campoClabe}</dt>
                    <dd className="taquilla-clabe">{clabeFormateada(settings.bankClabe)}</dd>
                  </div>
                  <div className="taquilla-dato">
                    <dt>{t.campoBeneficiario}</dt>
                    <dd>{settings.bankBeneficiary}</dd>
                  </div>
                  <div className="taquilla-dato">
                    <dt>{t.campoMonto}</dt>
                    <dd>
                      {settings.ticketPrice.toFixed(2)} {settings.currency}
                    </dd>
                  </div>
                </dl>

                <div className="taquilla-acciones">
                  <button
                    className="btn btn--ghost"
                    type="button"
                    onClick={() => handleCopy('clabe', settings.bankClabe)}
                  >
                    {copied === 'clabe' ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <Copy size={16} aria-hidden="true" />
                    )}
                    {copied === 'clabe' ? t.copiado : t.copiarClabe}
                  </button>
                  <button
                    className="btn btn--ghost"
                    type="button"
                    onClick={() => handleCopy('monto', settings.ticketPrice.toFixed(2))}
                  >
                    {copied === 'monto' ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <Copy size={16} aria-hidden="true" />
                    )}
                    {copied === 'monto' ? t.copiado : t.copiarMonto}
                  </button>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
