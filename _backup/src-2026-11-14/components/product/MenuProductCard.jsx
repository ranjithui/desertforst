import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { VegMark } from '../ui/Icons';
import { variantsOf } from './ProductOptionsDialog';

export function Tags({ product }) {
  return (
    <>
      {product.custom_tag && (
        <span className="font-sans text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded border border-cocoa/25 bg-white text-cocoa shrink-0">{product.custom_tag}</span>
      )}
      {product.show_customisable_tag && product.customisations?.length > 0 && (
        <span className="font-sans text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded border border-cocoa/25 bg-white text-cocoa shrink-0">Customisable</span>
      )}
    </>
  );
}

/** Opens the store picker first, then the options dialog — the original's "Pick a store to order" flow. */
export function useOrder(product) {
  const { store, requireStore, setOptions } = useShop();
  return { store, order: () => requireStore(() => setOptions(product)) };
}

export function OrderButton({ product, className = '' }) {
  const { store, order } = useOrder(product);
  const from = Math.min(...variantsOf(product).map(v => v.price_city));
  return (
    <button type="button" onClick={order} className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-accent bg-cream font-sans text-sm font-semibold text-accent-strong transition-colors duration-200 cursor-pointer hover:bg-accent hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}>
      {store ? (
        <>
          <Plus className="h-4 w-4 shrink-0" />
          <span>Add · ₹{from}</span>
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="sm:hidden">Pick a store</span>
          <span className="hidden sm:inline">Pick a store to order</span>
        </>
      )}
    </button>
  );
}

/** Product tile used for "Coimbatore's Favourites" and the Our Menu grid. */
export default function MenuProductCard({ product, showDescription = false }) {
  const { order } = useOrder(product);
  const [expanded, setExpanded] = useState(false);
  const Head = showDescription ? 'div' : 'button';
  const headProps = showDescription
    ? {}
    : { type: 'button', onClick: order, 'aria-label': `${product.name} — open options`, className: 'block cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset' };

  return (
    <div className="panel group flex h-full flex-col overflow-hidden rounded-2xl shadow-soft transition-shadow duration-300 hover:shadow-hover">
      <Head {...headProps}>
        <div className="relative aspect-square overflow-hidden bg-pastel-sand/30">
          <img src={product.image_url} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        </div>
        <div className="p-4 pb-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 font-display text-base font-semibold leading-tight text-cocoa transition-colors duration-300 group-hover:text-accent-strong">{product.name}</h3>
            {product.is_veg !== false && <VegMark className="shrink-0" />}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Tags product={product} />
          </div>
        </div>
      </Head>
      <div className="flex flex-1 flex-col px-4 pb-4">
        {showDescription && product.description && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={`Read the full description of ${product.name}`}
            onClick={() => setExpanded(e => !e)}
            className={`mt-2 w-full rounded text-left font-sans text-sm leading-relaxed text-cocoa-light cursor-pointer hover:text-cocoa-muted transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${expanded ? '' : 'line-clamp-2'}`}
          >
            {product.description}
          </button>
        )}
        <div className="mt-auto pt-4">
          <OrderButton product={product} />
        </div>
      </div>
    </div>
  );
}
