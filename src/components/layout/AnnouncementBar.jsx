import { Link } from 'react-router-dom';
import { MapPin, Store, Truck, Wheat } from 'lucide-react';

const ITEMS = [
  { Icon: MapPin, text: 'Coimbatore, Tamil Nadu' },
  { Icon: Truck, text: 'Same-day Delivery*' },
  { Icon: Wheat, text: 'Freshly Baked, Every Day' },
];

/** Slim chocolate info bar above the header: location + promises, store locator on the right. */
export default function AnnouncementBar() {
  return (
    <div className="df-topbar" role="region" aria-label="Store information">
      <div className="m-wrap df-topbar__inner">
        <ul className="df-topbar__list" role="list">
          {ITEMS.map(({ Icon, text }) => (
            <li key={text}><Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" /> {text}</li>
          ))}
        </ul>
        <Link to="/stores" className="df-topbar__link">
          <Store className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" /> Store Locator
        </Link>
      </div>
    </div>
  );
}
