import { allCakes, cakeFlavours, flavours } from './data';

export const slugify = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const flavourList = Object.entries(flavours).map(([id, f]) => ({ id, ...f, slug: slugify(f.name) }));
export const flavourBySlug = slug => flavourList.find(f => f.slug === slug);

const subName = c => c.breadcrumbs?.[0]?.sub?.name || c.breadcrumbs?.[0]?.category?.name || '';

/**
 * Mirrors the original search: cakes match on name / SKU / category, or when one of
 * their flavours matches the query. Direct name hits rank first.
 */
export function searchCakes(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = [];
  for (const c of allCakes) {
    const hay = `${c.name} ${c.sku} ${c.breadcrumbs?.map(b => `${b.category?.name} ${b.sub?.name}`).join(' ')}`.toLowerCase();
    let score = 0;
    if (c.name.toLowerCase().startsWith(q)) score = 4;
    else if (c.name.toLowerCase().includes(q)) score = 3;
    else if (hay.includes(q) || c.description?.toLowerCase().includes(q)) score = 2;
    else if (cakeFlavours(c).some(f => f.name?.toLowerCase().includes(q))) score = 1;
    if (score) scored.push({ c, score });
  }
  // Within a relevance tier, cakes are listed in SKU order (DF001, DF002, …).
  return scored
    .sort((a, b) => b.score - a.score || a.c.sku.localeCompare(b.c.sku, 'en', { numeric: true }))
    .map(s => s.c);
}

export function searchFlavours(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return flavourList.filter(f => f.name.toLowerCase().includes(q));
}

export const cakesWithFlavour = flavourId => allCakes.filter(c => c.flavours.includes(flavourId));

export { subName };
