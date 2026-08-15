import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Full-scene ultra-wide desktop carousel art (24:7), high resolution.
 * Fits the entire source photograph by height so nothing is cropped,
 * then extends the sides with a clean color-matched gradient sampled
 * from the photo's own edge pixels (no blur, no mirrored photo content).
 * Independence Square is not touched.
 */
const TARGET_W = 4800;
const TARGET_H = 1400;
const BAND_COUNT = 10;
const GALLERY_DIR = path.join('public', 'images', 'gallery');

async function createGrainOverlay(width, height, intensity = 2.2) {
  const size = width * height * 3;
  const data = Buffer.alloc(size);

  for (let i = 0; i < size; i += 3) {
    const noise = Math.round((Math.random() - 0.5) * intensity);
    data[i] = 128 + noise;
    data[i + 1] = 128 + noise;
    data[i + 2] = 128 + noise;
  }

  return sharp(data, {
    raw: { width, height, channels: 3 },
  })
    .png()
    .toBuffer();
}

async function applyPhotographicFinish(buffer, outputPath) {
  const grain = await createGrainOverlay(TARGET_W, TARGET_H, 1.6);

  await sharp(buffer)
    .modulate({ saturation: 0.99, brightness: 1, hue: 0 })
    .composite([{ input: grain, blend: 'overlay', opacity: 0.012 }])
    .webp({ quality: 95, effort: 6, smartSubsample: true })
    .toFile(outputPath);
}

async function averageRgb(buffer, left, top, width, height) {
  const { data, info } = await sharp(buffer)
    .extract({ left, top, width, height })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  let r = 0;
  let g = 0;
  let b = 0;
  const pixels = data.length / channels;

  for (let i = 0; i < data.length; i += channels) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  return [Math.round(r / pixels), Math.round(g / pixels), Math.round(b / pixels)];
}

/**
 * Solid color-matched panel: samples the photo's own edge column in
 * horizontal bands and builds a smooth top-to-bottom gradient from those
 * exact colors, so the fill reads as a seamless continuation of the sky
 * or ground rather than a blurred copy of the photo.
 */
async function createEnvironmentPanel(coreBuffer, coreWidth, side, panelWidth) {
  const sampleW = Math.min(6, coreWidth);
  const sampleLeft = side === 'left' ? 0 : coreWidth - sampleW;
  const bandH = Math.max(1, Math.round(TARGET_H / BAND_COUNT));

  const stops = [];
  for (let i = 0; i < BAND_COUNT; i += 1) {
    const top = Math.min(TARGET_H - bandH, i * bandH);
    const [r, g, b] = await averageRgb(coreBuffer, sampleLeft, top, sampleW, bandH);
    const offset = ((i / (BAND_COUNT - 1)) * 100).toFixed(2);
    stops.push(`<stop offset="${offset}%" stop-color="rgb(${r},${g},${b})"/>`);
  }

  const svg = `<svg width="${panelWidth}" height="${TARGET_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
        ${stops.join('\n        ')}
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#panel)"/>
  </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function createUltraWideDesktopImage(inputPath, outputPath, options) {
  const { leftBias = 0.5 } = options;
  const image = sharp(inputPath).rotate();
  const meta = await image.metadata();

  if (!meta.width || !meta.height) {
    throw new Error(`Missing dimensions for ${inputPath}`);
  }

  // Fit the full photograph by height — no vertical or horizontal cropping.
  const scale = TARGET_H / meta.height;
  const coreW = Math.round(meta.width * scale);
  const coreH = TARGET_H;

  if (coreW > TARGET_W) {
    throw new Error(`${inputPath} is too wide after height fit (${coreW}px > ${TARGET_W}px).`);
  }

  const core = await image
    .clone()
    .resize({ width: coreW, height: coreH, fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const gapTotal = TARGET_W - coreW;
  const leftGap = Math.round(gapTotal * leftBias);
  const rightGap = gapTotal - leftGap;

  const composites = [];

  if (leftGap > 0) {
    composites.push({
      input: await createEnvironmentPanel(core, coreW, 'left', leftGap),
      left: 0,
      top: 0,
    });
  }

  composites.push({ input: core, left: leftGap, top: 0 });

  if (rightGap > 0) {
    composites.push({
      input: await createEnvironmentPanel(core, coreW, 'right', rightGap),
      left: leftGap + coreW,
      top: 0,
    });
  }

  const composed = await sharp({
    create: {
      width: TARGET_W,
      height: TARGET_H,
      channels: 3,
      background: { r: 20, g: 18, b: 16 },
    },
  })
    .composite(composites)
    .jpeg({ quality: 97 })
    .toBuffer();

  await applyPhotographicFinish(composed, outputPath);

  const finalMeta = await sharp(outputPath).metadata();

  return {
    source: `${meta.width}x${meta.height}`,
    core: `${coreW}x${coreH}`,
    leftGap,
    rightGap,
    output: `${finalMeta.width}x${finalMeta.height}`,
  };
}

const slides = [
  {
    // Same scene as mobile carousel slide.
    input: 'hero-carousel-nkrumah.jpg',
    output: 'kwame-nkrumah-desktop-4800x1400.webp',
    leftBias: 0.52,
  },
  {
    input: 'hero-carousel-jubilee-house.jpg',
    output: 'flagstaff-house-desktop-4800x1400.webp',
    leftBias: 0.5,
  },
];

await mkdir(GALLERY_DIR, { recursive: true });

for (const slide of slides) {
  const inputPath = path.join(GALLERY_DIR, slide.input);
  const outputPath = path.join(GALLERY_DIR, slide.output);

  console.log(`\nComposing ${slide.input} -> ${slide.output}`);
  const result = await createUltraWideDesktopImage(inputPath, outputPath, slide);
  console.log(`  Source: ${result.source}`);
  console.log(`  Full photo core (uncropped): ${result.core}`);
  console.log(`  Left panel: ${result.leftGap}px, right panel: ${result.rightGap}px`);
  console.log(`  Output: ${result.output}`);
}

console.log('\nDone. Independence Square desktop image was not modified.');
