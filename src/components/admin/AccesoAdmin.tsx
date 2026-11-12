import { useState, type FormEvent } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Lock } from 'lucide-react';

interface Props {
  /** Notifica a App.tsx que la sesión quedó activa (RF-10). */
  onAuthenticated: () => void;
}

/** RF-10: formulario de acceso de administradores con Supabase Auth. */
export function AccesoAdmin({ onAuthenticated }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      return;
    }

    onAuthenticated();
  };

  return (
    <div className="app app--login">
      <main className="view-enter">
        <form className="admin-card" onSubmit={handleSubmit} noValidate>
          <div className="admin-card__icon" aria-hidden="true">
            <Lock size={20} />
          </div>
          <h1 className="section-label">Acceso de administradores</h1>
          <p className="detail-text">
            Inicia sesión para editar los contenidos de las salas del museo.
          </p>

          {!isSupabaseConfigured && (
            <p className="admin-error" role="alert">
              Supabase no está configurado. Completa <code>.env</code> con
              <code> VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>.
            </p>
          )}

          <label className="admin-field" htmlFor="admin-email">
            <span className="admin-field__label">Correo</span>
            <input
              id="admin-email"
              className="admin-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@museo.org"
            />
          </label>

          <label className="admin-field" htmlFor="admin-password">
            <span className="admin-field__label">Contraseña</span>
            <input
              id="admin-password"
              className="admin-input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="btn btn--primary admin-submit"
            type="submit"
            disabled={isSubmitting || !isSupabaseConfigured}
          >
            {isSubmitting ? 'Entrando…' : 'Iniciar sesión'}
          </button>
        </form>
      </main>
    </div>
  );
}
