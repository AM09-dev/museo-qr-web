# Memoria de Proyecto: Museo QR Web

## 1. Estado Técnico Actual
- **Aplicación:** PWA Web Móvil para visitantes de museo (5 salas) mediante códigos QR físicos.
- **Stack:** Vite + React (TypeScript) + CSS puro con design tokens + `lucide-react` + `qrcode.react`.
- **Estructura clave:** `src/App.tsx` (estado y vistas), `src/components/QRGenerator.tsx`, `src/data/museumData.ts`, `src/types.ts`, `src/index.css`.
- **Calidad:** `npm run build` (`tsc -b && vite build`) y `npm run lint` (oxlint) en verde.
- **Estándares:** SDD (todo cambio se especifica primero en `SPEC.md`), tipado estricto, estado local con `useState` y detección de URL con `URLSearchParams`.

## 2. Módulos Terminados
- **Funcionales (M01–M05):** selector multilingüe (ES/EN/FR/DE); listado y detalle de las 5 salas; reproductor de audioguía por sala; apertura directa de sala por `?sala=id`; panel generador de QR con impresión.
- **Línea gráfica (M06–M08):** capa de estilos con tokens, transiciones y accesibilidad, evolucionada hasta la línea **gráfica vigente (RF-06: minimalista puro tipo galería)** — fondos blancos, bordes hairline, tipografía editorial y controles discretos — aplicada en `App.tsx`, `QRGenerator.tsx` e `index.css`.
- **Datos (M09 / RF-07):** las **5 salas cuentan con datos multimedia y narrativos de prueba integrados** en `museumData.ts`: descripciones completas y atractivas en los 4 idiomas (ES/EN/FR/DE), `imageUrl` de cabecera y `audioUrl` + `videoUrl` funcionales verificados (imágenes de Lorem Picsum; MP3 de SoundHelix; MP4 de W3C, MDN y Test-Videos).
- **Detalle con imagen (M10 / RF-02 actualizado):** la vista de detalle muestra ahora **la imagen de la sala arriba y el texto descriptivo debajo** (imagen 16:9 con borde hairline y tono editorial), seguida de la audioguía. El **recorrido panorámico 360° queda diferido al backlog** (SPEC §5), conservando los `videoUrl` para reactivarlo sin migraciones.

## 3. Próximos Pasos / Backlog Pendiente
- [ ] **RF-03:** Integración de pasarela de pagos o donaciones por código QR (taquilla).
- [ ] **Recorrido panorámico 360°** (diferido de RF-02): reactivar la sección de video en la vista de detalle con los `videoUrl` ya integrados en `museumData.ts`.
