import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Search, User, X } from 'lucide-react';
import { cakeNav } from '../../lib/data';
import SearchBox from './SearchBox';
import MobileMenu from './MobileMenu';

const cat = slug => cakeNav.find(c => c.slug === slug);

/** Top-level navigation. `match` lists the path prefixes that mark an item active. */
const NAV = [
  { label: 'Home', to: '/', match: ['/'] },
  {
    label: 'Cakes', to: '/birthday-cakes', match: ['/birthday-cakes', '/theme-cakes', '/anniversary-cakes', '/cakes'],
    items: [
      ...['birthday-cakes', 'theme-cakes', 'anniversary-cakes', 'occasion-cakes'].map(s => cat(s)).filter(Boolean).map(c => ({ label: c.name, to: `/${c.slug}` })),
      { label: 'Customised Cakes', to: '/custom-cakes' },
    ],
  },
  { label: 'Menu', to: '/products', match: ['/products'] },
  {
    label: 'Occasions', to: '/occasion-cakes', match: ['/occasion-cakes'],
    items: (cat('occasion-cakes')?.children || []).map(c => ({ label: c.name, to: `/occasion-cakes/${c.slug}` })),
  },
  {
    label: 'Gifting', to: '/gifting', match: ['/gifting', '/corporate-orders'],
    items: [{ label: 'Hampers', to: '/gifting/hampers' }, { label: 'Corporate Orders', to: '/corporate-orders' }],
  },
  { label: 'About', to: '/about', match: ['/about'] },
];

/**
 * White sticky header: logo, centred nav with dropdowns, icon actions on the right.
 * `--site-header` is kept in sync for sticky children (filters, scroll padding).
 */
export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => document.documentElement.style.setProperty('--site-header', `${el.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => ref.current?.querySelector('.hd-search input')?.focus(), 30);
    const onKey = e => e.key === 'Escape' && setSearchOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, [searchOpen]);

  const isActive = item => item.match.some(m => (m === '/' ? pathname === '/' : pathname === m || pathname.startsWith(m + '/')));

  return (
    <>
      <div ref={ref} className={`hd ${scrolled ? 'is-scrolled' : ''}`}>
        <header className="m-wrap hd__bar">
          <Link className="hd__logo" aria-label="Desert Forest — Home" to="/">
            <img src="/desert-forest-logo.svg" alt="Desert Forest" />
          </Link>

          <nav className="hd__nav" aria-label="Main">
            <ul role="list">
              {NAV.map(item => (
                <li key={item.label} className="hd__item">
                  <Link className={`hd__link ${isActive(item) ? 'is-active' : ''}`} to={item.to}>
                    {item.label}
                    {item.items?.length > 0 && <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />}
                  </Link>
                  {item.items?.length > 0 && (
                    <div className="hd__drop">
                      <ul role="list" aria-label={item.label}>
                        {item.items.map(sub => (
                          <li key={sub.to}><Link to={sub.to}>{sub.label}</Link></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hd__actions">
            <button type="button" className="hd__icon" aria-label={searchOpen ? 'Close search' : 'Search cakes'} aria-expanded={searchOpen} onClick={() => setSearchOpen(o => !o)}>
              {searchOpen ? <X className="h-[22px] w-[22px]" /> : <Search className="h-[22px] w-[22px]" />}
            </button>
            <Link to="/login" aria-label="Login" className="hd__icon m-only-desktop">
              <User className="h-[22px] w-[22px]" />
            </Link>
            <button type="button" className="hd__icon m-only-mobile" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>
        {searchOpen && (
          <div className="hd-search">
            <div className="m-wrap"><SearchBox /></div>
          </div>
        )}
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
