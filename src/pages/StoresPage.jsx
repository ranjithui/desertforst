import { useEffect, useState } from 'react';
import { ArrowUpRight, Clock, MapPin, Phone, Search } from 'lucide-react';
import { pages } from '../lib/data';

/** /stores — "Locate Us" with live outlet search. */
export default function StoresPage() {
  const { page, outlets } = pages.stores;
  const [q, setQ] = useState('');
  useEffect(() => { document.title = 'Locate Us | Desert Forest'; }, []);
  const term = q.trim().toLowerCase();
  const list = outlets.filter(o => !term || `${o.name} ${o.address}`.toLowerCase().includes(term));

  return (
    <div className="bg-cream/40">
      <header className="border-b border-pastel-sand/60 bg-cream">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 md:py-20 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-cocoa md:text-4xl">{page.heading}</h1>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-base text-accent-strong md:text-lg">{page.subheading}</p>
          <p className="mx-auto mt-5 max-w-3xl font-sans text-sm leading-relaxed text-cocoa/75 md:text-base">{page.intro}</p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-semibold text-cocoa md:text-2xl">{page.list_heading}</h2>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-light" />
            <input type="search" placeholder="Search by area" aria-label="Search outlets by name or area" value={q} onChange={e => setQ(e.target.value)} className="h-11 w-full rounded-full border border-pastel-sand bg-white pl-10 pr-4 font-sans text-sm text-cocoa placeholder:text-cocoa-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25" />
          </div>
        </div>
        <p className="mt-3 font-sans text-sm text-cocoa-light" aria-live="polite">{list.length} {list.length === 1 ? 'outlet' : 'outlets'}</p>
        {list.length === 0 && (
          <p className="mt-6 rounded-2xl border border-pastel-sand/70 bg-white p-8 text-center font-sans text-sm text-cocoa-light">No outlets match “{q}”. Try another area name.</p>
        )}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:gap-6">
          {list.map(o => (
            <article key={o.id} className="flex h-full flex-col rounded-2xl border border-pastel-sand/70 bg-white p-6 shadow-soft transition-shadow duration-200 hover:shadow-hover">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="font-display text-lg font-semibold text-cocoa">{o.name}</h3>
                {o.opened_year && <span className="rounded-full bg-cream px-2.5 py-1 font-sans text-[11px] font-semibold tabular-nums text-cocoa-light">Since {o.opened_year}</span>}
              </div>
              {o.description && <p className="mt-3 font-sans text-sm leading-relaxed text-cocoa/70">{o.description}</p>}
              <div className="mt-5 space-y-2.5 border-t border-pastel-sand/60 pt-5 font-sans">
                <p className="flex items-start gap-2.5 text-sm leading-relaxed text-cocoa/75"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{o.address}</span></p>
                <p className="flex items-start gap-2.5 text-sm leading-relaxed text-cocoa/75"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{o.hours}</span></p>
                <p className="flex items-start gap-2.5 text-sm leading-relaxed text-cocoa/75">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="-my-2.5 inline-block rounded py-2.5 transition-colors duration-200 hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">{o.phone}</a>
                </p>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <a href={o.directions_url} target="_blank" rel="noopener noreferrer" className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-sans text-sm font-semibold text-cream transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
                  Get directions<ArrowUpRight className="h-4 w-4" />
                </a>
                {o.fssai_no && <span className="font-sans text-[11px] tabular-nums text-cocoa-light">FSSAI {o.fssai_no}</span>}
              </div>
            </article>
          ))}
        </div>
        <section className="mt-12 rounded-2xl bg-accent px-6 py-10 text-center md:mt-16 md:px-10">
          <h2 className="font-display text-xl font-semibold text-cream md:text-2xl">{page.cta_heading}</h2>
          <p className="mx-auto mt-2 max-w-xl font-sans text-sm text-white/85 md:text-base">{page.cta_text}</p>
          <a href={page.cta_url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex cursor-pointer items-center rounded-full bg-cream px-6 py-3 font-sans text-sm font-semibold text-accent transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-accent">{page.cta_label}</a>
        </section>
      </div>
    </div>
  );
}
