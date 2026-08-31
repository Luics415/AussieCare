'use client';
/* eslint-disable @next/next/no-img-element -- Cinematic layers require direct alpha-preserving raster elements. */

import { useEffect, useRef, type CSSProperties } from 'react';
import { healthDisclaimer, phaseEBeats } from './content';
import { useSceneProgress } from './use-scene-progress';
import { withBasePath } from './base-path';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));
const windowed = (progress: number, start: number, end: number) => range(progress, start, start + .014) * (1 - range(progress, end - .014, end));

type PhaseEProps = {
  onProgress: (progress: number) => void;
  onBeatChange: (beatIndex: number) => void;
  onSceneState: (state: 'before' | 'active' | 'after') => void;
};

export default function PhaseE({ onProgress, onBeatChange, onSceneState }: PhaseEProps) {
  const lastBeatRef = useRef(0);
  const { sectionRef, progress, sceneState } = useSceneProgress({ onProgress, onSceneState });

  let beatIndex = 0;
  for (let index = 1; index < phaseEBeats.length; index += 1) {
    if (progress >= phaseEBeats[index].at) beatIndex = index;
  }
  const beat = phaseEBeats[beatIndex];
  const beatEnd = phaseEBeats[beatIndex + 1]?.at ?? 1;
  const beatReadProgress = range(progress, beat.at, beatEnd);

  useEffect(() => {
    const previous = lastBeatRef.current;
    if (beatIndex === previous) return;
    lastBeatRef.current = beatIndex;
    if (beatIndex > previous) onBeatChange(beatIndex);
  }, [beatIndex, onBeatChange]);

  const healthScene = 1 - range(progress, .585, .62);
  const trustScene = range(progress, .575, .625);
  const firstFluffed = windowed(progress, .30, .375);
  const urgentFluffed = windowed(progress, .415, .505);
  const fluffed = Math.max(firstFluffed, urgentFluffed) * healthScene;
  const healthy = (1 - Math.max(firstFluffed, urgentFluffed)) * healthScene;
  const healthZoom = range(progress, .34, .43) * (1 - range(progress, .52, .585));
  const entryBars = 1 - range(progress, 0, .055);
  const faceLens = windowed(progress, .36, .435);
  const breathing = windowed(progress, .415, .49);
  const emergency = windowed(progress, .475, .535);
  const vetRing = windowed(progress, .515, .61);
  const breathPhase = range(progress, .435, .49);
  const breathPulse = (1 - Math.cos(breathPhase * Math.PI * 2)) / 2;

  const handApproach = range(progress, .65, .675) * (1 - range(progress, .70, .722));
  const birdRetreat = range(progress, .665, .70) * (1 - range(progress, .70, .722));
  const reward = range(progress, .710, .735) * (1 - range(progress, .81, .835));
  const target = range(progress, .75, .765) * (1 - range(progress, .81, .835));
  const positiveApproach = range(progress, .765, .80);
  const stepUp = range(progress, .805, .845) * (1 - range(progress, .92, .95));
  const approachScene = (1 - range(progress, .805, .845)) * (1 - range(progress, .935, .97));
  const flight = range(progress, .94, .99);

  const tone = beatIndex <= 3 ? 'normal' : beatIndex <= 7 ? 'observe' : beatIndex <= 10 ? 'act' : 'trust';

  return (
    <section className="phasee-experience" id="phase-e" ref={sectionRef} aria-label="Fase E: ¿Estoy bien? y Confía en mí">
      <div className="phasee-stage" inert={sceneState !== 'active'} aria-hidden={sceneState !== 'active'}>
        <div className="phasee-health-scene" aria-hidden="true" style={{ opacity: healthScene }}>
          <img className="phasee-room" src={withBasePath('/assets/room-base-empty-v3.webp')} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div className="phasee-health-grade" />

          <img
            className="phasee-health-bud phasee-health-bud-normal"
            src={withBasePath('/assets/bud-hero-perched-v3.webp')}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            style={{ opacity: healthy * (1 - vetRing * .92) * (1 - emergency), transform: `scale(${1 + healthZoom * .07}) translateY(${healthZoom * -1.2}%)` }}
          />
          <img
            className="phasee-health-bud phasee-health-bud-fluffed"
            src={withBasePath('/assets/bud-hero-fluffed-scene-v2.webp')}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            style={{ opacity: fluffed * (1 - vetRing * .92) * (1 - emergency), transform: `scale(${1.015 + healthZoom * .055}) translateY(${healthZoom * -1}%)` }}
          />

          <div className="phasee-entry-bars" aria-hidden="true" style={{ opacity: entryBars }} />

          <div className="health-baseline" aria-hidden="true" style={{ opacity: windowed(progress, .085, .215), transform: `translate(-50%, -50%) scale(${.86 + range(progress, .085, .16) * .14})` }}>
            <i /><i /><i /><i /><i /><i />
          </div>

          <div className="health-metric" aria-hidden="true" style={{ opacity: windowed(progress, .13, .27) }}>
            <i style={{ height: `${42 + range(progress, .13, .27) * 31}%` }} />
            <b>{beatIndex <= 3 ? 'SU NORMAL' : 'CAMBIO'}</b>
            <span>{beatIndex <= 2 ? 'POSTURA' : beatIndex === 3 ? 'ACTIVIDAD · VOZ' : 'MÁS QUIETO'}</span>
          </div>

          <div className="health-appetite" aria-hidden="true" style={{ opacity: windowed(progress, .245, .325), transform: `translate(-50%, -50%) scale(${.9 + range(progress, .245, .325) * .1})` }}>
            <div className="health-log-head"><b>7 DÍAS</b><span>REGISTRA EL CAMBIO</span></div>
            <div className="health-log-chart"><i /><i /><i /><i /><i /><i /><i /></div>
            <small>PESO · APETITO · HECES</small>
          </div>

          <div className="health-face-lens" aria-hidden="true" style={{ opacity: faceLens, transform: `translate(-50%, -50%) scale(${.82 + range(progress, .36, .435) * .18})` }}>
            <i /><b>OJOS · NARINAS</b>
          </div>

          <div className="health-breathing" aria-hidden="true" style={{ opacity: breathing }}>
            <i style={{ transform: `scale(${.84 + breathPulse * .24})` }} /><i style={{ transform: `scale(${.95 - breathPulse * .16})` }} />
            <b>{breathPhase < .5 ? 'INHALA' : 'EXHALA'}</b><span>OBSERVA EL ESFUERZO</span>
          </div>

          <div className="health-emergency" aria-hidden="true" style={{ opacity: emergency }}>
            <img className="health-emergency-bud" src={withBasePath('/assets/bud-hero-urgent-v1.webp')} alt="" loading="lazy" decoding="async" style={{ transform: `translateY(${(1 - emergency) * -9}px) rotate(${range(progress, .49, .525) * 4}deg)` }} /><b>URGENTE</b><span>NO PUEDE POSARSE</span>
          </div>

          <div className="health-vet-card" aria-hidden="true" style={{ opacity: vetRing, transform: `translate(-50%, -50%) scale(${.88 + range(progress, .515, .61) * .12})` }}>
            <img src={withBasePath('/assets/avian-vet-clinic-v2.webp')} alt="" loading="lazy" decoding="async" />
            <div><small>VETERINARIO AVIAR</small><b>Describe el cambio</b><span>Qué cambió · desde cuándo · cuánto come · cómo respira</span></div>
          </div>
        </div>

        <div className="phasee-trust-scene" aria-hidden="true" style={{ opacity: trustScene }}>
          <img className="phasee-trust-room" src={withBasePath('/assets/room-base-empty-v3.webp')} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <img className="phasee-trust-perch" src={withBasePath('/assets/natural-perch-v1.webp')} alt="" loading="lazy" decoding="async" style={{ opacity: approachScene }} />
          <img className="phasee-trust-bud" src={withBasePath('/assets/bud-hero-curious-v1.webp')} alt="" loading="lazy" decoding="async" style={{ opacity: approachScene, transform: `translate3d(${birdRetreat * 18 - positiveApproach * 24}%, 0, 0)` }} />
          <img className="phasee-trust-hand" src={withBasePath('/assets/trust-hand-v1.webp')} alt="" loading="lazy" decoding="async" style={{ opacity: approachScene, transform: `translate3d(${handApproach * 19}%, 0, 0)` }} />
          <div className="phasee-trust-grade" />

          <div className="trust-distance" aria-hidden="true" style={{ opacity: windowed(progress, .59, .715) }}><i /><span>DISTANCIA CÓMODA</span></div>
          <img className="trust-reward-real" src={withBasePath('/assets/millet-reward-v1.webp')} alt="" loading="lazy" decoding="async" style={{ opacity: reward, transform: `translateY(${(1 - reward) * -14}px) scale(${.82 + reward * .18})` }} />
          <div className="trust-invitation" aria-hidden="true" style={{ opacity: target }}><i /><b>INVITACIÓN</b><span>ELIGE ACERCARSE</span></div>

          <img
            className="phasee-step-up"
            src={withBasePath('/assets/bud-hero-step-up-scene-v2.webp')}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            style={{ opacity: stepUp, transform: `scale(${1.07 - range(progress, .805, .92) * .045}) translateY(${(1 - stepUp) * 2}%)` }}
          />
          <div className="trust-step-line" aria-hidden="true" style={{ opacity: stepUp * (1 - flight) }}><i style={{ width: `${range(progress, .82, .9) * 100}%` }} /><span>PIE → PESO → DOS PIES</span></div>

          <img
            className="phasee-flight"
            src={withBasePath('/assets/bud-hero-flight-v2.webp')}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            style={{ opacity: flight, transform: `translate3d(${(1 - flight) * 18}%, ${flight * -5}%, 0) scale(${.86 + flight * .18}) rotate(${(1 - flight) * 5}deg)` }}
          />
          <div className="trust-flight-path" aria-hidden="true" style={{ opacity: flight }}><i /><i /><i /></div>
        </div>

        <div className="phasec-reading phasee-reading" data-tone={tone} role="status" aria-live="polite" aria-atomic="true">
          <span>{beat.kicker}</span>
          <h2>{beat.title}</h2>
          <p>{beat.copy}</p>
          <small>Lee a tu ritmo · desliza cuando termines</small>
          {beat.id === 'health-vet' && <small className="phasee-disclaimer">{healthDisclaimer}</small>}
          <i><b style={{ width: `${20 + beatReadProgress * 80}%` }} /></i>
        </div>

        <div className="phasec-rail phasee-rail" aria-label={`Momento ${beatIndex + 1} de ${phaseEBeats.length}: ${beat.title}`}>
          <i style={{ height: `${progress * 100}%` }} />
          {phaseEBeats.map((item, index) => (
            <span key={item.id} className={index === beatIndex ? 'active' : ''} style={{ top: `${item.at * 100}%` } as CSSProperties}>
              <b>{String(index + 1).padStart(2, '0')}</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
