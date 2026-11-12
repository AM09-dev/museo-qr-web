/**
 * RF-12: utilidades de enrutamiento simple (sin router externo).
 * Funciones puras, sin estado de React, usadas por `App.tsx`.
 */

/** RF-10: detecta el acceso al panel — ruta /admin o parámetro ?view=admin. */
export function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.location.pathname.replace(/\/+$/, '') === '/admin' ||
    new URLSearchParams(window.location.search).get('view') === 'admin'
  );
}

/** RF-04 / RF-09: lee el parámetro ?sala= de la URL (su presencia activa el Modo Exclusivo). */
export function getRoomParam(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('sala');
}
