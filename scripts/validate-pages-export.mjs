import { promises as fs } from 'node:fs';
import path from 'node:path';

const outputRoot = path.resolve('out');
const configuredBase = process.env.NEXT_PUBLIC_BASE_PATH ?? '/AussieCare';
const basePath = `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;
const failures = [];

const requiredFiles = [
  'index.html',
  '404.html',
  'consulta/index.html',
  'manifest.webmanifest',
  'brand/aussiecare-share-v1.png',
  'sw.js',
  '.nojekyll',
];

async function isFile(filePath) {
  try {
    return (await fs.stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

async function validateManifestAsset(reference, label) {
  const value = String(reference ?? '');
  if (!value) {
    failures.push(`${label} no declara un recurso.`);
    return;
  }
  if (/^(?:[a-z]+:)?\/\//i.test(value)) return;
  if (value.startsWith('/')) {
    failures.push(`${label} fuera del scope: ${value}`);
    return;
  }

  const relative = value.replace(/^\.\//, '').split(/[?#]/, 1)[0];
  if (!(await isFile(path.join(outputRoot, relative)))) {
    failures.push(`${label} no existe en la exportación: ${value}`);
  }
}

for (const relative of requiredFiles) {
  if (!(await isFile(path.join(outputRoot, relative)))) failures.push(`Falta out/${relative}`);
}

const manifestPath = path.join(outputRoot, 'manifest.webmanifest');
if (await isFile(manifestPath)) {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  if (manifest.id !== './') failures.push('El manifest debe usar id "./".');
  if (manifest.scope !== './') failures.push('El manifest debe mantener el scope dentro del proyecto.');
  if (!String(manifest.start_url ?? '').startsWith('./')) failures.push('El start_url del manifest debe ser relativo.');
  for (const icon of manifest.icons ?? []) {
    await validateManifestAsset(icon.src, 'Icono del manifest');
  }
  for (const screenshot of manifest.screenshots ?? []) {
    await validateManifestAsset(screenshot.src, 'Captura del manifest');
  }
  for (const shortcut of manifest.shortcuts ?? []) {
    for (const icon of shortcut.icons ?? []) {
      await validateManifestAsset(icon.src, `Icono del acceso ${shortcut.name ?? 'sin nombre'}`);
    }
  }
}

const workerPath = path.join(outputRoot, 'sw.js');
if (await isFile(workerPath)) {
  const worker = await fs.readFile(workerPath, 'utf8');
  for (const marker of ['self.registration.scope', "scoped('/consulta/')", '.map(scoped)', 'aussiecare-pages-v4']) {
    if (!worker.includes(marker)) failures.push(`El service worker no contiene ${marker}.`);
  }
}

const exportedFiles = await walk(outputRoot);
const htmlFiles = exportedFiles.filter((file) => file.endsWith('.html'));
const cssFiles = exportedFiles.filter((file) => file.endsWith('.css'));

const rootHtmlPath = path.join(outputRoot, 'index.html');
if (await isFile(rootHtmlPath)) {
  const rootHtml = await fs.readFile(rootHtmlPath, 'utf8');
  const configuredOrigin = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://luics415.github.io').replace(/\/$/, '');
  const socialCardUrl = `${configuredOrigin}${basePath}/brand/aussiecare-share-v1.png`;
  for (const marker of [
    'property="og:image"',
    'name="twitter:card"',
    'content="summary_large_image"',
    socialCardUrl,
  ]) {
    if (!rootHtml.includes(marker)) failures.push(`La portada no contiene el metadato social requerido: ${marker}`);
  }
}

for (const htmlFile of htmlFiles) {
  const html = await fs.readFile(htmlFile, 'utf8');
  if (html.includes(`${basePath}${basePath}/`)) {
    failures.push(`${path.relative(outputRoot, htmlFile)} duplica el basePath ${basePath}.`);
  }
  for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
    const reference = match[1];
    if (/^(?:[a-z]+:)?\/\//i.test(reference) || /^(?:#|data:|blob:|mailto:|tel:)/i.test(reference)) continue;
    if (reference.startsWith('/') && reference !== basePath && !reference.startsWith(`${basePath}/`)) {
      failures.push(`${path.relative(outputRoot, htmlFile)} apunta fuera de ${basePath}: ${reference}`);
      continue;
    }
    if (!reference.startsWith(basePath)) continue;

    const pathname = reference.slice(basePath.length).split(/[?#]/, 1)[0] || '/';
    const localRelative = pathname.endsWith('/')
      ? `${pathname.slice(1)}index.html`
      : pathname.slice(1);
    if (localRelative && !(await isFile(path.join(outputRoot, localRelative)))) {
      failures.push(`No existe el recurso exportado para ${reference}`);
    }
  }
}

for (const cssFile of cssFiles) {
  const css = await fs.readFile(cssFile, 'utf8');
  for (const match of css.matchAll(/url\((?:["'])?(\/[^)"']+)/g)) {
    const reference = match[1];
    if (reference !== basePath && !reference.startsWith(`${basePath}/`)) {
      failures.push(`${path.relative(outputRoot, cssFile)} contiene URL fuera de ${basePath}: ${reference}`);
    }
  }
}

if (failures.length) {
  console.error(`La exportación de Pages tiene ${failures.length} problema(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`GitHub Pages validado: ${exportedFiles.length} archivos bajo ${basePath}/.`);
}
