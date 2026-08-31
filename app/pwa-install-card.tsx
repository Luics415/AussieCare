'use client';
/* eslint-disable @next/next/no-img-element -- The PWA badge is pre-optimized and rendered at a fixed size. */

import { useEffect, useState } from 'react';
import { withBasePath } from './base-path';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type OfflineStatus = 'preparing' | 'ready' | 'unavailable' | 'unsupported';
type FilmStatus = 'idle' | 'downloading' | 'ready' | 'error';
const CINEMATIC_TOTAL = 26;

function isStandalone() {
  return matchMedia('(display-mode: standalone)').matches
    || ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
}

function isAppleMobile() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export default function PwaInstallCard() {
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>('preparing');
  const [filmStatus, setFilmStatus] = useState<FilmStatus>('idle');
  const [filmProgress, setFilmProgress] = useState({ completed: 0, total: CINEMATIC_TOTAL });
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [appleMobile, setAppleMobile] = useState(false);
  const [showAppleHelp, setShowAppleHelp] = useState(false);
  const [showBrowserHelp, setShowBrowserHelp] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.pwaStatus;
    const initialStatusFrame = requestAnimationFrame(() => {
      setInstalled(isStandalone());
      setAppleMobile(isAppleMobile());
      if (!('serviceWorker' in navigator)) {
        setOfflineStatus('unsupported');
        return;
      }
      if (current === 'ready' || current === 'unavailable') setOfflineStatus(current);
    });
    if (!('serviceWorker' in navigator)) return () => cancelAnimationFrame(initialStatusFrame);

    const onStatus = (event: Event) => {
      const status = (event as CustomEvent<{ status?: OfflineStatus }>).detail?.status;
      if (status) setOfflineStatus(status);
    };
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    const onWorkerMessage = (event: MessageEvent<{ type?: string; ready?: boolean; completed?: number; total?: number }>) => {
      const data = event.data;
      if (data.type === 'CORE_STATUS') setOfflineStatus(data.ready ? 'ready' : 'preparing');
      if (data.type === 'CORE_READY') setOfflineStatus('ready');
      if (data.type === 'CINEMATIC_PROGRESS') {
        const completed = data.completed ?? 0;
        const total = data.total ?? CINEMATIC_TOTAL;
        setFilmStatus(completed === 0 ? 'idle' : completed >= total ? 'ready' : 'downloading');
        setFilmProgress({ completed, total });
      }
      if (data.type === 'CINEMATIC_READY') {
        setFilmStatus('ready');
        setFilmProgress({ completed: data.completed ?? CINEMATIC_TOTAL, total: data.total ?? CINEMATIC_TOTAL });
      }
      if (data.type === 'CINEMATIC_ERROR') setFilmStatus('error');
    };

    window.addEventListener('aussiecare:pwa-status', onStatus);
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    navigator.serviceWorker.addEventListener('message', onWorkerMessage);
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage({ type: 'GET_CORE_STATUS' });
      registration.active?.postMessage({ type: 'GET_CINEMATIC_STATUS' });
    }).catch(() => setOfflineStatus('unavailable'));

    return () => {
      window.removeEventListener('aussiecare:pwa-status', onStatus);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      navigator.serviceWorker.removeEventListener('message', onWorkerMessage);
      cancelAnimationFrame(initialStatusFrame);
    };
  }, []);

  const requestInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setInstallPrompt(null);
  };

  const downloadFilm = async () => {
    if (!('serviceWorker' in navigator)) return;
    setFilmStatus('downloading');
    setFilmProgress({ completed: 0, total: CINEMATIC_TOTAL });
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: 'CACHE_CINEMATIC' });
    } catch {
      setFilmStatus('error');
    }
  };

  const offlineCopy = {
    preparing: 'Preparando la guía esencial…',
    ready: 'Guía esencial lista sin conexión',
    unavailable: 'No se pudo preparar el modo offline',
    unsupported: 'Este navegador no admite modo offline',
  }[offlineStatus];
  const percentage = filmProgress.total ? Math.round((filmProgress.completed / filmProgress.total) * 100) : 0;

  return (
    <section className="consulta-pwa-card" aria-labelledby="consulta-pwa-title">
      <div className="consulta-pwa-mark" aria-hidden="true"><img src={withBasePath('/brand/aussiecare-icon.webp')} alt="" /></div>
      <div className="consulta-pwa-copy">
        <p className="consulta-kicker">TU GUÍA · EN ESTE DISPOSITIVO</p>
        <h2 id="consulta-pwa-title">Llévala contigo.</h2>
        <p>Instálala sin cuenta y conserva aquí tu lista y el punto de la película.</p>
      </div>
      <div className="consulta-pwa-status" role="status" aria-live="polite">
        <span data-state={offlineStatus}><i aria-hidden="true" />{offlineCopy}</span>
        {filmStatus === 'ready' ? <span data-state="ready"><i aria-hidden="true" />Película completa guardada</span> : null}
        {filmStatus === 'downloading' ? (
          <span data-state="preparing"><i aria-hidden="true" />Guardando película · {percentage}%</span>
        ) : null}
        {filmStatus === 'error' ? <span data-state="error"><i aria-hidden="true" />La descarga se pausó; puedes reintentar</span> : null}
      </div>
      {filmStatus === 'downloading' ? <div className="consulta-pwa-progress" aria-hidden="true"><i style={{ width: `${percentage}%` }} /></div> : null}
      <div className="consulta-pwa-actions">
        {!installed && installPrompt ? <button type="button" onClick={requestInstall}>INSTALAR AUSSIECARE <span aria-hidden="true">↓</span></button> : null}
        {!installed && appleMobile && !installPrompt ? <button type="button" onClick={() => setShowAppleHelp((value) => !value)} aria-expanded={showAppleHelp}>INSTALAR EN IPHONE / IPAD <span aria-hidden="true">+</span></button> : null}
        {!installed && !appleMobile && !installPrompt ? <button type="button" onClick={() => setShowBrowserHelp((value) => !value)} aria-expanded={showBrowserHelp}>CÓMO INSTALARLA <span aria-hidden="true">+</span></button> : null}
        {installed ? <span className="consulta-pwa-installed">ABRIENDO COMO APP</span> : null}
        {filmStatus !== 'ready' && filmStatus !== 'downloading' ? <button className="consulta-pwa-secondary" type="button" onClick={downloadFilm}>GUARDAR PELÍCULA COMPLETA</button> : null}
      </div>
      {showAppleHelp ? (
        <ol className="consulta-pwa-apple-help">
          <li>Abre esta página en Safari.</li>
          <li>Toca Compartir y elige “Añadir a pantalla de inicio”.</li>
          <li>Confirma “Añadir”. AussieCare abrirá como app.</li>
        </ol>
      ) : null}
      {showBrowserHelp ? (
        <ol className="consulta-pwa-apple-help">
          <li>Abre el menú de tu navegador.</li>
          <li>Elige “Instalar AussieCare” o “Añadir a pantalla de inicio”.</li>
          <li>Confirma la instalación. Se abrirá sin las barras del navegador.</li>
        </ol>
      ) : null}
      <small>La guía esencial se prepara automáticamente. La película completa es opcional y puede ocupar más espacio.</small>
    </section>
  );
}
