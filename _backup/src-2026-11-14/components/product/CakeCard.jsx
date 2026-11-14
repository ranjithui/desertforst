import { Link } from 'react-router-dom';
import { discountPct } from '../../lib/format';

/** Listing tile for designer cakes (category, sub-category and search grids). */
export default function CakeCard({ cake }) {
  const off = discountPct(cake.from_price, cake.compare_from_price);
  return (
    <Link
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-pastel-sand/60 bg-white shadow-soft transition-shadow duration-300 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      to={`/cakes/${cake.slug}`}
    >
      <div className="relative aspect-square overflow-hidden bg-pastel-sand/30">
        <img src={cake.image_url} alt={cake.name} loading="lazy" className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none ${cake.sold_out ? 'opacity-60 grayscale' : ''}`} />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 font-sans text-[11px] font-semibold tabular-nums text-cocoa shadow-soft">{cake.weights[0]} kg</span>
        {cake.sold_out ? (
          <span className="absolute right-3 top-3 rounded-full bg-cocoa px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-white shadow-soft">Sold out</span>
        ) : off > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-green-700 px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-white shadow-soft">{off}% off</span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug transition-colors text-cocoa duration-200 group-hover:text-accent">{cake.name}</h3>
        <p className="mt-1 font-sans text-[11px] font-light tracking-[0.06em] text-cocoa-light">SKU: {cake.sku}</p>
        <div className="mt-auto pt-3.5">
          <div className="flex flex-wrap items-baseline gap-x-1.5 border-t border-pastel-sand/50 pt-3">
            <span className="font-sans text-[11px] text-cocoa-light">from</span>
            <span className="font-sans text-[17px] font-semibold tabular-nums text-accent-strong">₹{cake.from_price.toFixed(2)}</span>
            {cake.compare_from_price > cake.from_price && (
              <s className="font-sans text-[13px] tabular-nums text-cocoa-light decoration-cocoa-light/60">
                <span className="sr-only">was </span>₹{cake.compare_from_price.toFixed(2)}
              </s>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
