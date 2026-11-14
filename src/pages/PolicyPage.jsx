import { useEffect } from 'react';
import policies from '../data/policies.json';

function Block({ b }) {
  if (b.type === 'ul') {
    return (
      <ul className="list-disc space-y-2 pl-5 text-cocoa/80">
        {b.items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    );
  }
  if (b.type === 'h3') return <h3 className="font-display text-lg font-semibold text-cocoa mt-6 mb-2">{b.text}</h3>;
  return <p className="text-cocoa/80 leading-relaxed">{b.text}</p>;
}

/** Privacy policy, terms and refund policy share this layout. */
export default function PolicyPage({ slug }) {
  const p = policies[slug];
  useEffect(() => { document.title = `${p.title} | Desert Forest`; }, [p]);
  return (
    <div className="min-h-screen bg-bakery-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <header className="mb-10 border-b border-cocoa/10 pb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-cocoa">{p.title}</h1>
          {p.updated && <p className="mt-3 text-sm text-cocoa/60">Last updated: {p.updated}</p>}
          {p.intro.length > 0 && (
            <div className="mt-6">
              <div className="space-y-4">{p.intro.map((b, i) => <Block key={i} b={b} />)}</div>
            </div>
          )}
        </header>
        <div className="space-y-10">
          {p.sections.map(s => (
            <section key={s.heading}>
              <h2 className="font-display text-xl md:text-2xl font-semibold text-cocoa mb-3">{s.heading}</h2>
              <div className="space-y-4">{s.blocks.map((b, i) => <Block key={i} b={b} />)}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
