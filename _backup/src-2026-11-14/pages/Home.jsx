import { Link } from 'react-router-dom';
import { iconFor } from '../lib/icons';
import { ArrowRight, ChevronRight, Quote, Star } from 'lucide-react';
import { home } from '../lib/data';
import BannerCarousel from '../components/ui/BannerCarousel';
import SmartLink from '../components/ui/SmartLink';
import { Reveal, Scallop, SectionHeading } from '../components/ui/Section';
import MenuProductCard from '../components/product/MenuProductCard';

function Stats() {
  return (
    <Reveal className="relative z-10 mx-auto mt-5 max-w-4xl px-4 sm:px-6 md:mt-8">
      <div className="grid grid-cols-2 gap-y-4 rounded-[20px] bg-white px-3 py-5 shadow-soft md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-[rgba(72,45,24,0.10)] md:rounded-full md:px-4 md:py-5">
        {home.homeStats.map((s, i) => {
          const Icon = iconFor(s.icon);
          return (
            <Reveal key={s.id} delay={80 * i} y={10} className="group flex flex-col items-center px-2 text-center md:px-4">
              <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(75,85,62,0.10)] text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white md:h-10 md:w-10" aria-hidden="true">
                <Icon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
              </span>
              <p className="font-display text-lg font-semibold leading-none tabular-nums text-cocoa md:text-2xl">{s.count_text}</p>
              <p className="mt-1.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-cocoa-light">{s.label}</p>
            </Reveal>
          );
        })}
      </div>
    </Reveal>
  );
}

export function CategoryTiles({ tiles, eyebrow = 'Our collection', title = 'Shop by category', subtitle, cols = 'grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-6 md:gap-3 lg:gap-5' }) {
  return (
    <section className="relative mt-10 md:mt-14" aria-labelledby="categories-heading">
      <Scallop edge="top" />
      <div className="bg-accent-soft py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end gap-4 md:mb-8 flex-col items-center text-center">
            <div>
              {eyebrow && <span className="mb-2 block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-accent md:text-xs">{eyebrow}</span>}
              <h2 id="categories-heading" className="font-display text-2xl font-semibold leading-tight text-cocoa md:text-4xl">{title}</h2>
            </div>
          </div>
          {subtitle && <p className="-mt-3 mb-6 text-center font-sans text-sm text-cocoa-light md:-mt-5 md:mb-8 md:text-base">{subtitle}</p>}
          <ul className={cols} role="list">
            {tiles.map(t => (
              <li key={t.id}>
                <SmartLink to={t.link} className="group flex h-full w-full cursor-pointer flex-col items-center rounded-3xl p-1.5 text-center ring-1 ring-transparent transition-[background-color,box-shadow] duration-300 hover:bg-[rgba(255,255,255,0.28)] hover:ring-[rgba(255,255,255,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:p-2.5">
                  <span className="block w-full rounded-[22px] bg-white p-1.5 shadow-[0_6px_18px_-8px_rgba(72,45,24,0.35)] transition-shadow duration-300 group-hover:shadow-[0_14px_28px_-10px_rgba(72,45,24,0.45)] md:p-2">
                    <span className="block aspect-square w-full overflow-hidden rounded-2xl bg-cream">
                      {t.image_url && <img src={t.image_url} alt="" className="h-full w-full object-cover transition-transform duration-500 ease-intent group-hover:scale-[1.05] motion-reduce:transform-none" loading="lazy" />}
                    </span>
                  </span>
                  <span className="mt-2.5 block font-display text-[13px] font-semibold leading-snug text-cocoa sm:text-sm md:mt-3 md:text-base lg:text-lg">{t.label}</span>
                  <span className="mt-2 hidden h-9 items-center gap-1 rounded-full bg-white px-4 font-sans text-sm font-medium text-cocoa shadow-soft transition-colors duration-300 group-hover:bg-accent group-hover:text-cream sm:inline-flex">
                    Explore
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Scallop edge="bottom" />
    </section>
  );
}

function Favourites() {
  return (
    <div className="mt-10 md:mt-14">
      <section className="relative z-10 pb-6 md:pb-8" aria-labelledby="favourites-heading">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading id="favourites-heading" eyebrow="Bestsellers" title="Coimbatore's Favourites">
            <Link className="group shrink-0 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded" to="/products">
              View All
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </SectionHeading>
          <ul className="flex snap-x snap-mandatory gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {home.featured.map(p => (
              <li key={p.id} className="snap-start shrink-0 w-[13rem] sm:w-[15rem] lg:w-[16.5rem]">
                <MenuProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Testimonials() {
  if (!home.testimonials.length) return null;
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 md:mt-16" aria-labelledby="testimonials-heading">
      <SectionHeading id="testimonials-heading" eyebrow="Testimonials" title="What our customers say" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {home.testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 90}>
            <SmartLink to={t.link_url} className="relative flex h-full flex-col rounded-2xl bg-white p-5 shadow-soft transition-shadow duration-200 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:p-6 cursor-pointer" aria-label={`Google review by ${t.name}`}>
              <Quote className="absolute right-5 top-5 h-8 w-8 text-accent-soft" aria-hidden="true" />
              <div className="mb-3 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }, (_, k) => <Star key={k} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />)}
              </div>
              <blockquote className="mb-5 font-sans text-sm leading-relaxed text-cocoa-muted md:text-base">“{t.quote}”</blockquote>
              <footer className="mt-auto flex items-center gap-3 border-t border-[color:var(--line)] pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-semibold text-cocoa" aria-hidden="true">{t.name[0]}</span>
                <span className="font-sans text-sm font-semibold text-cocoa">{t.name}</span>
              </footer>
            </SmartLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function CtaBand({ cta = home.homeCta }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 mb-10 md:mb-16">
      <div className="flex flex-col gap-5 rounded-3xl bg-accent px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-10 md:px-12 md:py-10">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-cream md:text-3xl">{cta.heading}</h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-[#E7E0D5] md:text-base">{cta.subheading}</p>
        </div>
        <SmartLink to={cta.cta_url} className="group inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-cream px-7 font-sans text-sm font-semibold text-accent transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-accent max-md:w-full md:text-base">
          {cta.cta_text}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </SmartLink>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative overflow-x-hidden bg-cream pb-4">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
        <BannerCarousel banners={home.heroBanners} label="Highlights" />
      </div>
      <Stats />
      <CategoryTiles tiles={home.categoryTiles} />
      <Favourites />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
        <BannerCarousel banners={home.promoBanners} label="Offers" aspect="aspect-[3/1] md:aspect-[6/1]" className="my-4 md:my-6" />
      </div>
      <Testimonials />
      <CtaBand />
    </div>
  );
}
