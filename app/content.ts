export type CareBeat = {
  id: string;
  at: number;
  kicker: string;
  title: string;
  copy: string;
  sourceIds: string[];
};

export const careSources = {
  aavBasic: {
    label: 'AAV · Cuidados básicos',
    url: 'https://www.aav.org/resource/resmgr/pdf_2019/AAV_Basic-Care-for-Companion.pdf',
  },
  aavForaging: {
    label: 'AAV · Forrajeo',
    url: 'https://www.aav.org/blogpost/1778905/506870/Enrichment-foraging-basics?tag=foraging',
  },
  msdHome: {
    label: 'Manual MSD · Hogar para aves',
    url: 'https://www.merckvetmanual.com/bird-owners/choosing-and-taking-care-of-a-pet-bird/providing-a-home-for-a-bird',
  },
  rspcaEnvironment: {
    label: 'RSPCA · Entorno',
    url: 'https://www.rspca.org.uk/adviceandwelfare/pets/birds/environment',
  },
  rspcaEnrichment: {
    label: 'RSPCA · Enriquecimiento',
    url: 'https://www.rspca.org.uk/adviceandwelfare/pets/birds/enrichment',
  },
  vcaHousing: {
    label: 'VCA · Alojamiento',
    url: 'https://vcahospitals.com/know-your-pet/housing-small-birds',
  },
  vcaPerches: {
    label: 'VCA · Perchas',
    url: 'https://vcahospitals.com/noyes/know-your-pet/perches-for-birds',
  },
  aavHousehold: {
    label: 'AAV · Peligros domésticos',
    url: 'https://www.aav.org/resource/resmgr/pdf_2019/aav_household_dangers2020.pdf',
  },
  msdFeeding: {
    label: 'Manual MSD · Alimentación',
    url: 'https://www.msdvetmanual.com/bird-owners/choosing-and-taking-care-of-a-pet-bird/feeding-a-pet-bird',
  },
  msdFoodHazards: {
    label: 'Manual MSD · Riesgos alimentarios',
    url: 'https://www.msdvetmanual.com/special-pet-topics/poisoning/food-hazards',
  },
  msdHousehold: {
    label: 'Manual MSD · Peligros del hogar',
    url: 'https://www.merckvetmanual.com/bird-owners/routine-care-and-safety-of-birds/household-hazards-for-pet-birds',
  },
  rspcaDiet: {
    label: 'RSPCA · Alimentación',
    url: 'https://www.rspca.org.uk/adviceandwelfare/pets/birds/diet',
  },
  ucDavisConversion: {
    label: 'UC Davis · Cambio de dieta',
    url: 'https://healthtopics.vetmed.ucdavis.edu/health-topics/exotics/bird-diet-conversion',
  },
  vcaBudgieFeeding: {
    label: 'VCA · Alimentación de periquitos',
    url: 'https://vcahospitals.com/bradshaw/know-your-pet/budgies-feeding',
  },
  vcaHygiene: {
    label: 'VCA · Higiene de la jaula',
    url: 'https://vcahospitals.com/know-your-pet/cage-hygiene-in-birds',
  },
  vcaPtfe: {
    label: 'VCA · Intoxicación por PTFE',
    url: 'https://vcahospitals.com/bent-tree/know-your-pet/teflon-polytetrafluoroethylene-poisoning-in-birds',
  },
  aavSigns: {
    label: 'AAV · Señales de enfermedad',
    url: 'https://www.aav.org/resource/resmgr/pdf_2019/AAV_Signs-of-Illness-in-Comp.pdf',
  },
  msdBirdIllness: {
    label: 'Manual MSD · Enfermedad en aves',
    url: 'https://www.msdvetmanual.com/bird-owners/routine-care-and-safety-of-birds/illness-in-pet-birds',
  },
  merckBirdEmergency: {
    label: 'Manual Merck · Lesiones y urgencias',
    url: 'https://www.merckvetmanual.com/bird-owners/disorders-and-diseases-of-birds/injuries-and-accidents-of-pet-birds',
  },
  rspcaTraining: {
    label: 'RSPCA · Entrenamiento respetuoso',
    url: 'https://www.rspca.org.uk/adviceandwelfare/pets/birds/training',
  },
  vcaBirdIllness: {
    label: 'VCA · Reconocer señales de enfermedad',
    url: 'https://vcahospitals.com/know-your-pet/recognizing-the-signs-of-illness-in-pet-birds',
  },
  vcaTaming: {
    label: 'VCA · Acostumbramiento y entrenamiento',
    url: 'https://vcahospitals.com/lakeline/know-your-pet/taming-training-talking-to-birds',
  },
  aavSleep: {
    label: 'AAV · Descanso adecuado',
    url: 'https://www.aav.org/blogpost/1778905/376627/Providing-Adequate-Sleep',
  },
  aavUv: {
    label: 'AAV · Luz ultravioleta',
    url: 'https://www.aav.org/resource/resmgr/pdf_2024/240326-2_UVL.pdf',
  },
  aavVocalization: {
    label: 'AAV · Vocalización',
    url: 'https://www.aav.org/blogpost/1778905/332781/Vocalization',
  },
  aavPreening: {
    label: 'AAV · Acicalamiento',
    url: 'https://www.aav.org/blogpost/1778905/AAV-Enrichment-Tips?DGPCrPg=26&DGPCrSrt=&tag=',
  },
  aavPrey: {
    label: 'AAV · Conducta de alerta',
    url: 'https://www.aav.org/blogpost/1778905/484616/Parrots-are-a-Prey-Species',
  },
  aavWelfare: {
    label: 'AAV · Lenguaje corporal y bienestar',
    url: 'https://www.aav.org/blogpost/2127750/Wings-of-Welfare',
  },
  vcaSexualBehavior: {
    label: 'VCA · Conducta sexual y regurgitación',
    url: 'https://vcahospitals.com/know-your-pet/sexual-behavior-in-birds',
  },
  msdFeathers: {
    label: 'Manual MSD · Piel, plumas y muda',
    url: 'https://www.msdvetmanual.com/bird-owners/disorders-and-diseases-of-birds/skin-and-feather-disorders-of-pet-birds',
  },
  vcaHousehold: {
    label: 'VCA · Peligros domésticos para aves',
    url: 'https://vcahospitals.com/bent-tree/know-your-pet/household-hazards-and-dangers-to-birds',
  },
  vcaPlants: {
    label: 'VCA · Plantas y aves',
    url: 'https://vcahospitals.com/know-your-pet/plants-safe-for-birds',
  },
  vcaBudgieGeneral: {
    label: 'VCA · Primeros cuidados del periquito',
    url: 'https://vcahospitals.com/st-marys/know-your-pet/budgies---general',
  },
} as const;

export const phaseCBeats: CareBeat[] = [
  { id: 'bridge', at: 0, kicker: 'TRANSICIÓN', title: 'De la rama a casa', copy: 'El paisaje queda atrás. BUD-HERO entra en ROOM-BASE.', sourceIds: [] },
  { id: 'home', at: .05, kicker: '02 · MI HOGAR', title: 'Un espacio seguro', copy: 'Primero, el lugar: protegido y lejos de cocina, humo y corrientes.', sourceIds: ['rspcaEnvironment'] },
  { id: 'proportion', at: .11, kicker: 'PROPORCIÓN', title: 'Más larga que alta', copy: 'El movimiento principal ocurre en horizontal.', sourceIds: ['vcaHousing'] },
  { id: 'base', at: .17, kicker: 'BASE', title: 'Firme y fácil de limpiar', copy: 'Una bandeja accesible simplifica el cuidado diario.', sourceIds: ['vcaHousing'] },
  { id: 'structure', at: .24, kicker: 'ESTRUCTURA', title: 'Espacio para las alas', copy: 'Debe extenderlas y moverse sin chocar con accesorios.', sourceIds: ['msdHome'] },
  { id: 'door', at: .31, kicker: 'CIERRE', title: 'Seguro y revisable', copy: 'Puerta, uniones y accesorios deben quedar firmes.', sourceIds: ['vcaHousing'] },
  { id: 'perches', at: .38, kicker: 'PERCHAS', title: 'Naturales y variadas', copy: 'Distintos diámetros y ángulos reparten la presión en las patas.', sourceIds: ['aavBasic'] },
  { id: 'bowls', at: .45, kicker: 'DISTRIBUCIÓN', title: 'Agua, comida y paso libre', copy: 'Nunca debajo de una percha; siempre fáciles de retirar y lavar.', sourceIds: ['rspcaEnvironment', 'vcaHousing'] },
  { id: 'ready', at: .52, kicker: 'LISTO', title: 'Un hogar pensado para moverse', copy: 'Los accesorios acompañan: no deben abarrotar el espacio.', sourceIds: ['msdHome'] },
  { id: 'perch-transition', at: .59, kicker: 'TRANSICIÓN', title: 'La percha cambia de escala', copy: 'La madera nos conduce al siguiente capítulo.', sourceIds: [] },
  { id: 'toys', at: .65, kicker: '03 · JUEGA CONMIGO', title: 'Jugar también es cuidar', copy: 'Pocos objetos seguros, presentados de forma gradual.', sourceIds: ['rspcaEnvironment', 'rspcaEnrichment'] },
  { id: 'foraging', at: .71, kicker: 'FORRAJEO · EXPLORA', title: 'Buscar también es jugar', copy: 'Empieza con alimento visible y aumenta el reto poco a poco.', sourceIds: ['aavForaging'] },
  { id: 'wood', at: .77, kicker: 'MADERA · NATURAL', title: 'Roer, trepar, descubrir', copy: 'Varía formas y texturas sin ocupar el espacio de vuelo.', sourceIds: ['rspcaEnrichment'] },
  { id: 'rope', at: .83, kicker: 'CUERDA · REVISA', title: 'Sin hilos sueltos', copy: 'Si se deshilacha, se retira y se reemplaza de inmediato.', sourceIds: ['vcaPerches'] },
  { id: 'mirror', at: .89, kicker: 'ESPEJO · OBSERVA', title: 'No reemplaza compañía real', copy: 'Retíralo si provoca fijación, estrés o agresividad.', sourceIds: ['msdHome', 'rspcaEnvironment'] },
  { id: 'food-exit', at: .95, kicker: '04 · LO QUE COMO', title: 'Elegir también es cuidar', copy: 'El aro del inspector se convierte en un cuenco.', sourceIds: [] },
];

export const phaseDBeats: CareBeat[] = [
  { id: 'bowl-bridge', at: 0, kicker: 'TRANSICIÓN', title: 'El cuenco toma el encuadre', copy: 'La recompensa del juguete se convierte en una pregunta: ¿qué debe comer?', sourceIds: [] },
  { id: 'food-title', at: .05, kicker: '04 · LO QUE COMO', title: 'Variedad con medida', copy: 'Una dieta equilibrada no cabe en una sola semilla.', sourceIds: ['aavBasic', 'vcaBudgieFeeding'] },
  { id: 'formulated', at: .11, kicker: 'BASE', title: 'No solo semillas', copy: 'El alimento formulado puede ser una parte central del plan.', sourceIds: ['aavBasic', 'msdFeeding'] },
  { id: 'greens', at: .17, kicker: 'VERDURAS', title: 'Color con frecuencia', copy: 'Hojas y verduras bien lavadas, en piezas adecuadas para su tamaño.', sourceIds: ['aavBasic', 'vcaBudgieFeeding'] },
  { id: 'vegetables', at: .23, kicker: 'VARIEDAD', title: 'Crujiente y fresco', copy: 'Brócoli y zanahoria aportan formas y texturas distintas.', sourceIds: ['aavBasic', 'vcaBudgieFeeding'] },
  { id: 'fruit', at: .29, kicker: 'FRUTA · POCO', title: 'Complemento, no base', copy: 'Porciones pequeñas y sin semillas ni huesos.', sourceIds: ['msdFeeding', 'aavHousehold'] },
  { id: 'water', at: .35, kicker: 'AGUA', title: 'Limpia y fresca', copy: 'Cámbiala y lava el recipiente cada día.', sourceIds: ['aavBasic', 'vcaBudgieFeeding'] },
  { id: 'seeds', at: .41, kicker: 'SEMILLAS · MEDIDA', title: 'No son toda la dieta', copy: 'Una mezcla basada solo en semillas no es completa.', sourceIds: ['rspcaDiet', 'vcaBudgieFeeding'] },
  { id: 'gradual', at: .47, kicker: 'CAMBIO', title: 'Siempre gradual', copy: 'Confirma que come lo nuevo y vigila peso, apetito y excrementos.', sourceIds: ['rspcaDiet', 'ucDavisConversion'] },
  { id: 'avoid', at: .53, kicker: 'RIESGOS', title: 'Algunos alimentos no entran', copy: 'La mesa separa lo apto de lo que debe quedar fuera.', sourceIds: ['msdFoodHazards', 'aavHousehold'] },
  { id: 'avocado', at: .58, kicker: 'NO · AGUACATE', title: 'Nunca se ofrece', copy: 'Puede ser tóxico para las aves.', sourceIds: ['msdFoodHazards', 'vcaBudgieFeeding'] },
  { id: 'chocolate', at: .63, kicker: 'NO · CHOCOLATE + CAFEÍNA', title: 'Fuera de alcance', copy: 'También alcohol y alimentos muy salados o procesados.', sourceIds: ['aavHousehold', 'msdFoodHazards'] },
  { id: 'scraps', at: .68, kicker: 'TRANSICIÓN', title: 'Lo que sobra también cuenta', copy: 'Los restos caen hacia la bandeja.', sourceIds: ['vcaBudgieFeeding'] },
  { id: 'clean-title', at: .73, kicker: '05 · MI ESPACIO LIMPIO', title: 'Poco y frecuente', copy: 'Limpiar también ayuda a observar.', sourceIds: ['aavBasic', 'vcaHygiene'] },
  { id: 'clean-bowls', at: .78, kicker: 'CADA DÍA', title: 'Agua y recipientes', copy: 'Agua y jabón, buen enjuague; retira pronto el alimento fresco.', sourceIds: ['vcaBudgieFeeding'] },
  { id: 'liner', at: .84, kicker: 'FONDO', title: 'Papel simple, cambio diario', copy: 'Facilita limpiar y observar las heces.', sourceIds: ['aavBasic'] },
  { id: 'surfaces', at: .90, kicker: 'PERCHAS + JAULA', title: 'Limpia, enjuaga, seca', copy: 'Ave en otro espacio y nada de aerosoles o vapores cerca.', sourceIds: ['vcaHygiene', 'msdHousehold'] },
  { id: 'health-exit', at: .96, kicker: '06 · ¿ESTOY BIEN?', title: 'Limpiar no basta', copy: 'También tienes que aprender a observarlo.', sourceIds: [] },
];

export const nutritionDisclaimer = 'Guía educativa: edad, salud y condición corporal cambian las necesidades. Consulta a un veterinario especializado en aves.';

export const phaseEBeats: CareBeat[] = [
  { id: 'health-bridge', at: 0, kicker: 'TRANSICIÓN', title: 'Lo limpio permite observar', copy: 'BUD-HERO vuelve a posarse. Ahora la atención cambia del espacio al ave.', sourceIds: [] },
  { id: 'health-title', at: .05, kicker: '06 · ¿ESTOY BIEN?', title: 'Conoce su normal', copy: 'Actividad, postura, voz, sueño, comida y agua forman su referencia.', sourceIds: ['msdBirdIllness'] },
  { id: 'health-baseline', at: .105, kicker: 'NORMAL', title: 'Alerta y equilibrado', copy: 'Su postura y actividad habituales son el punto de comparación.', sourceIds: ['msdBirdIllness'] },
  { id: 'health-routine', at: .16, kicker: 'NORMAL · RUTINA', title: 'Mira el conjunto', copy: 'Aprende cuánto come, bebe, vocaliza y se mueve cada día.', sourceIds: ['msdBirdIllness', 'vcaBirdIllness'] },
  { id: 'health-quiet', at: .215, kicker: 'OBSERVA', title: '¿Está más quieto?', copy: 'Dormir más, cantar menos o perder interés es un cambio que importa.', sourceIds: ['msdBirdIllness'] },
  { id: 'health-appetite', at: .27, kicker: 'OBSERVA', title: 'Lo que come también cambia', copy: 'Menos apetito, menos heces o una tendencia de peso descendente: consulta hoy.', sourceIds: ['aavSigns', 'vcaBirdIllness'] },
  { id: 'health-fluffed', at: .325, kicker: 'OBSERVA', title: 'Erizado persistente', copy: 'No lo confundas con el breve esponjado por sueño o frío.', sourceIds: ['aavSigns', 'msdBirdIllness'] },
  { id: 'health-face', at: .38, kicker: 'OBSERVA', title: 'Ojos y narinas limpias', copy: 'Ojo cerrado, hinchazón, secreción o narinas obstruidas justifican consulta.', sourceIds: ['vcaBirdIllness'] },
  { id: 'health-breath', at: .435, kicker: 'ACTÚA AHORA', title: 'Respirar no debe costar', copy: 'Pico abierto en reposo, cola que acompaña cada respiración o esfuerzo visible: urgencias.', sourceIds: ['msdBirdIllness', 'vcaBirdIllness'] },
  { id: 'health-emergency', at: .49, kicker: 'URGENTE', title: 'No puede posarse', copy: 'Debilidad, caídas, convulsión, sangrado o traumatismo requieren atención inmediata.', sourceIds: ['merckBirdEmergency', 'vcaBirdIllness'] },
  { id: 'health-vet', at: .535, kicker: 'VETERINARIO AVIAR', title: 'No necesitas diagnosticar', copy: 'Describe el cambio y busca ayuda pronto; las aves suelen ocultar la enfermedad.', sourceIds: ['msdBirdIllness'] },
  { id: 'trust-title', at: .60, kicker: '07 · CONFÍA EN MÍ', title: 'La confianza tiene su ritmo', copy: 'Empieza con presencia tranquila, no con contacto.', sourceIds: ['rspcaTraining'] },
  { id: 'trust-presence', at: .65, kicker: 'PRESENCIA', title: 'Despacio y en voz baja', copy: 'Acerca la mano lentamente y mantenla quieta a una distancia cómoda.', sourceIds: ['rspcaTraining'] },
  { id: 'trust-limit', at: .70, kicker: 'SU LÍMITE', title: 'Si se aparta, tú también', copy: 'Retroceder a tiempo le enseña que su distancia será respetada.', sourceIds: ['rspcaTraining'] },
  { id: 'trust-reward', at: .75, kicker: 'ASOCIACIÓN POSITIVA', title: 'La mano anuncia algo bueno', copy: 'A la distancia que tolere, ofrece una recompensa pequeña y premia cada aproximación.', sourceIds: ['rspcaTraining'] },
  { id: 'trust-target', at: .80, kicker: 'INVITACIÓN', title: 'Percha o dedo estable', copy: 'Si teme a la mano, empieza con una percha y avanza solo cuando esté cómodo.', sourceIds: ['vcaTaming', 'rspcaTraining'] },
  { id: 'trust-step-up', at: .85, kicker: 'STEP-UP · POR ELECCIÓN', title: 'Él inicia el paso', copy: 'No empujes su pecho ni lo persigas: espera el pie y mantén la mano firme.', sourceIds: ['vcaTaming', 'rspcaTraining'] },
  { id: 'trust-reinforce', at: .89, kicker: 'REFUERZA', title: 'Premia de inmediato', copy: 'Una voz suave y una recompensa llegan justo después del intento correcto.', sourceIds: ['rspcaTraining'] },
  { id: 'trust-short', at: .93, kicker: 'SESIONES BREVES', title: 'Termina con calma', copy: 'Repite poco a poco y detente antes de que pierda interés o se estrese.', sourceIds: ['rspcaTraining'] },
  { id: 'flight-ready', at: .965, kicker: 'ANTES DE VOLAR', title: 'Prepara la habitación', copy: 'Puertas, ventanas, ventiladores y otros riesgos se revisan antes de abrir la jaula.', sourceIds: ['aavHousehold'] },
  { id: 'explore-exit', at: .988, kicker: '08 · DÉJAME EXPLORAR', title: 'Ahora sí: espacio para volar', copy: 'BUD-HERO despega hacia el mismo ROOM-BASE, preparado para revelar sus peligros.', sourceIds: [] },
];

export const healthDisclaimer = 'Estas señales no identifican una enfermedad. No administres medicamentos ni tratamientos sin indicación veterinaria: contacta a un profesional con experiencia en aves.';

export const phaseFBeats: CareBeat[] = [
  { id: 'flight-bridge', at: 0, kicker: 'TRANSICIÓN', title: 'El vuelo empieza aquí', copy: 'BUD-HERO queda suspendido mientras ROOM-BASE se prepara a su alrededor.', sourceIds: [] },
  { id: 'explore-title', at: .045, kicker: '08 · DÉJAME EXPLORAR', title: 'Volar también se prepara', copy: 'La libertad empieza con una habitación revisada de extremo a extremo.', sourceIds: ['aavHousehold', 'msdHousehold'] },
  { id: 'preflight', at: .09, kicker: 'ANTES DE ABRIR', title: 'Revisa toda su ruta', copy: 'Haz una vuelta de seguridad y corrige cada riesgo antes de abrir la jaula.', sourceIds: ['aavHousehold', 'rspcaEnvironment'] },
  { id: 'window', at: .135, kicker: 'VENTANAS + ESPEJOS', title: 'Cerrados y visibles', copy: 'Usa cortina, malla o marcas para que el cristal no parezca aire.', sourceIds: ['msdHousehold', 'aavHousehold'] },
  { id: 'fan', at: .185, kicker: 'VENTILADOR', title: 'Apagado y detenido', copy: 'No basta con bajar la velocidad: debe parar por completo antes del vuelo.', sourceIds: ['msdHousehold', 'aavHousehold'] },
  { id: 'door', at: .235, kicker: 'PUERTAS', title: 'Cierra todas las salidas', copy: 'Una puerta exterior abierta puede cambiar el mapa en un instante.', sourceIds: ['msdHousehold', 'aavHousehold'] },
  { id: 'plant', at: .285, kicker: 'PLANTAS', title: 'Identifica antes de acercar', copy: 'Si no confirmaste que una especie es segura para aves, queda fuera de alcance.', sourceIds: ['msdHousehold'] },
  { id: 'water', at: .335, kicker: 'AGUA PROFUNDA', title: 'Tapa, vacía o bloquea', copy: 'Inodoros, lavabos, tinas, cubetas y recipientes abiertos pueden atraparlo.', sourceIds: ['msdHousehold', 'aavHousehold'] },
  { id: 'cables', at: .385, kicker: 'CABLES + HUECOS', title: 'Fuera del alcance del pico', copy: 'Oculta o desconecta cables y bloquea espacios estrechos antes de volar.', sourceIds: ['msdHousehold', 'aavHousehold'] },
  { id: 'kitchen', at: .435, kicker: 'COCINA', title: 'Fuera de la ruta de vuelo', copy: 'Calor, llamas, líquidos, utensilios y vapores comparten ese espacio.', sourceIds: ['msdHousehold', 'aavHousehold'] },
  { id: 'fumes', at: .485, kicker: 'AIRE · PELIGRO INVISIBLE', title: 'Sin PTFE sobrecalentado', copy: 'Antiadherentes calientes y otros humos pueden ser mortales. Mantén al ave lejos de toda cocción.', sourceIds: ['aavHousehold', 'msdHousehold', 'vcaPtfe'] },
  { id: 'aerosols', at: .535, kicker: 'AIRE LIMPIO', title: 'Sin humo ni aerosoles', copy: 'Perfumes, sprays, tabaco, vapeo, velas e incienso no entran en su ambiente.', sourceIds: ['aavHousehold', 'msdHousehold'] },
  { id: 'safe-landing', at: .585, kicker: 'REGRESO', title: 'Dale un lugar claro para volver', copy: 'Una percha visible y estable cierra la ruta sin persecuciones.', sourceIds: ['aavBasic'] },
  { id: 'room-ready', at: .625, kicker: 'HABITACIÓN LISTA', title: 'Ahora sí: siempre supervisado', copy: 'Riesgos bloqueados, ruta libre y una persona presente durante todo el vuelo.', sourceIds: ['msdHousehold', 'rspcaEnvironment'] },
  { id: 'environment-title', at: .70, kicker: '09 · MI AMBIENTE', title: 'La misma habitación cambia', copy: 'Luz, aire y calma dan ritmo al día sin reconstruir el hogar.', sourceIds: ['aavBasic'] },
  { id: 'morning', at: .735, kicker: 'MAÑANA', title: 'Luz para despertar', copy: 'Los periquitos son diurnos: su ambiente debe distinguir el día de la noche.', sourceIds: ['aavBasic', 'aavSleep'] },
  { id: 'sun-shade', at: .775, kicker: 'LUZ EXTERIOR', title: 'Siempre con una zona de sombra', copy: 'El vidrio filtra UV útil y puede acumular calor; la exposición exterior debe ser segura y supervisada.', sourceIds: ['aavUv', 'msdHome'] },
  { id: 'temperature', at: .815, kicker: 'TEMPERATURA', title: 'Estable, sin cambios bruscos', copy: 'Una temperatura cómoda para ti suele servir si está sano. Evita extremos y chorros directos.', sourceIds: ['aavBasic', 'msdHome'] },
  { id: 'air-draft', at: .85, kicker: 'VENTILACIÓN', title: 'Aire fresco, sin contaminación', copy: 'Ventila bien, pero desvía salidas directas de calefacción o aire acondicionado.', sourceIds: ['aavBasic', 'msdHome'] },
  { id: 'evening', at: .885, kicker: 'TARDE', title: 'Baja el ritmo', copy: 'La luz desciende y la actividad de casa empieza a calmarse.', sourceIds: ['aavSleep'] },
  { id: 'night', at: .90, kicker: 'NOCHE', title: 'Oscura y tranquila', copy: 'Luces, televisión y ruido pueden interrumpir un descanso que debe sentirse como noche.', sourceIds: ['aavBasic', 'aavSleep'] },
  { id: 'sleep', at: .93, kicker: 'DESCANSO', title: 'Un tramo largo sin interrupciones', copy: 'Como guía habitual, la mayoría de las aves descansa mejor con 10–12 horas de sueño nocturno.', sourceIds: ['aavBasic', 'aavSleep'] },
  { id: 'language-exit', at: .96, kicker: '10 · APRENDE MI LENGUAJE', title: 'Al despertar, su cuerpo vuelve a hablar', copy: 'Postura, plumas, mirada y voz serán las pistas del siguiente capítulo.', sourceIds: [] },
];

export const domesticSafetyDisclaimer = 'Si hubo exposición a humo o vapores, o aparece dificultad respiratoria, busca atención veterinaria aviar inmediata.';

export const phaseGBeats: CareBeat[] = [
  { id: 'language-bridge', at: 0, kicker: 'TRANSICIÓN', title: 'La habitación despierta', copy: 'El amanecer conserva el mismo encuadre. Ahora BUD-HERO ocupa toda tu atención.', sourceIds: [] },
  { id: 'language-title', at: .075, kicker: '10 · APRENDE MI LENGUAJE', title: 'Su cuerpo también habla', copy: 'Voz, plumas, postura y mirada se entienden mejor cuando las lees juntas.', sourceIds: ['aavWelfare'] },
  { id: 'baseline', at: .13, kicker: 'PRIMERA PISTA', title: 'Empieza por su normal', copy: 'Conoce su rutina antes de interpretar un cambio: cada periquito tiene su propio ritmo.', sourceIds: ['msdBirdIllness', 'vcaBirdIllness'] },
  { id: 'vocalization', at: .185, kicker: 'NORMAL · VOZ', title: 'Cantar mantiene el contacto', copy: 'Trinos, charla y llamadas forman parte de su vida social, sobre todo al amanecer y al atardecer.', sourceIds: ['aavVocalization'] },
  { id: 'preening', at: .225, kicker: 'NORMAL · PLUMAS', title: 'Acicalarse es cuidarse', copy: 'Con el pico limpia y acomoda cada pluma. Es una conducta natural y necesaria.', sourceIds: ['aavPreening'] },
  { id: 'foraging', at: .28, kicker: 'NORMAL · EXPLORA', title: 'El pico también investiga', copy: 'Buscar alimento, pelar y manipular objetos seguros mantiene activo su cuerpo y su mente.', sourceIds: ['aavForaging'] },
  { id: 'curiosity', at: .335, kicker: 'NORMAL · MIRADA', title: 'La atención tiene un destino', copy: 'Inclinar la cabeza, trepar y examinar algo nuevo son formas de conocer su entorno.', sourceIds: ['aavPrey', 'rspcaEnrichment'] },
  { id: 'molt', at: .39, kicker: 'OBSERVA · MUDA', title: 'Las plumas cambian poco a poco', copy: 'Una muda normal es gradual, deja plumas enteras y no descubre zonas de piel.', sourceIds: ['msdFeathers'] },
  { id: 'fluffed', at: .445, kicker: 'OBSERVA · DURACIÓN', title: 'Un instante no es lo mismo que horas', copy: 'Esponjarse brevemente puede acompañar descanso o frío. Si persiste junto con apatía, importa.', sourceIds: ['msdBirdIllness', 'aavSigns'] },
  { id: 'boundary', at: .5, kicker: 'OBSERVA · ESPACIO', title: 'Apartarse también habla', copy: 'Inclinarse lejos, intentar escapar o tensar el cuerpo pide distancia. Detente y deja que decida.', sourceIds: ['aavWelfare'] },
  { id: 'aggression', at: .555, kicker: 'OBSERVA · LÍMITE', title: 'Una mordida es información', copy: 'Puede expresar miedo, defensa o territorialidad. Busca el desencadenante; no castigues ni fuerces contacto.', sourceIds: ['aavWelfare', 'aavPrey'] },
  { id: 'regurgitation', at: .61, kicker: 'OBSERVA · CONTEXTO', title: '¿Cortejo o malestar?', copy: 'Ofrecer alimento de forma dirigida puede ser cortejo. Un episodio descontrolado o repetido necesita valoración.', sourceIds: ['vcaSexualBehavior'] },
  { id: 'attention', at: .665, kicker: 'ATENCIÓN', title: 'El conjunto cambia la urgencia', copy: 'Vómito, debilidad, dificultad respiratoria, sangrado o incapacidad para posarse requieren ayuda veterinaria.', sourceIds: ['vcaBirdIllness', 'msdBirdIllness'] },
  { id: 'change', at: .72, kicker: 'ATENCIÓN · SU NORMAL', title: 'El cambio repentino importa', copy: 'Menos voz, más sueño, menos actividad o pérdida de interés pueden aparecer antes de que el problema sea evidente.', sourceIds: ['aavSigns', 'msdBirdIllness'] },
  { id: 'context', at: .775, kicker: 'LEE EL PATRÓN', title: 'Contexto, duración y cambio', copy: 'Observa, compara y responde. Una conducta aislada no es un diagnóstico.', sourceIds: ['aavWelfare', 'msdBirdIllness'] },
  { id: 'flock-morph', at: .83, kicker: 'YA SABES MIRAR', title: 'Las pistas forman una historia', copy: 'Los puntos se desprenden de BUD-HERO y vuelven a convertirse en bandada.', sourceIds: [] },
  { id: 'australia-return', at: .87, kicker: 'REGRESO', title: 'BUD-HERO vuelve al horizonte', copy: 'Se aleja hacia la bandada y el paisaje que abrió la película. El círculo se cierra despacio.', sourceIds: [] },
  { id: 'finale', at: .965, kicker: 'FIN · EL PRINCIPIO', title: 'Aprender a entenderlo', copy: 'Observar, respetar y responder también son formas de cuidado.', sourceIds: [] },
];

export const behaviorSafetyDisclaimer = 'Esta guía orienta, no diagnostica. Dificultad respiratoria, sangrado activo, debilidad intensa, incapacidad para posarse o posible ingestión de tóxicos requieren atención veterinaria urgente.';
