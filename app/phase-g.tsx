'use client';
/* eslint-disable @next/next/no-img-element -- Cinematic layers require direct alpha-preserving raster elements. */

import { useEffect, useRef, type CSSProperties } from 'react';
import { behaviorSafetyDisclaimer, phaseGBeats } from './content';
import { useSceneProgress, type SceneState } from './use-scene-progress';
import AussieCareSignature from './aussiecare-signature';
import { withBasePath } from './base-path';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));

type BehaviorPose = 'singing' | 'preening' | 'foraging' | 'curious';
type Clue = 'voice' | 'feathers' | 'posture' | 'gaze' | 'context';

type PhaseGProps = {
  onProgress: (progress: number) => void;
  onBeatChange: (beatIndex: number) => void;
  onSceneState: (state: SceneState) => void;
  onRestart: () => void;
  onOpenConsult: () => void;
};

const CLUES: { id: Clue; label: string; x: number; y: number }[] = [
  { id: 'voice', label: 'VOZ', x: 18, y: 27 },
  { id: 'feathers', label: 'PLUMAS', x: 75, y: 20 },
  { id: 'posture', label: 'POSTURA', x: 78, y: 63 },
  { id: 'gaze', label: 'MIRADA', x: 17, y: 66 },
  { id: 'context', label: 'CONTEXTO', x: 50, y: 83 },
];

const BEAT_CLUE: Record<string, Clue> = {
  vocalization: 'voice',
  preening: 'feathers',
  foraging: 'gaze',
  curiosity: 'gaze',
  molt: 'feathers',
  fluffed: 'feathers',
  boundary: 'posture',
  aggression: 'posture',
  regurgitation: 'context',
  attention: 'context',
  change: 'context',
  context: 'context',
};

const BEAT_POSE: Partial<Record<string, BehaviorPose>> = {
  vocalization: 'singing',
  preening: 'preening',
  foraging: 'foraging',
  curiosity: 'curious',
  molt: 'preening',
  boundary: 'curious',
};

const BEAT_WORD: Record<string, string> = {
  baseline: 'RUTINA',
  vocalization: 'VOZ',
  preening: 'CALMA',
  foraging: 'EXPLORA',
  curiosity: 'CURIOSIDAD',
  molt: 'MUDA',
  fluffed: 'PLUMAS',
  boundary: 'ESPACIO',
  aggression: 'LÍMITE',
  regurgitation: 'CONTEXTO',
  attention: 'CAMBIO',
  change: 'CONJUNTO',
  context: 'COMPRENDER',
};

const POSE_LABEL: Record<BehaviorPose, string> = {
  singing: 'Jett vocalizando',
  preening: 'Jett acicalando sus plumas',
  foraging: 'Jett buscando alimento',
  curious: 'Jett observando con curiosidad',
};

const POSE_ASSET: Record<BehaviorPose, string> = {
  singing: withBasePath('/assets/bud-hero-singing-v1.webp'),
  preening: withBasePath('/assets/bud-hero-preening-v1.webp'),
  foraging: withBasePath('/assets/bud-hero-foraging-v1.webp'),
  curious: withBasePath('/assets/bud-hero-curious-v1.webp'),
};

function BehaviorSprite({ pose, style }: { pose: BehaviorPose; style?: CSSProperties }) {
  return (
    <img
      className={`phaseg-behavior-sprite pose-${pose}`}
      style={style}
      src={POSE_ASSET[pose]}
      alt={POSE_LABEL[pose]}
      loading="lazy"
      decoding="async"
    />
  );
}

export default function PhaseG({ onProgress, onBeatChange, onSceneState, onRestart, onOpenConsult }: PhaseGProps) {
  const lastBeatRef = useRef(0);
  const { sectionRef, progress, sceneState } = useSceneProgress({ onProgress, onSceneState });

  let beatIndex = 0;
  for (let index = 1; index < phaseGBeats.length; index += 1) {
    if (progress >= phaseGBeats[index].at) beatIndex = index;
  }
  const beat = phaseGBeats[beatIndex];
  const beatEnd = phaseGBeats[beatIndex + 1]?.at ?? 1;
  const beatReadProgress = range(progress, beat.at, beatEnd);

  useEffect(() => {
    const previous = lastBeatRef.current;
    if (beatIndex === previous) return;
    lastBeatRef.current = beatIndex;
    if (beatIndex > previous) onBeatChange(beatIndex);
  }, [beatIndex, onBeatChange]);

  const roomExit = range(progress, .025, .13);
  const constellationIn = range(progress, .09, .16) * (1 - range(progress, .80, .855));
  const behaviorIn = range(progress, .11, .17) * (1 - range(progress, .79, .85));
  const flockMorph = range(progress, .79, .855);
  const australiaIn = range(progress, .825, .875);
  const returnIn = range(progress, .85, .895);
  const finaleIn = range(progress, .955, .97);
  const activeClue = BEAT_CLUE[beat.id] ?? null;
  const pose = BEAT_POSE[beat.id];
  const useFluffed = beat.id === 'fluffed';
  const usePerched = !pose && !useFluffed;
  const category = beatIndex >= 12 && beatIndex <= 13 ? 'attention' : beatIndex >= 7 && beatIndex <= 11 ? 'observe' : beatIndex >= 3 && beatIndex <= 6 ? 'normal' : 'neutral';
  const lineDraw = 210 - constellationIn * 210;
  const isFinale = beat.id === 'finale';
  const isMolt = beat.id === 'molt';

  return (
    <section className="phaseg-experience" id="phase-g" ref={sectionRef} aria-label="Fase G: Aprende mi lenguaje y cierre">
      <div className="phaseg-stage" data-category={category} data-expanded={beat.id === 'attention' ? 'true' : 'false'} inert={sceneState !== 'active'} aria-hidden={sceneState !== 'active'}>
        <div className="phaseg-room-layer" style={{ opacity: 1 - roomExit }} aria-hidden="true">
          <img src={withBasePath('/assets/room-base-empty-v3.webp')} alt="" loading="lazy" decoding="async" />
          <i />
        </div>
        <div className="phaseg-ink" style={{ opacity: roomExit * (1 - australiaIn) }} aria-hidden="true" />
        <div className="phaseg-australia" style={{ opacity: australiaIn }} aria-hidden="true">
          <img src={withBasePath('/assets/australia-master.webp')} alt="" loading="lazy" decoding="async" style={{ transform: `scale(${1.12 - australiaIn * .06}) translateY(${(1 - australiaIn) * 2}%)` }} />
          <i />
        </div>
        <div className="phaseg-return-scene" style={{ opacity: returnIn }} aria-hidden="true">
          <img src={withBasePath('/assets/bud-hero-return-australia-v2.webp')} alt="" loading="lazy" decoding="async" style={{ transform: `scale(${1.08 - returnIn * .08})` }} />
          <i />
        </div>

        <div className="phaseg-constellation" data-active-node={activeClue ?? 'none'} style={{ opacity: constellationIn }} aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M18 27 L50 47 L75 20 M50 47 L78 63 M50 47 L17 66 M17 66 L50 83 L78 63" style={{ strokeDashoffset: lineDraw }} />
            <circle cx="50" cy="47" r="18" style={{ strokeDashoffset: lineDraw * .65 }} />
          </svg>
          {CLUES.map((clue) => <span key={clue.id} data-node={clue.id} style={{ left: `${clue.x}%`, top: `${clue.y}%` }}>{clue.label}<i /></span>)}
        </div>

        <div className="phaseg-word" style={{ opacity: behaviorIn * .13 }} aria-hidden="true">{BEAT_WORD[beat.id] ?? 'LENGUAJE'}</div>

        <div className="phaseg-bird-field" aria-hidden="true" style={{ opacity: behaviorIn, transform: `translate3d(0, ${(1 - behaviorIn) * 2.5}%, 0) scale(${1 - flockMorph * .16})` }}>
          {pose ? <BehaviorSprite pose={pose} /> : null}
          {useFluffed ? <img className="phaseg-fluffed-bud" src={withBasePath('/assets/bud-hero-fluffed-scene-v2.webp')} alt="Jett con el plumaje esponjado" loading="lazy" decoding="async" /> : null}
          {usePerched ? <img className="phaseg-perched-bud" src={withBasePath('/assets/bud-hero-perched-v3.webp')} alt="Jett posado mientras se observa su lenguaje corporal" loading="lazy" decoding="async" /> : null}
          <div className="phaseg-feathers" data-visible={isMolt ? 'true' : 'false'} aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <i key={index} style={{ '--feather': index } as CSSProperties} />)}</div>
        </div>

        <div className="phaseg-flock-morph" style={{ opacity: flockMorph * (1 - finaleIn) }} aria-hidden="true">
          {Array.from({ length: 13 }, (_, index) => <i key={index} style={{ '--bird': index, '--flight': flockMorph } as CSSProperties} />)}
        </div>
        <img className="phaseg-flight-bud" src={withBasePath('/assets/bud-hero-flight-v2.webp')} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ opacity: range(progress, .805, .83) * (1 - range(progress, .855, .875)), transform: `translate3d(${(flockMorph - .5) * 74}vw, ${12 - flockMorph * 17}svh, 0) scale(${.68 - flockMorph * .2}) rotate(${5 - flockMorph * 14}deg)` }} />

        <div className="phaseg-categories" aria-label={`Categoría actual: ${category === 'neutral' ? 'contexto' : category}`}>
          <span data-level="normal" className={category === 'normal' ? 'active' : ''}>NORMAL</span>
          <i />
          <span data-level="observe" className={category === 'observe' ? 'active' : ''}>OBSERVA</span>
          <i />
          <span data-level="attention" className={category === 'attention' ? 'active' : ''}>ATENCIÓN</span>
        </div>

        {!isFinale ? (
          <div className="phasec-reading phaseg-reading" data-tone={category}>
            <span>{beat.kicker}</span>
            <h2>{beat.title}</h2>
            <p>{beat.copy}</p>
            <small>Parada de lectura · desliza cuando termines</small>
            {beat.id === 'attention' ? <small className="phaseg-disclaimer">{behaviorSafetyDisclaimer}</small> : null}
            <i><b style={{ width: `${20 + beatReadProgress * 80}%` }} /></i>
          </div>
        ) : null}

        <div className="phaseg-finale" style={{ opacity: finaleIn, pointerEvents: isFinale ? 'auto' : 'none' }}>
          <span>FIN · EL PRINCIPIO</span>
          <AussieCareSignature compact />
          <h2>Aprender a cuidarlo también es aprender a entenderlo.</h2>
          <p>Su historia empezó en Australia. La convivencia empieza cuando observas, respetas y respondes.</p>
          <div>
            <button type="button" onClick={onRestart}>VOLVER A EXPLORAR</button>
            <button type="button" onClick={onOpenConsult}>CONSULTAR LA GUÍA</button>
          </div>
          <small>La guía completa funciona sin conexión.</small>
        </div>

        <div className="phasec-rail phaseg-rail" role="progressbar" aria-valuemin={1} aria-valuemax={phaseGBeats.length} aria-valuenow={beatIndex + 1} aria-label={`Momento ${beatIndex + 1} de ${phaseGBeats.length}: ${beat.title}`}>
          <i style={{ height: `${progress * 100}%` }} />
          {phaseGBeats.map((item, index) => (
            <span key={item.id} className={index === beatIndex ? 'active' : ''} style={{ top: `${item.at * 100}%` } as CSSProperties}>
              <b>{String(index + 1).padStart(2, '0')}</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
