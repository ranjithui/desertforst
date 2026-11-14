import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User, X } from 'lucide-react';
import { cakeNav, layout } from '../../lib/data';

// Menu tabs hidden from the navigation (pages still exist at their URLs)
const HIDDEN_NAV = ['Gifting', 'Classic Cakes'];

/** Full-screen mobile navigation with expandable sub-category lists. */
export default function MobileMenu({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <nav id="mobile-menu" aria-label="Main" className="m-only-mobile m-mmenu fixed inset-0 z-[70] overflow-y-auto overscroll-contain animate-in fade-in duration-200">
      <div className="m-wrap flex items-center justify-between pt-4">
        <img src="/desert-forest-logo.svg" alt="" className="h-11 w-auto" />
        <button className="m-icon-btn m-icon-btn--solid" aria-label="Close menu" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>
      <ul className="m-wrap mt-8 pb-10" role="list">
        {cakeNav.filter(c => !HIDDEN_NAV.includes(c.name)).map((cat, i) => {
          const isOpen = expanded === cat.slug;
          return (
            <li key={cat.slug} className="m-mmenu__row animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
              <div className="flex items-center justify-between gap-2">
                <Link className="m-mmenu__link" to={`/${cat.slug}`} onClick={onClose}>
                  <small>0{i + 1}</small>{cat.name}
                </Link>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={`${cat.name} sub-categories`}
                  className="m-icon-btn bg-white shadow-soft"
                  onClick={() => setExpanded(isOpen ? null : cat.slug)}
                >
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {isOpen && (
                <ul className="flex flex-wrap gap-2 pb-5 animate-in fade-in duration-200" role="list">
                  {cat.children.map(sub => (
                    <li key={sub.slug}>
                      <Link className="m-tab" to={`/${cat.slug}/${sub.slug}`} onClick={onClose}>{sub.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
        {layout.navLinks.filter(l => !HIDDEN_NAV.includes(l.label)).map((l, i) => (
          <li key={l.url} className="m-mmenu__row">
            <Link className="m-mmenu__link" to={l.url} onClick={onClose}>
              <small>0{cakeNav.filter(c => !HIDDEN_NAV.includes(c.name)).length + i + 1}</small>{l.label}
            </Link>
          </li>
        ))}
        <li className="mt-8">
          <Link className="m-btn m-btn--primary w-full" to="/login" onClick={onClose}>
            <User className="h-5 w-5" /> Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}
