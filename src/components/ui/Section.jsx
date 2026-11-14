import { useEffect, useRef, useState } from 'react';

/** Eyebrow + heading block used by every home section. */
export function SectionHeading({ id, eyebrow, title, center = false, children }) {
  return (
    <div className={`mb-6 flex items-end gap-4 md:mb-8 ${center ? 'flex-col items-center text-center' : 'justify-between'}`}>
      <div>
        {eyebrow && <span className="mb-2 block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-accent md:text-xs">{eyebrow}</span>}
        <h2 id={id} className="font-display text-2xl font-semibold leading-tight text-cocoa md:text-4xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/** Scalloped edge (row of half-circles) framing the sand-coloured bands. */
export function Scallop({ edge = 'top' }) {
  return (
    <div
      aria-hidden="true"
      className="h-[13px] w-full"
      style={{
        backgroundImage: `radial-gradient(circle at 50% ${edge === 'top' ? '100%' : '0%'}, var(--accent-soft) 12.5px, transparent 13px)`,
        backgroundSize: '26px 13px',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center',
      }}
    />
  );
}

/** Fade/slide-up on first entry into the viewport (the original uses framer-motion whileInView). */
export function Reveal({ as: Tag = 'div', delay = 0, y = 16, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setShown(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity 480ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 480ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
