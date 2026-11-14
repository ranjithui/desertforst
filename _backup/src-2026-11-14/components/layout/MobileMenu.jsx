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
    <nav id="mobile-menu" aria-label="Main" className="lg:hidden panel fixed inset-0 z-[70] overflow-y-auto overscroll-contain animate-in fade-in duration-200">
      <div className="flex items-center justify-between px-4 py-2 sm:px-6">
        <img src="/desert-forest-logo.svg" alt="" className="h-10 w-auto sm:h-12" />
        <button
          className="inline-flex items-center justify-center text-sm font-medium transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] hover:bg-pastel-sand/40 h-10 w-10 text-cocoa hover:text-accent rounded-full"
          aria-label="Close menu"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <ul className="px-8 py-6 flex flex-col items-center gap-8" role="list">
        {cakeNav.filter(c => !HIDDEN_NAV.includes(c.name)).map((cat, i) => {
          const isOpen = expanded === cat.slug;
          return (
            <li key={cat.slug} className="w-full max-w-xs text-center animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
              <div className="flex items-center justify-center gap-2">
                <Link className="font-sans text-xl font-light tracking-wide py-2 text-cocoa" to={`/${cat.slug}`} onClick={onClose}>
                  {cat.name}
                </Link>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={`${cat.name} sub-categories`}
                  className="p-2 text-cocoa-light hover:text-accent transition-colors duration-200"
                  onClick={() => setExpanded(isOpen ? null : cat.slug)}
                >
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {isOpen && (
                <ul className="mt-2 space-y-1 animate-in fade-in duration-200" role="list">
                  {cat.children.map(sub => (
                    <li key={sub.slug}>
                      <Link className="block rounded-lg py-2 font-sans text-base font-light text-cocoa-muted transition-colors duration-200 hover:bg-[rgba(228,211,190,0.3)] hover:text-accent" to={`/${cat.slug}/${sub.slug}`} onClick={onClose}>
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
        {layout.navLinks.filter(l => !HIDDEN_NAV.includes(l.label)).map(l => (
          <li key={l.url}>
            <Link className="block font-sans text-xl font-light tracking-wide transition-[color,background-color] duration-200 py-2 rounded-lg hover:bg-[rgba(228,211,190,0.3)] hover:text-accent active:bg-[rgba(228,211,190,0.5)] active:text-accent-hover text-cocoa" to={l.url} onClick={onClose}>
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <Link className="flex items-center gap-2 font-sans text-xl font-light tracking-wide py-2 rounded-lg hover:bg-[rgba(228,211,190,0.3)] hover:text-accent text-cocoa" to="/login" onClick={onClose}>
            <User className="w-5 h-5" /> Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}
