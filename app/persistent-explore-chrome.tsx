'use client';
/* eslint-disable @next/next/no-img-element -- The fixed brand icon is pre-optimized by the media pipeline. */

import CompactSoundControl from './compact-sound-control';
import { exploreChapters, type ExploreChapter } from './experience-map';
import { withBasePath } from './base-path';

type PersistentExploreChromeProps = {
  activeChapter: number;
  menuOpen: boolean;
  soundOn: boolean;
  volume: number;
  onHome: () => void;
  onOpenConsult: () => void;
  onSelectChapter: (chapter: ExploreChapter) => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
};

export default function PersistentExploreChrome({
  activeChapter,
  menuOpen,
  soundOn,
  volume,
  onHome,
  onOpenConsult,
  onSelectChapter,
  onToggleMenu,
  onCloseMenu,
  onToggleSound,
  onVolumeChange,
}: PersistentExploreChromeProps) {
  const current = exploreChapters.find((chapter) => chapter.number === activeChapter);

  return (
    <>
      <header className="aussiecare-explore-chrome" data-light={activeChapter === 1 ? 'true' : 'false'}>
        <button className="aussiecare-explore-brand" type="button" onClick={onHome} aria-label="Volver a Australia, inicio de Explorar">
          <span><img src={withBasePath('/brand/aussiecare-icon.webp')} alt="" aria-hidden="true" /></span>
          <b>AussieCare</b>
          <small>{current ? `${String(current.number).padStart(2, '0')} · ${current.title}` : 'ORIGEN · AUSTRALIA'}</small>
        </button>
        <div className="aussiecare-explore-actions">
          <CompactSoundControl controlId="aussiecare-global-sound" soundOn={soundOn} volume={volume} onToggleSound={onToggleSound} onVolumeChange={onVolumeChange} tone={activeChapter === 1 ? 'light' : 'dark'} />
          <button className="aussiecare-menu-button" type="button" onClick={onToggleMenu} aria-expanded={menuOpen} aria-controls="aussiecare-explore-menu" aria-label={menuOpen ? 'Cerrar índice' : 'Abrir índice'}>
            <i /><i /><i />
          </button>
        </div>
      </header>

      <div className="aussiecare-menu-layer" data-open={menuOpen ? 'true' : 'false'} aria-hidden={!menuOpen} onPointerDown={(event) => { if (event.currentTarget === event.target) onCloseMenu(); }}>
        <nav id="aussiecare-explore-menu" className="aussiecare-menu-panel" aria-label="Índice de Modo Explorar">
          <header>
            <div><span>MENÚ</span><strong>Elige dónde continuar.</strong></div>
            <button type="button" onClick={onCloseMenu} aria-label="Cerrar índice">×</button>
          </header>
          <div className="aussiecare-mode-links">
            <button type="button" onClick={onHome}><span>EXPLORAR</span><small>PELÍCULA ACTIVA</small></button>
            <button type="button" onClick={onOpenConsult}><span>CONSULTA</span><small>GUÍA OFFLINE</small></button>
          </div>
          <p>ÍNDICE · 10 CAPÍTULOS</p>
          <ol>
            {exploreChapters.map((chapter) => (
              <li key={chapter.number}>
                <button type="button" className={activeChapter === chapter.number ? 'is-active' : ''} aria-current={activeChapter === chapter.number ? 'step' : undefined} onClick={() => onSelectChapter(chapter)}>
                  <span>{String(chapter.number).padStart(2, '0')}</span>
                  <strong>{chapter.title}</strong>
                  <i aria-hidden="true">→</i>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </>
  );
}
