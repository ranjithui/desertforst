import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CakeSlice, ChevronRight, Search, X } from 'lucide-react';
import { searchCakes, searchFlavours, cakesWithFlavour, subName } from '../../lib/search';

function Highlight({ text, q }) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (!q || i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-semibold text-cocoa">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

const rowCls = active =>
  `mx-1.5 flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-150 ${active ? 'bg-cream' : 'hover:bg-cream'}`;

/** Header search with live flavour + cake suggestions (keyboard navigable). */
export default function SearchBox() {
  const id = useId();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef(null);
  const term = q.trim();

  const { flavourHits, cakeHits, total } = useMemo(() => {
    if (term.length < 2) return { flavourHits: [], cakeHits: [], total: 0 };
    const all = searchCakes(term);
    return { flavourHits: searchFlavours(term).slice(0, 3), cakeHits: all.slice(0, 6), total: all.length };
  }, [term]);

  const options = [
    ...flavourHits.map(f => ({ href: `/search?flavour=${f.slug}` })),
    ...cakeHits.map(c => ({ href: `/cakes/${c.slug}` })),
  ];
  const show = open && term.length >= 2;

  useEffect(() => {
    const onDoc = e => { if (!boxRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  useEffect(() => setActive(-1), [term]);

  const go = href => { setOpen(false); setQ(''); nav(href); };

  const onKey = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(a => Math.min(a + 1, options.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, -1)); }
    else if (e.key === 'Escape') setOpen(false);
  };
  const onSubmit = e => {
    e.preventDefault();
    if (active >= 0 && options[active]) return go(options[active].href);
    if (term) go(`/search?q=${encodeURIComponent(term)}`);
  };

  let idx = -1;
  return (
    <form role="search" className="group relative" onSubmit={onSubmit} ref={boxRef}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-cocoa-light transition-colors duration-200 group-focus-within:text-accent" aria-hidden="true" />
      <input
        type="search"
        enterKeyHint="search"
        placeholder="Search for cakes"
        aria-label="Search cakes"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={show}
        aria-controls={id}
        autoComplete="off"
        spellCheck="false"
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        className="h-11 w-full appearance-none rounded-full border border-[color:var(--line)] bg-[rgba(240,236,230,0.6)] pl-11 pr-11 font-sans text-[15px] text-cocoa placeholder:text-[rgba(138,111,87,0.8)] transition-[background-color,border-color,box-shadow] duration-200 hover:border-accent-soft focus:border-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-[rgba(75,85,62,0.1)] [&::-webkit-search-cancel-button]:hidden"
      />
      {q && (
        <button type="button" aria-label="Clear search" onClick={() => setQ('')} className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-cocoa-light transition-colors duration-200 hover:bg-cream hover:text-cocoa">
          <X className="h-4 w-4" />
        </button>
      )}
      {show && (
        <div className="absolute inset-x-0 top-full z-[60] mt-2 origin-top animate-in fade-in slide-in-from-top-1 overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white shadow-[0_18px_48px_-12px_rgba(72,45,24,0.28)] duration-150 motion-reduce:animate-none">
          <div id={id} role="listbox" aria-label="Search suggestions" className="max-h-[min(30rem,60vh)] overflow-y-auto overscroll-contain pb-1.5">
            {!flavourHits.length && !cakeHits.length && (
              <p className="px-4 py-6 text-center font-sans text-sm text-cocoa-light">No cakes match “{term}”. Try another flavour or theme.</p>
            )}
            {!!flavourHits.length && (
              <div role="group" aria-label="Flavours">
                <p className="sticky top-0 z-10 border-b border-[color:var(--line)] bg-white px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cocoa-light">Flavours</p>
                <div className="py-1.5">
                  {flavourHits.map(f => {
                    const i = ++idx;
                    return (
                      <div key={f.id} role="option" aria-selected={active === i}>
                        <Link tabIndex={-1} className={rowCls(active === i)} to={`/search?flavour=${f.slug}`} onClick={() => setOpen(false)}>
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cream text-accent"><CakeSlice className="h-[18px] w-[18px]" /></span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-sans text-sm text-cocoa-muted"><Highlight text={f.name} q={term} /></span>
                            <span className="mt-0.5 block truncate font-sans text-xs text-cocoa-light">Flavour</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1 font-sans text-xs text-cocoa-light">{cakesWithFlavour(f.id).length} cakes<ChevronRight className="h-4 w-4" /></span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {!!cakeHits.length && (
              <div role="group" aria-label={`Cakes · ${total}`}>
                <p className="sticky top-0 z-10 border-b border-[color:var(--line)] bg-white px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cocoa-light">Cakes · {total}</p>
                <div className="py-1.5">
                  {cakeHits.map(c => {
                    const i = ++idx;
                    return (
                      <div key={c.slug} role="option" aria-selected={active === i}>
                        <Link tabIndex={-1} className={rowCls(active === i)} to={`/cakes/${c.slug}`} onClick={() => setOpen(false)}>
                          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-pastel-sand"><img src={c.image_url} alt="" loading="lazy" className="h-full w-full object-cover" /></span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-sans text-sm text-cocoa-muted"><Highlight text={c.name} q={term} /></span>
                            <span className="mt-0.5 block truncate font-sans text-xs text-cocoa-light">{c.sku} · {subName(c)}</span>
                          </span>
                          <span className="shrink-0 text-right font-sans">
                            <span className="block text-[10px] uppercase tracking-wide text-cocoa-light">from</span>
                            <span className="block text-sm font-semibold tabular-nums text-accent">₹{c.from_price}</span>
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {total > 0 && (
            <Link className="group/all flex cursor-pointer items-center justify-between border-t border-[color:var(--line)] bg-[rgba(240,236,230,0.4)] px-4 py-3 font-sans text-sm font-semibold text-accent transition-colors duration-200 hover:bg-cream focus-visible:bg-cream focus-visible:outline-none" to={`/search?q=${encodeURIComponent(term)}`} onClick={() => setOpen(false)}>
              See all {total} cakes for “{term}”
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/all:translate-x-0.5" />
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
