import { useEffect, useState } from 'react';
import { ArrowUpDown, ChevronDown, Search, X } from 'lucide-react';
import { pages } from '../lib/data';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import MenuProductCard from '../components/product/MenuProductCard';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];
const chip = active =>
  `inline-flex shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full border px-4 py-2 font-sans text-sm transition-colors duration-200 ${active ? 'border-accent bg-accent text-cream' : 'border-pastel-sand/70 bg-white/80 text-cocoa hover:border-accent hover:text-accent'}`;

/** /add-ons — candles, toppers and hampers to go with a cake. */
export default function AddOnsPage() {
  const { categories, addons } = pages.addons;
  const [sort, setSort] = useState('featured');
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  useEffect(() => { document.title = 'Add-ons | Desert Forest'; }, []);

  let items = addons
    .filter(a => cat === 'all' || a.category === cat)
    .filter(a => a.name.toLowerCase().includes(q.trim().toLowerCase()))
    .map(a => ({ id: a.id, name: a.name, description: a.description, image_url: a.images[0], price_city: a.price, variants: [], is_veg: false, category: { allows_addons: false } }));
  if (sort === 'price-asc') items = [...items].sort((a, b) => a.price_city - b.price_city);
  if (sort === 'price-desc') items = [...items].sort((a, b) => b.price_city - a.price_city);

  return (
    <div className="min-h-screen bg-bakery-bg">
      <div className="mx-auto max-w-7xl space-y-6 px-4 pb-16 pt-6 sm:space-y-8 sm:px-6 sm:pt-8">
        <header className="space-y-3">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Add-ons' }]} />
          <div className="flex items-center justify-between gap-4">
            <h1 className="min-w-0 font-display text-[1.75rem] font-semibold leading-tight text-cocoa sm:text-3xl md:text-4xl">Add-ons</h1>
            <label className="relative inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border bg-white/80 px-3.5 font-sans text-sm text-cocoa transition-colors duration-200 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:border-accent sm:h-10 border-pastel-sand/70">
              <ArrowUpDown className="h-4 w-4 text-cocoa-light" />
              <span className="sm:hidden" aria-hidden="true">Sort</span>
              <span className="hidden sm:inline" aria-hidden="true">{SORTS.find(s => s.value === sort)?.label}</span>
              <ChevronDown className="h-4 w-4 text-cocoa-light" />
              <select aria-label="Sort by" value={sort} onChange={e => setSort(e.target.value)} className="absolute inset-0 cursor-pointer appearance-none opacity-0">
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>
          <p className="max-w-prose font-sans text-sm text-cocoa-light">Candles, toppers and party bits to go with your cake.</p>
        </header>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <label className="relative block md:order-2 md:w-72 md:shrink-0">
            <span className="sr-only">Search add-ons</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-light" />
            <input type="search" placeholder="Search add-ons" value={q} onChange={e => setQ(e.target.value)} className="h-11 w-full appearance-none rounded-full border border-pastel-sand/70 bg-white pl-10 pr-11 font-sans text-base text-cocoa placeholder:text-cocoa-light/80 transition-colors duration-200 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 sm:text-sm [&::-webkit-search-cancel-button]:hidden" />
            {q && (
              <button type="button" aria-label="Clear search" onClick={() => setQ('')} className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-cocoa-light hover:bg-cream hover:text-cocoa">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          {categories.length > 1 && <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 md:order-1" role="list">
            <li><button type="button" className={chip(cat === 'all')} onClick={() => setCat('all')}>All</button></li>
            {categories.map(c => (
              <li key={c.slug}><button type="button" className={chip(cat === c.slug)} onClick={() => setCat(c.slug)}>{c.name}</button></li>
            ))}
          </ul>}
        </div>
        {items.length ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {items.map(p => <MenuProductCard key={p.id} product={p} showDescription />)}
          </div>
        ) : (
          <p className="rounded-2xl border border-pastel-sand/60 bg-white px-6 py-12 text-center font-sans text-sm text-cocoa-light">No add-ons match “{q}”.</p>
        )}
      </div>
    </div>
  );
}
