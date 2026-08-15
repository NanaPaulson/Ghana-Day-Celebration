import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import sharp from 'sharp';

async function download(title, out) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  u.searchParams.set('action', 'query');
  u.searchParams.set('titles', title);
  u.searchParams.set('prop', 'imageinfo');
  u.searchParams.set('iiprop', 'url');
  u.searchParams.set('format', 'json');

  const response = await fetch(u, { headers: { 'User-Agent': 'GATB-Web/1.0' } });
  const data = await response.json();
  const page = Object.values(data.query.pages)[0];
  const url = page.imageinfo[0].url;

  await pipeline(
    (await fetch(url, { headers: { 'User-Agent': 'GATB-Web/1.0' } })).body,
    createWriteStream(out)
  );

  const meta = await sharp(out).metadata();
  console.log(`${out}: ${meta.width}x${meta.height}`);
}

await download(
  "File:Front View of Kwame Nkrumah's Mausoleum and Memorial in Accra Ghana, May 2008.jpg",
  'public/images/gallery/_source-nkrumah-mausoleum-front.jpg'
);
await download(
  'File:Statues at the Kwame Nkrumah Museum.2.jpg',
  'public/images/gallery/_source-nkrumah-museum2.jpg'
);
