import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { menu } from '../lib/data';
import { VegMark, WhatsAppIcon } from '../components/ui/Icons';
import MenuProductCard, { Tags, useOrder } from '../components/product/MenuProductCard';

// Anchor ids match the original (#cakes, #hot-&-fresh-bites …).
const anchor = g => (g.slug === 'deserts-and-pastries' ? g.slug : g.name.toLowerCase().replace(/\s+/g, '-'));
const SUBTITLES = { cakes: "Celebrate life's sweet moments with our handcrafted cakes." };

function MobileRow({ product }) {
  const { order } = useOrder(product);
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="flex flex-row gap-4 py-5 first:pt-0">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {product.is_veg !== false && <VegMark />}
          <h3 className="font-display font-semibold text-cocoa text-lg leading-tight">{product.name}</h3>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1"><Tags product={product} /></div>
        {product.description && (
          <button type="button" aria-expanded={expanded} aria-label={`Read the full description of ${product.name}`} onClick={() => setExpanded(e => !e)} className={`mt-1.5 w-full rounded text-left font-sans text-sm leading-relaxed text-cocoa-light cursor-pointer [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${expanded ? '' : 'line-clamp-2'}`}>
            {product.description}
          </button>
        )}
      </div>
      <div className="shrink-0 w-28">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-pastel-sand/30 shadow-soft">
          <img src={product.image_url} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="relative -mt-5 flex justify-center">
          <button type="button" aria-label={`Order ${product.name} on WhatsApp`} onClick={order} className={`flex h-11 items-center justify-center rounded-full border border-accent bg-cream text-accent shadow-soft transition-colors duration-200 cursor-pointer [touch-action:manipulation] hover:bg-accent hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 w-11`}>
            <WhatsAppIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuSection({ group, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = anchor(group);
  return (
    <section id={id} className="scroll-mt-[calc(var(--site-header)+4.5rem)]">
      <button type="button" aria-expanded={open} aria-label={`${open ? 'Collapse' : 'Expand'} ${group.name}`} onClick={() => setOpen(o => !o)} className="mb-6 flex w-full flex-row items-center justify-between border-l-4 border-accent pl-4 py-2 sm:pl-6 text-left rounded-r-lg cursor-pointer hover:bg-pastel-sand/20 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
        <div className="flex-1 min-w-0 pr-4">
          <h2 className="font-display text-2xl font-bold text-cocoa mb-1 sm:text-3xl md:font-semibold">{group.name}</h2>
          <p className="font-sans text-cocoa-light font-light text-base">{SUBTITLES[group.slug] || group.name}</p>
        </div>
        <span className="p-2 -mr-2 rounded-lg shrink-0" aria-hidden="true">
          {open ? <ChevronUp className="w-6 h-6 text-cocoa" /> : <ChevronDown className="w-6 h-6 text-cocoa" />}
        </span>
      </button>
      <div className="md:hidden grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="min-h-0">
          <div className="space-y-0 divide-y divide-pastel-sand/50">
            {group.products.map(p => <MobileRow key={p.id} product={p} />)}
          </div>
        </div>
      </div>
      <div className="hidden md:grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="min-h-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {group.products.map(p => <MenuProductCard key={p.id} product={p} showDescription />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/** /products — "Our Menu": sticky category tabs with scroll-spy and collapsible sections. */
export default function MenuPage() {
  const [active, setActive] = useState(anchor(menu[0]));
  const tabsRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const els = menu.map(g => document.getElementById(anchor(g))).filter(Boolean);
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-180px 0px -55% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    const check = () => setCanScroll(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);

  useEffect(() => {
    const tab = tabsRef.current?.querySelector(`[data-tab="${CSS.escape(active)}"]`);
    tab?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  return (
    <div className="min-h-screen bg-bakery-bg">
      <div className="pt-10 pb-16 px-4 sm:px-6 text-center bg-pastel-sand/30 border-b border-pastel-sand/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-cocoa mb-4">Our Menu</h1>
          <p className="font-sans text-lg md:text-xl text-cocoa-light font-light">Handcrafted delights, made fresh every morning.</p>
        </div>
      </div>
      <div className="sticky top-[var(--site-header)] transition-[top] duration-300 ease-intent z-30 panel border-b border-pastel-sand/50 py-2 overflow-hidden">
        <div className="relative">
          <div ref={tabsRef} className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex flex-nowrap gap-1.5 px-4 w-max mx-auto">
              {menu.map(g => {
                const id = anchor(g);
                return (
                  <a key={g.slug} data-tab={id} href={`#${id}`} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setActive(id); }} className={`font-sans text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-accent hover:text-cream hover:shadow-soft whitespace-nowrap cursor-pointer ${active === id ? 'bg-accent text-cream' : 'text-cocoa-light'}`}>
                    {g.name}
                  </a>
                );
              })}
            </div>
          </div>
          {canScroll && (
            <>
              <div className="absolute right-0 inset-y-0 w-14 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
              <button type="button" aria-label="Scroll categories right" onClick={() => tabsRef.current.scrollBy({ left: 240, behavior: 'smooth' })} className="absolute right-0 inset-y-0 z-20 flex items-center justify-center w-9 text-cocoa hover:text-accent transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16 space-y-8 md:space-y-12">
        {menu.map((g, i) => <MenuSection key={g.slug} group={g} defaultOpen={i === 0} />)}
      </div>
    </div>
  );
}
