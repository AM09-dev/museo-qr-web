import type { Exhibit, Room } from '../types';

/**
 * Datos de prueba (mock data) — RF-07.
 * Descripciones narrativas completas en 4 idiomas y multimedia
 * de muestra público y verificado (MP3 de audioguía + MP4 panorámico).
 */
const baseRooms: Room[] = [
  {
    id: "sala-1",
    number: 1,
    name: {
      es: "Sala 1: Orígenes e Historia",
      en: "Room 1: Origins and History",
      fr: "Salle 1 : Origines et Histoire",
      de: "Raum 1: Ursprünge und Geschichte"
    },
    description: {
      es: "Comienza el recorrido en el punto cero: aquí convergen mapas antiguos, crónicas ilustradas y vestigios arqueológicos que narran más de cinco siglos de historia. Recorre la fundación de la ciudad hito a hito, descubre los objetos de los primeros asentamientos de la región y comprende, a través de piezas originales y réplicas a escala, cómo se forjó la identidad que hoy habita estos muros.",
      en: "The journey begins at zero: ancient maps, illustrated chronicles and archaeological vestiges converge here to tell more than five centuries of history. Walk through the founding of the city milestone by milestone, discover the objects of the region's earliest settlements and understand, through original pieces and scale replicas, how the identity that now inhabits these walls was forged.",
      fr: "Le parcours commence au zéro : cartes anciennes, chroniques illustrées et vestiges archéologiques s'y entrecroisent pour conter plus de cinq siècles d'histoire. Parcourez étape par étape la fondation de la ville, découvrez les objets des premiers peuplements de la région et comprenez, à travers des pièces originales et des répliques à l'échelle, comment s'est forgée l'identité qui anime aujourd'hui ces murs.",
      de: "Die Führung beginnt am Nullpunkt: hier verbinden sich alte Karten, illustrierte Chroniken und archäologische Relikte, um mehr als fünf Jahrhunderte Geschichte zu erzählen. Wandern Sie Schritt für Schritt durch die Gründung der Stadt, entdecken Sie die Objekte der ersten Siedlungen der Region und verstehen Sie anhand von Originalstücken und Maßstabsrepliken, wie die Identität geprägt wurde, die heute in diesen Wänden lebt."
    },
    imageUrl: "https://picsum.photos/id/1015/800/450",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    videoUrl: "https://media.w3.org/2010/05/bunny/movie.mp4"
  },
  {
    id: "sala-2",
    number: 2,
    name: {
      es: "Sala 2: Arte Colonial",
      en: "Room 2: Colonial Art",
      fr: "Salle 2 : Art Colonial",
      de: "Raum 2: Kolonialkunst"
    },
    description: {
      es: "Adéntrate en el esplendor del arte virreinal: lienzos religiosos de enorme devoción, retablos dorados y talla en madera tallada por manos de oficio. Esta sala reúne la colección colonial más representativa del museo, donde la luz de cada ventana revela el detalle de los pigmentos originales y el diálogo entre las tradiciones europeas y las técnicas indígenas que dieron origen a un lenguaje artístico propio.",
      en: "Step into the splendor of viceregal art: deeply devotional canvases, gilded altarpieces and wood carvings shaped by master craftsmen. This room gathers the museum's most representative colonial collection, where the light of each window reveals the detail of original pigments and the dialogue between European traditions and indigenous techniques that gave rise to an artistic language of its own.",
      fr: "Entrez dans l'éclart de l'art vice-royal : toiles religieuses d'une grande dévotion, retables dorés et sculptures sur bois façonnées par des maîtres artisans. Cette salle réunit la collection coloniale la plus représentative du musée, où la lumière de chaque fenêtre révèle le détail des pigments d'origine et le dialogue entre traditions européennes et techniques indigènes qui fit naître un langage artistique propre.",
      de: "Treten Sie in die Pracht der Vizekunst: tief andächtige Leinwände, vergoldete Altäre und von Meisterhand geschnitztes Holz. Dieser Raum versammelt die repräsentativste koloniale Sammlung des Museums, in der das Licht jedes Fensters die Details der Originalpigmente und den Dialog zwischen europäischen Traditionen und indigenen Techniken offenbart, der eine eigene Kunstsprache hervorbrachte."
    },
    imageUrl: "https://picsum.photos/id/1041/800/450",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4"
  },
  {
    id: "sala-3",
    number: 3,
    name: {
      es: "Sala 3: Tradiciones y Costumbres",
      en: "Room 3: Traditions and Customs",
      fr: "Salle 3 : Traditions et Coutumes",
      de: "Raum 3: Traditionen und Bräuche"
    },
    description: {
      es: "Un paseo íntimo por la vida cotidiana: trajes tradicionales bordados a mano, utensilios de cocina, textiles y objetos ceremoniales que conservan la memoria de generaciones. A través de escenas ambientadas y testimonios de la vida diaria, esta sala invita a imaginar las fiestas, los oficios y los rituales que siguieron dando forma, año tras año, al alma de la comunidad.",
      en: "An intimate stroll through everyday life: hand-embroidered traditional garments, kitchen utensils, textiles and ceremonial objects that preserve the memory of generations. Through staged scenes and testimonies of daily life, this room invites you to imagine the festivities, crafts and rituals that kept shaping, year after year, the soul of the community.",
      fr: "Une promenade intime dans la vie quotidienne : costumes traditionnels brodés à la main, ustensiles de cuisine, textiles et objets cérémoniels qui conservent la mémoire des générations. À travers des mises en scène et des témoignages du quotidien, cette salle invite à imaginer les fêtes, les métiers et les rituels qui ont façonné, année après année, l'âme de la communauté.",
      de: "Ein intimer Spaziergang durch das Alltagsleben: handbestickte traditionelle Kleidung, Küchengeräte, Textilien und zeremonielle Gegenstände, die das Gedächtnis von Generationen bewahren. Durch inszenierte Szenen und Zeugnisse des täglichen Lebens lädt dieser Raum dazu ein, die Feste, Handwerkskünste und Rituale zu erahnen, die Jahr für Jahr die Seele der Gemeinschaft prägten."
    },
    imageUrl: "https://picsum.photos/id/1062/800/450",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    videoUrl: "https://mdn.github.io/shared-assets/videos/flower.mp4"
  },
  {
    id: "sala-4",
    number: 4,
    name: {
      es: "Sala 4: Arte Moderno y Regional",
      en: "Room 4: Modern and Regional Art",
      fr: "Salle 4 : Art Moderne et Régional",
      de: "Raum 4: Moderne und Regionale Kunst"
    },
    description: {
      es: "El presente cobra forma en lienzo: pintura, escultura y gráfica de artistas locales que retratan la identidad regional con ojos contemporáneos. Recorre las corrientes que definieron la modernidad de la región, descubre a los maestros que rompieron con la academia y acércate a las voces jóvenes que, hoy, siguen reinterpretando el paisaje y la memoria colectiva.",
      en: "The present takes shape on canvas: painting, sculpture and printmaking by local artists portraying regional identity through contemporary eyes. Walk through the currents that defined the region's modernity, discover the masters who broke with academic tradition and meet the young voices that, today, keep reinterpreting the landscape and collective memory.",
      fr: "Le présent prend forme sur la toile : peinture, sculpture et estampe d'artistes locaux qui représentent l'identité régionale avec un regard contemporain. Parcourez les courants qui définirent la modernité de la région, découvrez les maîtres qui rompirent avec l'académisme et rencontrez les voix jeunes qui, aujourd'hui, réinterprètent le paysage et la mémoire collective.",
      de: "Die Gegenwart gewinnt Gestalt auf der Leinwand: Malerei, Skulptur und Grafik lokaler Künstler, die die regionale Identität mit zeitgenössischen Augen darstellen. Wandern Sie durch die Strömungen, die die Moderne der Region prägten, entdecken Sie die Meister, die mit der Akademie brachen, und begegnen Sie jungen Stimmen, die heute Landschaft und kollektives Gedächtnis neu deuten."
    },
    imageUrl: "https://picsum.photos/id/1035/800/450",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    videoUrl: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4"
  },
  {
    id: "sala-5",
    number: 5,
    name: {
      es: "Sala 5: Exposiciones Temporales",
      en: "Room 5: Temporary Exhibitions",
      fr: "Salle 5 : Expositions Temporaires",
      de: "Raum 5: Sonderausstellungen"
    },
    description: {
      es: "El museo en movimiento: un espacio vivo y flexible diseñado para muestras itinerantes, colaboraciones y proyectos especiales que renuevan su propuesta cada temporada. Consulta la cartelera actual, sorpréndete con las instalaciones de artistas invitados y vuelve pronto, porque lo que hoy ocupa esta sala no será lo mismo mañana.",
      en: "The museum in motion: a living, flexible space designed for traveling exhibitions, collaborations and special projects that renew its offer every season. Check the current program, be surprised by installations from guest artists and come back soon, because what occupies this room today will not be the same tomorrow.",
      fr: "Le musée en mouvement : un espace vivant et flexible conçu pour les expositions itinérantes, les collaborations et les projets spéciaux qui renouvellent sa proposition chaque saison. Consultez l'affiche actuelle, laissez-vous surprendre par les installations des artistes invités et revenez bientôt, car ce qui occupe cette salle aujourd'hui ne sera plus le même demain.",
      de: "Das Museum in Bewegung: ein lebendiger, flexibler Raum für Wanderausstellungen, Kooperationen und Sonderprojekte, der sein Angebot jedes Saison erneuert. Schauen Sie ins aktuelle Programm, lassen Sie sich von Installationen eingeladener Künstler überraschen und kommen Sie bald wieder, denn was diesen Raum heute füllt, wird morgen nicht mehr dasselbe sein."
    },
    imageUrl: "https://picsum.photos/id/1069/800/450",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    videoUrl: "https://media.w3.org/2010/05/video/movie_300.mp4"
  }
];

/** Construye una pieza de ejemplo con su id, sala y posición (RF-13). */
function pieza(
  roomId: string,
  position: number,
  imageId: number,
  name: Exhibit['name'],
  description: Exhibit['description']
): Exhibit {
  return {
    id: `${roomId}-pieza-${position}`,
    roomId,
    position,
    name,
    description,
    imageUrl: `https://picsum.photos/id/${imageId}/600/450`,
  };
}

/**
 * RF-13: piezas de ejemplo por sala (fallback sin Supabase).
 * Textos en 4 idiomas e imagen pública de Lorem Picsum.
 */
const exhibitsData: Exhibit[] = [
  pieza('sala-1', 1, 1033, {
    es: 'Mapa de la fundación (1542)',
    en: 'Founding Map (1542)',
    fr: 'Carte de la fondation (1542)',
    de: 'Gründungskarte (1542)',
  }, {
    es: 'Plano manuscrito sobre papel de algodón que traza las primeras calles, la plaza mayor y el cauce original del río. Es el documento cartográfico más antiguo que conserva el museo.',
    en: 'A hand-drawn plan on cotton paper tracing the first streets, the main square and the original course of the river. It is the oldest cartographic document held by the museum.',
    fr: 'Plan manuscrit sur papier de coton qui trace les premières rues, la grand-place et le cours originel du fleuve. C’est le plus ancien document cartographique conservé par le musée.',
    de: 'Handgezeichneter Plan auf Baumwollpapier mit den ersten Straßen, dem Hauptplatz und dem ursprünglichen Flusslauf. Es ist das älteste kartografische Dokument des Museums.',
  }),
  pieza('sala-1', 2, 1050, {
    es: 'Vasija ceremonial prehispánica',
    en: 'Pre-Hispanic Ceremonial Vessel',
    fr: 'Vase cérémoniel préhispanique',
    de: 'Vorspanisches Zeremonialgefäß',
  }, {
    es: 'Pieza de barro bruñido con motivos geométricos, hallada en los primeros asentamientos del valle. Se usaba en ofrendas vinculadas al ciclo agrícola.',
    en: 'A burnished clay piece with geometric motifs, found in the valley’s earliest settlements. It was used in offerings linked to the farming cycle.',
    fr: 'Pièce en terre brunie à motifs géométriques, découverte dans les premiers peuplements de la vallée. Elle servait aux offrandes liées au cycle agricole.',
    de: 'Ein polierter Tonkrug mit geometrischen Mustern aus den ersten Siedlungen des Tals. Er diente für Opfergaben im landwirtschaftlichen Jahreskreis.',
  }),
  pieza('sala-2', 1, 1043, {
    es: 'Pintura «La Virgen del Rosario»',
    en: 'Painting “Our Lady of the Rosary”',
    fr: 'Peinture « La Vierge du Rosaire »',
    de: 'Gemälde „Die Rosenkranzmadonna“',
  }, {
    es: 'Óleo sobre tela del siglo XVII atribuido a un taller local. Destaca por el estofado dorado del manto y por los rostros indígenas de los donantes al pie del lienzo.',
    en: 'A 17th-century oil on canvas attributed to a local workshop. It stands out for the gilded mantle and the indigenous faces of the donors at the foot of the canvas.',
    fr: 'Huile sur toile du XVIIe siècle attribuée à un atelier local. Elle se distingue par le manteau doré et les visages indigènes des donateurs au pied de la toile.',
    de: 'Ölgemälde auf Leinwand aus dem 17. Jahrhundert, einer lokalen Werkstatt zugeschrieben. Bemerkenswert sind der vergoldete Mantel und die indigenen Gesichter der Stifter am unteren Bildrand.',
  }),
  pieza('sala-2', 2, 1060, {
    es: 'Jarro de talavera',
    en: 'Talavera Jug',
    fr: 'Pichet en talavera',
    de: 'Talavera-Krug',
  }, {
    es: 'Jarro de cerámica vidriada en azul cobalto sobre fondo blanco, con decoración de aves y follaje. Muestra la fusión de técnicas españolas y la mano de obra local.',
    en: 'A glazed ceramic jug in cobalt blue on a white ground, decorated with birds and foliage. It shows the blend of Spanish techniques and local craftsmanship.',
    fr: 'Pichet en céramique émaillée bleu de cobalt sur fond blanc, orné d’oiseaux et de feuillages. Il illustre la fusion des techniques espagnoles et du savoir-faire local.',
    de: 'Glasierter Keramikkrug in Kobaltblau auf weißem Grund mit Vögeln und Blattwerk. Er zeigt die Verbindung spanischer Techniken mit lokaler Handwerkskunst.',
  }),
  pieza('sala-3', 1, 1062, {
    es: 'Máscara de danza tradicional',
    en: 'Traditional Dance Mask',
    fr: 'Masque de danse traditionnelle',
    de: 'Traditionelle Tanzmaske',
  }, {
    es: 'Talla en madera de colorín policromada que se usa todavía en las fiestas patronales. Cada rasgo exagerado representa un personaje de la sátira popular.',
    en: 'A polychrome carving in colorín wood still worn at patron saint festivals. Each exaggerated feature represents a character from popular satire.',
    fr: 'Sculpture polychrome en bois de colorín, encore portée lors des fêtes patronales. Chaque trait exagéré représente un personnage de la satire populaire.',
    de: 'Bemalte Schnitzerei aus Colorín-Holz, die bis heute bei Patronatsfesten getragen wird. Jeder überzeichnete Zug stellt eine Figur der Volkssatire dar.',
  }),
  pieza('sala-3', 2, 1074, {
    es: 'Rebozo de seda tejido a mano',
    en: 'Hand-Woven Silk Rebozo',
    fr: 'Rebozo en soie tissé à la main',
    de: 'Handgewebter Seiden-Rebozo',
  }, {
    es: 'Prenda tejida en telar de cintura con un fleco anudado que llevó más de un año de trabajo. Su patrón jaspeado identifica la comunidad de origen.',
    en: 'A garment woven on a backstrap loom, with a knotted fringe that took over a year of work. Its ikat pattern identifies the community it comes from.',
    fr: 'Vêtement tissé sur métier à ceinture, avec une frange nouée qui a demandé plus d’un an de travail. Son motif chiné identifie la communauté d’origine.',
    de: 'Auf dem Rückengurtwebstuhl gewebtes Tuch mit geknüpften Fransen, an denen über ein Jahr gearbeitet wurde. Sein Ikat-Muster verrät die Herkunftsgemeinde.',
  }),
  pieza('sala-4', 1, 1018, {
    es: 'Paisaje del valle (óleo, 1938)',
    en: 'Valley Landscape (oil, 1938)',
    fr: 'Paysage de la vallée (huile, 1938)',
    de: 'Tallandschaft (Öl, 1938)',
  }, {
    es: 'Obra emblemática del paisajismo regional: el volcán y los campos de cultivo se resuelven en planos de color que anticipan la abstracción.',
    en: 'A landmark of regional landscape painting: the volcano and farmland are rendered in planes of color that anticipate abstraction.',
    fr: 'Œuvre emblématique du paysage régional : le volcan et les champs sont traités en aplats de couleur qui annoncent l’abstraction.',
    de: 'Ein Schlüsselwerk der regionalen Landschaftsmalerei: Vulkan und Felder lösen sich in Farbflächen auf, die die Abstraktion vorwegnehmen.',
  }),
  pieza('sala-4', 2, 1084, {
    es: 'Escultura «Raíces» (bronce)',
    en: 'Sculpture “Roots” (bronze)',
    fr: 'Sculpture « Racines » (bronze)',
    de: 'Skulptur „Wurzeln“ (Bronze)',
  }, {
    es: 'Bronce a la cera perdida en el que unas manos entrelazadas se transforman en raíces. Homenaje a las generaciones que trabajaron la tierra.',
    en: 'A lost-wax bronze in which intertwined hands turn into roots. A tribute to the generations who worked the land.',
    fr: 'Bronze à la cire perdue où des mains entrelacées se muent en racines. Un hommage aux générations qui ont travaillé la terre.',
    de: 'Ein Bronzeguss im Wachsausschmelzverfahren, in dem verschränkte Hände zu Wurzeln werden. Eine Hommage an die Generationen, die das Land bestellten.',
  }),
  pieza('sala-5', 1, 1036, {
    es: 'Instalación «Memoria de luz»',
    en: 'Installation “Memory of Light”',
    fr: 'Installation « Mémoire de lumière »',
    de: 'Installation „Erinnerung aus Licht“',
  }, {
    es: 'Proyecciones sobre papel de algodón que recrean las ventanas de casas ya desaparecidas del centro histórico. La luz cambia con el paso del visitante.',
    en: 'Projections on cotton paper recreating the windows of houses that have vanished from the historic center. The light shifts as visitors walk by.',
    fr: 'Projections sur papier de coton qui recréent les fenêtres de maisons disparues du centre historique. La lumière change au passage du visiteur.',
    de: 'Projektionen auf Baumwollpapier, die die Fenster verschwundener Häuser der Altstadt nachbilden. Das Licht verändert sich mit den Schritten der Besucher.',
  }),
  pieza('sala-5', 2, 1047, {
    es: 'Fotografía «Mercado al amanecer»',
    en: 'Photograph “Market at Dawn”',
    fr: 'Photographie « Marché à l’aube »',
    de: 'Fotografie „Markt im Morgengrauen“',
  }, {
    es: 'Serie en blanco y negro que documenta la apertura del mercado municipal antes de su remodelación. Forma parte de la exposición temporal de este año.',
    en: 'A black-and-white series documenting the opening of the municipal market before its renovation. Part of this year’s temporary exhibition.',
    fr: 'Série en noir et blanc qui documente l’ouverture du marché municipal avant sa rénovation. Elle fait partie de l’exposition temporaire de cette année.',
    de: 'Eine Schwarzweißserie über die Öffnung der Markthalle vor ihrem Umbau. Teil der diesjährigen Sonderausstellung.',
  }),
];

/** Datos locales de respaldo: salas con sus piezas (RF-07 / RF-13). */
export const roomsData: Room[] = baseRooms.map((room) => ({
  ...room,
  exhibits: exhibitsData.filter((exhibit) => exhibit.roomId === room.id),
}));
