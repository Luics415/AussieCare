'use client';

import { useEffect, useRef, useState } from 'react';

export type SceneState = 'before' | 'active' | 'after';

type SceneProgressOptions = {
  onProgress: (progress: number) => void;
  onSceneState?: (state: SceneState) => void;
  rootMargin?: string;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function useSceneProgress({ onProgress, onSceneState, rootMargin = '100% 0px' }: SceneProgressOptions) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const stateRef = useRef<SceneState>('before');
  const progressCallbackRef = useRef(onProgress);
  const stateCallbackRef = useRef(onSceneState);
  const [progress, setProgress] = useState(0);
  const [sceneState, setSceneState] = useState<SceneState>('before');

  useEffect(() => {
    progressCallbackRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    stateCallbackRef.current = onSceneState;
  }, [onSceneState]);

  useEffect(() => {
    let frame = 0;
    let nearScene = false;
    const update = (force = false) => {
      frame = 0;
      if (!nearScene && !force) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const next = clamp(-rect.top / Math.max(1, section.offsetHeight - innerHeight));
      const nextState: SceneState = rect.top > 0 ? 'before' : rect.bottom < innerHeight ? 'after' : 'active';
      if (Math.abs(next - progressRef.current) > .0005) {
        progressRef.current = next;
        setProgress(next);
      }
      if (nextState === 'active') progressCallbackRef.current(next);
      if (nextState !== stateRef.current) {
        stateRef.current = nextState;
        setSceneState(nextState);
        stateCallbackRef.current?.(nextState);
      }
    };
    const onScroll = () => {
      if (!nearScene) return;
      if (!frame) frame = requestAnimationFrame(() => update());
    };
    const observer = new IntersectionObserver(([entry]) => {
      nearScene = entry.isIntersecting;
      update(true);
    }, { rootMargin });
    if (sectionRef.current) observer.observe(sectionRef.current);
    update(true);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootMargin]);

  return { sectionRef, progress, sceneState };
}
