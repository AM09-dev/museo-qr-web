import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Printer } from 'lucide-react';
import type { MuseumSettings } from '../../types';
import {
  DEFAULT_MUSEUM_SETTINGS,
  getMuseumSettings,
  updateMuseumSettings,
} from '../../services/settingsService';

/** Borrador editable: el precio viaja como texto para permitir teclear. */
interface TaquillaDraft {
  ticketPrice: string;
  currency: string;
  paymentLink: string;
  bankClabe: string;
  bankBeneficiary: string;
}

function toDraft(settings: MuseumSettings): TaquillaDraft {
  return {
    ticketPrice: String(settings.ticketPrice),
    currency: settings.currency,
    paymentLink: settings.paymentLink,
    bankClabe: settings.bankClabe,
    bankBeneficiary: settings.bankBeneficiary,
  };
}

/**
 * RF-14: sección «Taquilla y Cobro QR» del panel de administración.
 * Edita la configuración de la tabla `museum_settings` y muestra en tiempo
 * real el QR de taquilla (`/?view=pago`) listo para imprimir.
 */
export function EditorTaquilla() {
  const [draft, setDraft] = useState<TaquillaDraft | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const qrUrl = `${window.location.origin}/?view=pago`;

  useEffect(() => {
    let cancelled = false;

    getMuseumSettings().then((result) => {
      if (cancelled) return;
      setDraft(toDraft(result.settings ?? DEFAULT_MUSEUM_SETTINGS));
      setIsLoading(false);
      if (!result.settings && result.error) {
        setNotice({ kind: 'error', text: `${result.error} Se usarán valores por defecto.` });
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setField = <K extends keyof TaquillaDraft>(key: K, value: TaquillaDraft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft || isSaving) return;

    if (draft.ticketPrice.trim() === '') {
      setNotice({ kind: 'error', text: 'Indica el precio de entrada.' });
      return;
    }

    setIsSaving(true);
    setNotice(null);

    const result = await updateMuseumSettings({
      ticketPrice: Number(draft.ticketPrice),
      currency: draft.currency,
      paymentLink: draft.paymentLink,
      bankClabe: draft.bankClabe,
      bankBeneficiary: draft.bankBeneficiary,
    });

    setIsSaving(false);

    if (!result.ok) {
      // El borrador se conserva para poder reintentar
      setNotice({ kind: 'error', text: result.error ?? 'No se pudo guardar la taquilla.' });
      return;
    }

    setNotice({ kind: 'ok', text: 'Taquilla guardada correctamente.' });
  };

  /** Imprime únicamente el QR (clase `print-solo-qr` en <body>). */
  const handlePrint = () => {
    document.body.classList.add('print-solo-qr');
    const limpiar = () => document.body.classList.remove('print-solo-qr');
    window.addEventListener('afterprint', limpiar, { once: true });
    window.print();
  };

  return (
    <section className="admin-taquilla" aria-labelledby="admin-taquilla-title">
      <div className="admin-exhibits__header">
        <h3 className="section-label" id="admin-taquilla-title">
          Taquilla y Cobro QR
        </h3>
      </div>

      {notice && (
        <p
          className={notice.kind === 'ok' ? 'admin-ok' : 'admin-error'}
          role={notice.kind === 'ok' ? 'status' : 'alert'}
        >
          {notice.text}
        </p>
      )}

      {isLoading || !draft ? (
        <div className="loader" aria-hidden="true" />
      ) : (
        <div className="admin-taquilla__grid">
          <form className="admin-form admin-taquilla__form" onSubmit={handleSave} noValidate>
            <label className="admin-field" htmlFor="taquilla-precio">
              <span className="admin-field__label">Precio de entrada</span>
              <input
                id="taquilla-precio"
                className="admin-input"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                required
                value={draft.ticketPrice}
                onChange={(e) => setField('ticketPrice', e.target.value)}
                placeholder="150.00"
              />
            </label>

            <label className="admin-field" htmlFor="taquilla-moneda">
              <span className="admin-field__label">Moneda (ISO 4217)</span>
              <input
                id="taquilla-moneda"
                className="admin-input"
                type="text"
                maxLength={3}
                value={draft.currency}
                onChange={(e) => setField('currency', e.target.value.toUpperCase())}
                placeholder="MXN"
              />
            </label>

            <label className="admin-field" htmlFor="taquilla-enlace">
              <span className="admin-field__label">Enlace de pago</span>
              <input
                id="taquilla-enlace"
                className="admin-input"
                type="url"
                value={draft.paymentLink}
                onChange={(e) => setField('paymentLink', e.target.value)}
                placeholder="https://…"
              />
            </label>

            <label className="admin-field" htmlFor="taquilla-clabe">
              <span className="admin-field__label">CLABE interbancaria</span>
              <input
                id="taquilla-clabe"
                className="admin-input"
                type="text"
                inputMode="numeric"
                maxLength={22}
                value={draft.bankClabe}
                onChange={(e) => setField('bankClabe', e.target.value)}
                placeholder="000000000000000000"
              />
            </label>

            <label className="admin-field" htmlFor="taquilla-beneficiario">
              <span className="admin-field__label">Beneficiario</span>
              <input
                id="taquilla-beneficiario"
                className="admin-input"
                type="text"
                value={draft.bankBeneficiary}
                onChange={(e) => setField('bankBeneficiary', e.target.value)}
                placeholder="Museo Interactivo"
              />
            </label>

            <div className="admin-form__actions">
              <button className="btn btn--primary" type="submit" disabled={isSaving}>
                <Check size={16} aria-hidden="true" />
                {isSaving ? 'Guardando…' : 'Guardar taquilla'}
              </button>
            </div>
          </form>

          {/* QR de taquilla en tiempo real, listo para imprimir en la entrada */}
          <div className="admin-taquilla__qr">
            <p className="admin-field__label">QR de taquilla (tiempo real)</p>
            <div className="qr-card__frame taquilla-print">
              <QRCodeSVG value={qrUrl} size={160} level="H" includeMargin={true} />
            </div>
            <p className="admin-taquilla__url">{qrUrl}</p>
            <button className="btn btn--ghost" type="button" onClick={handlePrint}>
              <Printer size={16} aria-hidden="true" />
              Imprimir QR de taquilla
            </button>
            <p className="admin-taquilla__nota">
              Imprime este código y colócalo en la entrada del museo: abre la vista de pago
              (/?view=pago) con el precio vigente.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
