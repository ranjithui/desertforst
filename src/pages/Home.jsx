import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Bean, Cake, CakeSlice, ChefHat, Crown, Dessert, Flame, Gift, Heart, Leaf, MapPin,
  Palette, PartyPopper, PenLine, Pause, Play, ShieldCheck, ShoppingCart, Star, Truck,
} from 'lucide-react';
import { home } from '../lib/data';
import SmartLink from '../components/ui/SmartLink';
import { Reveal } from '../components/ui/Section';
import { WhatsAppIcon } from '../components/ui/Icons';
import { useOrder } from '../components/product/MenuProductCard';
import { variantsOf } from '../components/product/ProductOptionsDialog';

const UP = '/media/ksbakers/uploads/';

/* ---------------- Hero ---------------- */

// Version 2: the hero is a looping background film. The poster (a still of a chocolate
// glaze cake) shows while it loads, and stays when motion is reduced or data saving is on.
const HERO_VIDEO = '/media/ksbakers/video/cake%20shop%20video2.mp4';
const HERO_POSTER = `${UP}b9fbf741-4114-4fea-b8f3-c58cca5ef5b7.jpg`;

function Hero() {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  // Autoplay unless the visitor prefers reduced motion or has data saving on.
  const [autoplay] = useState(() =>
    typeof window !== 'undefined'
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    && !navigator.connection?.saveData);

  // Pause while the hero is scrolled out of view to save battery; resume on return.
  useEffect(() => {
    const v = ref.current;
    if (!v || !autoplay) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.15 });
    io.observe(v);
    return () => io.disconnect();
  }, [autoplay, userPaused]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { setUserPaused(false); v.play().catch(() => {}); }
    else { setUserPaused(true); v.pause(); }
  };

  return (
    <section className="hm-vhero" aria-labelledby="hero-heading">
      <video
        ref={ref}
        className="hm-vhero__video"
        src={HERO_VIDEO}
        poster={HERO_POSTER}
        muted
        loop
        playsInline
        autoPlay={autoplay}
        preload={autoplay ? 'auto' : 'metadata'}
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="hm-vhero__shade" aria-hidden="true" />
      <div className="m-wrap hm-vhero__inner">
        <div className="hm-vhero__copy m-rise">
          <span className="hm-kicker hm-vhero__kicker">Freshly baked</span>
          <h1 id="hero-heading" className="hm-vhero__title">
            Cakes for Every <em>Celebration</em>
          </h1>
          <p className="hm-vhero__lead">Handcrafted cakes, fresh pastries and custom creations for life&apos;s special moments.</p>
          <div className="hm-vhero__ctas">
            <Link to="/birthday-cakes" className="hm-btn hm-btn--solid">Shop Cakes <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/custom-cakes" className="hm-btn hm-btn--glass"><CakeSlice className="h-4 w-4" /> Custom Cake</Link>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="hm-vhero__toggle"
        onClick={toggle}
        aria-label={playing ? 'Pause background video' : 'Play background video'}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
    </section>
  );
}

/* ---------------- Quick categories ---------------- */

/** Two interlocked rings (lucide has no ring icon). */
function RingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="14.5" r="5.5" />
      <circle cx="15" cy="14.5" r="5.5" />
      <path d="M7.5 6.5 9 4.5h3l1.5 2L10.5 9z" />
    </svg>
  );
}

const CATEGORIES = [
  { label: 'Birthday', to: '/birthday-cakes', Icon: Cake },
  { label: 'Anniversary', to: '/anniversary-cakes', Icon: RingsIcon },
  { label: 'Themed Cakes', to: '/theme-cakes', Icon: PartyPopper },
  { label: 'Chocolate', to: '/search?q=chocolate', Icon: Bean },
  { label: 'Corporate', to: '/corporate-orders', Icon: Gift },
  { label: 'Our Specials', to: '/products', Icon: Dessert },
];

function QuickCategories() {
  return (
    <nav className="m-wrap hp-cats-wrap" aria-label="Shop by occasion">
      <ul className="hp-cats" role="list">
        {CATEGORIES.map(({ label, to, Icon }) => (
          <li key={label}>
            <Link to={to} className="hp-cat">
              <Icon className="hp-cat__icon" strokeWidth={1.4} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Sprig className="hp-cats__sprig" />
    </nav>
  );
}

/** Thin golden leafy sprig used as decoration around sections. */
function Sprig({ className = '', flip = false }) {
  return (
    <svg className={`hp-sprig ${className}${flip ? ' is-flip' : ''}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path d="M8 112 C 40 84, 70 56, 112 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {[[30, 92, 20], [48, 76, -30], [62, 60, 25], [80, 44, -35], [94, 28, 15]].map(([x, y, r], i) => (
        <path key={i} d="M0 0 C 6 -14, 26 -16, 34 -4 C 22 4, 8 6, 0 0 Z" transform={`translate(${x} ${y}) rotate(${r - 45})`} stroke="currentColor" strokeWidth="1.1" />
      ))}
    </svg>
  );
}

/* ---------------- Bestsellers ---------------- */

// Cake photos cropped from the design mockup (scripts/crop-design.mjs). Products without one
// fall back to a circular crop of their studio photo.
const DESIGN = '/media/ksbakers/design/';
const DESIGN_CAKES = {
  'butterscotch-cake-eggless': `${DESIGN}bestseller-butterscotch.webp`,
  'black-forest-cake-eggless': `${DESIGN}bestseller-black-forest.webp`,
  'almond-delight-cake-eggless': `${DESIGN}bestseller-almond-delight.webp`,
  'choco-truffle-cake-eggless': `${DESIGN}bestseller-choco-truffle.webp`,
};

// Badge text/icon and the tint at the top of each arch, cycling like the reference.
const BEST_THEMES = [
  { badge: 'Bestseller', Icon: Star, tone: 'caramel', tint: '#f6dcc0' },
  { badge: 'New', Icon: null, tone: 'rose', tint: '#f7d5dc' },
  { badge: 'Popular', Icon: Flame, tone: 'orange', tint: '#f8e2b5' },
  { badge: 'Bestseller', Icon: Crown, tone: 'violet', tint: '#e5dbf5' },
];

/** Laurel sprig (drawn once, mirrored for the right side). */
function Laurel({ flip }) {
  return (
    <svg className={`hm-best__laurel${flip ? ' is-flip' : ''}`} viewBox="0 0 40 80" fill="currentColor" aria-hidden="true">
      <path d="M30 78 C 14 62, 10 40, 18 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {[[22, 10, -30], [17, 22, -48], [14, 35, -60], [13, 48, -72], [16, 61, -84]].map(([x, y, r]) => (
        <g key={y}>
          <ellipse cx={x - 6} cy={y} rx="7.5" ry="3.2" transform={`rotate(${r} ${x - 6} ${y})`} />
          <ellipse cx={x + 6} cy={y + 4} rx="7" ry="3" transform={`rotate(${r + 70} ${x + 6} ${y + 4})`} />
        </g>
      ))}
    </svg>
  );
}

/** Wishlist ids kept in localStorage so the heart buttons remember their state. */
function useWishlist() {
  const [ids, setIds] = useState(() => { try { return JSON.parse(localStorage.getItem('ksb.wishlist')) || []; } catch { return []; } });
  useEffect(() => localStorage.setItem('ksb.wishlist', JSON.stringify(ids)), [ids]);
  const toggle = id => setIds(list => (list.includes(id) ? list.filter(x => x !== id) : [...list, id]));
  return [ids, toggle];
}

function BestsellerCard({ product, index, saved, onSave }) {
  const { order } = useOrder(product);
  const variants = variantsOf(product);
  const from = Math.min(...variants.map(v => v.price_city));
  const first = variants.find(v => v.price_city === from);
  const was = first?.compare_at_price_city > from ? first.compare_at_price_city : 0;
  const theme = BEST_THEMES[index % BEST_THEMES.length];
  const badge = product.custom_tag || theme.badge;
  const [name, note] = product.name.split(' - ').map(s => s.trim());
  const sizes = variants.length > 1 ? variants.map(v => v.variant_name).join(' • ') : 'Freshly baked';
  const BadgeIcon = theme.Icon;

  return (
    <article className={`hm-best-card hm-best-card--${theme.tone}`} style={{ '--tint': theme.tint }}>
      <button type="button" className="hm-best-card__stage" onClick={order} aria-label={`${product.name} — open options`}>
        <span className="hm-best-card__badge">
          {BadgeIcon && <BadgeIcon className="h-3 w-3" fill="currentColor" strokeWidth={1.5} aria-hidden="true" />}
          {badge}
        </span>
        {DESIGN_CAKES[product.slug] ? (
          <img className="hm-best-card__photo" src={DESIGN_CAKES[product.slug]} alt="" loading="lazy" />
        ) : (
          <>
            <span className="hm-best-card__plate" aria-hidden="true" />
            {/* Studio shots are top-down on a dark table; a soft circular crop keeps just the cake. */}
            <span className="hm-best-card__cake"><img src={product.image_url} alt="" loading="lazy" /></span>
          </>
        )}
      </button>
      <div className="hm-best-card__info">
        <h3>{name}{note && <><br /><span>({note})</span></>}</h3>
        <p className="hm-best-card__sizes">{sizes}</p>
        <p className="hm-best-card__price">
          <strong>₹{from}</strong>
          {was > 0 && <s><span className="sr-only">was </span>₹{was}</s>}
        </p>
        <div className="hm-best-card__actions">
          <button type="button" className="hm-best-card__add" onClick={order}>
            <WhatsAppIcon className="h-4 w-4" /> Order Now
            <span className="sr-only">: {product.name} on WhatsApp</span>
          </button>
          <button
            type="button"
            className={`hm-best-card__fav${saved ? ' is-on' : ''}`}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            onClick={() => onSave(product.id)}
          >
            <Heart className="h-4 w-4" strokeWidth={1.8} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Bestsellers() {
  const [saved, toggleSaved] = useWishlist();
  return (
    <section className="hm-best" aria-labelledby="best-heading">
      <Sprig className="hm-best__sprig" flip />
      <div className="m-wrap">
        <header className="hm-best__head">
          <Crown className="hm-best__icon" fill="currentColor" strokeWidth={1.2} aria-hidden="true" />
          <span className="hm-best__eyebrow">Desert Forest</span>
          <div className="hm-best__title-row">
            <Laurel />
            <h2 id="best-heading" className="hm-best__title">Bestsellers</h2>
            <Laurel flip />
          </div>
          <p className="hm-best__sub">Our most loved cakes, baked fresh every day.</p>
          <Link to="/products" className="hm-best__all">View All Cakes <ArrowRight className="h-4 w-4" /></Link>
        </header>
        <ul className="hm-best__row" role="list">
          {home.featured.map((p, n) => (
            <li key={p.id}><BestsellerCard product={p} index={n} saved={saved.includes(p.id)} onSave={toggleSaved} /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Promise strip ---------------- */

const PROMISES = [
  { Icon: Leaf, text: ['Premium', 'Ingredients'] },
  { Icon: ChefHat, text: ['Freshly Baked', 'Every Day'] },
  { Icon: Truck, text: ['Same-day', 'Delivery*'] },
  { Icon: ShieldCheck, text: ['100%', 'Hygienic & Safe'] },
];

function PromiseStrip() {
  return (
    <section className="m-wrap" aria-label="Our promise">
      <ul className="hp-promise" role="list">
        {PROMISES.map(({ Icon, text }) => (
          <li key={text[0]}>
            <Icon className="hp-promise__icon" strokeWidth={1.3} aria-hidden="true" />
            <span>{text[0]}<br />{text[1]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- Custom cake banner ---------------- */

const CUSTOM_FEATURES = [
  { Icon: PenLine, label: 'Any Design' },
  { Icon: Palette, label: 'Personalised Themes' },
  { Icon: Gift, label: 'For All Occasions' },
  { Icon: Heart, label: 'Made Fresh by Our Team' },
];

function CustomBanner() {
  return (
    <section className="m-wrap hp-section" aria-labelledby="custom-heading">
      <Reveal className="hp-custom">
        <div className="hp-custom__art" aria-hidden="true">
          <img src={`${DESIGN}custom-floral-cake.webp`} alt="" loading="lazy" />
        </div>
        <div className="hp-custom__copy">
          <span className="hp-eyebrow">Custom creations</span>
          <h2 id="custom-heading" className="hp-h2">Design Your<br /><em>Dream Cake</em></h2>
          <p>Bring your ideas to life with our custom cakes, themed &amp; occasion cakes.</p>
          <Link to="/custom-cakes" className="hp-btn-outline">Create Your Cake <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <ul className="hp-custom__list" role="list">
          {CUSTOM_FEATURES.map(({ Icon, label }) => (
            <li key={label}><Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" /> {label}</li>
          ))}
        </ul>
        <Sprig className="hp-custom__sprig" flip />
      </Reveal>
    </section>
  );
}

/* ---------------- How it works ---------------- */

const STEPS = [
  { Icon: ShoppingCart, title: 'Choose Your Cake', text: 'Browse our collection and pick your favorite.' },
  { Icon: PenLine, title: 'Customize (Optional)', text: 'Add a message, design or flavor.' },
  { Icon: Truck, title: 'Get It Delivered', text: 'Receive a fresh, handcrafted cake at your doorstep.' },
];

function HowItWorks() {
  return (
    <section className="m-wrap hp-section" aria-labelledby="how-heading">
      <h2 id="how-heading" className="hp-ruled">How It Works</h2>
      <ol className="hp-steps">
        {STEPS.map(({ Icon, title, text }, n) => (
          <Reveal as="li" key={title} delay={n * 90} className="hp-step">
            <span className="hp-step__icon"><Icon className="h-7 w-7" strokeWidth={1.4} aria-hidden="true" /></span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
            {n < STEPS.length - 1 && <ArrowRight className="hp-step__arrow" strokeWidth={1.4} aria-hidden="true" />}
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ---------------- Stores banner ---------------- */

function StoresBanner() {
  return (
    <section className="m-wrap hp-section" aria-labelledby="stores-heading">
      <Reveal className="hp-stores">
        <img className="hp-stores__art" src={`${DESIGN}stores-brownies.webp`} alt="" loading="lazy" aria-hidden="true" />
        <div className="hp-stores__copy">
          <MapPin className="hp-stores__pin" strokeWidth={1.4} aria-hidden="true" />
          <div>
            <h2 id="stores-heading">Visit Our Stores<br />in Coimbatore</h2>
            <p>Experience our fresh bakes, desserts and more in person.</p>
            <Link to="/stores" className="hp-btn-white">Find a Store <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <Sprig className="hp-stores__sprig" flip />
      </Reveal>
    </section>
  );
}

/* ---------------- Shared exports used by other pages ---------------- */

/** Grid of category tiles; used by the Gifting page. */
export function CategoryTiles({ tiles, eyebrow = 'Our collection', title = 'Shop by category', subtitle }) {
  return (
    <section className="m-section" aria-labelledby="categories-heading">
      <div className="m-wrap">
        <div className="m-section-head">
          <div>
            {eyebrow && <span className="m-eyebrow">{eyebrow}</span>}
            <h2 id="categories-heading" className="m-h2 mt-3">{title}</h2>
          </div>
          {subtitle && <p className="m-lead">{subtitle}</p>}
        </div>
        <ul className="m-bento" role="list">
          {tiles.map((t, n) => (
            <Reveal as="li" key={t.id} delay={60 * n}>
              <SmartLink to={t.link} className="m-tile h-full">
                {t.image_url && <img src={t.image_url} alt="" loading="lazy" />}
                <div className="m-tile__body">
                  <div>
                    <small>{String(n + 1).padStart(2, '0')}</small>
                    <h3>{t.label}</h3>
                  </div>
                  <span className="m-tile__arrow" aria-hidden="true"><ArrowUpRight className="h-5 w-5" /></span>
                </div>
              </SmartLink>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CtaBand({ cta = home.homeCta }) {
  return (
    <section className="m-wrap">
      <div className="m-cta">
        <div>
          <span className="m-eyebrow m-eyebrow--light">Corporate &amp; gifting</span>
          <h2 className="mt-4">{cta.heading}</h2>
          <p>{cta.subheading}</p>
        </div>
        <SmartLink to={cta.cta_url} className="m-btn m-btn--light">
          {cta.cta_text} <ArrowRight className="h-4 w-4" />
        </SmartLink>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="hm relative overflow-x-hidden">
      <Hero />
      <QuickCategories />
      <Bestsellers />
      <PromiseStrip />
      <CustomBanner />
      <HowItWorks />
      <StoresBanner />
    </div>
  );
}
