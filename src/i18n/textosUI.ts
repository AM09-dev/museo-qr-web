import type { Language } from '../types';

/**
 * RF-01: textos fijos de la interfaz pública.
 * Cada clave debe existir en los 4 idiomas: `Record<Language, TextosUI>`
 * hace fallar el build si falta alguna traducción.
 */
export interface TextosUI {
  /** Documento: `document.title` y título de la cabecera */
  tituloApp: string;

  // — CabeceraApp —
  verQr: string;
  verQrAccesible: string;
  seleccionarIdioma: string;

  // — MenuSalas —
  etiquetaMenu: string;

  // — DetalleSala —
  volverMenu: string;
  audioguia: string;

  // — VistaCarga —
  cargandoSalas: string;

  // — SalaNoEncontrada (RF-09) —
  salaNoEncontradaTitulo: string;
  salaNoEncontradaTexto: string;

  // — GeneradorQR (RF-05) —
  volverApp: string;
  imprimirQr: string;
  qrTitulo: string;
  qrIntro: string;
  qrVacioTitulo: string;
  qrVacioTexto: string;
}

export const textosUI: Record<Language, TextosUI> = {
  es: {
    tituloApp: 'Museo Interactivo',
    verQr: 'Ver QR',
    verQrAccesible: 'Ver códigos QR',
    seleccionarIdioma: 'Seleccionar idioma',
    etiquetaMenu: 'Simulador de escaneo de QR por sala:',
    volverMenu: 'Volver al menú de salas',
    audioguia: 'Audioguía',
    cargandoSalas: 'Cargando salas…',
    salaNoEncontradaTitulo: 'Sala no encontrada',
    salaNoEncontradaTexto:
      'El código QR escaneado apunta a una sala que no existe o no está disponible. ' +
      'Consulta al personal del museo o vuelve a escanear otro código.',
    volverApp: 'Volver a la App',
    imprimirQr: 'Imprimir QR',
    qrTitulo: 'Códigos QR de las Salas',
    qrIntro: 'Imprime o escanea estos códigos para probar el acceso directo a cada sala.',
    qrVacioTitulo: 'No hay salas disponibles',
    qrVacioTexto:
      'No se pudieron cargar salas para generar códigos QR. ' +
      'Comprueba la conexión e inténtalo de nuevo más tarde.',
  },
  en: {
    tituloApp: 'Interactive Museum',
    verQr: 'View QR',
    verQrAccesible: 'View QR codes',
    seleccionarIdioma: 'Select language',
    etiquetaMenu: 'QR scan simulator by room:',
    volverMenu: 'Back to the rooms menu',
    audioguia: 'Audio guide',
    cargandoSalas: 'Loading rooms…',
    salaNoEncontradaTitulo: 'Room not found',
    salaNoEncontradaTexto:
      'The scanned QR code points to a room that does not exist or is not available. ' +
      'Please ask the museum staff or scan another code.',
    volverApp: 'Back to the app',
    imprimirQr: 'Print QR codes',
    qrTitulo: 'Room QR Codes',
    qrIntro: 'Print or scan these codes to test direct access to each room.',
    qrVacioTitulo: 'No rooms available',
    qrVacioTexto:
      'Rooms could not be loaded to generate QR codes. ' +
      'Check your connection and try again later.',
  },
  fr: {
    tituloApp: 'Musée interactif',
    verQr: 'Voir QR',
    verQrAccesible: 'Voir les codes QR',
    seleccionarIdioma: 'Choisir la langue',
    etiquetaMenu: 'Simulateur de scan QR par salle :',
    volverMenu: 'Retour au menu des salles',
    audioguia: 'Audioguide',
    cargandoSalas: 'Chargement des salles…',
    salaNoEncontradaTitulo: 'Salle introuvable',
    salaNoEncontradaTexto:
      'Le code QR scanné renvoie à une salle qui n’existe pas ou n’est pas disponible. ' +
      'Adressez-vous au personnel du musée ou scannez un autre code.',
    volverApp: 'Retour à l’application',
    imprimirQr: 'Imprimer les QR',
    qrTitulo: 'Codes QR des salles',
    qrIntro: 'Imprimez ou scannez ces codes pour tester l’accès direct à chaque salle.',
    qrVacioTitulo: 'Aucune salle disponible',
    qrVacioTexto:
      'Impossible de charger les salles pour générer les codes QR. ' +
      'Vérifiez la connexion et réessayez plus tard.',
  },
  de: {
    tituloApp: 'Interaktives Museum',
    verQr: 'QR anzeigen',
    verQrAccesible: 'QR-Codes anzeigen',
    seleccionarIdioma: 'Sprache wählen',
    etiquetaMenu: 'QR-Scan-Simulator nach Raum:',
    volverMenu: 'Zurück zum Raummenü',
    audioguia: 'Audioguide',
    cargandoSalas: 'Räume werden geladen…',
    salaNoEncontradaTitulo: 'Raum nicht gefunden',
    salaNoEncontradaTexto:
      'Der gescannte QR-Code verweist auf einen Raum, der nicht existiert oder nicht verfügbar ist. ' +
      'Wenden Sie sich an das Museumspersonal oder scannen Sie einen anderen Code.',
    volverApp: 'Zurück zur App',
    imprimirQr: 'QR-Codes drucken',
    qrTitulo: 'QR-Codes der Räume',
    qrIntro: 'Drucken oder scannen Sie diese Codes, um den Direktzugang zu jedem Raum zu testen.',
    qrVacioTitulo: 'Keine Räume verfügbar',
    qrVacioTexto:
      'Die Räume konnten nicht geladen werden, um QR-Codes zu erzeugen. ' +
      'Prüfen Sie die Verbindung und versuchen Sie es später erneut.',
  },
};
