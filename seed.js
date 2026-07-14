// Itinerario Galicia — 6 días efectivos desde Santiago (15-20 julio 2026)
// NH Collection Santiago de Compostela (7 noches). Vuelo de vuelta: martes 21 julio.
//
// COCHE: se recoge el SÁBADO 18 (09-10h) y se devuelve el LUNES 20 (09-10h).
//   -> Solo hay coche sábado 18 y domingo 19.
//   -> Viernes 17 y lunes 20 son días SIN coche (Santiago).
//
// Perfil: ritmo tranquilo, calidad sobre cantidad, costa salvaje + rías, vida local auténtica.
//
// Campos por parada:
//   day (0=info, 8=ideas extra) · date · priority (must/nice/optional)
//   category · time · title · description · tip · map_query

module.exports = [
  // ============================================================
  // DÍA 1 — miércoles 15 julio · Santiago a fondo (sin coche)
  // ============================================================
  {
    day: 1, date: "2026-07-15", priority: "must",
    time: "Mañana", title: "Catedral de Santiago y Pórtico da Gloria",
    category: "imprescindible",
    description: "El corazón de todo. Entrad a la catedral y, si podéis, reservad la visita guiada al Pórtico da Gloria (restaurado, espectacular). Subid también a las cubiertas para vistas del casco antiguo.",
    tip: "Reservad cubiertas y Pórtico con antelación en catedraldesantiago.es. La misa del peregrino es al mediodía; para verla sin agobios, llegad temprano.",
    map_query: "Catedral de Santiago de Compostela"
  },
  {
    day: 1, date: "2026-07-15", priority: "must",
    time: "Mediodía", title: "Comida en el Mercado de Abastos",
    category: "comida",
    description: "El Mercado de Abastos es el segundo lugar más visitado de Santiago y el más auténtico para comer. Compráis producto (pescado, marisco) en los puestos y os lo cocinan al momento en la nave de restauración (Mariscomanía).",
    tip: "Vida local real. Cierra domingos. Ideal para el primer contacto con el producto gallego.",
    map_query: "Mercado de Abastos Santiago de Compostela"
  },
  {
    day: 1, date: "2026-07-15", priority: "must",
    time: "Tarde", title: "Casco histórico: Obradoiro, Quintana, Fonseca",
    category: "imprescindible",
    description: "Paseo sin prisa por las cuatro plazas que rodean la catedral (Obradoiro, Praterías, Quintana, Inmaculada). Callejead por Rúa do Franco y Rúa do Vilar. Entrad al Colexio de Fonseca y su claustro.",
    tip: "Ritmo tranquilo total. Perdeos por las callejuelas de piedra: ahí está la magia.",
    map_query: "Praza do Obradoiro Santiago"
  },
  {
    day: 1, date: "2026-07-15", priority: "nice",
    time: "Atardecer", title: "Parque de la Alameda — vistas de la catedral",
    category: "naturaleza",
    description: "El mirador clásico de la postal de Santiago. Al atardecer la fachada se ilumina y desde el paseo da Ferradura tenéis la mejor panorámica.",
    tip: "Llevad algo de abrigo: en Santiago refresca al caer el sol incluso en julio.",
    map_query: "Parque da Alameda Santiago"
  },
  {
    day: 1, date: "2026-07-15", priority: "must",
    time: "21:00", title: "★ Cena top nº1: Casa Marcelo",
    category: "restaurante-top",
    description: "Una estrella Michelin del chef Marcelo Tejedor. Cocina gallega con guiños internacionales en mesa compartida, ambiente informal pero comida de altísimo nivel. Menú único 'Rosalía'. Vuestra primera experiencia top, y el miércoles abre.",
    tip: "OJO: no aceptan reserva para menos de 8 personas. Para 2 hay que ir en persona a las 20:30, coger turno y dejar el teléfono; os llaman. Cierra lunes y martes. casamarcelo.net",
    map_query: "Casa Marcelo Santiago de Compostela"
  },

  // ============================================================
  // DÍA 2 — jueves 16 julio · Santiago con calma (sin coche)
  // ============================================================
  {
    day: 2, date: "2026-07-16", priority: "must",
    time: "Mañana", title: "Museo do Pobo Galego + Bonaval",
    category: "cultura",
    description: "El mejor museo para entender la vida y cultura gallega tradicional (mar, campo, oficios). En el antiguo convento de Santo Domingo de Bonaval, con la famosa triple escalera helicoidal. Al lado, el parque de Bonaval.",
    tip: "Encaja con vuestro interés por entender la vida local. Entrada económica. Cierra lunes.",
    map_query: "Museo do Pobo Galego"
  },
  {
    day: 2, date: "2026-07-16", priority: "must",
    time: "Mediodía", title: "Comida de tapeo por Rúa da Raíña",
    category: "comida",
    description: "Zona clásica de tapas. Pulpo á feira, pimientos de Padrón, empanada gallega, zamburiñas. Ambiente animado y sin reserva.",
    tip: "Con vino de la casa (Ribeiro o Albariño) sale muy bien de precio. Ritmo relajado.",
    map_query: "Rúa da Raíña Santiago"
  },
  {
    day: 2, date: "2026-07-16", priority: "nice",
    time: "Tarde", title: "Cidade da Cultura (Monte Gaiás)",
    category: "cultura",
    description: "El impresionante complejo de Peter Eisenman en lo alto del monte Gaiás. Arquitectura contemporánea espectacular y vistas de 360º sobre Santiago.",
    tip: "En autobús o taxi (aún sin coche). Si preferís algo más tranquilo, sustituidlo por más casco antiguo. Mirad exposiciones en cidadedacultura.gal.",
    map_query: "Cidade da Cultura de Galicia"
  },
  {
    day: 2, date: "2026-07-16", priority: "nice",
    time: "Noche", title: "Cena: O Curro da Parra o Abastos 2.0",
    category: "comida",
    description: "Cocina gallega de mercado, moderna pero sin pretensiones, producto del día. Perfecto para una noche relajada.",
    tip: "Reservad con un día de antelación.",
    map_query: "O Curro da Parra Santiago"
  },

  // ============================================================
  // DÍA 3 — viernes 17 julio · Santiago con calma / excursión (SIN coche)
  // ============================================================
  {
    day: 3, date: "2026-07-17", priority: "must",
    time: "Todo el día", title: "Día sin coche: Santiago tranquilo o excursión en bus",
    category: "logística",
    description: "Hoy aún no tenéis coche (se recoge mañana). Dos opciones: un día relajado por Santiago (rincones que quedaron, compras, cafés) o una excursión organizada en bus. Elegid según cómo vayáis de energía; la costa salvaje ya la haréis mañana en coche.",
    tip: "Si queréis moveros sin conducir, mirad las dos paradas siguientes: una excursión en bus y un plan tranquilo por la ciudad.",
    map_query: "Santiago de Compostela"
  },
  {
    day: 3, date: "2026-07-17", priority: "nice",
    time: "09:00", title: "Opción: excursión en bus (Rías Baixas o A Coruña)",
    category: "experiencia",
    description: "Como mañana ya vais a la Costa da Morte en coche, si hoy queréis salir en bus elegid otra zona: un tour a las Rías Baixas (Cambados, O Grove, Combarro) o a A Coruña y Betanzos. Salen de la plaza de Galicia por la mañana y vuelven por la tarde.",
    tip: "En julio los tours solo salen algunos días por semana y se llenan: reservad antes (Civitatis, Galicia Travels, Toxo Travel). Así no repetís lo del coche.",
    map_query: "Plaza de Galicia Santiago de Compostela"
  },
  {
    day: 3, date: "2026-07-17", priority: "nice",
    time: "Tarde", title: "Opción tranquila: mercado, compras y cafés",
    category: "otros",
    description: "Plan sin prisas: volver al Mercado de Abastos, comprar tarta de Santiago y conservas, tomar algo en una terraza del casco antiguo y descansar antes de dos días intensos de coche.",
    tip: "Buen día para reservar/confirmar por teléfono las mesas top del finde y la bodega del domingo.",
    map_query: "Rúa do Vilar Santiago"
  },
  {
    day: 3, date: "2026-07-17", priority: "optional",
    time: "Mediodía", title: "Opción: Padrón en tren o bus",
    category: "cultura",
    description: "Escapada corta sin coche: Padrón está a ~25 min y hay trenes/buses frecuentes. Los famosos pimientos, la casa-museo de Rosalía de Castro y el ambiente del Camino Portugués.",
    tip: "Media jornada tranquila. Comprobad horarios de tren (Renfe) o bus (Monbus) desde Santiago.",
    map_query: "Padrón A Coruña"
  },

  // ============================================================
  // DÍA 4 — sábado 18 julio · Costa da Morte + Fisterra (CON coche, se recoge 09-10h)
  // ============================================================
  {
    day: 4, date: "2026-07-18", priority: "must",
    time: "09:30", title: "Recogida del coche y salida a la Costa da Morte",
    category: "logística",
    description: "Recogéis el coche (09-10h) y salís hacia el oeste. Hoy la costa salvaje pura: vuestra prioridad nº1. Ruta hacia Fisterra encadenando los mejores acantilados y faros. Aprovechad todo el día.",
    tip: "Repostad y llevad agua. Descargad mapas offline: en la Costa da Morte la cobertura es irregular. Carreteras con curvas, id sin prisa.",
    map_query: "Santiago de Compostela"
  },
  {
    day: 4, date: "2026-07-18", priority: "nice",
    time: "10:30", title: "Ponte Maceira, aldea de piedra",
    category: "cultura",
    description: "Parada de camino: una de las aldeas más bonitas de Galicia, con su puente medieval sobre el río Tambre. Perfecta para estirar las piernas y hacer fotos.",
    tip: "A ~20 min de Santiago, justo en la ruta hacia la costa. Parada corta pero preciosa.",
    map_query: "Ponte Maceira"
  },
  {
    day: 4, date: "2026-07-18", priority: "must",
    time: "12:00", title: "Cabo Fisterra y el Faro do Fin do Mundo",
    category: "imprescindible",
    description: "El km 0 del Camino. Acantilados sobre el Atlántico, el faro histórico y el ambiente de peregrinos que 'terminan' aquí su viaje. Sensación de estar al borde del mundo.",
    tip: "Id antes de las multitudes del mediodía. El monolito del km 0 y las vistas son imprescindibles.",
    map_query: "Faro de Finisterre"
  },
  {
    day: 4, date: "2026-07-18", priority: "must",
    time: "14:00", title: "Comida en Fisterra: O Fragón o Tira do Cordel",
    category: "comida",
    description: "Pescado y marisco frente al mar. Tira do Cordel es una antigua fábrica de salazón junto a la playa de Langosteira; producto excelente. O Fragón, cocina más creativa con vistas.",
    tip: "Reservad si vais a O Fragón. Pedid el pescado del día a la brasa.",
    map_query: "Tira do Cordel Finisterre"
  },
  {
    day: 4, date: "2026-07-18", priority: "must",
    time: "16:30", title: "Cascada de Ézaro (Fervenza do Xallas)",
    category: "imprescindible",
    description: "La única cascada de Europa que cae directamente al mar. Espectacular. Junto a ella, un mirador elevado con vistas de toda la ría.",
    tip: "Vuestro sábado encaja con la iluminación nocturna (ver la parada de la noche). Comprobad el nivel de agua, depende de la presa.",
    map_query: "Cascada de Ézaro"
  },
  {
    day: 4, date: "2026-07-18", priority: "nice",
    time: "17:30", title: "Mirador do Ézaro (Monte Pindo)",
    category: "naturaleza",
    description: "Subida en coche al mirador sobre la cascada, con vistas al Monte Pindo ('el Olimpo celta') y la desembocadura del Xallas. Atardecer de escándalo.",
    tip: "Carretera estrecha pero asfaltada. Uno de los atardeceres más bonitos de Galicia.",
    map_query: "Mirador do Ézaro"
  },
  {
    day: 4, date: "2026-07-18", priority: "nice",
    time: "18:30", title: "Cabo Vilán y su faro (si da tiempo)",
    category: "naturaleza",
    description: "Uno de los faros más espectaculares de Europa, sobre acantilados brutales. El primer faro eléctrico de España. Está más al norte (~40 min desde Ézaro), así que solo si vais bien de tiempo y energía.",
    tip: "Si preferís no correr, dejadlo y disfrutad el atardecer en Ézaro esperando la iluminación.",
    map_query: "Faro de Cabo Vilán Camariñas"
  },
  {
    day: 4, date: "2026-07-18", priority: "must",
    time: "23:00", title: "★ Ézaro iluminado (solo sábados)",
    category: "experiencia",
    description: "Los sábados de julio la cascada de Ézaro se ilumina de 23:00 a 00:00. Vuestro sábado 18 encaja perfecto. Un espectáculo de luz y agua único, y el broche al día de costa salvaje.",
    tip: "Cenad por la zona (Ézaro, Cee o Fisterra) y quedaos a la iluminación. Volvéis a Santiago después (~1h15) o cenáis con calma antes.",
    map_query: "Cascada de Ézaro"
  },

  // ============================================================
  // DÍA 5 — domingo 19 julio · Rías Baixas y Albariño (CON coche)
  // ============================================================
  {
    day: 5, date: "2026-07-19", priority: "must",
    time: "10:00", title: "Cambados, capital del Albariño",
    category: "imprescindible",
    description: "El epicentro del vino Albariño. Praza de Fefiñáns, una de las plazas más bonitas de Galicia, rodeada de pazos y bodegas. Ambiente señorial y marinero a la vez.",
    tip: "Aprox 1h desde Santiago. Mañana ideal para pasear antes de la comida top.",
    map_query: "Praza de Fefiñáns Cambados"
  },
  {
    day: 5, date: "2026-07-19", priority: "nice",
    time: "11:30", title: "Bodega familiar de Albariño (cata)",
    category: "experiencia",
    description: "Visita y cata en una bodega familiar (no industrial). Aprendéis del proceso, los viñedos en parra y catáis Albariño en origen. Vida local auténtica del vino.",
    tip: "Reservad antes una bodega pequeña/familiar en la D.O. Rías Baixas. Evitad las macrobodegas si buscáis autenticidad. Ojo con conducir después: que cate uno o id con moderación.",
    map_query: "bodegas Albariño Cambados"
  },
  {
    day: 5, date: "2026-07-19", priority: "must",
    time: "14:30", title: "★ Comida top nº2: Casa Solla (Poio)",
    category: "restaurante-top",
    description: "Una estrella Michelin del chef Pepe Solla, el cocinero gallego más emblemático. Restaurante familiar con más de 55 años, hórreo y huerta propia, muy ligado a los pequeños productores. Cocina gallega creativa que encaja con vuestro perfil mejor que un dos estrellas. El domingo abre a mediodía.",
    tip: "RESERVA IMPRESCINDIBLE en restaurantesolla.com o al 986 872 884. Cierra domingo noche, jueves noche y lunes; por eso vamos el domingo a comer. A ~30 min de Cambados.",
    map_query: "Casa Solla Poio Pontevedra"
  },
  {
    day: 5, date: "2026-07-19", priority: "must",
    time: "18:00", title: "Combarro, hórreos junto al mar",
    category: "imprescindible",
    description: "El pueblo de los hórreos a pie de mar, uno de los rincones más fotografiados de Galicia. Callejuelas de piedra, cruceiros y hórreos frente a la ría de Pontevedra. A 10 min de Casa Solla.",
    tip: "Id a última hora de la tarde para evitar el grueso de visitantes. Precioso al atardecer. Cierre perfecto antes de devolver el coche mañana.",
    map_query: "Combarro Poio"
  },

  // ============================================================
  // DÍA 6 — lunes 20 julio · Santiago sin coche (se devuelve 09-10h)
  // ============================================================
  {
    day: 6, date: "2026-07-20", priority: "must",
    time: "09:00", title: "Devolución del coche (09-10h)",
    category: "logística",
    description: "Primera cosa del día: devolver el coche. A partir de aquí, día a pie por Santiago. Es vuestro último día completo antes del vuelo de mañana.",
    tip: "Repostad antes si el alquiler lo pide. Dejad tiempo de margen para la entrega.",
    map_query: "Santiago de Compostela"
  },
  {
    day: 6, date: "2026-07-20", priority: "must",
    time: "Mañana", title: "Santiago: rincones que quedaron",
    category: "imprescindible",
    description: "Sin coche y sin prisa: los rincones del casco antiguo que se quedaron pendientes, alguna iglesia o claustro, el parque de la Alameda con otra luz, o repetir vuestra plaza favorita.",
    tip: "Día tranquilo a propósito, para cerrar el viaje disfrutando en vez de corriendo.",
    map_query: "Casco histórico Santiago de Compostela"
  },
  {
    day: 6, date: "2026-07-20", priority: "must",
    time: "Mediodía", title: "Comida de despedida en Santiago",
    category: "comida",
    description: "Última comida gallega con calma: marisco, pulpo, o una mesa que os haya llamado y no probasteis. Brindad con un Albariño o un Ribeiro.",
    tip: "Si queréis algo especial, reservad. Buenas opciones: A Tafona (1★), Abastos 2.0, o marisquería clásica.",
    map_query: "restaurantes Santiago de Compostela casco antiguo"
  },
  {
    day: 6, date: "2026-07-20", priority: "optional",
    time: "Tarde", title: "Padrón en tren (opcional) o últimas compras",
    category: "cultura",
    description: "Si os quedan ganas de una última escapada sin coche: Padrón en tren (~25 min). Si no, tarde de compras (tarta de Santiago, conservas, vino) y preparar el equipaje.",
    tip: "Comprad los recuerdos gastronómicos hoy: mañana es día de vuelo.",
    map_query: "Padrón A Coruña"
  },

  // ============================================================
  // DÍA 8 — IDEAS EXTRA (sin fecha)
  // ============================================================
  {
    day: 8, date: "", priority: "optional",
    time: "", title: "Muros, Noia y Carnota (necesita coche)",
    category: "naturaleza",
    description: "La ría de Muros-Noia con la playa de Carnota (la más larga de Galicia) y pueblos marineros auténticos. Quedaron fuera al tener solo 2 días de coche. Si ampliáis el alquiler o cambia el plan, es una gran jornada costera.",
    tip: "Se podría combinar con la Costa da Morte si tuvierais un tercer día de coche.",
    map_query: "Praia de Carnota"
  },
  {
    day: 8, date: "", priority: "optional",
    time: "", title: "Ribeira Sacra: cañones del Sil (necesita coche)",
    category: "naturaleza",
    description: "Joya de interior: cañones del río Sil con viñedos en bancales imposibles, monasterios y miradores de vértigo. Aprox 1h45-2h desde Santiago. Necesita coche y un día entero.",
    tip: "No encaja con solo 2 días de coche dedicados a costa y rías. Aquí queda por si acaso. Catamarán por el Sil si reserváis.",
    map_query: "Cañones del Sil Ribeira Sacra miradores"
  },
  {
    day: 8, date: "", priority: "optional",
    time: "", title: "Islas Cíes (barco + permiso)",
    category: "naturaleza",
    description: "Descartadas por vuestro perfil (día entero, barco desde Vigo, permiso de la Xunta y masificación en julio con 1.800 personas). Aquí quedan por si cambiáis de idea.",
    tip: "Si las queréis, hay que reservar barco y permiso de la Xunta YA. Sacrificaríais un día de otra cosa.",
    map_query: "Islas Cíes Vigo"
  },

  // ============================================================
  // DÍA 0 — INFO PRÁCTICA
  // ============================================================
  {
    day: 0, date: "", priority: "must",
    time: "", title: "Coche: solo sábado 18 y domingo 19",
    category: "importante",
    description: "Recogéis el coche el sábado 18 (09-10h) y lo devolvéis el lunes 20 (09-10h). Por eso el plan concentra la naturaleza en coche en dos días: sábado = Costa da Morte + Fisterra (con el Ézaro iluminado de noche), domingo = Rías Baixas (Cambados, Casa Solla, Combarro). Viernes 17 y lunes 20 son días a pie por Santiago (con opción de excursión en bus el viernes).",
    tip: "Si en algún momento podéis ampliar el alquiler un día, mirad las 'Ideas extra': Muros-Carnota o Ribeira Sacra son las mejores candidatas.",
    map_query: ""
  },
  {
    day: 0, date: "", priority: "must",
    time: "", title: "Reservas que debéis confirmar VOSOTROS",
    category: "importante",
    description: "Para julio, confirmad ya: (1) Casa Marcelo — cena top nº1, miércoles 15; NO reservan para menos de 8, hay que ir en persona a las 20:30 y coger turno. (2) Casa Solla — comida top nº2, domingo 19; reservad en restaurantesolla.com o 986 872 884. (3) Bodega familiar de Albariño para la cata (domingo 19). (4) Cubiertas y Pórtico da Gloria de la catedral (día 1). (5) Si hacéis excursión en bus el viernes, reservadla con antelación.",
    tip: "Yo no puedo hacer llamadas ni pagos: estas reservas las confirmáis vosotros. En julio se llena todo con semanas de antelación.",
    map_query: ""
  },
  {
    day: 0, date: "", priority: "nice",
    time: "", title: "Notas de conducción y ritmo",
    category: "importante",
    description: "Los dos días de coche son radios de ida y vuelta desde el NH Collection Santiago. Ninguna conducción supera vuestro límite de ~2h solo ida (Fisterra ~1h15, Cambados ~1h). Las carreteras costeras tienen curvas: id sin prisa. En julio hay luz hasta tarde (~22:00), aprovechad los atardeceres.",
    tip: "El sábado, con el Ézaro iluminado a las 23h, contad con volver tarde a Santiago. No pasa nada: el domingo empezáis con calma.",
    map_query: ""
  }
];
