import { useEffect } from 'react';
import { Star } from 'lucide-react';
import { pages } from '../lib/data';
import { iconFor } from '../lib/icons';
import { Reveal } from '../components/ui/Section';

/** /about — Our Story, mission, values, strengths, leadership and press. */
export default function AboutPage() {
  const { content: c, values, strengths, team, press } = pages.about;
  const [lead, ...rest] = team;
  const hasTeam = team.length > 0;
  useEffect(() => { document.title = 'Our Story | Desert Forest'; }, []);

  return (
    <div className="min-h-screen bg-bakery-bg">
      <Reveal className="pt-28 pb-12 px-4 sm:px-6 text-center max-w-4xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" style={{ opacity: 0.08 }}>
          <Star className="w-56 h-56 text-accent" />
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-semibold text-cocoa mb-6">{c.story_heading}</h1>
        <p className="font-sans text-xl md:text-2xl text-cocoa-light font-light leading-relaxed">{c.story_subheading}</p>
      </Reveal>

      <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 mb-14 md:mb-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-cocoa mb-8">{c.story_tagline}</h2>
        <div className="space-y-6 font-sans text-base md:text-lg leading-relaxed text-cocoa-light font-light">
          {c.story_body.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Reveal>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-14 md:mb-20">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {[[c.vision_label, c.vision_text], [c.mission_label, c.mission_text]].map(([h, t], i) => (
            <Reveal as="article" key={h} delay={i * 100} className="panel rounded-2xl shadow-soft px-6 py-6 md:px-8 md:py-7">
              <h2 className="font-display text-xl md:text-2xl font-semibold text-cocoa mb-2.5">{h}</h2>
              <p className="font-sans text-cocoa-light text-base leading-relaxed font-light">{t}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <section className="py-14 md:py-20 px-4 sm:px-6 relative overflow-hidden" aria-labelledby="values-heading">
        <div className="max-w-6xl mx-auto">
          <h2 id="values-heading" className="font-display text-3xl md:text-4xl font-semibold text-cocoa mb-12 text-center">{c.values_heading}</h2>
          <div className="rounded-[2rem] md:rounded-full shadow-soft-lg p-6 md:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6 bg-white/60 backdrop-blur-md border border-cocoa/5">
            {values.map((v, i) => {
              const Icon = iconFor(v.icon);
              return (
                <div key={v.id} className={`text-center group ${i === values.length - 1 && values.length % 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-cocoa mb-3 transition-colors duration-300 group-hover:bg-accent-soft group-hover:text-cocoa">
                    <Icon className="w-7 h-7" />
                  </div>
                  <p className="font-sans text-lg font-bold text-cocoa transition-colors duration-300 group-hover:text-accent">{v.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="py-14 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="font-sans text-accent font-medium tracking-[0.2em] uppercase text-xs mb-2 block">{c.strengths_eyebrow}</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-cocoa">{c.strengths_heading}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {strengths.map((s, i) => {
            const Icon = iconFor(s.icon);
            return (
              <Reveal as="article" key={s.title} delay={(i % 3) * 90} className="panel rounded-2xl shadow-soft p-8 md:p-10 text-center group transition-shadow duration-300 hover:shadow-hover">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 mx-auto text-accent group-hover:bg-accent-soft group-hover:text-cocoa transition-colors duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-cocoa mb-4">{s.title}</h3>
                <p className="font-sans text-cocoa-light leading-relaxed font-light">{s.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="py-14 md:py-20 px-4 sm:px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          {hasTeam && (<>
          <div className="text-center mb-12 md:mb-14 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-cocoa mb-4">{c.team_heading}</h2>
            <p className="font-sans text-cocoa-light text-base md:text-lg leading-relaxed font-light">{c.team_subheading}</p>
          </div>
          <div className="mb-16 md:mb-20 space-y-14 md:space-y-16">
            <Reveal as="article" className="panel rounded-2xl shadow-soft-lg overflow-hidden md:grid md:grid-cols-2 md:items-stretch">
              <div className="relative aspect-[4/5] sm:aspect-[5/6] md:aspect-auto md:h-full md:min-h-[28rem] bg-cream overflow-hidden">
                <img alt={`${lead.title}, ${lead.subtitle}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[center_12%]" src={lead.image_url} />
              </div>
              <div className="p-7 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center">
                <p className="font-sans text-accent font-medium tracking-[0.18em] uppercase text-[11px] md:text-xs mb-3">{lead.subtitle}</p>
                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-cocoa mb-5">{lead.title}</h3>
                <span className="block w-12 h-px bg-accent/50 mb-5" aria-hidden="true" />
                <p className="font-sans text-base md:text-lg text-cocoa-light leading-relaxed font-light">{lead.description}</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {rest.map((m, i) => (
                <Reveal as="article" key={m.id} delay={(i % 3) * 80} className="panel rounded-2xl shadow-soft overflow-hidden group transition-shadow duration-intent ease-intent hover:shadow-hover">
                  <div className="relative aspect-[4/5] overflow-hidden bg-pastel-sand/50">
                    <img alt={`${m.title}, ${m.subtitle}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[center_12%] transition-transform duration-intent-slow ease-intent motion-reduce:transition-none group-hover:scale-[1.03]" src={m.image_url} />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="font-display text-lg md:text-xl font-semibold text-cocoa">{m.title}</h3>
                    <p className="mt-1.5 font-sans text-xs md:text-sm font-medium text-accent leading-snug">{m.subtitle}</p>
                    <p className="mt-3 font-sans text-sm text-cocoa-light leading-relaxed font-light">{m.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          </>)}

          {press.length > 0 && (<section className="mb-14 md:mb-16 max-w-4xl mx-auto" aria-labelledby="press-heading">
            <h2 id="press-heading" className="font-sans text-accent font-medium tracking-[0.2em] uppercase text-xs mb-9 md:mb-10">{c.press_heading}</h2>
            <ul className="space-y-6" role="list">
              {press.map(p => (
                <li key={p.id}>
                  <p className="font-sans text-base md:text-lg leading-snug text-cocoa">
                    <a href={p.link_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-cocoa/30 cursor-pointer transition-colors duration-200 hover:text-accent hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm">{p.title}</a>
                  </p>
                  <p className="mt-1 font-sans text-sm md:text-base text-cocoa-light font-light">— {p.subtitle}</p>
                </li>
              ))}
            </ul>
          </section>)}

          <div className="mt-14 pt-8 border-t border-pastel-sand/60 max-w-md mx-auto text-center">
            <p className="font-display text-2xl md:text-3xl italic text-accent">{c.team_quote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
