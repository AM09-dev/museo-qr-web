# Especificación Funcional: Museo QR Web (SDD)

## 1. Visión General
Aplicación Web Móvil (PWA) desarrollada con Vite, React y TypeScript para visitantes de un museo de 5 salas, con acceso mediante códigos QR físicos y contenido multilingüe.

## 2. Requerimientos Funcionales (RF) Vigentes
- **RF-01: Multilingüismo Global** — 4 idiomas (ES, EN, FR, DE) con cambio dinámico e inmediato en todas las vistas.
- **RF-02: Vista de Detalle Multimedia por Sala** *(Actualizado)*
  - Composición: **imagen de la sala arriba y texto descriptivo debajo**, en el idioma activo.
  - Reproductor de audioguía integrado bajo la descripción.
  - ~~Visor de video panorámico / recorrido 360°~~ → **diferido al backlog** (ver §5); los datos `videoUrl` se conservan para reactivarlo sin migraciones.
- **RF-03: Cobros y Donaciones por QR** *(Pendiente — próxima iteración)* — Códigos QR alternativos para taquilla y aportaciones directas.
- **RF-04: Carga Dinámica por Escaneo QR** — Detecta `?sala=id` en la URL y abre directamente esa sala; el botón «Volver al menú» limpia el parámetro y solo está visible en modo interno (ver RF-09).
- **RF-05: Generación y Exportación de Códigos QR por Sala** *(Actualizado — dinámico)*
  - Panel que genera e imprime los QR de las salas cargadas (`?sala=<id>`), **100% dinámico**: `GeneradorQR` recibe la lista `rooms: Room[]` (y el idioma activo `language`) como props desde `App.tsx`, obtenida vía `roomsService.ts`.
  - Sin importación de datos estáticos: ids, números y títulos impresos coinciden exactamente con la base de datos en la nube (con fallback local automático).
  - Si `rooms` está vacío, muestra un estado informativo limpio sin generar códigos.
- **RF-06: Línea Gráfica y UX** *(Vigente: minimalista puro, estilo galería de arte moderna)*
  - Fondos blancos / gris ultra claro; tarjetas con bordes hairline finos, sin sombras pesadas y radios mínimos.
  - Tipografía editorial y jerarquizada: títulos ligeros con `clamp()`, etiquetas en versalitas espaciadas, interlineado y márgenes amplios.
  - Controles discretos: botones de texto o borde fino con inversión monocroma al hover; selector de idioma subrayado.
  - Estándares técnicos: design tokens en `src/index.css`, móvil-first (targets ≥40px, `safe-area-inset`), transiciones sutiles con entrada escalonada, `prefers-reduced-motion` y foco visible.
  - Impresión del panel QR sobre fondo claro para garantizar la legibilidad física.
  - Toda iteración visual debe conservar RF-01 → RF-05 intactos.
- **RF-07: Contenido de Prueba (Mock Data) de las 5 Salas** *(Completado)*
  - Descripciones completas, atractivas y detalladas en los 4 idiomas (ES, EN, FR, DE) para cada sala.
  - `imageUrl` pública y verificada en las 5 salas para la cabecera de la vista de detalle.
  - `audioUrl` (audioguía MP3) y `videoUrl` (video panorámico MP4, reservado para el recorrido 360° diferido) funcionales con URLs públicas de prueba en las 5 salas.
  - Proveedores de muestra verificados por HTTP: imágenes de Lorem Picsum; audio de SoundHelix; video de W3C (`media.w3.org`), MDN (`mdn.github.io`) y Test-Videos.
  - Datos tipados estrictamente como `Room[]` en `src/data/museumData.ts` (hoy actúan como fallback, ver RF-08).
- **RF-08: Integración con Supabase (Datos Dinámicos)** *(Nuevo)*
  - Conexión a Supabase mediante variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (archivos `.env` / plantilla `.env.example`).
  - Cliente de Supabase en `src/lib/supabase.ts` inicializado con `import.meta.env`; exporta `supabase` y `isSupabaseConfigured` (`null` si faltan credenciales).
  - Servicio `src/services/roomsService.ts` con `fetchRooms()`: consulta la tabla `rooms` ordenada por `number` ascendente y mapea los campos snake_case (`image_url`, `audio_url`, `video_url`) a la interfaz `Room` (`imageUrl`, `audioUrl`, `videoUrl`).
  - **Fallback obligatorio:** ante ausencia de credenciales, error de red o error de la consulta, se usan los datos estáticos de `museumData.ts` para que la PWA nunca quede vacía.
  - `App.tsx` carga las salas de forma asíncrona con **estado de carga minimalista** y conserva la lectura de `?sala=` en la URL (RF-04).
  - Contrato de tabla `rooms`: `id`, `number`, `name` (jsonb ES/EN/FR/DE), `description` (jsonb ES/EN/FR/DE), `image_url`, `audio_url`, `video_url`.
  - **`GeneradorQR` es 100% dinámico (RF-05):** recibe `rooms: Room[]` desde `App.tsx` (misma instancia cargada con `fetchRooms()`), eliminando el import directo de `museumData.ts` y garantizando coherencia total entre menú, detalle y códigos impresos.
- **RF-09: Modo Exclusivo por Escaneo QR (Modo Kiosco / Exhibición Restringida)** *(Nuevo)*
  - Al abrir la URL con un parámetro **válido** `?sala=<id>` que coincida con una sala cargada, la aplicación entra en **modo visitante restringido**:
    - Se oculta el botón «Volver al menú de salas» (sin navegación hacia el menú general).
    - Se oculta el botón «Ver QR» del encabezado.
    - Se **bloquea el renderizado** de `GeneradorQR` aunque se intente abrir.
    - Únicamente se permite consumir la sala asignada (imagen, descripción, audioguía) y cambiar el idioma.
  - Si `?sala=` contiene un **ID inexistente**: pantalla clara de «Sala no encontrada» sin exponer el menú de salas ni el generador QR.
  - Si la URL **no contiene** `?sala=` (acceso raíz `/`): se conserva el comportamiento normal — menú de salas, navegación interna y acceso a «Ver QR» — para uso interno/curaduría.
  - Los QR del panel RF-05 codifican exactamente `${window.location.origin}/?sala=${room.id}` para que el escaneo active este modo, usando la lista dinámica de salas de la base de datos.
  - **Contenido de cada tarjeta** *(Actualizado — estética)*: las tarjetas del generador muestran **únicamente el título de la sala y el código QR gráfico**; la URL se **omite en texto plano** para mantener una estética visual minimalista y limpia (RF-06). Los márgenes y espaciados de la tarjeta se reajustan para conservar el equilibrio vertical sin el texto inferior.
- **RF-10: Panel de Administración protegido con Supabase Auth** *(Nuevo)*
  - Acceso por la ruta `/admin` o el parámetro `?view=admin` (estado de ruta simple en `App.tsx`).
  - **Verificación de sesión** con `supabase.auth.getSession()` antes de renderizar:
    - Sin sesión → `<AccesoAdmin />`: formulario de correo y contraseña con `supabase.auth.signInWithPassword()`.
    - Con sesión → `<PanelAdmin />`: listado de salas con edición dinámica de textos multilingües (ES/EN/FR/DE) y multimedia (`image_url`, `audio_url`), y botón «Cerrar sesión» con `supabase.auth.signOut()`.
  - Servicio `src/services/adminService.ts`: operaciones de escritura sobre la tabla `rooms` (actualizar campos JSONB `name`/`description`, títulos, imágenes y audios; crear/eliminar opcionales) **validando siempre la sesión activa** antes de escribir.
  - Componentes en `src/components/admin/` (`AccesoAdmin.tsx`, `PanelAdmin.tsx`) con la línea gráfica vigente RF-06.
  - Login: la tarjeta muestra el icono de acceso (candado) y la etiqueta **«Acceso de administradores»** centrada, sin título de página propio.
  - Si Supabase no está configurado, el panel informa del requisito en lugar de fallar.
  - Requiere en Supabase: usuario administrador en **Auth** y políticas RLS de escritura solo para roles autenticados.
  - Terminología unificada: «administrador» en toda la interfaz, comentarios y mensajes (antes «curador»).
- **RF-11: Integración con Supabase Storage (Carga y Gestión de Archivos Multimedia)** *(Nuevo)*
  - **Alcance:** carga de **imágenes** y **audioguías MP3** desde el panel de administración (RF-10) hacia el bucket de Supabase Storage.
  - **Bucket:** `museum-media` con dos carpetas internas: `images/` (imágenes) y `audios/` (audioguías).
  - Servicio en `src/services/adminService.ts`:
    - Función auxiliar `uploadMuseumMedia(file: File, folder: 'images' | 'audios'): Promise<string>` que sube el archivo con `supabase.storage.from('museum-media').upload(...)` y devuelve la **URL pública** mediante `getPublicUrl`.
    - **Validación de sesión activa** (`requireSession()`) antes de subir, igual que el resto de mutaciones del RF-10.
    - **Validación de formato permitido:**
      - Imágenes (`images/`): `jpg`, `jpeg`, `png`, `webp`.
      - Audios (`audios/`): `mp3`, `wav`, `m4a`.
    - Ruta de subida única por archivo (nombre aleatorio + extensión) para evitar colisiones y sobrescrituras accidentales.
    - Errores devueltos como mensajes claros en español (sin sesión, formato no permitido, error de red o del bucket).
  - **Panel de administración (`PanelAdmin.tsx`):**
    - Los campos de URL manuales de imagen y audioguía **se sustituyen por selectores de archivo** (`<input type="file" />`) en el formulario de edición de cada sala.
    - Al elegir un archivo se **sube automáticamente** a Supabase Storage, mostrando un indicador visual de carga («Subiendo archivo…») y deshabilitando el envío mientras dure la subida.
    - Al completarse la subida, el **campo interno de URL correspondiente se actualiza** con el enlace público obtenido (sin inputs de URL visibles) y el administrador **guarda los cambios de la sala** en la tabla `rooms` con el flujo `updateRoom` existente (RF-10).
    - Si la subida falla, se muestra un mensaje de error sin perder los datos ya cargados en el borrador.
  - **Requisitos en Supabase:** bucket `museum-media` creado (público o con política de lectura) y políticas RLS de **escritura** (`INSERT` en storage) solo para usuarios autenticados.
- **RF-12: Arquitectura Modular de Vistas (Separación de Responsabilidades)** *(Nuevo — no funcional)*
  - **Objetivo:** evitar que `src/App.tsx` crezca de forma monolítica, manteniéndolo únicamente con la **inicialización**, el **estado global** (salas, idioma, sala seleccionada, panel QR, scroll), la **verificación de Supabase Auth** y el **enrutamiento condicional**.
  - **Componentes extraídos a `src/components/`:**
    - **Nomenclatura en español** *(Actualizado)*: los nombres de archivo e identificadores de todos los componentes se expresan en español.
    - `CabeceraApp.tsx` (antes `AppHeader`): cabecera con título, botón «Ver QR» (oculto en Modo Kiosco, RF-09) y selector de idioma (RF-01), con la sombra de scroll (RF-06).
    - `MenuSalas.tsx` (antes `RoomMenu`): vista pública del menú de salas (listado con índice, título e icono QR).
    - `DetalleSala.tsx` (antes `RoomDetail`): vista de detalle multimedia por sala (imagen, descripción y audioguía, RF-02) con botón «Volver al menú» condicionado al modo kiosco (RF-09).
    - `SalaNoEncontrada.tsx` (antes `RoomNotFound`): pantalla «Sala no encontrada» para `?sala=` inexistente (RF-09).
    - `VistaCarga.tsx` (antes `LoadingView`): estado de carga minimalista reutilizable (salas y verificación de sesión).
    - `GeneradorQR.tsx` (antes `QRGenerator`), `admin/AccesoAdmin.tsx` (antes `AdminLogin`) y `admin/PanelAdmin.tsx` (antes `AdminDashboard`) también renombrados al español.
  - **Enrutamiento auxiliar** en `src/lib/routing.ts`: funciones puras `isAdminRoute()` (ruta `/admin` o `?view=admin`, RF-10) y `getRoomParam()` (lectura de `?sala=`, RF-04/RF-09), fuera de los componentes.
  - **Orden de prioridad del enrutamiento** (sin cambios funcionales): admin (RF-10) → generador QR (RF-05, bloqueado en modo kiosco) → carga / sala no encontrada / detalle / menú.
  - **Comportamiento idéntico al previo:** RF-01 → RF-11 intactos; solo cambia la organización del código.
  - **Limpieza estética de los QR (RF-05, confirmada):** `GeneradorQR.tsx` no renderiza **ningún texto de URL** bajo los códigos — únicamente el título de la sala y el QR gráfico (ver RF-09 «Contenido de cada tarjeta»).

## 3. Contratos de Datos y Tipado (`types.ts`)
- Modelo `Room` multilingüe: nombres y descripciones como `Record<Language, string>`, con URLs opcionales `imageUrl`, `audioUrl` y `videoUrl`.
- En Supabase las URLs viajan en snake_case (`image_url`, `audio_url`, `video_url`); el mapeo a camelCase vive en `src/services/roomsService.ts`.

## 4. Convenciones de Código
- Componentes React limpios y modulares; tipado estricto con `import type`.
- Separación de responsabilidades por vista (RF-12): `App.tsx` solo orquesta estado global y enrutamiento; el renderizado de cada vista vive en componentes independientes de `src/components/`.
- Metodología SDD: primero `SPEC.md`, luego el código y, al finalizar, `MEMORIA.md`.

## 5. Backlog / Diferidos
- **RF-03:** Cobros y donaciones por QR (taquilla).
- **Recorrido panorámico 360°** (diferido de RF-02): reactivar la sección de video en la vista de detalle usando los `videoUrl` ya integrados en `museumData.ts`.
