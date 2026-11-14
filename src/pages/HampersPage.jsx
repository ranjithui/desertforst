import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowUpDown, ChevronDown, Gift } from 'lucide-react';
import { pages } from '../lib/data';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import MenuProductCard from '../components/product/MenuProductCard';
import NotFound from './NotFound';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];
const asProduct = h => ({ id: h.id, name: h.name, image_url: h.images[0], price_city: h.price, variants: [], is_veg: false, category: { allows_addons: false } });

/** /gifting/:slug — hampers listing (other gifting ranges show a coming-soon state). */
export default function HampersPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const tile = pages.gifting.tiles.find(t => t.link === `/gifting/${slug}`);
  const sort = params.get('sort') || 'featured';

  useEffect(() => {
    if (tile) document.title = `${tile.label} | Desert Forest`;
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!tile) return <NotFound />;
  let items = slug === 'hampers' ? pages.hampers.hampers.map(asProduct) : [];
  if (sort === 'price-asc') items = [...items].sort((a, b) => a.price_city - b.price_city);
  if (sort === 'price-desc') items = [...items].sort((a, b) => b.price_city - a.price_city);

  return (
    <div className="min-h-screen bg-bakery-bg">
      <div className="mx-auto max-w-7xl space-y-6 px-4 pb-16 pt-6 sm:space-y-8 sm:px-6 sm:pt-8">
        <header className="space-y-3">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Gifting', to: '/gifting' }, { label: tile.label }]} />
          <div className="flex items-center justify-between gap-4">
            <h1 className="min-w-0 font-display text-[1.75rem] font-semibold leading-tight text-cocoa sm:text-3xl md:text-4xl">{tile.label}</h1>
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
          <p className="font-sans text-sm text-cocoa-light">{items.length} to choose from</p>
        </header>
        {items.length ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {items.map(p => <MenuProductCard key={p.id} product={p} showDescription />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-pastel-sand/60 bg-white px-6 py-16 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pastel-sand/40 text-accent"><Gift className="h-7 w-7" /></span>
            <p className="font-display text-xl font-semibold text-cocoa">{tile.label} are coming soon</p>
            <p className="mt-2 font-sans text-sm text-cocoa-light">We're putting the finishing touches on this range. Our hampers are ready to gift today.</p>
            <Link to="/gifting/hampers" className="mt-5 inline-flex h-11 items-center rounded-full bg-accent px-6 font-sans text-sm font-semibold text-cream transition-colors hover:bg-accent-hover">Shop hampers</Link>
          </div>
        )}
      </div>
    </div>
  );
}
