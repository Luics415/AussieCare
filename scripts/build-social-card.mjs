import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const width = 1200;
const height = 630;
const projectRoot = path.resolve(import.meta.dirname, '..');
const brandRoot = path.resolve(projectRoot, 'public', 'brand');
const signaturePath = path.resolve(brandRoot, 'luics415-signature.webp');
const budgiesPath = path.resolve(brandRoot, 'signature-budgies.webp');
const outputPath = path.resolve(brandRoot, 'aussiecare-share-v1.png');

await mkdir(brandRoot, { recursive: true });

async function recolorSignature() {
  const resized = await sharp(signaturePath)
    .resize({ width: 570, withoutEnlargement: false })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.from(resized.data);

  for (let index = 0; index < rgba.length; index += 4) {
    rgba[index] = 255;
    rgba[index + 1] = 245;
    rgba[index + 2] = 157;
  }

  return sharp(rgba, {
    raw: {
      width: resized.info.width,
      height: resized.info.height,
      channels: 4,
    },
  }).png().toBuffer();
}

const signature = await recolorSignature();
const budgies = await sharp(budgiesPath)
  .resize({ width: 390, height: 390, fit: 'contain' })
  .png()
  .toBuffer();

const seedShapes = [
  [58, 64, -24, 1],
  [91, 46, 13, .82],
  [121, 72, 37, 1.08],
  [155, 41, -13, .74],
  [185, 75, 24, .92],
  [217, 50, -31, .7],
  [244, 81, 12, .8],
  [78, 94, 41, .66],
].map(([x, y, rotation, scale], index) => `
  <g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})">
    <ellipse cx="0" cy="0" rx="14" ry="6.5" fill="url(#seed${index % 3})" stroke="#7a5126" stroke-opacity=".72" stroke-width="1.3"/>
    <ellipse cx="-4" cy="-2" rx="5" ry="1.7" fill="#fff7c8" fill-opacity=".72"/>
  </g>`).join('');

const background = Buffer.from(`
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4b8b49"/>
      <stop offset=".52" stop-color="#326d3b"/>
      <stop offset="1" stop-color="#173e29"/>
    </linearGradient>
    <radialGradient id="halo">
      <stop offset="0" stop-color="#f3e9d2" stop-opacity=".98"/>
      <stop offset=".58" stop-color="#f3e9d2" stop-opacity=".86"/>
      <stop offset="1" stop-color="#f3e9d2" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="seed0" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff0ad"/><stop offset=".6" stop-color="#d7aa51"/><stop offset="1" stop-color="#8e6327"/>
    </linearGradient>
    <linearGradient id="seed1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8d976"/><stop offset=".62" stop-color="#bd873d"/><stop offset="1" stop-color="#795020"/>
    </linearGradient>
    <linearGradient id="seed2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f4e2b5"/><stop offset=".65" stop-color="#c69c64"/><stop offset="1" stop-color="#76502c"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#245cba"/><stop offset=".52" stop-color="#36b7b4"/><stop offset="1" stop-color="#f4c84a"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#07130c" flood-opacity=".42"/>
    </filter>
  </defs>
  <rect width="1200" height="630" rx="30" fill="url(#background)"/>
  <circle cx="982" cy="288" r="234" fill="url(#halo)"/>
  <circle cx="1120" cy="68" r="155" fill="#88b94b" fill-opacity=".1"/>
  ${seedShapes}
  <text x="324" y="353" text-anchor="middle" fill="#f3e9d2" fill-opacity=".2" font-family="Segoe UI Symbol, DejaVu Sans, sans-serif" font-size="330">⚓</text>
  <text x="78" y="164" fill="#f3e9d2" fill-opacity=".82" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="5">FIRMA DE AUSSIECARE</text>
  <text x="120" y="442" fill="#f3e9d2" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="600">Software Developer</text>
  <text x="379" y="442" fill="#f4c84a" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="800">AussieCare</text>
  <line x1="78" y1="493" x2="688" y2="493" stroke="#f3e9d2" stroke-opacity=".28" stroke-width="2"/>
  <text x="78" y="538" fill="#f3e9d2" fill-opacity=".94" font-family="Arial, Helvetica, sans-serif" font-size="21">Guía visual para comprender y cuidar a tu periquito</text>
  <text x="78" y="579" fill="#8ee0d6" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="1.5">luics415.github.io/AussieCare/</text>
  <rect y="616" width="1200" height="14" fill="url(#accent)"/>
</svg>`);

await sharp(background)
  .composite([
    { input: signature, left: 78, top: 204, blend: 'over' },
    { input: budgies, left: 785, top: 114, blend: 'multiply' },
  ])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outputPath);

console.log(`Tarjeta social creada: ${path.relative(projectRoot, outputPath)} (${width}x${height}).`);
