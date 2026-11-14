import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { findCategory, listingFor } from '../lib/data';
import { SORTS, sortCakes } from '../lib/sort';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import CakeCard from '../components/product/CakeCard';
import NotFound from './NotFound';

const chip = active =>
  `inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-4 py-2 font-sans text-sm transition-colors duration-200 ${active ? 'border-accent bg-accent text-cream' : 'border-pastel-sand/70 bg-white/80 text-cocoa hover:border-accent hover:text-accent'}`;

/** /birthday-cakes, /theme-cakes/floral … : sub-category chips, sort, product grid. */
export default function CategoryPage() {
  const { category: catSlug, sub: subSlug } = useParams();
  const [params, setParams] = useSearchParams();
  const sort = params.get('sort') || 'featured';
  const found = findCategory(catSlug, subSlug);

  useEffect(() => {
    if (found) document.title = `${(found.sub || found.category).name} | Desert Forest`;
  }, [found]);

  if (!found || catSlug === 'gifting') return <NotFound />;
  const { category, sub, children } = found;
  const cakes = sortCakes(listingFor(catSlug, subSlug), sort);
  const title = (sub || category).name;
  const crumbs = [{ label: 'Home', to: '/' }, sub ? { label: category.name, to: `/${category.slug}` } : null, { label: title }].filter(Boolean);

  return (
    <div className="min-h-screen bg-bakery-bg">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 space-y-6 sm:space-y-8">
        <header className="space-y-3">
          <Breadcrumbs items={crumbs} />
          <div className="flex items-center justify-between gap-4">
            <h1 className="min-w-0 font-display text-[1.75rem] font-semibold leading-tight text-cocoa sm:text-3xl md:text-4xl">{title}</h1>
            <label className="relative inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border bg-white/80 px-3.5 font-sans text-sm text-cocoa transition-colors duration-200 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:border-accent sm:h-10 border-pastel-sand/70">
              <ArrowUpDown className="h-4 w-4 text-cocoa-light" />
              <span className="sm:hidden" aria-hidden="true">Sort</span>
              <span className="hidden sm:inline" aria-hidden="true">{SORTS.find(s => s.value === sort)?.label}</span>
              <ChevronDown className="h-4 w-4 text-cocoa-light" />
              <select aria-label="Sort by" value={sort} onChange={e => setParams(e.target.value === 'featured' ? {} : { sort: e.target.value }, { replace: true })} className="absolute inset-0 cursor-pointer appearance-none opacity-0">
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>
          <p className="font-sans text-sm text-cocoa-light">{cakes.length} {cakes.length === 1 ? 'cake' : 'cakes'} to choose from</p>
        </header>

        {children.length > 0 && (
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="list">
            <li><Link className={chip(!sub)} to={`/${category.slug}`}>All</Link></li>
            {children.map(c => (
              <li key={c.slug}><Link className={chip(sub?.slug === c.slug)} to={`/${category.slug}/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        )}

        {cakes.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-7">
            {cakes.map(c => <CakeCard key={c.slug} cake={c} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-pastel-sand/60 bg-white px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-cocoa">New designs are on the way</p>
            <p className="mt-2 font-sans text-sm text-cocoa-light">Browse the full collection in the meantime.</p>
            <Link to={`/${category.slug}`} className="mt-5 inline-flex h-11 items-center rounded-full bg-accent px-6 font-sans text-sm font-semibold text-cream hover:bg-accent-hover">See all {category.name}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
