// Normalises the scraped payloads into the JSON files the React app imports (src/data).
import fs from 'fs';

const raw = p => JSON.parse(fs.readFileSync(`scripts/raw/${p}`, 'utf8'));
const local = v => JSON.parse(JSON.stringify(v)
  .replace(/https?:\/\/127\.0\.0\.1:9000\/ksbakers\//g, '/media/ksbakers/')
  .replace(/https:\/\/ksbakers\.com(?=\/)/g, ''));
const write = (name, data) => {
  fs.writeFileSync(`src/data/${name}.json`, JSON.stringify(local(data), null, 1));
  console.log(name, fs.statSync(`src/data/${name}.json`).size);
};
fs.mkdirSync('src/data', { recursive: true });

const site = raw('site.json');
const products = raw('products.json');
const menu = raw('api-products.json');

write('layout', site.layout);

write('home', { ...site.home, featured: raw('api-products_featured.json'), heroBanners: raw('api-hero-banners.json'), promoBanners: raw('api-promo-banners.json') });

// Cakes keyed by slug (full detail), plus listing order per category path.
// Flavour lists repeat on every cake, so store them once and reference by id.
const cakes = {}, flavours = {};
for (const c of products) {
  for (const f of c.flavours || []) flavours[f.id] = { name: f.name, eggless: f.is_eggless };
  const { id, seo_title, seo_description, ...rest } = c;
  cakes[c.slug] = { ...rest, flavours: (c.flavours || []).map(f => f.id) };
}
write('cakes', { flavours, cakes });
const listings = {};
for (const [path, l] of Object.entries(site.listings)) if (path !== '/products') listings[path] = l;
write('listings', listings);

// Classic menu (/products): grouped by category in API order.
const groups = [];
for (const p of menu) {
  let g = groups.find(g => g.slug === p.category.slug);
  if (!g) groups.push(g = { ...p.category, products: [] });
  g.products.push(p);
}
write('menu', groups);

write('pages', {
  about: site.pages['/about'],
  stores: site.pages['/stores'],
  faq: site.pages['/faq'],
  gifting: site.pages['/gifting'],
  hampers: site.pages['/gifting/hampers'].listing,
  addons: site.pages['/add-ons'].listing,
  suggestedAddons: raw('api-addons_suggested.json').suggested,
});
