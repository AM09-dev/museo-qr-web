import type { Room } from '../types';

/**
 * Datos de prueba (mock data) — RF-07.
 * Descripciones narrativas completas en 4 idiomas y multimedia
 * de muestra público y verificado (MP3 de audioguía + MP4 panorámico).
 */
export const roomsData: Room[] = [
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
