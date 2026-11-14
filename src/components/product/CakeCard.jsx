import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { discountPct } from '../../lib/format';

/** Listing tile for designer cakes (category, sub-category and search grids). */
export default function CakeCard({ cake }) {
  const off = discountPct(cake.from_price, cake.compare_from_price);
  return (
    <Link className="m-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2" to={`/cakes/${cake.slug}`}>
      <div className="m-card__media">
        <img src={cake.image_url} alt={cake.name} loading="lazy" className={cake.sold_out ? 'opacity-60 grayscale' : ''} />
        <div className="m-card__chips">
          <span className="m-chip">{cake.weights[0]} kg</span>
          {cake.sold_out ? <span className="m-chip m-chip--ink">Sold out</span> : off > 0 && <span className="m-chip m-chip--olive">{off}% off</span>}
        </div>
      </div>
      <div className="m-card__body">
        <h3 className="m-card__title line-clamp-2">{cake.name}</h3>
        <p className="m-card__meta">SKU {cake.sku}</p>
        <div className="m-card__foot">
          <div className="m-price">
            <small>from</small>
            <strong>₹{Math.round(cake.from_price)}</strong>
            {cake.compare_from_price > cake.from_price && (
              <s><span className="sr-only">was </span>₹{Math.round(cake.compare_from_price)}</s>
            )}
          </div>
          <span className="m-card__go" aria-hidden="true"><ArrowUpRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  );
}
