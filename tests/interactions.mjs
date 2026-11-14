// Captures DOM + screenshots of interactive states on the reference site (analysis helper).
import { chromium } from 'playwright';
import fs from 'fs';
const out = process.argv[2];
const cond = h => h
  .replace(/<svg[^>]*class="([^"]*)"[^>]*>[\s\S]*?<\/svg>/g, (m, c) => `<SVG "${c}"/>`)
  .replace(/></g, '>\n<');
const b = await chromium.launch();

async function state(name, { path = '/', w = 1440, h = 900, act }) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('https://ksbakers.com' + path, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(800);
  const before = await p.evaluate(() => document.body.innerHTML.length);
  try { await act(p); } catch (e) { console.log(name, 'ERR', e.message.split('\n')[0]); }
  await p.waitForTimeout(900);
  // grab portal/dialog content
  const html = await p.evaluate(() => {
    const d = [...document.querySelectorAll('[role=dialog],[role=listbox],#mobile-menu,[data-state=open]')];
    return d.map(e => e.outerHTML).join('\n<!-- ---- -->\n') || document.body.outerHTML;
  });
  fs.writeFileSync(`${out}/${name}.html`, cond(html));
  await p.screenshot({ path: `${out}/${name}.png` });
  console.log(name, before, html.length);
  await p.close();
}

await state('mobile-menu', { w: 390, h: 844, act: p => p.click('button[aria-label="Open menu"]') });
await state('store-picker', { act: p => p.locator('text=Pick a store to order').first().click() });
await state('cart', { act: p => p.click('button[aria-label="Open cart"]') });
await state('search', { act: async p => { await p.click('input[aria-label="Search cakes"] >> nth=0'); await p.keyboard.type('choco', { delay: 80 }); } });
await state('product-options', { act: p => p.locator('button[aria-label$="open options"]').first().click() });
await state('menu-hover', { act: p => p.hover('nav[aria-label=Main] li >> nth=0') });
await state('cake-flavour', { path: '/cakes/mermaid-photo-cake', act: p => p.locator('button:has-text("Butterscotch")').first().click() });
await state('cake-order', { path: '/cakes/mermaid-photo-cake', act: p => p.locator('text=Pick a store to order').first().click() });
await state('sort', { path: '/birthday-cakes', act: p => p.locator('button:has-text("Featured")').first().click() });
await state('products-explore', { path: '/products', act: p => p.locator('text=Just exploring').first().click() });
await state('mobile-home', { w: 390, h: 844, act: async () => {} });
await b.close();
