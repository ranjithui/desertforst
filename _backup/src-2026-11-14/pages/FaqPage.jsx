import { useEffect, useState } from 'react';
import { ChevronDown, Mail, MessageCircle, Phone, Search } from 'lucide-react';
import { pages } from '../lib/data';

function Item({ faq }) {
  const [open, setOpen] = useState(false);
  const id = `faq_${faq.id}`;
  return (
    <div className="border-b border-pastel-sand/70 last:border-b-0">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)} className="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-4 text-left font-sans text-[15px] font-semibold text-cocoa transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset md:px-6">
          <span>{faq.question}</span>
          <ChevronDown className={`mt-0.5 h-5 w-5 shrink-0 text-accent transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
        </button>
      </h3>
      <div id={id} hidden={!open} className="px-5 pb-5 md:px-6 animate-in fade-in duration-200">
        <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-cocoa/75">{faq.answer}</p>
      </div>
    </div>
  );
}

/** /faq — searchable, grouped accordion. */
export default function FaqPage() {
  const { page, faqs } = pages.faq;
  const [q, setQ] = useState('');
  useEffect(() => { document.title = 'FAQ | Desert Forest'; }, []);
  const term = q.trim().toLowerCase();
  const hits = faqs.filter(f => !term || `${f.question} ${f.answer}`.toLowerCase().includes(term));
  const groups = [...new Set(hits.map(f => f.category))];

  return (
    <div className="bg-cream/40">
      <header className="border-b border-pastel-sand/60 bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 md:py-20 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-cocoa md:text-4xl">{page.heading}</h1>
          <p className="mt-3 font-sans text-base text-accent-strong md:text-lg">{page.subheading}</p>
          <p className="mt-5 font-sans text-sm leading-relaxed text-cocoa/75 md:text-base">{page.intro}</p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-light" />
          <input type="search" placeholder="Search the questions" aria-label="Search the questions" value={q} onChange={e => setQ(e.target.value)} className="h-12 w-full rounded-full border border-pastel-sand bg-white pl-11 pr-4 font-sans text-sm text-cocoa placeholder:text-cocoa-light focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25" />
        </div>
        <div className="mt-8 space-y-10">
          {groups.length === 0 && <p className="text-center font-sans text-sm text-cocoa-light">No questions match “{q}”.</p>}
          {groups.map(g => (
            <section key={g}>
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa-light">{g}</h2>
              <div className="mt-3 overflow-hidden rounded-2xl border border-pastel-sand/70 bg-white shadow-soft">
                {hits.filter(f => f.category === g).map(f => <Item key={f.id} faq={f} />)}
              </div>
            </section>
          ))}
        </div>
        <section className="mt-12 rounded-2xl bg-accent px-6 py-10 text-center md:mt-16 md:px-10">
          <h2 className="font-display text-xl font-semibold text-cream md:text-2xl">{page.cta_heading}</h2>
          <p className="mx-auto mt-2 max-w-xl font-sans text-sm text-white/85 md:text-base">{page.cta_text}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={page.cta_url} target="_blank" rel="noopener noreferrer" className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-cream px-6 py-3 font-sans text-sm font-semibold text-accent transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-accent">
              <MessageCircle className="h-4 w-4" />{page.cta_label}
            </a>
            <a href={`tel:${page.cta_phone.replace(/\s/g, '')}`} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cream/50 px-6 py-3 font-sans text-sm font-semibold text-cream transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-accent">
              <Phone className="h-4 w-4" />{page.cta_phone}
            </a>
            <a href={`mailto:${page.cta_email}`} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cream/50 px-6 py-3 font-sans text-sm font-semibold text-cream transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-accent">
              <Mail className="h-4 w-4" />{page.cta_email}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
