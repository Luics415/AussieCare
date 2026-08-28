import path from 'node:path';
import sharp from 'sharp';

const input = process.argv[2] ?? 'art/source-assets/bud-hero-behavior-sheet-v1.png';
const outputDirectory = process.argv[3] ?? 'art/source-assets';
const canvasWidth = 600;
const canvasHeight = 1067;
const inset = 30;

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const labels = new Int32Array(width * height);
const components = [];
let label = 0;

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const seed = y * width + x;
    if (labels[seed] || data[seed * channels + 3] === 0) continue;
    label += 1;
    labels[seed] = label;
    const stack = [seed];
    let count = 0;
    let minX = x;
    let maxX = x;
    let minY = y;
    let maxY = y;

    while (stack.length) {
      const index = stack.pop();
      const px = index % width;
      const py = Math.floor(index / width);
      count += 1;
      minX = Math.min(minX, px);
      maxX = Math.max(maxX, px);
      minY = Math.min(minY, py);
      maxY = Math.max(maxY, py);

      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = px + dx;
          const ny = py + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const next = ny * width + nx;
          if (!labels[next] && data[next * channels + 3] > 0) {
            labels[next] = label;
            stack.push(next);
          }
        }
      }
    }

    if (count > 1000) components.push({ label, count, minX, maxX, minY, maxY });
  }
}

if (components.length !== 4) {
  throw new Error(`Expected four character components, found ${components.length}.`);
}

const poses = components
  .map((component) => ({
    ...component,
    name: (component.minY + component.maxY) / 2 < height / 2
      ? component.minX < width / 2 ? 'singing' : 'preening'
      : component.minX < width / 2 ? 'foraging' : 'curious',
  }))
  .sort((a, b) => ['singing', 'preening', 'foraging', 'curious'].indexOf(a.name) - ['singing', 'preening', 'foraging', 'curious'].indexOf(b.name));

for (const pose of poses) {
  const cropWidth = pose.maxX - pose.minX + 1;
  const cropHeight = pose.maxY - pose.minY + 1;
  const isolated = Buffer.alloc(cropWidth * cropHeight * 4);

  for (let y = pose.minY; y <= pose.maxY; y += 1) {
    for (let x = pose.minX; x <= pose.maxX; x += 1) {
      const sourceIndex = y * width + x;
      if (labels[sourceIndex] !== pose.label) continue;
      const targetIndex = ((y - pose.minY) * cropWidth + (x - pose.minX)) * 4;
      const pixelIndex = sourceIndex * channels;
      isolated[targetIndex] = data[pixelIndex];
      isolated[targetIndex + 1] = data[pixelIndex + 1];
      isolated[targetIndex + 2] = data[pixelIndex + 2];
      isolated[targetIndex + 3] = data[pixelIndex + 3];
    }
  }

  const resized = await sharp(isolated, { raw: { width: cropWidth, height: cropHeight, channels: 4 } })
    .resize(canvasWidth - inset * 2, canvasHeight - inset * 2, {
      fit: 'inside',
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer({ resolveWithObject: true });

  const left = Math.round((canvasWidth - resized.info.width) / 2);
  const top = Math.round((canvasHeight - resized.info.height) / 2);
  const output = path.join(outputDirectory, `bud-hero-${pose.name}-v1.png`);
  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized.data, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(output);

  console.log(`${pose.name}: ${cropWidth}x${cropHeight} -> ${output}`);
}
