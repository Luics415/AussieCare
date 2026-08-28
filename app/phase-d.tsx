'use client';
/* eslint-disable @next/next/no-img-element -- Cinematic layers require direct alpha-preserving raster elements. */

import { useEffect, useRef, type CSSProperties } from 'react';
import { nutritionDisclaimer, phaseDBeats } from './content';
import { useSceneProgress } from './use-scene-progress';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));
const windowed = (progress: number, start: number, end: number) => range(progress, start, start + .014) * (1 - range(progress, end - .014, end));
const FOOD_FOCUS: Record<string, { x: number; y: number; size?: number; warning?: boolean }> = {
  formulated: { x: 16.5, y: 9.5 },
  greens: { x: 46.5, y: 19.5 },
  vegetables: { x: 17.5, y: 34 },
  fruit: { x: 49.5, y: 37.5 },
  water: { x: 18.5, y: 51.5 },
  seeds: { x: 47, y: 54.5 },
  gradual: { x: 28, y: 72, size: 154 },
  avoid: { x: 79, y: 65, size: 174, warning: true },
  avocado: { x: 82, y: 51.5, size: 150, warning: true },
  chocolate: { x: 77, y: 69, size: 150, warning: true },
};

type PhaseDProps = {
  onProgress: (progress: number) => void;
  onBeatChange: (beatIndex: number) => void;
};

export default function PhaseD({ onProgress, onBeatChange }: PhaseDProps) {
  const lastBeatRef = useRef(0);
  const { sectionRef, progress, sceneState } = useSceneProgress({ onProgress });

  let beatIndex = 0;
  for (let index = 1; index < phaseDBeats.length; index += 1) {
    if (progress >= phaseDBeats[index].at) beatIndex = index;
  }
  const beat = phaseDBeats[beatIndex];
  const beatEnd = phaseDBeats[beatIndex + 1]?.at ?? 1;
  const beatReadProgress = range(progress, beat.at, beatEnd);

  useEffect(() => {
    const previous = lastBeatRef.current;
    if (beatIndex === previous) return;
    lastBeatRef.current = beatIndex;
    if (beatIndex > previous) onBeatChange(beatIndex);
  }, [beatIndex, onBeatChange]);

  const foodScene = 1 - range(progress, .67, .735);
  const cleanScene = range(progress, .665, .735);
  const scraps = range(progress, .68, .73);
  const surfaces = range(progress, .9, .96);
  const observe = range(progress, .955, .975);
  const bowlContents = 1 - range(progress, .075, .105);
  const warning = beatIndex >= 9 && beatIndex <= 11;
  const cleanTone = beatIndex >= 13;
  const foodFocus = FOOD_FOCUS[beat.id];
  const cleaningStep = beat.id === 'clean-bowls' ? 1 : beat.id === 'surfaces' ? 2 : beat.id === 'health-exit' ? 3 : 0;
  const cleaningStepX = cleaningStep % 2;
  const cleaningStepY = Math.floor(cleaningStep / 2);

  return (
    <section className="phased-experience" id="phase-d" ref={sectionRef} aria-label="Fase D: Lo que como y Mi espacio limpio">
      <div className="phased-stage" inert={sceneState !== 'active'} aria-hidden={sceneState !== 'active'}>
        <div className="phased-food-scene" aria-hidden="true" style={{ opacity: foodScene }}>
          <div className="phased-food-visual">
            <img className="phased-food-table" src="/assets/food-table-v2.webp" alt="Mesa con alimentos reales aptos y alimentos peligrosos separados" loading="lazy" decoding="async" style={{ transform: `scale(${1.005 + progress * .012})` }} />
            {foodFocus ? <div className="phased-food-focus" data-warning={foodFocus.warning ? 'true' : 'false'} style={{ left: `${foodFocus.x}%`, top: `${foodFocus.y}%`, width: `${foodFocus.size ?? 132}px` }}><i /><span>{foodFocus.warning ? 'NO OFRECER' : 'PORCIÓN REAL'}</span></div> : null}
          </div>
          <div className="food-table" aria-hidden="true" />
          <div className="food-orbit" aria-hidden="true" style={{ transform: `translate(-50%, -50%) rotate(${progress * 48}deg)` }}><i /><i /><i /><i /><i /><i /></div>
          <div className="phased-bowl" aria-hidden="true" style={{ transform: `translate(-50%, -50%) scale(${1 + range(progress, 0, .08) * .16}) rotate(${scraps * 18}deg)` }}><i style={{ opacity: bowlContents }} /><i style={{ opacity: bowlContents }} /><i style={{ opacity: bowlContents }} /><i style={{ opacity: bowlContents }} /><i style={{ opacity: bowlContents }} /></div>

          <div className="food-object food-pellets" role="img" aria-label="Alimento formulado para aves pequeñas" style={{ opacity: windowed(progress, .095, .17), transform: `translate(-50%, -50%) scale(${.8 + range(progress, .11, .17) * .2})` }}>
            {Array.from({ length: 13 }, (_, index) => <i key={index} style={{ '--food-i': index } as CSSProperties} />)}
          </div>

          <div className="food-object food-greens" role="img" aria-label="Hojas verdes lavadas" style={{ opacity: windowed(progress, .17, .23), transform: `translate(-50%, -50%) rotate(${(range(progress, .17, .23) - .5) * 8}deg)` }}>
            <i /><i /><i /><i /><i /><b />
          </div>

          <div className="food-object food-vegetables" role="img" aria-label="Brócoli y zanahoria en piezas pequeñas" style={{ opacity: windowed(progress, .23, .29), transform: `translate(-50%, -50%) scale(${.9 + range(progress, .23, .29) * .1})` }}>
            <i /><b><span /><span /><span /><span /></b>
          </div>

          <div className="food-object food-fruit" role="img" aria-label="Fruta en porción pequeña y sin semillas" style={{ opacity: windowed(progress, .29, .35), transform: `translate(-50%, -50%) rotate(${(range(progress, .29, .35) - .5) * -9}deg)` }}>
            <i /><b /><span>sin semillas</span>
          </div>

          <div className="food-object food-water" role="img" aria-label="Agua limpia y fresca" style={{ opacity: windowed(progress, .35, .41), transform: `translate(-50%, -50%) translateY(${(1 - range(progress, .35, .41)) * -18}px)` }}>
            <i /><b />
          </div>

          <div className="food-object food-seeds" role="img" aria-label="Semillas ofrecidas con medida" style={{ opacity: windowed(progress, .41, .47), transform: `translate(-50%, -50%) scale(${.86 + range(progress, .41, .47) * .14})` }}>
            {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--food-i': index } as CSSProperties} />)}
          </div>

          <div className="food-object food-balance" role="img" aria-label="Plato que combina alimento formulado, verduras y una pequeña cantidad de semillas" style={{ opacity: windowed(progress, .47, .53), transform: `translate(-50%, -50%) rotate(${(range(progress, .47, .53) - .5) * 5}deg)` }}>
            <i /><i /><i /><b />
          </div>

          <div className="food-object food-stop" role="img" aria-label="Separación entre alimentos aptos y alimentos peligrosos" style={{ opacity: windowed(progress, .53, .58), transform: `translate(-50%, -50%) scale(${.75 + range(progress, .53, .58) * .25})` }}><i /><b /></div>

          <div className="food-object food-avocado" role="img" aria-label="Aguacate: no ofrecer" style={{ opacity: windowed(progress, .58, .63), transform: `translate(-50%, -50%) rotate(${(range(progress, .58, .63) - .5) * -8}deg)` }}><i /><b /><span /></div>

          <div className="food-object food-chocolate" role="img" aria-label="Chocolate y cafeína: no ofrecer" style={{ opacity: windowed(progress, .63, .68), transform: `translate(-50%, -50%) scale(${.9 + range(progress, .63, .68) * .1})` }}><i /><b /><span /></div>

          <div className="falling-scraps" aria-hidden="true" style={{ opacity: scraps }}>
            {Array.from({ length: 9 }, (_, index) => <i key={index} style={{ '--scrap-i': index, transform: `translateY(${scraps * (170 + index * 12)}px) rotate(${scraps * (80 + index * 17)}deg)` } as CSSProperties} />)}
          </div>
        </div>

        <div className="phased-clean-scene" aria-hidden="true" style={{ opacity: cleanScene }}>
          <img className="phased-clean-room" src="/assets/room-base-empty-v3.webp" alt="" loading="lazy" decoding="async" style={{ opacity: .74 + observe * .16, transform: `scale(${1.04 - observe * .015})`, filter: `saturate(${.62 + surfaces * .34}) brightness(${.68 + surfaces * .22})` }} />
          <div className="clean-room-grade" />
          <img className="phased-clean-cage-product" src="/assets/aussiecare-cage-v1.webp" alt="" loading="lazy" decoding="async" style={{ opacity: .9 - observe * .2, transform: `translateY(${(1 - cleanScene) * 2}%) scale(${.94 + surfaces * .025})` }} />
          <div className="cleaning-step-visual" role="img" aria-label={cleaningStep === 0 ? 'Bandeja con papel limpio' : cleaningStep === 1 ? 'Recipientes de acero lavados con agua y cepillo' : cleaningStep === 2 ? 'Percha natural lavada y secada' : 'Jaula limpia y preparada'}>
            <img src="/assets/cage-cleaning-steps-v1.webp" alt="" loading="lazy" decoding="async" style={{ transform: `translate(${-cleaningStepX * 50}%, ${-cleaningStepY * 50}%)` }} />
            <b>{cleaningStep === 0 ? 'PAPEL NUEVO' : cleaningStep === 1 ? 'LAVA · ENJUAGA' : cleaningStep === 2 ? 'LIMPIA · SECA' : 'HOGAR LISTO'}</b>
          </div>
          <div className="no-aerosol" style={{ opacity: range(progress, .9, .94) * (1 - range(progress, .955, .98)) }}><i>×</i><span>sin aerosoles<br/>cerca del ave</span></div>
          <img className="clean-bud" src="/assets/bud-hero-perched-v3.webp" alt="" loading="lazy" decoding="async" style={{ opacity: observe, transform: `translateY(${(1 - observe) * 22}px) scale(${.9 + observe * .1})` }} />
        </div>

        <div className="phasec-reading phased-reading" data-warning={warning} data-clean={cleanTone}>
          <span>{beat.kicker}</span>
          <h2>{beat.title}</h2>
          <p>{beat.copy}</p>
          <small>Lee a tu ritmo · desliza cuando termines</small>
          {beat.id === 'gradual' && <small className="phased-disclaimer">{nutritionDisclaimer}</small>}
          <i><b style={{ width: `${20 + beatReadProgress * 80}%` }} /></i>
        </div>

        <div className="phasec-rail phased-rail" aria-label={`Momento ${beatIndex + 1} de ${phaseDBeats.length}: ${beat.title}`}>
          <i style={{ height: `${progress * 100}%` }} />
          {phaseDBeats.map((item, index) => (
            <span key={item.id} className={index === beatIndex ? 'active' : ''} style={{ top: `${item.at * 100}%` } as CSSProperties}>
              <b>{String(index + 1).padStart(2, '0')}</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
