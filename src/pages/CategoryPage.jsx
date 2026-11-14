import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { findCategory, listingFor } from '../lib/data';
import { SORTS, sortCakes } from '../lib/sort';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import CakeCard from '../components/product/CakeCard';
import NotFound from './NotFound';

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
    <div className="min-h-screen pb-6">
      <div className="m-wrap space-y-6 pt-6 sm:space-y-8 sm:pt-8">
        <header className="m-pagehead">
          <Breadcrumbs items={crumbs} />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="m-eyebrow">{sub ? category.name : 'Collection'}</span>
              <h1 className="m-h1 mt-3" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}>{title}</h1>
              <p className="mt-3 font-sans text-sm text-cocoa-light">{cakes.length} {cakes.length === 1 ? 'design' : 'designs'} to choose from</p>
            </div>
            <label className="relative inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-white px-4 font-sans text-sm font-medium text-cocoa shadow-soft transition-colors duration-200 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
              <ArrowUpDown className="h-4 w-4 text-cocoa-light" />
              <span className="sm:hidden" aria-hidden="true">Sort</span>
              <span className="hidden sm:inline" aria-hidden="true">{SORTS.find(s => s.value === sort)?.label}</span>
              <ChevronDown className="h-4 w-4 text-cocoa-light" />
              <select aria-label="Sort by" value={sort} onChange={e => setParams(e.target.value === 'featured' ? {} : { sort: e.target.value }, { replace: true })} className="absolute inset-0 cursor-pointer appearance-none opacity-0">
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>
        </header>

        {children.length > 0 && (
          <ul className="m-tabs" role="list">
            <li><Link className={`m-tab ${!sub ? 'is-active' : ''}`} to={`/${category.slug}`}>All</Link></li>
            {children.map(c => (
              <li key={c.slug}><Link className={`m-tab ${sub?.slug === c.slug ? 'is-active' : ''}`} to={`/${category.slug}/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        )}

        {cakes.length ? (
          <div className="m-grid">
            {cakes.map(c => <CakeCard key={c.slug} cake={c} />)}
          </div>
        ) : (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center shadow-soft">
            <p className="font-display text-xl font-semibold text-cocoa">New designs are on the way</p>
            <p className="mt-2 font-sans text-sm text-cocoa-light">Browse the full collection in the meantime.</p>
            <Link to={`/${category.slug}`} className="m-btn m-btn--primary mt-6">See all {category.name}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
