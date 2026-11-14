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

console.log('Ordering flow');
{
  const p = await fresh();
  await p.goto(BASE + '/');
  await p.getByRole('button', { name: /Butterscotch Cake - Eggless.*open options/ }).click();
  ok(await p.getByRole('heading', { name: 'Welcome to our menu' }).isVisible(), 'store picker opens before ordering');
  await p.getByRole('button', { name: /Shop now/ }).click();
  ok(await p.getByRole('heading', { name: 'Set up your order' }).isVisible(), '"Shop now" shows order setup');
  ok(await p.getByRole('button', { name: 'Select a store' }).isDisabled(), 'store button disabled until an area is chosen');
  await p.getByRole('button', { name: 'Deliver to' }).click();
  await p.getByRole('option', { name: 'Kukatpally' }).click();
  await p.getByRole('button', { name: 'Shop from Kukatpally' }).click();
  await p.getByRole('heading', { name: /Butterscotch Cake - Eggless/ }).waitFor();
  ok(true, 'options dialog opens after choosing a store');
  await p.getByText('1 kg', { exact: true }).click();
  await p.getByRole('button', { name: 'Happy Birthday' }).click();
  await p.getByRole('button', { name: /Add Choco Tales Hamper/ }).click();
  ok((await p.locator('text=₹1398').count()) > 0, 'total updates with size + add-on (₹999 + ₹399)');
  await p.getByRole('button', { name: 'Add to Cart' }).click();
  ok(await p.getByRole('heading', { name: 'Your Cart' }).isVisible(), 'cart drawer opens');
  ok((await p.locator('aside').getByText('Butterscotch Cake - Eggless').count()) > 0, 'cake is in the cart');
  ok((await p.locator('aside').getByText('Choco Tales Hamper').count()) > 0, 'add-on is in the cart');
  await p.getByRole('button', { name: 'Increase quantity' }).first().click();
  ok((await p.locator('aside').getByText('₹1998').count()) > 0, 'quantity stepper updates line total');
  await p.getByRole('button', { name: 'Checkout' }).click();
  await p.waitForURL(/\/login/);
  await p.fill('#phone', '9876543210');
  await p.getByRole('button', { name: 'Send OTP' }).click();
  await p.fill('#otp', '123456');
  await p.getByRole('button', { name: /Verify/ }).click();
  await p.waitForURL(/\/checkout/);
  await p.fill('#co-name', 'Test Customer');
  await p.fill('#co-address', 'Road 1, Kukatpally');
  await p.getByRole('button', { name: /Place order/ }).click();
  ok(await p.getByRole('heading', { name: 'Order placed' }).isVisible(), 'checkout completes');
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
  ok(await p.getByText('107 cakes to choose from').isVisible(), 'category count');
  await p.selectOption('select[aria-label="Sort by"]', 'price-desc');
  await p.waitForURL(/sort=price-desc/);
  await p.waitForTimeout(300);
  const prices = await p.$$eval('a[href^="/cakes/"] .text-accent-strong', els => els.slice(0, 5).map(e => parseFloat(e.textContent.replace(/[^\d.]/g, ''))));
  ok(prices.every((v, i) => !i || prices[i - 1] >= v), 'sort by price (high → low)');
  await p.locator('main').getByRole('link', { name: 'Kids Birthday', exact: true }).click();
  ok(await p.getByText('32 cakes to choose from').waitFor({ timeout: 5000 }).then(() => true, () => false), 'sub-category chip navigates');
  await p.goto(BASE + '/search?q=choco');
  ok(await p.getByRole('heading', { name: /results for/ }).isVisible(), 'search results page');
  await p.goto(BASE + '/stores');
  await p.fill('input[aria-label^="Search outlets"]', 'Miyapur');
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
