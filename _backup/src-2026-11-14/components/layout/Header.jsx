import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, User } from 'lucide-react';
import { cakeNav, layout } from '../../lib/data';

// Menu tabs hidden from the navigation (pages still exist at their URLs)
const HIDDEN_NAV = ['Gifting', 'Classic Cakes'];
import SearchBox from './SearchBox';
import MobileMenu from './MobileMenu';

const navLinkCls = active =>
  `group font-sans text-[0.8125rem] lg:text-[0.84375rem] font-semibold py-2 relative block whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded ${active ? 'text-accent' : 'text-cocoa hover:text-accent active:text-accent-hover'}`;
const underline = active =>
  `absolute bottom-0 left-0 h-px bg-accent transition-transform duration-200 origin-left w-full ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`;

const ANNOUNCEMENT_H = 36;

/**
 * Sticky header below the announcement bar. Scrolling down slides the logo/search row
 * out of view (desktop keeps the category nav pinned, as on the original); scrolling up
 * brings it back. `--site-header` is kept in sync for sticky children (filters, scroll padding).
 */
export default function Header() {
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 6) return;
      setHidden(y > lastY && y > 160);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const total = ANNOUNCEMENT_H + (wrapRef.current?.offsetHeight || 0);
    const shift = hidden ? headerRef.current?.offsetHeight || 0 : 0;
    document.documentElement.style.setProperty('--site-header', `${total - shift}px`);
  });

  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = href => pathname === href || pathname.startsWith(href + '/');
  const shift = hidden ? headerRef.current?.offsetHeight || 0 : 0;

  return (
    <>
      <div
        ref={wrapRef}
        className="sticky z-50 transition-transform duration-300 ease-intent motion-reduce:transition-none"
        style={{ top: `${ANNOUNCEMENT_H}px`, transform: `translateY(-${shift}px)` }}
      >
        <header ref={headerRef} className="relative z-[55] bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 py-2 lg:grid lg:grid-cols-[1fr_minmax(0,40rem)_1fr] lg:gap-8 lg:py-2.5">
              <div className="flex flex-1 items-center lg:flex-none">
                <Link className="shrink-0 rounded transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2" aria-label="Desert Forest — Home" to="/">
                  <img src="/desert-forest-logo.svg" alt="Desert Forest" className="h-10 w-auto sm:h-12 lg:h-14" />
                </Link>
              </div>
              <div className="relative hidden lg:block">
                <SearchBox />
              </div>
              <div className="flex items-center justify-end gap-1">
                <div className="hidden lg:block">
                  <Link aria-label="Login" to="/login" className="inline-flex items-center justify-center text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] rounded-full w-10 h-10 text-cocoa hover:bg-accent hover:text-cream transition-colors duration-200">
                    <User className="w-5 h-5" />
                  </Link>
                </div>
                <button
                  className="inline-flex items-center justify-center text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] h-10 w-10 lg:hidden text-cocoa hover:text-accent hover:bg-[rgba(228,211,190,0.4)] active:bg-[rgba(75,85,62,0.1)] rounded-full transition-[color,background-color] duration-200"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  aria-label="Open menu"
                  onClick={() => setMenuOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="relative pb-2.5 lg:hidden">
              <SearchBox />
            </div>
          </div>
        </header>

        <nav className="hidden border-y border-[color:var(--line)] bg-white lg:block" aria-label="Main">
          <ul className="flex h-12 items-center justify-center gap-6 px-8 xl:gap-9" role="list">
            {cakeNav.filter(c => !HIDDEN_NAV.includes(c.name)).map(cat => {
              const href = `/${cat.slug}`;
              const active = isActive(href);
              return (
                <li key={cat.slug} className="group/menu relative">
                  <Link className={navLinkCls(active)} to={href}>
                    <span className="inline-flex items-center gap-1">
                      {cat.name}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover/menu:rotate-180" aria-hidden="true" />
                    </span>
                    <span className={underline(active)} aria-hidden="true" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 min-w-[13rem] -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-[opacity,visibility,transform] duration-200 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100 motion-reduce:transition-none">
                    <ul className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-white shadow-soft-lg" role="list" aria-label={cat.name}>
                      {cat.children.map(sub => (
                        <li key={sub.slug}>
                          <Link className="block whitespace-nowrap px-4 py-2.5 font-sans text-sm font-medium text-cocoa transition-colors duration-200 hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream focus-visible:outline-none" to={`${href}/${sub.slug}`}>
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
            {layout.navLinks.filter(l => !HIDDEN_NAV.includes(l.label)).map(l => (
              <li key={l.url}>
                <Link className={navLinkCls(isActive(l.url))} to={l.url}>
                  {l.label}
                  <span className={underline(isActive(l.url))} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
