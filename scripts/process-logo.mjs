import { rename, unlink } from 'node:fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public/images/logo.png');
const logoOutput = path.join(root, 'public/images/logo.png');
const logoTemp = path.join(root, 'public/images/logo.tmp.png');
const faviconOutput = path.join(root, 'public/favicon.png');
const faviconTemp = path.join(root, 'public/favicon.tmp.png');

const LOGO_SIZE = 640;
const FAVICON_SIZE = 192;

function isBackground(r, g, b, a) {
  if (a < 128) return true;
  return r > 200 && g > 200 && b > 200 && Math.max(r, g, b) - Math.min(r, g, b) < 28;
}

function isColorful(r, g, b, a) {
  if (a < 128) return false;
  return !isBackground(r, g, b, a);
}

/** Circular emblem with white/checkerboard matte removed. */
async function processLogoEmblem(input, size) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.295;
  const radiusSq = radius * radius;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const dx = x - cx;
      const dy = y - cy;

      if (dx * dx + dy * dy > radiusSq) {
        data[i + 3] = 0;
        continue;
      }

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (!isBackground(r, g, b, a)) continue;

      let keep = false;
      for (let oy = -2; oy <= 2; oy += 1) {
        for (let ox = -2; ox <= 2; ox += 1) {
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const j = (ny * width + nx) * channels;
          if (isColorful(data[j], data[j + 1], data[j + 2], data[j + 3])) {
            keep = true;
            break;
          }
        }
        if (keep) break;
      }

      if (!keep) {
        data[i + 3] = 0;
      }
    }
  }

  const trimmed = await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();

  return sharp(trimmed)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function writeImage(input, tempPath, finalPath, size) {
  const processed = await processLogoEmblem(input, size);
  await sharp(processed).toFile(tempPath);
  await unlink(finalPath).catch(() => undefined);
  await rename(tempPath, finalPath);
}

const meta = await sharp(source).metadata();
await writeImage(source, logoTemp, logoOutput, LOGO_SIZE);
await writeImage(source, faviconTemp, faviconOutput, FAVICON_SIZE);

console.log(`Wrote ${logoOutput} (${LOGO_SIZE}x${LOGO_SIZE}, circular transparent)`);
console.log(`Wrote ${faviconOutput} (${FAVICON_SIZE}x${FAVICON_SIZE}, circular transparent)`);
console.log(`Source: ${source} (${meta.width}x${meta.height})`);
