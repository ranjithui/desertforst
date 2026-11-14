// Single access point for the content scraped from the original site (src/data/*.json).
import layout from '../data/layout.json';
import home from '../data/home.json';
import cakeData from '../data/cakes.json';
import listings from '../data/listings.json';
import menu from '../data/menu.json';
import pages from '../data/pages.json';

export { layout, home, listings, menu, pages };

export const flavours = cakeData.flavours;
export const cakes = cakeData.cakes;
export const allCakes = Object.values(cakes);

export const cakeNav = layout.cakeNav;

/** Category tree lookup: returns { category, sub, children } for /:category/:sub? */
export function findCategory(categorySlug, subSlug) {
  const category = cakeNav.find(c => c.slug === categorySlug);
  if (!category) return null;
  const sub = subSlug ? category.children.find(c => c.slug === subSlug) : null;
  if (subSlug && !sub) return null;
  return { category, sub, children: category.children };
}

export function listingFor(categorySlug, subSlug) {
  const path = '/' + categorySlug + (subSlug ? '/' + subSlug : '');
  const l = listings[path];
  return l ? l.cakes.map(slug => cakes[slug]).filter(Boolean) : [];
}

export function cakeFlavours(cake) {
  return (cake.flavours || []).map(id => ({ id, ...flavours[id] }));
}

/** All menu ("classic") products keyed by id, for cart lookups. */
export const menuProducts = menu.flatMap(g => g.products.map(p => ({ ...p, categorySlug: g.slug })));
export const featured = home.featured;

export const outlets = pages.stores.outlets;
