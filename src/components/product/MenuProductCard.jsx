import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { VegMark, WhatsAppIcon } from '../ui/Icons';
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

/** Opens the options dialog (size, message, add-ons, branch), which sends the order on WhatsApp. */
export function useOrder(product) {
  const { setOptions } = useShop();
  return { order: () => setOptions(product) };
}

export function OrderButton({ product, className = '' }) {
  const { order } = useOrder(product);
  return (
    <button type="button" onClick={order} className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-accent bg-cream font-sans text-sm font-semibold text-accent-strong transition-colors duration-200 cursor-pointer hover:bg-accent hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}>
      <WhatsAppIcon className="h-4 w-4 shrink-0" />
      <span className="sm:hidden">Order</span>
      <span className="hidden sm:inline">Order on WhatsApp</span>
    </button>
  );
}

/** Product tile used for the home "Favourites" rail and the Our Menu grid. */
export default function MenuProductCard({ product, showDescription = false }) {
  const { order } = useOrder(product);
  const [expanded, setExpanded] = useState(false);
  const variants = variantsOf(product);
  const from = Math.min(...variants.map(v => v.price_city));
  const first = variants.find(v => v.price_city === from);
  const was = first?.compare_at_price_city > from ? first.compare_at_price_city : 0;

  return (
    <div className="m-card group">
      <button type="button" onClick={order} aria-label={`${product.name} — open options`} className="block cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-[14px]">
        <div className="m-card__media">
          <img src={product.image_url} alt={product.name} loading="lazy" />
          <div className="m-card__chips">
            <span className="m-chip">{variants.length > 1 ? `${variants.length} sizes` : variants[0]?.variant_name || 'Fresh'}</span>
            {was > 0 && <span className="m-chip m-chip--olive">Save ₹{was - from}</span>}
          </div>
        </div>
      </button>
      <div className="m-card__body">
        <div className="flex items-start justify-between gap-2">
          <h3 className="m-card__title min-w-0 flex-1">{product.name}</h3>
          {product.is_veg !== false && <VegMark className="mt-0.5 shrink-0" />}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <Tags product={product} />
        </div>
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
        <div className="m-card__foot">
          <div className="m-price">
            <small>from</small>
            <strong>₹{from}</strong>
            {was > 0 && <s><span className="sr-only">was </span>₹{was}</s>}
          </div>
        </div>
        <button type="button" onClick={order} className="m-card__order">
          <WhatsAppIcon className="h-4 w-4 shrink-0" /> Order on WhatsApp
        </button>
      </div>
    </div>
  );
}
