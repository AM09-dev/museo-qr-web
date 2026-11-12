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
- **RF-04: Carga Dinámica por Escaneo QR** — Detecta `?sala=id` en la URL y abre directamente esa sala; «Volver al menú» limpia el parámetro.
- **RF-05: Generación y Exportación de Códigos QR por Sala** — Panel que genera e imprime los QR de las 5 salas (`?sala=sala-1` … `?sala=sala-5`).
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
  - Datos tipados estrictamente como `Room[]` en `src/data/museumData.ts`.

## 3. Contratos de Datos y Tipado (`types.ts`)
- Modelo `Room` multilingüe: nombres y descripciones como `Record<Language, string>`, con URLs opcionales `audioUrl` y `videoUrl`.

## 4. Convenciones de Código
- Componentes React limpios y modulares; tipado estricto con `import type`.
- Metodología SDD: primero `SPEC.md`, luego el código y, al finalizar, `MEMORIA.md`.

## 5. Backlog / Diferidos
- **RF-03:** Cobros y donaciones por QR (taquilla).
- **Recorrido panorámico 360°** (diferido de RF-02): reactivar la sección de video en la vista de detalle usando los `videoUrl` ya integrados en `museumData.ts`.
