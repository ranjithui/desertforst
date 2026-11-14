import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +(process.argv[3]||1440), height: 900 } });
await p.goto('https://ksbakers.com' + (process.argv[2]||'/'), { waitUntil: 'networkidle' });
const sel = 'div.sticky.z-50';
const r = async (l) => console.log(l, await p.evaluate(s => { const e = document.querySelector(s); return e && [e.getAttribute('style'), document.documentElement.style.cssText, document.documentElement.getAttribute('style')]; }, sel));
await r('top'); await p.mouse.wheel(0, 900); await p.waitForTimeout(800); await r('down');
await p.mouse.wheel(0, -300); await p.waitForTimeout(800); await r('up');
console.log(await p.evaluate(() => [...document.querySelectorAll('[style*="opacity"]')].slice(0,6).map(e => e.className.slice(0,80) + ' :: ' + e.getAttribute('style'))));
await b.close();
