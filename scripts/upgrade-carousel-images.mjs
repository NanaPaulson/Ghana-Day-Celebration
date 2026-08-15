import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const galleryDir = 'public/images/gallery';

const sources = [
  {
    out: 'ghana-kwame-nkrumah-statue.jpg',
    title: 'File:Statues at the Kwame Nkrumah park Museum.jpg',
    fallback: 'https://unsplash.com/photos/0qz48eDvNHo/download?force=true&w=3840',
  },
  {
    out: 'ghana-flagstaff-house.jpg',
    title: 'File:Jubilee House.jpg',
  },
  {
    out: 'ghana-independence-square.jpg',
    optimizeOnly: true,
  },
];

async function getCommonsUrl(title) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', title);
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url|size');
  url.searchParams.set('format', 'json');

  const response = await fetch(url);
  const data = await response.json();
  const page = Object.values(data.query.pages)[0];
  return page.imageinfo?.[0] ?? null;
}

async function downloadFile(sourceUrl, destPath) {
  const response = await fetch(sourceUrl, {
    headers: { 'User-Agent': 'GATB-Web/1.0 (carousel image upgrade)' },
  });

  if (!response.ok) {
    throw new Error(`Download failed (${response.status}): ${sourceUrl}`);
  }

  await pipeline(response.body, createWriteStream(destPath));
}

async function optimizeImage(inputPath, outputPath) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const maxWidth = 3840;

  let processor = image.rotate();

  if (metadata.width && metadata.width > maxWidth) {
    processor = processor.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await processor
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.25 })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(outputPath);

  const before = (await stat(inputPath)).size;
  const after = (await stat(outputPath)).size;
  const finalMeta = await sharp(outputPath).metadata();

  return {
    beforeKb: Math.round(before / 1024),
    afterKb: Math.round(after / 1024),
    width: finalMeta.width,
    height: finalMeta.height,
  };
}

async function finalize(tempPath, finalPath) {
  const before = (await stat(finalPath)).size;
  await import('node:fs/promises').then((fs) => fs.rename(tempPath, finalPath));
  const after = (await stat(finalPath)).size;
  const finalMeta = await sharp(finalPath).metadata();
  return {
    beforeKb: Math.round(before / 1024),
    afterKb: Math.round(after / 1024),
    width: finalMeta.width,
    height: finalMeta.height,
  };
}

for (const source of sources) {
  const tempPath = `${galleryDir}/._temp-${source.out}`;
  const finalPath = `${galleryDir}/${source.out}`;

  console.log(`\nProcessing ${source.out}...`);

  if (source.optimizeOnly) {
    const existingMeta = await sharp(finalPath).metadata();
    console.log(`  Existing: ${existingMeta.width}x${existingMeta.height}`);
    await sharp(finalPath)
      .rotate()
      .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.25 })
      .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(tempPath);
    const result = await finalize(tempPath, finalPath);
    console.log(`  Saved: ${result.width}x${result.height}, ${result.beforeKb}KB -> ${result.afterKb}KB`);
    continue;
  }

  let downloadUrl = source.fallback;

  if (source.title) {
    const info = await getCommonsUrl(source.title);
    if (info?.url) {
      downloadUrl = info.url;
      console.log(`  Source: ${source.title} (${info.width}x${info.height})`);
    }
  }

  await downloadFile(downloadUrl, tempPath);
  const result = await optimizeImage(tempPath, finalPath);
  console.log(`  Saved: ${result.width}x${result.height}, ${result.beforeKb}KB -> ${result.afterKb}KB`);

  await import('node:fs/promises').then((fs) => fs.unlink(tempPath));
  await new Promise((r) => setTimeout(r, 2000));
}

console.log('\nDone.');
