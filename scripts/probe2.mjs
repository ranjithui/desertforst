import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://ksbakers.com/', { waitUntil: 'networkidle' });
await p.click('input[aria-label="Search cakes"] >> nth=0'); await p.keyboard.type('choco', { delay: 60 }); await p.waitForTimeout(1500);
console.log(await p.evaluate(() => { const lb = document.querySelector('[role=listbox]'); const par = lb.parentElement; const c = par.cloneNode(true); c.querySelector('[role=listbox]').innerHTML = '…'; return c.outerHTML.replace(/<svg[^>]*class="([^"]*)"[^>]*>[\s\S]*?<\/svg>/g, (m, c) => `<SVG "${c}"/>`); }));
await p.keyboard.press('Enter'); await p.waitForTimeout(2500); console.log('URL', p.url());
await b.close();
