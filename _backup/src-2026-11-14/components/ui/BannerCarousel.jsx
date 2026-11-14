import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SmartLink from './SmartLink';

/**
 * Scroll-snap banner carousel (hero + promo strips). Autoplays, pauses on hover,
 * supports swipe (native scroll), arrows and dots. Desktop/mobile art via <picture>;
 * an HD layer fades in over the first slide once loaded, as on the original.
 */
export default function BannerCarousel({ banners, label, aspect = 'aspect-[16/9] md:aspect-[4/1]', className = '', interval = 5000 }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hdLoaded, setHdLoaded] = useState({});
  const count = banners.length;

  const goTo = useCallback(i => {
    const el = track.current;
    if (!el) return;
    const n = (i + count) % count;
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  }, [count]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setInterval(() => goTo(index + 1), interval);
    return () => clearInterval(t);
  }, [count, paused, index, goTo, interval]);

  return (
    <section
      className={`group/banner relative z-10 w-full overflow-hidden rounded-2xl bg-cream-soft shadow-soft md:rounded-3xl ${className}`}
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={track} className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide">
        {banners.map((b, i) => (
          <div key={b.id} role="group" aria-roledescription="slide" aria-label={`Slide ${i + 1} of ${count}`} className="relative w-full min-w-full shrink-0 snap-center">
            <SmartLink to={b.link_url} className="block cursor-pointer" aria-label={b.alt_text || `Banner ${i + 1}`}>
              <div className={`relative overflow-hidden ${aspect}`}>
                <picture>
                  {b.mobile_image_url && <source media="(max-width: 767px)" srcSet={b.mobile_image_url} />}
                  <img src={b.image_url} alt={b.alt_text || ''} className="block h-full w-full object-cover object-center" loading={i === 0 ? 'eager' : 'lazy'} fetchpriority={i === 0 ? 'high' : 'auto'} />
                </picture>
                {i === 0 && b.image_url_hd && (
                  <img
                    src={b.image_url_hd}
                    alt=""
                    aria-hidden="true"
                    onLoad={() => setHdLoaded(s => ({ ...s, [b.id]: true }))}
                    className={`absolute inset-0 hidden h-full w-full object-cover transition-opacity duration-200 motion-reduce:transition-none md:block ${hdLoaded[b.id] ? 'opacity-100' : 'opacity-0'}`}
                  />
                )}
              </div>
            </SmartLink>
          </div>
        ))}
      </div>
      {count > 1 && (
        <>
          <button type="button" aria-label="Previous banner" onClick={() => goTo(index - 1)} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white text-cocoa shadow-soft cursor-pointer opacity-0 transition-[opacity,background-color] duration-200 group-hover/banner:opacity-100 focus-visible:opacity-100 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Next banner" onClick={() => goTo(index + 1)} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white text-cocoa shadow-soft cursor-pointer opacity-0 transition-[opacity,background-color] duration-200 group-hover/banner:opacity-100 focus-visible:opacity-100 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-2 md:bottom-3 left-0 right-0 flex justify-center">
            <div className="flex items-center rounded-full bg-black/25 px-1 backdrop-blur-sm">
              {banners.map((b, i) => (
                <button key={b.id} type="button" aria-label={`Go to banner ${i + 1}`} aria-current={i === index} onClick={() => goTo(i)} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full">
                  <span className={`block h-1.5 rounded-full transition-all duration-200 ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/55'}`} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
