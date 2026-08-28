export type ExplorePhase = 'intro' | 'c' | 'd' | 'e' | 'f' | 'g';

export type ExploreChapter = {
  number: number;
  title: string;
  phase: ExplorePhase;
  beatId: string;
  progress: number;
};

export const exploreChapters: ExploreChapter[] = [
  { number: 1, title: 'Conóceme', phase: 'intro', beatId: 'conoceme', progress: .522 },
  { number: 2, title: 'Mi hogar', phase: 'c', beatId: 'home', progress: .063 },
  { number: 3, title: 'Juega conmigo', phase: 'c', beatId: 'toys', progress: .663 },
  { number: 4, title: 'Lo que como', phase: 'd', beatId: 'food-title', progress: .063 },
  { number: 5, title: 'Mi espacio limpio', phase: 'd', beatId: 'clean-title', progress: .741 },
  { number: 6, title: '¿Estoy bien?', phase: 'e', beatId: 'health-title', progress: .062 },
  { number: 7, title: 'Confía en mí', phase: 'e', beatId: 'trust-title', progress: .611 },
  { number: 8, title: 'Déjame explorar', phase: 'f', beatId: 'explore-title', progress: .055 },
  { number: 9, title: 'Mi ambiente', phase: 'f', beatId: 'environment-title', progress: .708 },
  { number: 10, title: 'Aprende mi lenguaje', phase: 'g', beatId: 'language-title', progress: .087 },
];

export function chapterForProgress(phase: ExplorePhase, progress: number) {
  if (phase === 'intro') return progress < .49 ? 0 : progress < .80 ? 1 : 2;
  if (phase === 'c') return progress < .65 ? 2 : 3;
  if (phase === 'd') return progress < .73 ? 4 : 5;
  if (phase === 'e') return progress < .60 ? 6 : 7;
  if (phase === 'f') return progress < .70 ? 8 : 9;
  return 10;
}
