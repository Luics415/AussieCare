'use client';
/* eslint-disable @next/next/no-img-element -- Cinematic layers require direct alpha-preserving raster elements. */

import { useEffect, useRef, type CSSProperties } from 'react';
import { domesticSafetyDisclaimer, phaseFBeats } from './content';
import { useSceneProgress } from './use-scene-progress';
import { withBasePath } from './base-path';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));

const CAMERA: Record<string, { x: number; y: number; zoom: number }> = {
  window: { x: 8, y: 35, zoom: 1.08 },
  fan: { x: 50, y: 14, zoom: 1.08 },
  door: { x: 72, y: 34, zoom: 1.07 },
  plant: { x: 53, y: 41, zoom: 1.08 },
  water: { x: 88, y: 50, zoom: 1.1 },
  cables: { x: 79, y: 58, zoom: 1.08 },
  kitchen: { x: 92, y: 34, zoom: 1.08 },
  fumes: { x: 92, y: 34, zoom: 1.08 },
  aerosols: { x: 63, y: 43, zoom: 1.06 },
  'safe-landing': { x: 33, y: 40, zoom: 1.06 },
};

const HAZARD_IDS = new Set(['window', 'fan', 'door', 'plant', 'water', 'cables', 'kitchen', 'fumes', 'aerosols']);

type FocusSpec = {
  eyebrow: string;
  state: string;
  detail: string;
  x: number;
  y: number;
  tone: 'safe' | 'watch' | 'air';
  sprite?: [number, number];
};

const FOCUS_SPECS: Record<string, FocusSpec> = {
  window: { eyebrow: '01 / 09 · VENTANA', state: 'Cerrada', detail: 'Cristal visible', x: 34, y: 32, tone: 'safe', sprite: [0, 0] },
  fan: { eyebrow: '02 / 09 · TECHO', state: 'Apagado', detail: 'Aspas totalmente detenidas', x: 50, y: 19, tone: 'safe', sprite: [1, 0] },
  door: { eyebrow: '03 / 09 · SALIDA', state: 'Cerrada', detail: 'Paso bloqueado antes de volar', x: 68, y: 35, tone: 'safe', sprite: [2, 0] },
  plant: { eyebrow: '04 / 09 · PLANTAS', state: 'Por identificar', detail: 'Confirma la especie antes', x: 51, y: 45, tone: 'watch', sprite: [0, 1] },
  water: { eyebrow: '05 / 09 · AGUA', state: 'Abierta', detail: 'Tapa o vacía cada recipiente', x: 72, y: 53, tone: 'watch', sprite: [1, 1] },
  cables: { eyebrow: '06 / 09 · SUELO', state: 'Expuestos', detail: 'Recoge y bloquea el acceso', x: 63, y: 61, tone: 'watch', sprite: [2, 1] },
  kitchen: { eyebrow: '07 / 09 · COCINA', state: 'Activa', detail: 'Déjala fuera de la ruta de vuelo', x: 75, y: 36, tone: 'watch', sprite: [0, 2] },
  fumes: { eyebrow: '08 / 09 · AIRE', state: 'Vapores presentes', detail: 'Aleja al ave y ventila', x: 73, y: 35, tone: 'air', sprite: [1, 2] },
  aerosols: { eyebrow: '09 / 09 · AIRE', state: 'Pulverización', detail: 'Nada se rocía en la habitación', x: 58, y: 41, tone: 'air', sprite: [2, 2] },
  'safe-landing': { eyebrow: 'RUTA · REGRESO', state: 'Percha estable', detail: 'Un punto de llegada claro', x: 42, y: 54, tone: 'safe' },
};

type PhaseFProps = {
  onProgress: (progress: number) => void;
  onBeatChange: (beatIndex: number) => void;
  onSceneState: (state: 'before' | 'active' | 'after') => void;
};

type HazardVisualProps = {
  beatId: string;
  progress: number;
};

function HazardVisual({ beatId, progress }: HazardVisualProps) {
  if (beatId === 'explore-title' || beatId === 'preflight') {
    return (
      <div className="phasef-room-scan" aria-hidden="true">
        <svg viewBox="0 0 320 180">
          <path d="M18 128 C54 34 102 46 132 94 S214 166 300 48" />
          {[18, 78, 135, 199, 254, 300].map((x, index) => <circle key={x} cx={x} cy={[128, 63, 97, 133, 91, 48][index]} r="5" />)}
        </svg>
        <div><span>{beatId === 'explore-title' ? 'RUTA DE VUELO' : 'VUELTA DE SEGURIDAD'}</span><strong>{beatId === 'preflight' ? '9 puntos antes de abrir' : 'La habitación es el mapa'}</strong></div>
      </div>
    );
  }

  if (beatId === 'safe-landing') {
    return <div className="phasef-focus-copy phasef-landing-copy" aria-hidden="true"><small>RUTA · REGRESO</small><strong>Percha estable</strong><span>Un punto de llegada claro</span></div>;
  }

  if (beatId === 'room-ready' || (progress >= .625 && progress < .72)) {
    return <div className="phasef-room-ready" aria-hidden="true"><span>ROOM / READY</span><strong>La habitación ya puede respirar.</strong><div>{['CRISTAL', 'SALIDAS', 'AGUA', 'CABLES', 'AIRE', 'SUPERVISIÓN'].map(item => <i key={item}><b>✓</b>{item}</i>)}</div></div>;
  }

  const spec = FOCUS_SPECS[beatId];
  if (spec) {
    const index = phaseFBeats.findIndex((item) => item.id === beatId);
    const start = phaseFBeats[index]?.at ?? 0;
    const end = phaseFBeats[index + 1]?.at ?? 1;
    const resolved = range(progress, start, end);
    return (
      <div className={`phasef-room-focus is-${spec.tone}`} style={{ '--focus-x': `${spec.x}%`, '--focus-y': `${spec.y}%`, '--resolve': resolved } as CSSProperties} aria-hidden="true">
        <div className="phasef-focus-reticle">
          {spec.sprite ? <span className="phasef-hazard-icon" style={{ backgroundImage: `url(${withBasePath('/assets/room-hazards-v2.webp')})`, backgroundPosition: `${spec.sprite[0] * 50}% ${spec.sprite[1] * 50}%` }} /> : null}
          <i /><i /><b />
        </div>
        <div className="phasef-focus-copy"><small>{spec.eyebrow}</small><strong>{spec.state}</strong><span>{spec.detail}</span></div>
      </div>
    );
  }

  return <div className="phasef-resolved-trace" style={{ opacity: range(progress, .58, .64) }} aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} style={{ '--resolved': index } as CSSProperties} />)}</div>;
}

type EnvironmentVisualProps = {
  beatId: string;
  progress: number;
};

function EnvironmentVisual({ beatId, progress }: EnvironmentVisualProps) {
  if (beatId === 'environment-title' || beatId === 'morning') {
    const morningProgress = range(progress, .70, .775);
    return <div className="phasef-day-dial phasef-visual-card" aria-hidden="true"><svg viewBox="0 0 160 160"><defs><linearGradient id="dayArc" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#185aa8"/><stop offset=".48" stopColor="#36b7b4"/><stop offset="1" stopColor="#f4c84a"/></linearGradient></defs><circle className="day-dial-track" cx="80" cy="80" r="61"/><path className="day-dial-arc" d="M24 100 A61 61 0 0 1 136 100"/><g className="day-dial-hand" style={{ transform: `rotate(${-58 + morningProgress * 62}deg)`, transformOrigin: '80px 80px' }}><line x1="80" y1="80" x2="80" y2="35"/><circle cx="80" cy="31" r="7"/></g><circle className="day-dial-hub" cx="80" cy="80" r="5"/><text x="22" y="121">06</text><text x="73" y="18">09</text><text x="128" y="121">12</text></svg><span>AMANECER</span><span>MAÑANA</span><span>DÍA</span><strong>{beatId === 'morning' ? 'RUTINA DIURNA' : 'UN HOGAR · TRES ESTADOS'}</strong></div>;
  }
  if (beatId === 'sun-shade') {
    return <div className="phasef-sun-card phasef-visual-card" aria-hidden="true"><i /><b>LUZ</b><span>SOMBRA DISPONIBLE</span><small>EL VIDRIO NO REEMPLAZA EL EXTERIOR</small></div>;
  }
  if (beatId === 'temperature') {
    return <div className="phasef-temperature phasef-visual-card" aria-hidden="true"><i><b /></i><strong>ESTABLE</strong><span>SIN EXTREMOS</span><small>CAMBIOS LENTOS</small></div>;
  }
  if (beatId === 'air-draft') {
    const airflow = range(progress, .85, .885);
    return <div className="phasef-air phasef-visual-card" aria-hidden="true"><svg viewBox="0 0 220 150"><rect className="air-vent" x="8" y="28" width="28" height="92" rx="6"/><path pathLength="1" style={{ strokeDashoffset: 1 - airflow }} d="M35 48 C82 36 102 57 123 70 C145 84 166 79 198 57"/><path pathLength="1" style={{ strokeDashoffset: 1 - airflow }} d="M35 74 C76 68 93 88 117 100 C144 114 166 108 204 89"/><path pathLength="1" style={{ strokeDashoffset: 1 - airflow }} d="M35 99 C66 101 82 119 109 124 C140 130 169 118 201 109"/><circle className="air-safe-zone" cx="169" cy="73" r="34"/></svg><b>AIRE LIMPIO</b><span>FLUJO INDIRECTO</span></div>;
  }
  if (beatId === 'evening') {
    return <div className="phasef-evening-clock phasef-visual-card" aria-hidden="true"><i /><b>BAJA LA LUZ</b><span>BAJA LA ACTIVIDAD</span></div>;
  }
  if (beatId === 'night' || beatId === 'sleep') {
    return <div className="phasef-sleep-clock phasef-visual-card" aria-hidden="true"><div><i /><b /></div><strong>{beatId === 'sleep' ? '10–12 h' : 'NOCHE'}</strong><span>{beatId === 'sleep' ? 'GUÍA HABITUAL' : 'OSCURA · TRANQUILA'}</span></div>;
  }
  if (beatId === 'language-exit') {
    return <div className="phasef-language-cue phasef-visual-card" aria-hidden="true"><i /><i /><i /><b>POSTURA</b><b>PLUMAS</b><b>MIRADA</b></div>;
  }
  return <div className="phasef-environment-mark" style={{ opacity: range(progress, .65, .7) }} aria-hidden="true"><i /><span>ROOM-BASE / CICLO 24 H</span></div>;
}

export default function PhaseF({ onProgress, onBeatChange, onSceneState }: PhaseFProps) {
  const lastBeatRef = useRef(0);
  const { sectionRef, progress, sceneState } = useSceneProgress({ onProgress, onSceneState });

  let beatIndex = 0;
  for (let index = 1; index < phaseFBeats.length; index += 1) {
    if (progress >= phaseFBeats[index].at) beatIndex = index;
  }
  const beat = phaseFBeats[beatIndex];
  const beatEnd = phaseFBeats[beatIndex + 1]?.at ?? 1;
  const beatReadProgress = range(progress, beat.at, beatEnd);

  useEffect(() => {
    const previous = lastBeatRef.current;
    if (beatIndex === previous) return;
    lastBeatRef.current = beatIndex;
    if (beatIndex > previous) onBeatChange(beatIndex);
  }, [beatIndex, onBeatChange]);

  const cameraStart = CAMERA[beat.id] ?? { x: 50, y: 42, zoom: 1.02 };
  const cameraEnd = CAMERA[phaseFBeats[beatIndex + 1]?.id] ?? cameraStart;
  const cameraTravel = range(beatReadProgress, .68, 1);
  const camera = {
    x: cameraStart.x + (cameraEnd.x - cameraStart.x) * cameraTravel,
    y: cameraStart.y + (cameraEnd.y - cameraStart.y) * cameraTravel,
    zoom: cameraStart.zoom + (cameraEnd.zoom - cameraStart.zoom) * cameraTravel,
  };
  const hazardChapter = 1 - range(progress, .69, .72);
  const environmentChapter = range(progress, .685, .72);
  const flightEntry = 1 - range(progress, .035, .105);
  const safeFlight = range(progress, .555, .62) * (1 - range(progress, .615, .635));
  const safePerch = range(progress, .55, .575) * (1 - range(progress, .695, .72));
  const perchedArrival = range(progress, .61, .63) * (1 - range(progress, .695, .72));
  const evening = range(progress, .84, .91);
  const night = range(progress, .885, .95);
  const dawnExit = range(progress, .965, 1);
  const awakeBird = clamp(environmentChapter * (1 - range(progress, .9, .945)) + dawnExit);
  const sleepBird = range(progress, .91, .95) * (1 - dawnExit);
  const roomBrightness = .72 + environmentChapter * .2 - night * .56 + dawnExit * .2;
  const roomSaturation = .74 + environmentChapter * .22 - night * .42 + dawnExit * .24;
  const tone = HAZARD_IDS.has(beat.id) ? (beat.id === 'fumes' || beat.id === 'aerosols' ? 'air' : 'hazard') : beat.id === 'room-ready' || beat.id === 'safe-landing' ? 'safe' : beat.id === 'night' || beat.id === 'sleep' ? 'night' : beat.id.startsWith('environment') || beatIndex >= 15 ? 'environment' : 'bridge';

  return (
    <section className="phasef-experience" id="phase-f" ref={sectionRef} aria-label="Fase F: Déjame explorar y Mi ambiente">
      <div className="phasef-stage" data-chapter={hazardChapter > environmentChapter ? 'explore' : 'environment'} inert={sceneState !== 'active'} aria-hidden={sceneState !== 'active'}>
        <div className="phasef-room-camera" aria-hidden="true" style={{ '--room-zoom': camera.zoom, '--room-brightness': roomBrightness, '--room-saturation': roomSaturation } as CSSProperties}>
          <img className="phasef-room" src={withBasePath('/assets/room-base-empty-v3.webp')} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ objectPosition: `${camera.x}% ${camera.y}%` }} />
        </div>
        <div className="phasef-base-grade" aria-hidden="true" />
        <div className="phasef-evening-grade" aria-hidden="true" style={{ opacity: evening * (1 - dawnExit) }} />
        <div className="phasef-night-grade" aria-hidden="true" style={{ opacity: night * (1 - dawnExit) }} />
        <div className="phasef-dawn-grade" aria-hidden="true" style={{ opacity: dawnExit }} />
        <div className="phasef-sun-beam" aria-hidden="true" style={{ opacity: environmentChapter * (1 - range(progress, .82, .88)) }} />

        <img className="phasef-flight-bud" src={withBasePath('/assets/bud-hero-flight-v2.webp')} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ opacity: Math.max(flightEntry, safeFlight), transform: `translate3d(${safeFlight * 24 + flightEntry * 8}%, ${safeFlight * 7 - flightEntry * 3}%, 0) scale(${.56 + flightEntry * .34 - safeFlight * .12}) rotate(${flightEntry * -3 + safeFlight * 7}deg)` }} />
        <img className="phasef-safe-perch" src={withBasePath('/assets/natural-perch-v1.webp')} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ opacity: safePerch }} />
        <img className="phasef-landing-bud" src={withBasePath('/assets/bud-hero-curious-v1.webp')} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ opacity: perchedArrival, transform: `translateY(${(1 - perchedArrival) * -16}px) scale(${.92 + perchedArrival * .08})` }} />

        <div className="phasef-hazard-layer" aria-hidden="true" style={{ opacity: hazardChapter }}>
          <HazardVisual beatId={beat.id} progress={progress} />
        </div>

        <div className="phasef-environment-layer" aria-hidden="true" style={{ opacity: environmentChapter }}>
          <img className="phasef-awake-bud" src={withBasePath('/assets/bud-hero-perched-v3.webp')} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ opacity: awakeBird, transform: `translateY(${(1 - awakeBird) * 3}%) scale(${.91 + dawnExit * .025})` }} />
          <img className="phasef-sleep-bud" src={withBasePath('/assets/bud-hero-fluffed-scene-v2.webp')} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ opacity: sleepBird, transform: `translateY(${(1 - sleepBird) * 2}%) scale(${.93 + sleepBird * .015})` }} />
          <EnvironmentVisual beatId={beat.id} progress={progress} />
        </div>

        <div className="phasec-reading phasef-reading" data-tone={tone} role="status" aria-live="polite" aria-atomic="true">
          <span>{beat.kicker}</span>
          <h2>{beat.title}</h2>
          <p>{beat.copy}</p>
          <small>Parada de lectura · desliza cuando termines</small>
          {(beat.id === 'fumes' || beat.id === 'aerosols') ? <small className="phasef-disclaimer">{domesticSafetyDisclaimer}</small> : null}
          <i><b style={{ width: `${20 + beatReadProgress * 80}%` }} /></i>
        </div>

        <div className="phasec-rail phasef-rail" aria-label={`Momento ${beatIndex + 1} de ${phaseFBeats.length}: ${beat.title}`}>
          <i style={{ height: `${progress * 100}%` }} />
          {phaseFBeats.map((item, index) => (
            <span key={item.id} className={index === beatIndex ? 'active' : ''} style={{ top: `${item.at * 100}%` } as CSSProperties}>
              <b>{String(index + 1).padStart(2, '0')}</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
