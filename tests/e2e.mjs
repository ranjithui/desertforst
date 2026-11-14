/**
 * Functional smoke tests for the React replica (run against `npm run dev` or `npm run preview`).
 *
 *   node tests/e2e.mjs                         # http://localhost:5173
 *   LOCAL=http://localhost:4173 node tests/e2e.mjs
 *
 * Checks the ordering flow (store picker → options → cart), navigation menus, filters,
 * accordions, forms, every route for console errors / broken images, and every internal link.
 */
import { chromium } from 'playwright';
import { ROUTES } from './routes.mjs';

const BASE = process.env.LOCAL || 'http://localhost:5173';
let failures = 0;
const ok = (cond, msg) => { console.log(`${cond ? '  ✓' : '  ✗'} ${msg}`); if (!cond) failures++; };

const browser = await chromium.launch();
const fresh = async (vp = { width: 1440, height: 900 }) => (await browser.newContext({ viewport: vp })).newPage();

console.log('WhatsApp ordering');
{
  const p = await fresh();
  // Capture the WhatsApp link instead of opening a new tab.
  await p.addInitScript(() => { window.__wa = []; window.open = u => { window.__wa.push(u); return null; }; });
  const lastMessage = async () => p.evaluate(() => { const u = window.__wa.at(-1); return u ? { to: u.split('?')[0], text: decodeURIComponent(u.split('text=')[1]) } : null; });

  await p.goto(BASE + '/');
  ok(!(await p.getByRole('button', { name: 'Open cart' }).count()), 'no cart button in the header');
  await p.getByRole('button', { name: /Butterscotch Cake - Eggless.*open options/ }).click();
  await p.getByRole('heading', { name: /Butterscotch Cake - Eggless/ }).waitFor();
  ok(true, 'options dialog opens straight away (no store picker)');
  await p.getByText('1 kg', { exact: true }).click();
  await p.getByRole('button', { name: 'Happy Birthday' }).click();
  await p.getByRole('button', { name: /Add Choco Tales Hamper/ }).click();
  ok((await p.locator('text=₹1398').count()) > 0, 'total updates with size + add-on (₹999 + ₹399)');
  const dialog = p.getByRole('dialog');
  await dialog.getByRole('button', { name: /Order on WhatsApp/ }).click();
  ok(await dialog.getByRole('alert').isVisible(), 'branch is required');
  await dialog.getByLabel('Branch').fill('Peelamedu');
  await dialog.getByRole('button', { name: /Order on WhatsApp/ }).click();
  const m1 = await lastMessage();
  ok(m1?.to.startsWith('https://wa.me/'), 'opens WhatsApp to the orders number');
  ok(['Butterscotch Cake - Eggless', 'Size: 1 kg', 'Happy Birthday', 'Choco Tales Hamper', 'Total: ₹1398', 'Branch: Peelamedu'].every(t => m1?.text.includes(t)),
    'message has product, size, cake message, add-on, total and branch');

  await p.goto(BASE + '/cakes/mermaid-photo-cake');
  await p.getByPlaceholder('Happy Birthday Aarav').fill('Hi Mia');
  ok((await p.getByLabel('Branch').inputValue()) === 'Peelamedu', 'branch is remembered between products');
  await p.getByRole('button', { name: /Order on WhatsApp/ }).click();
  const m2 = await lastMessage();
  ok(['Mermaid Photo Cake', 'SKU DF', 'Weight: 1 kg', 'Flavour:', '"Hi Mia"', 'Price: ₹1299', 'Branch: Peelamedu', '/cakes/mermaid-photo-cake'].every(t => m2?.text.includes(t)),
    'cake page message has weight, flavour, message, price, branch and link');
  await p.context().close();
}

console.log('Cake detail');
{
  const p = await fresh();
  await p.goto(BASE + '/cakes/mermaid-photo-cake');
  ok(await p.getByText('₹1299.00').first().isVisible(), 'base price shown');
  await p.locator('select').first().selectOption('2');
  ok(await p.getByText('₹2598.00').first().isVisible(), 'price follows weight');
  await p.getByRole('button', { name: /Butterscotch/ }).click();
  await p.getByRole('option', { name: 'Rasmalai' }).click();
  ok(await p.getByRole('button', { name: /Rasmalai/ }).isVisible(), 'flavour picker selects');
  await p.context().close();
}

console.log('Listing + search');
{
  const p = await fresh();
  await p.goto(BASE + '/birthday-cakes');
  ok(await p.getByText('107 designs to choose from').isVisible(), 'category count');
  await p.selectOption('select[aria-label="Sort by"]', 'price-desc');
  await p.waitForURL(/sort=price-desc/);
  await p.waitForTimeout(300);
  const prices = await p.$$eval('a[href^="/cakes/"] .text-accent-strong', els => els.slice(0, 5).map(e => parseFloat(e.textContent.replace(/[^\d.]/g, ''))));
  ok(prices.every((v, i) => !i || prices[i - 1] >= v), 'sort by price (high → low)');
  await p.locator('main').getByRole('link', { name: 'Kids Birthday', exact: true }).click();
  ok(await p.getByText('32 designs to choose from').waitFor({ timeout: 5000 }).then(() => true, () => false), 'sub-category chip navigates');
  await p.goto(BASE + '/search?q=choco');
  ok(await p.getByRole('heading', { name: /results for/ }).isVisible(), 'search results page');
  await p.goto(BASE + '/stores');
  await p.fill('input[aria-label^="Search outlets"]', 'Peelamedu');
  ok(await p.getByText('1 outlet', { exact: true }).isVisible(), 'store search filters');
  await p.goto(BASE + '/faq');
  const q = p.getByRole('button', { name: /same-day delivery/ });
  await q.click();
  ok((await q.getAttribute('aria-expanded')) === 'true', 'FAQ accordion expands');
  await p.context().close();
}

console.log('Mobile navigation');
{
  const p = await fresh({ width: 390, height: 844 });
  await p.goto(BASE + '/');
  await p.getByRole('button', { name: 'Open menu' }).click();
  ok(await p.locator('#mobile-menu').isVisible(), 'mobile menu opens');
  await p.getByRole('button', { name: 'Theme Cakes sub-categories' }).click();
  await p.locator('#mobile-menu').getByRole('link', { name: 'Floral' }).click();
  await p.waitForURL(/theme-cakes\/floral/);
  ok(!(await p.locator('#mobile-menu').count()), 'menu closes after navigating');
  await p.context().close();
}

console.log('Forms');
{
  const p = await fresh();
  await p.goto(BASE + '/corporate-orders');
  await p.getByLabel('Your name').fill('Asha');
  await p.getByLabel('Phone number').fill('9876543210');
  await p.getByLabel('Company name').fill('Acme');
  await p.getByLabel('Work email').fill('asha@example.com');
  await p.getByRole('button', { name: 'Send enquiry' }).click();
  ok(await p.getByRole('heading', { name: /got it/ }).waitFor({ timeout: 3000 }).then(() => true, () => false), 'corporate enquiry submits');
  await p.goto(BASE + '/feedback');
  await p.getByRole('radio', { name: '5 stars' }).click();
  await p.fill('#feedback-name', 'Ravi');
  await p.fill('#feedback-email', 'ravi@example.com');
  await p.fill('#feedback-review', 'Lovely cake');
  await p.getByRole('button', { name: 'Submit Review' }).click();
  ok(await p.getByText('Lovely cake').isVisible(), 'feedback review is listed');
  await p.context().close();
}

console.log('Every route: console errors, broken images, dead links');
{
  const p = await fresh();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  const links = new Set();
  for (const r of ROUTES) {
    await p.goto(BASE + r, { waitUntil: 'networkidle' });
    await p.keyboard.press('Escape');
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
    await p.waitForTimeout(400);
    const broken = await p.$$eval('img', imgs => imgs.filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('loading') !== 'lazy').map(i => i.src));
    ok(!broken.length, `${r} images load${broken.length ? ' — ' + broken.join(', ') : ''}`);
    (await p.$$eval('a[href^="/"]', as => as.map(a => a.getAttribute('href')))).forEach(h => links.add(h.split('#')[0]));
  }
  ok(!errors.length, `no console errors${errors.length ? ' — ' + errors.slice(0, 3).join(' | ') : ''}`);
  const dead = [];
  for (const href of links) {
    await p.goto(BASE + href);
    if (await p.getByText('This page could not be found.').count()) dead.push(href);
  }
  ok(!dead.length, `${links.size} internal links resolve${dead.length ? ' — dead: ' + dead.join(', ') : ''}`);
  await p.context().close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
