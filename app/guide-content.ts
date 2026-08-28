import {
  phaseCBeats,
  phaseDBeats,
  phaseEBeats,
  phaseFBeats,
  phaseGBeats,
  type CareBeat,
} from './content';

export type GuideTone = 'info' | 'safe' | 'observe' | 'avoid' | 'urgent';

export type GuideSection =
  | 'conoceme'
  | 'hogar'
  | 'juego'
  | 'alimentacion'
  | 'limpieza'
  | 'salud'
  | 'confianza'
  | 'vuelo-seguro'
  | 'ambiente'
  | 'lenguaje';

type GuideChapterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type ExplorePhase = 'intro' | 'c' | 'd' | 'e' | 'f' | 'g';

export type GuideEntry = {
  id: string;
  title: string;
  sections: GuideSection[];
  chapter: GuideChapterNumber;
  aliases: string[];
  keywords: string[];
  tone: GuideTone;
  verdict: string;
  quickAnswer: string;
  action: string;
  observe?: string;
  details: Array<{ heading: string; text: string }>;
  sourceIds: string[];
  relatedIds: string[];
  explore?: { phase: ExplorePhase; beatId: string };
};

export type GuideCategory = {
  id: GuideSection;
  label: string;
  eyebrow: string;
  description: string;
  chapterNumbers: GuideChapterNumber[];
  entryIds: string[];
};

export type GuideChapter = {
  id: string;
  number: GuideChapterNumber;
  title: string;
  kicker: string;
  phase: ExplorePhase;
  sections: GuideSection[];
  entryIds: string[];
};

const beatsByPhase: Record<Exclude<ExplorePhase, 'intro'>, CareBeat[]> = {
  c: phaseCBeats,
  d: phaseDBeats,
  e: phaseEBeats,
  f: phaseFBeats,
  g: phaseGBeats,
};

type BeatReference = {
  phase: Exclude<ExplorePhase, 'intro'>;
  beatId: string;
};

function findBeat({ phase, beatId }: BeatReference): CareBeat {
  const beat = beatsByPhase[phase].find((candidate) => candidate.id === beatId);

  if (!beat) {
    throw new Error(`No existe el beat ${phase}:${beatId} usado por Modo Consulta.`);
  }

  return beat;
}

type BeatEntryInput = Omit<GuideEntry, 'details' | 'sourceIds' | 'explore'> & {
  explore: BeatReference;
  supporting?: BeatReference[];
  details?: GuideEntry['details'];
};

/**
 * Builds consultation copy from the same beats that drive the scroll film.
 * Supporting beats contribute their copy and sources without changing the
 * destination used by “Ver en Explorar”.
 */
function entryFromBeats({
  explore,
  supporting = [],
  details = [],
  ...entry
}: BeatEntryInput): GuideEntry {
  const referencedBeats = [explore, ...supporting].map(findBeat);
  const beatDetails = referencedBeats.map((beat) => ({
    heading: beat.kicker,
    text: beat.copy,
  }));

  return {
    ...entry,
    details: [...beatDetails, ...details],
    sourceIds: [...new Set(referencedBeats.flatMap((beat) => beat.sourceIds))],
    explore,
  };
}

export const guideEntries: GuideEntry[] = [
  {
    id: 'pico-cera-patas',
    title: 'Pico, cera y patas',
    sections: ['conoceme', 'salud'],
    chapter: 1,
    aliases: ['partes del periquito', 'anatomia', 'anatomía', 'pico', 'cera', 'patas', 'dedos'],
    keywords: ['cuerpo', 'observar', 'dos dedos delante', 'dos dedos detras', 'narinas'],
    tone: 'info',
    verdict: 'Conócelo',
    quickAnswer: 'Pico, cera y patas ayudan a comer, explorar, respirar, posarse y moverse.',
    action: 'Aprende su aspecto habitual y observa cualquier cambio sin intentar diagnosticarlo.',
    details: [
      { heading: 'PICO', text: 'Come, explora y manipula.' },
      { heading: 'CERA', text: 'Es la zona situada sobre el pico y contiene las narinas.' },
      { heading: 'PATAS', text: 'Tiene dos dedos delante y dos detrás, una disposición útil para sujetarse.' },
    ],
    sourceIds: [],
    relatedIds: ['plumaje-alas', 'normal-diario'],
    explore: { phase: 'intro', beatId: 'anatomy' },
  },
  {
    id: 'plumaje-alas',
    title: 'Plumaje y alas',
    sections: ['conoceme', 'lenguaje'],
    chapter: 1,
    aliases: ['plumas', 'alas', 'anatomia de las alas', 'anatomía de las alas', 'plumaje'],
    keywords: ['vuelo', 'proteccion', 'protección', 'comunicacion', 'comunicación', 'cuerpo'],
    tone: 'info',
    verdict: 'Obsérvalos',
    quickAnswer: 'El plumaje protege y comunica; las alas están diseñadas para volar.',
    action: 'Usa su aspecto habitual como referencia y respeta su necesidad de movimiento.',
    details: [
      { heading: 'PLUMAJE', text: 'Protege y comunica su estado.' },
      { heading: 'ALAS', text: 'Están diseñadas para volar.' },
    ],
    sourceIds: [],
    relatedIds: ['muda', 'espacio-alas-accesorios'],
    explore: { phase: 'intro', beatId: 'anatomy' },
  },
  entryFromBeats({
    id: 'jaula-horizontal',
    title: 'Una jaula pensada en horizontal',
    sections: ['hogar'],
    chapter: 2,
    aliases: ['jaula', 'que jaula necesita', 'qué jaula necesita', 'tamaño de jaula', 'jaula para periquito'],
    keywords: ['larga', 'ancha', 'horizontal', 'hogar', 'alojamiento', 'movimiento'],
    tone: 'safe',
    verdict: 'Sí, si permite moverse',
    quickAnswer: 'Prioriza longitud y espacio útil: su desplazamiento principal ocurre en horizontal.',
    action: 'Elige la opción más amplia que puedas mantener segura, limpia y bien equipada.',
    relatedIds: ['espacio-alas-accesorios', 'perchas-naturales', 'ubicacion-jaula'],
    explore: { phase: 'c', beatId: 'proportion' },
  }),
  entryFromBeats({
    id: 'espacio-alas-accesorios',
    title: 'Espacio para alas y recorrido',
    sections: ['hogar'],
    chapter: 2,
    aliases: ['espacio en la jaula', 'muchos accesorios', 'jaula llena', 'puede abrir las alas'],
    keywords: ['alas', 'volar', 'moverse', 'chocar', 'abarrotar', 'accesorios'],
    tone: 'safe',
    verdict: 'Deja paso libre',
    quickAnswer: 'Debe extender las alas y desplazarse sin chocar con perchas, cuencos o juguetes.',
    action: 'Retira o redistribuye accesorios si interrumpen su recorrido.',
    relatedIds: ['jaula-horizontal', 'juguetes-graduales'],
    explore: { phase: 'c', beatId: 'structure' },
    supporting: [{ phase: 'c', beatId: 'ready' }],
  }),
  entryFromBeats({
    id: 'perchas-naturales',
    title: 'Perchas naturales y variadas',
    sections: ['hogar', 'juego'],
    chapter: 2,
    aliases: ['perchas', 'palos de jaula', 'rama natural', 'percha para periquito'],
    keywords: ['madera', 'diametros', 'diámetros', 'angulos', 'ángulos', 'patas', 'presion', 'presión'],
    tone: 'safe',
    verdict: 'Recomendadas',
    quickAnswer: 'Combina perchas naturales de distintos diámetros y ángulos para repartir la presión.',
    action: 'Colócalas firmes, sin bloquear el vuelo ni dejar comederos debajo.',
    observe: 'Revisa suciedad, astillas, desgaste y estabilidad.',
    relatedIds: ['jaula-horizontal', 'cuerda-deshilachada'],
    explore: { phase: 'c', beatId: 'perches' },
  }),
  entryFromBeats({
    id: 'ubicacion-jaula',
    title: 'Dónde colocar la jaula',
    sections: ['hogar', 'ambiente', 'vuelo-seguro'],
    chapter: 2,
    aliases: ['donde poner la jaula', 'dónde poner la jaula', 'ubicacion de jaula', 'ubicación de jaula', 'jaula en cocina'],
    keywords: ['humo', 'cocina', 'corrientes', 'seguro', 'protegido', 'aire'],
    tone: 'observe',
    verdict: 'Lejos de riesgos',
    quickAnswer: 'Busca un lugar protegido, estable y lejos de cocina, humo y corrientes directas.',
    action: 'Revisa el aire, la temperatura, el tránsito de personas y la ruta de vuelo antes de instalarla.',
    relatedIds: ['teflon-ptfe', 'temperatura-aire', 'humo-aerosoles'],
    explore: { phase: 'c', beatId: 'home' },
  }),
  entryFromBeats({
    id: 'juguetes-graduales',
    title: 'Juguetes: pocos y graduales',
    sections: ['juego', 'hogar'],
    chapter: 3,
    aliases: ['juguetes', 'juguete nuevo', 'tiene miedo al juguete', 'cuantos juguetes', 'cuántos juguetes'],
    keywords: ['enriquecimiento', 'gradual', 'seguro', 'espacio', 'miedo'],
    tone: 'safe',
    verdict: 'Sí, con espacio',
    quickAnswer: 'Presenta pocos objetos seguros de forma gradual y conserva una ruta libre para moverse.',
    action: 'Añade uno, observa su reacción y aumenta la cercanía sólo cuando esté cómodo.',
    relatedIds: ['forrajeo', 'cuerda-deshilachada', 'espacio-alas-accesorios'],
    explore: { phase: 'c', beatId: 'toys' },
  }),
  entryFromBeats({
    id: 'forrajeo',
    title: 'Buscar alimento también es jugar',
    sections: ['juego', 'alimentacion', 'lenguaje'],
    chapter: 3,
    aliases: ['forrajeo', 'buscar comida', 'juego con comida', 'enriquecimiento con alimento'],
    keywords: ['explorar', 'reto', 'visible', 'mente', 'pico', 'actividad'],
    tone: 'safe',
    verdict: 'Muy útil',
    quickAnswer: 'Empieza con alimento visible y aumenta el reto de manera gradual.',
    action: 'Haz que la primera búsqueda sea fácil y comprueba que realmente encuentra y come el alimento.',
    relatedIds: ['juguetes-graduales', 'dieta-variada'],
    explore: { phase: 'c', beatId: 'foraging' },
  }),
  entryFromBeats({
    id: 'cuerda-deshilachada',
    title: 'Cuerda deshilachada',
    sections: ['juego', 'hogar'],
    chapter: 3,
    aliases: ['cuerda deshilachada', 'hilos sueltos', 'juguete de cuerda', 'percha de cuerda', 'cuerda rota'],
    keywords: ['atrapamiento', 'fibras', 'revisar', 'retirar', 'reemplazar'],
    tone: 'avoid',
    verdict: 'Retírala',
    quickAnswer: 'Una cuerda con hilos sueltos deja de ser segura.',
    action: 'Retírala y reemplázala de inmediato; no esperes a que se deteriore más.',
    relatedIds: ['juguetes-graduales', 'perchas-naturales'],
    explore: { phase: 'c', beatId: 'rope' },
  }),
  entryFromBeats({
    id: 'espejo',
    title: 'Espejo en la jaula',
    sections: ['juego', 'lenguaje', 'hogar'],
    chapter: 3,
    aliases: ['espejo', 'juguete espejo', 'habla con el espejo', 'periquito y espejo'],
    keywords: ['fijacion', 'fijación', 'estres', 'estrés', 'agresividad', 'compañia', 'compañía'],
    tone: 'observe',
    verdict: 'Observa su efecto',
    quickAnswer: 'Un espejo no reemplaza compañía real y a algunos periquitos les provoca fijación o estrés.',
    action: 'Retíralo si monopoliza su atención o aparecen estrés, frustración o agresividad.',
    relatedIds: ['juguetes-graduales', 'lenguaje-contexto'],
    explore: { phase: 'c', beatId: 'mirror' },
  }),
  entryFromBeats({
    id: 'dieta-variada',
    title: 'Una dieta variada',
    sections: ['alimentacion'],
    chapter: 4,
    aliases: ['que come', 'qué come', 'alimentacion', 'alimentación', 'dieta', 'comida para periquito'],
    keywords: ['equilibrada', 'variedad', 'semillas', 'formulado', 'verduras', 'fruta'],
    tone: 'safe',
    verdict: 'Variedad con medida',
    quickAnswer: 'Una dieta equilibrada no debe depender de una sola semilla o un solo alimento.',
    action: 'Combina el plan indicado para tu ave y cambia cualquier dieta de forma gradual.',
    relatedIds: ['alimento-formulado', 'verduras', 'solo-semillas', 'cambio-dieta'],
    explore: { phase: 'd', beatId: 'food-title' },
  }),
  entryFromBeats({
    id: 'alimento-formulado',
    title: 'Alimento formulado',
    sections: ['alimentacion'],
    chapter: 4,
    aliases: ['pellets', 'pellet', 'alimento formulado', 'pienso para aves', 'croquetas para periquito'],
    keywords: ['base', 'dieta', 'equilibrio', 'semillas', 'conversion', 'conversión'],
    tone: 'safe',
    verdict: 'Puede ser parte central',
    quickAnswer: 'El alimento formulado puede ocupar una parte central del plan alimentario.',
    action: 'No retires de golpe su alimento conocido: realiza la transición de manera gradual.',
    relatedIds: ['dieta-variada', 'cambio-dieta', 'solo-semillas'],
    explore: { phase: 'd', beatId: 'formulated' },
  }),
  entryFromBeats({
    id: 'verduras',
    title: 'Verduras bien lavadas',
    sections: ['alimentacion'],
    chapter: 4,
    aliases: ['verduras', 'hojas verdes', 'brocoli', 'brócoli', 'zanahoria', 'vegetales'],
    keywords: ['fresco', 'lavar', 'piezas pequeñas', 'color', 'texturas'],
    tone: 'safe',
    verdict: 'Sí',
    quickAnswer: 'Ofrece hojas y verduras bien lavadas, cortadas en piezas adecuadas para su tamaño.',
    action: 'Introduce variedad y retira pronto los restos frescos.',
    relatedIds: ['dieta-variada', 'platano-fruta', 'recipientes-diarios'],
    explore: { phase: 'd', beatId: 'greens' },
    supporting: [{ phase: 'd', beatId: 'vegetables' }],
  }),
  entryFromBeats({
    id: 'platano-fruta',
    title: 'Plátano y otras frutas',
    sections: ['alimentacion'],
    chapter: 4,
    aliases: ['platano', 'plátano', 'banana', 'puede comer platano', 'puede comer plátano', 'fruta'],
    keywords: ['porcion pequeña', 'porción pequeña', 'complemento', 'poco', 'dulce'],
    tone: 'safe',
    verdict: 'Sí, en poca cantidad',
    quickAnswer: 'El plátano se trata como otras frutas: una porción pequeña como complemento, no como base.',
    action: 'Ofrece una pieza pequeña y retira el sobrante fresco; evita semillas y huesos de otras frutas.',
    relatedIds: ['dieta-variada', 'verduras', 'aguacate'],
    explore: { phase: 'd', beatId: 'fruit' },
  }),
  entryFromBeats({
    id: 'agua-fresca',
    title: 'Agua fresca cada día',
    sections: ['alimentacion', 'limpieza'],
    chapter: 4,
    aliases: ['agua', 'cada cuanto cambiar el agua', 'bebedero', 'agua limpia'],
    keywords: ['diario', 'recipiente', 'lavar', 'fresca', 'beber'],
    tone: 'safe',
    verdict: 'Imprescindible',
    quickAnswer: 'El agua debe mantenerse limpia y fresca.',
    action: 'Cámbiala y lava el recipiente cada día; hazlo antes si se ensucia.',
    relatedIds: ['recipientes-diarios', 'ubicacion-jaula'],
    explore: { phase: 'd', beatId: 'water' },
  }),
  entryFromBeats({
    id: 'solo-semillas',
    title: 'Dieta de sólo semillas',
    sections: ['alimentacion'],
    chapter: 4,
    aliases: ['solo semillas', 'sólo semillas', 'mezcla de semillas', 'alpiste', 'come puras semillas'],
    keywords: ['incompleta', 'medida', 'dieta', 'variedad', 'conversion', 'conversión'],
    tone: 'observe',
    verdict: 'No como única dieta',
    quickAnswer: 'Una mezcla basada sólo en semillas no es una dieta completa.',
    action: 'Planifica una conversión gradual y confirma que sigue comiendo durante el cambio.',
    relatedIds: ['alimento-formulado', 'cambio-dieta', 'dieta-variada'],
    explore: { phase: 'd', beatId: 'seeds' },
  }),
  entryFromBeats({
    id: 'cambio-dieta',
    title: 'Cambiar la dieta gradualmente',
    sections: ['alimentacion', 'salud'],
    chapter: 4,
    aliases: ['cambiar comida', 'cambio de dieta', 'no acepta pellets', 'no come alimento nuevo', 'conversion de dieta'],
    keywords: ['gradual', 'peso', 'apetito', 'heces', 'confirmar', 'transicion', 'transición'],
    tone: 'observe',
    verdict: 'Nunca de golpe',
    quickAnswer: 'El cambio debe ser gradual y hay que confirmar que el ave realmente come lo nuevo.',
    action: 'Vigila peso, apetito y excrementos; consulta si deja de comer o pierde peso.',
    relatedIds: ['solo-semillas', 'alimento-formulado', 'normal-diario'],
    explore: { phase: 'd', beatId: 'gradual' },
  }),
  entryFromBeats({
    id: 'aguacate',
    title: 'Aguacate',
    sections: ['alimentacion', 'salud'],
    chapter: 4,
    aliases: ['aguacate', 'palta', 'avocado', 'puede comer aguacate', 'comio aguacate', 'comió aguacate'],
    keywords: ['toxico', 'tóxico', 'veneno', 'riesgo', 'alimento prohibido'],
    tone: 'avoid',
    verdict: 'No',
    quickAnswer: 'No ofrezcas aguacate: puede ser tóxico para las aves.',
    action: 'Déjalo fuera de alcance. Si hubo ingestión, contacta de inmediato a un veterinario aviar.',
    relatedIds: ['chocolate-cafeina', 'vomito', 'dieta-variada'],
    explore: { phase: 'd', beatId: 'avocado' },
  }),
  entryFromBeats({
    id: 'chocolate-cafeina',
    title: 'Chocolate, cafeína y alcohol',
    sections: ['alimentacion', 'salud'],
    chapter: 4,
    aliases: ['chocolate', 'cafe', 'café', 'cafeina', 'cafeína', 'alcohol', 'bebida energetica'],
    keywords: ['riesgo', 'toxico', 'tóxico', 'alimento prohibido', 'salado', 'procesado'],
    tone: 'avoid',
    verdict: 'No',
    quickAnswer: 'Chocolate, cafeína y alcohol deben quedar fuera de alcance.',
    action: 'No los ofrezcas; si hubo ingestión, consulta de inmediato a un veterinario aviar.',
    relatedIds: ['aguacate', 'vomito'],
    explore: { phase: 'd', beatId: 'chocolate' },
  }),
  entryFromBeats({
    id: 'limpieza-jaula',
    title: 'Limpieza de la jaula',
    sections: ['limpieza', 'hogar'],
    chapter: 5,
    aliases: ['limpieza de jaula', 'limpiar la jaula', 'como limpiar jaula', 'cómo limpiar jaula', 'lavar jaula'],
    keywords: ['perchas', 'superficies', 'enjuagar', 'secar', 'ave en otro espacio'],
    tone: 'safe',
    verdict: 'Poco y frecuente',
    quickAnswer: 'Limpia superficies y perchas con el ave en otro espacio; enjuaga y seca por completo.',
    action: 'Evita aerosoles y vapores cerca, y aprovecha la limpieza para observar cambios.',
    relatedIds: ['fondo-papel', 'recipientes-diarios', 'humo-aerosoles'],
    explore: { phase: 'd', beatId: 'surfaces' },
    supporting: [{ phase: 'd', beatId: 'clean-title' }],
  }),
  entryFromBeats({
    id: 'fondo-papel',
    title: 'Papel simple en el fondo',
    sections: ['limpieza', 'salud'],
    chapter: 5,
    aliases: ['papel de jaula', 'fondo de jaula', 'sustrato', 'bandeja', 'cambiar papel'],
    keywords: ['diario', 'heces', 'observar', 'limpiar', 'liner'],
    tone: 'safe',
    verdict: 'Útil y fácil de observar',
    quickAnswer: 'El papel simple facilita la limpieza y permite ver los excrementos.',
    action: 'Cámbialo cada día y usa cualquier variación persistente como motivo para observar el conjunto.',
    relatedIds: ['limpieza-jaula', 'normal-diario'],
    explore: { phase: 'd', beatId: 'liner' },
  }),
  entryFromBeats({
    id: 'recipientes-diarios',
    title: 'Comederos y bebederos',
    sections: ['limpieza', 'alimentacion', 'hogar'],
    chapter: 5,
    aliases: ['limpiar comedero', 'limpiar bebedero', 'recipientes', 'cuencos', 'platos de comida'],
    keywords: ['agua', 'jabon', 'jabón', 'enjuague', 'diario', 'alimento fresco'],
    tone: 'safe',
    verdict: 'Lávalos cada día',
    quickAnswer: 'Agua y jabón, buen enjuague y retirada pronta del alimento fresco.',
    action: 'Colócalos donde sean fáciles de retirar y nunca debajo de una percha.',
    relatedIds: ['agua-fresca', 'limpieza-jaula'],
    explore: { phase: 'd', beatId: 'clean-bowls' },
    supporting: [{ phase: 'c', beatId: 'bowls' }],
  }),
  entryFromBeats({
    id: 'normal-diario',
    title: 'Conoce su normal diario',
    sections: ['salud', 'lenguaje'],
    chapter: 6,
    aliases: ['como saber si esta bien', 'cómo saber si está bien', 'salud del periquito', 'comportamiento normal'],
    keywords: ['actividad', 'postura', 'voz', 'sueño', 'comida', 'agua', 'rutina'],
    tone: 'info',
    verdict: 'Compara con su rutina',
    quickAnswer: 'Actividad, postura, voz, sueño, comida y agua forman su referencia personal.',
    action: 'Observa el conjunto cada día para reconocer pronto un cambio real.',
    relatedIds: ['no-canta', 'plumas-erizadas', 'lenguaje-contexto'],
    explore: { phase: 'e', beatId: 'health-title' },
    supporting: [{ phase: 'e', beatId: 'health-routine' }],
  }),
  entryFromBeats({
    id: 'no-canta',
    title: 'Canta menos o está más quieto',
    sections: ['salud', 'lenguaje'],
    chapter: 6,
    aliases: ['no canta', 'dejo de cantar', 'dejó de cantar', 'esta callado', 'está callado', 'mas quieto', 'más quieto'],
    keywords: ['menos voz', 'apatia', 'apatía', 'duerme mas', 'duerme más', 'cambio', 'interes', 'interés'],
    tone: 'observe',
    verdict: 'Observa el conjunto',
    quickAnswer: 'Cantar menos, dormir más o perder interés son cambios que importan frente a su rutina.',
    action: 'Compara actividad, apetito, respiración y excrementos; busca atención si el cambio persiste o se acompaña de otras señales.',
    relatedIds: ['normal-diario', 'plumas-erizadas', 'cola-respirar'],
    explore: { phase: 'e', beatId: 'health-quiet' },
    supporting: [{ phase: 'g', beatId: 'change' }],
  }),
  entryFromBeats({
    id: 'plumas-erizadas',
    title: 'Plumas erizadas o cuerpo esponjado',
    sections: ['salud', 'lenguaje'],
    chapter: 6,
    aliases: ['plumas erizadas', 'esponjado', 'esponjada', 'inflado', 'embolado', 'plumas infladas'],
    keywords: ['frio', 'frío', 'sueño', 'persistente', 'apatia', 'apatía', 'horas'],
    tone: 'observe',
    verdict: 'La duración importa',
    quickAnswer: 'Un esponjado breve puede acompañar sueño o frío; si persiste junto con apatía, importa.',
    action: 'Observa cuánto dura y busca otros cambios de actividad, apetito o respiración.',
    relatedIds: ['no-canta', 'cola-respirar', 'normal-diario'],
    explore: { phase: 'e', beatId: 'health-fluffed' },
    supporting: [{ phase: 'g', beatId: 'fluffed' }],
  }),
  entryFromBeats({
    id: 'cola-respirar',
    title: 'La cola acompaña cada respiración',
    sections: ['salud'],
    chapter: 6,
    aliases: ['cola al respirar', 'mueve la cola al respirar', 'respira con la cola', 'tail bobbing', 'dificultad respiratoria'],
    keywords: ['pico abierto', 'esfuerzo', 'respirar', 'urgencia', 'ahogo'],
    tone: 'urgent',
    verdict: 'Urgencias',
    quickAnswer: 'Si la cola acompaña cada respiración o hay esfuerzo visible en reposo, necesita atención urgente.',
    action: 'Reduce el estrés y contacta de inmediato a un veterinario con experiencia en aves.',
    relatedIds: ['no-puede-posarse', 'humo-aerosoles', 'teflon-ptfe'],
    explore: { phase: 'e', beatId: 'health-breath' },
  }),
  entryFromBeats({
    id: 'vomito',
    title: 'Vómito o alimento expulsado',
    sections: ['salud', 'lenguaje'],
    chapter: 6,
    aliases: ['vomito', 'vómito', 'vomita', 'regurgita', 'expulsa comida', 'sacude comida'],
    keywords: ['cortejo', 'regurgitacion', 'regurgitación', 'descontrolado', 'repetido', 'valoracion', 'valoración'],
    tone: 'urgent',
    verdict: 'No lo diagnostiques en casa',
    quickAnswer: 'El vómito requiere ayuda veterinaria; una oferta dirigida de alimento puede ser cortejo, pero el contexto importa.',
    action: 'Si es descontrolado, repetido o el ave está decaída, contacta hoy a un veterinario aviar; si además está débil, actúa de urgencia.',
    relatedIds: ['lenguaje-contexto', 'no-canta', 'no-puede-posarse'],
    explore: { phase: 'g', beatId: 'attention' },
    supporting: [{ phase: 'g', beatId: 'regurgitation' }],
  }),
  entryFromBeats({
    id: 'no-puede-posarse',
    title: 'No puede posarse o se cae',
    sections: ['salud'],
    chapter: 6,
    aliases: ['no puede posarse', 'se cae de la percha', 'debilidad', 'convulsion', 'convulsión', 'sangrado', 'traumatismo'],
    keywords: ['urgente', 'emergencia', 'caidas', 'caídas', 'lesion', 'lesión'],
    tone: 'urgent',
    verdict: 'Atención inmediata',
    quickAnswer: 'Debilidad, caídas, convulsión, sangrado o traumatismo requieren atención inmediata.',
    action: 'Contacta a un veterinario aviar o servicio de urgencias y evita manipulación innecesaria.',
    relatedIds: ['cola-respirar', 'vomito', 'normal-diario'],
    explore: { phase: 'e', beatId: 'health-emergency' },
  }),
  entryFromBeats({
    id: 'confianza-presencia',
    title: 'Ganar confianza con presencia tranquila',
    sections: ['confianza'],
    chapter: 7,
    aliases: ['ganar confianza', 'domesticar', 'amansar', 'tiene miedo de mi', 'miedo a la mano'],
    keywords: ['despacio', 'voz baja', 'mano quieta', 'distancia', 'tiempo'],
    tone: 'safe',
    verdict: 'A su ritmo',
    quickAnswer: 'La confianza empieza con presencia tranquila, no con contacto forzado.',
    action: 'Acércate despacio, habla bajo y mantén la mano quieta a una distancia cómoda.',
    relatedIds: ['respetar-distancia', 'step-up'],
    explore: { phase: 'e', beatId: 'trust-title' },
    supporting: [{ phase: 'e', beatId: 'trust-presence' }],
  }),
  entryFromBeats({
    id: 'respetar-distancia',
    title: 'Cuando se aparta, detente',
    sections: ['confianza', 'lenguaje'],
    chapter: 7,
    aliases: ['se aleja de mi', 'se aparta', 'intenta escapar', 'no quiere contacto', 'miedo'],
    keywords: ['limite', 'límite', 'distancia', 'eleccion', 'elección', 'tenso', 'forzar'],
    tone: 'observe',
    verdict: 'Respeta su límite',
    quickAnswer: 'Apartarse, tensarse o intentar escapar pide más distancia.',
    action: 'Retrocede a tiempo y vuelve a una distancia que tolere.',
    relatedIds: ['confianza-presencia', 'step-up', 'lenguaje-contexto'],
    explore: { phase: 'e', beatId: 'trust-limit' },
    supporting: [{ phase: 'g', beatId: 'boundary' }],
  }),
  entryFromBeats({
    id: 'step-up',
    title: 'Subir al dedo o a una percha',
    sections: ['confianza'],
    chapter: 7,
    aliases: ['step up', 'subir al dedo', 'subir a la mano', 'entrenar periquito', 'percha de mano'],
    keywords: ['eleccion', 'elección', 'premio', 'recompensa', 'sesion breve', 'sesión breve'],
    tone: 'safe',
    verdict: 'Por elección',
    quickAnswer: 'Invita con una percha o dedo estable y espera a que él inicie el paso.',
    action: 'No empujes su pecho ni lo persigas; premia el intento correcto de inmediato.',
    relatedIds: ['confianza-presencia', 'respetar-distancia'],
    explore: { phase: 'e', beatId: 'trust-step-up' },
    supporting: [{ phase: 'e', beatId: 'trust-reinforce' }],
  }),
  entryFromBeats({
    id: 'habitacion-segura',
    title: 'Revisión antes de abrir la jaula',
    sections: ['vuelo-seguro', 'hogar'],
    chapter: 8,
    aliases: ['habitacion segura', 'habitación segura', 'dejar volar', 'antes de abrir la jaula', 'vuelo en casa'],
    keywords: ['ruta', 'riesgos', 'puertas', 'ventanas', 'ventilador', 'supervision', 'supervisión'],
    tone: 'safe',
    verdict: 'Revisa primero',
    quickAnswer: 'La habitación debe revisarse de extremo a extremo antes de abrir la jaula.',
    action: 'Cierra salidas, bloquea riesgos y prepara una percha clara para el regreso.',
    relatedIds: ['ventanas-ventilador', 'teflon-ptfe', 'vuelo-supervisado'],
    explore: { phase: 'f', beatId: 'preflight' },
    supporting: [{ phase: 'f', beatId: 'safe-landing' }],
  }),
  entryFromBeats({
    id: 'ventanas-ventilador',
    title: 'Ventanas visibles y ventilador detenido',
    sections: ['vuelo-seguro'],
    chapter: 8,
    aliases: ['ventana', 'ventanas', 'vidrio', 'cristal', 'ventilador', 'espejo en habitacion'],
    keywords: ['cortina', 'malla', 'marcas', 'cerrado', 'apagado', 'detenido'],
    tone: 'avoid',
    verdict: 'Corrige antes del vuelo',
    quickAnswer: 'Haz visibles ventanas y espejos; apaga y detén por completo el ventilador.',
    action: 'Usa cortina, malla o marcas en el cristal y comprueba que las aspas ya no se mueven.',
    relatedIds: ['habitacion-segura', 'vuelo-supervisado'],
    explore: { phase: 'f', beatId: 'window' },
    supporting: [{ phase: 'f', beatId: 'fan' }],
  }),
  entryFromBeats({
    id: 'teflon-ptfe',
    title: 'Teflón, PTFE y antiadherentes calientes',
    sections: ['vuelo-seguro', 'hogar', 'salud'],
    chapter: 8,
    aliases: ['teflon', 'teflón', 'ptfe', 'sarten antiadherente', 'sartén antiadherente', 'antiadherente', 'olla antiadherente'],
    keywords: ['cocina', 'vapor', 'humo', 'sobrecalentado', 'mortal', 'respiracion', 'respiración'],
    tone: 'avoid',
    verdict: 'Nunca cerca del ave',
    quickAnswer: 'Los antiadherentes sobrecalentados y sus vapores pueden ser mortales para las aves.',
    action: 'Mantén al periquito lejos de toda cocción; ante exposición o dificultad respiratoria, busca atención urgente.',
    relatedIds: ['humo-aerosoles', 'ubicacion-jaula', 'cola-respirar'],
    explore: { phase: 'f', beatId: 'fumes' },
    supporting: [{ phase: 'f', beatId: 'kitchen' }],
  }),
  entryFromBeats({
    id: 'humo-aerosoles',
    title: 'Humo, aerosoles y fragancias',
    sections: ['vuelo-seguro', 'hogar', 'salud'],
    chapter: 8,
    aliases: ['aerosol', 'spray', 'perfume', 'humo', 'tabaco', 'vapeo', 'vela', 'incienso', 'ambientador'],
    keywords: ['aire limpio', 'vapores', 'respirar', 'contaminacion', 'contaminación'],
    tone: 'avoid',
    verdict: 'Fuera de su ambiente',
    quickAnswer: 'Perfumes, sprays, tabaco, vapeo, velas e incienso no deben entrar en su ambiente.',
    action: 'Lleva cualquier producto en aerosol o combustión a otro lugar y ventila sin crear una corriente directa.',
    relatedIds: ['teflon-ptfe', 'temperatura-aire', 'cola-respirar'],
    explore: { phase: 'f', beatId: 'aerosols' },
  }),
  entryFromBeats({
    id: 'vuelo-supervisado',
    title: 'Vuelo siempre supervisado',
    sections: ['vuelo-seguro'],
    chapter: 8,
    aliases: ['supervisar vuelo', 'volar solo', 'sacar de la jaula', 'tiempo fuera de jaula', 'habitación lista'],
    keywords: ['persona presente', 'ruta libre', 'riesgos bloqueados', 'regreso', 'percha'],
    tone: 'safe',
    verdict: 'Sí, con una persona presente',
    quickAnswer: 'Riesgos bloqueados, ruta libre y supervisión durante todo el vuelo.',
    action: 'No abandones la habitación mientras el periquito está fuera de la jaula.',
    relatedIds: ['habitacion-segura', 'ventanas-ventilador'],
    explore: { phase: 'f', beatId: 'room-ready' },
  }),
  entryFromBeats({
    id: 'descanso-noche',
    title: 'Descanso y noche tranquila',
    sections: ['ambiente', 'salud'],
    chapter: 9,
    aliases: ['cuanto duerme', 'cuánto duerme', 'cuantas horas duerme', 'cuántas horas duerme', 'descanso', 'noche', 'sueño'],
    keywords: ['10 12 horas', 'oscura', 'tranquila', 'television', 'televisión', 'ruido', 'interrupciones'],
    tone: 'safe',
    verdict: 'Un tramo largo y tranquilo',
    quickAnswer: 'Como guía habitual, la mayoría de las aves descansa mejor con 10–12 horas de sueño nocturno.',
    action: 'Distingue el día de la noche y reduce luces, televisión y ruido durante el descanso.',
    relatedIds: ['temperatura-aire', 'normal-diario', 'no-canta'],
    explore: { phase: 'f', beatId: 'sleep' },
    supporting: [{ phase: 'f', beatId: 'night' }],
  }),
  entryFromBeats({
    id: 'temperatura-aire',
    title: 'Temperatura estable y aire limpio',
    sections: ['ambiente', 'hogar'],
    chapter: 9,
    aliases: ['temperatura', 'corriente de aire', 'aire acondicionado', 'calefaccion', 'calefacción', 'ventilacion', 'ventilación'],
    keywords: ['estable', 'cambios bruscos', 'chorro directo', 'aire fresco', 'extremos'],
    tone: 'observe',
    verdict: 'Estable, sin chorros directos',
    quickAnswer: 'Evita extremos, cambios bruscos y salidas directas de calefacción o aire acondicionado.',
    action: 'Ventila bien y orienta las salidas de aire lejos del ave y de su jaula.',
    relatedIds: ['ubicacion-jaula', 'humo-aerosoles', 'descanso-noche'],
    explore: { phase: 'f', beatId: 'temperature' },
    supporting: [{ phase: 'f', beatId: 'air-draft' }],
  }),
  entryFromBeats({
    id: 'lenguaje-contexto',
    title: 'Lee contexto, duración y cambio',
    sections: ['lenguaje', 'salud'],
    chapter: 10,
    aliases: ['lenguaje corporal', 'que significa su conducta', 'qué significa su conducta', 'comportamiento', 'entender a mi periquito'],
    keywords: ['voz', 'plumas', 'postura', 'mirada', 'patron', 'patrón', 'duracion', 'duración', 'cambio'],
    tone: 'info',
    verdict: 'Mira el conjunto',
    quickAnswer: 'Una conducta aislada no es un diagnóstico: observa contexto, duración y cambio frente a su normal.',
    action: 'Compara varias señales y responde al patrón, no a un gesto aislado.',
    relatedIds: ['normal-diario', 'respetar-distancia', 'no-canta', 'muda'],
    explore: { phase: 'g', beatId: 'context' },
    supporting: [{ phase: 'g', beatId: 'language-title' }],
  }),
  entryFromBeats({
    id: 'muda',
    title: 'Muda gradual de plumas',
    sections: ['lenguaje', 'salud'],
    chapter: 10,
    aliases: ['muda', 'cambio de plumas', 'pierde plumas', 'plumas en el fondo', 'caida de plumas', 'caída de plumas'],
    keywords: ['gradual', 'plumas enteras', 'piel', 'zonas descubiertas', 'calvas'],
    tone: 'observe',
    verdict: 'Gradual y sin piel descubierta',
    quickAnswer: 'Una muda normal es gradual, deja plumas enteras y no descubre zonas de piel.',
    action: 'Consulta si aparecen zonas sin plumas, lesiones, deterioro marcado o un cambio general de conducta.',
    relatedIds: ['plumaje-alas', 'plumas-erizadas', 'lenguaje-contexto'],
    explore: { phase: 'g', beatId: 'molt' },
  }),
  {
    id: 'primeros-dias-en-casa',
    title: 'Sus primeros días en casa',
    sections: ['hogar', 'confianza', 'salud'],
    chapter: 2,
    aliases: ['primer dia', 'primer día', 'recien llegado', 'recién llegado', 'nuevo periquito', 'adaptacion a casa', 'adaptación a casa'],
    keywords: ['tranquilidad', 'rutina', 'comida conocida', 'agua visible', 'observar', 'veterinario'],
    tone: 'info',
    verdict: 'Menos estímulos, más observación',
    quickAnswer: 'Al llegar necesita una rutina predecible, acceso evidente a comida y agua, y tiempo para observar el nuevo espacio.',
    action: 'Mantén al principio el alimento que ya reconoce, limita cambios simultáneos y agenda una revisión con un veterinario con experiencia en aves.',
    observe: 'Confirma que localiza los recipientes, come, bebe, produce heces y se sostiene con equilibrio.',
    details: [
      { heading: 'PRIMERA PAUSA', text: 'Permite que conozca la habitación y la jaula antes de pedir contacto o entrenamiento.' },
      { heading: 'RUTINA PREDECIBLE', text: 'Horarios parecidos de luz, alimento y descanso reducen sorpresas innecesarias.' },
      { heading: 'UNA REFERENCIA', text: 'Anota qué come, cómo se posa y cuándo vocaliza: esa base ayuda a reconocer cambios.' },
    ],
    sourceIds: ['aavBasic', 'vcaBudgieGeneral', 'msdBirdIllness'],
    relatedIds: ['ubicacion-jaula', 'confianza-presencia', 'revision-veterinaria-inicial'],
  },
  {
    id: 'revision-veterinaria-inicial',
    title: 'Primera revisión veterinaria',
    sections: ['salud'],
    chapter: 6,
    aliases: ['veterinario aviar', 'veterinario de aves', 'primera consulta', 'revisión inicial', 'chequeo del periquito'],
    keywords: ['preventiva', 'historial', 'peso', 'clinica aviar', 'clínica aviar', 'nuevo periquito'],
    tone: 'safe',
    verdict: 'Conviene programarla pronto',
    quickAnswer: 'Un ave recién llegada debe ser examinada por un veterinario con experiencia real en aves, aunque parezca sana.',
    action: 'Localiza la clínica antes de una emergencia y lleva datos sobre procedencia, dieta, rutina y cualquier cambio observado.',
    details: [
      { heading: 'ANTES DE NECESITARLA', text: 'Guarda teléfono, horario y ruta de una clínica que atienda aves y confirma cómo maneja urgencias.' },
      { heading: 'LLEVA CONTEXTO', text: 'Fotos recientes de heces, registro de peso y el alimento habitual pueden ayudar a explicar la tendencia.' },
    ],
    sourceIds: ['vcaBudgieGeneral', 'aavBasic'],
    relatedIds: ['transportin-seguro', 'peso-y-tendencia', 'urgencias-en-una-mirada'],
  },
  {
    id: 'transportin-seguro',
    title: 'Transportín listo para la clínica',
    sections: ['salud', 'hogar'],
    chapter: 6,
    aliases: ['transportin', 'transportín', 'llevar al veterinario', 'viajar con periquito', 'caja de transporte'],
    keywords: ['traslado', 'percha baja', 'fondo estable', 'toalla', 'clinica', 'clínica'],
    tone: 'safe',
    verdict: 'Prepáralo antes',
    quickAnswer: 'Un transportín pequeño, firme y ventilado hace el traslado más controlable que improvisar durante una urgencia.',
    action: 'Familiarízalo poco a poco; para un ave débil, consulta a la clínica cómo preparar el fondo y si debe retirarse la percha.',
    details: [
      { heading: 'SIN OBJETOS SUELTOS', text: 'Durante el traslado evita columpios, recipientes pesados u objetos que puedan golpearlo.' },
      { heading: 'TEMPERATURA ESTABLE', text: 'Protégelo de corrientes directas y nunca lo dejes en un automóvil estacionado.' },
    ],
    sourceIds: ['aavBasic', 'vcaBudgieGeneral'],
    relatedIds: ['revision-veterinaria-inicial', 'no-puede-posarse'],
  },
  {
    id: 'no-come-o-come-menos',
    title: 'No come o come mucho menos',
    sections: ['salud', 'alimentacion'],
    chapter: 6,
    aliases: ['no come', 'dejo de comer', 'dejó de comer', 'come menos', 'sin apetito', 'rechaza comida'],
    keywords: ['apetito', 'anorexia', 'peso', 'heces', 'decaido', 'decaído', 'urgencia'],
    tone: 'urgent',
    verdict: 'No esperes a que empeore',
    quickAnswer: 'Una disminución clara del apetito puede ser una señal temprana de enfermedad y merece contacto veterinario rápido.',
    action: 'Confirma que realmente ingiere alimento y contacta hoy a un veterinario aviar; si además está débil, en el fondo o respira con esfuerzo, trátalo como urgencia.',
    observe: 'Anota desde cuándo cambió, qué alimento acepta, cuántas heces produce y si también bebe o pierde equilibrio.',
    details: [
      { heading: 'NO CAMBIES TODO A LA VEZ', text: 'Si el problema empezó durante una conversión de dieta, conserva acceso al alimento conocido mientras recibes orientación profesional.' },
      { heading: 'NO ALIMENTES A LA FUERZA', text: 'Dar líquidos o alimento con jeringa sin indicación puede causar aspiración; pide instrucciones a la clínica.' },
    ],
    sourceIds: ['msdBirdIllness', 'vcaBirdIllness', 'ucDavisConversion'],
    relatedIds: ['peso-y-tendencia', 'heces-cambios', 'urgencias-en-una-mirada'],
  },
  {
    id: 'ojos-narinas-secrecion',
    title: 'Ojos o narinas con secreción',
    sections: ['salud', 'conoceme'],
    chapter: 6,
    aliases: ['ojo cerrado', 'ojos llorosos', 'nariz mojada', 'narinas sucias', 'secrecion nasal', 'secreción nasal'],
    keywords: ['cera', 'hinchazon', 'hinchazón', 'respiracion', 'respiración', 'costras'],
    tone: 'urgent',
    verdict: 'Necesita valoración',
    quickAnswer: 'Secreción, hinchazón, costras nuevas o un ojo que permanece cerrado no forman parte de una cara limpia normal.',
    action: 'Solicita valoración veterinaria; si hay respiración con pico abierto, esfuerzo o debilidad, busca atención urgente.',
    observe: 'Compara ambos lados y registra color, cantidad, duración y cualquier cambio en voz, apetito o respiración.',
    details: [
      { heading: 'NO APLIQUES GOTAS HUMANAS', text: 'La causa no puede determinarse sólo por la apariencia y un producto inadecuado puede retrasar la atención correcta.' },
    ],
    sourceIds: ['msdBirdIllness', 'vcaBirdIllness'],
    relatedIds: ['pico-cera-patas', 'cola-respirar', 'normal-diario'],
  },
  {
    id: 'heces-cambios',
    title: 'Cambios en las heces',
    sections: ['salud', 'limpieza'],
    chapter: 6,
    aliases: ['heces', 'excrementos', 'popo', 'popó', 'diarrea', 'semillas en las heces', 'cambio de color'],
    keywords: ['papel del fondo', 'cantidad', 'consistencia', 'sangre', 'tendencia', 'alimento sin digerir'],
    tone: 'observe',
    verdict: 'Compara y registra',
    quickAnswer: 'El papel del fondo permite detectar cambios persistentes en cantidad, color, parte líquida o alimento sin digerir.',
    action: 'Toma una foto con fecha y consulta si el cambio persiste o acompaña apatía, pérdida de apetito, vómito o debilidad.',
    observe: 'Una sola deposición no cuenta toda la historia: mira la tendencia y el estado general del ave.',
    details: [
      { heading: 'ATENCIÓN RÁPIDA', text: 'Sangre, alimento entero repetido, ausencia marcada de heces o un cambio junto con debilidad requieren orientación veterinaria inmediata.' },
    ],
    sourceIds: ['msdBirdIllness'],
    relatedIds: ['fondo-papel', 'no-come-o-come-menos', 'peso-y-tendencia'],
  },
  {
    id: 'peso-y-tendencia',
    title: 'Peso y tendencia',
    sections: ['salud'],
    chapter: 6,
    aliases: ['pesar periquito', 'peso del periquito', 'bascula', 'báscula', 'pierde peso', 'registro de peso'],
    keywords: ['gramos', 'misma hora', 'tendencia', 'balanza', 'semanal', 'veterinario'],
    tone: 'observe',
    verdict: 'La tendencia importa',
    quickAnswer: 'Las plumas pueden ocultar pérdida de condición; un registro consistente ayuda a detectar una tendencia antes.',
    action: 'Usa una báscula en gramos, en condiciones parecidas, y comparte cualquier descenso sostenido con el veterinario.',
    details: [
      { heading: 'SIN PERSEGUIRLO', text: 'Enséñale a subir a una pequeña percha sobre la báscula con refuerzo positivo.' },
      { heading: 'NO HAY UN NÚMERO UNIVERSAL', text: 'Compara con su propia referencia y deja la interpretación clínica al profesional.' },
    ],
    sourceIds: ['aavSigns', 'msdBirdIllness'],
    relatedIds: ['normal-diario', 'no-come-o-come-menos', 'revision-veterinaria-inicial'],
  },
  {
    id: 'urgencias-en-una-mirada',
    title: 'Urgencias en una mirada',
    sections: ['salud'],
    chapter: 6,
    aliases: ['urgencia', 'emergencia', 'cuando ir al veterinario', 'se esta muriendo', 'se está muriendo', 'ayuda inmediata'],
    keywords: ['respira mal', 'sangrado', 'convulsion', 'convulsión', 'caida', 'caída', 'fondo de jaula', 'traumatismo'],
    tone: 'urgent',
    verdict: 'Actúa de inmediato',
    quickAnswer: 'Respiración con esfuerzo, sangrado, convulsión, traumatismo, debilidad extrema o no poder posarse requieren atención inmediata.',
    action: 'Llama al servicio veterinario, reduce luz, ruido y manipulación, y sigue sus indicaciones para el traslado.',
    details: [
      { heading: 'NO ESPERES A MAÑANA', text: 'Las aves suelen ocultar enfermedad; cuando una señal grave ya es visible, retrasar la atención aumenta el riesgo.' },
      { heading: 'NO MEDIQUES EN CASA', text: 'No uses fármacos humanos, antibióticos sobrantes ni remedios caseros.' },
    ],
    sourceIds: ['msdBirdIllness', 'merckBirdEmergency', 'aavSigns'],
    relatedIds: ['cola-respirar', 'no-puede-posarse', 'transportin-seguro'],
  },
  {
    id: 'cables-y-enchufes',
    title: 'Cables y enchufes',
    sections: ['vuelo-seguro', 'hogar'],
    chapter: 8,
    aliases: ['cable', 'cables', 'enchufe', 'muerde cables', 'electricidad'],
    keywords: ['electrocucion', 'electrocución', 'quemadura', 'ocultar', 'desconectar', 'morder'],
    tone: 'avoid',
    verdict: 'Fuera de alcance',
    quickAnswer: 'Un periquito puede morder el recubrimiento blando y exponerse a descarga, quemadura o incendio.',
    action: 'Oculta los cables con barreras inaccesibles o desconéctalos antes del vuelo; no confíes sólo en vigilar desde lejos.',
    details: [{ heading: 'REVISA EL RECORRIDO COMPLETO', text: 'Incluye cables detrás de muebles, cargadores, extensiones y huecos donde pueda aterrizar.' }],
    sourceIds: ['vcaHousehold', 'aavHousehold'],
    relatedIds: ['habitacion-segura', 'vuelo-supervisado'],
  },
  {
    id: 'plantas-identificadas',
    title: 'Plantas sólo si están identificadas',
    sections: ['vuelo-seguro', 'hogar'],
    chapter: 8,
    aliases: ['planta', 'plantas', 'hojas', 'maceta', 'planta toxica', 'planta tóxica'],
    keywords: ['identificar', 'nombre cientifico', 'nombre científico', 'morder hojas', 'veterinario'],
    tone: 'observe',
    verdict: 'Verifica antes',
    quickAnswer: 'No asumas que una planta doméstica es segura: el periquito puede morder hojas, tierra o tratamientos.',
    action: 'Identifica la especie con certeza y confirma su seguridad con una fuente veterinaria; si hay duda, retírala de la habitación.',
    details: [{ heading: 'LA LISTA ES UN PUNTO DE PARTIDA', text: 'La evidencia específica en aves es limitada; incluso una planta considerada segura puede causar problemas si se consume en exceso o tiene pesticidas.' }],
    sourceIds: ['vcaPlants', 'vcaHousehold'],
    relatedIds: ['habitacion-segura', 'humo-aerosoles'],
  },
  {
    id: 'agua-abierta',
    title: 'Agua profunda o recipientes abiertos',
    sections: ['vuelo-seguro', 'hogar'],
    chapter: 8,
    aliases: ['agua profunda', 'taza con agua', 'vaso', 'inodoro', 'bañera', 'fregadero', 'pecera'],
    keywords: ['ahogamiento', 'tapar', 'recipiente', 'baño', 'cocina'],
    tone: 'avoid',
    verdict: 'Cubre o vacía',
    quickAnswer: 'Inodoros, cubetas, vasos, ollas, fregaderos y peceras abiertas pueden convertirse en una trampa.',
    action: 'Vacía o cubre toda agua profunda antes de abrir la jaula y mantén cerrada la puerta del baño.',
    details: [{ heading: 'NO CONFUNDIR CON BAÑO SEGURO', text: 'Un plato de baño poco profundo y supervisado es distinto de un recipiente del que no puede salir.' }],
    sourceIds: ['vcaHousehold'],
    relatedIds: ['habitacion-segura', 'vuelo-supervisado'],
  },
  {
    id: 'otras-mascotas',
    title: 'Gatos, perros y otras mascotas',
    sections: ['vuelo-seguro', 'hogar'],
    chapter: 8,
    aliases: ['gato', 'perro', 'mascotas', 'convive con gato', 'convive con perro', 'depredadores'],
    keywords: ['separar', 'puerta cerrada', 'supervision', 'supervisión', 'instinto', 'mordida'],
    tone: 'avoid',
    verdict: 'Separación física',
    quickAnswer: 'La convivencia tranquila no elimina el instinto de caza ni el riesgo de una reacción súbita.',
    action: 'Mantén a otras mascotas fuera, con una puerta cerrada, durante el vuelo; nunca las dejes juntas sin barrera.',
    details: [{ heading: 'UN SEGUNDO BASTA', text: 'La supervisión humana no sustituye una separación física efectiva.' }],
    sourceIds: ['vcaHousehold'],
    relatedIds: ['habitacion-segura', 'vuelo-supervisado'],
  },
  {
    id: 'manzana-sin-semillas',
    title: 'Manzana sin semillas',
    sections: ['alimentacion'],
    chapter: 4,
    aliases: ['manzana', 'puede comer manzana', 'semilla de manzana', 'corazon de manzana', 'corazón de manzana'],
    keywords: ['fruta', 'porcion pequeña', 'porción pequeña', 'lavada', 'sin semillas'],
    tone: 'safe',
    verdict: 'Sí, preparada',
    quickAnswer: 'Puede ofrecerse un trozo pequeño de pulpa bien lavada, sin semillas ni corazón, como complemento ocasional.',
    action: 'Retira las semillas, corta una porción apropiada y quita el sobrante fresco después de un tiempo corto.',
    details: [{ heading: 'NO ES LA BASE', text: 'La fruta complementa una dieta equilibrada; no sustituye el alimento principal ni las verduras variadas.' }],
    sourceIds: ['aavHousehold', 'vcaBudgieFeeding'],
    relatedIds: ['platano-fruta', 'dieta-variada', 'verduras'],
  },
];

export const starterEntryIds = [
  'primeros-dias-en-casa',
  'jaula-horizontal',
  'dieta-variada',
  'habitacion-segura',
  'normal-diario',
  'urgencias-en-una-mirada',
] as const;

const categoryDefinitions: Array<Omit<GuideCategory, 'entryIds'>> = [
  { id: 'conoceme', label: 'Conóceme', eyebrow: '01 · CUERPO', description: 'Una guía breve para reconocer sus partes y su aspecto habitual.', chapterNumbers: [1] },
  { id: 'hogar', label: 'Mi hogar', eyebrow: '02 · ESPACIO', description: 'Jaula, perchas, distribución y ubicación segura.', chapterNumbers: [2] },
  { id: 'juego', label: 'Juega conmigo', eyebrow: '03 · ENRIQUECIMIENTO', description: 'Objetos seguros, forrajeo y señales para retirar un juguete.', chapterNumbers: [3] },
  { id: 'alimentacion', label: 'Lo que como', eyebrow: '04 · ALIMENTACIÓN', description: 'Una consulta rápida sobre dieta, agua y alimentos de riesgo.', chapterNumbers: [4] },
  { id: 'limpieza', label: 'Mi espacio limpio', eyebrow: '05 · HIGIENE', description: 'Rutinas sencillas para limpiar y observar.', chapterNumbers: [5] },
  { id: 'salud', label: '¿Estoy bien?', eyebrow: '06 · SALUD', description: 'Cambios que conviene observar y señales que requieren ayuda urgente.', chapterNumbers: [6] },
  { id: 'confianza', label: 'Confía en mí', eyebrow: '07 · VÍNCULO', description: 'Presencia tranquila, límites y entrenamiento por elección.', chapterNumbers: [7] },
  { id: 'vuelo-seguro', label: 'Déjame explorar', eyebrow: '08 · VUELO SEGURO', description: 'La revisión de la habitación antes de abrir la jaula.', chapterNumbers: [8] },
  { id: 'ambiente', label: 'Mi ambiente', eyebrow: '09 · DÍA Y NOCHE', description: 'Aire, temperatura y un descanso realmente tranquilo.', chapterNumbers: [9] },
  { id: 'lenguaje', label: 'Aprende mi lenguaje', eyebrow: '10 · CONDUCTA', description: 'Cómo leer voz, postura, plumas y mirada en contexto.', chapterNumbers: [10] },
];

export const guideCategories: GuideCategory[] = categoryDefinitions.map((category) => ({
  ...category,
  entryIds: guideEntries
    .filter((entry) => entry.sections.includes(category.id))
    .map((entry) => entry.id),
}));

const chapterDefinitions: Array<Omit<GuideChapter, 'entryIds'>> = [
  { id: 'conoceme', number: 1, title: 'Conóceme', kicker: 'Antes de cuidarme', phase: 'intro', sections: ['conoceme'] },
  { id: 'mi-hogar', number: 2, title: 'Mi hogar', kicker: 'Un espacio seguro', phase: 'c', sections: ['hogar'] },
  { id: 'juega-conmigo', number: 3, title: 'Juega conmigo', kicker: 'Jugar también es cuidar', phase: 'c', sections: ['juego'] },
  { id: 'lo-que-como', number: 4, title: 'Lo que como', kicker: 'Variedad con medida', phase: 'd', sections: ['alimentacion'] },
  { id: 'mi-espacio-limpio', number: 5, title: 'Mi espacio limpio', kicker: 'Poco y frecuente', phase: 'd', sections: ['limpieza'] },
  { id: 'estoy-bien', number: 6, title: '¿Estoy bien?', kicker: 'Conoce su normal', phase: 'e', sections: ['salud'] },
  { id: 'confia-en-mi', number: 7, title: 'Confía en mí', kicker: 'La confianza tiene su ritmo', phase: 'e', sections: ['confianza'] },
  { id: 'dejame-explorar', number: 8, title: 'Déjame explorar', kicker: 'Volar también se prepara', phase: 'f', sections: ['vuelo-seguro'] },
  { id: 'mi-ambiente', number: 9, title: 'Mi ambiente', kicker: 'La misma habitación cambia', phase: 'f', sections: ['ambiente'] },
  { id: 'aprende-mi-lenguaje', number: 10, title: 'Aprende mi lenguaje', kicker: 'Su cuerpo también habla', phase: 'g', sections: ['lenguaje'] },
];

export const guideChapters: GuideChapter[] = chapterDefinitions.map((chapter) => ({
  ...chapter,
  entryIds: guideEntries
    .filter((entry) => entry.chapter === chapter.number)
    .map((entry) => entry.id),
}));

const naturalSearchStopWords = new Set([
  'a',
  'al',
  'de',
  'del',
  'el',
  'en',
  'es',
  'la',
  'las',
  'le',
  'lo',
  'los',
  'mi',
  'para',
  'por',
  'periquito',
  'periquitos',
  'puede',
  'que',
  'se',
  'su',
  'un',
  'una',
  'ave',
  'aves',
  'y',
]);

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function meaningfulSearchTokens(value: string): string[] {
  return normalizeSearch(value)
    .split(' ')
    .filter((token) => token.length > 1 && !naturalSearchStopWords.has(token));
}

function searchableFields(entry: GuideEntry): string[] {
  const sectionLabels: Record<GuideSection, string> = {
    conoceme: 'conoceme cuerpo anatomia',
    hogar: 'hogar jaula casa',
    juego: 'juego juguetes enriquecimiento',
    alimentacion: 'alimentacion comida alimentos bebida',
    limpieza: 'limpieza higiene',
    salud: 'salud sintomas veterinario urgencias',
    confianza: 'confianza vinculo entrenamiento',
    'vuelo-seguro': 'vuelo seguro habitacion riesgos',
    ambiente: 'ambiente dia noche aire temperatura',
    lenguaje: 'lenguaje conducta comportamiento',
  };
  return [
    entry.title,
    ...entry.aliases,
    ...entry.keywords,
    entry.verdict,
    entry.quickAnswer,
    entry.action,
    entry.observe ?? '',
    ...entry.details.flatMap((detail) => [detail.heading, detail.text]),
    ...entry.sections.map((section) => sectionLabels[section]),
  ]
    .map(normalizeSearch)
    .filter(Boolean);
}

export function searchGuideEntries(query: string, limit = 8): GuideEntry[] {
  const normalizedQuery = normalizeSearch(query);
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 8;

  if (!normalizedQuery || safeLimit === 0) return [];

  const queryTokens = meaningfulSearchTokens(normalizedQuery);

  const ranked = guideEntries
    .map((entry, order) => {
      const fields = searchableFields(entry);
      const aliases = entry.aliases.map(normalizeSearch);
      const title = normalizeSearch(entry.title);
      const titleTokens = meaningfulSearchTokens(title);
      const aliasTokens = entry.aliases.map(meaningfulSearchTokens);
      let score = 0;

      if (title === normalizedQuery) score += 160;
      if (aliases.includes(normalizedQuery)) score += 150;
      const allowSubstring = normalizedQuery.length > 3;
      if (allowSubstring && title.includes(normalizedQuery)) score += 90;

      for (const alias of aliases) {
        if (allowSubstring && alias.includes(normalizedQuery)) score += 80;
        else if (allowSubstring && alias.length > 3 && normalizedQuery.includes(alias)) score += 64;
      }

      if (allowSubstring && fields.some((field) => field.includes(normalizedQuery))) score += 52;
      if (queryTokens.length > 1 && queryTokens.every((token) => titleTokens.includes(token))) score += 100;
      if (queryTokens.length > 1 && aliasTokens.some((tokens) => tokens.length === queryTokens.length && queryTokens.every((token) => tokens.includes(token)))) score += 140;

      let matchedTokens = 0;
      for (const token of queryTokens) {
        const inTitle = title.split(' ').includes(token);
        const inAlias = aliases.some((alias) => alias.split(' ').includes(token));
        const inAnyField = fields.some((field) => field.split(' ').includes(token));

        if (inTitle) score += 18;
        else if (inAlias) score += 14;
        else if (inAnyField) score += 6;

        if (inTitle || inAlias || inAnyField) matchedTokens += 1;
      }

      if (queryTokens.length > 0 && matchedTokens === queryTokens.length) score += 34;

      return { entry, order, score, matchedTokens };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order);

  const strict = queryTokens.length > 1
    ? ranked.filter((result) => result.matchedTokens === queryTokens.length)
    : ranked;
  const candidates = strict.length
    ? strict
    : ranked.filter((result) => result.matchedTokens >= Math.max(1, Math.ceil(queryTokens.length * .67)));

  return candidates
    .slice(0, safeLimit)
    .map(({ entry }) => entry);
}

export function getGuideEntry(id: string): GuideEntry | undefined {
  const normalizedId = normalizeSearch(id).replace(/ /g, '-');
  return guideEntries.find((entry) => entry.id === normalizedId);
}
