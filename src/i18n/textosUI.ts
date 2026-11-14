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
  /** RF-13: título de la sección de piezas */
  enEstaSala: string;

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

  // — CabeceraApp: acceso a la taquilla (RF-14) —
  taquillaBoton: string;
  taquillaBotonAccesible: string;

  // — TicketPaymentView (RF-14) —
  taquillaTitulo: string;
  taquillaIntro: string;
  precioEntrada: string;
  /** Indicación obligatoria previa al ingreso */
  avisoPago: string;
  pagarEnLinea: string;
  qrPagoTitulo: string;
  /** Nota del QR cuando hay `payment_link` */
  qrPagoNota: string;
  /** Nota del QR de la propia vista (impresión en la entrada) */
  qrTaquillaNota: string;
  transferenciaTitulo: string;
  campoClabe: string;
  campoBeneficiario: string;
  campoMonto: string;
  copiarClabe: string;
  copiarMonto: string;
  copiado: string;
  cargandoTaquilla: string;
  taquillaSinDatos: string;
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
    enEstaSala: 'En esta sala',
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
    taquillaBoton: 'Taquilla',
    taquillaBotonAccesible: 'Taquilla / Entradas',
    taquillaTitulo: 'Taquilla y entradas',
    taquillaIntro:
      'Información de pago vigente para ingresar al museo. El acceso a las salas de la guía es libre.',
    precioEntrada: 'Precio de entrada',
    avisoPago:
      'Realiza tu pago y muestra tu comprobante en recepción para ingresar al museo',
    pagarEnLinea: 'Pagar en línea',
    qrPagoTitulo: 'Código QR de pago',
    qrPagoNota: 'Escanea el código para abrir el enlace de pago.',
    qrTaquillaNota:
      'Impreso en la entrada: escanea el código para ver la información de pago.',
    transferenciaTitulo: 'Transferencia SPEI',
    campoClabe: 'CLABE interbancaria',
    campoBeneficiario: 'Beneficiario',
    campoMonto: 'Monto exacto',
    copiarClabe: 'Copiar CLABE',
    copiarMonto: 'Copiar monto exacto',
    copiado: 'Copiado',
    cargandoTaquilla: 'Cargando información de taquilla…',
    taquillaSinDatos: 'La taquilla aún no tiene datos de pago configurados.',
  },
  en: {
    tituloApp: 'Interactive Museum',
    verQr: 'View QR',
    verQrAccesible: 'View QR codes',
    seleccionarIdioma: 'Select language',
    etiquetaMenu: 'QR scan simulator by room:',
    volverMenu: 'Back to the rooms menu',
    audioguia: 'Audio guide',
    enEstaSala: 'In this room',
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
    taquillaBoton: 'Tickets',
    taquillaBotonAccesible: 'Box office / Tickets',
    taquillaTitulo: 'Box office and tickets',
    taquillaIntro:
      'Current payment information to enter the museum. Access to the guide rooms is free.',
    precioEntrada: 'Admission price',
    avisoPago:
      'Complete your payment and show your receipt at reception to enter the museum',
    pagarEnLinea: 'Pay online',
    qrPagoTitulo: 'Payment QR code',
    qrPagoNota: 'Scan the code to open the payment link.',
    qrTaquillaNota:
      'Printed at the entrance: scan the code to view the payment information.',
    transferenciaTitulo: 'SPEI transfer',
    campoClabe: 'Interbank CLABE',
    campoBeneficiario: 'Beneficiary',
    campoMonto: 'Exact amount',
    copiarClabe: 'Copy CLABE',
    copiarMonto: 'Copy exact amount',
    copiado: 'Copied',
    cargandoTaquilla: 'Loading box office information…',
    taquillaSinDatos: 'The box office has no payment data configured yet.',
  },
  fr: {
    tituloApp: 'Musée interactif',
    verQr: 'Voir QR',
    verQrAccesible: 'Voir les codes QR',
    seleccionarIdioma: 'Choisir la langue',
    etiquetaMenu: 'Simulateur de scan QR par salle :',
    volverMenu: 'Retour au menu des salles',
    audioguia: 'Audioguide',
    enEstaSala: 'Dans cette salle',
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
    taquillaBoton: 'Billetterie',
    taquillaBotonAccesible: 'Billetterie / Entrées',
    taquillaTitulo: 'Billetterie et entrées',
    taquillaIntro:
      'Informations de paiement en vigueur pour entrer au musée. L’accès aux salles du guide est libre.',
    precioEntrada: 'Prix d’entrée',
    avisoPago:
      'Effectuez votre paiement et présentez votre reçu à l’accueil pour entrer au musée',
    pagarEnLinea: 'Payer en ligne',
    qrPagoTitulo: 'Code QR de paiement',
    qrPagoNota: 'Scannez le code pour ouvrir le lien de paiement.',
    qrTaquillaNota:
      'Imprimé à l’entrée : scannez le code pour voir les informations de paiement.',
    transferenciaTitulo: 'Virement SPEI',
    campoClabe: 'CLABE interbancaire',
    campoBeneficiario: 'Bénéficiaire',
    campoMonto: 'Montant exact',
    copiarClabe: 'Copier la CLABE',
    copiarMonto: 'Copier le montant exact',
    copiado: 'Copié',
    cargandoTaquilla: 'Chargement des informations de billetterie…',
    taquillaSinDatos: 'La billetterie n’a pas encore de données de paiement configurées.',
  },
  de: {
    tituloApp: 'Interaktives Museum',
    verQr: 'QR anzeigen',
    verQrAccesible: 'QR-Codes anzeigen',
    seleccionarIdioma: 'Sprache wählen',
    etiquetaMenu: 'QR-Scan-Simulator nach Raum:',
    volverMenu: 'Zurück zum Raummenü',
    audioguia: 'Audioguide',
    enEstaSala: 'In diesem Raum',
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
    taquillaBoton: 'Kasse',
    taquillaBotonAccesible: 'Kasse / Tickets',
    taquillaTitulo: 'Kasse und Eintritt',
    taquillaIntro:
      'Aktuelle Zahlungsinformationen für den Museumsbesuch. Der Zugang zu den Räumen der Führung ist frei.',
    precioEntrada: 'Eintrittspreis',
    avisoPago:
      'Bezahlen Sie und zeigen Sie Ihre Zahlungsbestätigung an der Kasse, um das Museum zu betreten',
    pagarEnLinea: 'Online bezahlen',
    qrPagoTitulo: 'Zahlungs-QR-Code',
    qrPagoNota: 'Scannen Sie den Code, um den Zahlungslink zu öffnen.',
    qrTaquillaNota:
      'Am Eingang ausgedruckt: scannen Sie den Code, um die Zahlungsinformationen zu sehen.',
    transferenciaTitulo: 'SPEI-Überweisung',
    campoClabe: 'Interbanken-CLABE',
    campoBeneficiario: 'Empfänger',
    campoMonto: 'Genauer Betrag',
    copiarClabe: 'CLABE kopieren',
    copiarMonto: 'Betrag kopieren',
    copiado: 'Kopiert',
    cargandoTaquilla: 'Kasseninformationen werden geladen…',
    taquillaSinDatos: 'Für die Kasse sind noch keine Zahlungsdaten hinterlegt.',
  },
};

/**
 * RF-13: texto de contenido en el idioma activo, con respaldo en español
 * si la traducción está vacía.
 */
export function enIdioma(textos: Record<Language, string>, language: Language): string {
  return textos[language]?.trim() ? textos[language] : textos.es;
}
