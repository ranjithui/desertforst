import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpDown, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { cakeNav, listings } from '../lib/data';
import { cakesWithFlavour, flavourBySlug, searchCakes } from '../lib/search';
import CakeCard from '../components/product/CakeCard';

const STEP = 50;
const inr = n => `₹${n.toLocaleString('en-IN')}`;
const thumb = '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(72,45,24,0.35)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-accent';
const numCls = 'h-10 w-full rounded-lg border border-[color:var(--line)] bg-[rgba(240,236,230,0.5)] pl-6 pr-2 font-sans text-sm tabular-nums text-cocoa focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(75,85,62,0.15)]';

const inCategory = (cake, catSlug, subSlug) =>
  cake.breadcrumbs?.some(b => b.category?.slug === catSlug && (!subSlug || b.sub?.slug === subSlug));

function Filters({ bounds, price, setPrice, cats, toggleCat, counts }) {
  const [open, setOpen] = useState({});
  const [lo, hi] = price;
  const pct = v => ((v - bounds[0]) / Math.max(1, bounds[1] - bounds[0])) * 100;
  return (
    <div className="space-y-3 pb-4 lg:pb-0">
      <section className="rounded-2xl border border-[color:var(--line)] bg-white p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-cocoa">Price</h3>
          <span className="font-sans text-sm tabular-nums text-cocoa-muted">{inr(lo)} – {inr(hi)}</span>
        </div>
        <div className="relative mb-2 mt-6 h-5">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-pastel-sand" />
          <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
          <input type="range" min={bounds[0]} max={bounds[1]} step={STEP} value={lo} aria-label="Lowest price" onChange={e => setPrice([Math.min(+e.target.value, hi), hi])} className={`pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent focus:outline-none z-10 ${thumb}`} />
          <input type="range" min={bounds[0]} max={bounds[1]} step={STEP} value={hi} aria-label="Highest price" onChange={e => setPrice([lo, Math.max(+e.target.value, lo)])} className={`pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent focus:outline-none z-10 ${thumb}`} />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Minimum price</span>
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-sans text-sm text-cocoa-light" aria-hidden="true">₹</span>
            <input type="text" inputMode="numeric" className={numCls} value={lo} onChange={e => setPrice([Math.min(Number(e.target.value.replace(/\D/g, '')) || bounds[0], hi), hi])} />
          </label>
          <span className="text-cocoa-light" aria-hidden="true">–</span>
          <label className="relative flex-1">
            <span className="sr-only">Maximum price</span>
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 font-sans text-sm text-cocoa-light" aria-hidden="true">₹</span>
            <input type="text" inputMode="numeric" className={numCls} value={hi} onChange={e => setPrice([lo, Math.max(Number(e.target.value.replace(/\D/g, '')) || bounds[1], lo)])} />
          </label>
        </div>
      </section>
      <section className="rounded-2xl border border-[color:var(--line)] bg-white p-5">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-cocoa">Categories</h3>
        <ul className="mt-3 space-y-0.5">
          {cakeNav.filter(c => counts[c.slug]).sort((a, b) => counts[b.slug] - counts[a.slug]).map(c => (
            <li key={c.slug}>
              <div className="flex items-center gap-1">
                <label className="flex min-h-10 flex-1 cursor-pointer items-center gap-3 rounded-lg px-1.5 font-sans text-sm text-cocoa transition-colors duration-150 hover:bg-cream">
                  <input type="checkbox" checked={cats.includes(c.slug)} onChange={() => toggleCat(c.slug)} className="h-4 w-4 shrink-0 cursor-pointer rounded accent-[var(--accent)]" />
                  <span className="flex-1">{c.name}</span>
                  <span className="tabular-nums text-cocoa-light">{counts[c.slug]}</span>
                </label>
                <button type="button" aria-expanded={!!open[c.slug]} aria-label={`Show ${c.name} sub-categories`} onClick={() => setOpen(o => ({ ...o, [c.slug]: !o[c.slug] }))} className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-cocoa-light transition-colors duration-150 hover:bg-cream hover:text-cocoa">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open[c.slug] ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {open[c.slug] && (
                <ul className="ml-7 space-y-0.5 pb-1">
                  {c.children.filter(s => counts[`${c.slug}/${s.slug}`]).map(s => {
                    const key = `${c.slug}/${s.slug}`;
                    return (
                      <li key={key}>
                        <label className="flex min-h-9 cursor-pointer items-center gap-3 rounded-lg px-1.5 font-sans text-sm text-cocoa-muted transition-colors duration-150 hover:bg-cream">
                          <input type="checkbox" checked={cats.includes(key)} onChange={() => toggleCat(key)} className="h-4 w-4 shrink-0 cursor-pointer rounded accent-[var(--accent)]" />
                          <span className="flex-1">{s.name}</span>
                          <span className="tabular-nums text-cocoa-light">{counts[key]}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** /search?q= or ?flavour= — results with price + category filters and sorting. */
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const flavour = flavourBySlug(params.get('flavour') || '');
  const sort = params.get('sort') || 'relevance';
  const [drawer, setDrawer] = useState(false);
  const [cats, setCats] = useState([]);

  const base = useMemo(() => (flavour ? cakesWithFlavour(flavour.id) : searchCakes(q)), [q, flavour]);
  const bounds = useMemo(() => {
    if (!base.length) return [0, 0];
    const ps = base.map(c => c.from_price);
    return [Math.floor(Math.min(...ps) / STEP) * STEP, Math.ceil(Math.max(...ps) / STEP) * STEP];
  }, [base]);
  const [price, setPrice] = useState(bounds);
  useEffect(() => { setPrice(bounds); setCats([]); }, [bounds]);
  useEffect(() => { document.title = `Search: ${flavour?.name || q} | Desert Forest`; }, [q, flavour]);

  const counts = useMemo(() => {
    const c = {};
    // Count each cake once per category / sub-category, even if it has several breadcrumbs there.
    for (const cake of base) {
      const keys = new Set();
      for (const b of cake.breadcrumbs || []) {
        if (!b.category) continue;
        keys.add(b.category.slug);
        if (b.sub) keys.add(`${b.category.slug}/${b.sub.slug}`);
      }
      keys.forEach(k => { c[k] = (c[k] || 0) + 1; });
    }
    // Top-level totals follow the category listings (a cake can be listed without a breadcrumb there).
    const slugs = new Set(base.map(x => x.slug));
    for (const cat of cakeNav) {
      const l = listings[`/${cat.slug}`];
      if (l) c[cat.slug] = l.cakes.filter(s => slugs.has(s)).length;
    }
    return c;
  }, [base]);

  let results = base.filter(c => c.from_price >= price[0] && c.from_price <= price[1]);
  if (cats.length) results = results.filter(c => cats.some(k => { const [cat, sub] = k.split('/'); return inCategory(c, cat, sub); }));
  if (sort === 'price-asc') results = [...results].sort((a, b) => a.from_price - b.from_price);
  if (sort === 'price-desc') results = [...results].sort((a, b) => b.from_price - a.from_price);

  const toggleCat = k => setCats(c => (c.includes(k) ? c.filter(x => x !== k) : [...c, k]));
  const setSort = v => { const p = new URLSearchParams(params); v === 'relevance' ? p.delete('sort') : p.set('sort', v); setParams(p, { replace: true }); };
  const filters = <Filters bounds={bounds} price={price} setPrice={setPrice} cats={cats} toggleCat={toggleCat} counts={counts} />;

  return (
    <div className="min-h-[60vh] bg-cream">
      <div className="container py-8 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">{flavour ? 'Flavour' : 'Search results'}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-cocoa md:text-4xl">
              {results.length} {results.length === 1 ? 'result' : 'results'} for <span className="break-words text-accent">“{flavour ? flavour.name : q}”</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setDrawer(true)} className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 font-sans text-sm font-medium text-cocoa transition-colors duration-200 hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />Filters
            </button>
            <label className="relative inline-flex items-center">
              <span className="sr-only">Sort by</span>
              <ArrowUpDown className="pointer-events-none absolute left-4 h-4 w-4 text-cocoa-light" />
              <select value={sort} onChange={e => setSort(e.target.value)} className="h-11 cursor-pointer appearance-none rounded-full border border-[color:var(--line)] bg-white pl-10 pr-10 font-sans text-sm font-medium text-cocoa transition-colors duration-200 hover:border-accent focus:border-accent focus:outline-none focus:ring-4 focus:ring-[rgba(75,85,62,0.1)]">
                <option value="relevance">Best match</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-cocoa-light" />
            </label>
          </div>
        </div>
        <div className="mt-8 flex gap-8 lg:gap-10">
          {base.length > 0 && (
            <aside className="hidden w-72 shrink-0 lg:block" aria-label="Filters">
              <div className="sticky top-[calc(var(--site-header)+1.5rem)] transition-[top] duration-300 ease-intent max-h-[calc(100vh-var(--site-header)-3rem)] overflow-y-auto overscroll-contain rounded-2xl pb-1">{filters}</div>
            </aside>
          )}
          <section className="min-w-0 flex-1" aria-label="Cakes">
            {results.length ? (
              <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-6">
                {results.map(c => <li key={c.slug}><CakeCard cake={c} /></li>)}
              </ul>
            ) : (
              <div className="rounded-2xl border border-[color:var(--line)] bg-white px-6 py-16 text-center">
                <p className="font-display text-xl font-semibold text-cocoa">No cakes found</p>
                <p className="mt-2 font-sans text-sm text-cocoa-light">Try a different word, or browse our collections.</p>
                <Link to="/birthday-cakes" className="mt-5 inline-flex h-11 items-center rounded-full bg-accent px-6 font-sans text-sm font-semibold text-cream hover:bg-accent-hover">Browse birthday cakes</Link>
              </div>
            )}
          </section>
        </div>
      </div>
      {drawer && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <div className="absolute inset-0 bg-cocoa/40 animate-in fade-in" onClick={() => setDrawer(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-label="Filters" className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-cream p-5 animate-in slide-in-from-bottom duration-300">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-cocoa">Filters</h2>
              <button type="button" aria-label="Close filters" onClick={() => setDrawer(false)} className="flex h-10 w-10 items-center justify-center rounded-full text-cocoa-light hover:bg-pastel-sand/40"><X className="h-5 w-5" /></button>
            </div>
            {filters}
            <button type="button" onClick={() => setDrawer(false)} className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-accent font-sans text-sm font-semibold text-cream">Show {results.length} results</button>
          </div>
        </div>
      )}
    </div>
  );
}
