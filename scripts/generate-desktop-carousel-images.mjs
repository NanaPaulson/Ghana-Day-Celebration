import { mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const TARGET_W = 2400;
const TARGET_H = 700;
const GALLERY_DIR = 'public/images/gallery';
const CANVAS_BG = { r: 14, g: 13, b: 12 }; // --color-dark

/**
 * Desktop carousel art from mobile hero JPEGs (3840×2160).
 * All slides use the same width-normalized crop to 2400×700 (24:7),
 * matching the Independence Square / Black Star Square full-bleed layout.
 * Independence Square crop is locked — regenerate only when explicitly enabled.
 *
 * Outputs must match `cultureImages` desktop paths in src/data/culture-images.ts.
 */
const slides = [
  {
    input: 'hero-carousel-nkrumah.jpg',
    output: 'kwame-nkrumah-desktop-2400x700.webp',
    mode: 'crop',
    // Keep statue head + mausoleum; slightly below center like Independence.
    cropTopRatio: 0.34,
    regenerate: true,
  },
  {
    input: 'hero-carousel-independence-square.jpg',
    output: 'hero-carousel-independence-square-desktop-2400x700.webp',
    mode: 'crop',
    cropTopRatio: 0.38,
    regenerate: false,
  },
  {
    input: 'hero-carousel-jubilee-house.jpg',
    output: 'flagstaff-house-desktop-2400x700.webp',
    mode: 'crop',
    // Keep roof flares + reflecting pool / flags in frame.
    cropTopRatio: 0.42,
    regenerate: true,
  },
];

async function createGrainOverlay(width, height, intensity = 2.5) {
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
  const grain = await createGrainOverlay(TARGET_W, TARGET_H, 2.5);

  await sharp(buffer)
    .modulate({ saturation: 0.98, brightness: 1, hue: 0 })
    .composite([{ input: grain, blend: 'overlay', opacity: 0.02 }])
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(outputPath);
}

async function createFitDesktopImage(inputPath, outputPath) {
  const image = sharp(inputPath).rotate();
  const meta = await image.metadata();

  if (!meta.width || !meta.height) {
    throw new Error(`Missing dimensions for ${inputPath}`);
  }

  const fitted = await image
    .clone()
    .resize({
      width: TARGET_W,
      height: TARGET_H,
      fit: 'inside',
      kernel: sharp.kernel.lanczos3,
    })
    .toBuffer();

  const fittedMeta = await sharp(fitted).metadata();

  if (!fittedMeta.width || !fittedMeta.height) {
    throw new Error(`Missing fitted dimensions for ${inputPath}`);
  }

  const left = Math.round((TARGET_W - fittedMeta.width) / 2);
  const top = Math.round((TARGET_H - fittedMeta.height) / 2);

  const composed = await sharp({
    create: {
      width: TARGET_W,
      height: TARGET_H,
      channels: 3,
      background: CANVAS_BG,
    },
  })
    .composite([{ input: fitted, left, top }])
    .jpeg({ quality: 95 })
    .toBuffer();

  await applyPhotographicFinish(composed, outputPath);

  const finalMeta = await sharp(outputPath).metadata();

  return {
    source: `${meta.width}x${meta.height}`,
    fitted: `${fittedMeta.width}x${fittedMeta.height}`,
    output: `${finalMeta.width}x${finalMeta.height}`,
    mode: 'fit',
  };
}

async function createCoverDesktopImage(inputPath, outputPath, focalX, focalY) {
  const image = sharp(inputPath).rotate();
  const meta = await image.metadata();

  if (!meta.width || !meta.height) {
    throw new Error(`Missing dimensions for ${inputPath}`);
  }

  const scale = Math.max(TARGET_W / meta.width, TARGET_H / meta.height);
  const scaledW = Math.round(meta.width * scale);
  const scaledH = Math.round(meta.height * scale);

  const resized = await image
    .clone()
    .resize(scaledW, scaledH, { kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const focalPxX = Math.round(scaledW * focalX);
  const focalPxY = Math.round(scaledH * focalY);

  let left = Math.round(focalPxX - TARGET_W / 2);
  let top = Math.round(focalPxY - TARGET_H / 2);
  left = Math.max(0, Math.min(left, scaledW - TARGET_W));
  top = Math.max(0, Math.min(top, scaledH - TARGET_H));

  const covered = await sharp(resized)
    .extract({
      left,
      top,
      width: TARGET_W,
      height: TARGET_H,
    })
    .toBuffer();

  await applyPhotographicFinish(covered, outputPath);

  const finalMeta = await sharp(outputPath).metadata();

  return {
    source: `${meta.width}x${meta.height}`,
    scaled: `${scaledW}x${scaledH}`,
    extract: `${left},${top}`,
    focal: `${focalX},${focalY}`,
    output: `${finalMeta.width}x${finalMeta.height}`,
    mode: 'cover',
  };
}

async function createCropDesktopImage(inputPath, outputPath, cropTopRatio) {
  const image = sharp(inputPath).rotate();
  const meta = await image.metadata();

  if (!meta.width || !meta.height) {
    throw new Error(`Missing dimensions for ${inputPath}`);
  }

  const normalized = await image
    .clone()
    .resize({ width: TARGET_W, kernel: sharp.kernel.lanczos3 })
    .toBuffer();

  const normalizedMeta = await sharp(normalized).metadata();
  const scaledW = normalizedMeta.width;
  const scaledH = normalizedMeta.height;

  if (!scaledW || !scaledH || scaledH < TARGET_H) {
    throw new Error(`${inputPath} is too short after normalization (${scaledW}x${scaledH})`);
  }

  const maxTop = scaledH - TARGET_H;
  const cropTop = Math.min(maxTop, Math.max(0, Math.round(maxTop * cropTopRatio)));

  const cropped = await sharp(normalized)
    .extract({
      left: 0,
      top: cropTop,
      width: TARGET_W,
      height: TARGET_H,
    })
    .toBuffer();

  await applyPhotographicFinish(cropped, outputPath);

  const finalMeta = await sharp(outputPath).metadata();

  return {
    source: `${meta.width}x${meta.height}`,
    normalized: `${scaledW}x${scaledH}`,
    cropTop,
    output: `${finalMeta.width}x${finalMeta.height}`,
    mode: 'crop',
  };
}

await mkdir(GALLERY_DIR, { recursive: true });

const results = [];

for (const slide of slides) {
  const inputPath = path.join(GALLERY_DIR, slide.input);
  const outputPath = path.join(GALLERY_DIR, slide.output);

  if (slide.regenerate === false) {
    const finalMeta = await sharp(outputPath).metadata();
    results.push({
      ...slide,
      source: `${(await sharp(inputPath).metadata()).width}x${(await sharp(inputPath).metadata()).height}`,
      output: `${finalMeta.width}x${finalMeta.height}`,
      skipped: true,
    });
    console.log(`\nSkipping ${slide.output} (locked)`);
    console.log(`  Output: ${finalMeta.width}x${finalMeta.height}`);
    continue;
  }

  console.log(`\nProcessing ${slide.input} -> ${slide.output} (${slide.mode})`);

  const result =
    slide.mode === 'fit'
      ? await createFitDesktopImage(inputPath, outputPath)
      : slide.mode === 'cover'
        ? await createCoverDesktopImage(inputPath, outputPath, slide.focalX, slide.focalY)
        : await createCropDesktopImage(inputPath, outputPath, slide.cropTopRatio);

  results.push({ ...slide, ...result });
  console.log(`  Source: ${result.source}`);
  if (result.focal) console.log(`  Focal: ${result.focal}`);
  if (result.scaled) console.log(`  Scaled: ${result.scaled}`);
  if (result.extract) console.log(`  Extract: ${result.extract}`);
  if (result.fitted) console.log(`  Fitted: ${result.fitted}`);
  if (result.normalized) console.log(`  Normalized: ${result.normalized}`);
  if (result.cropTop !== undefined) console.log(`  Crop top: ${result.cropTop}px`);
  console.log(`  Output: ${result.output}`);
}

const mismatched = results.filter((result) => result.output !== `${TARGET_W}x${TARGET_H}`);

if (mismatched.length > 0) {
  console.error('\nDimension verification failed:');
  for (const item of mismatched) {
    console.error(`  ${item.output}: expected ${TARGET_W}x${TARGET_H}`);
  }
  process.exit(1);
}

for (const slide of slides) {
  const verifyPath = path.join(GALLERY_DIR, slide.output.replace('.webp', '-verify.jpg'));
  try {
    await unlink(verifyPath);
  } catch {
    // ignore
  }
}

console.log(`\nVerified ${results.length} desktop carousel images at ${TARGET_W}x${TARGET_H}.`);
