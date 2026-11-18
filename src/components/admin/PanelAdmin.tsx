import { useEffect, useState } from 'react';
import type { Exhibit, Language, Room } from '../../types';
import { fetchRooms } from '../../services/roomsService';
import { updateRoom, signOut, uploadMuseumMedia } from '../../services/adminService';
import { supabase } from '../../lib/supabase';
import { LogOut, Pencil, X, Check } from 'lucide-react';
import { LANGUAGES, contarIdiomas } from './idiomas';
import { EditorPiezas } from './EditorPiezas';
import { EditorTaquilla } from './EditorTaquilla';

interface Props {
  /** Vuelve a la pantalla de login (RF-10). */
  onSignOut: () => void;
}

/** RF-14: pestañas del panel — gestión de salas o taquilla. */
type Pestana = 'salas' | 'taquilla';

/** Borrador editable de una sala (camelCase). */
interface RoomDraft {
  name: Record<Language, string>;
  description: Record<Language, string>;
  imageUrl: string;
  audioUrl: string;
}

function toDraft(room: Room): RoomDraft {
  return {
    name: { ...room.name },
    description: { ...room.description },
    imageUrl: room.imageUrl ?? '',
    audioUrl: room.audioUrl ?? '',
  };
}

/** RF-10: vista principal del panel — lista salas y permite editarlas. */
export function PanelAdmin({ onSignOut }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RoomDraft | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  /** RF-11: campo multimedia que se está subiendo (imagen o audioguía). */
  const [uploadingField, setUploadingField] = useState<'imageUrl' | 'audioUrl' | null>(null);
  /** RF-14: pestaña activa del panel. */
  const [pestana, setPestana] = useState<Pestana>('salas');

  useEffect(() => {
    let cancelled = false;

    fetchRooms().then((result) => {
      if (cancelled) return;
      setRooms(result);
      setIsLoading(false);
    });

    supabase?.auth.getSession().then(({ data }) => {
      if (!cancelled) setUserEmail(data.session?.user.email ?? '');
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const startEditing = (room: Room) => {
    setEditingId(room.id);
    setDraft(toDraft(room));
    setNotice(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft(null);
    setNotice(null);
    setUploadingField(null);
  };

  /**
   * RF-11: sube el archivo elegido a Supabase Storage y actualiza
   * el campo de URL correspondiente del borrador con la URL pública.
   */
  const handleUploadFile = async (
    field: 'imageUrl' | 'audioUrl',
    file: File | undefined
  ) => {
    if (!file) return;

    setNotice(null);
    setUploadingField(field);

    try {
      const folder = field === 'imageUrl' ? 'images' : 'audios';
      const publicUrl = await uploadMuseumMedia(file, folder);
      setDraftField(field, publicUrl);
      setNotice({
        kind: 'ok',
        text:
          field === 'imageUrl'
            ? 'Imagen subida correctamente. Pulsa «Guardar cambios» para aplicarla a la sala.'
            : 'Audioguía subida correctamente. Pulsa «Guardar cambios» para aplicarla a la sala.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo subir el archivo.';
      setNotice({ kind: 'error', text: message });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (roomId: string) => {
    if (!draft || uploadingField) return;

    setIsSaving(true);
    setNotice(null);

    const result = await updateRoom(roomId, draft);

    setIsSaving(false);

    if (!result.ok) {
      setNotice({ kind: 'error', text: result.error ?? 'No se pudieron guardar los cambios.' });
      return;
    }

    // Refleja los cambios localmente sin recargar
    setRooms((current) =>
      current.map((room) =>
        room.id === roomId
          ? {
              ...room,
              name: { ...draft.name },
              description: { ...draft.description },
              imageUrl: draft.imageUrl || undefined,
              audioUrl: draft.audioUrl || undefined,
            }
          : room
      )
    );
    setNotice({ kind: 'ok', text: 'Cambios guardados correctamente.' });
    setEditingId(null);
    setDraft(null);
  };

  /** RF-13: refleja localmente las piezas creadas, editadas o eliminadas. */
  const handleExhibitsChange = (roomId: string, exhibits: Exhibit[]) => {
    setRooms((current) =>
      current.map((room) => (room.id === roomId ? { ...room, exhibits } : room))
    );
  };

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
  };

  /** RF-14: cambia de pestaña limpiando el estado de edición de salas. */
  const cambiarPestana = (siguiente: Pestana) => {
    if (siguiente === pestana) return;
    if (siguiente === 'taquilla') cancelEditing();
    setNotice(null);
    setPestana(siguiente);
  };

  const setDraftField = <K extends keyof RoomDraft>(key: K, value: RoomDraft[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const setDraftLang = (
    key: 'name' | 'description',
    lang: Language,
    value: string
  ) => {
    setDraft((current) =>
      current ? { ...current, [key]: { ...current[key], [lang]: value } } : current
    );
  };

  return (
    <div className="app app--wide">
      <header className="app-header">
        <h1 className="app-title">Panel de Administración</h1>
        <div className="header-actions">
          <button className="btn btn--ghost" onClick={handleSignOut} title="Cerrar sesión">
            <LogOut size={16} aria-hidden="true" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      <main className="view-enter">
        <p className="section-label">
          {userEmail ? `Administrador: ${userEmail}` : 'Gestión de salas'}
        </p>

        {notice && (
          <p
            className={notice.kind === 'ok' ? 'admin-ok' : 'admin-error'}
            role={notice.kind === 'ok' ? 'status' : 'alert'}
          >
            {notice.text}
          </p>
        )}

        {/* RF-14: pestañas del panel */}
        <nav className="admin-tabs" aria-label="Secciones del panel">
          <button
            type="button"
            className={`admin-tab${pestana === 'salas' ? ' is-active' : ''}`}
            aria-current={pestana === 'salas' ? 'page' : undefined}
            onClick={() => cambiarPestana('salas')}
          >
            Salas
          </button>
          <button
            type="button"
            className={`admin-tab${pestana === 'taquilla' ? ' is-active' : ''}`}
            aria-current={pestana === 'taquilla' ? 'page' : undefined}
            onClick={() => cambiarPestana('taquilla')}
          >
            Taquilla y Cobro QR
          </button>
        </nav>

        {pestana === 'taquilla' ? (
          <EditorTaquilla />
        ) : isLoading ? (
          <div className="loader" aria-hidden="true" />
        ) : (
          <div className="room-list">
            {rooms.map((room, index) => {
              const isEditing = editingId === room.id;
              // Indicador: cuántos idiomas tienen título configurado
              const langCount = contarIdiomas(room.name);
              return (
                <section key={room.id} className="admin-room">
                  <div className="admin-room__row">
                    <span className="room-card__index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="room-card__name">{room.name.es}</span>
                    <span className="admin-badge" title="Idiomas con título configurado">
                      {langCount}/{LANGUAGES.length} idiomas
                    </span>
                    <button
                      className="btn admin-room__edit"
                      onClick={() => (isEditing ? cancelEditing() : startEditing(room))}
                      aria-label={isEditing ? 'Cancelar edición' : `Editar ${room.name.es}`}
                    >
                      {isEditing ? <X size={16} /> : <Pencil size={16} />}
                      <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
                    </button>
                  </div>

                  {isEditing && draft && (
                    <form
                      className="admin-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSave(room.id);
                      }}
                    >
                      {LANGUAGES.map(({ code, label }) => (
                        <fieldset key={code} className="admin-lang">
                          <legend className="admin-field__label">{label}</legend>
                          <label className="admin-field" htmlFor={`${room.id}-name-${code}`}>
                            <span className="admin-field__label">Título</span>
                            <input
                              id={`${room.id}-name-${code}`}
                              className="admin-input"
                              type="text"
                              required
                              value={draft.name[code]}
                              onChange={(e) => setDraftLang('name', code, e.target.value)}
                            />
                          </label>
                          <label className="admin-field" htmlFor={`${room.id}-desc-${code}`}>
                            <span className="admin-field__label">Descripción</span>
                            <textarea
                              id={`${room.id}-desc-${code}`}
                              className="admin-textarea"
                              rows={3}
                              required
                              value={draft.description[code]}
                              onChange={(e) => setDraftLang('description', code, e.target.value)}
                            />
                          </label>
                        </fieldset>
                      ))}

                      <div className="admin-field">
                        <span className="admin-field__label" id={`${room.id}-image-upload-label`}>
                          Imagen de la sala (jpg, png, webp)
                        </span>
                        <input
                          id={`${room.id}-image-file`}
                          className="admin-input admin-input--file"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          aria-labelledby={`${room.id}-image-upload-label`}
                          disabled={uploadingField !== null}
                          onChange={(e) =>
                            handleUploadFile('imageUrl', e.target.files?.[0])
                          }
                        />
                        {uploadingField === 'imageUrl' && (
                          <span className="admin-upload" role="status">
                            <span className="admin-upload__spinner" aria-hidden="true" />
                            Subiendo archivo…
                          </span>
                        )}
                      </div>

                      <div className="admin-field">
                        <span className="admin-field__label" id={`${room.id}-audio-upload-label`}>
                          Audioguía de la sala (mp3, wav, m4a)
                        </span>
                        <input
                          id={`${room.id}-audio-file`}
                          className="admin-input admin-input--file"
                          type="file"
                          accept="audio/mpeg,audio/mp3,audio/wav,audio/x-m4a,audio/mp4"
                          aria-labelledby={`${room.id}-audio-upload-label`}
                          disabled={uploadingField !== null}
                          onChange={(e) =>
                            handleUploadFile('audioUrl', e.target.files?.[0])
                          }
                        />
                        {uploadingField === 'audioUrl' && (
                          <span className="admin-upload" role="status">
                            <span className="admin-upload__spinner" aria-hidden="true" />
                            Subiendo archivo…
                          </span>
                        )}
                      </div>

                      <div className="admin-form__actions">
                        <button
                          className="btn btn--primary"
                          type="submit"
                          disabled={isSaving || uploadingField !== null}
                        >
                          <Check size={16} aria-hidden="true" />
                          {isSaving
                            ? 'Guardando…'
                            : uploadingField
                              ? 'Subiendo archivo…'
                              : 'Guardar cambios'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* RF-13: piezas de la sala (fuera del <form> de la sala: sin formularios anidados) */}
                  {isEditing && (
                    <EditorPiezas
                      roomId={room.id}
                      exhibits={room.exhibits ?? []}
                      onChange={(exhibits) => handleExhibitsChange(room.id, exhibits)}
                    />
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
