'use client';

import { useEffect, useRef, useState } from 'react';

type CompactSoundControlProps = {
  soundOn: boolean;
  volume: number;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
  tone?: 'dark' | 'light';
  controlId?: string;
};

export default function CompactSoundControl({
  soundOn,
  volume,
  onToggleSound,
  onVolumeChange,
  tone = 'dark',
  controlId = 'aussiecare-sound-panel',
}: CompactSoundControlProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div className="compact-sound" data-open={open} data-tone={tone} ref={rootRef}>
      <button
        className="compact-sound-trigger"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={controlId}
        aria-label={open ? 'Cerrar controles de sonido' : 'Abrir controles de sonido'}
      >
        <span aria-hidden="true">{soundOn ? '◖))' : '◖×'}</span>
      </button>
      <div className="compact-sound-panel" id={controlId} role="group" aria-label="Paisaje sonoro">
        <button
          className="compact-sound-toggle"
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
        >
          <span>{soundOn ? 'SONIDO ON' : 'SONIDO OFF'}</span>
          <i aria-hidden="true" />
        </button>
        <label>
          <span>VOLUMEN · {Math.round(volume * 100)}%</span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={Math.round(volume * 100)}
            onChange={(event) => onVolumeChange(Number(event.target.value) / 100)}
            aria-label="Volumen del paisaje sonoro"
            aria-valuetext={`${Math.round(volume * 100)} %`}
          />
        </label>
        <small>Ambiente y canto responden al recorrido.</small>
      </div>
    </div>
  );
}
