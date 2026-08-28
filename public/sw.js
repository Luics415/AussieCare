const VERSION = 'aussiecare-final-v1';
const PREFIX = 'aussiecare-';
const LEGACY_PREFIXES = ['undulatus-'];
const CORE_CACHE = `${PREFIX}core-${VERSION}`;
const RUNTIME_CACHE = `${PREFIX}runtime-${VERSION}`;
const CINEMATIC_CACHE = `${PREFIX}cinematic-${VERSION}`;
const OWN_CACHES = new Set([CORE_CACHE, RUNTIME_CACHE, CINEMATIC_CACHE]);

const CORE_ROUTES = ['/', '/consulta'];
const CORE_ASSETS = [
  '/manifest.webmanifest',
  '/icons/favicon-64.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/assets/bud-hero-curious-v1.webp',
  '/assets/australia-master.webp',
  '/brand/aussiecare-icon.webp',
  '/brand/signature-budgies.webp',
];
const CINEMATIC_ASSETS = [
  '/assets/australia-master.webp',
  '/assets/bud-hero-style-lock.webp',
  '/assets/bud-hero-flight-v2.webp',
  '/assets/bud-hero-perched-v3.webp',
  '/assets/bud-hero-fluffed-scene-v2.webp',
  '/assets/bud-hero-step-up-scene-v2.webp',
  '/assets/bud-hero-trust-approach-v1.webp',
  '/assets/bud-hero-trust-approach-desktop-v1.webp',
  '/assets/bud-hero-singing-v1.webp',
  '/assets/bud-hero-preening-v1.webp',
  '/assets/bud-hero-foraging-v1.webp',
  '/assets/bud-hero-curious-v1.webp',
  '/assets/bud-hero-urgent-v1.webp',
  '/assets/aussiecare-cage-v1.webp',
  '/assets/cage-cleaning-steps-v1.webp',
  '/assets/millet-reward-v1.webp',
  '/assets/natural-perch-v1.webp',
  '/assets/trust-hand-v1.webp',
  '/assets/room-base-empty-v3.webp',
  '/assets/room-base-canonical-cage-v2.webp',
  '/assets/enrichment-board-v2.webp',
  '/assets/food-table-v2.webp',
  '/assets/room-hazards-v2.webp',
  '/assets/avian-vet-clinic-v2.webp',
  '/assets/bud-hero-return-australia-v2.webp',
  '/audio/budgerigar-chirping-public-domain.ogg',
];

function sameOriginAsset(value) {
  try {
    const url = new URL(value, self.location.origin);
    if (url.origin !== self.location.origin || !url.pathname.startsWith('/_next/static/')) return null;
    return url.href;
  } catch {
    return null;
  }
}

async function fetchAndCache(cache, input) {
  const response = await fetch(input, { cache: 'reload', credentials: 'same-origin' });
  if (!response.ok) throw new Error(`No se pudo guardar ${input}: ${response.status}`);
  await cache.put(input, response.clone());
  return response;
}

async function cacheCoreShell() {
  const cache = await caches.open(CORE_CACHE);
  const shellAssets = new Set();

  for (const route of CORE_ROUTES) {
    const response = await fetchAndCache(cache, route);
    const html = await response.text();
    for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
      const asset = sameOriginAsset(match[1]);
      if (asset) shellAssets.add(asset);
    }
  }

  await Promise.all([...shellAssets, ...CORE_ASSETS].map(async (asset) => {
    if (!(await cache.match(asset))) await fetchAndCache(cache, asset);
  }));
}

async function coreStatus() {
  const cache = await caches.open(CORE_CACHE);
  const [home, consulta] = await Promise.all([cache.match('/'), cache.match('/consulta')]);
  return Boolean(home && consulta);
}

async function postCoreStatus(target) {
  target?.postMessage({ type: 'CORE_STATUS', ready: await coreStatus(), version: VERSION });
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    await cacheCoreShell();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => (key.startsWith(PREFIX) && !OWN_CACHES.has(key))
        || LEGACY_PREFIXES.some((legacyPrefix) => key.startsWith(legacyPrefix)))
      .map((key) => caches.delete(key)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    clients.forEach((client) => client.postMessage({ type: 'CORE_READY', version: VERSION }));
  })());
});

async function navigationResponse(request) {
  const url = new URL(request.url);
  const fallback = url.pathname.startsWith('/consulta') ? '/consulta' : '/';
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CORE_CACHE);
      await cache.put(fallback, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(request, { ignoreSearch: true }))
      || (await caches.match(fallback))
      || new Response('AussieCare no está disponible todavía sin conexión.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
  }
}

async function updateRuntime(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return null;
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(navigationResponse(request));
    return;
  }

  const canCache = ['script', 'style', 'font', 'image', 'audio', 'worker'].includes(request.destination)
    || url.pathname.startsWith('/_next/static/')
    || url.pathname.startsWith('/audio/');
  if (!canCache) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    const update = updateRuntime(request);
    if (cached) {
      event.waitUntil(update);
      return cached;
    }
    return (await update) || new Response('', { status: 504, statusText: 'Offline' });
  })());
});

async function cacheCinematic(target) {
  const cache = await caches.open(CINEMATIC_CACHE);
  let completed = 0;
  for (const asset of CINEMATIC_ASSETS) {
    try {
      if (!(await cache.match(asset))) await fetchAndCache(cache, asset);
      completed += 1;
      target?.postMessage({ type: 'CINEMATIC_PROGRESS', completed, total: CINEMATIC_ASSETS.length });
    } catch (error) {
      target?.postMessage({ type: 'CINEMATIC_ERROR', completed, total: CINEMATIC_ASSETS.length, message: String(error) });
      return;
    }
  }
  target?.postMessage({ type: 'CINEMATIC_READY', completed, total: CINEMATIC_ASSETS.length });
}

self.addEventListener('message', (event) => {
  const type = event.data?.type;
  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  if (type === 'GET_CORE_STATUS') {
    event.waitUntil(postCoreStatus(event.source));
    return;
  }
  if (type === 'CACHE_CINEMATIC') {
    event.waitUntil(cacheCinematic(event.source));
    return;
  }
  if (type === 'GET_CINEMATIC_STATUS') {
    event.waitUntil((async () => {
      const cache = await caches.open(CINEMATIC_CACHE);
      const keys = await cache.keys();
      event.source?.postMessage({
        type: keys.length >= CINEMATIC_ASSETS.length ? 'CINEMATIC_READY' : 'CINEMATIC_PROGRESS',
        completed: keys.length,
        total: CINEMATIC_ASSETS.length,
      });
    })());
  }
});
