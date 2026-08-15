import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright';

const ROOT = path.resolve(import.meta.dirname, '..');
const VIEWPORTS = [1024, 1440, 1920];
const SLIDES = [
  {
    id: 'nkrumah-statue',
    desktop: '/images/gallery/kwame-nkrumah-desktop-4800x1400.webp',
    expectedW: 4800,
    expectedH: 1400,
  },
  {
    id: 'independence-square',
    desktop: '/images/gallery/hero-carousel-independence-square-desktop-2400x700.webp',
    expectedW: 2400,
    expectedH: 700,
  },
  {
    id: 'jubilee-house',
    desktop: '/images/gallery/flagstaff-house-desktop-4800x1400.webp',
    expectedW: 4800,
    expectedH: 1400,
  },
];

console.log('=== Asset inspection ===\n');

for (const slide of SLIDES) {
  const filePath = path.join(ROOT, 'public', slide.desktop.replace(/^\//, ''));
  if (!existsSync(filePath)) {
    console.error(`MISSING: ${slide.desktop}`);
    continue;
  }

  const meta = await sharp(filePath).metadata();
  const ok = meta.width === slide.expectedW && meta.height === slide.expectedH;
  console.log(
    `${slide.desktop}: ${meta.width}x${meta.height} ${ok ? 'OK' : 'BAD'} (expect ${slide.expectedW}x${slide.expectedH})`
  );
}

console.log('\n=== Browser verification ===\n');

const browser = await chromium.launch();
const page = await browser.newPage();

for (const width of VIEWPORTS) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('http://127.0.0.1:4328/', { waitUntil: 'networkidle' });

  const slideResults = [];

  for (let index = 0; index < SLIDES.length; index += 1) {
    if (index > 0) {
      await page.click(`[data-hero-go="${index}"]`);
      await page.waitForTimeout(300);
    }

    const result = await page.evaluate((expectedDesktop) => {
      const image = document.querySelector('#hero .home-carousel__slide.is-active .home-carousel__image');
      const frame = document.querySelector('#hero .home-carousel');
      const content = document.querySelector('#hero .home-carousel__content');

      if (!image || !frame || !content) {
        return { error: 'Missing carousel nodes' };
      }

      const imageBox = image.getBoundingClientRect();
      const carouselBox = frame.getBoundingClientRect();
      const contentBox = content.getBoundingClientRect();

      const aspect = Number((carouselBox.width / carouselBox.height).toFixed(4));
      const targetAspect = 24 / 7;

      return {
        loadedSource: image.currentSrc,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        imageBox: {
          left: Math.round(imageBox.left),
          width: Math.round(imageBox.width),
          height: Math.round(imageBox.height),
          right: Math.round(imageBox.right),
        },
        carouselBox: {
          width: Math.round(carouselBox.width),
          height: Math.round(carouselBox.height),
          right: Math.round(carouselBox.right),
        },
        contentBox: {
          left: Math.round(contentBox.left),
          width: Math.round(contentBox.width),
        },
        expectedDesktop,
        desktopLoaded: /desktop-\d+x\d+\.webp/.test(image.currentSrc),
        desktopDimensionsOk:
          (image.naturalWidth === 2400 && image.naturalHeight === 700) ||
          (image.naturalWidth === 4800 && image.naturalHeight === 1400),
        carouselFullWidth: Math.abs(carouselBox.width - window.innerWidth) < 2,
        imageFillsCarousel:
          Math.abs(imageBox.left - carouselBox.left) < 2 &&
          Math.abs(imageBox.right - carouselBox.right) < 2 &&
          Math.abs(imageBox.height - carouselBox.height) < 2,
        contentOverlaysImage: contentBox.left >= carouselBox.left && contentBox.right <= carouselBox.right,
        aspectRatio247: Math.abs(aspect - targetAspect) < 0.02,
      };
    }, SLIDES[index].desktop);

    slideResults.push({ id: SLIDES[index].id, ...result });
  }

  const first = slideResults[0];
  const sameImageSize = slideResults.every(
    (slide) =>
      slide.imageBox?.width === first.imageBox?.width &&
      slide.imageBox?.height === first.imageBox?.height
  );
  const sameCarouselSize = slideResults.every(
    (slide) =>
      slide.carouselBox?.width === first.carouselBox?.width &&
      slide.carouselBox?.height === first.carouselBox?.height
  );
  const allPass = slideResults.every(
    (slide) =>
      slide.carouselFullWidth &&
      slide.imageFillsCarousel &&
      slide.contentOverlaysImage &&
      slide.desktopLoaded &&
      slide.desktopDimensionsOk &&
      slide.aspectRatio247
  );

  console.log(`viewport=${width}px`);
  for (const slide of slideResults) {
    console.log(`  slide=${slide.id}`, slide);
  }
  console.log(
    `  sameImageSize=${sameImageSize} sameCarouselSize=${sameCarouselSize} pass=${allPass && sameImageSize && sameCarouselSize}`
  );
  console.log('');
}

await browser.close();
