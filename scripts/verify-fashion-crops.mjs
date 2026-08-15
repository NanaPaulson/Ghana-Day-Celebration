import { chromium } from 'playwright';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const VIEWPORTS = [375, 768, 1024, 1440];
const SLOTS = ['featured', 'street', 'white', 'group', 'walking'];
const PREVIEW_URL = process.env.PREVIEW_URL ?? 'http://localhost:4323/';

function analyzeCrop(img) {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const dw = img.clientWidth;
  const dh = img.clientHeight;
  if (!nw || !nh || !dw || !dh) return null;

  const scale = Math.max(dw / nw, dh / nh);
  const sh = nh * scale;
  const overflowY = sh - dh;
  const cs = getComputedStyle(img);
  const parts = cs.objectPosition.trim().split(/\s+/);
  let py = 0.5;
  for (const part of parts) {
    if (part === 'top') py = 0;
    if (part.endsWith('%')) {
      const idx = parts.indexOf(part);
      if (idx === 1 || (idx === 0 && !part.includes('left') && !part.includes('right'))) {
        py = parseFloat(part) / 100;
      }
    }
  }
  if (parts.length === 1 && parts[0] === 'center') py = 0.5;
  if (parts.includes('top')) py = 0;

  const offsetY = overflowY * py;
  const visibleTopPct = (offsetY / scale / nh) * 100;
  const visibleBottomPct = ((offsetY + dh) / scale / nh) * 100;

  return {
    objectPosition: cs.objectPosition,
    aspect: `${dw.toFixed(0)}×${dh.toFixed(0)}`,
    visibleRange: `${visibleTopPct.toFixed(0)}–${visibleBottomPct.toFixed(0)}%`,
    topAligned: py <= 0.1,
    headroomOk: visibleTopPct <= 5,
  };
}

const browser = await chromium.launch();
let allOk = true;

for (const width of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${PREVIEW_URL}?v=${Date.now()}`, { waitUntil: 'networkidle' });
  await page.locator('#fashion').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Force reveal animations so layout is stable
  await page.evaluate(() => {
    document.querySelectorAll('#fashion .scale-in').forEach((el) => el.classList.add('is-visible'));
  });

  const results = await page.evaluate(
    ({ slots }) => {
      return slots.map((slot) => {
        const img = document.querySelector(`.fashion-section__image--${slot} img`);
        if (!img) return { slot, error: 'missing' };
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        const dw = img.clientWidth;
        const dh = img.clientHeight;
        const scale = Math.max(dw / nw, dh / nh);
        const sh = nh * scale;
        const overflowY = sh - dh;
        const cs = getComputedStyle(img);
        const parts = cs.objectPosition.trim().split(/\s+/);
        let py = 0.5;
        if (parts.includes('top')) py = 0;
        else {
          const yPart = parts[1] ?? parts[0];
          if (yPart?.endsWith('%')) py = parseFloat(yPart) / 100;
          else if (yPart === 'center' || parts.length === 1) py = 0.5;
        }
        const offsetY = overflowY * py;
        const visibleTopPct = (offsetY / scale / nh) * 100;
        const visibleBottomPct = ((offsetY + dh) / scale / nh) * 100;
        return {
          slot,
          objectPosition: cs.objectPosition,
          aspect: `${Math.round(dw)}×${Math.round(dh)}`,
          visibleRange: `${visibleTopPct.toFixed(0)}–${visibleBottomPct.toFixed(0)}%`,
          headroomOk: visibleTopPct <= 8,
        };
      });
    },
    { slots: SLOTS }
  );

  const bad = results.filter((r) => !r.headroomOk && !r.error);
  if (bad.length) allOk = false;

  console.log(`\n=== ${width}px ===`);
  for (const r of results) {
    const status = r.error ? 'ERR' : r.headroomOk ? 'OK' : 'CROP';
    console.log(`  ${r.slot.padEnd(9)} ${status}  pos=${r.objectPosition}  ${r.aspect}  visible=${r.visibleRange}`);
  }

  await page.locator('.fashion-section__images').screenshot({
    path: path.join(ROOT, `fashion-verify-${width}.png`),
  });
  await page.close();
}

await browser.close();
console.log(`\n${allOk ? 'PASS' : 'FAIL'}: head crop verification`);
process.exit(allOk ? 0 : 1);
