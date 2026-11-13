import { useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { Exhibit, Language } from '../../types';
import {
  createExhibit,
  deleteExhibit,
  updateExhibit,
  uploadMuseumMedia,
} from '../../services/adminService';
import { LANGUAGES, contarIdiomas } from './idiomas';

interface Props {
  roomId: string;
  /** Piezas actuales de la sala, ordenadas por `position`. */
  exhibits: Exhibit[];
  /** Notifica a `PanelAdmin` la nueva lista tras crear, editar o eliminar. */
  onChange: (exhibits: Exhibit[]) => void;
}

/** Borrador editable de una pieza (camelCase). */
interface ExhibitDraft {
  name: Record<Language, string>;
  description: Record<Language, string>;
  imageUrl: string;
}

/** `'new'` = alta de una pieza; un id = edición de esa pieza. */
type EditingTarget = 'new' | string | null;

const EMPTY_TEXTS: Record<Language, string> = { es: '', en: '', fr: '', de: '' };

function emptyDraft(): ExhibitDraft {
  return { name: { ...EMPTY_TEXTS }, description: { ...EMPTY_TEXTS }, imageUrl: '' };
}

function toDraft(exhibit: Exhibit): ExhibitDraft {
  return {
    name: { ...EMPTY_TEXTS, ...exhibit.name },
    description: { ...EMPTY_TEXTS, ...exhibit.description },
    imageUrl: exhibit.imageUrl ?? '',
  };
}

/**
 * RF-13: gestión de las piezas de una sala dentro del panel de administración.
 * Cada pieza se guarda de forma independiente de los cambios de la sala.
 */
export function EditorPiezas({ roomId, exhibits, onChange }: Props) {
  const [editing, setEditing] = useState<EditingTarget>(null);
  const [draft, setDraft] = useState<ExhibitDraft | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const isBusy = isSaving || isUploading || deletingId !== null;

  const startCreating = () => {
    setEditing('new');
    setDraft(emptyDraft());
    setNotice(null);
  };

  const startEditing = (exhibit: Exhibit) => {
    setEditing(exhibit.id);
    setDraft(toDraft(exhibit));
    setNotice(null);
  };

  const cancelEditing = () => {
    setEditing(null);
    setDraft(null);
    setNotice(null);
  };

  const setDraftLang = (key: 'name' | 'description', lang: Language, value: string) => {
    setDraft((current) =>
      current ? { ...current, [key]: { ...current[key], [lang]: value } } : current
    );
  };

  /** RF-11: sube la imagen al bucket y guarda la URL pública en el borrador. */
  const handleUploadImage = async (file: File | undefined) => {
    if (!file) return;

    setNotice(null);
    setIsUploading(true);

    try {
      const publicUrl = await uploadMuseumMedia(file, 'images');
      setDraft((current) => (current ? { ...current, imageUrl: publicUrl } : current));
      setNotice({
        kind: 'ok',
        text: 'Imagen subida correctamente. Pulsa «Guardar pieza» para aplicarla.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo subir el archivo.';
      setNotice({ kind: 'error', text: message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!draft || !editing || isBusy) return;

    if (!draft.name.es.trim()) {
      setNotice({ kind: 'error', text: 'El nombre de la pieza en español es obligatorio.' });
      return;
    }

    setIsSaving(true);
    setNotice(null);

    const result =
      editing === 'new'
        ? await createExhibit(roomId, draft)
        : await updateExhibit(editing, draft);

    setIsSaving(false);

    if (!result.ok || !result.exhibit) {
      // El borrador se conserva para poder reintentar
      setNotice({ kind: 'error', text: result.error ?? 'No se pudo guardar la pieza.' });
      return;
    }

    const saved = result.exhibit;
    const next =
      editing === 'new'
        ? [...exhibits, saved]
        : exhibits.map((exhibit) => (exhibit.id === saved.id ? saved : exhibit));
    onChange(next.sort((a, b) => a.position - b.position));

    setNotice({
      kind: 'ok',
      text: editing === 'new' ? 'Pieza creada correctamente.' : 'Pieza guardada correctamente.',
    });
    setEditing(null);
    setDraft(null);
  };

  const handleDelete = async (exhibit: Exhibit) => {
    if (isBusy) return;

    const confirmed = window.confirm(
      `¿Eliminar la pieza «${exhibit.name.es}»? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    setDeletingId(exhibit.id);
    setNotice(null);

    const result = await deleteExhibit(exhibit.id);

    setDeletingId(null);

    if (!result.ok) {
      setNotice({ kind: 'error', text: result.error ?? 'No se pudo eliminar la pieza.' });
      return;
    }

    if (editing === exhibit.id) {
      setEditing(null);
      setDraft(null);
    }
    onChange(exhibits.filter((item) => item.id !== exhibit.id));
    setNotice({ kind: 'ok', text: 'Pieza eliminada.' });
  };

  /** Formulario de alta/edición de una pieza. */
  const renderForm = (formId: string) =>
    draft && (
      <form
        className="admin-form admin-exhibit__form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        noValidate
      >
        {LANGUAGES.map(({ code, label }) => (
          <fieldset key={code} className="admin-lang">
            <legend className="admin-field__label">{label}</legend>
            <label className="admin-field" htmlFor={`${formId}-name-${code}`}>
              <span className="admin-field__label">
                Nombre{code === 'es' ? ' (obligatorio)' : ''}
              </span>
              <input
                id={`${formId}-name-${code}`}
                className="admin-input"
                type="text"
                required={code === 'es'}
                value={draft.name[code]}
                onChange={(e) => setDraftLang('name', code, e.target.value)}
              />
            </label>
            <label className="admin-field" htmlFor={`${formId}-desc-${code}`}>
              <span className="admin-field__label">Descripción</span>
              <textarea
                id={`${formId}-desc-${code}`}
                className="admin-textarea"
                rows={3}
                value={draft.description[code]}
                onChange={(e) => setDraftLang('description', code, e.target.value)}
              />
            </label>
          </fieldset>
        ))}

        <div className="admin-field">
          <span className="admin-field__label" id={`${formId}-image-label`}>
            Imagen de la pieza (jpg, png, webp)
          </span>
          {draft.imageUrl && (
            <img className="admin-exhibit__preview" src={draft.imageUrl} alt="" />
          )}
          <input
            className="admin-input admin-input--file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-labelledby={`${formId}-image-label`}
            disabled={isBusy}
            onChange={(e) => handleUploadImage(e.target.files?.[0])}
          />
          {isUploading && (
            <span className="admin-upload" role="status">
              <span className="admin-upload__spinner" aria-hidden="true" />
              Subiendo archivo…
            </span>
          )}
        </div>

        <div className="admin-form__actions admin-exhibit__actions">
          <button className="btn btn--ghost" type="button" onClick={cancelEditing} disabled={isSaving}>
            <X size={16} aria-hidden="true" />
            Cancelar
          </button>
          <button className="btn btn--primary" type="submit" disabled={isBusy}>
            <Check size={16} aria-hidden="true" />
            {isSaving ? 'Guardando…' : isUploading ? 'Subiendo archivo…' : 'Guardar pieza'}
          </button>
        </div>
      </form>
    );

  return (
    <section className="admin-exhibits" aria-labelledby={`${roomId}-exhibits-title`}>
      <div className="admin-exhibits__header">
        <h3 className="section-label" id={`${roomId}-exhibits-title`}>
          Piezas ({exhibits.length})
        </h3>
        {editing !== 'new' && (
          <button
            className="btn admin-room__edit"
            type="button"
            onClick={startCreating}
            disabled={isBusy || editing !== null}
          >
            <Plus size={16} aria-hidden="true" />
            <span>Añadir pieza</span>
          </button>
        )}
      </div>

      {notice && (
        <p
          className={notice.kind === 'ok' ? 'admin-ok' : 'admin-error'}
          role={notice.kind === 'ok' ? 'status' : 'alert'}
        >
          {notice.text}
        </p>
      )}

      {exhibits.length === 0 && editing !== 'new' && (
        <p className="admin-exhibits__empty">Esta sala aún no tiene piezas.</p>
      )}

      <ul className="admin-exhibits__list">
        {exhibits.map((exhibit) => {
          const isEditing = editing === exhibit.id;
          return (
            <li key={exhibit.id} className="admin-exhibit">
              <div className="admin-room__row">
                <span className="room-card__name">{exhibit.name.es}</span>
                <span className="admin-badge" title="Idiomas con nombre configurado">
                  {contarIdiomas(exhibit.name)}/{LANGUAGES.length} idiomas
                </span>
                <button
                  className="btn admin-room__edit"
                  type="button"
                  onClick={() => (isEditing ? cancelEditing() : startEditing(exhibit))}
                  disabled={isBusy || (editing !== null && !isEditing)}
                  aria-label={isEditing ? 'Cancelar edición' : `Editar ${exhibit.name.es}`}
                >
                  {isEditing ? <X size={16} /> : <Pencil size={16} />}
                  <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
                </button>
                <button
                  className="btn admin-room__edit admin-exhibit__delete"
                  type="button"
                  onClick={() => handleDelete(exhibit)}
                  disabled={isBusy || editing !== null}
                  aria-label={`Eliminar ${exhibit.name.es}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  <span>{deletingId === exhibit.id ? 'Eliminando…' : 'Eliminar'}</span>
                </button>
              </div>
              {isEditing && renderForm(`exhibit-${exhibit.id}`)}
            </li>
          );
        })}
      </ul>

      {editing === 'new' && (
        <div className="admin-exhibit admin-exhibit--new">
          <p className="admin-field__label">Nueva pieza</p>
          {renderForm(`${roomId}-new-exhibit`)}
        </div>
      )}
    </section>
  );
}
