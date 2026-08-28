import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const projectRoot = resolve(import.meta.dirname, '..');
const publicRoot = resolve(projectRoot, 'public');
const iconRoot = resolve(publicRoot, 'icons');
const brandRoot = resolve(publicRoot, 'brand');
const sourceRoot = resolve(projectRoot, 'art', 'social');
const sourceAssetRoot = resolve(projectRoot, 'art', 'source-assets');
const brandSourceRoot = resolve(projectRoot, 'art', 'brand');

const filmAssets = [
  'australia-master',
  'bud-hero-style-lock',
  'bud-hero-flight-v2',
  'bud-hero-perched-v3',
  'bud-hero-fluffed-scene-v2',
  'bud-hero-step-up-scene-v2',
  'bud-hero-trust-approach-v1',
  'bud-hero-trust-approach-desktop-v1',
  'bud-hero-singing-v1',
  'bud-hero-preening-v1',
  'bud-hero-foraging-v1',
  'bud-hero-curious-v1',
  'bud-hero-urgent-v1',
  'aussiecare-cage-v1',
  'cage-cleaning-steps-v1',
  'millet-reward-v1',
  'natural-perch-v1',
  'trust-hand-v1',
  'room-base-empty-v3',
  'room-base-canonical-cage-v2',
  'enrichment-board-v2',
  'food-table-v2',
  'room-hazards-v2',
  'avian-vet-clinic-v2',
  'bud-hero-return-australia-v2',
];

await mkdir(iconRoot, { recursive: true });
await mkdir(brandRoot, { recursive: true });

for (const name of filmAssets) {
  await sharp(resolve(sourceAssetRoot, `${name}.png`))
    .webp({ quality: 90, alphaQuality: 100, smartSubsample: true })
    .toFile(resolve(publicRoot, 'assets', `${name}.webp`));
}

const iconSource = resolve(brandSourceRoot, 'aussiecare-icon.png');

async function roundedIcon(size) {
  const mask = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" rx="${Math.round(size * .22)}" fill="white"/></svg>`);
  return sharp(iconSource)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function makeIcon(size, output, maskable = false) {
  if (!maskable) {
    await sharp(await roundedIcon(size))
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(resolve(iconRoot, output));
    return;
  }

  const safeSize = Math.round(size * .84);
  const safeIcon = await roundedIcon(safeSize);
  await sharp({ create: { width: size, height: size, channels: 3, background: '#d8e3b8' } })
    .composite([{ input: safeIcon, gravity: 'centre' }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(resolve(iconRoot, output));
}

await makeIcon(192, 'icon-192.png');
await makeIcon(512, 'icon-512.png');
await makeIcon(512, 'icon-maskable-512.png', true);
await makeIcon(180, 'apple-touch-icon.png');
await makeIcon(64, 'favicon-64.png');

await sharp(await roundedIcon(1024))
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(resolve(brandRoot, 'aussiecare-icon.webp'));

await sharp(resolve(brandSourceRoot, 'signature-budgies-user-supplied.png'))
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(resolve(brandRoot, 'signature-budgies.webp'));

await sharp(resolve(sourceRoot, 'aussiecare-og-generated.png'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(resolve(publicRoot, 'og.png'));

console.log(`Optimized ${filmAssets.length} film assets, brand media, five app icons, and the 1200x630 social card.`);
