// Downloads every image referenced by the scraped data + rendered pages into public/,
// keeping the original paths so markup can use the same URLs.
import fs from 'fs';
import path from 'path';

const BASE = 'https://ksbakers.com';
const raw = 'scripts/raw';
const list = new Set();
for (const f of ['media.txt', 'static.txt'])
  fs.readFileSync(`${raw}/${f}`, 'utf8').split(/\r?\n/).filter(Boolean).forEach(p => list.add(p));
for (const f of fs.readdirSync(raw).filter(f => f.endsWith('.json'))) {
  const t = fs.readFileSync(`${raw}/${f}`, 'utf8');
  for (const m of t.matchAll(/"(\/(?:Products|leadership|media)\/[^"]+)"/g)) list.add(m[1]);
  for (const m of t.matchAll(/127\.0\.0\.1:9000(\/ksbakers\/uploads\/[^"]+)/g)) list.add('/media' + m[1]);
}
const items = [...list];
let i = 0, ok = 0, fail = [];
async function worker() {
  while (i < items.length) {
    const p = items[i++];
    const dest = path.join('public', decodeURIComponent(p));
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) { ok++; continue; }
    try {
      const r = await fetch(BASE + encodeURI(decodeURI(p)));
      if (!r.ok) throw new Error(r.status);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
      ok++;
    } catch (e) { fail.push(`${p} ${e.message}`); }
  }
}
await Promise.all(Array.from({ length: 10 }, worker));
console.log('total', items.length, 'ok', ok, 'failed', fail.length);
fail.forEach(f => console.log('  ', f));
