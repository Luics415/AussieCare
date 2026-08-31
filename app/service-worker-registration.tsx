'use client';

import { useEffect, useRef, useState } from 'react';
import { withBasePath } from './base-path';

export default function ServiceWorkerRegistration() {
  const [updateReady, setUpdateReady] = useState(false);
  const reloadAfterUpdate = useRef(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const emitStatus = (status: string) => {
      document.documentElement.dataset.pwaStatus = status;
      window.dispatchEvent(new CustomEvent('aussiecare:pwa-status', { detail: { status } }));
    };
    const onMessage = (event: MessageEvent<{ type?: string; ready?: boolean }>) => {
      if (event.data?.type === 'CORE_STATUS') emitStatus(event.data.ready ? 'ready' : 'preparing');
      if (event.data?.type === 'CORE_READY') emitStatus('ready');
    };
    const onControllerChange = () => {
      if (!reloadAfterUpdate.current) return;
      reloadAfterUpdate.current = false;
      location.reload();
    };

    emitStatus('preparing');
    navigator.serviceWorker.addEventListener('message', onMessage);
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker.register(withBasePath('/sw.js'), { scope: withBasePath('/'), updateViaCache: 'none' }).then(async (registration) => {
      registrationRef.current = registration;
      if (registration.waiting) setUpdateReady(true);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) setUpdateReady(true);
        });
      });
      const ready = await navigator.serviceWorker.ready;
      ready.active?.postMessage({ type: 'GET_CORE_STATUS' });
    }).catch(() => emitStatus('unavailable'));

    return () => {
      navigator.serviceWorker.removeEventListener('message', onMessage);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  const applyUpdate = () => {
    const waiting = registrationRef.current?.waiting;
    if (!waiting) return;
    reloadAfterUpdate.current = true;
    waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  if (!updateReady) return null;
  return (
    <aside className="pwa-update" role="status" aria-live="polite">
      <span><strong>Nueva versión lista.</strong> Conservaremos tu lista y tu avance.</span>
      <button type="button" onClick={applyUpdate}>ACTUALIZAR</button>
      <button type="button" className="pwa-update-dismiss" onClick={() => setUpdateReady(false)} aria-label="Cerrar aviso de actualización">×</button>
    </aside>
  );
}
