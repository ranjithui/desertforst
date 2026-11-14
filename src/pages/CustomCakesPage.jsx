import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import rows from '../data/customCakeRows.json';
import { cakes } from '../lib/data';
import { WhatsAppIcon } from '../components/ui/Icons';

const WHATSAPP = 'https://wa.cheerio.in/ZPuNyI';

function Tile({ cake, hidden }) {
  return (
    <li className="shrink-0" aria-hidden={hidden || undefined} inert={hidden ? '' : undefined}>
      <Link className="group/tile relative block w-[33.333cqw] cursor-pointer p-1.5 focus-visible:outline-none" to={`/cakes/${cake.slug}`} tabIndex={hidden ? -1 : undefined}>
        <span className="relative block aspect-square overflow-hidden rounded-xl bg-pastel-sand shadow-soft ring-accent ring-offset-2 ring-offset-cream transition-shadow duration-300 group-hover/tile:shadow-hover group-focus-visible/tile:ring-2">
          <img src={cake.image_url} alt={cake.name} loading="lazy" draggable="false" className="h-full w-full object-cover transition-transform duration-500 ease-intent group-hover/tile:scale-105 motion-reduce:transform-none" />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-3 pb-2.5 pt-8 font-sans text-xs font-medium leading-snug text-white opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100">
            <span className="line-clamp-2">{cake.name}</span>
          </span>
        </span>
      </Link>
    </li>
  );
}

/** /custom-cakes — three counter-scrolling marquees of past designs + WhatsApp CTA. */
export default function CustomCakesPage() {
  useEffect(() => { document.title = 'Custom Cakes | Desert Forest'; }, []);
  return (
    <div className="bg-cream">
      <section className="container grid items-center gap-10 py-10 md:py-16 lg:gap-16 lg:py-20 lg:grid-cols-2">
        <div className="group -mx-1.5 space-y-0 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]" aria-label="Some of our custom cakes" role="region">
          {rows.map((row, r) => {
            const list = row.map(s => cakes[s]).filter(Boolean);
            return (
              <div key={r} className="overflow-hidden [container-type:inline-size]">
                <ul style={{ '--marquee-duration': '100s' }} className={`flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none ${r === 1 ? '[animation-direction:reverse]' : ''}`}>
                  {list.map(c => <Tile key={c.slug} cake={c} />)}
                  {list.map(c => <Tile key={`${c.slug}-dup`} cake={c} hidden />)}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="lg:pl-4">
          <p className="animate-slide-up font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent [animation-fill-mode:both] motion-reduce:animate-none">Custom cakes</p>
          <h1 className="mt-4 animate-slide-up font-display text-4xl font-semibold leading-[1.1] text-cocoa text-balance [animation-delay:80ms] [animation-fill-mode:both] motion-reduce:animate-none md:text-5xl xl:text-6xl">Your cake, your way.</h1>
          <p className="mt-5 max-w-xl animate-slide-up font-sans text-lg leading-relaxed text-cocoa-muted [animation-delay:160ms] [animation-fill-mode:both] motion-reduce:animate-none">Tell us the occasion and the idea. We design it, bake it fresh and have it ready on the day.</p>
          <div className="mt-9 flex animate-slide-up [animation-delay:240ms] [animation-fill-mode:both] motion-reduce:animate-none">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="group/btn inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-full border border-[rgba(75,85,62,0.25)] bg-white pl-2.5 pr-7 font-sans text-base font-semibold text-cocoa transition-colors duration-200 hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
                <span aria-hidden="true" className="absolute inset-0 animate-[ping_1.4s_cubic-bezier(0,0,0.2,1)_600ms_2_both] rounded-full bg-[#25D366]/60 motion-reduce:hidden" />
                <WhatsAppIcon className="relative h-5 w-5 transition-transform duration-300 group-hover/btn:rotate-[-12deg] motion-reduce:transform-none" />
              </span>
              Chat on WhatsApp<span className="sr-only">(opens WhatsApp)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
