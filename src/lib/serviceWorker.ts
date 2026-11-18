/**
 * RF-15: registro seguro del Service Worker.
 *
 * - Solo en producción (`import.meta.env.PROD`) para no interferir con el HMR
 *   de `npm run dev`, y en contexto seguro (https o localhost).
 * - **Sin recargas forzadas:** el SW usa `skipWaiting()` + `clients.claim()`,
 *   así que una versión nueva toma el control **sin** recargar la página:
 *   no se interrumpe una sesión de administrador (RF-10) ni una ruta en curso
 *   como `/?view=pago` (RF-14). `location.reload()` jamás se fuerza.
 */

/** Evita registros duplicados (p. ej. re-ejecución del módulo en StrictMode). */
let registroIniciado = false;

/** Registra `/sw.js` con scope `/` una vez que la página terminó de cargar. */
export function registrarServiceWorker(): void {
  if (!import.meta.env.PROD) return;
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  if (typeof window !== 'undefined' && !window.isSecureContext) return;
  if (registroIniciado) return;
  registroIniciado = true;

  const registrar = () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => vigilarActualizaciones(registration))
      .catch((error: unknown) => {
        // Un fallo de registro nunca debe afectar el arranque de la app
        console.warn('[serviceWorker] No se pudo registrar el Service Worker.', error);
      });
  };

  if (document.readyState === 'complete') {
    registrar();
  } else {
    window.addEventListener('load', registrar, { once: true });
  }
}

/**
 * Detecta deploys nuevos sin forzar recargas:
 * - `registration.update()` al volver la pestaña a primer plano.
 * - Aviso por consola cuando una versión nueva ya está activa.
 */
function vigilarActualizaciones(registration: ServiceWorkerRegistration): void {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      registration.update().catch(() => undefined);
    }
  });

  const avisarSiHayNueva = () => {
    const actualizando = registration.installing;
    if (!actualizando) return;
    actualizando.addEventListener('statechange', () => {
      if (
        (actualizando.state === 'activated' || actualizando.state === 'installed') &&
        navigator.serviceWorker.controller
      ) {
        console.info(
          '[serviceWorker] Service Worker actualizado; la nueva versión ya sirve las peticiones (sin recarga).'
        );
      }
    });
  };

  if (registration.installing) avisarSiHayNueva();
  registration.addEventListener('updatefound', avisarSiHayNueva);
}
