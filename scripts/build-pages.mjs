import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

function inferSiteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_ORIGIN) return process.env.NEXT_PUBLIC_SITE_ORIGIN;
  if (process.env.GITHUB_REPOSITORY_OWNER) {
    return `https://${process.env.GITHUB_REPOSITORY_OWNER.toLowerCase()}.github.io`;
  }

  try {
    const packageJson = JSON.parse(readFileSync(path.resolve('package.json'), 'utf8'));
    const repositoryUrl = typeof packageJson.repository === 'string'
      ? packageJson.repository
      : packageJson.repository?.url;
    const owner = String(repositoryUrl ?? '').match(/github\.com[/:]([^/]+)\//i)?.[1];
    if (owner) return `https://${owner.toLowerCase()}.github.io`;
  } catch {
    // Next.js can still export without absolute social metadata.
  }

  return '';
}

const nextBin = path.resolve('node_modules/next/dist/bin/next');
const environment = {
  ...process.env,
  GITHUB_PAGES: 'true',
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '/AussieCare',
  NEXT_PUBLIC_SITE_ORIGIN: inferSiteOrigin(),
};

const build = spawn(process.execPath, [nextBin, 'build'], {
  env: environment,
  stdio: 'inherit',
});

build.once('error', (error) => {
  console.error('No se pudo iniciar la exportación de GitHub Pages.', error);
  process.exitCode = 1;
});

build.once('exit', (code, signal) => {
  if (signal) {
    console.error(`La exportación terminó por la señal ${signal}.`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
