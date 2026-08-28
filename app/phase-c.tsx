'use client';
/* eslint-disable @next/next/no-img-element -- Cinematic layers require direct alpha-preserving raster elements. */

import { useEffect, useRef, type CSSProperties } from 'react';
import { phaseCBeats } from './content';
import { useSceneProgress } from './use-scene-progress';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));

type PhaseCProps = {
  onProgress: (progress: number) => void;
  onBeatChange: (beatIndex: number) => void;
};

export default function PhaseC({ onProgress, onBeatChange }: PhaseCProps) {
  const lastBeatRef = useRef(0);
  const { sectionRef, progress, sceneState } = useSceneProgress({ onProgress });

  let beatIndex = 0;
  for (let index = 1; index < phaseCBeats.length; index += 1) {
    if (progress >= phaseCBeats[index].at) beatIndex = index;
  }
  const beat = phaseCBeats[beatIndex];
  const beatEnd = phaseCBeats[beatIndex + 1]?.at ?? 1;
  const beatReadProgress = range(progress, beat.at, beatEnd);

  useEffect(() => {
    const previous = lastBeatRef.current;
    if (beatIndex === previous) return;
    lastBeatRef.current = beatIndex;
    if (beatIndex > previous) onBeatChange(beatIndex);
  }, [beatIndex, onBeatChange]);

  const frame = range(progress, .11, .17);
  const base = range(progress, .17, .24);
  const structure = range(progress, .24, .31);
  const door = range(progress, .31, .38);
  const perches = range(progress, .38, .45);
  const perchDetailOpacity = .82 * range(progress, .38, .392) * (1 - range(progress, .43, .445));
  const bowls = range(progress, .435, .451) * (1 - range(progress, .519, .535));
  const ready = range(progress, .52, .58);
  const toys = range(progress, .63, .69);
  const ropeRisk = range(progress, .855, .884);
  const mirrorObserve = range(progress, .91, .946);
  const foodExit = range(progress, .95, 1);
  const cageOpacity = 1 - range(progress, .59, .655);
  const toyFocusTop = beat.id === 'foraging' ? 19 : beat.id === 'wood' ? 34 : beat.id === 'rope' ? 50 : beat.id === 'mirror' ? 62 : 19;
  const toyFocusVisible = ['foraging', 'wood', 'rope', 'mirror'].includes(beat.id) ? 1 : 0;

  return (
    <section className="phasec-experience" id="phase-c" ref={sectionRef} aria-label="Fase C: Mi hogar y Juega conmigo">
      <div className="phasec-stage" inert={sceneState !== 'active'} aria-hidden={sceneState !== 'active'}>
        <div className="phasec-room" aria-hidden="true" style={{ opacity: 1 - range(progress, .61, .7) }}>
          <img
            src="/assets/room-base-empty-v3.webp"
            alt="ROOM-BASE, la habitación modular donde se prepara el hogar de Jett"
            loading="lazy"
            decoding="async"
            style={{ transform: `scale(${1.06 + range(progress, 0, .55) * .06}) translateX(${range(progress, 0, .55) * -1.4}%)` }}
          />
          <div className="phasec-room-grade" style={{ opacity: .22 + range(progress, .04, .16) * .42 }} />
        </div>

        <div className="phasec-cage-scene" aria-hidden="true" style={{ opacity: cageOpacity }}>
          <p className="phasec-room-id">ROOM-BASE · ZONA SEGURA</p>
          <div className="cage-real" aria-label="Jaula realista preparada paso a paso">
            <img className="cage-product" src="/assets/aussiecare-cage-v1.webp" alt="" loading="lazy" decoding="async" style={{ opacity: 1, transform: `scale(${1.025 - frame * .025})` }} />
            <div className="cage-feature cage-feature-width" style={{ opacity: structure }}><i /><span>RUTA HORIZONTAL</span></div>
            <div className="cage-feature cage-feature-tray" style={{ opacity: base }}><i /><span>BANDEJA</span></div>
            <div className="cage-feature cage-feature-door" style={{ opacity: door }}><i /><span>CIERRE</span></div>
            <div className="cage-feature cage-feature-perches" style={{ opacity: perches }}><i /><span>RAMAS NATURALES</span></div>
            <div className="cage-feature cage-feature-bowls" style={{ opacity: bowls }}><i /><span>RECIPIENTES</span></div>
            <img className="cage-natural-perch-detail" src="/assets/natural-perch-v1.webp" alt="" loading="lazy" decoding="async" style={{ opacity: perchDetailOpacity }} />
            <img className="cage-bud" src="/assets/bud-hero-perched-v3.webp" alt="" loading="lazy" decoding="async" style={{ opacity: ready, transform: `translateY(${(1 - ready) * -20}px) scale(${.58 + ready * .08})` }} />
          </div>
          <div className="cage-airway" style={{ opacity: ready }}><span>centro libre para moverse</span></div>
        </div>

        <div className="phasec-toy-scene" aria-hidden="true" style={{ opacity: toys }}>
          <img className="phasec-enrichment-board" src="/assets/enrichment-board-v2.webp" alt="Objetos realistas de forrajeo, madera, cuerda y espejo" loading="lazy" decoding="async" style={{ opacity: 1 - foodExit, transform: `scale(${1.018 + toys * .018}) translateY(${foodExit * -2}%)` }} />
          <div className="toy-real-focus" data-warning={ropeRisk > .45 ? 'true' : 'false'} data-mirror={beat.id === 'mirror' ? 'true' : 'false'} style={{ opacity: toyFocusVisible * (1 - foodExit), top: `${toyFocusTop}%` }}><i /><b>{beat.id === 'rope' && ropeRisk > .45 ? 'REVISA LAS FIBRAS' : 'OBJETO SEGURO'}</b></div>
          <div className="toy-mirror-note" style={{ opacity: beat.id === 'mirror' ? mirrorObserve : 0 }}>OBSERVA SU RESPUESTA · NO SUSTITUYE COMPAÑÍA</div>

          <div className="food-bowl-transition" role="img" aria-label="Cuenco que prepara el capítulo de alimentación" style={{ opacity: foodExit, transform: `translate(-50%, -50%) scale(${.66 + foodExit * .34})` }}>
            <i /><i /><i /><i /><i /><b />
          </div>
        </div>

        <div className="phasec-reading" data-warning={beat.id === 'rope'}>
          <span>{beat.kicker}</span>
          <h2>{beat.title}</h2>
          <p>{beat.copy}</p>
          <small>Lee a tu ritmo · desliza cuando termines</small>
          <i><b style={{ width: `${20 + beatReadProgress * 80}%` }} /></i>
        </div>

        <div className="phasec-rail" aria-label={`Momento ${beatIndex + 1} de ${phaseCBeats.length}: ${beat.title}`}>
          <i style={{ height: `${progress * 100}%` }} />
          {phaseCBeats.map((item, index) => (
            <span key={item.id} className={index === beatIndex ? 'active' : ''} style={{ top: `${item.at * 100}%` } as CSSProperties}>
              <b>{String(index + 1).padStart(2, '0')}</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
