'use client';
/* eslint-disable @next/next/no-html-link-for-pages -- Full document hops avoid a known Vinext RSC prefetch runtime error. */
/* eslint-disable @next/next/no-img-element -- Transparent character and brand assets are pre-optimized and composition-sized. */

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { careSources } from '../content';
import PwaInstallCard from '../pwa-install-card';
import AussieCareSignature from '../aussiecare-signature';
import {
  getGuideEntry,
  guideCategories,
  guideChapters,
  guideEntries,
  searchGuideEntries,
  starterEntryIds,
  type GuideChapter,
  type GuideEntry,
  type GuideSection,
} from '../guide-content';

type View = 'inicio' | 'buscar' | 'hoy' | 'guia';
type ChecklistGroup = 'daily' | 'weekly' | 'periodic';

type UiCategory = {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  marker: string;
  sections: GuideSection[];
  entryIds: string[];
};

type RouteState = {
  view: View;
  categoryId: string;
  entryId: string;
  query: string;
};

type ChecklistState = {
  dailyStamp: string;
  weeklyStamp: string;
  daily: string[];
  weekly: string[];
  periodic: string[];
};

type Source = { label: string; url: string };

const CHECKLIST_KEY = 'aussiecare-checklist-v1';
const RETURN_KEY = 'aussiecare-explore-return-v1';
const LEGACY_CHECKLIST_KEY = 'undulatus-checklist-v1';
const LEGACY_RETURN_KEY = 'undulatus-explore-return-v1';
const EMPTY_ROUTE: RouteState = { view: 'inicio', categoryId: '', entryId: '', query: '' };
const VIEWS: { id: View; label: string; glyph: string }[] = [
  { id: 'inicio', label: 'Inicio', glyph: 'I' },
  { id: 'buscar', label: 'Buscar', glyph: '?' },
  { id: 'hoy', label: 'Hoy', glyph: '✓' },
  { id: 'guia', label: 'Guía', glyph: 'G' },
];

const CHECKLISTS: {
  id: ChecklistGroup;
  eyebrow: string;
  title: string;
  description: string;
  items: { id: string; label: string; hint: string }[];
}[] = [
  {
    id: 'daily',
    eyebrow: 'CADA DÍA',
    title: 'Lo esencial de hoy',
    description: 'Se reinicia al comenzar un nuevo día en este dispositivo.',
    items: [
      { id: 'water', label: 'Cambiar el agua', hint: 'Recipiente limpio y agua fresca.' },
      { id: 'food', label: 'Revisar alimento', hint: 'Retira restos frescos y observa cuánto comió.' },
      { id: 'liner', label: 'Cambiar el papel del fondo', hint: 'También sirve para observar sus heces.' },
      { id: 'baseline', label: 'Mirar su normal', hint: 'Postura, respiración, actividad y voz.' },
      { id: 'company', label: 'Tiempo de interacción', hint: 'Juego, vuelo seguro o compañía tranquila.' },
    ],
  },
  {
    id: 'weekly',
    eyebrow: 'ESTA SEMANA',
    title: 'Una revisión más amplia',
    description: 'Se reinicia cada lunes según la hora local.',
    items: [
      { id: 'cage', label: 'Limpieza detallada del hogar', hint: 'Lava, enjuaga y seca antes de devolver accesorios.' },
      { id: 'toys', label: 'Revisar juguetes y cuerdas', hint: 'Busca piezas flojas, óxido o fibras deshilachadas.' },
      { id: 'perches', label: 'Revisar perchas', hint: 'Limpieza, firmeza y variedad de diámetros.' },
      { id: 'weight', label: 'Registrar peso si ya es rutina', hint: 'Compara tendencias, no un número aislado.' },
    ],
  },
  {
    id: 'periodic',
    eyebrow: 'PERIÓDICO',
    title: 'Pendientes de largo plazo',
    description: 'Permanece marcado hasta que decidas reiniciarlo.',
    items: [
      { id: 'vet', label: 'Revisión veterinaria preventiva', hint: 'Con un profesional con experiencia en aves.' },
      { id: 'rotation', label: 'Rotar enriquecimiento', hint: 'Introduce cambios poco a poco y observa la respuesta.' },
      { id: 'room', label: 'Auditar la habitación', hint: 'Ventanas, cables, plantas, humos y puntos de escape.' },
    ],
  },
];

const allEntries = guideEntries;
const allChapters = guideChapters;
const sourceIndex = careSources as unknown as Record<string, Source>;
const starterEntries = starterEntryIds
  .map((entryId) => getGuideEntry(entryId))
  .filter((entry): entry is GuideEntry => Boolean(entry));
const searchStarterEntries = [
  ...starterEntryIds,
  'no-come-o-come-menos',
  'manzana-sin-semillas',
  'perchas-naturales',
  'heces-cambios',
]
  .map((entryId) => getGuideEntry(entryId))
  .filter((entry): entry is GuideEntry => Boolean(entry));

function selectEntryIds(sections: GuideSection[]) {
  const accepted = new Set<GuideSection>(sections);
  return allEntries.filter((entry) => entry.sections.some((section) => accepted.has(section))).map((entry) => entry.id);
}

const portalCategories: UiCategory[] = [
  {
    id: 'cuidados',
    label: 'Cuidados',
    eyebrow: 'RUTINA Y ENTORNO',
    description: 'Hogar, limpieza, vínculo y ambiente cotidiano.',
    marker: '01',
    sections: ['conoceme', 'hogar', 'limpieza', 'confianza', 'ambiente'],
    entryIds: selectEntryIds(['conoceme', 'hogar', 'limpieza', 'confianza', 'ambiente']),
  },
  {
    id: 'alimentacion',
    label: 'Alimentación',
    eyebrow: 'COMER Y BEBER',
    description: 'Qué ofrecer, cómo variar y qué dejar fuera.',
    marker: '02',
    sections: ['alimentacion'],
    entryIds: selectEntryIds(['alimentacion']),
  },
  {
    id: 'juguetes',
    label: 'Juguetes',
    eyebrow: 'JUEGO Y FORRAJEO',
    description: 'Exploración y objetos que sí aportan.',
    marker: '03',
    sections: ['juego'],
    entryIds: selectEntryIds(['juego']),
  },
  {
    id: 'comportamiento',
    label: 'Comportamiento',
    eyebrow: 'VOZ Y CUERPO',
    description: 'Lee postura, plumas, mirada y contexto.',
    marker: '04',
    sections: ['lenguaje', 'confianza'],
    entryIds: selectEntryIds(['lenguaje', 'confianza']),
  },
  {
    id: 'salud',
    label: 'Salud',
    eyebrow: 'OBSERVAR Y ACTUAR',
    description: 'Su normal, los cambios y cuándo pedir ayuda.',
    marker: '05',
    sections: ['salud'],
    entryIds: selectEntryIds(['salud']),
  },
  {
    id: 'seguro',
    label: '¿Es seguro?',
    eyebrow: 'RESPUESTA RÁPIDA',
    description: 'Alimentos y riesgos del hogar que conviene revisar antes.',
    marker: '06',
    sections: ['alimentacion', 'juego', 'vuelo-seguro', 'ambiente'],
    entryIds: [
      'aguacate',
      'chocolate-cafeina',
      'cuerda-deshilachada',
      'espejo',
      'ventanas-ventilador',
      'teflon-ptfe',
      'humo-aerosoles',
    ],
  },
];

const chapterCategories: UiCategory[] = guideCategories.map((category) => ({
  id: category.id,
  label: category.label,
  eyebrow: category.eyebrow,
  description: category.description,
  marker: String(category.chapterNumbers[0]).padStart(2, '0'),
  sections: [category.id],
  entryIds: category.entryIds,
}));

function localDayStamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function localWeekStamp(date = new Date()) {
  const monday = new Date(date);
  const daysAfterMonday = (monday.getDay() + 6) % 7;
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - daysAfterMonday);
  return localDayStamp(monday);
}

function blankChecklist(): ChecklistState {
  return {
    dailyStamp: localDayStamp(),
    weeklyStamp: localWeekStamp(),
    daily: [],
    weekly: [],
    periodic: [],
  };
}

function readChecklist(): ChecklistState {
  const fresh = blankChecklist();
  try {
    const saved = JSON.parse(localStorage.getItem(CHECKLIST_KEY) ?? localStorage.getItem(LEGACY_CHECKLIST_KEY) ?? 'null') as Partial<ChecklistState> | null;
    if (!saved) return fresh;
    return {
      dailyStamp: fresh.dailyStamp,
      weeklyStamp: fresh.weeklyStamp,
      daily: saved.dailyStamp === fresh.dailyStamp && Array.isArray(saved.daily) ? saved.daily : [],
      weekly: saved.weeklyStamp === fresh.weeklyStamp && Array.isArray(saved.weekly) ? saved.weekly : [],
      periodic: Array.isArray(saved.periodic) ? saved.periodic : [],
    };
  } catch {
    return fresh;
  }
}

function normalizeChecklist(current: ChecklistState, date = new Date()): ChecklistState {
  const dailyStamp = localDayStamp(date);
  const weeklyStamp = localWeekStamp(date);
  if (current.dailyStamp === dailyStamp && current.weeklyStamp === weeklyStamp) return current;
  return {
    dailyStamp,
    weeklyStamp,
    daily: current.dailyStamp === dailyStamp ? current.daily : [],
    weekly: current.weeklyStamp === weeklyStamp ? current.weekly : [],
    periodic: current.periodic,
  };
}

function readRoute(): RouteState {
  if (typeof window === 'undefined') return EMPTY_ROUTE;
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('vista');
  const entryId = params.get('ficha') ?? '';
  const view: View = entryId
    ? 'guia'
    : requested === 'buscar' || requested === 'hoy' || requested === 'guia'
      ? requested
      : 'inicio';
  return {
    view,
    categoryId: params.get('categoria') ?? '',
    entryId,
    query: params.get('q') ?? '',
  };
}

function routeUrl(route: RouteState) {
  const params = new URLSearchParams();
  if (route.view !== 'inicio') params.set('vista', route.view);
  if (route.categoryId) params.set('categoria', route.categoryId);
  if (route.entryId) params.set('ficha', route.entryId);
  if (route.query) params.set('q', route.query);
  const query = params.toString();
  return `/consulta${query ? `?${query}` : ''}`;
}

function entriesForCategory(category: UiCategory) {
  const ids = new Set(category.entryIds);
  return allEntries.filter((entry) => ids.has(entry.id));
}

function chapterNumber(chapter: GuideChapter) {
  return chapter.number;
}

function chapterName(chapter: GuideChapter) {
  return chapter.title;
}

function getEntry(id: string) {
  return getGuideEntry(id);
}

function searchEntries(query: string) {
  return searchGuideEntries(query);
}

function entrySection(entry: GuideEntry) {
  return entry.sections[0] ?? 'cuidados';
}

function returnLabel() {
  try {
    const raw = sessionStorage.getItem(RETURN_KEY) ?? sessionStorage.getItem(LEGACY_RETURN_KEY);
    if (!raw) return 'IR A LA PELÍCULA';
    try {
      const parsed = JSON.parse(raw) as { label?: unknown; title?: unknown; chapter?: unknown };
      const candidate = [parsed.label, parsed.title, parsed.chapter].find((value) => typeof value === 'string');
      if (typeof candidate === 'string' && candidate.trim()) return `VOLVER A ${candidate.trim().toUpperCase()}`;
    } catch {
      // Older saved return points only stored a truthy flag.
    }
    return 'VOLVER A LA PELÍCULA';
  } catch {
    return 'IR A LA PELÍCULA';
  }
}

function SearchGlyph() {
  return <span className="consulta-search-glyph" aria-hidden="true" />;
}

function BrandMark() {
  return <span className="consulta-brand-mark" aria-hidden="true"><img src="/brand/aussiecare-icon.webp" alt="" /></span>;
}

type Navigate = (patch: Partial<RouteState>, options?: { replace?: boolean; keepScroll?: boolean }) => void;

function EntryCard({ entry, onOpen }: { entry: GuideEntry; onOpen: (entry: GuideEntry) => void }) {
  return (
    <button className="consulta-entry-card" data-section={entrySection(entry)} data-tone={entry.tone} type="button" onClick={() => onOpen(entry)}>
      <span className="consulta-entry-index">{String(entry.chapter).padStart(2, '0')}</span>
      <span className="consulta-entry-copy">
        <small>{entry.verdict}</small>
        <strong>{entry.title}</strong>
        <span>{entry.quickAnswer}</span>
      </span>
      <span className="consulta-arrow" aria-hidden="true">↗</span>
    </button>
  );
}

function CategoryCard({ category, onOpen }: { category: UiCategory; index: number; onOpen: (category: UiCategory) => void }) {
  const count = entriesForCategory(category).length;
  return (
    <button className="consulta-category-card" data-section={category.id} type="button" onClick={() => onOpen(category)}>
      <span className="consulta-category-number">{category.marker}</span>
      <strong>{category.label}</strong>
      <span>{category.description}</span>
      <small>{count} {count === 1 ? 'ficha' : 'fichas'} <b aria-hidden="true">→</b></small>
    </button>
  );
}

function EmptyResults({ query, navigate }: { query: string; navigate: Navigate }) {
  return (
    <div className="consulta-empty" role="status">
      <span aria-hidden="true">?</span>
      <h2>No encontré “{query}”</h2>
      <p>Prueba con una parte del nombre, una acción o una palabra como humo, fruta, plumas o jaula.</p>
      <button type="button" onClick={() => navigate({ view: 'guia', query: '', categoryId: '', entryId: '' })}>RECORRER LA GUÍA</button>
    </div>
  );
}

function HomeView({ navigate, checklist }: { navigate: Navigate; checklist: ChecklistState }) {
  const dailyTotal = CHECKLISTS[0].items.length;
  return (
    <div className="consulta-home">
      <section className="consulta-hero" aria-labelledby="consulta-home-title">
        <div className="consulta-hero-copy">
          <p className="consulta-kicker">MODO CONSULTA · DISPONIBLE SIN CONEXIÓN</p>
          <h1 id="consulta-home-title">Cuidar empieza<br /><em>por observar.</em></h1>
          <p>Respuestas breves para el momento en que las necesitas. Sin perder el hilo de la película.</p>
          <button className="consulta-search-launch" type="button" onClick={() => navigate({ view: 'buscar', categoryId: '', entryId: '' })}>
            <SearchGlyph />
            <span>¿Qué necesitas saber?</span>
            <kbd>BUSCAR</kbd>
          </button>
        </div>
        <div className="consulta-hero-bird" aria-hidden="true">
          <span>GUÍA DE CAMPO</span>
          {/* This transparent character cutout must keep its original aspect and alpha. */}
          <img src="/assets/bud-hero-curious-v1.webp" alt="" decoding="async" />
          <i>Melopsittacus undulatus</i>
        </div>
      </section>

      <PwaInstallCard />

      <section className="consulta-starter" aria-labelledby="consulta-starter-title">
        <header className="consulta-section-heading">
          <div><p className="consulta-kicker">PRIMER PERIQUITO · EMPIEZA AQUÍ</p><h2 id="consulta-starter-title">Seis respuestas para<br />la primera semana.</h2></div>
          <p>Un recorrido corto para preparar su llegada, reconocer su normal y saber cuándo actuar.</p>
        </header>
        <div className="consulta-starter-path">
          {starterEntries.map((entry, index) => (
            <button key={entry.id} type="button" data-tone={entry.tone} onClick={() => navigate({ view: 'guia', entryId: entry.id, categoryId: entrySection(entry), query: '' })}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <small>{entry.verdict}</small>
              <strong>{entry.title}</strong>
              <i aria-hidden="true">→</i>
            </button>
          ))}
        </div>
      </section>

      <aside className="consulta-emergency-strip" aria-labelledby="consulta-emergency-title">
        <div><p className="consulta-kicker">SEÑALES QUE NO ESPERAN</p><h2 id="consulta-emergency-title">Respirar con esfuerzo, sangrar, convulsionar o no poder posarse.</h2></div>
        <p>Reduce el estrés, llama a un servicio veterinario que atienda aves y sigue sus indicaciones para el traslado.</p>
        <button type="button" onClick={() => navigate({ view: 'guia', entryId: 'urgencias-en-una-mirada', categoryId: 'salud', query: '' })}>ABRIR GUÍA DE URGENCIA <span aria-hidden="true">→</span></button>
      </aside>

      <section className="consulta-section" aria-labelledby="consulta-access-title">
        <header className="consulta-section-heading">
          <div><p className="consulta-kicker">ENTRA POR AQUÍ</p><h2 id="consulta-access-title">Seis formas de consultar</h2></div>
          <p>La guía cambia de ritmo según lo que buscas.</p>
        </header>
        <div className="consulta-category-grid">
          {portalCategories.map((category, index) => <CategoryCard key={category.id} category={category} index={index} onOpen={(next) => navigate({ view: 'guia', categoryId: next.id, entryId: '', query: '' })} />)}
        </div>
      </section>

      <section className="consulta-today-preview" aria-labelledby="consulta-today-title">
        <div>
          <p className="consulta-kicker">HOY</p>
          <h2 id="consulta-today-title">Una rutina que cabe en la mano.</h2>
          <p>{checklist.daily.length} de {dailyTotal} cuidados diarios marcados en este dispositivo.</p>
        </div>
        <div className="consulta-today-ring" style={{ '--done': `${Math.round((checklist.daily.length / dailyTotal) * 360)}deg` } as CSSProperties} aria-hidden="true"><span>{checklist.daily.length}/{dailyTotal}</span></div>
        <button type="button" onClick={() => navigate({ view: 'hoy', categoryId: '', entryId: '', query: '' })}>ABRIR MI LISTA <span aria-hidden="true">→</span></button>
      </section>

      <section className="consulta-story-link">
        <span className="consulta-story-rule" aria-hidden="true" />
        <p className="consulta-kicker">DOS MODOS · UNA MISMA HISTORIA</p>
        <h2>¿Prefieres descubrirlo<br />en movimiento?</h2>
        <p>Vuelve a la película y deja que BUD-HERO te guíe capítulo por capítulo.</p>
        <a href="/?retorno=1">VER MODO EXPLORAR <span aria-hidden="true">↗</span></a>
      </section>
    </div>
  );
}

function SearchView({ route, navigate }: { route: RouteState; navigate: Navigate }) {
  const deferredQuery = useDeferredValue(route.query.trim());
  const results = useMemo(
    () => deferredQuery ? searchEntries(deferredQuery) : searchStarterEntries,
    [deferredQuery],
  );

  return (
    <section className="consulta-search-view" aria-labelledby="consulta-search-title">
      <div className="consulta-view-intro">
        <p className="consulta-kicker">BUSCADOR LOCAL</p>
        <h1 id="consulta-search-title">Pregunta con<br />palabras simples.</h1>
        <p>Busca alimento, conducta, objeto o señal entre {allEntries.length} fichas. Todo ocurre en tu dispositivo.</p>
      </div>
      <label className="consulta-search-field">
        <span className="sr-only">Buscar en la guía</span>
        <SearchGlyph />
        <input
          type="search"
          inputMode="search"
          value={route.query}
          onChange={(event) => navigate({ view: 'buscar', query: event.target.value, categoryId: '', entryId: '' }, { replace: true, keepScroll: true })}
          placeholder="Ej. no come, manzana, humo…"
          autoComplete="off"
        />
        {route.query ? <button type="button" onClick={() => navigate({ query: '' }, { replace: true, keepScroll: true })} aria-label="Limpiar búsqueda">×</button> : null}
      </label>
      <div className="consulta-search-suggestions" aria-label="Búsquedas sugeridas">
        {['primeros días', 'no come', 'heces', 'manzana', 'cables'].map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => navigate({ view: 'buscar', query: suggestion, categoryId: '', entryId: '' }, { replace: true, keepScroll: true })}>{suggestion}</button>
        ))}
      </div>
      <div className="consulta-result-meta" aria-live="polite">
        <span>{deferredQuery ? `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}` : 'PARA EMPEZAR'}</span>
        <i />
      </div>
      {deferredQuery && results.length === 0
        ? <EmptyResults query={deferredQuery} navigate={navigate} />
        : <div className="consulta-entry-list">{results.map((entry) => <EntryCard key={entry.id} entry={entry} onOpen={(next) => navigate({ view: 'guia', entryId: next.id })} />)}</div>}
    </section>
  );
}

function TodayView({ checklist, setChecklist }: { checklist: ChecklistState; setChecklist: Dispatch<SetStateAction<ChecklistState>> }) {
  const toggle = (group: ChecklistGroup, itemId: string) => {
    setChecklist((current) => {
      const values = current[group];
      return { ...current, [group]: values.includes(itemId) ? values.filter((id) => id !== itemId) : [...values, itemId] };
    });
  };
  const reset = (group: ChecklistGroup) => setChecklist((current) => ({ ...current, [group]: [] }));

  return (
    <section className="consulta-today-view" aria-labelledby="consulta-checklist-title">
      <div className="consulta-view-intro">
        <p className="consulta-kicker">CUIDADO LOCAL · SIN CUENTA</p>
        <h1 id="consulta-checklist-title">Hoy,<br /><em>paso a paso.</em></h1>
        <p>Marca lo que ya hiciste. La lista diaria y semanal se renueva sola; nada sale de este dispositivo.</p>
      </div>
      <div className="consulta-checklists">
        {CHECKLISTS.map((group) => {
          const done = checklist[group.id];
          return (
            <section className="consulta-checklist" data-list={group.id} key={group.id} aria-labelledby={`checklist-${group.id}`}>
              <header>
                <div><p className="consulta-kicker">{group.eyebrow}</p><h2 id={`checklist-${group.id}`}>{group.title}</h2></div>
                <span aria-label={`${done.length} de ${group.items.length} completados`}>{done.length}/{group.items.length}</span>
              </header>
              <p>{group.description}</p>
              <div className="consulta-check-items">
                {group.items.map((item) => (
                  <label key={item.id} className={done.includes(item.id) ? 'is-done' : ''}>
                    <input type="checkbox" checked={done.includes(item.id)} onChange={() => toggle(group.id, item.id)} />
                    <i aria-hidden="true">✓</i>
                    <span><strong>{item.label}</strong><small>{item.hint}</small></span>
                  </label>
                ))}
              </div>
              {done.length ? <button className="consulta-reset" type="button" onClick={() => reset(group.id)}>REINICIAR ESTA LISTA</button> : null}
            </section>
          );
        })}
      </div>
      <aside className="consulta-caution">
        <strong>Una lista acompaña; no diagnostica.</strong>
        <p>Si algo cambia de forma repentina o respirar parece difícil, no esperes a completar una casilla: contacta a un veterinario con experiencia en aves.</p>
      </aside>
    </section>
  );
}

function EntryDetail({ entry, categoryId, navigate }: { entry: GuideEntry; categoryId: string; navigate: Navigate }) {
  const sources = entry.sourceIds.map((sourceId) => sourceIndex[sourceId]).filter((source): source is Source => Boolean(source));
  const related = entry.relatedIds.map(getEntry).filter((candidate): candidate is GuideEntry => Boolean(candidate));
  const section = entrySection(entry);
  const exploreHref = entry.explore
    ? `/?fase=${encodeURIComponent(entry.explore.phase)}&beat=${encodeURIComponent(entry.explore.beatId)}`
    : '';

  return (
    <article className="consulta-detail" data-section={section} data-tone={entry.tone}>
      <button className="consulta-back" type="button" onClick={() => navigate({ view: 'guia', entryId: '', categoryId: categoryId || section })}><span aria-hidden="true">←</span> VOLVER A LA GUÍA</button>
      <header className="consulta-detail-header">
        <div>
          <p className="consulta-kicker">FICHA {String(entry.chapter).padStart(2, '0')} · {section}</p>
          <h1>{entry.title}</h1>
        </div>
        <span className="consulta-verdict-stamp">{entry.verdict}</span>
      </header>

      <section className="consulta-answer" aria-labelledby="consulta-answer-title">
        <p className="consulta-kicker" id="consulta-answer-title">RESPUESTA RÁPIDA</p>
        <p>{entry.quickAnswer}</p>
      </section>

      <div className="consulta-action-grid">
        <section>
          <span aria-hidden="true">01</span>
          <div><p className="consulta-kicker">QUÉ HACER</p><p>{entry.action}</p></div>
        </section>
        {entry.observe ? <section><span aria-hidden="true">02</span><div><p className="consulta-kicker">QUÉ OBSERVAR</p><p>{entry.observe}</p></div></section> : null}
      </div>

      {entry.details.length ? (
        <section className="consulta-details" aria-labelledby="consulta-details-title">
          <div className="consulta-section-heading"><div><p className="consulta-kicker">PARA ENTENDERLO MEJOR</p><h2 id="consulta-details-title">Los detalles importan.</h2></div></div>
          <div>{entry.details.map((detail, index) => <article key={`${entry.id}-${detail.heading}`}><span>{String(index + 1).padStart(2, '0')}</span><h3>{detail.heading}</h3><p>{detail.text}</p></article>)}</div>
        </section>
      ) : null}

      {entry.explore ? <a className="consulta-film-link" href={exploreHref}>
        <span><small>EN CONTEXTO</small><strong>VER EN LA PELÍCULA</strong></span>
        <b aria-hidden="true">↗</b>
      </a> : null}

      {related.length ? (
        <section className="consulta-related" aria-labelledby="consulta-related-title">
          <div className="consulta-section-heading"><div><p className="consulta-kicker">SIGUE CONSULTANDO</p><h2 id="consulta-related-title">Relacionado</h2></div></div>
          <div className="consulta-entry-list">{related.map((candidate) => <EntryCard key={candidate.id} entry={candidate} onOpen={(next) => navigate({ entryId: next.id, categoryId })} />)}</div>
        </section>
      ) : null}

      {sources.length ? (
        <section className="consulta-sources" aria-labelledby="consulta-sources-title">
          <p className="consulta-kicker" id="consulta-sources-title">FUENTES DE ESTA FICHA</p>
          <div>{sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<span aria-hidden="true">↗</span></a>)}</div>
        </section>
      ) : null}
    </article>
  );
}

function GuideView({ route, navigate }: { route: RouteState; navigate: Navigate }) {
  const entry = route.entryId ? getEntry(route.entryId) : undefined;
  if (entry) return <EntryDetail entry={entry} categoryId={route.categoryId} navigate={navigate} />;

  const category = [...portalCategories, ...chapterCategories].find((candidate) => candidate.id === route.categoryId);
  if (category) {
    const entries = entriesForCategory(category);
    return (
      <section className="consulta-category-view" data-section={category.id} aria-labelledby="consulta-category-title">
        <button className="consulta-back" type="button" onClick={() => navigate({ categoryId: '', entryId: '' })}><span aria-hidden="true">←</span> TODAS LAS CATEGORÍAS</button>
        <header className="consulta-category-hero">
          <span>{category.marker}</span>
          <div><p className="consulta-kicker">{category.eyebrow}</p><h1 id="consulta-category-title">{category.label}</h1><p>{category.description}</p></div>
        </header>
        <div className="consulta-result-meta"><span>{entries.length} {entries.length === 1 ? 'ficha' : 'fichas'}</span><i /></div>
        <div className="consulta-entry-list">{entries.map((candidate) => <EntryCard key={candidate.id} entry={candidate} onOpen={(next) => navigate({ entryId: next.id })} />)}</div>
      </section>
    );
  }

  return (
    <section className="consulta-guide-view" aria-labelledby="consulta-guide-title">
      <div className="consulta-view-intro">
        <p className="consulta-kicker">ÍNDICE DE CAMPO</p>
        <h1 id="consulta-guide-title">Toda la guía,<br />a tu manera.</h1>
        <p>Entra por tema o recorre los capítulos en el mismo orden de la película.</p>
      </div>
      <div className="consulta-category-grid consulta-category-grid-wide">
        {chapterCategories.map((next, index) => <CategoryCard key={next.id} category={next} index={index} onOpen={(selected) => navigate({ categoryId: selected.id, entryId: '', query: '' })} />)}
      </div>
      <section className="consulta-chapters" aria-labelledby="consulta-chapters-title">
        <div className="consulta-section-heading"><div><p className="consulta-kicker">COMO EN LA PELÍCULA</p><h2 id="consulta-chapters-title">Capítulo por capítulo</h2></div></div>
        <div>
          {allChapters.map((chapter) => {
            const number = chapterNumber(chapter);
            const count = chapter.entryIds.length;
            const firstEntry = chapter.entryIds[0] ? getEntry(chapter.entryIds[0]) : undefined;
            return (
              <button key={String(chapter.id)} type="button" disabled={!firstEntry} onClick={() => firstEntry && navigate({ entryId: firstEntry.id, categoryId: entrySection(firstEntry) })}>
                <span>{String(number).padStart(2, '0')}</span>
                <div><small>{chapter.kicker}</small><strong>{chapterName(chapter)}</strong><p>{count} {count === 1 ? 'ficha' : 'fichas'} para consultar.</p></div>
                <b aria-hidden="true">→</b>
              </button>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function Navigation({ active, navigate }: { active: View; navigate: Navigate }) {
  return (
    <nav className="consulta-navigation" aria-label="Modo Consulta">
      {VIEWS.map((view) => (
        <button key={view.id} type="button" className={active === view.id ? 'is-active' : ''} aria-current={active === view.id ? 'page' : undefined} onClick={() => navigate({ view: view.id, categoryId: '', entryId: '', query: view.id === 'buscar' ? undefined : '' })}>
          <span aria-hidden="true">{view.glyph}</span><strong>{view.label}</strong>
        </button>
      ))}
    </nav>
  );
}

export default function ConsultationApp() {
  const [route, setRoute] = useState<RouteState>(EMPTY_ROUTE);
  const [checklist, setChecklist] = useState<ChecklistState>(() => blankChecklist());
  const [storageReady, setStorageReady] = useState(false);
  const [filmLabel, setFilmLabel] = useState('IR A LA PELÍCULA');
  const previousFocusKey = useRef('');

  useEffect(() => {
    const hydrationFrame = requestAnimationFrame(() => {
      setRoute(readRoute());
      setChecklist(readChecklist());
      setFilmLabel(returnLabel());
      setStorageReady(true);
    });
    const onPopState = () => setRoute(readRoute());
    window.addEventListener('popstate', onPopState);
    return () => {
      cancelAnimationFrame(hydrationFrame);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
    } catch {
      // Private browsing and storage policies must not block the guide.
    }
  }, [checklist, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    const refresh = () => setChecklist((current) => normalizeChecklist(current));
    const onVisibility = () => {
      if (!document.hidden) refresh();
    };
    const interval = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    const focusKey = `${route.view}:${route.categoryId}:${route.entryId}`;
    if (!previousFocusKey.current) {
      previousFocusKey.current = focusKey;
      return;
    }
    if (previousFocusKey.current === focusKey) return;
    previousFocusKey.current = focusKey;
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('#consulta-main h1');
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [route.view, route.categoryId, route.entryId, storageReady]);

  const navigate: Navigate = (patch, options) => {
    setRoute((current) => {
      const next: RouteState = {
        view: patch.view ?? current.view,
        categoryId: patch.categoryId ?? current.categoryId,
        entryId: patch.entryId ?? current.entryId,
        query: patch.query ?? current.query,
      };
      const method = options?.replace ? 'replaceState' : 'pushState';
      window.history[method]({}, '', routeUrl(next));
      if (!options?.keepScroll) window.scrollTo({ top: 0, behavior: 'instant' });
      return next;
    });
  };

  return (
    <div className="consulta-shell" data-view={route.view}>
      <a className="consulta-skip" href="#consulta-main">Saltar al contenido</a>
      <header className="consulta-topbar">
        <button className="consulta-brand" type="button" onClick={() => navigate({ view: 'inicio', categoryId: '', entryId: '', query: '' })} aria-label="Ir al inicio de Modo Consulta">
          <BrandMark />
          <span><strong>AussieCare</strong><small>MODO CONSULTA</small></span>
        </button>
        <a className="consulta-film-return" href="/?retorno=1" aria-label={filmLabel}>
          <span className="consulta-film-label"><span className="consulta-film-label-long">{filmLabel}</span><span className="consulta-film-label-short" aria-hidden="true">PELÍCULA</span></span>
          <i aria-hidden="true">↗</i>
        </a>
      </header>

      <Navigation active={route.view} navigate={navigate} />

      <main id="consulta-main" className="consulta-main" tabIndex={-1}>
        {route.view === 'inicio' ? <HomeView navigate={navigate} checklist={checklist} /> : null}
        {route.view === 'buscar' ? <SearchView route={route} navigate={navigate} /> : null}
        {route.view === 'hoy' ? <TodayView checklist={checklist} setChecklist={setChecklist} /> : null}
        {route.view === 'guia' ? <GuideView route={route} navigate={navigate} /> : null}
      </main>

      <section className="consulta-signature-banner" aria-label="Firma y banner de AussieCare"><AussieCareSignature compact /></section>

      <footer className="consulta-footer">
        <BrandMark />
        <p>Una guía educativa para observar mejor. No sustituye la valoración de un veterinario con experiencia en aves.</p>
        <a href="/?retorno=1">MODO EXPLORAR <span aria-hidden="true">↗</span></a>
      </footer>
    </div>
  );
}
