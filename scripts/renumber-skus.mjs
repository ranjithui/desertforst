// Renumbers every SKU to the Desert Forest sequence DF001, DF002, … (in place, in src/data).
//   Cakes (src/data/cakes.json):   DF001–DF272, numbered in the old SKU order (CC…, CCP…, FC…, SF…, SFP…)
//   Menu items (src/data/menu.json + featured copies in home.json): continue after the cakes;
//   each size variant gets the item code plus its size, e.g. DF273-500G.
// The old → new mapping is saved to scripts/raw/sku-map.json. Safe to re-run: DF codes are kept.
import fs from 'fs';

const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const write = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 1));
const isDF = s => typeof s === 'string' && /^DF\d+/.test(s);
const pad = n => `DF${String(n).padStart(3, '0')}`;
const sizeTag = v => (v.variant_name || '').toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9.]/g, '');

const mapFile = 'scripts/raw/sku-map.json';
const map = fs.existsSync(mapFile) ? read(mapFile) : { cakes: {}, menu: {} };

// ---- Cakes
const cakeFile = 'src/data/cakes.json';
const cakeData = read(cakeFile);
const cakes = Object.values(cakeData.cakes);
// Continue after the highest DF code already used anywhere (cakes, menu, featured).
const used = [
  ...cakes.map(c => c.sku),
  ...read('src/data/menu.json').flatMap(g => g.products.map(p => p.sku)),
  ...(read('src/data/home.json').featured || []).map(p => p.sku),
].filter(isDF).map(s => parseInt(s.slice(2), 10));
let n = Math.max(0, ...used);
cakes
  .filter(c => !isDF(c.sku))
  .sort((a, b) => (a.sku || '').localeCompare(b.sku || '', 'en', { numeric: true }))
  .forEach(c => { const next = pad(++n); map.cakes[c.sku || c.slug] = next; c.sku = next; });
write(cakeFile, cakeData);

// ---- Menu items (+ the featured copies shown on the home page)
const menuFile = 'src/data/menu.json';
const menu = read(menuFile);
const byId = {};
for (const group of menu) {
  for (const p of group.products) {
    if (!isDF(p.sku)) {
      const next = pad(++n);
      map.menu[p.id] = { old: p.sku, new: next };
      p.sku = next;
    }
    for (const v of p.variants || []) {
      const code = `${p.sku}-${sizeTag(v) || 'STD'}`;
      if (!isDF(v.sku)) v.sku = code;
    }
    byId[p.id] = p;
  }
}
write(menuFile, menu);

const homeFile = 'src/data/home.json';
const home = read(homeFile);
for (const p of home.featured || []) {
  const src = byId[p.id];
  if (!src) {
    // Featured-only product (not in the menu): give it its own code.
    if (!isDF(p.sku)) { const next = pad(++n); map.menu[p.id] = { old: p.sku, new: next }; p.sku = next; }
    for (const v of p.variants || []) if (!isDF(v.sku)) v.sku = `${p.sku}-${sizeTag(v) || 'STD'}`;
    continue;
  }
  p.sku = src.sku;
  for (const v of p.variants || []) v.sku = src.variants?.find(x => x.id === v.id)?.sku || `${src.sku}-${sizeTag(v) || 'STD'}`;
}
write(homeFile, home);

fs.writeFileSync(mapFile, JSON.stringify(map, null, 1));
console.log(`cakes: DF001–${pad(cakes.length)} · menu items up to ${pad(n)} · map → ${mapFile}`);
