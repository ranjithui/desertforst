/**
 * Visual comparison: screenshots the reference site and the local build at identical
 * viewports, then writes original / local / diff PNGs and a mismatch percentage.
 *
 *   node tests/compare.mjs                       # all routes, all viewports
 *   node tests/compare.mjs --routes=/,/about     # subset
 *   node tests/compare.mjs --vp=desktop          # desktop | tablet | mobile
 *   LOCAL=http://localhost:4173 node tests/compare.mjs
 *
 * Output: tests/screenshots/<viewport>/<route>.{orig,local,diff}.png + report.json
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { ROUTES } from './routes.mjs';

const REF = process.env.REF || 'https://ksbakers.com';
const LOCAL = process.env.LOCAL || 'http://localhost:5173';
const OUT = 'tests/screenshots';
const arg = k => process.argv.find(a => a.startsWith(`--${k}=`))?.slice(k.length + 3);

const VIEWPORTS = { desktop: { width: 1440, height: 900 }, tablet: { width: 768, height: 1024 }, mobile: { width: 390, height: 844 } };

const FREEZE = `
  *, *::before, *::after { animation-play-state: paused !important; animation-delay: -0.0001s !important; animation-duration: 0s !important; transition: none !important; caret-color: transparent !important; }
  .marquee-track, .animate-marquee { animation: none !important; transform: none !important; }
  [role=dialog], [data-state=open][aria-hidden=true] { display: none !important; }
  html { scroll-behavior: auto !important; }
`;

async function settle(page) {
  await page.addStyleTag({ content: FREEZE });
  // Close any welcome modal and reset carousels/marquees to their first frame.
  await page.keyboard.press('Escape').catch(() => {});
  await page.evaluate(async () => {
    document.querySelectorAll('[aria-roledescription=carousel] .snap-x').forEach(el => (el.scrollLeft = 0));
    document.querySelectorAll('[style*="opacity: 0"]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
    await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000); })));
  });
  await page.waitForTimeout(600);
}

async function shoot(browser, base, route, vp, file) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  // Pretend the visitor already chose "Just exploring" on both sites so the menu modal stays closed.
  await ctx.addInitScript(() => { try { localStorage.setItem('ksb.exploring', 'true'); } catch {} });
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
  await settle(page);
  await page.screenshot({ path: file, fullPage: true });
  await ctx.close();
}

function diff(a, b, out) {
  const A = PNG.sync.read(fs.readFileSync(a));
  const B = PNG.sync.read(fs.readFileSync(b));
  const w = Math.max(A.width, B.width), h = Math.max(A.height, B.height);
  const pad = img => { const p = new PNG({ width: w, height: h }); p.data.fill(255); PNG.bitblt(img, p, 0, 0, img.width, img.height, 0, 0); return p; };
  const pa = pad(A), pb = pad(B), d = new PNG({ width: w, height: h });
  const n = pixelmatch(pa.data, pb.data, d.data, w, h, { threshold: 0.15, includeAA: false });
  fs.writeFileSync(out, PNG.sync.write(d));
  return { mismatch: +(100 * n / (w * h)).toFixed(2), origHeight: A.height, localHeight: B.height };
}

const routes = arg('routes')?.split(',') || ROUTES;
const vps = arg('vp')?.split(',') || Object.keys(VIEWPORTS);
const browser = await chromium.launch();
const report = [];
for (const vpName of vps) {
  fs.mkdirSync(path.join(OUT, vpName), { recursive: true });
  for (const route of routes) {
    const name = route === '/' ? 'home' : route.slice(1).replace(/[/?=&]/g, '_');
    const f = s => path.join(OUT, vpName, `${name}.${s}.png`);
    try {
      await shoot(browser, REF, route, VIEWPORTS[vpName], f('orig'));
      await shoot(browser, LOCAL, route, VIEWPORTS[vpName], f('local'));
      const r = { viewport: vpName, route, ...diff(f('orig'), f('local'), f('diff')) };
      report.push(r);
      console.log(`${vpName.padEnd(8)} ${route.padEnd(34)} mismatch ${String(r.mismatch).padStart(6)}%  height ${r.origHeight} vs ${r.localHeight}`);
    } catch (e) {
      console.log(`${vpName.padEnd(8)} ${route.padEnd(34)} ERROR ${e.message.split('\n')[0]}`);
    }
  }
}
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
await browser.close();
