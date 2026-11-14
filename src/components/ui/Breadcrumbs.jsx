import { Fragment } from 'react';
import { Link } from 'react-router-dom';

/** items: [{ label, to? }] — last item renders as current page. */
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="font-sans text-xs text-cocoa-light">
      {items.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="px-1.5" aria-hidden="true">/</span>}
          {it.to ? (
            <Link className="transition-colors duration-200 hover:text-accent" to={it.to}>{it.label}</Link>
          ) : (
            <span className="text-cocoa">{it.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
