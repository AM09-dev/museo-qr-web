/* RF-15: Service Worker de la PWA — app shell + estrategias de caché.
 *
 * Estrategias (solo peticiones GET sobre http(s)):
 *   - Navegaciones / rutas: network-first → index.html en caché → página de respaldo.
 *   - Assets con hash del build (/assets/*): cache-first.
 *   - Recursos ya visitados (mismo origen y medios de terceros): stale-while-revalidate.
 *   - Supabase (*.supabase.co): sin caché HTTP (el respaldo de datos es localStorage).
 *
 * Nota de match: se usa `ignoreVary: true` porque las respuestas de los assets
 * llevan `Vary: Origin` (Vite marca script y stylesheet con `crossorigin`) y la
 * petición del navegador incluye la cabecera `Origin` mientras que la entrada
 * guardada desde una URL puede no incluirla: sin ignorar Vary, el match falla
 * offline y la app quedaría en negro.
 *
 * JS plano sin dependencias: no pasa por Vite y se sirve tal cual desde /sw.js.
 * La caché se versiona con PREFIJO_CACHE para poder eliminar versiones antiguas
 * en `activate`; se incrementa CACHE_VERSION solo si cambia la estrategia.
 */
'use strict';

const CACHE_VERSION = 'museoqr-v1';
const PREFIJO_CACHE = 'museoqr-';
const SHELL_URL = '/index.html';

/** Destinos de terceros cuyos recursos ya visitados se guardan en caché. */
const DESTINOS_MEDIO = new Set(['image', 'audio', 'font']);

/** Opciones de match: ver nota de `Vary` al inicio del archivo. */
const OPCIONES_MATCH = { ignoreVary: true };

/** Textos de la página de respaldo «Sin conexión» (RF-01: ES/EN/FR/DE). */
const TEXTOS_RESPALDO = {
  es: {
    titulo: 'Sin conexión',
    texto:
      'La aplicación no está disponible sin conexión en este momento. ' +
      'Comprueba tu conexión a internet y vuelve a intentarlo.',
    boton: 'Reintentar',
  },
  en: {
    titulo: 'Offline',
    texto:
      'The application is not available offline right now. ' +
      'Check your internet connection and try again.',
    boton: 'Try again',
  },
  fr: {
    titulo: 'Hors ligne',
    texto:
      'L’application n’est pas disponible hors ligne pour le moment. ' +
      'Vérifiez votre connexion internet et réessayez.',
    boton: 'Réessayer',
  },
  de: {
    titulo: 'Offline',
    texto:
      'Die Anwendung ist derzeit nicht offline verfügbar. ' +
      'Prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
    boton: 'Erneut versuchen',
  },
};

/* ============================================================
   Instalación y activación
   ============================================================ */

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      // Precaché del shell completo; si falla, no se activa esta versión
      await actualizarShell();
      // RF-15: la versión nueva toma el control sin recargar la página
      // (nunca se fuerza `location.reload()`: sesiones y rutas intactas).
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const claves = await caches.keys();
      await Promise.all(
        claves
          .filter((clave) => clave.startsWith(PREFIJO_CACHE) && clave !== CACHE_VERSION)
          .map((clave) => caches.delete(clave))
      );
      await self.clients.claim();
    })()
  );
});

/* ============================================================
   App shell: precaché atómico (HTML + todos sus assets)
   ============================================================ */

/** Descarga el index.html y actualiza el shell de forma atómica. */
async function actualizarShell() {
  const respuesta = await fetch(SHELL_URL, { cache: 'reload' });
  if (!respuesta.ok) {
    throw new Error(`No se pudo leer ${SHELL_URL} (${respuesta.status}).`);
  }
  await actualizarShellDesde(await respuesta.text());
}

/**
 * Actualiza el shell a partir del HTML ya obtenido:
 * 1) descarga solo los assets que falten en caché (los con hash son inmutables,
 *    así que un acierto de caché/HTTP siempre es el contenido correcto);
 * 2) si TODO responde OK, guarda primero los assets nuevos, después el HTML
 *    (punto de conmutación) y al final poda los assets huérfanos de builds
 *    anteriores — la caché nunca queda con un HTML que referencie bundles
 *    inexistentes;
 * 3) si algo falla, se conserva íntegra la versión anterior.
 */
async function actualizarShellDesde(html) {
  const cache = await caches.open(CACHE_VERSION);
  const assets = extraerAssets(html);

  const faltantes = [];
  for (const url of assets) {
    if (!(await cache.match(url, OPCIONES_MATCH))) faltantes.push(url);
  }
  const obtenidos = await Promise.all(
    faltantes.map(async (url) => ({ url, respuesta: await fetch(url) }))
  );
  if (obtenidos.some((par) => !par.respuesta.ok)) {
    throw new Error('Faltan assets del app shell; se conserva la versión anterior.');
  }

  for (const par of obtenidos) {
    await cache.put(par.url, par.respuesta);
  }
  await cache.put(
    SHELL_URL,
    new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  );
  await podarAssetsHuerfanos(cache, assets);
}

/** Extrae las rutas absolutas referenciadas por el HTML (src/href). */
function extraerAssets(html) {
  const urls = new Set();
  for (const coincidencia of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = coincidencia[1];
    if (url.startsWith('/') && !url.startsWith('//')) urls.add(url);
  }
  return [...urls];
}

/**
 * Elimina los assets de `/assets/` que ya no referencia ningún build actual.
 * Nunca toca favicon, iconos ni medios de terceros. Nota: si se introduce
 * code-splitting, los chunks lazy deberán precachearse o desactivarse esta poda.
 */
async function podarAssetsHuerfanos(cache, assetsActuales) {
  const conservar = new Set(
    assetsActuales.map((ruta) => new URL(ruta, self.location.origin).href)
  );
  const peticiones = await cache.keys();
  await Promise.all(
    peticiones.map(async (peticion) => {
      const url = new URL(peticion.url);
      if (url.origin !== self.location.origin || !url.pathname.startsWith('/assets/')) return;
      if (!conservar.has(url.href)) await cache.delete(peticion);
    })
  );
}

/* ============================================================
   Estrategias de fetch
   ============================================================ */

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // RF-15: los datos de Supabase no se guardan en caché HTTP; sin conexión
  // la petición falla y los servicios caen al respaldo de localStorage.
  if (url.hostname.endsWith('.supabase.co')) return;

  if (request.mode === 'navigate') {
    // Actualiza el shell en segundo plano de forma síncrona al despachar:
    // el HTML en caché solo se sustituye cuando todos sus assets están listos.
    event.waitUntil(
      fetch(SHELL_URL, { cache: 'reload' })
        .then((respuesta) => (respuesta.ok ? respuesta.text() : null))
        .then((html) => (html ? actualizarShellDesde(html) : undefined))
        .catch(() => undefined)
    );
    event.respondWith(responderNavegacion(request));
    return;
  }

  // Assets con hash del build: cache-first (el hash garantiza la invalidación).
  if (url.origin === self.location.origin && url.pathname.startsWith('/assets/')) {
    event.respondWith(responderCachePrimero(request));
    return;
  }

  // Recursos ya visitados: stale-while-revalidate (solo si son aptos para cachear).
  if (puedeGuardarse(request, url)) {
    event.respondWith(responderStaleWhileRevalidate(event));
  }
  // El resto (p. ej. video de terceros) pasa a la red sin interceptar.
});

/** Navegaciones / rutas: network-first con respaldo limpio (nunca en negro). */
async function responderNavegacion(request) {
  try {
    const respuesta = await fetch(request);
    if (respuesta.ok) return respuesta;
    // Sin conexión (502 de proxy) o error del servidor: se prefiere el shell
    const cacheada = await caches.match(SHELL_URL, OPCIONES_MATCH);
    if (cacheada) return cacheada;
    if (esFalloDeRed(respuesta)) return paginaSinConexion();
    return respuesta;
  } catch {
    const cacheada = await caches.match(SHELL_URL, OPCIONES_MATCH);
    if (cacheada) return cacheada;
    return paginaSinConexion();
  }
}

/** Assets del build: cache-first; sin copia y sin red → error controlado. */
async function responderCachePrimero(request) {
  const cacheada = await caches.match(request, OPCIONES_MATCH);
  if (cacheada) return cacheada;
  try {
    const respuesta = await fetch(request);
    if (esFalloDeRed(respuesta)) return respuestaError();
    await guardar(request, respuesta);
    return respuesta;
  } catch {
    return respuestaError();
  }
}

/** Recursos ya visitados: sirve de caché si existe y actualiza en segundo plano. */
function responderStaleWhileRevalidate(event) {
  const { request } = event;
  const enCaché = caches.match(request, OPCIONES_MATCH);
  const deRed = fetch(request).then(async (respuesta) => {
    if (esFalloDeRed(respuesta)) throw new Error('Sin conexión.');
    await guardar(request, respuesta);
    return respuesta;
  });
  event.waitUntil(deRed.catch(() => undefined));
  return (async () => {
    const cacheada = await enCaché;
    if (cacheada) return cacheada;
    try {
      return await deRed;
    } catch {
      return respuestaError();
    }
  })();
}

/** ¿Se puede guardar este GET en caché (mismo origen o medio ya visitado)? */
function puedeGuardarse(request, url) {
  if (url.origin === self.location.origin) return true;
  return DESTINOS_MEDIO.has(request.destination);
}

/** ¿Es una respuesta de proxy sin conexión (502/503/504)? En local el proxy
 * devuelve 502 en lugar de rechazar la petición, así que sin tratarla como
 * fallo la app recibiría un error en vez de su caché (pantalla en negro). */
function esFalloDeRed(respuesta) {
  return respuesta.status === 502 || respuesta.status === 503 || respuesta.status === 504;
}

/** Guarda una respuesta apta; `206` y errores se descartan. Nunca lanza. */
async function guardar(request, respuesta) {
  if (!respuesta) return;
  if (respuesta.status === 206) return;
  if (!respuesta.ok && respuesta.type !== 'opaque') return;
  try {
    const cache = await caches.open(CACHE_VERSION);
    // `put` consume el cuerpo: se clona para poder devolver la respuesta intacta
    await cache.put(request, respuesta.clone());
  } catch {
    // Cuota llena o modo incógnito: se omite el respaldo sin romper la petición
  }
}

/** Respuesta de error controlada cuando no hay caché ni red. */
function respuestaError() {
  return new Response('Offline.', {
    status: 503,
    statusText: 'Offline',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

/**
 * Página estática de respaldo para cuando no hay nada en caché: línea gráfica
 * RF-06 (fondo blanco, tarjeta hairline, tipografía editorial) y textos en el
 * idioma del navegador. Sustituye a la pantalla en negro del navegador.
 */
function paginaSinConexion() {
  const idioma = (self.navigator.language || 'es').slice(0, 2).toLowerCase();
  const t = TEXTOS_RESPALDO[idioma] || TEXTOS_RESPALDO.es;
  const html = `<!doctype html>
<html lang="${idioma}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${t.titulo}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: #ffffff;
        color: #111111;
        font-family: Georgia, 'Times New Roman', serif;
      }
      main {
        width: 100%;
        max-width: 420px;
        padding: 40px 32px;
        border: 1px solid #ececec;
        border-radius: 6px;
        text-align: center;
      }
      h1 {
        margin: 0 0 16px;
        font-size: clamp(1.5rem, 6vw, 1.9rem);
        font-weight: 400;
        letter-spacing: -0.015em;
      }
      p {
        margin: 0 0 28px;
        color: #6b7280;
        font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
        font-size: 0.95rem;
        line-height: 1.8;
      }
      button {
        min-height: 40px;
        padding: 8px 20px;
        border: 1px solid #111111;
        border-radius: 4px;
        background: transparent;
        color: #111111;
        font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
        font-size: 0.72rem;
        font-weight: 500;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        cursor: pointer;
        transition: background-color 150ms ease, color 150ms ease;
      }
      button:hover { background: #111111; color: #ffffff; }
      button:focus-visible { outline: 2px solid #111111; outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) { button { transition: none; } }
    </style>
  </head>
  <body>
    <main role="status">
      <h1>${t.titulo}</h1>
      <p>${t.texto}</p>
      <button type="button" onclick="location.reload()">${t.boton}</button>
    </main>
  </body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
